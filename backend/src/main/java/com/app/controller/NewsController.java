package com.app.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private static final String GOOGLE_RSS_BASE_URL = "https://news.google.com/rss/search";
    private static final String USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

    private final HttpClient httpClient = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.NORMAL)
        .connectTimeout(Duration.ofSeconds(8))
        .build();

    @GetMapping(value = "/rss", produces = {"application/rss+xml", MediaType.TEXT_XML_VALUE})
    public ResponseEntity<String> getGoogleNewsRss(@RequestParam("query") String query) {
        String rssUrl = buildGoogleNewsRssUrl(query);
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(rssUrl))
            .timeout(Duration.ofSeconds(10))
            .header(HttpHeaders.USER_AGENT, USER_AGENT)
            .header(HttpHeaders.ACCEPT, "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8")
            .GET()
            .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Google News RSS fetch failed with status " + response.statusCode());
            }

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(response.body());
        } catch (IOException | InterruptedException ex) {
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to fetch Google News RSS", ex);
        }
    }

    private String buildGoogleNewsRssUrl(String query) {
        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        return GOOGLE_RSS_BASE_URL + "?q=" + encodedQuery + "&hl=fr&gl=FR&ceid=FR:fr";
    }
}

