package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "DOSTAWCY")
public class Dostawca {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dost_seq")
    @SequenceGenerator(name = "dost_seq", sequenceName = "DOSTAWCY_SEQ", allocationSize = 1)
    private Long id;
    private String nazwa;
    private String nip;
    private String miasto;

    public Dostawca() {}



    public Long getId() { return id; }
    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip;}
    public String getMiasto() { return miasto; }
    public void setMiasto(String miasto) { this.miasto = miasto; }
}