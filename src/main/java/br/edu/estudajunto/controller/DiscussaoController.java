package br.edu.estudajunto.controller;

import br.edu.estudajunto.dto.Dtos.*;
import br.edu.estudajunto.service.DiscussaoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discussoes")
public class DiscussaoController {

    private static final String AUTH = "Authorization";
    private final DiscussaoService service;

    public DiscussaoController(DiscussaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<DiscussaoRes> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public DiscussaoRes buscar(@PathVariable String id) {
        return service.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DiscussaoRes criar(@RequestHeader(value = AUTH, required = false) String authorization,
                              @RequestBody DiscussaoReq req) {
        return service.criar(authorization, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@RequestHeader(value = AUTH, required = false) String authorization,
                        @PathVariable String id) {
        service.excluir(authorization, id);
    }

    @PostMapping("/{id}/curtir")
    public DiscussaoRes curtir(@RequestHeader(value = AUTH, required = false) String authorization,
                               @PathVariable String id) {
        return service.alternarCurtida(authorization, id);
    }

    @PostMapping("/{id}/comentarios")
    @ResponseStatus(HttpStatus.CREATED)
    public DiscussaoRes comentar(@RequestHeader(value = AUTH, required = false) String authorization,
                                 @PathVariable String id,
                                 @RequestBody ComentarioReq req) {
        return service.comentar(authorization, id, req);
    }
}
