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
 {q:'O que significa CTA num anúncio ou publicação?',o:['Custo total de aquisição','Call to action (apelo à ação)','Conteúdo temático anual','Clique na análise'],a:1,why:'É o convite concreto: «Compra», «Inscreve-te», «Guarda este post».'},
 {q:'Que métrica mede a percentagem de pessoas que clicam num anúncio?',o:['CTR','ROI','CPM','SEO'],a:0,why:'CTR = cliques ÷ impressões.'},
 {q:'Na Story Spine, que frase vem logo a seguir a «Todos os dias…»?',o:['Por causa disso…','E desde então…','Até que um dia…','Até que finalmente…'],a:2,why:'A rotina quebra-se com «Até que um dia…».'},
 {q:'Qual destes é um canal «ganho» (earned media)?',o:['Anúncio no Instagram','Newsletter da marca','Cliente que partilha a marca nas suas stories','Site da marca'],a:2,why:'Ganho é o que os outros dizem de nós sem pagarmos.'},
 {q:'O que é uma persona em marketing?',o:['Um influenciador contratado','Um perfil semi-fictício do cliente ideal','O logótipo da marca','Um tipo de anúncio'],a:1,why:'Baseia-se em dados e entrevistas reais, não em achismos.'},
 {q:'O que quer dizer o «S» de SMART?',o:['Simples','Social','Specific (específico)','Sustentável'],a:2,why:'Specific, Measurable, Achievable, Relevant, Time-bound.'},
 {q:'No funil, em que fase a pessoa já conhece o problema e compara soluções?',o:['Consideração','Notoriedade','Fidelização','Recomendação'],a:0,why:'Notoriedade → Consideração → Decisão → Fidelização.'},
 {q:'Para que serve o SEO?',o:['Comprar anúncios no Google','Aparecer melhor nos resultados orgânicos dos motores de busca','Enviar emails em massa','Medir seguidores'],a:1,why:'Search Engine Optimization: ser encontrado sem pagar por clique.'},
 {q:'Qual destes é mais uma «métrica de vaidade»?',o:['Taxa de conversão','Custo por cliente','Número total de seguidores','Retenção de clientes'],a:2,why:'Impressiona, mas não diz se o negócio está a crescer.'},
 {q:'Qual é o papel do gancho (hook) nos primeiros segundos de um vídeo?',o:['Mostrar o preço','Prender a atenção para a pessoa continuar a ver','Apresentar o logótipo','Pedir uma avaliação'],a:1,why:'Sem gancho, o resto da história nem chega a ser visto.'}
];
window.CANAIS=[
 {t:'Newsletter da marca',b:'own'},{t:'Site e blog',b:'own'},{t:'Conta de Instagram da marca',b:'own'},
 {t:'Anúncio no Meta Ads',b:'paid'},{t:'Campanha no Google Ads',b:'paid'},{t:'Patrocínio a um criador',b:'paid'},
 {t:'Artigo de jornal sobre a marca',b:'earned'},{t:'Cliente que recomenda nas stories',b:'earned'},{t:'Avaliação de 5 estrelas no Google',b:'earned'},{t:'Post impulsionado',b:'paid'}
];
window.BUCKETS=[{k:'own',t:'Próprio',c:'#5ED3A1'},{k:'paid',t:'Pago',c:'#FFB02E'},{k:'earned',t:'Ganho',c:'#A596FF'}];
window.SPINE=[
 'Era uma vez uma padaria de bairro que ninguém conhecia fora da rua.',
 'Todos os dias a Ana abria às 6h e o balcão ficava meio vazio.',
 'Até que um dia filmou, sem pensar muito, o pão a sair do forno.',
 'Por causa disso, o vídeo foi partilhado por vizinhos e criadores locais.',
 'Por causa disso, começaram a aparecer filas à porta ao fim de semana.',
 'Por causa disso, passou a vender também online com encomendas semanais.',
 'Até que finalmente a padaria ganhou uma comunidade fiel.',
 'E desde então, cada fornada tem uma história para contar.'
];
window.PALAVRAS_Q='Escreve 1 a 3 palavras: o que torna uma marca memorável?';
