package br.edu.estudajunto.repository;

import br.edu.estudajunto.model.Discussao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiscussaoRepository extends JpaRepository<Discussao, String> {
    List<Discussao> findAllByOrderByCriadoEmDesc();
}
