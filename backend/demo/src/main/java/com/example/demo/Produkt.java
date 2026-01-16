package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "MOJE_PRODUKTY")
public class Produkt {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String nazwa;
    private Double cena;

    // Klucz obcy - proste ID kategorii
    private Long kategoriaId;

    public Produkt() {}

    // Gettery i Settery
    public Long getId() { return id; }
    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public Double getCena() { return cena; }
    public void setCena(Double cena) { this.cena = cena; }
    public Long getKategoriaId() { return kategoriaId; }
    public void setKategoriaId(Long kategoriaId) { this.kategoriaId = kategoriaId; }
}