# Estuda Junto

Plataforma web de estudo colaborativo. A interface mantém a identidade visual azul e branca do projeto original e inclui páginas de início, cadastro, login, perfil, criação e leitura de discussões.

## Executar localmente

Requisitos: Node.js 20 ou superior. Não há dependências externas para instalar.

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Funcionalidades do protótipo

- Navegação responsiva e pesquisa por texto/categoria.
- Cadastro e login de demonstração.
- Criação de discussões, comentários e curtidas.
- Perfil editável e listagem de publicações do usuário.
- Persistência no navegador via `localStorage`.

## Limitação importante

Esta versão é um protótipo local: contas e conteúdo ficam no navegador do usuário, não em um banco compartilhado. Não use senhas reais nem publique como serviço multiusuário. Para produção, implemente autenticação segura no servidor, banco de dados, autorização por usuário, moderação, política de privacidade e proteção de dados. O sistema original usava endpoints que expunham registros de usuários; esses endpoints foram removidos nesta reconstrução.
