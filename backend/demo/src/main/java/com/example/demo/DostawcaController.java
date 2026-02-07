package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dostawcy")
@CrossOrigin(origins = "*")
public class DostawcaController {

    private final DostawcaRepository dostawcaRepo;
    private final ProduktRepository produktRepo; // Dodajemy repozytorium produktów

    public DostawcaController(DostawcaRepository dostawcaRepo, ProduktRepository produktRepo) {
        this.dostawcaRepo = dostawcaRepo;
        this.produktRepo = produktRepo;
    }

    @GetMapping
    public List<Dostawca> getDostawcy(@RequestParam(required = false) String szukaj) {
        if (szukaj != null && !szukaj.isEmpty()) {
            return dostawcaRepo.szukajDostawcow(szukaj);
        }
        return dostawcaRepo.findAll();
    }

    @PostMapping
    public Dostawca dodajDostawce(@RequestBody Dostawca d) {
        return dostawcaRepo.save(d);
    }

    @PutMapping("/{id}")
    public Dostawca edytujDostawce(@PathVariable Long id, @RequestBody Dostawca noweDane) {
        return dostawcaRepo.findById(id)
                .map(d -> {
                    d.setNazwa(noweDane.getNazwa());
                    d.setNip(noweDane.getNip());
                    d.setMiasto(noweDane.getMiasto());
                    return dostawcaRepo.save(d);
                }).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> usunDostawce(@PathVariable Long id) {
        // Zmieniamy warunek: Jeśli liczba produktów > 0, to blokujemy
        if (produktRepo.countByDostawcaId(id) > 0) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Nie można usunąć: Ten dostawca jest przypisany do produktów w magazynie.");
        }

        try {
            dostawcaRepo.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Błąd bazy danych: " + e.getMessage());
        }
    }
}