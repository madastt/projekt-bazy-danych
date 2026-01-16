package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SklepController {

    @Autowired private ProduktRepository produktRepo;
    @Autowired private KategoriaRepository kategoriaRepo;

    // --- KATEGORIE ---
    @GetMapping("/kategorie")
    public List<Kategoria> getKategorie() {
        return kategoriaRepo.findAll();
    }

    // --- PRODUKTY ---
    @GetMapping("/produkty")
    public List<Produkt> getProdukty(@RequestParam(required = false) String szukaj) {
        if (szukaj != null && !szukaj.isEmpty()) {
            // Jeśli ktoś wpisał coś w wyszukiwarkę -> szukamy
            return produktRepo.findByNazwaContainingIgnoreCase(szukaj);
        }
        // Jeśli nie -> zwracamy wszystko
        return produktRepo.findAll();
    }

    @PostMapping("/produkty")
    public Produkt dodajProdukt(@RequestBody Produkt p) {
        return produktRepo.save(p);
    }

    @DeleteMapping("/produkty/{id}")
    public void usunProdukt(@PathVariable Long id) {
        produktRepo.deleteById(id);
    }
}