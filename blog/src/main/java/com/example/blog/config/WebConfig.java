package com.example.blog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files (outside classpath) from /uploads/**
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward all routes (except API & static files) to index.html
        registry.addViewController("/{spring:[^\\.]*}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:[^\\.]*}")
                .setViewName("forward:/index.html");
        registry.addViewController("/{spring:[^\\.]*}/**{spring:?!(\\.js|\\.css)$}")
                .setViewName("forward:/index.html");
    }
}
