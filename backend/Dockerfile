FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S finawa && adduser -S finawa -G finawa
RUN mkdir -p /app/upload && chown -R finawa:finawa /app

COPY target/finawa-backend-*.jar app.jar

USER finawa

EXPOSE 7333

ENTRYPOINT ["java", "-jar", "app.jar"]
