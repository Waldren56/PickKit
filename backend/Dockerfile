# Stage 1: Costruzione (Usa Maven ufficiale siccome manca il wrapper locale)
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
# Scarica le dipendenze per cacharle nel livello Docker
RUN mvn dependency:go-offline

COPY src ./src
# Compila e genera il file .jar
RUN mvn clean package -DskipTests

# Stage 2: Esecuzione
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copia il jar compilato dallo stage precedente
COPY --from=build /app/target/*.jar app.jar

# Esponi la porta usata da Spring Boot
EXPOSE 8080

# Avvia l'app in modalita' produzione
ENTRYPOINT ["java", "-jar", "app.jar"]
