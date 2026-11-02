# Estuda Junto

Uma plataforma de aprendizagem colaborativa onde estudantes podem compartilhar dúvidas, trocar conhecimento e aprender em conjunto.

**Acesse o site:** [estudajunto.onrender.com](https://estudajunto.onrender.com)

## O que você pode fazer

- Criar discussões e organizá-las por categoria e tags.
- Pesquisar discussões e filtrar por categoria.
- Comentar e curtir publicações.
- Criar uma conta e entrar usando apenas nome de usuário e senha.
- Personalizar o perfil com nome, nome de usuário e biografia.
- Usar a interface em modo escuro, padrão do site.

## Tecnologias

| Parte | Tecnologia |
| --- | --- |
| Servidor e API | Java 17 e Spring Boot 3 |
| Interface | HTML, CSS e JavaScript |
| Persistência local | H2 em memória |
| Persistência publicada | PostgreSQL no Supabase |
| Hospedagem | Render |

## Executar localmente

Você precisa de Java 17 ou superior e Maven.

```bash
mvn spring-boot:run
```

Abra [http://localhost:8080](http://localhost:8080). Sem configuração de banco, o projeto usa H2 em memória; os dados locais são apagados quando o servidor reinicia.

Quando o banco estiver vazio, a aplicação cria conteúdo de demonstração, incluindo a conta `demo` com a senha `demo1234` e algumas discussões de exemplo. Essa conta é pública e serve apenas para demonstração.

## Publicar com Render e Supabase

1. Crie um projeto PostgreSQL no Supabase e obtenha os dados de conexão do banco.
2. No Render, crie um **Web Service** ligado ao repositório. O projeto inclui um `Dockerfile` e um `render.yaml`.
3. Configure estas variáveis de ambiente no serviço:

   | Variável | Valor |
   | --- | --- |
   | `DATABASE_URL` | URL JDBC, por exemplo `jdbc:postgresql://HOST:5432/postgres` |
   | `DB_USER` | Usuário do PostgreSQL fornecido pelo Supabase |
   | `DB_PASSWORD` | Senha do banco |

O Render fornece a variável `PORT`. As tabelas são criadas ou atualizadas quando a aplicação inicia. A aplicação também remove a coluna antiga de email do banco, pois o acesso agora é feito com nome de usuário e senha.

## Estrutura do projeto

```text
src/main/java/br/edu/estudajunto/
  config/       Inicialização e migrações do banco
  controller/   Rotas da API e páginas
  dto/          Dados enviados e recebidos pela API
  model/        Usuários, discussões, comentários e sessões
  repository/   Acesso ao banco de dados
  service/      Regras de negócio e autenticação

src/main/resources/static/
  css/          Estilos
  js/           Interações e comunicação com a API
  pages/        Páginas do site
```

## Limitações conhecidas

- Não há recuperação de senha.
- O projeto ainda não inclui ferramentas de moderação nem limite de tentativas de login.
- No plano gratuito, o Render pode suspender o serviço após um período sem acessos; a primeira abertura depois disso pode demorar.

