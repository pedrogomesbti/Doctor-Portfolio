# Dra. Tayna Decot — site

No ar: https://pedrogomesbti.github.io/Doctor-Portfolio/

Site mobile-first no estilo "cartão de links": tela de carregamento com o dente em traço dourado, tela inicial com nome, foto e quatro botões 3D que levam a telas internas. Tema vinho com detalhes finos em dourado.

Para testar localmente, abra `index.html` no navegador — não precisa de build.

## Telas
- `index.html` — tela inicial; cabe inteira na tela do celular.
- `tratamentos.html` — cada tratamento com foto, explicação, números, indicação, etapas e botão para o WhatsApp.
- `sobre.html` — foto, apresentação, valores, formação e fotos do consultório.
- `agendar.html` — passo a passo e formulário que abre o WhatsApp com a mensagem pronta.
- `contato.html` — WhatsApp, Instagram, e-mail, endereço, horários e dúvidas frequentes.

A animação do dente aparece na primeira visita; a navegação entre telas usa um flash de luz.

## Imagens (opcionais, em `assets/img/`)
- `tayna.jpg` — foto vertical da Dra., fundo claro (ela se funde no creme pela esquerda e por baixo).
- `btn-agendar.jpg`, `btn-tratamentos.jpg`, `btn-sobre.jpg`, `btn-contato.jpg` — fotos de fundo dos botões. Sem elas, os botões ficam em vinho com um ramo desenhado.

## Trocar (dados provisórios)
- WhatsApp: constante `WHATSAPP` no topo de `script.js`, e o número exibido em `contato.html`.
- CRO, endereço, horários, e-mail e Instagram: procure `CRO-XX 00000`, `Rua Exemplo`, `contato@` e `instagram.com/` nas páginas.
- Formação em `sobre.html` e tempos/sessões em `tratamentos.html`: confirmar com a Dra.
- Fotos: tratamentos (`assets/img/trat-*.jpg`), sobre (`tayna-sobre.jpg`) e consultório (`consultorio-1..3.jpg`).
