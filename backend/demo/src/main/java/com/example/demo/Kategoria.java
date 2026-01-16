package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "MOJE_KATEGORIE") // Twoja nazwa tabeli
public class Kategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Niech Oracle martwi się o ID
    private Long id;

    private String nazwa;

    public Kategoria() {}
    public Kategoria(String nazwa) { this.nazwa = nazwa; }

    public Long getId() { return id; }
    public String getNazwa() { return nazwa; }
}