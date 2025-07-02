# 🏠 CampusCrib

CampusCrib é uma aplicação baseada em microsserviços voltada para gestão e busca de repúblicas estudantis. O sistema permite o cadastro de repúblicas (Cribs), autenticação de usuários, envio de notificações e busca otimizada com filtros. Os microsserviços se comunicam via Apache Kafka, utilizam bancos especializados e são expostos por um API Gateway.

---

## 🧩 Microsserviços

- `registration-service` (Java - Spring Boot)
- `authentication-service` (Java - Spring Boot)
- `crib-manager-service` (Java - Spring Boot)
- `notification-service` (Go)
- `crib-search-service` (Go)

## 🧠 Tecnologias
- Java (com Spring Boot)
- Go
- Typescript
- Kong API Gateway
- Kafka (sem Zookeeper)
- PostgreSQL
- MongoDB
- Redis
- ElasticSearch
- Amazon SES
- Docker
- Angular
- Node

## 📬 Tópicos Kafka utilizados
- user.registered
- crib.registered
- crib.updated
- crib.deleted

---

## 🚀 Como rodar localmente

### 1. 📦 Pré-requisitos

- Docker + Docker Compose
- Java 21+ (para desenvolvimento dos serviços em Java)
- Go 1.22+ (para desenvolvimento dos serviços em Go)

---

### 2. 🌠 Executando o Frontend
cd campuscrib/frontend/campuscrib-front
npm install
ng serve

### 3. 🗄️ Executando o Backend
É necessário rodar cada microsserviço separadamente. Além disso, rode o elasticsearch via docker e os SGBDs.

Para executar o docker basta fazer:
cd campuscrib/backend
docker-compose up --build

Caso tenha instalado os bancos de dados (Postgresql, MongoDB e Redis) e o Kafka via Homebrew, basta executá-los:
- brew services stop postgresql@14
- brew services start mongodb-community@7.0
- brew services start redis
- brew services start kafka

Para executar os microsserviços:

#### Registration Service
Tenha o application.properties com as variáveis de ambiente:
server.port=${SERVER_PORT}
spring.datasource.url=${DB_SOURCE}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
jwt.email-confirmation.secret=${CONFIRMATION_SECRET_KEY}
jwt.email-confirmation.expiration-millis=${CONFIRMATION_TOKEN_EXPIRATION}
jwt.authentication.secret=${AUTHENTICATION_TOKEN_SECRET_KEY}
jwt.authentication.expiration-millis=${AUTHENTICATION_TOKEN_EXPIRATION}
clients.authentication-service.base-url=${AUTH_SERVICE_BASE_URL}
spring.kafka.bootstrap-servers=${KAFKA_BROKER}
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
kafka.topics.user-registered=${KAFKA_TOPIC_USER_REGISTERED}

Em seguida execute:
cd campuscrib/backend/microservices/registration-service
./mvnw spring-boot:run

#### Authentication Service
Tenha o application.properties com as variáveis de ambiente:
server.port=${SERVER_PORT}
spring.data.mongodb.uri=${MONGODB_URI}
spring.data.redis.host=${REDIS_HOST}
spring.data.redis.port=${REDIS_PORT}
jwt.secret=${JWT_SECRET}
jwt.access-token.expiration-millis=${JWT_ACCESS_TOKEN_EXPIRATION_MILLIS}

Em seguida execute:
cd campuscrib/backend/microservices/authentication-service
./mvnw spring-boot:run

#### CribManager Service
Tenha o application.properties com as variáveis de ambiente:
server.port=${SERVER_PORT}
spring.datasource.url=${DB_SOURCE}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
jwt.authentication.secret=${AUTHENTICATION_TOKEN_SECRET_KEY}
jwt.authentication.expiration-millis=${AUTHENTICATION_TOKEN_EXPIRATION}
spring.kafka.bootstrap-servers=${KAFKA_BROKER}
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
kafka.topics.crib-registered=${KAFKA_TOPIC_CRIB_REGISTERED}
kafka.topics.crib-updated=${KAFKA_TOPIC_CRIB_UPDATED}
kafka.topics.crib-deleted=${KAFKA_TOPIC_CRIB_DELETED}

Em seguida execute:
cd campuscrib/backend/microservices/crib-manager-service
./mvnw spring-boot:run

#### CribSearch Service
Vá até a pasta do microsserviço:
cd campuscrib/backend/microservices/crib-search-service

Crie um arquivo .ENV com as seguintes variáveis:
ENV=development
CRIB_SEARCH_SERVER_PORT=8085
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=cribsearch_db
ELASTICSEARCH_URL=http://localhost:9200
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_CACHE_TTL_SECONDS=3600
KAFKA_BROKER=localhost:9092
KAFKA_GROUP_ID=crib-search-group
KAFKA_TOPIC_REGISTERED=crib.registered
KAFKA_TOPIC_UPDATED=crib.updated
KAFKA_TOPIC_DELETED=crib.deleted

Baixe as dependências:
go mod tidy

Execute:
go run main.go

#### Notification Service
Vá até a pasta do microsserviço:
cd campuscrib/backend/microservices/notification-service

Crie um arquivo .ENV com as seguintes variáveis:
ENV=development
KAFKA_BROKER=localhost:9092
KAFKA_TOPIC=user.registered
KAFKA_GROUP_ID=notification-service
AWS_SES_REGION={SUA REGIAO}
AWS_ACCESS_KEY_ID={SEU ACCESS ID}
AWS_SECRET_ACCESS_KEY={SUA SECRET ACCESS KEY}
AWS_SES_SOURCE_EMAIL={SEU EMAIL FONTE DE ENVIO}

Baixe as dependências:
go mod tidy

Execute:
go run main.go

# 2025-CampusCrib
Assignment for the 2025 edition of the "Web Development and the Semantic Web" course, by Gabriel Zonatelle Borges and Kaio Silva Rosa.
