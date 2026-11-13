# Deploy do frontend no Vercel

Esta configuração publica somente o frontend Next.js. A API NestJS continua como serviço separado no Render, de acordo com `RENDER.md`; PostgreSQL, Prisma e Redis permanecem externos. Não configure migrações de produção nem seed como parte do deploy do frontend.

## Configuração do projeto Vercel

Configure o projeto Vercel ligado a este repositório assim:

- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Install Command:** `npm ci --workspaces=false`
- **Build Command:** `npm run build`
- **Output Directory:** deixe o padrão do Next.js (`.next`); não o substitua
- **Development Command:** deixe o padrão ou em branco

Embora `apps/web` faça parte do workspace npm da raiz, o `--workspaces=false` isola a instalação e evita instalar/buildar a API Nest no projeto frontend. O `package-lock.json` do frontend fica em `apps/web`; mantenha-o versionado para installs reproduzíveis. Não use o script raiz `npm run build`, pois também compila a API.

## Variáveis de ambiente

A inspeção do código de `apps/web` não encontrou referências a `process.env` nem a variáveis `NEXT_PUBLIC_*`. Portanto, o frontend atual não requer variáveis de ambiente para compilar ou executar.

`apps/web/.env.example` anteriormente declarava `NEXT_PUBLIC_API_URL="http://localhost:4000"`, mas o frontend não consome esse valor; o exemplo foi removido para não sugerir uma configuração necessária. Se uma futura implementação passar a chamar a API, a URL pública do endpoint poderá ser configurada como `NEXT_PUBLIC_API_URL`, por exemplo `https://api.exemplo.com`. Esse valor é público por definição e nunca deve conter credenciais.

Não adicione ao projeto Vercel do frontend `DATABASE_URL`, `JWT_SECRET`, segredos da API ou credenciais de PostgreSQL/Redis. Não renomeie esses valores para `NEXT_PUBLIC_*`: tudo com esse prefixo pode ser incorporado ao bundle do navegador. As variáveis da API devem continuar configuradas somente no serviço backend conforme `RENDER.md`.

## Verificação local

Para validar somente o frontend a partir da raiz do repositório:

```bash
npm ci --prefix apps/web --workspaces=false
npm --prefix apps/web --workspaces=false run build
```

Estes comandos não executam migrações nem seed. O comando de build raiz (`npm run build`) não é apropriado para o deploy do frontend, porque também invoca o build da API.
