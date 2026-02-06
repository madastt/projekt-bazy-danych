package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "KATEGORIE")
public class Kategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String nazwa;

    public Kategoria() {}
    public Kategoria(String nazwa) { this.nazwa = nazwa; }

    public Long getId() { return id; }
    public String getNazwa() { return nazwa; }
}