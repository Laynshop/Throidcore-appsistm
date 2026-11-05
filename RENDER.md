# Deploy da API no Render

O repositório inclui um Blueprint em `render.yaml` para preencher os comandos do serviço automaticamente.

## Pelo painel do Render

Crie um **Web Service** ligado a `Laynshop/Throidcore-appsistm`, usando a raiz do repositório (não `apps/api`). Se o Render pedir os comandos manualmente, use:

**Build Command**

```bash
npm install --include=dev && npx prisma generate --schema=prisma/schema.prisma && npm run build --workspace=apps/api
```

**Start Command**

```bash
npm run start --workspace=apps/api
```

## Variáveis de ambiente

- `DATABASE_URL`: URL de ligação do Neon. Guarde-a apenas nas variáveis do Render.
- `JWT_SECRET`: segredo forte; o Blueprint pode gerá-lo automaticamente.
- `CORS_ORIGIN`: origem do frontend publicado, por exemplo `https://nome-do-site.vercel.app`.
- `NODE_ENV`: `production`.

O Render define `PORT` automaticamente. O endpoint de verificação é `/health`.

## Importante

O serviço da API compila e expõe o endpoint de saúde, mas isso não significa que as funcionalidades do produto estejam completas. O frontend atual ainda usa dados de exemplo e o backend ainda não implementa autenticação ou operações de workspace/projeto/workflow. Antes de usar dados reais, rode as migrações Prisma de produção depois de elas serem criadas e versionadas no repositório.
