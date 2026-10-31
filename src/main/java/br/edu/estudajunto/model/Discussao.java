package br.edu.estudajunto.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "discussoes")
public class Discussao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 40)
    private String categoria;

    @Column(nullable = false, length = 5000)
    private String pergunta;

    @ElementCollection
    @CollectionTable(name = "discussao_tags", joinColumns = @JoinColumn(name = "discussao_id"))
    @Column(name = "tag", length = 60)
    private List<String> tags = new ArrayList<>();

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @ManyToMany
    @JoinTable(name = "curtidas",
            joinColumns = @JoinColumn(name = "discussao_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id"))
    private Set<Usuario> curtidas = new HashSet<>();

    @OneToMany(mappedBy = "discussao", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("criadoEm ASC")
    private List<Comentario> comentarios = new ArrayList<>();

    @Column(nullable = false)
    private Instant criadoEm = Instant.now();

    public String getId() { return id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getPergunta() { return pergunta; }
    public void setPergunta(String pergunta) { this.pergunta = pergunta; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public Usuario getAutor() { return autor; }
    public void setAutor(Usuario autor) { this.autor = autor; }
    public Set<Usuario> getCurtidas() { return curtidas; }
    public List<Comentario> getComentarios() { return comentarios; }
    public Instant getCriadoEm() { return criadoEm; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }
}
