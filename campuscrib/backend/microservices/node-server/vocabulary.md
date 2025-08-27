# Vocabulário CampusCrib

Este é um vocabulário próprio do **CampusCrib**, que utiliza termos de ontologias consolidadas (RDF, RDFS, Schema.org, FOAF, Geo WGS84) e define o namespace `cc:` para representar conceitos e propriedades específicas do domínio de Cribs.

---

## Prefixos (namespaces) declarados
- **rdf:** <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
- **rdfs:** <http://www.w3.org/2000/01/rdf-schema#>
- **schema:** <http://schema.org/>
- **geo:** <http://www.w3.org/2003/01/geo/wgs84_pos#>
- **cc:** <http://campuscrib.example.org/ontology#>
- **foaf:** <http://xmlns.com/foaf/0.1/>

---

## Classes usadas
- **cc:Crib**
- **foaf:Person**

---

## Propriedades usadas

### RDF / RDFS
- **rdf:type**
- **rdfs:label**

### Schema.org
- **schema:description**
- **schema:price**
- **schema:streetAddress**
- **schema:addressLocality**
- **schema:addressRegion**
- **schema:postalCode**
- **schema:birthDate**

### WGS84 (geo)
- **geo:lat**
- **geo:long**

### CampusCrib (cc)
- **cc:numRooms**
- **cc:numBathrooms**
- **cc:numPeopleAlreadyIn**
- **cc:numAvailableVacancies**
- **cc:acceptedGenders**
- **cc:petsPolicy**
- **cc:landlord**

### FOAF
- **foaf:firstName**
- **foaf:lastName**
- **foaf:mbox**
