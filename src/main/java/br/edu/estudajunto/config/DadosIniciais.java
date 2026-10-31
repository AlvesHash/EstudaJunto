package br.edu.estudajunto.config;

import br.edu.estudajunto.model.Comentario;
import br.edu.estudajunto.model.Discussao;
import br.edu.estudajunto.model.Usuario;
import br.edu.estudajunto.repository.DiscussaoRepository;
import br.edu.estudajunto.repository.UsuarioRepository;
import br.edu.estudajunto.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Na primeira vez que o servidor sobe com o banco vazio, cria uma conta de demonstração
 * e algumas discussões de exemplo (as mesmas do protótipo antigo).
 */
@Component
public class DadosIniciais implements CommandLineRunner {

    private final UsuarioRepository usuarios;
    private final DiscussaoRepository discussoes;
    private final AuthService auth;

    public DadosIniciais(UsuarioRepository usuarios, DiscussaoRepository discussoes, AuthService auth) {
        this.usuarios = usuarios;
        this.discussoes = discussoes;
        this.auth = auth;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (discussoes.count() > 0 || usuarios.count() > 0) return;

        // Conta de demonstração (acesso para a apresentação)
        criarUsuario("Aluno Demonstração", "demo", "demo@estudajunto.com", "demo1234");

        // Autores dos exemplos (não conseguem fazer login: senha aleatória)
        Usuario joao = criarUsuario("João Silva", "joaosilva", "joao@exemplo.com", UUID.randomUUID().toString());
        Usuario maria = criarUsuario("Maria Costa", "mariacosta", "maria@exemplo.com", UUID.randomUUID().toString());
        Usuario pedro = criarUsuario("Pedro Lima", "pedrolima", "pedro@exemplo.com", UUID.randomUUID().toString());
        Usuario lucas = criarUsuario("Lucas Rocha", "lucasrocha", "lucas@exemplo.com", UUID.randomUUID().toString());

        Discussao historia = criarDiscussao(joao, "Quais foram as principais causas da Revolta da Vacina?", "História",
                "Estou estudando a Revolta da Vacina, ocorrida no Rio de Janeiro em 1904. Como a vacinação obrigatória se relacionou com as reformas urbanas e a insatisfação popular?",
                List.of("Brasil", "República Velha"), 7200);
        Comentario c = new Comentario(historia, maria,
                "A imposição da vacinação ocorreu em um contexto de reformas urbanas autoritárias e falta de diálogo com a população.");
        c.setCriadoEm(Instant.now().minusSeconds(3600));
        historia.getComentarios().add(c);

        criarDiscussao(maria, "Alguém pode explicar a fórmula de Bhaskara?", "Matemática",
                "Estou tendo dificuldade para entender equações do segundo grau. Como a fórmula funciona e quando devo utilizá-la?",
                List.of("Ensino Médio", "Álgebra"), 14400);
        criarDiscussao(pedro, "Como funciona a fotossíntese?", "Ciências",
                "Alguém poderia explicar de maneira simples como as plantas transformam luz em energia química?",
                List.of("Biologia"), 86400);
        criarDiscussao(lucas, "Qual linguagem de programação devo aprender primeiro?", "Tecnologia",
                "Estou começando a estudar programação. Vale mais a pena começar com JavaScript, Python ou Java? Quais são as diferenças para quem está aprendendo?",
                List.of("Programação", "Iniciantes"), 172800);
    }

    private Usuario criarUsuario(String nome, String username, String email, String senha) {
        Usuario u = new Usuario();
        u.setNome(nome);
        u.setUsername(username);
        u.setEmail(email);
        u.setSenhaHash(auth.codificarSenha(senha));
        return usuarios.save(u);
    }

    private Discussao criarDiscussao(Usuario autor, String titulo, String categoria, String pergunta,
                                     List<String> tags, long segundosAtras) {
        Discussao d = new Discussao();
        d.setTitulo(titulo);
        d.setCategoria(categoria);
        d.setPergunta(pergunta);
        d.setTags(new java.util.ArrayList<>(tags));
        d.setAutor(autor);
        d.setCriadoEm(Instant.now().minusSeconds(segundosAtras));
        return discussoes.save(d);
    }
}
