const express = require('express');
const axios = require('axios');
const Joi = require('joi');
const router = express.Router();

const SPARQL_ENDPOINTS = {
  dbpedia: 'https://dbpedia.org/sparql',
  wikidata: 'https://query.wikidata.org/sparql'
};

const sparqlQuerySchema = Joi.object({
  query: Joi.string().required().min(10).max(50000),
  endpoint: Joi.string().valid('dbpedia', 'wikidata').default('dbpedia'),
  format: Joi.string().valid('json', 'xml', 'turtle', 'csv').default('json'),
  timeout: Joi.number().integer().min(1000).max(30000).default(10000)
});

const queryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; 

router.post('/query', async (req, res, next) => {
  try {
    
    const { error, value } = sparqlQuerySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(d => d.message)
      });
    }

    const { query, endpoint, format, timeout } = value;
    
    const cacheKey = `${endpoint}:${Buffer.from(query).toString('base64')}`;
    const cachedResult = queryCache.get(cacheKey);
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_TTL) {
      console.log('Cache hit for query');
      return res.json({
        ...cachedResult.data,
        cached: true,
        cacheTimestamp: cachedResult.timestamp
      });
    }

    const sparqlEndpoint = SPARQL_ENDPOINTS[endpoint];
    const headers = {
      'Accept': getAcceptHeader(format),
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = `query=${encodeURIComponent(query)}`;

    console.log(`Executing SPARQL query on ${endpoint}:`, query.substring(0, 100) + '...');

    const startTime = Date.now();
    const response = await axios.post(sparqlEndpoint, body, {
      headers,
      timeout,
      maxContentLength: 50 * 1024 * 1024, 
      validateStatus: (status) => status < 500 
    });

    const executionTime = Date.now() - startTime;

    if (response.status >= 400) {
      return res.status(response.status).json({
        error: 'SPARQL Query Error',
        message: 'The SPARQL endpoint returned an error',
        details: response.data,
        status: response.status
      });
    }

    const result = {
      data: response.data,
      metadata: {
        endpoint,
        format,
        executionTime,
        resultSize: JSON.stringify(response.data).length,
        timestamp: new Date().toISOString(),
        cached: false
      }
    };
    console.log('result', result);
    if (format === 'json' && response.data.results) {
      queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      if (queryCache.size > 100) {
        const oldestKey = queryCache.keys().next().value;
        queryCache.delete(oldestKey);
      }
    }

    res.json(result);

  } catch (error) {
    console.error('SPARQL query error:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        error: 'Request Timeout',
        message: 'The SPARQL query took too long to execute'
      });
    }

    if (error.response) {
      return res.status(error.response.status || 500).json({
        error: 'SPARQL Endpoint Error',
        message: error.message,
        details: error.response.data
      });
    }

    next(error);
  }
});

router.get('/endpoints', (req, res) => {
  res.json({
    endpoints: Object.keys(SPARQL_ENDPOINTS).map(key => ({
      name: key,
      url: SPARQL_ENDPOINTS[key],
      description: getEndpointDescription(key)
    }))
  });
});

router.get('/cache/stats', (req, res) => {
  const cacheStats = {
    size: queryCache.size,
    entries: Array.from(queryCache.entries()).map(([key, value]) => ({
      key: key.substring(0, 50) + '...',
      timestamp: value.timestamp,
      age: Date.now() - value.timestamp
    }))
  };
  
  res.json(cacheStats);
});

router.delete('/cache', (req, res) => {
  queryCache.clear();
  res.json({ message: 'Cache cleared successfully' });
});

router.get('/universities/:cityName', async (req, res, next) => {
  try {
    const { cityName } = req.params;
    
    if (!cityName || cityName.trim().length < 2) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'City name must be at least 2 characters long'
      });
    }

    const query = buildUniversityQuery(cityName);
    const cacheKey = `universities:${cityName.toLowerCase()}`;
    const cachedResult = queryCache.get(cacheKey);
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_TTL) {
      console.log('Cache hit for university search');
      return res.json({
        ...cachedResult.data,
        cached: true,
        cacheTimestamp: cachedResult.timestamp
      });
    }

    const sparqlEndpoint = SPARQL_ENDPOINTS.dbpedia;
    const headers = {
      'Accept': 'application/sparql-results+json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = `query=${encodeURIComponent(query)}`;

    console.log(`Searching universities in ${cityName}`);

    const startTime = Date.now();
    const response = await axios.post(sparqlEndpoint, body, {
      headers,
      timeout: 15000,
      maxContentLength: 50 * 1024 * 1024,
      validateStatus: (status) => status < 500
    });

    const executionTime = Date.now() - startTime;

    if (response.status >= 400) {
      return res.status(response.status).json({
        error: 'SPARQL Query Error',
        message: 'The SPARQL endpoint returned an error',
        details: response.data,
        status: response.status
      });
    }

    const result = {
      data: response.data,
      query: query,
      cityName: cityName,
      metadata: {
        endpoint: 'dbpedia',
        format: 'json',
        executionTime,
        resultSize: JSON.stringify(response.data).length,
        timestamp: new Date().toISOString(),
        cached: false
      }
    };

    if (response.data.results) {
      queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      if (queryCache.size > 100) {
        const oldestKey = queryCache.keys().next().value;
        queryCache.delete(oldestKey);
      }
    }

    res.json(result);

  } catch (error) {
    console.error('University search error:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        error: 'Request Timeout',
        message: 'The university search took too long to execute'
      });
    }

    if (error.response) {
      return res.status(error.response.status || 500).json({
        error: 'SPARQL Endpoint Error',
        message: error.message,
        details: error.response.data
      });
    }

    next(error);
  }
});

function buildUniversityQuery(cityName) {
  const dbpediaCityName = formatCityNameForDBpedia(cityName);
  
  return `
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbp: <http://dbpedia.org/property/>

SELECT DISTINCT ?university ?label
WHERE {
  ?university a dbo:University ;
              rdfs:label ?label .

  {
    ?university dbo:city dbr:${dbpediaCityName}
  }
  UNION {
    ?university dbo:location dbr:${dbpediaCityName}
  }
  UNION {
    ?university dbp:city dbr:${dbpediaCityName}
  }
  UNION {
    ?university dbo:campus dbr:${dbpediaCityName}
  }

  FILTER (lang(?label) = "en")
}
ORDER BY ?label
  `.trim();
}

function formatCityNameForDBpedia(cityName) {
  return cityName
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('_');
}

function getAcceptHeader(format) {
  switch (format) {
    case 'json':
      return 'application/sparql-results+json';
    case 'xml':
      return 'application/sparql-results+xml';
    case 'turtle':
      return 'text/turtle';
    case 'csv':
      return 'text/csv';
    default:
      return 'application/sparql-results+json';
  }
}

function getEndpointDescription(endpoint) {
  switch (endpoint) {
    case 'dbpedia':
      return 'DBpedia SPARQL endpoint - Structured data from Wikipedia';
    case 'wikidata':
      return 'Wikidata SPARQL endpoint - Collaborative knowledge base';
    default:
      return 'Unknown endpoint';
  }
}

module.exports = router;
