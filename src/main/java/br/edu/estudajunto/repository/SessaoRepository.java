package br.edu.estudajunto.repository;

import br.edu.estudajunto.model.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessaoRepository extends JpaRepository<Sessao, String> {
}
