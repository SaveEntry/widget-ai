FROM eclipse-temurin:21-jre
WORKDIR /app
COPY backend/target/widget-ai-backend-0.1.0-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

