package com.example.demo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduktRepository extends JpaRepository<Produkt, Long> {
    List<Produkt> findByNazwaContainingIgnoreCase(String tekst);
}