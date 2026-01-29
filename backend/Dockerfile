# ---------- BUILD STAGE ----------
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace/app

# Copy Maven wrapper và pom.xml trước để cache dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Cho phép execute mvnw
RUN chmod +x mvnw

# Download dependencies (layer này được cache nếu pom.xml không đổi)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build app (skip tests để nhanh hơn)
RUN ./mvnw package -DskipTests -o

# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp

# Thêm user không phải root để bảo mật hơn
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

ARG JAR_FILE=/workspace/app/target/*.jar
COPY --from=build ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app.jar"]
