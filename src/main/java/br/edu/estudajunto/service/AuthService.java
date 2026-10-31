package br.edu.estudajunto.service;

import br.edu.estudajunto.dto.Dtos.*;
import br.edu.estudajunto.model.Sessao;
import br.edu.estudajunto.model.Usuario;
import br.edu.estudajunto.repository.SessaoRepository;
import br.edu.estudajunto.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern USERNAME = Pattern.compile("[a-z0-9_]{3,20}");
    private static final Duration VALIDADE_SESSAO = Duration.ofDays(30);

    private final UsuarioRepository usuarios;
    private final SessaoRepository sessoes;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();

    public AuthService(UsuarioRepository usuarios, SessaoRepository sessoes) {
        this.usuarios = usuarios;
        this.sessoes = sessoes;
    }

    // ---------- cadastro / login / logout ----------

    @Transactional
    public AuthRes cadastrar(CadastroReq req) {
        String nome = limpo(req.name());
        String username = limpo(req.username()).toLowerCase();
        String email = limpo(req.email()).toLowerCase();
        String senha = req.password() == null ? "" : req.password();

        if (nome.length() < 2 || nome.length() > 70)
            throw erro(HttpStatus.BAD_REQUEST, "Informe um nome com 2 a 70 caracteres.");
        if (!USERNAME.matcher(username).matches())
            throw erro(HttpStatus.BAD_REQUEST, "O usuário deve ter 3 a 20 caracteres: letras, números ou _.");
        if (!email.contains("@") || email.length() > 120)
            throw erro(HttpStatus.BAD_REQUEST, "Informe um e-mail válido.");
        if (senha.length() < 6 || senha.length() > 100)
            throw erro(HttpStatus.BAD_REQUEST, "A senha precisa ter pelo menos 6 caracteres.");
        if (usuarios.existsByUsername(username))
            throw erro(HttpStatus.CONFLICT, "Esse nome de usuário já está em uso.");
        if (usuarios.existsByEmail(email))
            throw erro(HttpStatus.CONFLICT, "Já existe uma conta com esse e-mail.");

        Usuario u = new Usuario();
        u.setNome(nome);
        u.setUsername(username);
        u.setEmail(email);
        u.setSenhaHash(encoder.encode(senha));
        u = usuarios.save(u);
        return novaSessao(u);
    }

    @Transactional
    public AuthRes entrar(LoginReq req) {
        String email = limpo(req.email()).toLowerCase();
        String senha = req.password() == null ? "" : req.password();
        Usuario u = usuarios.findByEmail(email).orElse(null);
        if (u == null || !encoder.matches(senha, u.getSenhaHash()))
            throw erro(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos.");
        return novaSessao(u);
    }

    @Transactional
    public void sair(String authorization) {
        String token = extrairToken(authorization);
        if (token != null) sessoes.deleteById(hash(token));
    }

    // ---------- usuário logado ----------

    /** Descobre quem está logado a partir do cabeçalho Authorization. Lança 401 se não houver. */
    @Transactional
    public Usuario exigirUsuario(String authorization) {
        String token = extrairToken(authorization);
        if (token == null) throw naoAutorizado();
        Sessao s = sessoes.findById(hash(token)).orElseThrow(this::naoAutorizado);
        if (s.getCriadoEm().plus(VALIDADE_SESSAO).isBefore(Instant.now())) {
            sessoes.delete(s);
            throw naoAutorizado();
        }
        return usuarios.findById(s.getUsuarioId()).orElseThrow(this::naoAutorizado);
    }

    @Transactional(readOnly = true)
    public UsuarioRes perfil(String authorization) {
        return paraRes(exigirUsuario(authorization));
    }

    @Transactional
    public UsuarioRes atualizarPerfil(String authorization, PerfilReq req) {
        Usuario u = exigirUsuario(authorization);
        String nome = limpo(req.name());
        String username = limpo(req.username()).toLowerCase();
        String bio = limpo(req.bio());

        if (nome.length() < 2 || nome.length() > 70)
            throw erro(HttpStatus.BAD_REQUEST, "Informe um nome com 2 a 70 caracteres.");
        if (!USERNAME.matcher(username).matches())
            throw erro(HttpStatus.BAD_REQUEST, "O usuário deve ter 3 a 20 caracteres: letras, números ou _.");
        if (bio.length() > 240)
            throw erro(HttpStatus.BAD_REQUEST, "A biografia pode ter no máximo 240 caracteres.");
        if (!username.equals(u.getUsername()) && usuarios.existsByUsername(username))
            throw erro(HttpStatus.CONFLICT, "Esse nome de usuário já está em uso.");

        u.setNome(nome);
        u.setUsername(username);
        u.setBio(bio);
        return paraRes(u);
    }

    // ---------- utilitários ----------

    public String codificarSenha(String senha) { return encoder.encode(senha); }

    public static UsuarioRes paraRes(Usuario u) {
        return new UsuarioRes(u.getNome(), u.getUsername(), u.getEmail(), u.getBio() == null ? "" : u.getBio(), u.getCriadoEm());
    }

    private AuthRes novaSessao(Usuario u) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        sessoes.save(new Sessao(hash(token), u.getId()));
        return new AuthRes(token, paraRes(u));
    }

    private static String extrairToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) return null;
        String t = authorization.substring(7).trim();
        return t.isEmpty() ? null : t;
    }

    private static String hash(String token) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(d);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    static String limpo(String s) { return s == null ? "" : s.trim(); }

    private ApiException naoAutorizado() {
        return erro(HttpStatus.UNAUTHORIZED, "Sessão inválida ou expirada. Entre novamente.");
    }

    static ApiException erro(HttpStatus status, String msg) { return new ApiException(status, msg); }
}
