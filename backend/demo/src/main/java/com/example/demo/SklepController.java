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

    @GetMapping("/kategorie")
    public List<Kategoria> getKategorie() {
        return kategoriaRepo.findAll();
    }

    @GetMapping("/produkty")
    public List<Produkt> getProdukty(
            @RequestParam(required = false) String szukaj,
            @RequestParam(required = false) Long dostawcaId) {

        // 1. Jeśli wybrano dostawcę ORAZ wpisano tekst
        if (szukaj != null && !szukaj.isEmpty() && dostawcaId != null) {
            return produktRepo.findByNazwaContainingIgnoreCaseAndDostawcaId(szukaj, dostawcaId);
        }
        // 2. Jeśli wybrano TYLKO dostawcę
        else if (dostawcaId != null) {
            return produktRepo.findByDostawcaId(dostawcaId);
        }
        // 3. Jeśli wpisano TYLKO tekst
        else if (szukaj != null && !szukaj.isEmpty()) {
            return produktRepo.findByNazwaContainingIgnoreCase(szukaj);
        }
        // 4. Pobierz wszystko
        return produktRepo.findAll();
    }

    @PostMapping("/produkty")
    public Produkt dodajProdukt(@RequestBody Produkt p) {
        return produktRepo.save(p); // Hibernate sam zrobi INSERT
    }

    @DeleteMapping("/produkty/{id}")
    public void usunProdukt(@PathVariable Long id) {
        produktRepo.deleteById(id); // Hibernate sam zrobi DELETE
    }

    @PutMapping("/produkty/{id}")
    public Produkt edytujProdukt(@PathVariable Long id, @RequestBody Produkt noweDane) {
        return produktRepo.findById(id)
                .map(produkt -> {
                    produkt.setNazwa(noweDane.getNazwa());
                    produkt.setCena(noweDane.getCena());
                    produkt.setKategoriaId(noweDane.getKategoriaId());
                    produkt.setDostawcaId(noweDane.getDostawcaId()); // <--- DODAJ TĘ LINIĘ
                    return produktRepo.save(produkt);
                }).orElseThrow();
    }
}