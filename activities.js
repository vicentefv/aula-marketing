/* Atividades: dados partilhados entre o ecrã e os telemóveis */
window.ACTS=[
 {id:'lobby',t:'Entrada',d:'QR e código da sala'},
 {id:'palavras',t:'Palavras',d:'Nuvem de palavras ao vivo'},
 {id:'quiz',t:'Quiz',d:'10 perguntas, quem for mais rápido ganha mais'},
 {id:'canais',t:'Próprio, pago, ganho',d:'Arrastar cada canal para o sítio certo'},
 {id:'desafio',t:'Sorteio de desafio',d:'Cada equipa recebe a sua marca e persona'},
 {id:'smart',t:'Objetivo SMART',d:'Escrever e receber feedback automático'},
 {id:'gancho',t:'Melhor gancho',d:'Escrever, votar e coroar'},
 {id:'spine',t:'Story Spine',d:'Ordenar a história por arrastar'}
];
window.QUIZ=[
 {q:'O que significa CTA num anúncio ou publicação?',o:['Custo total de aquisição','Call to action (apelo à ação)','Conteúdo temático anual','Clique na análise'],a:1,why:'É o convite concreto: «Compra», «Inscreve-te», «Guarda este vídeo».'},
 {q:'Que métrica mede a percentagem de pessoas que clicam num anúncio?',o:['CTR','ROI','CPM','SEO'],a:0,why:'CTR = cliques ÷ impressões.'},
 {q:'Na Story Spine, que frase vem logo a seguir a «Todos os dias…»?',o:['Por causa disso…','E desde então…','Até que um dia…','Até que finalmente…'],a:2,why:'A rotina quebra-se com «Até que um dia…».'},
 {q:'Qual destes é um canal «ganho» (earned media)?',o:['Anúncio nos Reels','Newsletter da marca','Fã que partilha a marca nos seus stories','Site da marca'],a:2,why:'Ganho é o que os outros dizem de nós sem pagarmos.'},
 {q:'O que é uma persona em marketing?',o:['Um influenciador contratado','Um perfil semi-fictício do cliente ideal','O logótipo da marca','Um tipo de anúncio'],a:1,why:'Baseia-se em dados e entrevistas reais, não em achismos.'},
 {q:'Qual destes é um objetivo SMART?',o:['Ter mais seguidores','Chegar aos 5 000 seguidores no TikTok até 30 de junho','Ficar famoso','Postar muito'],a:1,why:'Tem número e prazo: dá para medir.'},
 {q:'Viste um TikTok de uma marca, ficaste curioso/a e agora estás a comparar com outras no YouTube. Em que fase da jornada estás?',o:['Consideração','Notoriedade','Fidelização','Recomendação'],a:0,why:'Descoberta → Consideração → Decisão → Fidelização → Recomendação.'},
 {q:'Para que serve o SEO?',o:['Comprar anúncios no Google','Aparecer melhor nos resultados orgânicos dos motores de busca','Enviar emails em massa','Medir seguidores'],a:1,why:'Search Engine Optimization: ser encontrado sem pagar por clique.'},
 {q:'Um vídeo teve 2 milhões de views e só 3 vendas. O que isto mostra?',o:['Que as views são sempre o melhor KPI','Que muitas views não garantem resultados','Que o vídeo falhou o gancho','Que o preço está errado'],a:1,why:'Views são alcance, não resultado: o objetivo decide o que medir.'},
 {q:'Qual é o papel do gancho (hook) nos primeiros segundos de um TikTok ou Reel?',o:['Mostrar o preço','Prender a atenção para a pessoa continuar a ver','Apresentar o logótipo','Pedir uma avaliação'],a:1,why:'Sem gancho, fazem scroll e o resto da história nem chega a ser visto.'}
];
window.CANAIS=[
 {t:'Newsletter da marca',b:'own'},{t:'Site e blog',b:'own'},{t:'Perfil do TikTok da marca',b:'own'},
 {t:'Anúncio nos Reels (Meta Ads)',b:'paid'},{t:'Campanha no Google Ads',b:'paid'},{t:'Creator pago a mostrar o produto',b:'paid'},{t:'Post impulsionado',b:'paid'},
 {t:'Meme de fãs que se torna viral',b:'earned'},{t:'Cliente que recomenda nos stories',b:'earned'},{t:'Avaliação de 5 estrelas no Google',b:'earned'}
];
window.BUCKETS=[{k:'own',t:'Próprio',c:'#5ED3A1'},{k:'paid',t:'Pago',c:'#FFB02E'},{k:'earned',t:'Ganho',c:'#A596FF'}];
window.SPINE=[
 'Era uma vez uma estudante de Braga que fazia vídeos de cozinha económica para ninguém ver.',
 'Todos os dias publicava às 19h e recebia, no máximo, três gostos.',
 'Até que um dia mostrou, sem filtros, o jantar de 2 € que fez quando o dinheiro acabou.',
 'Por causa disso, o vídeo foi partilhado por colegas de casa e por outros estudantes.',
 'Por causa disso, começaram a pedir receitas para o fim do mês e a enviar as suas próprias.',
 'Por causa disso, uma marca de supermercado quis patrocinar a série.',
 'Até que finalmente a série chegou aos 100 mil seguidores sem perder a honestidade.',
 'E desde então, cada receita começa com a mesma frase: «Hoje o orçamento é de 2 €.»'
];
window.PALAVRAS_Q='Escreve 1 a 3 palavras: o que te faz parar o scroll numa marca?';
