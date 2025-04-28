# API de Controle Financeiro

API para gerenciamento de finanças pessoais, desenvolvida com Fastify, Prisma e TypeScript.

## Funcionalidades

- Autenticação de usuários com JWT
- Gerenciamento de categorias (receitas e despesas)
- Gerenciamento de transações
- Cálculo automático de saldo
- Validação de dados com Zod

## Tecnologias

- Fastify
- Prisma
- TypeScript
- PostgreSQL
- JWT
- Bcrypt
- Zod

## Requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/finance-api.git
cd finance-api
```

2. Instale as dependências
```bash
npm install
```

3. Configure o banco de dados
- Crie um arquivo `.env` baseado no `.env.example`
- Configure a URL do banco de dados no arquivo `.env`
- Execute as migrações do Prisma
```bash
npx prisma migrate dev
```

4. Inicie o servidor
```bash
npm run dev
```

## Endpoints

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário

### Categorias

- `POST /categories` - Criar categoria
- `GET /categories` - Listar categorias
- `GET /categories/:id` - Buscar categoria por ID
- `PUT /categories/:id` - Atualizar categoria
- `DELETE /categories/:id` - Deletar categoria

### Transações

- `POST /transactions` - Criar transação
- `GET /transactions` - Listar transações
- `GET /transactions/:id` - Buscar transação por ID
- `PUT /transactions/:id` - Atualizar transação
- `DELETE /transactions/:id` - Deletar transação
- `GET /transactions/balance` - Obter saldo atual

## Estrutura do Projeto

```
src/
  ├── modules/
  │   ├── auth/
  │   │   ├── routes.ts
  │   │   ├── services.ts
  │   │   └── schemas.ts
  │   ├── categories/
  │   │   ├── routes.ts
  │   │   ├── services.ts
  │   │   └── schemas.ts
  │   └── transactions/
  │       ├── routes.ts
  │       ├── services.ts
  │       └── schemas.ts
  ├── lib/
  │   └── prisma.ts
  └── server.ts
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 