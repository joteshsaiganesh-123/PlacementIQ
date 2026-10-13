FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY src src

RUN chmod +x mvnw
RUN mvn -B -Dmaven.repo.local=/tmp/maven-repo clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/smart-placement-portal-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8085

CMD ["java", "-jar", "app.jar"]