# Rollback — King Food WebView

## Ponto salvo antes da Fase C (iframe sandbox)

| Item | Valor |
|------|--------|
| Tag | `pre-fase-c` |
| Tag data | `pre-fase-c-20260802` |
| Commit | `df90312` (`feat: splash com corpinhos de açaí + timing inteligente`) |
| Inclui | UX pack, copy, splash açaí, ícones amarelos, PWA install, **Fase A+B** |
| Não inclui | sandbox do iframe Olaclick (Fase C) |

## Como voltar (local + GitHub)

```bash
cd ~/Projects/king-food-webview
git fetch origin --tags
git checkout main
git reset --hard pre-fase-c
git push --force-with-lease origin main
```

## Preview / produção depois do rollback

```bash
# preview
vercel --yes

# produção SÓ se o usuário pedir
# vercel --prod --yes
```

## O que a Fase C adiciona (depois deste ponto)

- `sandbox` no iframe do cardápio
- `allow="payment *; publickey-credentials-get *"`
- `referrerPolicy=strict-origin-when-cross-origin`
- listener `postMessage` que só aceita origem Olaclick / self

Se o **checkout** do Olaclick quebrar no preview → usar rollback acima.
