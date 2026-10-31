package br.edu.estudajunto.dto;

import java.time.Instant;
import java.util.List;

/** Formatos de dados trocados entre o site (JavaScript) e o servidor (Java). */
public final class Dtos {
    private Dtos() {}

    // Entrada
    public record CadastroReq(String name, String username, String email, String password) {}
    public record LoginReq(String email, String password) {}
    public record PerfilReq(String name, String username, String bio) {}
    public record DiscussaoReq(String title, String category, String question, List<String> tags) {}
    public record ComentarioReq(String text) {}

    // Saída
    public record UsuarioRes(String name, String username, String email, String bio, Instant createdAt) {}
    public record AuthRes(String token, UsuarioRes user) {}
    public record ComentarioRes(Long id, String username, String name, String text, Instant createdAt) {}
    public record DiscussaoRes(String id, String title, String category, String question, List<String> tags,
                               String author, String username, Instant createdAt,
                               List<String> likes, List<ComentarioRes> comments) {}
}
