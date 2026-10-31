package br.edu.estudajunto.config;

import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;

/** Mostra a página not-found.html quando o endereço não existe. */
@Configuration
public class PaginaNaoEncontrada {

    @Bean
    public ErrorViewResolver erro404() {
        return (request, status, model) ->
                status == HttpStatus.NOT_FOUND ? new ModelAndView("forward:/pages/not-found.html") : null;
    }
}
