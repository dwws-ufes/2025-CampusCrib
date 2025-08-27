import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface UniversitySearchResult {
  city: CityInfo;
  universities: UniversityInfo[];
  rawSparqlData: any;
  generatedRdf: string;
  sparqlQuery: string;
  searchExecutedAt: string;
}

export interface CityInfo {
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  dbpediaUri: string;
}

export interface UniversityInfo {
  name: string;
  foundingYear?: number;
  dbpediaUri: string;
  type: 'University' | 'College';
}

export interface SparqlBinding {
  type: string;
  value: string;
  'xml:lang'?: string;
}

export interface SparqlResult {
  head: { vars: string[] };
  results: {
    bindings: { [key: string]: SparqlBinding }[];
  };
}

export interface SparqlProxyResponse {
  data: SparqlResult;
  metadata: {
    endpoint: string;
    format: string;
    executionTime: number;
    resultSize: number;
    timestamp: string;
    cached: boolean;
  };
}

export interface CribsData {
  turtleContent: string;
}

@Injectable({
  providedIn: 'root'
})
export class SemanticUniversityService {
  private readonly SPARQL_PROXY_URL = 'http://localhost:3001/api/sparql';
  private readonly PUBLISHER_URL = 'http://localhost:3001/api/publish';
 
  private readonly searchCache = new Map<string, UniversitySearchResult>();

  constructor(private http: HttpClient) {}

  searchUniversitiesInCity(cityName: string): Observable<UniversitySearchResult> {
    const cacheKey = cityName.toLowerCase().trim();
    if (this.searchCache.has(cacheKey)) {
      return of(this.searchCache.get(cacheKey)!);
    }

    return this.executeCombinedSearch(cityName).pipe(
      map(([cityResponse, universityResponse]) => 
        this.parseCombinedSearchResponse(cityName, cityResponse, universityResponse))
    );
  }

  private executeCombinedSearch(cityName: string): Observable<[any, any]> {
    return forkJoin([
      this.executeCityInfoSearch(cityName),
      this.executeUniversitySearch(cityName)
    ]);
  }

  private executeCityInfoSearch(cityName: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.SPARQL_PROXY_URL}/city-info/${encodeURIComponent(cityName)}`, { headers });
  }

  private executeUniversitySearch(cityName: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.SPARQL_PROXY_URL}/universities/${encodeURIComponent(cityName)}`, { headers });
  }



  private parseCombinedSearchResponse(
    cityName: string,
    cityResponse: any,
    universityResponse: any
  ): UniversitySearchResult {
    const cityBindings = cityResponse.data.results.bindings;
    const universityBindings = universityResponse.data.results.bindings;
    const cityQuery = cityResponse.query;
    const universityQuery = universityResponse.query;
    
    let city: CityInfo;
    if (cityBindings.length > 0) {
      const cityBinding = cityBindings[0];
      city = {
        name: cityBinding['label']?.value || cityName,
        description: cityBinding['abstract']?.value || `Information about ${cityName}`,
        coordinates: {
          lat: parseFloat(cityBinding['lat']?.value || '0'),
          lng: parseFloat(cityBinding['long']?.value || '0')
        },
        dbpediaUri: `http://dbpedia.org/resource/${this.formatCityNameForDBpedia(cityName)}`
      };
    } else {
      city = {
        name: cityName,
        description: `No detailed information found for ${cityName}`,
        coordinates: { lat: 0, lng: 0 },
        dbpediaUri: `http://dbpedia.org/resource/${this.formatCityNameForDBpedia(cityName)}`
      };
    }

    const universitiesMap = new Map<string, UniversityInfo>();
    
    interface UniversityBinding {
      university?: SparqlBinding;
      label?: SparqlBinding;
      foundingYear?: SparqlBinding;
      [key: string]: SparqlBinding | undefined;
    }

    universityBindings.forEach((binding: UniversityBinding) => {
      if (binding['university'] && binding['label']) {
        const uri: string = binding['university'].value;
        if (!universitiesMap.has(uri)) {
          universitiesMap.set(uri, {
            name: binding['label'].value,
            foundingYear: undefined,
            dbpediaUri: uri,
            type: uri.includes('University') ? 'University' : 'College'
          });
        }
      }
    });

    const result: UniversitySearchResult = {
      city,
      universities: Array.from(universitiesMap.values()),
      rawSparqlData: {
        cityInfo: cityResponse.data,
        universities: universityResponse.data
      },
      sparqlQuery: `City Info Query:\n${cityQuery}\n\nUniversity Query:\n${universityQuery}`,
      generatedRdf: '',
      searchExecutedAt: new Date().toISOString()
    };

    result.generatedRdf = this.generateCombinedRdf(result);

    this.searchCache.set(cityName.toLowerCase().trim(), result);

    return result;
  }



  private generateCombinedRdf(result: UniversitySearchResult): string {
    const cityUri = result.city.dbpediaUri;
    const searchUri = `https://campuscrib.com/search/${Date.now()}`;
    
    let rdf = `@prefix cc: <https://campuscrib.com/ontology#> .
@prefix dbo: <http://dbpedia.org/ontology/> .
@prefix schema: <http://schema.org/> .
@prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# Search Result
<${searchUri}> a cc:UniversitySearchResult ;
    cc:searchedCity <${cityUri}> ;
    cc:executedAt "${result.searchExecutedAt}"^^xsd:dateTime ;
    cc:foundUniversityCount ${result.universities.length} .

# City Information
<${cityUri}> a schema:City, dbo:City ;
    rdfs:label "${result.city.name}" ;
    schema:name "${result.city.name}" ;
    schema:description "${result.city.description}" ;
    geo:lat ${result.city.coordinates.lat} ;
    geo:long ${result.city.coordinates.lng} .\n\n`;

    result.universities.forEach((university, index) => {
      rdf += `# University ${index + 1}
<${university.dbpediaUri}> a dbo:University, schema:CollegeOrUniversity ;
    rdfs:label "${university.name}" ;
    schema:name "${university.name}" ;
    dbo:city <${cityUri}> `;

      if (university.foundingYear) {
        rdf += `;
    dbp:established ${university.foundingYear} `;
      }

      rdf += `.\n\n`;

      rdf += `<${searchUri}> cc:foundUniversity <${university.dbpediaUri}> .\n\n`;
    });

    return rdf;
  }

  
  private formatCityNameForDBpedia(cityName: string): string {
    return cityName
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('_');
  }

  exportSearchResults(result: UniversitySearchResult, format: 'turtle' | 'jsonld' = 'turtle'): void {
    let content = '';
    let mimeType = '';
    let extension = '';

    if (format === 'turtle') {
      content = result.generatedRdf;
      mimeType = 'text/turtle';
      extension = 'ttl';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.city.name.replace(/\s+/g, '_')}_universities.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  }


  clearCache(): void {
    this.searchCache.clear();
  }

  
  getCachedResults(): string[] {
    return Array.from(this.searchCache.keys());
  }

  fetchCribsData(): Observable<CribsData> {
    const headers = new HttpHeaders({
      'Accept': 'text/turtle'
    });

    return this.http.get(`${this.PUBLISHER_URL}/data/cribs`, { 
      headers, 
      responseType: 'text' 
    }).pipe(
      map((turtleContent: string) => ({ turtleContent })),
      catchError(error => {
        console.error('Error fetching cribs data:', error);
        throw error;
      })
    );
  }
}