# LP João dos Granitos | QH4 Growth

Landing page de posicionamento da **João dos Granitos** (marmoraria, Duque de Caxias/RJ).
Produto contratado: Estruturação de Marca (Estrutura Google + Social Media Orbia 1). Escopo sem tráfego pago até dezembro, então a LP foi pensada para SEO local, GMN e Instagram.

## Estrutura

```
/
├── index.html            LP principal
├── obrigado.html         página de obrigado (redireciona pro WhatsApp em 2,5 s)
├── 404.html              página de erro personalizada
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
├── vercel.json           cleanUrls, cache dos assets, headers de segurança
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── img/              fotos em .webp, favicons, og-image.jpg
    └── video/            5 vídeos curtos .mp4 (sem áudio) + posters .webp
```

## Como publicar na Vercel

1. Descompacte o zip.
2. Na Vercel: **Add New > Project > Deploy** arrastando a pasta (ou `vercel --prod` dentro dela).
3. Framework preset: **Other**. Sem build command, output = raiz.
4. Conecte o domínio em **Settings > Domains**.

## Pendências antes de publicar

- [ ] **GTM**: trocar `GTM-XXXXXXX` em `index.html` e `obrigado.html` pelo ID real.
- [ ] **Domínio**: o cliente ainda não tem. Usei `https://www.joaodosgranitos.com.br/` como placeholder em canonical, Open Graph, JSON-LD, robots.txt e sitemap.xml. Buscar e trocar tudo se o domínio for outro.
- [x] **Logo**: a pedido do cliente, a marca usada no site é só "Personalize" (ícone do bloco + Personalize + MÁRMORES • GRANITOS • QUARTZITOS), recortada da logo original (`assets/img/logo-personalize*.{png,webp}`). Header em azul-marinho, rodapé em branco. Se chegar o vetor (SVG/AI), dá pra trocar sem mudar layout.
- [ ] **Endereço**: no JSON-LD usei só cidade, CEP (25211-010) e as coordenadas do GMN. O endereço completo (Rua Bahia, s/n, Lt 02, Qd 3) veio no bloco de dados de domínio/hospedagem; confirmar com o cliente antes de expor na página.
- [ ] **Instagram da QH4** no rodapé: link em `https://www.instagram.com/qh4growth/`. Conferir se é o @ correto.
- [ ] **WhatsApp**: (21) 99714-8905, conforme briefing.

## Fonte do conteúdo

Tudo veio do briefing (Google Forms respondido pela Julliana) e do resumo comercial. Nada inventado:
- 15 anos de história, começo com pai e filho, crescimento nos últimos dois anos.
- Serviços, destaques (áreas gourmet, revestimentos, bancadas), diferenciais, horário e as 12 perguntas do FAQ: respostas do próprio cliente.
- Guia de cuidados com quartzito: tema que o cliente pediu como obrigatório. O texto traz só orientações gerais de conservação e remete à equipe.
- Avaliações: **não** coloquei depoimentos escritos. Há um botão que leva direto para as avaliações do GMN.
- Fotos e vídeos: pasta "02. imagens" (Instagram @joaodosgranitos). As fotos de feiras ilustram a seção "Perto de quem faz o mercado de rochas", sem citar nomes.
- "Personalize" faz parte da marca (João dos Granitos Personalize, conforme a logo). No texto da LP uso "João dos Granitos"; no JSON-LD o nome completo entra como alternateName.

Direção visual: fundo claro e posicionamento "alto luxo" (marcados no briefing), tons de azul com destaque no royal (#1F3BB3). Tipografia revisada após feedback do cliente (pediu algo mais sofisticado, com referência à Rio Mármores): Bodoni Moda (títulos, com itálico em destaque) + Jost (texto), rótulos em caixa alta espaçada acima dos títulos e botões retos. Ideia central: as fotos do hero entram como chapas inclinadas num cavalete e se endireitam ao rolar.

## Formulário

Sem Google Apps Script, então segue o padrão: o formulário monta a mensagem com todos os campos (nome, WhatsApp, perfil, projeto, cidade/bairro, detalhes) e manda para `obrigado.html`, que abre o WhatsApp com essa mensagem. O botão nasce desabilitado e só libera com todos os obrigatórios válidos (máscara de telefone inclusa).

## Eventos de rastreamento (dataLayer)

| Evento | Quando |
|---|---|
| `whatsapp_click` (`local`: header, hero, guia, contato, rodape, flutuante) | clique em qualquer link de WhatsApp |
| `generate_lead` (`projeto`, `perfil`) | envio válido do formulário |
| `form_submit_obrigado` | carregamento da página de obrigado (usar como conversão) |
| `filtro_galeria` (`categoria`) | troca de filtro na galeria |
| `guia_quartzito` (`topico`) | troca de aba no guia |

## Checklist de SEO

- [x] Title e meta description com nicho + cidade
- [x] H1 com "Marmoraria" e "perto de você"
- [x] JSON-LD LocalBusiness + HomeAndConstructionBusiness (horário, geo, área atendida, serviços)
- [x] JSON-LD FAQPage com as 12 perguntas do briefing
- [x] Open Graph completo + Twitter Card + og-image 1200x630
- [x] Canonical, robots.txt, sitemap.xml (com imagens), site.webmanifest
- [x] Meta geo (Duque de Caxias)
- [x] width/height em todas as imagens e vídeos (CLS), preload da imagem do hero, lazy load no resto
- [x] Página de obrigado (noindex) e 404 personalizada
- [x] vercel.json
- [x] Acessibilidade: foco visível, navegação por teclado (abas, painéis, lightbox), `prefers-reduced-motion` respeitado
- [x] Validado sem erros de JS em desktop (1440) e mobile (390), sem rolagem horizontal
