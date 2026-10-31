# Etapa 1: compilar o projeto
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B package -DskipTests

# Etapa 2: rodar (imagem menor)
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/estuda-junto-1.0.0.jar app.jar
# Limita a memória para caber no plano grátis do Render (512 MB)
ENV JAVA_TOOL_OPTIONS="-Xmx300m -XX:+UseSerialGC"
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
