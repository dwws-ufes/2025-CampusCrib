import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class SemanticUniversityService {
  private readonly SPARQL_PROXY_URL = 'http://localhost:3001/api/sparql';
 
  private readonly searchCache = new Map<string, UniversitySearchResult>();

  constructor(private http: HttpClient) {}

  searchUniversitiesInCity(cityName: string): Observable<UniversitySearchResult> {
    const cacheKey = cityName.toLowerCase().trim();
    if (this.searchCache.has(cacheKey)) {
      return of(this.searchCache.get(cacheKey)!);
    }

    return this.executeUniversitySearch(cityName).pipe(
      map(response => this.parseUniversitySearchResponse(cityName, response))
    );
  }

  private executeUniversitySearch(cityName: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.SPARQL_PROXY_URL}/universities/${encodeURIComponent(cityName)}`, { headers });
  }



  private parseUniversitySearchResponse(
    cityName: string, 
    response: any
  ): UniversitySearchResult {
    const bindings = response.data.results.bindings;
    const query = response.query;
    
    if (bindings.length === 0) {
      return this.createEmptyResult(cityName, query);
    }

    const firstBinding = bindings[0];
    const city: CityInfo = {
      name: firstBinding['cityLabel']?.value || cityName,
      description: firstBinding['cityDescription']?.value || `Information about ${cityName}`,
      coordinates: {
        lat: parseFloat(firstBinding['cityLat']?.value || '0'),
        lng: parseFloat(firstBinding['cityLong']?.value || '0')
      },
      dbpediaUri: `http://dbpedia.org/resource/${this.formatCityNameForDBpedia(cityName)}`
    };

    const universitiesMap = new Map<string, UniversityInfo>();
    
    interface UniversityBinding {
      university?: SparqlBinding;
      label?: SparqlBinding;
      foundingYear?: SparqlBinding;
      [key: string]: SparqlBinding | undefined;
    }

    bindings.forEach((binding: UniversityBinding) => {
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
      rawSparqlData: response.data,
      sparqlQuery: query,
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

  private createEmptyResult(cityName: string, query: string): UniversitySearchResult {
    const city = {
      name: cityName,
      description: `No information found for ${cityName}`,
      coordinates: { lat: 0, lng: 0 },
      dbpediaUri: `http://dbpedia.org/resource/${this.formatCityNameForDBpedia(cityName)}`
    };
    
    const result: UniversitySearchResult = {
      city,
      universities: [],
      rawSparqlData: { empty: true },
      sparqlQuery: query,
      generatedRdf: '',
      searchExecutedAt: new Date().toISOString()
    };
    
    result.generatedRdf = this.generateCombinedRdf(result);
    return result;
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
}