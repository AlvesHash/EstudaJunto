package br.edu.estudajunto.model;

import jakarta.persistence.*;
import java.time.Instant;

/** Guarda quem está logado. O id é o "hash" do token que o navegador recebe. */
@Entity
@Table(name = "sessoes")
public class Sessao {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private Instant criadoEm = Instant.now();

    protected Sessao() {}

    public Sessao(String id, Long usuarioId) {
        this.id = id;
        this.usuarioId = usuarioId;
    }

    public String getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public Instant getCriadoEm() { return criadoEm; }
}
