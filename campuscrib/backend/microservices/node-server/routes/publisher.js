const express = require('express');
const router = express.Router();
const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

// Namespaces
const RDF     = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const RDFS    = 'http://www.w3.org/2000/01/rdf-schema#';
const SCHEMA  = 'http://schema.org/';
const GEO     = 'http://www.w3.org/2003/01/geo/wgs84_pos#';
const CC      = 'http://campuscrib.example.org/ontology#';

// URIs
const BASE_CRIB      = 'http://localhost:3000/campuscrib/data/crib/';
const BASE_LANDLORD  = 'http://localhost:3000/campuscrib/data/landlord/';

// Mocks
const mockCribs = [
  {
    id: '1',
    cribId: '1',
    title: 'Cozy Student Apartment Near Campus',
    description: 'Perfect for students! Walking distance to university with modern amenities.',
    price: 850,
    numRooms: 2,
    numBathrooms: 1,
    numPeopleAlreadyIn: 1,
    numAvailableVacancies: 1,
    acceptedGenders: 'ANY',
    petsPolicy: false,
    landlordId: '1',
    location: {
      street: '123 University Ave',
      city: 'College Town',
      state: 'CA',
      zipCode: '90210',
      latitude: 34.0522,
      longitude: -118.2437
    }
  },
  {
    id: '2',
    cribId: '2',
    title: 'Luxury Downtown Loft',
    description: 'Modern loft in the heart of downtown with great amenities and city views.',
    price: 1200,
    numRooms: 1,
    numBathrooms: 1,
    numPeopleAlreadyIn: 0,
    numAvailableVacancies: 1,
    acceptedGenders: 'FEMALE',
    petsPolicy: true,
    landlordId: '1',
    location: {
      street: '456 Main St',
      city: 'Downtown',
      state: 'CA',
      zipCode: '90211',
      latitude: 34.0525,
      longitude: -118.2440
    }
  },
  {
    id: '3',
    cribId: '3',
    title: 'Shared House with Garden',
    description: 'Beautiful house with private garden, perfect for nature lovers.',
    price: 650,
    numRooms: 3,
    numBathrooms: 2,
    numPeopleAlreadyIn: 2,
    numAvailableVacancies: 1,
    acceptedGenders: 'MALE',
    petsPolicy: true,
    landlordId: '2',
    location: {
      street: '789 Oak Street',
      city: 'Suburbia',
      state: 'CA',
      zipCode: '90212',
      latitude: 34.0530,
      longitude: -118.2445
    }
  }
];

const mockLandlords = [
  {
    id: '1',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@example.com',
    birthDate: '1985-06-15'
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Oliveira',
    email: 'maria@example.com',
    birthDate: '1990-09-22'
  }
];

// Constroi grafo em Turtle
async function buildCribsGraphTurtle(cribs) {
  const writer = new N3.Writer({
    prefixes: {
      cc: CC,
      schema: SCHEMA,
      geo: GEO,
      rdfs: RDFS,
      rdf: RDF
    }
  });

  for (const crib of cribs) {
    const s = namedNode(`${BASE_CRIB}${crib.id}`);

    // Tipo e label
    writer.addQuad(quad(s, namedNode(RDF + 'type'), namedNode(CC + 'Crib')));
    if (crib.title) {
      writer.addQuad(quad(s, namedNode(RDFS + 'label'), literal(crib.title)));
    }

    // Descrição e preço
    if (crib.description) {
      writer.addQuad(quad(s, namedNode(SCHEMA + 'description'), literal(crib.description)));
    }
    if (crib.price != null) {
      writer.addQuad(quad(s, namedNode(SCHEMA + 'price'), literal(crib.price)));
    }

    // Atributos do crib
    if (crib.numRooms != null) {
      writer.addQuad(quad(s, namedNode(CC + 'numRooms'), literal(crib.numRooms)));
    }
    if (crib.numBathrooms != null) {
      writer.addQuad(quad(s, namedNode(CC + 'numBathrooms'), literal(crib.numBathrooms)));
    }
    if (crib.numPeopleAlreadyIn != null) {
      writer.addQuad(quad(s, namedNode(CC + 'numPeopleAlreadyIn'), literal(crib.numPeopleAlreadyIn)));
    }
    if (crib.numAvailableVacancies != null) {
      writer.addQuad(quad(s, namedNode(CC + 'numAvailableVacancies'), literal(crib.numAvailableVacancies)));
    }
    if (crib.acceptedGenders) {
      writer.addQuad(quad(s, namedNode(CC + 'acceptedGenders'), literal(crib.acceptedGenders)));
    }
    if (typeof crib.petsPolicy === 'boolean') {
      writer.addQuad(quad(s, namedNode(CC + 'petsPolicy'), literal(crib.petsPolicy)));
    }

    if (crib.landlordId) {
        const landlordRes = namedNode(`${BASE_LANDLORD}${crib.landlordId}`);
        writer.addQuad(quad(s, namedNode(CC + 'landlord'), landlordRes));

        const landlord = mockLandlords.find(l => l.id === crib.landlordId);
        if (landlord) {
            writer.addQuad(quad(landlordRes, namedNode(RDF + 'type'), namedNode('http://xmlns.com/foaf/0.1/Person')));
            writer.addQuad(quad(landlordRes, namedNode('http://xmlns.com/foaf/0.1/firstName'), literal(landlord.firstName)));
            writer.addQuad(quad(landlordRes, namedNode('http://xmlns.com/foaf/0.1/lastName'), literal(landlord.lastName)));
            writer.addQuad(quad(landlordRes, namedNode('http://xmlns.com/foaf/0.1/mbox'), literal(landlord.email)));
            writer.addQuad(quad(landlordRes, namedNode('http://schema.org/birthDate'), literal(landlord.birthDate)));
        }
    }

    // Endereço e geoloc
    if (crib.location) {
      const loc = crib.location;
      if (loc.street) {
        writer.addQuad(quad(s, namedNode(SCHEMA + 'streetAddress'), literal(loc.street)));
      }
      if (loc.city) {
        writer.addQuad(quad(s, namedNode(SCHEMA + 'addressLocality'), literal(loc.city)));
      }
      if (loc.state) {
        writer.addQuad(quad(s, namedNode(SCHEMA + 'addressRegion'), literal(loc.state)));
      }
      if (loc.zipCode) {
        writer.addQuad(quad(s, namedNode(SCHEMA + 'postalCode'), literal(loc.zipCode)));
      }
      if (loc.latitude != null) {
        writer.addQuad(quad(s, namedNode(GEO + 'lat'), literal(loc.latitude)));
      }
      if (loc.longitude != null) {
        writer.addQuad(quad(s, namedNode(GEO + 'long'), literal(loc.longitude)));
      }
    }
  }

  return new Promise((resolve, reject) => {
    writer.end((err, ttl) => (err ? reject(err) : resolve(ttl)));
  });
}

// rota para todos os cribs
router.get('/data/cribs', async (_req, res) => {
  try {
    const ttl = await buildCribsGraphTurtle(mockCribs);
    res.type('text/turtle').status(200).send(ttl);
  } catch (e) {
    console.error(e);
    res.status(500).send('Erro ao gerar RDF (Turtle)');
  }
});

// rota para crib especificado pelo id
router.get('/data/cribs/:id', async (req, res) => {
  try {
    const crib = mockCribs.find(c => c.id === req.params.id);
    if (!crib) {
      return res.status(404).send('Crib não encontrado');
    }
    const ttl = await buildCribsGraphTurtle([crib]);
    res.type('text/turtle').status(200).send(ttl);
  } catch (e) {
    console.error(e);
    res.status(500).send('Erro ao gerar RDF (Turtle)');
  }
});

module.exports = router;