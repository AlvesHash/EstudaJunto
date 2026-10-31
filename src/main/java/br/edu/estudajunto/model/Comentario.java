package br.edu.estudajunto.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "comentarios")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "discussao_id")
    private Discussao discussao;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @Column(nullable = false, length = 2000)
    private String texto;

    @Column(nullable = false)
    private Instant criadoEm = Instant.now();

    protected Comentario() {}

    public Comentario(Discussao discussao, Usuario autor, String texto) {
        this.discussao = discussao;
        this.autor = autor;
        this.texto = texto;
    }

    public Long getId() { return id; }
    public Discussao getDiscussao() { return discussao; }
    public Usuario getAutor() { return autor; }
    public String getTexto() { return texto; }
    public Instant getCriadoEm() { return criadoEm; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }
}
