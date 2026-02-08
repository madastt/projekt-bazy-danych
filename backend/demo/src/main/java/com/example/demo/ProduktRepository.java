package com.example.demo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduktRepository extends JpaRepository<Produkt, Long> {


    @Query("SELECT p FROM Produkt p WHERE " +
            "(:fraza IS NULL OR LOWER(p.nazwa) LIKE LOWER(CONCAT('%', :fraza, '%'))) AND " +
            "(:dostawcaId IS NULL OR p.dostawcaId = :dostawcaId) AND " +
            "(:kategoriaId IS NULL OR p.kategoriaId = :kategoriaId) " +
            "ORDER BY p.id DESC")
    List<Produkt> szukajZaawansowane(
            @Param("fraza") String fraza,
            @Param("dostawcaId") Long dostawcaId,
            @Param("kategoriaId") Long kategoriaId
    );


    long countByDostawcaId(Long dostawcaId);
}