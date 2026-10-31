package br.edu.estudajunto.service;

import br.edu.estudajunto.dto.Dtos.*;
import br.edu.estudajunto.model.Comentario;
import br.edu.estudajunto.model.Discussao;
import br.edu.estudajunto.model.Usuario;
import br.edu.estudajunto.repository.DiscussaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static br.edu.estudajunto.service.AuthService.erro;
import static br.edu.estudajunto.service.AuthService.limpo;

@Service
public class DiscussaoService {

    private final DiscussaoRepository discussoes;
    private final AuthService auth;

    public DiscussaoService(DiscussaoRepository discussoes, AuthService auth) {
        this.discussoes = discussoes;
        this.auth = auth;
    }

    @Transactional(readOnly = true)
    public List<DiscussaoRes> listar() {
        return discussoes.findAllByOrderByCriadoEmDesc().stream().map(DiscussaoService::paraRes).toList();
    }

    @Transactional(readOnly = true)
    public DiscussaoRes buscar(String id) {
        return paraRes(achar(id));
    }

    @Transactional
    public DiscussaoRes criar(String authorization, DiscussaoReq req) {
        Usuario u = auth.exigirUsuario(authorization);
        String titulo = limpo(req.title());
        String categoria = limpo(req.category());
        String pergunta = limpo(req.question());

        if (titulo.length() < 5 || titulo.length() > 150)
            throw erro(HttpStatus.BAD_REQUEST, "O título deve ter de 5 a 150 caracteres.");
        if (pergunta.length() < 10 || pergunta.length() > 5000)
            throw erro(HttpStatus.BAD_REQUEST, "O conteúdo deve ter de 10 a 5000 caracteres.");
        if (categoria.isEmpty()) categoria = "Outros";
        if (categoria.length() > 40)
            throw erro(HttpStatus.BAD_REQUEST, "Categoria inválida.");

        List<String> tags = new ArrayList<>();
        if (req.tags() != null) {
            for (String t : req.tags()) {
                String tag = limpo(t);
                if (!tag.isEmpty() && tag.length() <= 60 && tags.size() < 5) tags.add(tag);
            }
        }

        Discussao d = new Discussao();
        d.setTitulo(titulo);
        d.setCategoria(categoria);
        d.setPergunta(pergunta);
        d.setTags(tags);
        d.setAutor(u);
        return paraRes(discussoes.save(d));
    }

    @Transactional
    public void excluir(String authorization, String id) {
        Usuario u = auth.exigirUsuario(authorization);
        Discussao d = achar(id);
        if (!d.getAutor().getId().equals(u.getId()))
            throw erro(HttpStatus.FORBIDDEN, "Só o autor pode excluir esta discussão.");
        discussoes.delete(d);
    }

    @Transactional
    public DiscussaoRes alternarCurtida(String authorization, String id) {
        Usuario u = auth.exigirUsuario(authorization);
        Discussao d = achar(id);
        boolean jaCurtiu = d.getCurtidas().stream().anyMatch(x -> x.getId().equals(u.getId()));
        if (jaCurtiu) d.getCurtidas().removeIf(x -> x.getId().equals(u.getId()));
        else d.getCurtidas().add(u);
        return paraRes(d);
    }

    @Transactional
    public DiscussaoRes comentar(String authorization, String id, ComentarioReq req) {
        Usuario u = auth.exigirUsuario(authorization);
        Discussao d = achar(id);
        String texto = limpo(req.text());
        if (texto.length() < 2 || texto.length() > 2000)
            throw erro(HttpStatus.BAD_REQUEST, "O comentário deve ter de 2 a 2000 caracteres.");
        d.getComentarios().add(new Comentario(d, u, texto));
        discussoes.flush();
        return paraRes(d);
    }

    // ---------- conversão para o formato que o site espera ----------

    private Discussao achar(String id) {
        return discussoes.findById(id).orElseThrow(() -> erro(HttpStatus.NOT_FOUND, "Discussão não encontrada."));
    }

    static DiscussaoRes paraRes(Discussao d) {
        List<ComentarioRes> comentarios = d.getComentarios().stream()
                .map(c -> new ComentarioRes(c.getId(), c.getAutor().getUsername(), c.getAutor().getNome(),
                        c.getTexto(), c.getCriadoEm()))
                .toList();
        List<String> curtidas = d.getCurtidas().stream().map(Usuario::getUsername).toList();
        return new DiscussaoRes(d.getId(), d.getTitulo(), d.getCategoria(), d.getPergunta(),
                new ArrayList<>(d.getTags()), d.getAutor().getNome(), d.getAutor().getUsername(),
                d.getCriadoEm(), curtidas, comentarios);
    }
}
