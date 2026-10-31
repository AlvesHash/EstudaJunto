# Estuda Junto

Plataforma web de estudo colaborativo: estudantes publicam dúvidas, comentam e curtem discussões.

**Como funciona agora**
- **Servidor:** Java 17 + Spring Boot (cuida de contas, login, discussões, comentários e curtidas).
- **Site:** HTML/CSS/JavaScript em `src/main/resources/static` (o próprio Java entrega as páginas).
- **Banco de dados:** PostgreSQL no Supabase. Sem configuração, usa um banco em memória (some ao reiniciar).
- **Hospedagem:** Render.com (um único serviço).

## Conta de demonstração
Criada automaticamente na primeira vez que o banco está vazio:
`demo@estudajunto.com` / `demo1234`

## Rodar no seu computador
Requisitos: Java 17+ e Maven.

```bash
mvn spring-boot:run
```
Abra http://localhost:8080 (usa o banco em memória, sem configurar nada).

## Colocar no ar (Render + Supabase)

### 1) Supabase (banco de dados)
1. Crie um projeto em supabase.com (plano grátis) e guarde a senha do banco.
2. No painel, clique em **Connect** e copie os dados do **Session pooler**
   (servidor `...pooler.supabase.com`, porta `5432`, usuário `postgres.<id-do-projeto>`).
3. Monte a URL no formato:
   `jdbc:postgresql://SERVIDOR:5432/postgres`

### 2) Render (servidor + site)
1. Suba esta pasta para o repositório no GitHub.
2. No Render: **New → Web Service**, escolha o repositório. Ele detecta o `Dockerfile`.
3. Plano **Free**. Em **Environment Variables**, crie:
   - `DATABASE_URL` = a URL JDBC do passo anterior
   - `DB_USER` = `postgres.<id-do-projeto>`
   - `DB_PASSWORD` = a senha do banco
4. Clique em **Deploy**. O primeiro build demora alguns minutos.

As tabelas são criadas automaticamente na primeira execução.

## Limitações conhecidas (plano grátis)
- O Render coloca o serviço para dormir após ~15 min sem acesso; o primeiro acesso depois disso leva cerca de 1 minuto.
- Não há recuperação de senha, moderação nem limite de tentativas de login (fora do escopo desta fase).

## Estrutura
```
src/main/java/br/edu/estudajunto/
  model/       Usuario, Discussao, Comentario, Sessao
  repository/  acesso ao banco
  service/     regras (AuthService, DiscussaoService)
  controller/  rotas /api/... e páginas
  config/      dados iniciais e página 404
src/main/resources/static/   site (pages, css, js)
```
