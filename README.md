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

## Dados da Dra.
- CRO-RJ 057551 · WhatsApp (21) 97668-6448 (constante `WHATSAPP` em `script.js`) · Instagram @DraTaynaDecot.
- Tratamentos organizados em 7 áreas a partir da lista enviada por ela (`tratamentos.html`).

## Ainda falta
- E-mail, endereço completo e horários (por enquanto as páginas indicam "Consulte pelo WhatsApp").
- Fotos: `tayna.jpg` (retrato para a tela inicial), `consultorio-1.jpg` (recepção) e as áreas sem foto em `trat-{restauracoes,clareamento,gengiva,cirurgia,proteses}.jpg`, em `assets/img/`.

## Mídia já no site
- `assets/img/caso-*.jpg`: casos enviados pela Dra. (seção Casos do consultório em Tratamentos).
- `assets/video/*.mp4`: trechos de 8 s dos vídeos de atendimento (Sobre mim e Tratamentos), com capa `.jpg`.
- Fundos dos botões da tela inicial: `assets/img/btn-*.jpg`.
