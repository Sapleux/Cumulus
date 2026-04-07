package com.app.controller;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private static final Logger logger = LoggerFactory.getLogger(WeatherController.class);
    private static final String OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast";
    private final HttpClient httpClient = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.NORMAL)
        .connectTimeout(Duration.ofSeconds(15))
        .build();

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Cacheable(value = "weather", key = "T(java.lang.String).format('%s-%s-%s-%s-%s-%s-%s', #latitude, #longitude, #hourly, #daily, #current, #start_date, #end_date)")
    @Retryable(
        retryFor = {Exception.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 2.0)
    )
    public ResponseEntity<String> getWeather(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(required = false) String hourly,
            @RequestParam(required = false) String daily,
            @RequestParam(required = false) String current,
            @RequestParam(required = false) String start_date,
            @RequestParam(required = false) String end_date,
            @RequestParam(required = false) Integer forecast_days) {
        
        StringBuilder urlBuilder = new StringBuilder(OPEN_METEO_API_URL);
        urlBuilder.append("?latitude=").append(latitude);
        urlBuilder.append("&longitude=").append(longitude);

        if (hourly != null && !hourly.isEmpty()) {
            urlBuilder.append("&hourly=").append(hourly);
        }
        if (daily != null && !daily.isEmpty()) {
            urlBuilder.append("&daily=").append(daily);
        }
        if (current != null && !current.isEmpty()) {
            urlBuilder.append("&current=").append(current);
        }
        if (start_date != null && !start_date.isEmpty()) {
            urlBuilder.append("&start_date=").append(start_date);
        }
        if (end_date != null && !end_date.isEmpty()) {
            urlBuilder.append("&end_date=").append(end_date);
        }
        if (forecast_days != null) {
            urlBuilder.append("&forecast_days=").append(forecast_days);
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(urlBuilder.toString()))
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                logger.error("Open-Meteo API returned status {}: {}", response.statusCode(), response.body());
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Open-Meteo API fetch failed with status " + response.statusCode());
            }

            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(response.body());
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching weather data from Open-Meteo: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "Failed to fetch weather data: " + e.getMessage());
        }
    }
}
