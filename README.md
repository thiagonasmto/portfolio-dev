# Portfólio de Thiago Lopes

Aplicação web construída com Next.js para apresentar o perfil profissional, stack, experiências e canais de contato de Thiago Lopes. O projeto também inclui um chat contextualizado por LLM, capaz de responder perguntas sobre o portfólio com base em um arquivo local de contexto.

## Visão geral

O site reúne:

- seção principal de apresentação;
- resumo profissional;
- stack e habilidades;
- experiências profissionais;
- área de contato;
- chat com contexto do portfólio via OpenAI ou Gemini.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI
- Framer Motion
- React Markdown
- Vercel Analytics

## Estrutura principal

```text
app/
  page.tsx              # composição da página principal
  api/chat/route.ts     # rota do chat com suporte a OpenAI e Gemini
components/portfolio/   # seções do portfólio
content/
  thiago-profile.txt    # contexto usado pela LLM no chat
public/                 # arquivos públicos, incluindo currículo
```

## Como rodar localmente

### 1. Instale as dependências

Com `npm`:

```bash
npm install
```

Ou com `pnpm`:

```bash
pnpm install
```

### 2. Configure as variáveis de ambiente

Crie o arquivo `.env` a partir do `.env.example` e ajuste os valores:

```bash
cp .env.example .env
```

Variáveis disponíveis:

```env
LLM_PROVIDER=gemini

OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
# OPENAI_BASE_URL=https://api.openai.com/v1

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
# GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

### 3. Inicie o servidor de desenvolvimento

Com `npm`:

```bash
npm run dev
```

Ou com `pnpm`:

```bash
pnpm dev
```

Depois, acesse `http://localhost:3000`.

## Scripts

- `npm run dev` / `pnpm dev`: inicia o ambiente de desenvolvimento
- `npm run build` / `pnpm build`: gera a build de produção
- `npm run start` / `pnpm start`: inicia a aplicação em modo produção
- `npm run lint` / `pnpm lint`: executa a verificação de lint

## Chat com LLM

O chat envia mensagens para `app/api/chat/route.ts` e usa o arquivo `content/thiago-profile.txt` como base de contexto.

Comportamento atual:

- suporta `OpenAI` e `Gemini`;
- escolhe o provider a partir de `LLM_PROVIDER`;
- pode usar `OpenAI` como fallback quando o Gemini falha em cenários específicos;
- limita o histórico enviado para as últimas mensagens da conversa;
- mantém o tom das respostas focado no contexto do portfólio.

## Personalização de conteúdo

Para atualizar as respostas do assistente e as informações principais do site, os pontos mais importantes são:

- `content/thiago-profile.txt`
- `components/portfolio/*.tsx`
- `app/layout.tsx`

## Observações

- O projeto possui `package-lock.json` e `pnpm-lock.yaml`, então você pode usar `npm` ou `pnpm`.
- O currículo público atual está em `public/CurriculoDev-Thiago-Lopes.pdf`.
- A configuração do Next.js está em `next.config.mjs`.
