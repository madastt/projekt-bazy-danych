package com.example.demo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProduktRepository extends JpaRepository<Produkt, Long> {

    // Magia: Spring sam wygeneruje SQL: SELECT * FROM produkty WHERE nazwa LIKE %fraza%
    List<Produkt> findByNazwaContainingIgnoreCase(String fraza);

    // Jeśli chcesz mieć sortowanie po cenie (od najtańszych):
    List<Produkt> findAllByOrderByCenaAsc();

    @Query(value = "SELECT p.* FROM PRODUKTY p " +
            "JOIN KATEGORIE k ON p.KATEGORIA_ID = k.ID " +
            "JOIN DOSTAWCY d ON p.DOSTAWCA_ID = d.ID " +
            "WHERE k.NAZWA = :nazwaKat AND d.MIASTO = :miastoDost", nativeQuery = true)
    List<Produkt> znajdzZestaw(@Param("nazwaKat") String kat, @Param("miastoDost") String miasto);

    // Wyszukaj produkty konkretnego dostawcy
    List<Produkt> findByDostawcaId(Long dostawcaId);

    // Opcjonalnie: Wyszukaj po nazwie ORAZ dostawcy (Advanced Search)
    List<Produkt> findByNazwaContainingIgnoreCaseAndDostawcaId(String nazwa, Long dostawcaId);

    long countByDostawcaId(Long dostawcaId);
}