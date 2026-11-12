package com.traceback.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
        String uriPath = uploadDir.toUri().toString();
        if (!uriPath.endsWith("/")) {
            uriPath += "/";
        }

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uriPath, "file:uploads/", "file:" + uploadDir.toString().replace('\\', '/') + "/");
    }
}
