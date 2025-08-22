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

@Injectable({
  providedIn: 'root'
})
export class SemanticUniversityService {
  private readonly DBPEDIA_ENDPOINT = 'https://dbpedia.org/sparql';
  private readonly PROXY_URL = 'https://cors-anywhere.herokuapp.com/'; // fix this
  private readonly DEMO_MODE = false; 
  private readonly searchCache = new Map<string, UniversitySearchResult>();

  constructor(private http: HttpClient) {}

  searchUniversitiesInCity(cityName: string): Observable<UniversitySearchResult> {
    const cacheKey = cityName.toLowerCase().trim();
    if (this.searchCache.has(cacheKey)) {
      return of(this.searchCache.get(cacheKey)!);
    }

    if (this.DEMO_MODE) {
      return this.getDemoUniversityData(cityName);
    }

    const query = this.buildSparqlQuery(cityName);
    return this.executeSparqlQuery(query).pipe(
      map(response => this.parseUniversitySearchResponse(cityName, query, response)),
      catchError(error => {
        console.error('SPARQL query failed, falling back to demo data:', error);
        return this.getDemoUniversityData(cityName);
      })
    );
  }

  
  private buildSparqlQuery(cityName: string): string {
    const dbpediaCityName = this.formatCityNameForDBpedia(cityName);
    
    return `
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX schema: <http://schema.org/>

SELECT DISTINCT
  ?cityLabel
  ?cityDescription
  ?cityLat
  ?cityLong
  ?universityName
  ?foundingYear
  ?university
WHERE {
  dbr:${dbpediaCityName} rdfs:label ?cityLabel .
  dbr:${dbpediaCityName} rdfs:comment ?cityDescription .
  dbr:${dbpediaCityName} geo:lat ?cityLat .
  dbr:${dbpediaCityName} geo:long ?cityLong .

  FILTER (langMatches(lang(?cityLabel), "EN"))
  FILTER (langMatches(lang(?cityDescription), "EN"))

  OPTIONAL {
    { ?university a dbo:University . }
    UNION
    { ?university a schema:CollegeOrUniversity . }

    { ?university dbo:city dbr:${dbpediaCityName} . }
    UNION
    { ?university dbo:campus dbr:${dbpediaCityName} . }

    ?university rdfs:label ?universityName .
    # Filter to ensure the university name is in English
    FILTER (langMatches(lang(?universityName), "EN"))

    OPTIONAL {
      ?university dbp:established ?foundingYear .
    }
  }
}
LIMIT 20
    `.trim();
  }

  private executeSparqlQuery(query: string): Observable<SparqlResult> {
    // go back to the processing of the SPARQL Query
    const endpoint = this.DEMO_MODE ? this.DBPEDIA_ENDPOINT : this.PROXY_URL + this.DBPEDIA_ENDPOINT;
    
    const headers = new HttpHeaders({
      'Accept': 'application/sparql-results+json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `query=${encodeURIComponent(query)}`;

    return this.http.post<SparqlResult>(endpoint, body, { headers });
  }

  private parseUniversitySearchResponse(
    cityName: string, 
    query: string, 
    response: SparqlResult
  ): UniversitySearchResult {
    const bindings = response.results.bindings;
    
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
    
    bindings.forEach(binding => {
      if (binding['university'] && binding['universityName']) {
        const uri = binding['university'].value;
        if (!universitiesMap.has(uri)) {
          universitiesMap.set(uri, {
            name: binding['universityName'].value,
            foundingYear: binding['foundingYear'] ? parseInt(binding['foundingYear'].value) : undefined,
            dbpediaUri: uri,
            type: uri.includes('University') ? 'University' : 'College'
          });
        }
      }
    });

    const result: UniversitySearchResult = {
      city,
      universities: Array.from(universitiesMap.values()),
      rawSparqlData: response,
      sparqlQuery: query,
      generatedRdf: '',
      searchExecutedAt: new Date().toISOString()
    };

    result.generatedRdf = this.generateCombinedRdf(result);

    this.searchCache.set(cityName.toLowerCase().trim(), result);

    return result;
  }

  private getDemoUniversityData(cityName: string): Observable<UniversitySearchResult> {
    const demoData = this.createDemoDataForCity(cityName);
    
    this.searchCache.set(cityName.toLowerCase().trim(), demoData);
    
    return of(demoData);
  }

  private createDemoDataForCity(cityName: string): UniversitySearchResult {
    const normalizedCity = cityName.toLowerCase().trim();
    
    let city: CityInfo;
    let universities: UniversityInfo[];

    if (normalizedCity.includes('vitória') || normalizedCity.includes('vitoria')) {
      city = {
        name: 'Vitória',
        description: 'Vitória is the capital of the state of Espírito Santo, Brazil, known for its port, beaches, and as an important economic center.',
        coordinates: { lat: -20.3155, lng: -40.3128 },
        dbpediaUri: 'http://dbpedia.org/resource/Vitória,_Espírito_Santo'
      };
      universities = [
        {
          name: 'Federal University of Espírito Santo',
          foundingYear: 1954,
          dbpediaUri: 'http://dbpedia.org/resource/Federal_University_of_Espírito_Santo',
          type: 'University'
        }
      ];
    } else if (normalizedCity.includes('aracruz')) {
      city = {
        name: 'Aracruz',
        description: 'Aracruz is a municipality in the state of Espírito Santo, Brazil, known for its eucalyptus plantations and industrial development.',
        coordinates: { lat: -19.8207, lng: -40.2734 },
        dbpediaUri: 'http://dbpedia.org/resource/Aracruz'
      };
      universities = [
        {
          name: 'Instituto Federal do Espírito Santo - Campus Aracruz',
          foundingYear: 2008,
          dbpediaUri: 'http://dbpedia.org/resource/Instituto_Federal_do_Espírito_Santo',
          type: 'College'
        }
      ];
    } else {
      city = {
        name: cityName,
        description: `${cityName} is a city with educational institutions and cultural significance.`,
        coordinates: { lat: -15.7801, lng: -47.9292 },
        dbpediaUri: `http://dbpedia.org/resource/${this.formatCityNameForDBpedia(cityName)}`
      };
      universities = [
        {
          name: `${cityName} State University`,
          foundingYear: 1990,
          dbpediaUri: `http://dbpedia.org/resource/${cityName}_State_University`,
          type: 'University'
        }
      ];
    }

    const query = this.buildSparqlQuery(cityName);
    const result: UniversitySearchResult = {
      city,
      universities,
      rawSparqlData: { demo: true },
      sparqlQuery: query,
      generatedRdf: '',
      searchExecutedAt: new Date().toISOString()
    };

    result.generatedRdf = this.generateCombinedRdf(result);
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
    return {
      city: {
        name: cityName,
        description: `No information found for ${cityName}`,
        coordinates: { lat: 0, lng: 0 },
        dbpediaUri: `http://dbpedia.org/resource/${this.formatCityNameForDBpedia(cityName)}`
      },
      universities: [],
      rawSparqlData: { empty: true },
      sparqlQuery: query,
      generatedRdf: '',
      searchExecutedAt: new Date().toISOString()
    };
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