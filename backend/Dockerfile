# ---------- BUILD STAGE ----------
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace/app

# Copy Maven wrapper & config trước để cache dependency
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Cho phép execute mvnw
RUN chmod +x mvnw

# Tải dependency trước (được cache nếu pom.xml không đổi)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build app (KHÔNG dùng -o)
RUN ./mvnw package -DskipTests -B


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo user non-root cho bảo mật
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy jar từ build stage
COPY --from=build /workspace/app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
