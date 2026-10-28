/* Atividades: dados partilhados entre o ecrã (apresentação ou ecra.html) e os telemóveis.
   A ordem segue a apresentação «Comunicação Digital e Marketing». */
window.ACTS=[
 {id:'lobby',t:'Entrada',d:'QR e código da sala'},
 {id:'marcas',t:'Marcas',d:'Nuvem de marcas de que gostam'},
 {id:'inquerito',t:'Inquérito',d:'3 perguntas, resultados ao vivo (dados primários)'},
 {id:'sorteio',t:'Sorteio',d:'Marca, persona, conflito e canal para cada grupo'},
 {id:'canais',t:'Próprio, pago, ganho',d:'Arrastar cada meio para o sítio certo'},
 {id:'smart',t:'Objetivo SMART',d:'Escrever e receber verificação automática'},
 {id:'spine',t:'Story Spine',d:'Ordenar a história por arrastar'},
 {id:'gancho',t:'Melhor gancho',d:'Escrever, votar e coroar'},
 {id:'slop',t:'Slop ou não?',d:'6 frases: vazio ou com substância?'},
 {id:'quiz',t:'Quiz final',d:'10 perguntas, quem for mais rápido ganha mais'}
];

window.PALAVRAS_Q='Escreve uma marca de que gostas (até 3).';

/* inquérito ao vivo: dados primários e quantitativos recolhidos na própria aula */
window.INQ=[
 {q:'Onde compraste a última peça de roupa?',o:['Loja física','Loja online','Segunda mão (Vinted, feiras…)','Já nem me lembro']},
 {q:'Quanto tempo passas por dia nas redes sociais?',o:['Menos de 1 hora','1 a 2 horas','2 a 4 horas','Mais de 4 horas']},
 {q:'Que app abres primeiro de manhã?',o:['Instagram','TikTok','WhatsApp','YouTube','Outra']}
];

/* slop ou não: exemplos inventados da loja fictícia Segunda Mão */
window.SLOP=[
 {q:'«Pronta para elevar o teu estilo a outro nível?»',o:['Slop','Tem substância'],a:0,why:'Abertura vazia: serve a qualquer marca do mundo.'},
 {q:'«O casaco da foto chegou ontem de Braga: 12 €, botões originais e um rasgão no bolso que te mostramos no vídeo.»',o:['Slop','Tem substância'],a:1,why:'Tem lugar, número e um defeito admitido. Só esta loja podia ter escrito isto.'},
 {q:'«Acreditamos que a moda sustentável é o futuro.»',o:['Slop','Tem substância'],a:0,why:'Valores de cartaz, sem prova nem opinião própria.'},
 {q:'«Peças únicas, cheias de estilo e história.»',o:['Slop','Tem substância'],a:0,why:'Adjetivos sem prova. Que peças? Que história?'},
 {q:'«A Marta trouxe 30 peças da avó. Sábado às 10h estão todas na loja, a 5 € cada.»',o:['Slop','Tem substância'],a:1,why:'Uma pessoa, um número, um dia e uma hora.'},
 {q:'«Visita-nos e descobre o look perfeito para ti!»',o:['Slop','Tem substância'],a:0,why:'Fecho genérico: sem dia, sem hora, sem motivo. Troca o nome da loja e continua a funcionar.'}
];

/* quiz final: revisão de toda a aula */
window.QUIZ=[
 {q:'Na época da produção (até 1920), qual era a lógica das empresas?',o:['Fazer muito e barato','Ouvir primeiro o cliente','Criar comunidade online','Personalizar ofertas'],a:0,why:'Ford, 1922: «Qualquer cor, desde que seja preto.»'},
 {q:'Fazer um inquérito teu a 10 estudantes dá dados…',o:['Secundários','Primários','Ganhos','De vaidade'],a:1,why:'Primários: recolhes tu, para a tua pergunta. Os secundários já existem (INE, Pordata…).'},
 {q:'Qual é a ordem certa?',o:['Posicionar, segmentar, escolher','Segmentar, escolher o público-alvo, posicionar','Escolher, posicionar, segmentar','Segmentar, posicionar, escolher'],a:1,why:'Primeiro divides o mercado, depois escolhes quem servir e só então decides o lugar na cabeça dessa pessoa.'},
 {q:'Nos 4Ps, o que é a «Praça»?',o:['O preço','Onde e como a pessoa compra','O anúncio','A embalagem'],a:1,why:'Produto, Preço, Praça e Promoção.'},
 {q:'Um fã que fala da marca nos stories, sem lhe pagarem, é um meio…',o:['Próprio','Pago','Ganho','Alugado'],a:2,why:'Ganho é o que os outros dizem de nós sem pagarmos.'},
 {q:'Qual destes objetivos é SMART?',o:['Ter mais seguidores','Chegar aos 5 000 seguidores no TikTok até 30 de junho','Ficar famoso','Postar muito'],a:1,why:'Tem número e prazo: dá para medir.'},
 {q:'Um vídeo teve 2 milhões de views e só 3 vendas. Aqui as views são…',o:['O melhor KPI','Uma métrica de vaidade','Um dado secundário','Um gancho'],a:1,why:'Sobem mas não dizem se o objetivo está mais perto.'},
 {q:'Na Story Spine, que frase vem logo a seguir a «Todos os dias…»?',o:['Por causa disso…','E desde então…','Até que um dia…','Até que finalmente…'],a:2,why:'A rotina quebra-se com «Até que um dia…».'},
 {q:'Qual destes é um sinal de slop?',o:['Um número concreto','Uma pessoa com nome','Adjetivos sem prova («únicas», «perfeito»)','Uma opinião própria'],a:2,why:'O slop é texto correto e vazio: serve a qualquer marca.'},
 {q:'Uma creator recebeu dinheiro para mostrar um produto. O que tem de fazer?',o:['Nada, se gostar do produto','Assinalar que é publicidade, de forma visível','Pôr #pub no fim de 30 hashtags','Pedir autorização à CNPD'],a:1,why:'Tem de se ver que é publicidade: «#pub» ou «parceria paga», bem visível.'}
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
