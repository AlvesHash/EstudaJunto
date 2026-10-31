package br.edu.estudajunto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Endereços "bonitos" das páginas (ex.: /login abre pages/login.html). */
@Controller
public class PaginasController {

    @GetMapping("/")
    public String inicio() { return "forward:/pages/index.html"; }

    @GetMapping("/login")
    public String login() { return "forward:/pages/login.html"; }

    @GetMapping("/cadastro")
    public String cadastro() { return "forward:/pages/cadastro.html"; }

    @GetMapping("/perfil")
    public String perfil() { return "forward:/pages/perfil.html"; }

    @GetMapping("/criar")
    public String criar() { return "forward:/pages/criar.html"; }

    @GetMapping("/discussao")
    public String discussao() { return "forward:/pages/discussao.html"; }
}
