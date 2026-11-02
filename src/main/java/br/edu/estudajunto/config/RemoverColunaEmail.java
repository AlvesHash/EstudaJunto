package br.edu.estudajunto.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** Remove a coluna antiga de email após o Hibernate preparar o esquema. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RemoverColunaEmail implements CommandLineRunner {

    private final JdbcTemplate jdbc;

    public RemoverColunaEmail(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) {
        jdbc.execute("ALTER TABLE usuarios DROP COLUMN IF EXISTS email");
    }
}

