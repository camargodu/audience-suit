# Documento-Mestre do Projeto — Plataforma SaaS de App Oficial/CRM para Criadores

**Versão:** 1.4  
**Data:** 13 de junho de 2026  
**Status:** Documento conceitual de produto, estratégia, arquitetura, internacionalização, billing recorrente, operação solo founder, automação, suspensão, compliance, MVP e plano de execução técnica  
**Nome provisório da categoria:** Creator Hub / Fan CRM / App Oficial do Criador  

## Changelog da versão 1.4

Esta versão adiciona o **parecer técnico de revisão** e um **plano de execução por ondas de construção**, preparando o documento para desenvolvimento real com Claude Code, mantendo o escopo completo definido na versão 1.3 (sem cortes de funcionalidades).

Principais inclusões da versão 1.4:

- nova seção 0, com parecer técnico sobre riscos, pontos fortes e decisões de sequenciamento;
- substituição de Lovable por **Claude Code** como ferramenta principal de desenvolvimento (Lovable mantido como nota de rodapé/alternativa);
- nova seção de **plano de execução em ondas** (W0–W7), traduzindo o roadmap de fases de produto em um plano técnico sequencial executável por uma pessoa com Claude Code;
- novo "prompt mestre" reescrito para uso direto no Claude Code (em vez de Lovable), preservando todos os requisitos técnicos, de i18n, billing e operação solo founder da v1.3;
- recomendações de ordem de implementação que **não removem nenhum requisito da versão completa**, apenas organizam a sequência de construção para reduzir risco de paralisia;
- pequenos ajustes de nomenclatura e referências cruzadas.

Decisões assumidas nesta versão (ajustáveis a qualquer momento):

```text
Escopo: versão completa, conforme v1.3 (4 idiomas, Stripe global, billing automatizado desde o MVP)
Ferramenta principal de desenvolvimento: Claude Code
Billing no MVP: Stripe real em modo de teste desde o início (não apenas manual)
```

---

## Changelog da versão 1.3

Esta versão adiciona ao projeto a premissa operacional de **empresa inicialmente operada por uma pessoa só**.

Principais inclusões da versão 1.3:

- decisão de operar inicialmente como solo founder;
- princípio de `self-service by default`;
- automação obrigatória de onboarding, billing, ativação, suspensão e reativação;
- suporte assíncrono com base de conhecimento e IA;
- operação humana concentrada em exceções e clientes premium;
- app nativo tratado como produto premium e posterior;
- proibição de customizações manuais em planos de entrada;
- critérios para entrada de funcionalidades no roadmap;
- métricas de carga operacional por cliente;
- gatilhos objetivos para futuras contratações;
- ajustes em planos, MVP, roadmap, stack, suporte e prompt para desenvolvimento.

A versão 1.2 já havia adicionado:

- landing page multilíngue;
- idiomas iniciais: inglês, português Brasil, espanhol e japonês;
- China continental em fase posterior;
- Stripe como provedor principal de billing recorrente;
- múltiplas moedas e SEO internacional.

A versão 1.1 já havia adicionado:

- app/PWA como casca/client;
- SaaS central como cérebro;
- `billing_status` e `app_status`;
- runtime-config obrigatório;
- bloqueio progressivo por inadimplência.

---

## 0. Parecer técnico da versão 1.4

Esta seção registra a revisão técnica feita antes do início do desenvolvimento, com o objetivo de manter o escopo completo definido nas versões anteriores, mas organizar a forma como ele será construído por uma pessoa só usando Claude Code.

### 0.1 Pontos fortes do documento

A tese central — CRM de audiência + app oficial, sem substituir as redes sociais — está bem fundamentada e reduz risco regulatório, risco de aprovação nas lojas e risco de posicionamento comercial. A decisão de tratar o app/PWA como casca dependente de um backend central, com `billing_status` e `app_status` desde o primeiro dia, é a decisão arquitetural mais importante do projeto: é barata de implementar agora e extremamente cara de retrofitar depois. O mesmo vale para multi-tenant com `tenant_id` e Row Level Security desde a primeira tabela. A premissa de operação solo founder, com critérios objetivos de automação e gatilhos de contratação, dá ao projeto um norte operacional raro em documentos de produto.

### 0.2 Riscos identificados

O documento, por natureza, descreve o produto em seu estado maduro: multi-tenant, 4 idiomas com SEO internacional, Stripe global com múltiplas moedas e Stripe Tax, 6 estados de billing/app status, feature flags por plano, CRM, push, patrocinadores, loja, LGPD e automações de suporte por IA. Tudo isso faz parte da **versão completa** e foi mantido integralmente nesta v1.4, conforme decisão do founder. O risco não está no escopo em si, mas na **ordem de construção**: se todas essas frentes forem atacadas em paralelo sem uma sequência clara, o risco é de um projeto que nunca chega a um estado "demonstrável" — sempre com pontas soltas em todas as frentes ao mesmo tempo.

A mitigação adotada nesta versão não é reduzir escopo, e sim definir uma **ordem de construção** (seção 42, "Plano de execução em ondas") que entrega, em cada onda, um sistema sempre funcional de ponta a ponta — só que com cobertura crescente de idiomas, planos, moedas e automações. Isso permite que, em qualquer ponto do desenvolvimento, exista algo real para mostrar a criadores-piloto, mesmo que a versão completa ainda não esteja 100% pronta.

### 0.3 Decisões de ferramentas para esta versão

Como o desenvolvimento será feito com Claude Code (terminal/VS Code) em vez de Lovable, a seção 30 (stack) e a seção 31 (prompt) foram reescritas: Claude Code passa a ser a ferramenta principal de geração e manutenção de código, trabalhando diretamente sobre um repositório Next.js + Supabase. O Lovable permanece citado apenas como alternativa possível para prototipação visual rápida, mas não é parte do caminho principal.

Sobre billing no MVP: optou-se por usar Stripe real (em modo de teste) desde a primeira onda, em vez de billing puramente manual. Isso custa um pouco mais de tempo no início, mas evita reescrever toda a camada de billing depois e já valida o fluxo completo de webhooks descrito na seção 11.

### 0.4 O que esta versão NÃO muda

Nenhuma funcionalidade, idioma, moeda, integração ou automação descrita nas versões 1.1 a 1.3 foi removida. As seções 1 a 41 permanecem como especificação de referência da versão completa. A v1.4 adiciona apenas: este parecer (seção 0), a seção 42 (plano de execução em ondas) e a atualização das seções 30 e 31 (stack e prompt) para Claude Code.

---

## 1. Resumo executivo

A tese do projeto é criar uma **plataforma SaaS white-label** que permita a criadores, canais, podcasts, igrejas, rádios, clubes, comunidades, eventos e influenciadores criarem seu próprio **app/PWA oficial**, funcionando como uma camada de organização, relacionamento e CRM de audiência.

A plataforma **não substitui YouTube, Instagram, TikTok, Discord, WhatsApp, Telegram ou qualquer outra rede social**. Pelo contrário: ela organiza a audiência e direciona o usuário para as plataformas oficiais onde o conteúdo já é consumido.

O app funcionaria como uma **“casca inteligente”**:

```text
Criador conecta suas redes
↓
Plataforma gera app/PWA oficial
↓
Fã acessa agenda, lives, links, loja, comunidade e notificações
↓
Ao clicar em vídeo, live, post ou comunidade
↓
Usuário é levado para YouTube, Instagram, TikTok, Discord, WhatsApp ou Telegram
```

O valor central não está em reproduzir vídeos ou competir com as redes. O valor está em:

```text
base própria de fãs
+
push notification próprio
+
agenda organizada
+
CRM de audiência
+
favoritos
+
patrocinadores
+
loja
+
eventos
+
relatórios de engajamento
```

A partir da versão 1.1 deste documento, fica definido também um pilar essencial de arquitetura:

```text
O app/PWA do criador é uma casca/client.
O cérebro do produto é o SaaS central.
O funcionamento do app depende da assinatura ativa na plataforma.
```

Isso permite que, mesmo que o app esteja publicado nas contas Apple Developer e Google Play Console do próprio criador, a plataforma consiga controlar acesso, recursos, conteúdo dinâmico, push, CRM, integrações e suspensão por inadimplência.

A partir da versão 1.2, fica definido também que o projeto deve nascer com visão global:

```text
MVP global
↓
Landing multilíngue
↓
Idiomas iniciais: inglês, português Brasil, espanhol e japonês
↓
Stripe Billing para recorrência internacional
↓
China continental em segunda etapa específica
```


A partir da versão 1.3, fica definida também a premissa operacional:

```text
Empresa inicialmente operada por uma pessoa só
↓
Self-service por padrão
↓
Automação de onboarding, billing, suporte e suspensão
↓
Operação humana apenas para exceções e planos premium
↓
Contratações somente após tração real
```

O produto deve ser desenhado para que uma única pessoa consiga operar centenas ou milhares de clientes sem atendimento manual recorrente.

A frase mais forte do produto seria:

> **Transforme sua audiência das redes sociais em uma base própria de fãs.**

---

## 2. Definição da tese

### 2.1 O que estamos propondo

Uma plataforma onde o criador consegue criar seu app ou PWA oficial com:

- identidade visual própria;
- links oficiais;
- agenda;
- calendário de lives;
- favoritos;
- lembretes;
- push notification;
- cadastro de fãs;
- e-mail;
- telefone;
- loja;
- patrocinadores;
- comunidade;
- relatórios;
- CRM de audiência.

O consumo do conteúdo continua acontecendo nas plataformas originais.

Exemplo:

```text
App Oficial do Criador
↓
Usuário clica em "Assistir ao vivo"
↓
Abre o app oficial do YouTube ou navegador
↓
Usuário assiste no YouTube
```

### 2.2 O que não estamos propondo

O produto **não** é:

- um player alternativo do YouTube;
- um app para baixar vídeos;
- um agregador pirata;
- uma cópia do YouTube;
- uma cópia do Instagram ou TikTok;
- uma plataforma para burlar anúncios;
- um sistema para acessar conteúdo de membros fora do YouTube;
- um app que automatiza views, likes, comentários ou inscrições;
- um webview simples sem utilidade própria;
- apenas um “app de links”.

Esse posicionamento é essencial para reduzir risco regulatório, risco com lojas de apps e risco de interpretação comercial.

---

## 3. Problema que o projeto resolve

Hoje os criadores têm audiência, mas dependem totalmente das plataformas.

Um criador pode ter:

- 100 mil inscritos no YouTube;
- 500 mil seguidores no Instagram;
- 1 milhão de visualizações mensais;
- comunidade no Discord;
- grupo no WhatsApp;
- canal no Telegram.

Mesmo assim, ele normalmente não tem controle direto sobre:

- e-mail dos fãs;
- telefone dos fãs;
- push notification próprio;
- segmentação da audiência;
- favoritos do usuário;
- lembretes de eventos;
- histórico de engajamento;
- calendário de consumo;
- relatórios próprios para patrocinadores.

A rede social controla a maior parte do relacionamento.

```text
Antes:
Criador tem seguidores, mas a plataforma controla a relação.

Depois:
Criador continua usando as plataformas, mas passa a ter uma base própria organizada.
```

A dor real não é “abrir o YouTube mais rápido”. Essa é apenas uma utilidade inicial.

A dor maior é:

> O criador não possui um CRM próprio da sua audiência.

---

## 4. Posicionamento estratégico

### 4.1 Posicionamento ruim

Evitar vender como:

> “Crie um app de links para seu canal.”

Isso parece simples demais e pode ser percebido como produto fraco.

### 4.2 Posicionamento correto

Vender como:

> “Tenha seu app oficial, sua base própria de fãs e suas notificações, sem depender só do algoritmo.”

Outras possibilidades:

> “Organize sua audiência, avise seus fãs e aumente o tráfego para seus conteúdos oficiais.”

> “Um CRM de audiência para criadores que vivem de YouTube, Instagram, TikTok e comunidades.”

> “O app oficial do seu canal, integrado às suas redes, loja, comunidade e patrocinadores.”

### 4.3 Categoria potencial

Possíveis nomes de categoria:

- Creator CRM App;
- Creator Hub;
- Creator OS;
- Fan CRM;
- Audience CRM;
- App Oficial para Criadores;
- Hub de Audiência;
- Central Oficial do Criador.

Para o Brasil, o termo mais claro comercialmente pode ser:

> **App Oficial do Criador**

Para posicionamento mais sofisticado:

> **Creator Hub + Fan CRM**

---

## 5. Exemplo prático: “App CazéTV”

Usando a CazéTV apenas como exemplo conceitual, sem qualquer associação ou uso de marca sem autorização, o app poderia ter:

```text
Home
- Ao vivo agora
- Próximos jogos
- Últimos vídeos
- Destaques

Agenda
- Jogos da semana
- Lives programadas
- Eventos especiais

Favoritos
- Meus programas favoritos
- Meus lembretes

Comunidade
- WhatsApp
- Discord
- Telegram

Loja
- Camisetas
- Produtos oficiais
- Cupons

Patrocinadores
- Ofertas dos parceiros
- Campanhas

Botão "Assistir"
↓
Abre YouTube
```

O app não transmite o conteúdo. Ele organiza e direciona.

---

## 6. Modelo operacional escolhido

O modelo mais seguro é o seguinte:

```text
App/PWA do criador
↓
Usuário clica em vídeo/live/post/comunidade
↓
O app abre a plataforma oficial correspondente
↓
Tudo acontece no YouTube, Instagram, TikTok, Discord, WhatsApp ou Telegram
```

Esse modelo reduz o risco porque:

- a visualização continua no YouTube;
- o chat ao vivo continua no YouTube;
- a monetização do vídeo continua no YouTube;
- os anúncios continuam no YouTube;
- o YouTube Premium continua funcionando no YouTube;
- os membros pagos continuam controlados pelo YouTube;
- as métricas principais do vídeo continuam no YouTube;
- o app apenas gera tráfego qualificado para as redes oficiais.

---

## 7. Situação dos inscritos, assinantes e membros do YouTube

### 7.1 Inscritos no canal

Se o fã é inscrito no canal no YouTube, nada muda. Ele continua inscrito no YouTube.

O app não precisa saber se o usuário é inscrito ou não no MVP.

O app pode incentivar:

```text
Inscreva-se no canal no YouTube
```

Mas a ação deve ocorrer dentro do YouTube ou por integração oficial autorizada.

### 7.2 YouTube Premium

Se o usuário é assinante do YouTube Premium, os benefícios continuam valendo normalmente, porque o conteúdo abre dentro do YouTube.

Exemplo:

```text
App do criador
↓
Abre vídeo no YouTube
↓
YouTube reconhece a conta Premium
↓
Benefícios continuam valendo conforme regras do YouTube
```

### 7.3 Membros pagos do canal

Se o canal possui membros pagos, o acesso a conteúdos exclusivos deve continuar sendo validado pelo próprio YouTube.

O app pode apontar para:

```text
Conteúdo exclusivo para membros
↓
Abrir no YouTube
↓
YouTube valida se o usuário tem acesso
```

O app não deve tentar liberar ou validar esse acesso por conta própria no MVP.

---

## 8. Políticas do YouTube — leitura prática

### 8.1 Modelo defensável

O modelo é defensável desde que o produto não tente substituir a experiência principal do YouTube.

O uso mais seguro é:

- listar informações públicas;
- organizar agenda;
- criar lembretes;
- direcionar para links oficiais;
- usar API oficial apenas quando necessário;
- abrir YouTube para consumo do vídeo;
- manter a monetização e experiência de consumo dentro do YouTube.

### 8.2 O que pode ser feito

Em princípio, é aceitável:

- mostrar informações públicas do canal;
- cadastrar links oficiais;
- mostrar calendário de lives;
- enviar push sobre eventos;
- criar botão “Assistir no YouTube”;
- usar a API oficial do YouTube para dados permitidos;
- criar CRM próprio com consentimento do usuário;
- ter loja, patrocinadores, comunidade e calendário próprios.

### 8.3 O que não fazer

Não fazer:

- baixar vídeos do YouTube;
- armazenar vídeos do YouTube;
- remover anúncios;
- bloquear recursos do YouTube;
- esconder a origem do YouTube;
- criar player próprio usando stream capturado;
- automatizar likes, views, comentários ou inscrições;
- manipular métricas;
- vender acesso a conteúdo público do YouTube como se fosse conteúdo próprio;
- confundir usuário dizendo que o app é substituto do YouTube.

### 8.4 Fontes oficiais relevantes

Documentos oficiais que precisam ser acompanhados durante o desenvolvimento:

- YouTube API Services Developer Policies:  
  https://developers.google.com/youtube/terms/developer-policies

- YouTube API Services Terms of Service:  
  https://developers.google.com/youtube/terms/api-services-terms-of-service

- YouTube Required Minimum Functionality:  
  https://developers.google.com/youtube/terms/required-minimum-functionality

- YouTube API Services Compliance Guide:  
  https://developers.google.com/youtube/terms/developer-policies-guide

Observação: este documento não substitui parecer jurídico. Antes de lançar em escala, o ideal é validar com advogado especializado em tecnologia, propriedade intelectual e plataformas digitais.

---

## 9. Risco principal: Apple App Store e Google Play

O maior risco do projeto não parece ser o YouTube. O maior risco está na aprovação dos apps nas lojas.

### 9.1 Apple App Store

A Apple exige que o app tenha utilidade real e não seja apenas um site empacotado ou uma experiência mínima.

Riscos:

- app parecer apenas uma lista de links;
- app parecer template repetitivo;
- muitos apps quase iguais publicados pela mesma conta;
- pouca funcionalidade nativa;
- ausência de experiência “app-like”.

Mitigação:

- PWA primeiro;
- apps nativos apenas para clientes mais maduros;
- cada criador publica pela própria conta Apple Developer;
- app com utilidade real: agenda, push, favoritos, CRM, patrocinadores, loja, eventos;
- customização real por criador;
- conteúdo, marca e comunidade próprios;
- política de privacidade clara;
- descrição de submissão explicando que o app é o canal oficial do criador.

Fonte oficial:

- Apple App Store Review Guidelines:  
  https://developer.apple.com/app-store/review/guidelines/

### 9.2 Google Play

O Google Play também exige funcionalidade mínima e experiência útil.

Riscos:

- app com pouco conteúdo;
- app quebrado;
- app sem utilidade própria;
- app repetitivo;
- app que pareça spam;
- app que só redireciona links.

Mitigação:

- app com funcionalidades reais;
- PWA antes de app nativo;
- Android como primeiro app nativo;
- testes internos;
- boa política de privacidade;
- compliance com políticas do Google Play.

Fonte oficial:

- Google Play Developer Content Policy:  
  https://play.google/developer-content-policy/

---

## 10. Estratégia de publicação nas lojas

### 10.1 Princípio

O app oficial do criador deve ser publicado, preferencialmente, pela conta do próprio criador/canal.

Evitar:

```text
Sua plataforma publica centenas de apps de criadores na mesma conta.
```

Preferir:

```text
Cada criador tem sua conta Apple Developer / Google Play Console
↓
Criador convida sua plataforma como admin/desenvolvedor
↓
Sua plataforma gera, envia e mantém o app
```

### 10.2 Fluxo ideal

Criar dentro do SaaS um módulo:

> **Publicar meu app**

Fluxo:

```text
1. Criador cria conta Apple Developer
2. Criador cria conta Google Play Console
3. Criador verifica empresa/marca
4. Criador convida sua plataforma como admin/developer
5. Criador sobe logo, descrição, screenshots e política de privacidade
6. Plataforma gera build
7. Plataforma envia para TestFlight / Google Play Internal Testing
8. Criador aprova
9. Plataforma envia para revisão
10. Plataforma acompanha status
11. Plataforma publica atualizações futuras
```

### 10.3 Ferramentas técnicas para publicação

Ferramentas que podem facilitar:

- Expo EAS Build;
- Expo EAS Submit;
- Fastlane;
- App Store Connect;
- Google Play Console;
- Google Play Developer API.

Fontes oficiais:

- Expo EAS Submit:  
  https://docs.expo.dev/submit/introduction/

- Expo Submit to App Stores:  
  https://docs.expo.dev/deploy/submit-to-app-stores/

- Expo EAS Build:  
  https://docs.expo.dev/build/setup/

- Fastlane:  
  https://fastlane.tools/

---


## 11. Controle de assinatura, bloqueio e suspensão por inadimplência

Esta seção é um pilar obrigatório do projeto.

Como o modelo comercial é SaaS mensal, o sistema precisa nascer preparado para controlar o funcionamento do app/PWA de cada criador de acordo com o status da assinatura.

Mesmo que o app esteja publicado na conta Apple Developer e Google Play Console do próprio criador, o app não deve ser autônomo. Ele deve depender do backend central da plataforma para carregar conteúdo, agenda, patrocinadores, notificações, CRM, loja, configurações e recursos ativos.

### 11.1 Princípio central

```text
App na Apple/Google = casca/client
PWA = casca/client
SaaS central = cérebro/backend/conteúdo/CRM/push/configuração/billing
```

O app deve abrir e consultar o backend da plataforma.

```text
App abre
↓
Consulta API pública do tenant/criador
↓
Backend verifica status da assinatura
↓
Backend verifica permissões e plano
↓
Backend retorna conteúdo normal, modo limitado ou modo suspenso
```

### 11.2 O que não pode acontecer

O app não pode ser publicado com tudo fixo dentro dele.

Evitar:

```text
App contém links, agenda, patrocinadores, loja e conteúdo fixos dentro do código.
```

Isso fragiliza o modelo, porque o criador poderia parar de pagar e o app continuaria funcionando com dados antigos.

O correto é:

```text
App leve
↓
Busca tudo no backend
↓
Backend decide o que mostrar conforme assinatura, plano e status do tenant
```

### 11.3 Status de billing e status do app

Cada criador/canal deve ter ao menos dois status separados:

```text
billing_status = situação financeira/comercial
app_status = comportamento do app para o fã
```

Exemplo:

```text
tenant_id: canal_x
plan: pro
billing_status: active | trialing | past_due | limited | suspended | canceled
app_status: active | limited | suspended | archived
```

### 11.4 Estados recomendados

#### Estado 1 — Trial

```text
billing_status = trialing
app_status = active
```

Uso durante teste gratuito ou piloto.

Permite:

- configurar app;
- cadastrar links;
- cadastrar eventos;
- testar push;
- testar CRM;
- publicar PWA;
- eventualmente bloquear publicação nativa até virar cliente pago.

#### Estado 2 — Ativo

```text
billing_status = active
app_status = active
```

Tudo funciona normalmente.

Permite:

- painel SaaS;
- edição de conteúdo;
- agenda;
- push;
- CRM;
- patrocinadores;
- loja;
- domínio personalizado;
- integrações;
- relatórios;
- APIs públicas;
- app/PWA funcionando normalmente.

#### Estado 3 — Atrasado / Past Due

Exemplo: 1 a 7 dias de atraso.

```text
billing_status = past_due
app_status = active
```

Comportamento:

- app continua funcionando;
- fã não percebe problema;
- criador recebe aviso no painel;
- sistema envia e-mails/WhatsApps de cobrança;
- cartão/pagamento pode ser retentado automaticamente;
- admin interno vê alerta.

Objetivo:

```text
Evitar impacto imediato na audiência por um atraso curto.
```

#### Estado 4 — Limitado

Exemplo: 8 a 15 dias de atraso.

```text
billing_status = limited
app_status = limited
```

Bloqueios recomendados:

- envio de novas notificações push;
- criação de novos eventos;
- edição de patrocinadores;
- novas campanhas;
- exportação de CRM;
- integrações automáticas;
- domínio personalizado, se fizer sentido;
- acesso a relatórios avançados.

O app ainda pode exibir conteúdo básico já publicado, mas o criador perde capacidade operacional.

Mensagem no painel:

```text
Sua assinatura está pendente. Regularize o pagamento para reativar todos os recursos.
```

Mensagem para o fã:

```text
Nenhuma mensagem de inadimplência deve ser exibida nesta fase.
```

#### Estado 5 — Suspenso

Exemplo: acima de 15 ou 30 dias de atraso.

```text
billing_status = suspended
app_status = suspended
```

Bloqueios recomendados:

- painel SaaS bloqueado;
- APIs públicas não entregam conteúdo dinâmico;
- app entra em modo indisponível;
- push desligado;
- CRM inacessível;
- patrocinadores ocultos;
- loja ocultada;
- novos cadastros bloqueados;
- integrações pausadas;
- domínio personalizado desativado ou apontando para tela neutra;
- atualizações de app suspensas.

Mensagem para o fã deve ser neutra, sem expor inadimplência:

```text
Este app está temporariamente indisponível.
Acompanhe o criador pelos canais oficiais.
```

Opcionalmente, exibir links oficiais mínimos, se isso estiver previsto na política do produto.

#### Estado 6 — Cancelado

```text
billing_status = canceled
app_status = archived
```

Comportamento:

- painel bloqueado;
- app em tela de encerramento;
- dados preservados por período contratual;
- exportação permitida apenas conforme contrato e LGPD;
- domínio liberado após prazo;
- tokens de integração revogados;
- push removido;
- app nativo deixa de receber manutenção.

### 11.5 O que deve ser bloqueado em caso de inadimplência

O bloqueio não acontece na Apple Store ou Google Play.

O bloqueio acontece nos serviços centrais:

```text
backend
+
painel SaaS
+
conteúdo dinâmico
+
agenda
+
push notifications
+
CRM
+
favoritos
+
patrocinadores
+
loja
+
domínio personalizado
+
integrações
+
relatórios
+
atualizações
```

### 11.6 O que o criador ainda controla

Se o app estiver publicado na conta Apple/Google do criador, ele controla:

- conta Apple Developer;
- conta Google Play Console;
- dados cadastrais da loja;
- titularidade da publicação;
- permissões concedidas à plataforma;
- eventual remoção do app da loja.

Mas isso não significa que ele controle o backend, a tecnologia, as APIs, o CRM, o push, o código-fonte ou a infraestrutura SaaS.

### 11.7 O que a plataforma controla

A plataforma controla:

- código-base;
- backend;
- APIs;
- painel SaaS;
- banco de dados;
- tenant;
- permissões;
- plano;
- feature flags;
- billing;
- push;
- integrações;
- CRM;
- relatórios;
- publicação assistida;
- atualizações;
- templates;
- infraestrutura.

### 11.8 API de inicialização obrigatória

Todo app/PWA deve chamar uma API de inicialização.

Exemplo:

```text
GET /api/public/app-config?tenant=canal_x
```

ou:

```text
GET /api/v1/tenants/{tenant_slug}/runtime-config
```

Resposta quando ativo:

```json
{
  "tenantId": "canal_x",
  "appStatus": "active",
  "billingStatus": "active",
  "theme": {
    "primaryColor": "#000000",
    "secondaryColor": "#ffffff",
    "logoUrl": "https://..."
  },
  "features": {
    "events": true,
    "push": true,
    "favorites": true,
    "sponsors": true,
    "store": true,
    "community": true
  },
  "socialLinks": [],
  "events": [],
  "sponsors": [],
  "storeLinks": []
}
```

Resposta quando limitado:

```json
{
  "tenantId": "canal_x",
  "appStatus": "limited",
  "billingStatus": "limited",
  "message": null,
  "features": {
    "events": true,
    "push": false,
    "favorites": true,
    "sponsors": false,
    "store": true,
    "community": true
  },
  "socialLinks": [],
  "events": [],
  "sponsors": [],
  "storeLinks": []
}
```

Resposta quando suspenso:

```json
{
  "tenantId": "canal_x",
  "appStatus": "suspended",
  "billingStatus": "suspended",
  "publicMessage": "Este app está temporariamente indisponível.",
  "showOfficialLinks": true,
  "socialLinks": [
    {
      "platform": "youtube",
      "url": "https://youtube.com/..."
    },
    {
      "platform": "instagram",
      "url": "https://instagram.com/..."
    }
  ]
}
```

### 11.9 Cache e controle de expiração

Para o bloqueio funcionar, o app não deve manter cache longo de conteúdo sensível.

Regras recomendadas:

```text
configuração crítica: cache curto
status de assinatura: sem cache longo
conteúdo público: cache moderado
patrocinadores: cache curto
push: sempre controlado pelo backend
```

Sugestão:

- `runtime-config`: cache de 1 a 5 minutos;
- `events`: cache de 5 a 15 minutos;
- `sponsors`: cache de 1 a 5 minutos;
- `socialLinks`: cache de 15 a 60 minutos;
- `billing_status`: sempre validado no backend antes de recursos críticos.

### 11.10 Feature flags por plano

Além do status de pagamento, o SaaS deve controlar recursos por plano.

Exemplo:

```text
starter:
- PWA
- links
- agenda básica
- push limitado
- CRM básico

pro:
- domínio próprio
- push maior
- patrocinadores
- loja
- relatórios

business:
- multiusuários
- segmentação
- app Android
- publicação assistida

enterprise:
- iOS
- integrações avançadas
- SLA
- customização
```

Cada recurso deve ser ativado por feature flag.

Exemplo:

```json
{
  "features": {
    "customDomain": true,
    "pushNotifications": true,
    "advancedCRM": false,
    "nativeAndroid": false,
    "nativeIOS": false,
    "sponsorCampaigns": true,
    "storeLinks": true,
    "teamMembers": 3
  }
}
```

### 11.11 Billing provider e webhooks

O sistema deve receber eventos do provedor de pagamento.

Eventos esperados:

```text
subscription.created
subscription.renewed
invoice.paid
invoice.payment_failed
subscription.past_due
subscription.canceled
subscription.suspended
charge.refunded
```

Fluxo:

```text
Pagamento falhou
↓
Webhook recebido
↓
Atualiza billing_status para past_due
↓
Envia aviso ao criador
↓
Após prazo, altera para limited
↓
Após novo prazo, altera para suspended
↓
App passa a receber runtime-config suspenso
```

### 11.12 Tabelas adicionais para billing e bloqueio

Além das tabelas já previstas, incluir:

#### subscriptions

```text
id
tenant_id
plan_id
billing_provider
provider_customer_id
provider_subscription_id
status
current_period_start
current_period_end
trial_ends_at
cancel_at
canceled_at
created_at
updated_at
```

#### billing_events

```text
id
tenant_id
subscription_id
event_type
provider_event_id
payload
processed_at
created_at
```

#### tenant_entitlements

```text
id
tenant_id
feature_key
enabled
limit_value
used_value
starts_at
ends_at
created_at
updated_at
```

#### tenant_runtime_status

```text
id
tenant_id
billing_status
app_status
suspension_reason
public_message
show_official_links
last_checked_at
created_at
updated_at
```

#### app_access_logs

```text
id
tenant_id
fan_id
app_status_at_access
path
device
ip_address
user_agent
created_at
```

### 11.13 UX de suspensão

O app nunca deve quebrar, ficar em tela branca ou mostrar erro técnico.

Errado:

```text
500 Internal Server Error
```

Errado:

```text
Cliente inadimplente.
```

Correto:

```text
Este app está temporariamente indisponível.
Acompanhe o criador pelos canais oficiais.
```

Opcional:

```text
YouTube
Instagram
TikTok
Site oficial
```

### 11.14 Painel do criador durante inadimplência

O painel deve ter níveis.

#### Past due

Permite acesso, mas mostra alerta.

```text
Identificamos uma pendência na sua assinatura. Regularize para evitar limitações.
```

#### Limited

Permite acesso restrito.

```text
Sua conta está em modo limitado. Regularize a assinatura para voltar a enviar notificações, editar campanhas e acessar relatórios completos.
```

#### Suspended

Bloqueia quase tudo, exceto:

- pagamento;
- atualização de cartão;
- visualização da pendência;
- acesso a termos;
- suporte;
- solicitação de reativação.

### 11.15 Contrato e termos de uso

O contrato precisa deixar claro:

```text
A publicação do aplicativo nas contas Apple Developer e Google Play Console do Cliente não transfere a propriedade da plataforma, código-fonte, backend, APIs, painel SaaS, infraestrutura de notificações, CRM, integrações, templates ou tecnologia licenciada.

O funcionamento do aplicativo depende da assinatura ativa da plataforma. Em caso de inadimplência, cancelamento ou violação contratual, a Contratada poderá suspender o acesso ao painel, APIs, notificações, atualizações, integrações, CRM, relatórios, exibição dinâmica de conteúdo e demais recursos vinculados ao serviço.
```

Também deve prever:

- o que acontece após cancelamento;
- prazo de retenção dos dados;
- possibilidade de exportação;
- responsabilidades sobre dados dos fãs;
- responsabilidades sobre conteúdo do criador;
- limites de suporte;
- uso de marca;
- publicação nas lojas;
- revogação de acessos;
- propriedade intelectual do código.

### 11.16 Risco se esse pilar não for implementado

Sem esse controle, o modelo fica frágil.

Riscos:

- criador para de pagar e continua com app funcionando;
- conteúdo fica fixo dentro do app;
- plataforma perde poder de cobrança;
- app vira ativo do cliente sem dependência do SaaS;
- manutenção fica confusa;
- recursos pagos não são controlados;
- o modelo de assinatura perde força.

### 11.17 Requisito obrigatório do MVP

Desde o primeiro MVP, incluir:

```text
tenant.billing_status
tenant.app_status
runtime-config
feature flags
bloqueio de painel
bloqueio de push
bloqueio de edição
modo suspenso no app
```

Mesmo que o billing ainda seja manual, a arquitetura precisa estar pronta.

### 11.18 Decisão consolidada

Decisão do projeto:

```text
O app/PWA será sempre dependente do backend central.
O app publicado nas lojas será uma camada cliente.
O SaaS controlará assinatura, recursos, conteúdo, push, CRM, integrações e suspensão.
Em caso de não pagamento, a plataforma não remove o app da loja, mas suspende os serviços centrais que fazem o app funcionar.
```

---


## 12. Internacionalização, landing page global e billing recorrente

Esta seção é um pilar obrigatório do projeto a partir da versão 1.2.

O produto não deve nascer como um SaaS brasileiro que será traduzido depois. Ele deve nascer como um **SaaS global para criadores de conteúdo**, com landing page multilíngue, estrutura técnica internacionalizada, cobrança recorrente internacional e expansão planejada por mercado.

### 12.1 Decisão estratégica

Decisão consolidada:

```text
O projeto nasce mundial desde o MVP.
O Brasil é um mercado inicial importante, mas não é o único.
O Japão entra no MVP global.
A China continental fica para uma segunda etapa própria.
Stripe será o provedor principal de pagamento recorrente no MVP global.
```

### 12.2 Idiomas iniciais do MVP

Idiomas e rotas iniciais:

```text
/en       English
/pt-br    Português Brasil
/es       Español
/ja-jp    日本語
```

Idioma padrão:

```text
/en
```

A página raiz pode funcionar como `x-default`, com seletor de idioma e/ou detecção leve baseada no navegador, mas sem impedir o usuário de trocar idioma.

### 12.3 Mercados prioritários da primeira fase

Primeira fase:

```text
Estados Unidos / mercado global em inglês
Brasil
América Latina / Espanha
Japão
```

Objetivo:

- validar a tese com criadores em mercados diferentes;
- não limitar o produto ao Brasil;
- criar desde o começo uma base técnica multilíngue;
- permitir SEO internacional;
- preparar checkout e billing internacional;
- testar precificação em USD, BRL e JPY.

### 12.4 China continental como segunda etapa

A China continental não entra no MVP operacional.

Motivo:

O mercado chinês muda canais, pagamento, compliance, infraestrutura, app stores e lógica de distribuição.

Para China continental, será necessário estudar:

```text
Bilibili
Douyin
WeChat Channels
Xiaohongshu / RED
Kuaishou
Weibo
WeChat Official Accounts
WeChat Groups
Alipay
WeChat Pay
ICP filing / ICP license
parceiro local
infraestrutura local ou compatível
app stores Android chinesas
compliance de dados
```

Decisão:

```text
Chinês simplificado e operação China continental ficam para a fase 2.
```

Isso não impede que criadores chineses fora da China continental usem a versão em inglês no MVP global, mas a operação local chinesa não deve ser prometida na primeira versão.

### 12.5 Estrutura recomendada da landing page global

A landing page deve ter a mesma estrutura-base em todos os idiomas, mas com copy localizada.

Estrutura sugerida:

```text
Hero
↓
Problema: você depende do algoritmo
↓
Solução: tenha seu app oficial
↓
Como funciona
↓
Funcionalidades
↓
Exemplos de uso
↓
Planos
↓
FAQ
↓
Call to action
```

### 12.6 Mensagem central por idioma

#### Inglês

```text
Create your official creator app.
Own your audience.
Notify your fans.
Send them to your official content.
```

#### Português Brasil

```text
Crie seu app oficial.
Organize sua audiência.
Avise seus fãs.
Leve todos para seus conteúdos oficiais.
```

#### Espanhol

```text
Crea tu app oficial como creador.
Organiza tu audiencia.
Notifica a tus fans.
Llévalos a tus contenidos oficiales.
```

#### Japonês

```text
あなた専用の公式クリエイターアプリを作成。
ファンを管理し、通知を届け、
公式コンテンツへ直接案内できます。
```

Observação: o japonês deve ser revisado por nativo antes de campanhas pagas ou lançamento comercial.

### 12.7 Copy principal da landing

A proposta precisa evitar parecer apenas “app de links”.

Mensagem recomendada:

```text
Seu app oficial + CRM de audiência.
Centralize agenda, notificações, comunidade, loja, patrocinadores e links para seus conteúdos oficiais.
```

Em inglês:

```text
Your official creator app + audience CRM.
Centralize your schedule, notifications, community, store, sponsors and official content links.
```

Em espanhol:

```text
Tu app oficial + CRM de audiencia.
Centraliza agenda, notificaciones, comunidad, tienda, patrocinadores y enlaces a tus contenidos oficiales.
```

Em japonês:

```text
公式クリエイターアプリ + オーディエンスCRM。
スケジュール、通知、コミュニティ、ストア、スポンサー、公式コンテンツリンクを一元管理。
```

### 12.8 Arquitetura técnica de internacionalização

Recomendação:

```text
Next.js + App Router + i18n
```

Estrutura sugerida:

```text
/app/[locale]/page.tsx
/app/[locale]/pricing/page.tsx
/app/[locale]/features/page.tsx
/app/[locale]/faq/page.tsx
/messages/en.json
/messages/pt-br.json
/messages/es.json
/messages/ja-jp.json
```

Localidades suportadas no MVP:

```text
en
pt-br
es
ja-jp
```

Campos relevantes no banco:

```text
preferred_locale
default_locale
supported_locales
```

### 12.9 SEO internacional

A estratégia de SEO internacional deve seguir três princípios:

1. URLs separadas por idioma.
2. `hreflang` entre versões equivalentes.
3. `x-default` para a página seletora/default.

Exemplo:

```html
<link rel="alternate" hreflang="en" href="https://creatorhub.com/en" />
<link rel="alternate" hreflang="pt-BR" href="https://creatorhub.com/pt-br" />
<link rel="alternate" hreflang="es" href="https://creatorhub.com/es" />
<link rel="alternate" hreflang="ja-JP" href="https://creatorhub.com/ja-jp" />
<link rel="alternate" hreflang="x-default" href="https://creatorhub.com/" />
```

O Google recomenda usar URLs diferentes para versões em idiomas diferentes e informar versões localizadas com `hreflang`.

### 12.10 O que não fazer em internacionalização

Evitar:

```text
tradução automática sem revisão;
mesma URL mudando idioma apenas por cookie;
redirecionamento obrigatório por IP;
misturar idiomas na mesma página;
traduzir apenas menu e deixar conteúdo principal em outro idioma;
lançar Japão com copy informal demais;
prometer China continental no MVP;
```

O usuário deve conseguir trocar idioma manualmente.

### 12.11 Landing page e painel SaaS

Na primeira versão, separar:

```text
Landing page multilíngue
↓
Painel SaaS inicialmente em inglês e português
↓
Espanhol e japonês no painel em fase seguinte, se necessário
```

Mas o ideal técnico é que o painel já esteja preparado para tradução desde o começo.

### 12.12 Idioma do app/PWA gerado para o criador

O criador deve escolher:

```text
idioma principal do app
idiomas adicionais
idioma padrão
```

Exemplo:

```text
Criador brasileiro:
pt-br principal
en opcional
es opcional

Criador japonês:
ja-jp principal
en opcional

Criador global:
en principal
es/pt-br/ja-jp opcionais
```

No MVP, o app do fã pode começar com apenas um idioma por criador, mas a estrutura deve permitir múltiplos idiomas por tenant.

### 12.13 Billing global com Stripe

Stripe será o provedor principal do MVP global.

Componentes recomendados:

```text
Stripe Billing
Stripe Checkout
Stripe Customer Portal
Stripe Tax
Stripe Webhooks
```

Uso esperado:

```text
Stripe Billing
↓
planos e assinaturas recorrentes

Stripe Checkout
↓
checkout hospedado e seguro

Stripe Customer Portal
↓
cliente gerencia cartão, faturas, assinatura e cancelamento

Stripe Tax
↓
cálculo de impostos quando aplicável

Stripe Webhooks
↓
atualização automática de billing_status e app_status
```

### 12.14 Recorrência por cartão como método principal

O método principal do MVP deve ser:

```text
assinatura recorrente por cartão
```

Fluxo:

```text
Criador escolhe plano
↓
Vai para Stripe Checkout
↓
Cadastra cartão
↓
Stripe cria assinatura recorrente
↓
Webhook confirma pagamento
↓
SaaS ativa tenant
↓
Stripe tenta cobrar todo mês
↓
Se falhar: past_due
↓
Se continuar pendente: limited
↓
Se continuar sem pagamento: suspended
```

### 12.15 Conexão entre Stripe e bloqueio do app

Os eventos da Stripe alimentam diretamente os status definidos na seção de bloqueio.

Exemplo:

```text
invoice.paid
↓
billing_status = active
app_status = active

invoice.payment_failed
↓
billing_status = past_due
app_status = active

pagamento pendente após X dias
↓
billing_status = limited
app_status = limited

pagamento pendente após Y dias
↓
billing_status = suspended
app_status = suspended
```

### 12.16 Webhooks essenciais da Stripe

Eventos a tratar:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.paid
invoice.payment_failed
invoice.payment_action_required
payment_method.attached
customer.updated
```

Eventos internos derivados:

```text
subscription_activated
subscription_past_due
subscription_limited
subscription_suspended
subscription_canceled
subscription_reactivated
```

### 12.17 Camada abstrata de billing_provider

Mesmo usando Stripe no MVP, o código não deve ficar preso diretamente à Stripe.

Criar conceito:

```text
billing_provider
```

Valores possíveis:

```text
stripe
manual
paddle_future
adyen_future
mercadopago_future
local_china_provider_future
```

No MVP, implementar apenas:

```text
stripe
manual
```

O provider `manual` pode ser útil para pilotos, enterprise, cortesia, contratos offline ou testes.

### 12.18 Moedas e preços

Moedas iniciais recomendadas:

```text
USD — padrão global
BRL — Brasil
JPY — Japão
EUR — fase seguinte
```

Exemplo hipotético de preços:

```text
Starter — US$ 19/mês
Pro — US$ 49/mês
Business — US$ 149/mês
Enterprise — custom
```

Brasil:

```text
Starter — R$ 99/mês
Pro — R$ 299/mês
Business — R$ 999/mês
Enterprise — custom
```

Japão:

```text
Starter — ¥2,900/mês
Pro — ¥7,900/mês
Business — ¥22,000/mês
Enterprise — custom
```

Observação: valores são hipóteses de produto e devem ser validados comercialmente.

### 12.19 Japão no MVP global

Japão entra no MVP com:

```text
Idioma: ja-jp
Moeda: JPY
Landing localizada
Checkout Stripe
Cartão recorrente como método principal
Copy mais formal e confiável
```

Atenção:

- JCB é relevante no Japão e pode funcionar como cartão.
- Métodos locais como Konbini e PayPay devem ser avaliados com cuidado antes de promessa comercial.
- Nem todo método local é ideal para recorrência mensal.
- A primeira versão deve se apoiar em cartão recorrente.
- Métodos locais podem ser testados depois para planos anuais, pagamentos únicos ou mercados específicos, se forem compatíveis com o fluxo de assinatura.

### 12.20 Stripe Tax e fiscalidade internacional

Como o produto será SaaS global, prever:

```text
VAT na Europa
sales tax nos EUA
GST em alguns países
impostos sobre serviços digitais
localização do cliente
tipo de cliente: pessoa física ou empresa
validação de VAT ID, quando aplicável
fatura/receipt
```

Stripe Tax pode ajudar no cálculo e coleta, mas não substitui análise contábil/fiscal.

Decisão prática:

```text
MVP:
usar Stripe Tax ou deixar estrutura preparada para ativação.

Antes de escalar:
validar com contador/tributarista internacional.
```

### 12.21 Modelo de dados adicional para internacionalização

Adicionar ou prever:

#### locales

```text
id
code
name
native_name
is_active
is_default
created_at
updated_at
```

Exemplos:

```text
en
pt-br
es
ja-jp
```

#### localized_content

```text
id
tenant_id
entity_type
entity_id
locale
field_key
field_value
created_at
updated_at
```

#### landing_pages

```text
id
locale
slug
title
meta_title
meta_description
content_json
is_published
created_at
updated_at
```

#### pricing_localizations

```text
id
plan_id
locale
currency
amount
display_price
billing_interval
created_at
updated_at
```

#### tenant_locale_settings

```text
id
tenant_id
default_locale
supported_locales
fallback_locale
created_at
updated_at
```

### 12.22 Modelo de dados adicional para Stripe

Complementar a seção de billing com campos específicos:

#### customers

```text
id
tenant_id
billing_provider
provider_customer_id
email
name
country
default_currency
tax_id
created_at
updated_at
```

#### prices

```text
id
plan_id
billing_provider
provider_price_id
currency
unit_amount
interval
region
is_active
created_at
updated_at
```

#### invoices

```text
id
tenant_id
subscription_id
billing_provider
provider_invoice_id
status
currency
amount_due
amount_paid
hosted_invoice_url
invoice_pdf
due_date
paid_at
created_at
updated_at
```

#### payment_methods

```text
id
tenant_id
billing_provider
provider_payment_method_id
type
brand
last4
exp_month
exp_year
is_default
created_at
updated_at
```

### 12.23 UX de pricing global

A página de preços deve:

- detectar idioma;
- permitir troca manual de moeda, se viável;
- mostrar moeda padrão por região;
- deixar claro que impostos podem ser adicionados;
- evitar confusão com conversão cambial;
- suportar plano mensal e anual;
- oferecer desconto no anual;
- levar para Stripe Checkout.

Exemplo:

```text
Monthly
Annual — save 20%
```

### 12.24 Planos mensais e anuais

Recomendação:

```text
mensal = validação e entrada
anual = melhora caixa e reduz churn
```

Stripe deve criar `prices` separados:

```text
starter_monthly_usd
starter_yearly_usd
pro_monthly_usd
pro_yearly_usd
business_monthly_usd
business_yearly_usd
```

E versões por moeda:

```text
pro_monthly_brl
pro_monthly_jpy
```

### 12.25 Trial e onboarding global

Ofertas possíveis:

```text
7 dias grátis
14 dias grátis
trial sem cartão
trial com cartão
setup assistido
```

Recomendação inicial:

```text
trial com cartão para planos pagos globais
pilotos manuais para primeiros criadores estratégicos
```

Motivo:

- reduz abuso;
- já testa recorrência;
- ativa webhooks;
- valida cobrança real.

### 12.26 Termos e políticas por idioma

No MVP global, pelo menos:

```text
Terms of Service — inglês
Privacy Policy — inglês
```

E versões traduzidas para:

```text
Português Brasil
Espanhol
Japonês
```

A versão juridicamente vinculante pode ser a em inglês, mas isso deve ser explicitado nos termos.

Para Brasil e Japão, revisar com apoio jurídico local conforme tração.

### 12.27 Prompt para landing page multilíngue

Prompt base para geração de landing:

```text
Crie uma landing page global para um SaaS chamado Creator Hub.

O produto permite que criadores de conteúdo criem seu app/PWA oficial com CRM de audiência, agenda, push notifications, favoritos, loja, patrocinadores e links para seus conteúdos oficiais no YouTube, Instagram, TikTok, Discord, WhatsApp e Telegram.

O produto não substitui as redes sociais. Ele organiza a audiência e direciona o fã para os canais oficiais.

A landing deve ter versões em:
- inglês
- português Brasil
- espanhol
- japonês

Estrutura:
- hero
- problema
- solução
- como funciona
- funcionalidades
- casos de uso
- planos
- FAQ
- CTA

Tom:
- global
- confiável
- SaaS B2B
- simples para criadores
- sem parecer apenas uma página de links
```

### 12.28 Decisão consolidada de internacionalização

```text
O produto nasce global.
Idiomas iniciais: en, pt-br, es, ja-jp.
China continental fica para fase 2.
Stripe é o provedor principal de billing recorrente.
Cartão recorrente é o método principal do MVP.
A arquitetura deve suportar múltiplas moedas, múltiplos idiomas e múltiplos billing providers no futuro.
```

---


## 13. Premissa operacional: empresa de uma pessoa só

Esta é uma premissa obrigatória do projeto.

O Creator Hub deve nascer como uma empresa inicialmente operada por uma pessoa só. Isso não significa que a empresa nunca contratará. Significa que produto, processos, tecnologia e modelo comercial devem permitir que o fundador opere o negócio sozinho até existir receita e escala que justifiquem novas pessoas.

### Princípio central

```text
Self-service by default
Automação por padrão
Operação humana por exceção
Customização apenas quando bem remunerada
```

Toda nova funcionalidade deve responder:

> Esta funcionalidade pode ser oferecida e mantida por uma pessoa só sem criar operação manual recorrente?

Se a resposta for não, deve-se:

1. automatizar antes de lançar;
2. simplificar o recurso;
3. transformá-lo em add-on premium;
4. deixá-lo para fase posterior.

### O que deve ser automático

Desde o MVP, automatizar ao máximo:

- criação da conta;
- confirmação de e-mail;
- escolha do plano;
- checkout;
- trial;
- cobrança recorrente;
- ativação do tenant;
- criação do PWA;
- escolha de template;
- aplicação de logo e cores;
- cadastro de links;
- cadastro de agenda;
- envio de push;
- criação de subdomínio;
- upgrade e downgrade;
- troca de cartão;
- acesso a faturas;
- cancelamento;
- cobrança em atraso;
- limitação;
- suspensão;
- reativação após pagamento;
- e-mails transacionais;
- onboarding;
- base de conhecimento;
- respostas a dúvidas frequentes;
- alertas internos;
- monitoramento;
- relatórios básicos.

### O que deve ser evitado no início

Evitar:

- desenvolvimento sob medida para clientes pequenos;
- publicação manual de app para todos os planos;
- onboarding por reunião obrigatória;
- WhatsApp aberto como canal principal de suporte;
- migração manual de dados;
- produção manual de conteúdo;
- criação manual de landing pages por cliente;
- configuração manual de integrações;
- suporte telefônico;
- consultoria incluída em planos baratos;
- relatórios montados manualmente;
- layout exclusivo em planos self-service;
- operação de campanhas em nome do criador.

### SaaS, não agência

```text
Agência:
cada cliente exige trabalho humano contínuo

SaaS:
o cliente configura, usa e paga sem depender de atendimento humano
```

Serviço gerenciado poderá existir, mas somente como:

- plano premium;
- contrato Enterprise;
- setup fee;
- escopo fechado;
- quantidade controlada de clientes;
- margem suficiente.

### Hierarquia operacional dos planos

#### Starter

```text
100% self-service
Sem reunião obrigatória
Sem customização
Base de conhecimento + IA
Suporte por ticket
```

#### Pro

```text
Self-service
Suporte assíncrono
Templates e automações
Sem operação manual recorrente
```

#### Business

```text
Self-service avançado
Suporte prioritário
Configurações padronizadas
Sem desenvolvimento exclusivo incluído
```

#### App Store / Enterprise

```text
Setup fee obrigatório
Publicação assistida
Atendimento humano limitado
Checklist padronizado
Poucos clientes simultâneos
```

### App nativo como produto premium

Para uma empresa de uma pessoa só, app nativo não deve ser o produto central do MVP.

Motivos:

- revisão da Apple;
- revisão do Google;
- contas Developer;
- screenshots;
- rejeições;
- correções;
- builds;
- atualização de versões;
- suporte;
- manutenção por app.

Decisão:

```text
PWA = produto principal self-service
App nativo = upsell premium e posterior
```

### Onboarding self-service

Fluxo recomendado:

```text
Criador cria conta
↓
Escolhe idioma
↓
Escolhe plano
↓
Paga via Stripe
↓
Seleciona template
↓
Adiciona logo, cores e nome
↓
Conecta ou cadastra redes
↓
Cadastra primeiro evento
↓
Ativa push
↓
Publica PWA
↓
Recebe checklist de próximos passos
```

O sistema deve mostrar o progresso do onboarding e apontar automaticamente o que falta.

### IA no onboarding e suporte

A IA pode ajudar a:

- gerar descrição do app;
- sugerir headline;
- traduzir conteúdo;
- sugerir categorias;
- criar texto de push;
- criar FAQ;
- explicar recursos;
- detectar campos faltantes;
- sugerir próximos passos.

A IA deve reduzir suporte, não criar mais trabalho operacional.

### Canais de suporte

Ordem recomendada:

```text
1. Base de conhecimento
2. Assistente de IA
3. Formulário/ticket
4. E-mail
5. Reunião apenas para Enterprise
```

Evitar suporte telefônico e WhatsApp aberto nos planos de entrada.

### Base de conhecimento

Documentar desde o início:

- criação da conta;
- conexão das redes;
- cadastro de agenda;
- envio de push;
- domínio;
- cobrança;
- cancelamento;
- reativação;
- publicação de PWA;
- pedido de app nativo;
- relatórios;
- privacidade.

Cada dúvida recorrente deve gerar:

```text
nova documentação
ou melhoria no produto
ou automação
```

### Operação orientada a exceções

O fundador não deve verificar todos os clientes. O painel admin deve mostrar apenas:

- clientes com erro;
- clientes em risco de churn;
- inadimplentes;
- falhas de webhook;
- falhas de push;
- integrações expiradas;
- domínios quebrados;
- oportunidades de upgrade;
- incidentes críticos.

### Observabilidade e alertas

Ferramentas possíveis:

```text
Sentry
PostHog
Stripe Dashboard
Supabase logs
Vercel logs
Better Uptime
Resend ou Postmark
```

Alertas mínimos:

- erro acima do normal;
- webhook Stripe falhou;
- push falhou;
- tenant não publicou;
- domínio quebrou;
- integração expirou;
- banco próximo do limite;
- custo de infraestrutura acima do esperado;
- runtime-config indisponível.

### Métricas operacionais do solo founder

Acompanhar:

- tickets por 100 clientes;
- horas de suporte por semana;
- percentual de onboarding concluído sem ajuda;
- percentual de clientes que exigem intervenção;
- custo operacional por tenant;
- tarefas manuais recorrentes;
- tempo gasto com app nativo;
- tempo gasto com cobrança;
- tempo gasto com traduções.

Metas iniciais:

```text
80%+ dos clientes sem contato humano no onboarding
90%+ das cobranças processadas automaticamente
95%+ das suspensões e reativações automáticas
menos de 5 tickets por 100 clientes por semana
```

### Regra de contratação

Contratar por gargalo comprovado.

#### Suporte

Contratar quando:

- suporte ultrapassar 15 a 20 horas semanais;
- tempo de resposta comprometer retenção;
- tickets crescerem mais rápido que MRR.

#### Desenvolvimento

Contratar quando:

- backlog crítico impedir crescimento;
- manutenção consumir a maior parte da semana;
- segurança ou infraestrutura exigirem especialização.

#### Vendas

Contratar quando:

- existir demanda inbound suficiente;
- leads qualificados ficarem sem atendimento;
- ticket Enterprise justificar venda consultiva.

#### Customer Success

Contratar quando:

- Business/Enterprise representarem receita relevante;
- expansão e retenção exigirem acompanhamento.

### Critério de entrada de funcionalidade

| Critério | Pergunta |
|---|---|
| Automação | Pode funcionar sem operação manual? |
| Suporte | Vai gerar muitos tickets? |
| Escala | Serve para muitos clientes? |
| Receita | Aumenta conversão, ARPA ou retenção? |
| Complexidade | Exige integração difícil? |
| Manutenção | Cria obrigação recorrente? |
| Compliance | Traz risco jurídico? |
| Solo founder | Uma pessoa consegue manter? |

Classificação:

```text
GO = entra no produto padrão
PREMIUM = entra em plano caro/add-on
LATER = fica para fase posterior
NO = não se encaixa no modelo
```

### Stack orientada à automação

```text
Lovable / Codex / Cursor
↓
desenvolvimento assistido por IA

Next.js + Vercel
↓
deploy automático

Supabase
↓
auth, banco, storage, RLS e funções

Stripe
↓
billing, checkout, portal, recorrência e webhooks

OneSignal
↓
push

Resend ou Postmark
↓
e-mails transacionais

Sentry
↓
monitoramento de erros

PostHog
↓
analytics de produto

Crisp, Intercom ou equivalente
↓
suporte e base de conhecimento
```

### Automação de billing

O fundador não deve cobrar clientes manualmente.

Automatizar:

- criação da assinatura;
- emissão de fatura;
- tentativa de cobrança;
- retentativas;
- aviso de falha;
- atualização de cartão;
- período de tolerância;
- limitação;
- suspensão;
- reativação;
- cancelamento;
- recibos;
- upgrade/downgrade.

### Política de customização

Planos self-service podem alterar:

- cores;
- logo;
- tipografia disponível;
- ordem dos módulos;
- banners;
- domínio.

Não incluem:

- layout exclusivo;
- feature exclusiva;
- integração exclusiva;
- fluxo exclusivo;
- mudança estrutural.

Customização profunda será Enterprise, com escopo e preço separados.

### Risco de não seguir essa premissa

Sem essa disciplina, o projeto pode:

- virar agência;
- acumular suporte;
- depender do fundador;
- ter margem baixa;
- travar crescimento;
- exigir contratação antes da receita;
- criar experiência inconsistente.

### Decisão consolidada

```text
O Creator Hub será construído para operação solo founder.
PWA e SaaS self-service serão o núcleo.
Atendimento humano será exceção.
App nativo será premium.
Customização profunda será Enterprise.
Toda funcionalidade deverá provar que pode ser automatizada, escalada e mantida por uma operação enxuta.
```

---

## 14. Produto em três camadas

### 11.1 Camada 1 — PWA imediato

Primeiro produto a lançar.

O criador cria seu hub/app em minutos:

```text
app.nomedocriador.com
```

ou:

```text
nomedocriador.creatorhub.com
```

Vantagens:

- não depende da Apple;
- não depende da Google Play;
- valida rápido;
- custo menor;
- onboarding simples;
- pode ser instalado na tela inicial;
- pode ter push web;
- serve como MVP comercial.

### 11.2 Camada 2 — App Android/iOS assistido

Para criadores maiores.

A plataforma ajuda o criador a publicar nas lojas usando a conta do próprio criador.

### 11.3 Camada 3 — CRM, dados e monetização

O negócio de verdade está nesta camada:

- base de fãs;
- e-mail;
- telefone;
- preferências;
- favoritos;
- histórico de cliques;
- segmentação;
- campanhas;
- patrocinadores;
- loja;
- eventos;
- relatórios para marcas.

---

## 15. Funcionalidades do app/PWA do fã

### 12.1 Home

- destaque principal;
- “ao vivo agora”;
- próximas lives;
- últimos conteúdos;
- links rápidos;
- patrocinador em destaque;
- banner de campanha;
- chamada para ativar notificações;
- chamada para cadastro.

### 12.2 Agenda

- lives futuras;
- eventos;
- jogos;
- programas;
- lançamentos;
- aulas;
- podcasts;
- shows;
- encontros;
- transmissões especiais.

Campos possíveis:

```text
title
description
start_at
end_at
platform
external_url
image
category
is_live
is_featured
```

### 12.3 Lembretes

Funcionalidades:

- “Avise-me quando começar”;
- “Lembrar 15 minutos antes”;
- “Lembrar 1 hora antes”;
- “Adicionar ao calendário”;
- lembrete recorrente para programas fixos.

### 12.4 Favoritos

O fã pode favoritar:

- programas;
- eventos;
- criadores;
- categorias;
- patrocinadores;
- conteúdos;
- links.

### 12.5 Comunidade

Links para:

- Discord;
- Telegram;
- WhatsApp;
- Instagram;
- TikTok;
- YouTube;
- site oficial;
- comunidade externa;
- newsletter.

### 12.6 Loja

Possibilidades:

- produtos oficiais;
- camisetas;
- ingressos;
- cursos;
- livros;
- afiliados;
- cupons;
- produtos de patrocinadores;
- links externos para checkout.

No MVP, a loja pode ser apenas links externos.

### 12.7 Patrocinadores

Componentes:

- banner do patrocinador;
- card de oferta;
- link rastreável;
- cupom;
- campanha com data inicial e final;
- relatório de cliques.

### 12.8 Perfil do fã

Dados possíveis:

- nome;
- e-mail;
- telefone;
- cidade;
- interesses;
- permissões de contato;
- plataformas favoritas;
- eventos favoritados.

### 12.9 Notificações

Tipos:

- live começando;
- evento novo;
- cupom novo;
- produto novo;
- post especial;
- patrocinador;
- comunidade;
- lembrete de evento;
- conteúdo favorito.

---

## 16. Funcionalidades do painel SaaS do criador

### 13.1 Cadastro da marca

- nome do canal;
- logo;
- favicon;
- ícone do app;
- cores;
- banner;
- descrição;
- categoria;
- links oficiais;
- domínio personalizado.

### 13.2 Integrações

Conectar ou cadastrar:

- YouTube;
- Instagram;
- TikTok;
- Discord;
- WhatsApp;
- Telegram;
- loja;
- site;
- calendário;
- pixels;
- analytics.

### 13.3 Conteúdo

Gerenciar:

- vídeos em destaque;
- playlists;
- lives futuras;
- eventos;
- posts manuais;
- banners;
- links patrocinados;
- chamadas de comunidade.

### 13.4 CRM

Visualizar:

- fãs cadastrados;
- e-mails;
- telefones;
- tags;
- segmentos;
- interesses;
- histórico de cliques;
- favoritos;
- consentimentos LGPD.

### 13.5 Notificações

Criar e enviar:

- push imediata;
- push agendada;
- push para todos;
- push para segmento;
- push para quem favoritou determinado programa;
- lembrete automático de live.

### 13.6 Patrocinadores

Gerenciar:

- patrocinadores;
- campanhas;
- banners;
- links;
- cupons;
- período de exibição;
- relatórios de cliques.

### 13.7 Loja

Cadastrar:

- produtos;
- links externos;
- cupons;
- afiliados;
- campanhas;
- produtos em destaque.

### 13.8 Relatórios

Métricas:

- usuários cadastrados;
- usuários ativos;
- inscritos no push;
- cliques no YouTube;
- cliques no Instagram;
- cliques em patrocinadores;
- eventos mais favoritados;
- melhores horários de push;
- origem dos cadastros;
- crescimento da base;
- conversão de visitante em fã cadastrado.

---

## 17. Integrações por fase

### 14.1 Fase 1 — MVP simples e seguro

Não depender de APIs complexas no início.

#### YouTube

- cadastrar URL do canal;
- cadastrar links de vídeos/lives manualmente;
- botão “Assistir no YouTube”;
- abrir link oficial;
- eventualmente puxar vídeos públicos via API.

#### Instagram

- link oficial;
- botão para perfil;
- botão para post/reels específico;
- sem depender de API no MVP.

#### TikTok

- link oficial;
- botão para perfil;
- botão para vídeo específico;
- sem depender de API no MVP.

#### Discord

- link do servidor.

#### WhatsApp

- link do grupo;
- link do canal;
- link de atendimento;
- link de comunidade.

#### Telegram

- link do canal;
- link do grupo.

### 14.2 Fase 2 — APIs oficiais

Evoluir para:

- YouTube Data API;
- Instagram Graph API para contas Business/Creator;
- TikTok Display API;
- Telegram Bot API;
- WhatsApp Business Platform, se houver caso de uso real.

### 14.3 Fase 3 — Automações inteligentes

Adicionar:

- detectar nova live;
- sugerir push automático;
- criar campanha para patrocinador;
- recomendar melhor horário de envio;
- segmentar fãs por interesse;
- gerar calendário automático do canal;
- IA para criar texto de push;
- IA para resumir agenda semanal;
- IA para sugerir campanhas.

---

## 18. Arquitetura recomendada

Para desenvolver sozinho, a recomendação é:

```text
Lovable + Supabase para MVP
↓
Codex/Cursor para refino técnico
↓
PWA primeiro
↓
Expo/React Native depois
```

### 15.1 Frontend

Recomendação:

```text
Next.js + TypeScript + Tailwind
```

Motivos:

- bom para SaaS;
- bom para dashboard;
- bom para PWA;
- bom para SEO;
- velocidade de desenvolvimento;
- compatível com deploy em Vercel;
- fácil para IA gerar e manter código.

### 15.2 Backend

Recomendação:

```text
Supabase
```

Recursos úteis:

- Postgres;
- Auth;
- APIs automáticas;
- Row Level Security;
- Storage;
- Edge Functions;
- Realtime;
- bom encaixe para SaaS multi-tenant.

Fonte:

- Supabase:  
  https://supabase.com/

### 15.3 Push notification

Para começar:

```text
OneSignal
```

Motivos:

- mais simples para web push;
- dashboard pronto;
- segmentação;
- campanhas;
- suporte a navegadores principais.

Fonte:

- OneSignal Web Push Setup:  
  https://documentation.onesignal.com/docs/en/web-push-setup

Alternativa mais técnica:

```text
Firebase Cloud Messaging
```

### 15.4 Mobile nativo depois

Recomendação:

```text
Expo + React Native
```

Com:

- EAS Build;
- EAS Submit;
- Fastlane, se necessário.

---

## 19. Modelo de dados inicial

### 16.1 Tabelas principais

#### tenants

Representa cada criador/canal/cliente.

Campos sugeridos:

```text
id
name
slug
plan
status
created_at
updated_at
```

#### creator_profiles

Dados públicos do app do criador.

```text
id
tenant_id
display_name
description
logo_url
banner_url
primary_color
secondary_color
app_icon_url
custom_domain
created_at
updated_at
```

#### users

Usuários internos da plataforma.

```text
id
tenant_id
email
name
role
created_at
updated_at
```

#### fans

Base de fãs cadastrada.

```text
id
tenant_id
name
email
phone
city
source
created_at
updated_at
```

#### fan_consents

Consentimentos LGPD.

```text
id
tenant_id
fan_id
consent_type
granted
granted_at
revoked_at
ip_address
user_agent
```

Tipos de consentimento:

```text
terms
privacy_policy
email_marketing
sms_whatsapp
push_notification
sponsor_offers
```

#### social_links

Links oficiais.

```text
id
tenant_id
platform
label
url
is_active
sort_order
created_at
updated_at
```

Plataformas:

```text
youtube
instagram
tiktok
discord
whatsapp
telegram
website
store
other
```

#### events

Lives, jogos, eventos, transmissões e lançamentos.

```text
id
tenant_id
title
description
start_at
end_at
platform
external_url
image_url
category
is_live
is_featured
status
created_at
updated_at
```

#### event_reminders

Lembretes configurados pelos fãs.

```text
id
tenant_id
event_id
fan_id
reminder_at
status
created_at
updated_at
```

#### favorites

Favoritos dos fãs.

```text
id
tenant_id
fan_id
entity_type
entity_id
created_at
```

#### notifications

Campanhas de push.

```text
id
tenant_id
title
message
target_type
scheduled_at
sent_at
status
external_provider_id
created_at
updated_at
```

#### notification_recipients

Destinatários e métricas de notificação.

```text
id
tenant_id
notification_id
fan_id
delivered_at
opened_at
clicked_at
status
```

#### sponsors

Patrocinadores.

```text
id
tenant_id
name
logo_url
website_url
status
created_at
updated_at
```

#### sponsor_campaigns

Campanhas de patrocinadores.

```text
id
tenant_id
sponsor_id
title
description
image_url
target_url
coupon_code
starts_at
ends_at
is_featured
created_at
updated_at
```

#### store_links

Produtos, cupons, loja e afiliados.

```text
id
tenant_id
title
description
image_url
price
external_url
coupon_code
status
created_at
updated_at
```

#### content_items

Vídeos, posts, links e conteúdos manuais.

```text
id
tenant_id
title
description
platform
external_url
thumbnail_url
published_at
is_featured
created_at
updated_at
```

#### integrations

Tokens e status de integrações.

```text
id
tenant_id
platform
status
access_token_encrypted
refresh_token_encrypted
expires_at
scopes
created_at
updated_at
```

#### audit_logs

Logs de ações.

```text
id
tenant_id
user_id
action
entity_type
entity_id
metadata
created_at
```

---

## 20. Multi-tenant desde o começo

O sistema deve nascer multi-tenant.

```text
Um mesmo sistema
↓
Vários criadores/canais
↓
Cada um com seus dados isolados
```

Todas as tabelas importantes devem ter:

```text
tenant_id
```

Exemplo:

```text
events
- id
- tenant_id
- title
- description
- start_at
- external_url
- platform
```

No Supabase, é importante usar Row Level Security para impedir que um criador acesse dados de outro.

Princípio:

```text
Usuário autenticado só vê dados do tenant ao qual pertence.
```

---

## 21. Papéis de usuário

### 18.1 Admin da plataforma

Você/equipe.

Permissões:

- ver todos os tenants;
- dar suporte;
- configurar planos;
- revisar apps;
- bloquear abuso;
- acessar logs;
- gerenciar pagamentos.

### 18.2 Owner do criador

Dono do canal.

Permissões:

- configurar marca;
- conectar redes;
- ver CRM;
- enviar push;
- gerenciar equipe;
- contratar plano;
- solicitar publicação nas lojas.

### 18.3 Editor

Equipe do canal.

Permissões:

- cadastrar eventos;
- editar links;
- criar notificações;
- gerenciar conteúdo;
- cadastrar patrocinadores.

### 18.4 Analyst

Permissões:

- ver relatórios;
- exportar dados permitidos;
- sem editar configurações.

### 18.5 Fan

Usuário final do app.

Permissões:

- se cadastrar;
- favoritar;
- receber push;
- salvar eventos;
- clicar em links;
- gerenciar preferências;
- excluir cadastro.

---

## 22. Fluxos principais

### 19.1 Criador cria seu app

```text
Criador cria conta
↓
Informa nome do canal
↓
Sobe logo e cores
↓
Cadastra links oficiais
↓
Cadastra agenda
↓
Publica PWA
↓
Recebe URL pública
```

### 19.2 Fã acessa app

```text
Fã abre link
↓
Vê home do canal
↓
Aceita push, se quiser
↓
Cadastra e-mail/telefone, se quiser
↓
Favorita eventos
↓
Clica em assistir
↓
Abre YouTube ou plataforma oficial
```

### 19.3 Lembrete de live

```text
Criador cadastra live
↓
Fã clica em "lembrar"
↓
Sistema agenda notificação
↓
15 minutos antes, fã recebe push
↓
Clica no push
↓
Abre página da live no app
↓
Clica em assistir
↓
Abre YouTube
```

### 19.4 Patrocinador

```text
Criador cadastra campanha
↓
Patrocinador aparece na home/evento
↓
Fã clica
↓
Sistema registra clique
↓
Criador gera relatório
↓
Patrocinador vê valor da audiência
```

### 19.5 Publicação de app nativo

```text
Criador solicita app nativo
↓
Criador cria conta Apple/Google
↓
Criador concede acesso à plataforma
↓
Plataforma gera build
↓
Plataforma prepara metadados, screenshots e política
↓
Envia para revisão
↓
Acompanha aprovação
↓
Publica atualizações futuras
```

---

## 23. LGPD, privacidade e consentimento

Como o app coleta e-mail, telefone, push e comportamento de cliques, LGPD precisa ser tratada desde o início.

### 20.1 Itens obrigatórios

- política de privacidade;
- termos de uso;
- consentimento claro;
- finalidade do cadastro;
- opt-out;
- descadastro;
- exclusão de dados;
- exportação de dados, se necessário;
- base legal documentada;
- logs de consentimento;
- separação de dados por criador;
- retenção de dados;
- segurança e criptografia de tokens.

### 20.2 Exemplo de consentimento

```text
Aceito receber notificações e comunicações deste criador sobre lives, eventos, conteúdos, produtos, comunidade e patrocinadores.
```

### 20.3 Ponto importante

O fã deve entender claramente se está se cadastrando:

- na base do criador;
- na base da plataforma;
- em ambas.

O contrato com o criador deve definir papéis de controlador e operador de dados.

---

## 24. Monetização global e planos

### 23.1 Plano Starter

Para criadores pequenos.

Inclui:

- PWA;
- links oficiais;
- agenda;
- push limitado;
- CRM básico;
- domínio da plataforma;
- relatórios básicos.

Preço hipotético:

```text
R$ 99 a R$ 199/mês
```

### 23.2 Plano Pro

Para criadores médios.

Inclui:

- domínio próprio;
- mais push;
- CRM avançado;
- patrocinadores;
- loja;
- relatórios;
- automações;
- usuários de equipe.

Preço hipotético:

```text
R$ 299 a R$ 599/mês
```

### 23.3 Plano Business

Para canais maiores.

Inclui:

- multiusuários;
- integrações avançadas;
- app Android;
- suporte publicação;
- dashboards;
- campanhas;
- segmentação.

Preço hipotético:

```text
R$ 999 a R$ 2.999/mês
```

### 23.4 Plano Enterprise

Para canais grandes, clubes, igrejas, rádios, redes de creators e comunidades maiores.

Inclui:

- app Android/iOS;
- publicação assistida;
- conta própria nas lojas;
- SLA;
- customização;
- integrações;
- suporte prioritário;
- relatórios para patrocinadores.

Preço hipotético:

```text
setup + mensalidade
```

### 23.5 Billing recorrente

A cobrança deve ser recorrente, preferencialmente mensal e anual.

Provedor principal:

```text
Stripe
```

Componentes:

```text
Stripe Billing
Stripe Checkout
Stripe Customer Portal
Stripe Tax
Stripe Webhooks
```

### 23.6 Moedas iniciais

```text
USD — padrão global
BRL — Brasil
JPY — Japão
EUR — fase posterior
```

### 23.7 Planos anuais

Além da recorrência mensal, criar planos anuais com desconto.

Exemplo:

```text
Monthly
Annual — save 20%
```

O plano anual melhora caixa, reduz churn e simplifica métodos de pagamento locais que não sejam ideais para recorrência mensal.


---

## 25. Público inicial mais promissor

Não começar pelos gigantes.

Grandes canais como CazéTV, Flow, Podpah ou outros nomes grandes servem como exemplo aspiracional, mas podem ter:

- equipe técnica própria;
- agência;
- contratos maiores;
- ciclos longos;
- mais exigências;
- maior risco jurídico de marca.

Público inicial mais promissor:

- podcasts médios;
- igrejas;
- rádios;
- canais esportivos regionais;
- clubes menores;
- influenciadores locais;
- canais de educação;
- experts com comunidade;
- eventos recorrentes;
- creators de nicho com audiência fiel;
- criadores entre 50 mil e 2 milhões de inscritos.

Esse público tem audiência suficiente para sentir a dor, mas normalmente não tem estrutura técnica para resolver sozinho.

---

## 26. Riscos principais e mitigação

### 23.1 App parecer simples demais

Risco:

- lojas rejeitarem;
- criador não ver valor;
- usuário não instalar.

Mitigação:

- PWA primeiro;
- incluir agenda, push, favoritos, CRM, patrocinadores e loja;
- evitar “lista de links”;
- provar valor com notificações e métricas.

### 23.2 Apple rejeitar app template

Risco:

- apps white-label parecidos demais;
- publicação em massa pela mesma conta;
- baixa customização.

Mitigação:

- cada criador publica pela própria conta;
- app com customização real;
- conteúdo próprio;
- utilidade própria;
- PWA antes do nativo;
- app nativo apenas para planos avançados.

### 23.3 Dependência de APIs

Risco:

- aprovação demorada;
- mudanças de política;
- limites de uso;
- perda de integração.

Mitigação:

- começar com links oficiais;
- usar APIs somente onde trazem valor claro;
- manter fallback manual;
- não depender de Instagram/TikTok no MVP.

### 23.4 LGPD

Risco:

- coleta indevida;
- falta de consentimento;
- má gestão de dados;
- confusão entre base do criador e base da plataforma.

Mitigação:

- consentimento explícito;
- política clara;
- opt-out;
- logs;
- exclusão de dados;
- contrato claro com criador.

### 23.5 Criador não ver valor

Risco:

- criador achar que já tem Linktree;
- criador achar que as redes já resolvem;
- dificuldade de vender mensalidade.

Mitigação:

- vender push + base própria + relatório para patrocinador;
- mostrar que gera tráfego para as redes oficiais;
- mostrar dados de cliques e engajamento;
- oferecer piloto simples.

### 23.6 Custo operacional de publicar apps

Risco:

- suporte pesado;
- reprovação;
- manutenção;
- atualizações;
- contas Apple/Google.

Mitigação:

- PWA como produto principal;
- app nativo como plano avançado;
- automação com Expo/Fastlane;
- checklist guiado;
- suporte cobrado.

---

## 27. MVP recomendado

### 24.1 Objetivo do MVP

Provar que criadores querem um hub próprio com:

```text
agenda
+
push
+
CRM básico
+
links oficiais
+
patrocinadores
+
tráfego para redes
```

### 24.2 Painel do criador

Funcionalidades mínimas:

- login;
- cadastro da marca;
- logo;
- cores;
- links sociais;
- cadastro de eventos/lives;
- cadastro de patrocinadores;
- envio de push;
- lista de fãs;
- métricas básicas;
- status da assinatura;
- avisos de inadimplência;
- bloqueio de recursos por plano;
- modo limitado/suspenso no painel;
- seleção de idioma;
- visualização do plano;
- acesso ao Stripe Customer Portal;
- fluxo de contratação via Stripe Checkout.

### 24.3 PWA do fã

Funcionalidades mínimas:

- home;
- agenda;
- ao vivo agora;
- favoritos;
- comunidade;
- loja;
- patrocinadores;
- cadastro e-mail/telefone;
- ativar push;
- botão “Assistir no YouTube”;
- botão “Abrir na plataforma oficial”;
- consulta obrigatória ao runtime-config;
- comportamento de app ativo, limitado ou suspenso;
- tela neutra de indisponibilidade sem expor inadimplência;
- idioma definido pelo criador;
- estrutura pronta para múltiplos idiomas por tenant no futuro.

### 24.4 Admin interno

Funcionalidades mínimas:

- lista de criadores;
- status do plano;
- billing_status;
- app_status;
- quantidade de fãs;
- eventos criados;
- pushes enviados;
- logs básicos;
- suspensão/reativação manual;
- histórico de eventos de cobrança;
- visualização de tenants em modo past_due, limited e suspended;
- visualização de billing_provider;
- logs de webhooks da Stripe;
- reprocessamento manual de eventos de cobrança.

---

## 28. O que deixar fora do MVP

Para não travar:

- app iOS nativo;
- app Android nativo;
- Instagram API avançada;
- TikTok API avançada;
- WhatsApp API oficial;
- pagamentos dentro do app;
- área de membros própria;
- player próprio;
- IA sofisticada;
- automação completa de publicação nas lojas;
- login social complexo;
- importação avançada de vídeos;
- analytics avançado;
- operação China continental;
- integrações com Bilibili, Douyin, WeChat Channels, Xiaohongshu, Kuaishou e Weibo;
- meios de pagamento chineses locais;
- ICP/compliance local da China.

Não deixar fora do MVP:
- landing multilíngue;
- rotas `/en`, `/pt-br`, `/es`, `/ja-jp`;
- estrutura de i18n;
- Stripe Checkout;
- Stripe Billing;
- webhooks básicos;
- billing_status e app_status;
- onboarding self-service;
- e-mails transacionais;
- base de conhecimento inicial;
- monitoramento de erros;
- painel de exceções;
- suspensão e reativação automáticas.

Observação importante: controle de assinatura, status do tenant, runtime-config e modo suspenso **não devem ficar fora do MVP**. Mesmo que a cobrança seja manual no início, a arquitetura de bloqueio deve existir desde a primeira versão.

---

## 29. Roadmap sugerido

### Fase 0 — Validação global

Objetivo:

```text
conversar com 20 criadores em pelo menos 3 mercados
```

Distribuição sugerida:

```text
Brasil: 8
EUA/global inglês: 6
Espanhol/LATAM: 4
Japão: 2
```

Pergunta-chave:

> Você pagaria para ter seu app oficial com push, agenda, base própria de fãs e links diretos para suas redes?

Meta:

```text
20 conversas
5 interessados reais
2 pilotos pagos ou semi-pagos
```

### Fase 1 — MVP PWA global

Objetivo:

```text
Landing multilíngue + PWA + dashboard + CRM básico + push + agenda + Stripe Billing
```

### Fase 2 — Pilotos

Rodar com:

- 1 podcast;
- 1 igreja;
- 1 canal esportivo;
- 1 influenciador;
- 1 creator educacional.

Medir:

- cadastros;
- opt-in de push;
- cliques para YouTube;
- eventos favoritados;
- retorno do criador;
- retorno de patrocinadores.

### Fase 3 — SaaS público

Adicionar:

- planos;
- checkout;
- onboarding automático;
- templates;
- suporte;
- domínio próprio;
- relatórios;
- área de cobrança.

### Fase 4 — Automação operacional

Antes de escalar apps nativos, automatizar:

- onboarding;
- billing;
- trial;
- upgrade/downgrade;
- suspensão e reativação;
- suporte por IA;
- base de conhecimento;
- alertas;
- monitoramento;
- logs;
- tradução;
- domínio;
- publicação de PWA.

Meta:

```text
80%+ dos clientes ativos sem necessidade de atendimento humano recorrente
```

### Fase 5 — Apps nativos

Adicionar:

- Android primeiro;
- iOS depois;
- publicação assistida;
- conta própria do criador;
- automação de builds.

### Fase 6 — CRM avançado

Adicionar:

- segmentação;
- campanhas;
- IA para push;
- integrações oficiais;
- relatórios para patrocinadores;
- monetização;
- automações.

### Fase 7 — China continental

Somente após validação global.

Estudar:

- chinês simplificado;
- Bilibili;
- Douyin;
- WeChat Channels;
- Xiaohongshu / RED;
- Kuaishou;
- Weibo;
- WeChat Pay;
- Alipay;
- ICP;
- parceiro local;
- infraestrutura local;
- app stores Android chinesas;
- compliance de dados.

---

## 30. Stack recomendada

### 27.1 Desenvolvimento por IA — Claude Code como ferramenta principal

Fluxo sugerido:

```text
Claude Code (terminal ou extensão VS Code)
↓
Cria e mantém o repositório completo: frontend, backend, schema, testes, scripts de deploy

Next.js + App Router + next-intl
↓
Landing multilíngue, painel do criador e PWA do fã

Supabase
↓
Banco Postgres, Auth, Storage, RLS, Edge Functions, tenants, billing status e runtime-config

Stripe Billing / Checkout / Customer Portal / Tax
↓
Assinatura recorrente global, cartão, faturas, webhooks e gestão de cobrança

OneSignal
↓
Push web/mobile

Vercel
↓
Deploy do frontend (via plugin/skill de Vercel do Claude Code)

Expo + React Native
↓
Apps nativos no futuro

EAS Build / EAS Submit + Fastlane
↓
Build e envio para lojas, automação de publicação
```

### 27.2 Por que Claude Code como ferramenta principal

Diferente do fluxo anterior (Lovable → Codex/Cursor), o projeto será conduzido do início ao fim dentro do Claude Code, trabalhando sobre um repositório real (não um protótipo gerado fora do controle de versão). Isso traz vantagens específicas para este projeto:

- o código já nasce dentro de um repositório git, facilitando deploy contínuo (Vercel) desde a primeira semana;
- multi-tenant, RLS, `runtime-config`, `billing_status`/`app_status` e feature flags — que são decisões estruturais — podem ser implementados corretamente desde o primeiro commit, em vez de serem "encaixados" depois em código gerado por uma ferramenta de prototipação;
- o Claude Code consegue rodar migrations do Supabase, configurar webhooks da Stripe, escrever testes e ajustar a internacionalização (next-intl) na mesma sessão, sem necessidade de exportar/importar código entre ferramentas;
- a documentação deste próprio documento-mestre pode ser usada como contexto persistente do projeto (por exemplo, em um arquivo `CLAUDE.md` na raiz do repositório), guiando decisões futuras de forma consistente.

### 27.3 Lovable como alternativa (opcional)

Lovable continua sendo uma opção válida caso, em algum momento, seja útil gerar rapidamente um protótipo visual isolado (por exemplo, para validar uma tela com criadores antes de implementá-la "de verdade"). Nesse caso, o protótipo gerado no Lovable deve ser tratado como referência visual, e a implementação final deve ser feita no repositório principal via Claude Code — evitando manter dois códigos-fonte paralelos.

### 27.4 Revisão técnica contínua

Os itens que antes eram atribuídos a "depois usar Codex/Cursor" passam a ser responsabilidades contínuas do Claude Code ao longo de todas as ondas de execução (seção 42): segurança, multi-tenant, RLS, LGPD, integrações, arquitetura, testes, logs e escalabilidade. Recomenda-se revisitar esses pontos a cada onda concluída, e não apenas uma vez "depois do MVP".

---

## 31. Prompt mestre para Claude Code

Diferente do prompt único usado para ferramentas de prototipação (que tentam gerar tudo de uma vez), o prompt abaixo é pensado para ser o **prompt de kickoff** de uma sessão de Claude Code: ele estabelece o projeto, a stack, os requisitos estruturais (que valem para a versão completa) e direciona o Claude Code a começar pela Onda 0 do plano de execução (seção 42), evoluindo onda a onda nas sessões seguintes.

Recomendação de uso: salve este prompt (ou o documento-mestre inteiro) como `docs/creator-hub-master.md` dentro do repositório, e cole o texto abaixo na primeira mensagem do Claude Code, dentro da pasta vazia do projeto.

```text
Você vai me ajudar a construir o Creator Hub: uma plataforma SaaS multi-tenant que permite a
criadores de conteúdo criarem seu app/PWA oficial — um hub de audiência, CRM e organização de
links oficiais, sem substituir YouTube, Instagram, TikTok, Discord, WhatsApp ou Telegram.

Este é um projeto de versão completa (não um MVP reduzido). Toda a especificação de produto está
no arquivo docs/creator-hub-master.md, que você deve ler antes de começar e consultar sempre que
tiver dúvida sobre requisitos. Trate esse documento como fonte de verdade do produto.

Stack do projeto:
- Next.js (App Router) + TypeScript + Tailwind, deploy na Vercel
- Supabase (Postgres + Auth + Storage + RLS + Edge Functions)
- Stripe (Billing, Checkout, Customer Portal, Tax, Webhooks) em modo de teste
- next-intl para internacionalização
- OneSignal para push web
- Resend (ou Postmark) para e-mails transacionais
- Sentry para monitoramento de erros

O sistema tem dois ambientes principais:

1. Painel do criador (autenticado):
- login e cadastro
- perfil do criador/canal (nome, logo, cores, banner, domínio)
- cadastro de links oficiais: YouTube, Instagram, TikTok, Discord, WhatsApp, Telegram, site e loja
- cadastro de eventos/lives (título, descrição, data/hora, plataforma, URL externa)
- cadastro de patrocinadores e campanhas
- lista de fãs cadastrados (CRM básico)
- envio de notificações push
- métricas básicas de cliques e cadastros
- status da assinatura, avisos de pendência e portal de cobrança (Stripe Customer Portal)

2. PWA público do fã:
- home com identidade visual do criador
- "Ao vivo agora" e próximos eventos
- favoritos, comunidade, loja, patrocinadores
- cadastro de e-mail/telefone com consentimento (LGPD)
- ativação de push
- botões "Assistir no YouTube" / "Abrir na plataforma oficial", sempre para links externos oficiais
- consulta obrigatória ao runtime-config (nunca conteúdo fixo no código)

Requisitos estruturais — válidos desde o primeiro commit, mesmo que a interface ainda não exponha
tudo isso:
- multi-tenant desde a primeira tabela, com tenant_id em todas as tabelas de domínio
- Row Level Security no Supabase: um usuário só vê dados do seu próprio tenant
- design responsivo mobile-first, PWA instalável
- não reproduzir vídeos dentro do app; apenas direcionar para links oficiais externos
- billing_status e app_status por tenant, com os estados: trialing, active, past_due, limited,
  suspended, canceled
- endpoint runtime-config público (ex.: GET /api/v1/tenants/{slug}/runtime-config), retornando
  tema, features habilitadas, links sociais, eventos e patrocinadores conforme o status do tenant
- se app_status = suspended: o PWA exibe tela neutra "Este app está temporariamente indisponível"
  com links oficiais, nunca um erro técnico
- se billing_status = limited: bloquear envio de push, criação de campanhas e exportação de CRM
- feature flags por plano (starter, pro, business, enterprise)
- tabelas subscriptions, billing_events, tenant_entitlements, tenant_runtime_status, app_access_logs

Requisitos de internacionalização — versão completa, 4 idiomas desde o início:
- landing page multilíngue: rotas /en, /pt-br, /es, /ja-jp, com /en como idioma padrão e x-default
- estrutura de arquivos de tradução (messages/en.json, pt-br.json, es.json, ja-jp.json)
- hreflang entre versões equivalentes
- troca manual de idioma pelo usuário, sem redirecionamento obrigatório por IP
- painel do criador inicialmente em inglês e português, preparado para tradução futura
- China continental fora do escopo desta fase

Requisitos de operação solo founder:
- onboarding 100% self-service, com wizard de progresso, sem reunião obrigatória
- base de conhecimento e espaço reservado para assistente de IA de suporte
- painel admin interno orientado a exceções (erros, inadimplência, falhas de webhook/push,
  integrações expiradas, domínios quebrados)
- automação de ativação, limitação, suspensão e reativação a partir dos eventos do Stripe
- nenhuma customização manual por cliente nos planos self-service
- app nativo fora do núcleo desta fase (estrutura preparada, mas não implementada agora)

Requisitos de billing — Stripe real em modo de teste desde o início:
- Stripe Checkout para assinatura recorrente por cartão
- Stripe Billing + Customer Portal para gestão de assinatura pelo cliente
- webhooks: checkout.session.completed, customer.subscription.created/updated/deleted,
  invoice.paid, invoice.payment_failed, invoice.payment_action_required
- esses eventos devem atualizar billing_status/app_status conforme a seção 11 do documento-mestre
- abstração billing_provider com valores "stripe" e "manual" (manual para pilotos/enterprise)
- planos e preços em USD como moeda base; estrutura pronta para BRL e JPY

Como começar:
1. Leia docs/creator-hub-master.md, especialmente as seções 11, 12, 13 e 42.
2. Proponha a estrutura inicial do repositório (pastas, package.json, configuração do Next.js,
   Supabase, variáveis de ambiente) antes de gerar código em massa.
3. Comece pela "Onda 0" da seção 42: fundação multi-tenant + runtime-config + autenticação +
   esqueleto da landing em /en, antes de avançar para as próximas ondas.
4. Ao final de cada onda, faça um resumo do que foi implementado e do que falta, para eu validar
   antes de seguirmos para a próxima.
```

---

## 32. Checklist de validação com criadores

Perguntas para entrevistas:

1. Você sente que depende demais do algoritmo das redes?
2. Você gostaria de ter uma base própria de fãs com e-mail/telefone?
3. Você usaria push notification para avisar lives e eventos?
4. Você tem patrocinadores que pedem relatórios de clique/engajamento?
5. Você tem loja, produtos, cursos, eventos ou comunidade?
6. Você acha útil ter um app oficial ou PWA do seu canal?
7. Você pagaria mensalmente por isso?
8. Qual valor faria sentido?
9. Você preferiria começar com PWA ou app nas lojas?
10. Você teria dificuldade para criar conta Apple/Google?
11. Quem na sua equipe alimentaria a agenda?
12. O que seria indispensável no primeiro mês?

---

## 33. Métricas de sucesso do MVP

Métricas do criador:

- número de fãs cadastrados;
- taxa de opt-in de push;
- número de cliques para YouTube;
- número de eventos cadastrados;
- número de lembretes criados;
- cliques em patrocinadores;
- cliques em loja;
- retorno dos patrocinadores;
- uso semanal pelo criador.

Métricas do fã:

- visitas ao PWA;
- instalação na tela inicial;
- ativação de push;
- cadastro;
- favoritos;
- abertura de notificação;
- clique em “assistir”;
- retorno ao app.

Métricas de negócio:

- criadores interessados;
- pilotos pagos;
- churn;
- ticket médio;
- CAC;
- tempo de onboarding;
- suporte necessário por criador;
- taxa de inadimplência;
- tempo médio até regularização;
- quantidade de tenants em past_due;
- quantidade de tenants em limited;
- quantidade de tenants em suspended;
- reativações após suspensão;
- conversão por idioma;
- conversão por moeda;
- conversão por país;
- checkout iniciado vs checkout concluído;
- falhas de pagamento por região;
- adoção de planos mensais vs anuais;
- performance da landing em inglês, português, espanhol e japonês;
- tickets por 100 clientes;
- horas semanais de suporte;
- percentual de onboarding sem ajuda;
- percentual de clientes que exigem intervenção manual;
- custo operacional por tenant;
- tarefas manuais recorrentes;
- tempo gasto por publicação nativa.

---

## 34. Estratégia comercial inicial

### 31.1 Abordagem

Não vender tecnologia.

Vender resultado:

```text
mais controle sobre audiência
+
notificações próprias
+
tráfego organizado
+
base para patrocinadores
```

### 31.2 Pitch curto

> Você já tem audiência nas redes, mas não controla a relação com seus fãs. Nós criamos seu app oficial com agenda, push, CRM, loja, patrocinadores e links diretos para seus conteúdos oficiais no YouTube, Instagram, TikTok e comunidades.

### 31.3 Público de teste

Começar com criadores que já tenham:

- lives recorrentes;
- agenda;
- comunidade;
- patrocinadores;
- loja;
- audiência fiel;
- dor de comunicação.

---

## 35. Diferenciação contra Linktree e similares

Um possível concorrente indireto é o Linktree ou páginas de links.

Diferença:

```text
Linktree:
lista de links

Creator Hub:
app/PWA oficial + CRM + push + agenda + favoritos + patrocinadores + métricas
```

O produto precisa ser muito mais próximo de CRM e app oficial do que de página de links.

---

## 36. Diferenciação contra plataformas OTT

Plataformas como Uscreen, VPlayed e similares normalmente partem da lógica de:

- hospedar vídeos próprios;
- vender assinatura;
- criar OTT;
- ser uma espécie de “Netflix própria”.

Este projeto é diferente:

```text
Não hospeda vídeos.
Não substitui YouTube.
Não cria streaming próprio.
Organiza e direciona para as redes oficiais.
```

A vantagem é menor atrito, menor custo e menor risco.

---

## 37. Documento de decisão

Decisão tomada na conversa:

```text
Cenário escolhido:
App/PWA "casca" que organiza tudo e direciona para links oficiais.

Não haverá reprodução própria de vídeos no MVP.
Não haverá substituição do YouTube.
Não haverá tentativa de capturar conteúdo fora das regras das plataformas.
O produto será CRM + organização + notificações + audiência própria.

Decisão adicional:
O app/PWA será dependente do backend central para funcionar. Em caso de não pagamento, a plataforma poderá suspender painel, APIs, conteúdo dinâmico, push, CRM, integrações, relatórios e exibição de funcionalidades, sem precisar remover o app das lojas.
```

---

## 38. Definição final do projeto

A definição consolidada é:

> Uma plataforma SaaS white-label, global, self-service e altamente automatizada que permite a criadores, canais, igrejas, podcasts, rádios, clubes e comunidades criarem seu app oficial/PWA, com CRM, push notification, agenda, favoritos, patrocinadores, loja e links inteligentes para suas redes oficiais, sem substituir YouTube, Instagram, TikTok, Discord, WhatsApp ou Telegram.

O app é a porta de entrada organizada.

As redes continuam sendo o local de consumo.

O valor real está em:

```text
base própria
+
push próprio
+
agenda organizada
+
CRM
+
monetização
+
relatórios para patrocinadores
```

---

## 39. Próximos passos recomendados

### Passo 1 — Escolher nome provisório

Sugestões:

- Creator Hub;
- Fan CRM;
- App Oficial;
- Meu App Oficial;
- Hub do Criador;
- Creator OS.

### Passo 2 — Criar landing page simples

Promessa:

> Seu app oficial em poucos minutos. Organize sua audiência, envie notificações e leve seus fãs direto para seus conteúdos oficiais.

### Passo 3 — Conversar com 20 criadores

Priorizar:

- podcasts;
- igrejas;
- rádios;
- creators de educação;
- canais esportivos regionais.

### Passo 4 — Criar MVP no Lovable

Usar o prompt deste documento.

### Passo 5 — Validar PWA

Rodar sem app store.

### Passo 6 — Medir adesão

Avaliar:

- cadastros;
- push opt-in;
- cliques para YouTube;
- retenção;
- feedback do criador.

### Passo 7 — Só depois pensar em app nativo

Apps nativos devem ser plano avançado, não o primeiro produto.

---

## 40. Referências oficiais

### YouTube

- YouTube API Services Developer Policies:  
  https://developers.google.com/youtube/terms/developer-policies

- YouTube API Services Terms of Service:  
  https://developers.google.com/youtube/terms/api-services-terms-of-service

- YouTube API Services Compliance Guide:  
  https://developers.google.com/youtube/terms/developer-policies-guide

- YouTube Required Minimum Functionality:  
  https://developers.google.com/youtube/terms/required-minimum-functionality

### Apple

- App Store Review Guidelines:  
  https://developer.apple.com/app-store/review/guidelines/

### Google Play

- Google Play Developer Content Policy:  
  https://play.google/developer-content-policy/

### Expo / publicação

- Expo EAS Submit:  
  https://docs.expo.dev/submit/introduction/

- Expo Submit to App Stores:  
  https://docs.expo.dev/deploy/submit-to-app-stores/

- Expo EAS Build:  
  https://docs.expo.dev/build/setup/

### Ferramentas técnicas

- Fastlane:  
  https://fastlane.tools/

- Supabase:  
  https://supabase.com/

- OneSignal Web Push:  
  https://documentation.onesignal.com/docs/en/web-push-setup


### Internacionalização e SEO

- Google Search Central — Managing multi-regional and multilingual sites:  
  https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites

- Google Search Central — Tell Google about localized versions of your page:  
  https://developers.google.com/search/docs/specialty/international/localized-versions

- Next.js — Internationalization:  
  https://nextjs.org/docs/app/guides/internationalization

### Stripe / billing global

- Stripe Billing / recurring payments:  
  https://docs.stripe.com/billing

- Stripe Subscriptions:  
  https://docs.stripe.com/subscriptions

- Stripe Checkout:  
  https://stripe.com/payments/checkout

- Supported languages for Stripe Checkout and Payment Links:  
  https://support.stripe.com/questions/supported-languages-for-stripe-checkout-and-payment-links

- Stripe Global Availability:  
  https://stripe.com/global

- Stripe Tax:  
  https://docs.stripe.com/tax

- Stripe Customer Portal:  
  https://docs.stripe.com/customer-management

- Stripe Japan:  
  https://stripe.com/en-jp

- Stripe Japan payment methods:  
  https://stripe.com/en-jp/payments/payment-methods

---

## 41. Observação final

Este projeto deve ser tratado como uma oportunidade de criar uma nova categoria:

```text
CRM de audiência para criadores
```

O app que abre YouTube é apenas o ponto de entrada.

O produto real é a infraestrutura de relacionamento entre criador e fã.

A versão 1.1 também consolida que o produto precisa ser uma infraestrutura SaaS controlada centralmente, com app/PWA dependente do backend, feature flags por plano e suspensão por inadimplência.

A chance de dar certo aumenta se o projeto for construído com esta lógica:

```text
PWA primeiro
↓
CRM e push como valor principal
↓
links oficiais para redes
↓
pilotos com criadores médios
↓
apps nativos apenas depois
```

A leitura estratégica final é positiva: a ideia tem fundamento, desde que seja posicionada e construída como **hub/CRM de audiência**, e não como simples app de links.

A versão 1.2 consolidou que o projeto deve nascer global, com landing multilíngue, Stripe Billing, recorrência por cartão, Japão no MVP e China continental como segunda etapa específica.

A versão 1.3 consolida que o Creator Hub deve nascer como uma empresa inicialmente operada por uma pessoa só, com produto self-service, automação máxima, suporte assíncrono e app nativo tratado como oferta premium.

A versão 1.4 consolida que o escopo da versão completa é mantido integralmente, e que a viabilidade de execução por uma pessoa só com Claude Code depende não de reduzir o que será construído, mas de **sequenciar bem** a construção — conforme detalhado na seção 42.

---

## 42. Plano de execução em ondas (W0–W7)

Esta seção traduz o roadmap de produto (seção 29) em um plano técnico sequencial, pensado para execução solo com Claude Code. Cada "onda" produz um sistema **completo e demonstrável de ponta a ponta** (login → painel → PWA público → cobrança), apenas com cobertura crescente de funcionalidades, idiomas e automações. Nada do escopo da versão completa é descartado — tudo está distribuído entre as ondas.

### W0 — Fundação (multi-tenant, auth, runtime-config)

Objetivo: ter um tenant de teste funcionando de ponta a ponta, mesmo que com telas mínimas.

```text
- Repositório Next.js + Supabase configurado e publicado na Vercel
- Schema inicial: tenants, users, creator_profiles, subscriptions, tenant_runtime_status,
  tenant_entitlements
- Autenticação (Supabase Auth) e RLS por tenant_id
- Endpoint runtime-config (GET /api/v1/tenants/{slug}/runtime-config)
- billing_status e app_status com todos os estados da seção 11, manipuláveis manualmente
  via painel admin (sem Stripe ainda nesta onda)
- PWA mínimo: home + tela "app suspenso" consumindo runtime-config
- Landing em /en apenas, com estrutura de rotas já preparada para /pt-br, /es, /ja-jp
```

### W1 — Painel do criador e conteúdo

```text
- Onboarding self-service (wizard com progresso)
- Cadastro de marca: logo, cores, banner, descrição
- Links oficiais (social_links): YouTube, Instagram, TikTok, Discord, WhatsApp, Telegram, site, loja
- Eventos/agenda (events) com lembretes (event_reminders)
- PWA público: home, agenda, "ao vivo agora", favoritos, comunidade
- Cadastro de fã (fans) com consentimento LGPD (fan_consents)
```

### W2 — Billing real com Stripe (modo de teste)

```text
- Stripe Checkout para assinatura recorrente (1 moeda: USD)
- Stripe Customer Portal acessível pelo painel do criador
- Webhooks: checkout.session.completed, customer.subscription.*, invoice.paid,
  invoice.payment_failed, invoice.payment_action_required
- billing_provider (stripe | manual) e tabelas billing_events, invoices, payment_methods
- Automação completa: active → past_due → limited → suspended → canceled, e reativação,
  conforme seção 11
- Feature flags por plano (starter, pro, business, enterprise) ligadas a tenant_entitlements
```

### W3 — Push, patrocinadores e loja

```text
- Integração OneSignal (push web)
- Notificações: imediata, agendada, por segmento, lembrete automático de live
- Patrocinadores e campanhas (sponsors, sponsor_campaigns) com tracking de cliques
- Loja como links externos (store_links)
- Relatórios básicos no painel (cliques, cadastros, opt-in de push)
```

### W4 — Internacionalização completa (4 idiomas)

```text
- Landing multilíngue completa: /en, /pt-br, /es, /ja-jp + hreflang + x-default
- next-intl no painel (inglês e português neste momento; espanhol/japonês conforme seção 12.11)
- Tabelas locales, localized_content, landing_pages, pricing_localizations,
  tenant_locale_settings
- Preços e prices no Stripe para BRL e JPY (seção 12.18/12.24), planos mensal/anual
- Stripe Tax habilitado ou preparado conforme seção 12.20
- Revisão de copy em japonês por nativo antes de campanhas pagas (seção 12.6)
```

### W5 — Operação solo founder (observabilidade e suporte)

```text
- Painel admin orientado a exceções: inadimplência, falhas de webhook/push, integrações
  expiradas, domínios quebrados
- Integração com Sentry (erros), PostHog (analytics), Better Uptime (uptime)
- Base de conhecimento inicial (seção 13) e espaço para assistente de IA de suporte
- E-mails transacionais (Resend/Postmark): boas-vindas, cobrança, suspensão, reativação
- Métricas operacionais da seção 13 (tickets/100 clientes, % onboarding sem ajuda, etc.)
```

### W6 — CRM avançado e integrações de fase 2

```text
- Segmentação de fãs e campanhas direcionadas
- Domínio personalizado por tenant
- Integrações oficiais: YouTube Data API, Instagram Graph API, TikTok Display API,
  Telegram Bot API (conforme seção 17.2)
- IA aplicada a onboarding/suporte/push (seção 13)
- Relatórios para patrocinadores
```

### W7 — Apps nativos (Android primeiro, depois iOS)

```text
- Expo + React Native consumindo o mesmo runtime-config do PWA
- EAS Build / EAS Submit + Fastlane
- Fluxo de publicação assistida (seção 10.2), Android antes de iOS
- App nativo como upsell premium, conforme seção 13
```

### Observações sobre o plano de ondas

A China continental (seção 12.4 e seção 29, Fase 7) permanece como etapa própria, posterior a todas as ondas acima, e não está numerada aqui porque depende de validação de mercado prévia. Cada onda deve terminar com o sistema publicado (deploy real na Vercel) e testável por um usuário externo — isso é o que permite, a qualquer momento, rodar os pilotos da seção 29 (Fase 2) mesmo que ondas posteriores ainda não tenham começado.
