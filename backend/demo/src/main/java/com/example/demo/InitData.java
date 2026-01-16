package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class InitData implements CommandLineRunner {

    @Autowired private KategoriaRepository repo;

    @Override
    public void run(String... args) {
        if (repo.count() == 0) {
            repo.save(new Kategoria("Elektronika"));
            repo.save(new Kategoria("Dom i Ogród"));
            repo.save(new Kategoria("Ubrania"));
            System.out.println("✅ Dodano kategorie startowe do Oracle!");
        }
    }
}