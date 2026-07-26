# King Food Webview

PWA shell for King Food (açaí delivery, Columbus OH).
Wraps OlaClick menu + branded home, hours, PWA install, WhatsApp.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **React 19**
- **Tailwind CSS 3.4**
- **Serwist** (Service Worker / PWA)

## Como rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Build

```bash
npm run build && npm start
```

> Service Worker só funciona em produção.

## Env

| Variável | Descrição |
|----------|-----------|
| NEXT_PUBLIC_OLACLICK_URL | URL do cardápio OlaClick |
| NEXT_PUBLIC_WHATSAPP_NUMBER | WhatsApp (ex: 12673107535) |

## Ícones PWA

Coloque em `public/icons/`:

- `icon-192x192.png`
- `icon-512x512.png`
- `maskable-icon-512x512.png`

Gere em https://www.pwabuilder.com

## Produção

https://kingfood.online/
