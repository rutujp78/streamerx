package com.rutujp78.api_gateway.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;

import java.util.List;

@Configuration
public class SecurityConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration configs = new CorsConfiguration();
        configs.setAllowCredentials(true);
        configs.setAllowedOriginPatterns(List.of("http://localhost:5173"));
        configs.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configs.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configs);
        return new CorsWebFilter(source);
    }
}
