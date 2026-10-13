package com.placement.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartPlacementPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartPlacementPortalApplication.class, args);
        System.out.println("==================================================================");
        System.out.println(" Smart Placement & Recruitment Portal Backend Started Successfully!");
        System.out.println(" REST API Base: http://localhost:8085/api");
        System.out.println(" H2 Database Console: http://localhost:8085/h2-console");
        System.out.println(" Fullstack Web Portal: http://localhost:8085/");
        System.out.println("==================================================================");
    }
}
