package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DostawcaRepository extends JpaRepository<Dostawca, Long> {

    // Szukamy po nazwie, NIPie lub mieście (case insensitive)
    @Query("SELECT d FROM Dostawca d WHERE " +
            "LOWER(d.nazwa) LIKE LOWER(CONCAT('%', :fraza, '%')) OR " +
            "LOWER(d.nip) LIKE LOWER(CONCAT('%', :fraza, '%')) OR " +
            "LOWER(d.miasto) LIKE LOWER(CONCAT('%', :fraza, '%'))")
    List<Dostawca> szukajDostawcow(@Param("fraza") String fraza);
}