# King Food Webview

Casca simples do cardápio King Food (OlaClick) com:
- Tela de loading animada
- Logo próprio
- Header com marca
- Cardápio embutido via iframe

## Repositório
https://github.com/luizhbr/king-food-webview

## Estrutura

```
king-food-webview/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── logo-kingfood.png   ← coloque seu logo aqui
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## Como rodar local

```bash
npm install
npm run dev
```

## Logo

Coloque o arquivo do logo em:

```
public/logo-kingfood.png
```

## Deploy na Vercel

1. Acesse https://vercel.com
2. **Add New Project**
3. Importe o repositório `luizhbr/king-food-webview`
4. Clique em Deploy
