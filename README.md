# ATELIER NÓRD Arquitetura · site demonstrativo

Site conceitual de um estúdio de arquitetura **fictício**. A marca, os cases, as áreas e os depoimentos são demonstrativos.

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # build de produção em dist/
npm run preview    # serve o build
```

URLs limpas (Vercel/Netlify): `VITE_ROUTER=browser npm run build`. O `vercel.json` já faz o rewrite para `index.html`.
Sem essa variável, as rotas usam hash simples (`#projeto-casa-horizonte`, `#privacidade`) e funcionam em qualquer hospedagem estática.

## Stack

React 18 + TypeScript + Vite · Tailwind CSS 3 · GSAP 3 + ScrollTrigger + @gsap/react · Lenis (um único controlador, ligado ao ticker do GSAP) · Three.js + React Three Fiber + Drei (carregamento tardio) · React Router 6 · Lucide · fontes self-hosted (Fontsource: Cormorant Garamond e Manrope).

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Nome, e-mail, telefone, Instagram, créditos, modo demo, endpoint do formulário | `src/data/site.ts` |
| Projetos (cases) | `src/data/projects.ts` |
| Serviços | `src/data/services.ts` |
| Processo, depoimentos, princípios, textos da cena 3D | `src/data/content.ts` |
| Cores e tipografia | `src/styles/index.css` (`:root`) e `tailwind.config.js` |
| Imagens | `public/assets/img/<nome>-1920.webp` e `<nome>-960.webp` |

## Antes de publicar de verdade

1. Troque e-mail, telefone e Instagram em `src/data/site.ts` e desligue `demoMode`.
2. Formulário: defina `contactEndpoint` (POST JSON). Sem ele, o site **não envia nada** e avisa o visitante. No servidor, aplique validação, antispam e rate limit.
3. Revise a política de privacidade (`src/pages/PrivacyPage.tsx`) com orientação jurídica (LGPD).
4. Atualize o domínio em `public/sitemap.xml`, `public/robots.txt` e a `og:image` absoluta em `index.html`.
5. Substitua os renders conceituais por fotografias reais de obras do estúdio, com crédito e licença.
6. Meça Core Web Vitals (LCP, CLS, INP) em produção; as metas estão preparadas, não garantidas.

## Imagens

Todas as imagens são renders digitais originais gerados em código (`tools/render/`, Three.js em Chromium headless), sem fotografias de terceiros nem de obras reais. Para gerar de novo: `python3 -m http.server 5055` na raiz e `node tools/render/run.cjs` (requer Playwright).

## Estrutura

```
src/components/layout    Header, menu fullscreen, rodapé, créditos
src/components/motion    Lenis, preloader, cursor, transições de página, reveals, magnético, expansão de imagem
src/components/ui        Img (lazy/srcset/fallback), Drawer, formulário, desenhos conceituais
src/components/sections  As 9 seções da home
src/components/three     Cena WebGL (chunk separado)
src/pages                Home, Projeto, Privacidade, 404
src/data | hooks | lib   Conteúdo, hooks, gsap/router/contato
tools/                   Gerador de renders e testes Playwright
```
