package br.edu.estudajunto.controller;

import br.edu.estudajunto.dto.Dtos.*;
import br.edu.estudajunto.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/cadastro")
    public AuthRes cadastro(@RequestBody CadastroReq req) {
        return auth.cadastrar(req);
    }

    @PostMapping("/login")
    public AuthRes login(@RequestBody LoginReq req) {
        return auth.entrar(req);
    }

    @PostMapping("/logout")
    public void logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        auth.sair(authorization);
    }

    @GetMapping("/me")
    public UsuarioRes me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return auth.perfil(authorization);
    }

    @PutMapping("/me")
    public UsuarioRes atualizar(@RequestHeader(value = "Authorization", required = false) String authorization,
                                @RequestBody PerfilReq req) {
        return auth.atualizarPerfil(authorization, req);
    }
}
