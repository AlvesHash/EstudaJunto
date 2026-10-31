package br.edu.estudajunto.service;

import org.springframework.http.HttpStatus;

/** Erro "esperado" (ex.: senha errada). Vira uma resposta HTTP com mensagem para o site. */
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    public ApiException(HttpStatus status, String mensagem) {
        super(mensagem);
        this.status = status;
    }

    public HttpStatus getStatus() { return status; }
}
