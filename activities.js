/* Atividades da aula «Comunicação Digital e Marketing».
   Cada atividade vem logo a seguir à matéria que pratica. Os dados são partilhados
   entre a apresentação (que faz de ecrã) e os telemóveis.
   Tipos: lobby · cloud (nuvem) · sort (arrastar para grupos) · form (escrever, com votação opcional)
          order (ordenar a história) · quiz (perguntas com tempo) */
(()=>{
const G='#2EE08A',L='#C8F560',M='#7FD6FF',P='#FFB86B';
const SPINE_LAB=['Era uma vez…','Todos os dias…','Até que um dia…','Por causa disso…','Por causa disso…','Por causa disso…','Até que finalmente…','E desde então…'];

window.ACT={
 lobby:{type:'lobby',t:'Entrada'},

 marcas:{type:'cloud',t:'Marcas da turma',q:'Escreve marcas de que gostas (até 3). Vão ser usadas nas atividades.',pool:true},

 primsec:{type:'sort',t:'Primário ou secundário?',q:'Arrasta cada fonte de dados para o tipo certo.',lim:60,
  buckets:[{k:'p',t:'Primário',c:G},{k:'s',t:'Secundário',c:M}],
  items:[{t:'Censos do INE sobre a população de Lisboa',b:'s'},{t:'Inquérito feito por ti a 30 estudantes do campus',b:'p'},
   {t:'Pesquisas por «roupa vintage» no Google Trends',b:'s'},{t:'Entrevista a 5 clientes da loja',b:'p'},
   {t:'Relatório DataReportal sobre redes sociais em Portugal',b:'s'},{t:'Observar durante 1 hora quem entra na loja',b:'p'},
   {t:'Estatísticas da Pordata sobre rendimentos',b:'s'},{t:'Sondagem nos stories da marca',b:'p'}]},

 posicionar:{type:'form',t:'Posiciona a marca',q:'Completa a fórmula para a marca que te calhou.',lim:150,assign:'marcas',vote:true,
  fields:[{k:'pub',l:'Para (o público)',ph:'estudantes que acabaram de chegar à cidade'},{k:'nec',l:'que (a necessidade)',ph:'querem treinar sem gastar muito'},
   {k:'cat',l:'a marca é (a categoria)',ph:'o ginásio'},{k:'dif',l:'que (a diferença)',ph:'abre às 6h e não pede fidelização'}],
  show:'Para {pub} que {nec}, {A} é {cat} que {dif}.'},

 persona:{type:'form',t:'Cria a persona',q:'Um telemóvel por grupo. A persona da marca que vos calhou.',lim:300,assign:'marcas',group:true,
  fields:[{k:'nome',l:'Nome e idade',ph:'Rita, 21 anos'},{k:'dia',l:'Como é o dia dela?',ph:'estuda de manhã, trabalha num café à tarde'},
   {k:'obj',l:'O que quer conseguir?',ph:'poupar para ir de Erasmus'},{k:'fru',l:'O que a frustra?',ph:'perder tempo à procura de coisas baratas'},
   {k:'onl',l:'Onde passa tempo online e em quem confia?',ph:'TikTok; confia em amigos e em creators pequenos'}],
  show:'<b>{nome}</b> · {A}<br>Dia: {dia}<br>Quer: {obj}<br>Frustra-a: {fru}<br>Online: {onl}'},

 quatrop:{type:'sort',t:'Que P é este?',q:'Loja Segunda Mão: arrasta cada decisão para o P certo.',lim:75,
  buckets:[{k:'pr',t:'Produto',c:G},{k:'pc',t:'Preço',c:L},{k:'pa',t:'Praça',c:M},{k:'pm',t:'Promoção',c:P}],
  items:[{t:'Vender peças vintage escolhidas uma a uma',b:'pr'},{t:'Desconto de 20% para estudantes',b:'pc'},
   {t:'Abrir um pop-up no campus ao sábado',b:'pa'},{t:'Publicar 3 TikToks por semana',b:'pm'},
   {t:'Garantia de troca durante 30 dias',b:'pr'},{t:'Vender também pela Vinted',b:'pa'},
   {t:'Pagar a uma creator para mostrar a coleção',b:'pm'},{t:'Peças entre 8 € e 40 €',b:'pc'}]},

 smart:{type:'form',t:'Torna-o SMART',q:'Transforma «Quero mais seguidores» num objetivo SMART.',lim:120,vote:true,check:'smart',
  fields:[{k:'t',l:'O objetivo SMART',ph:'Chegar aos 2 000 seguidores no TikTok até 31 de janeiro, com 3 vídeos por semana',ta:true}],show:'{t}'},

 canais:{type:'sort',t:'Próprio, pago ou ganho?',q:'Arrasta cada meio para o grupo certo.',lim:75,
  buckets:[{k:'own',t:'Próprio',c:G},{k:'paid',t:'Pago',c:L},{k:'earned',t:'Ganho',c:M}],
  items:[{t:'Newsletter da marca',b:'own'},{t:'Site e blog',b:'own'},{t:'Perfil do TikTok da marca',b:'own'},
   {t:'Anúncio nos Reels (Meta Ads)',b:'paid'},{t:'Campanha no Google Ads',b:'paid'},{t:'Creator pago a mostrar o produto',b:'paid'},{t:'Post impulsionado',b:'paid'},
   {t:'Meme de fãs que se torna viral',b:'earned'},{t:'Cliente que recomenda nos stories',b:'earned'},{t:'Avaliação de 5 estrelas no Google',b:'earned'}]},

 metricas:{type:'sort',t:'Útil ou vaidade?',q:'Objetivo: vender mais na loja online. Que métricas interessam?',lim:60,
  buckets:[{k:'u',t:'Útil',c:G},{k:'v',t:'Vaidade',c:P}],
  items:[{t:'Gostos no último post',b:'v'},{t:'Compras vindas do Instagram',b:'u'},{t:'Número de seguidores',b:'v'},
   {t:'Taxa de conversão do site',b:'u'},{t:'Visualizações de um Reel',b:'v'},{t:'Cliques no link para a loja',b:'u'},
   {t:'Clientes que voltam a comprar',b:'u'},{t:'Impressões de um anúncio',b:'v'}]},

 plano:{type:'form',t:'Mini plano',q:'Um telemóvel por grupo, para a vossa marca. Guardem: é a base do workshop.',lim:300,assign:'marcas',group:true,check:'smart',checkField:'obj',
  fields:[{k:'obj',l:'Objetivo SMART',ph:'Vender 40 peças online até ao fim do mês',ta:true},{k:'c1',l:'Canal 1 e o papel dele',ph:'TikTok: dar a conhecer a loja'},
   {k:'c2',l:'Canal 2 e o papel dele',ph:'Newsletter: avisar das peças novas'},{k:'kpi',l:'KPI a acompanhar',ph:'compras vindas do TikTok'}],
  show:'<b>{A}</b><br>Objetivo: {obj}<br>{c1}<br>{c2}<br>KPI: {kpi}'},

 abt:{type:'form',t:'Escreve em 3 frases',q:'E… MAS… POR ISSO… para o produto que te calhou.',lim:150,assign:'produtos',vote:true,
  fields:[{k:'e',l:'E… (a situação)',ph:'Todos os dias carrego o telemóvel antes de sair'},{k:'mas',l:'MAS… (o conflito)',ph:'às 16h já estou sem bateria e sem mapa'},
   {k:'pi',l:'POR ISSO… (a ação)',ph:'trago sempre este powerbank no bolso'}],
  show:'<b>{A}</b>: {e}, mas {mas}. Por isso, {pi}.'},

 spine:{type:'order',t:'Ordena a história',q:'8 frases baralhadas. Ponham-nas por ordem.',lim:100},

 spinew:{type:'form',t:'A vossa Story Spine',q:'Um telemóvel por grupo: a história da vossa marca em 8 frases.',lim:480,assign:'marcas',group:true,vote:true,
  fields:SPINE_LAB.map((l,i)=>({k:'s'+i,l,ph:''})),
  show:'<b>{A}</b><br>'+SPINE_LAB.map((l,i)=>l+' {s'+i+'}').join('<br>')},

 gancho:{type:'form',t:'O melhor gancho',q:'A frase que abre o vídeo da vossa marca.',lim:120,assign:'marcas',vote:true,check:'hook',
  fields:[{k:'t',l:'O gancho',ph:'Ninguém te conta isto sobre o pão de ontem…'}],show:'«{t}»'},

 slop:{type:'quiz',t:'Slop ou não?',lim:15},
 rgpd:{type:'quiz',t:'Pode ou não pode?',lim:15},
 quiz:{type:'quiz',t:'Quiz final',lim:20}
};
window.ACTS=Object.keys(ACT).map(id=>({id,t:ACT[id].t}));

window.ASSIGN={
 marcas:['Loja de roupa em segunda mão','Festival de música','App de entregas de comida','Ginásio low-cost','Marca de ténis sustentáveis','Café perto da faculdade','Estúdio de pilates','Livraria independente','Loja online de plantas','App de transportes'],
 produtos:['Powerbank','Garrafa reutilizável','App para dividir contas','Auriculares sem fios','Sapatilhas de corrida','Cartão de transporte']
};

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

const SG=['Slop','Tem substância'],PN=['Pode','Não pode'];
window.QSETS={
 slop:[
  {q:'«Pronta para elevar o teu estilo a outro nível?»',o:SG,a:0,why:'Abertura vazia: serve a qualquer marca do mundo.'},
  {q:'«O casaco da foto chegou ontem de Braga: 12 €, botões originais e um rasgão no bolso que te mostramos no vídeo.»',o:SG,a:1,why:'Tem lugar, número e um defeito admitido. Só esta loja podia ter escrito isto.'},
  {q:'«Acreditamos que a moda sustentável é o futuro.»',o:SG,a:0,why:'Valores de cartaz, sem prova nem opinião própria.'},
  {q:'«Peças únicas, cheias de estilo e história.»',o:SG,a:0,why:'Adjetivos sem prova. Que peças? Que história?'},
  {q:'«A Marta trouxe 30 peças da avó. Sábado às 10h estão todas na loja, a 5 € cada.»',o:SG,a:1,why:'Uma pessoa, um número, um dia e uma hora.'},
  {q:'«Visita-nos e descobre o look perfeito para ti!»',o:SG,a:0,why:'Fecho genérico: sem dia, sem hora, sem motivo. Troca o nome da loja e continua a funcionar.'}],
 rgpd:[
  {q:'Enviar a newsletter a quem deixou o email só para participar num passatempo.',o:PN,a:1,why:'Finalidade: os dados só servem para aquilo que disseste. Para a newsletter, pede consentimento à parte.'},
  {q:'Pôr a caixa «Aceito receber novidades» já marcada no formulário.',o:PN,a:1,why:'O consentimento tem de ser ativo. Caixas já marcadas não valem.'},
  {q:'Uma creator mostra um produto que lhe pagaram para mostrar, com «parceria paga» bem visível.',o:PN,a:0,why:'Pode: tem de se ver que é publicidade, e aqui vê-se.'},
  {q:'Usar a foto de um cliente num anúncio sem lhe pedir autorização.',o:PN,a:1,why:'Imagem de uma pessoa é um dado pessoal: precisa de autorização.'},
  {q:'Um cliente pede para apagar os seus dados e a loja apaga-os.',o:PN,a:0,why:'Pode e deve: é um direito da pessoa.'},
  {q:'Publicar a imagem de um «cliente satisfeito» feita com IA, sem dizer que é IA.',o:PN,a:1,why:'Se parece real e pode enganar, tem de ser assinalado.'}],
 quiz:[
  {q:'Na época da produção (até 1920), qual era a lógica das empresas?',o:['Fazer muito e barato','Ouvir primeiro o cliente','Criar comunidade online','Personalizar ofertas'],a:0,why:'Ford, 1922: «Qualquer cor, desde que seja preto.»'},
  {q:'Fazer um inquérito teu a 10 estudantes dá dados…',o:['Secundários','Primários','Ganhos','De vaidade'],a:1,why:'Primários: recolhes tu, para a tua pergunta. Os secundários já existem (INE, Pordata…).'},
  {q:'Qual é a ordem certa?',o:['Posicionar, segmentar, escolher','Segmentar, escolher o público-alvo, posicionar','Escolher, posicionar, segmentar','Segmentar, posicionar, escolher'],a:1,why:'Primeiro divides o mercado, depois escolhes quem servir e só então decides o lugar na cabeça dessa pessoa.'},
  {q:'Nos 4Ps, o que é a «Praça»?',o:['O preço','Onde e como a pessoa compra','O anúncio','A embalagem'],a:1,why:'Produto, Preço, Praça e Promoção.'},
  {q:'Um fã que fala da marca nos stories, sem lhe pagarem, é um meio…',o:['Próprio','Pago','Ganho','Alugado'],a:2,why:'Ganho é o que os outros dizem de nós sem pagarmos.'},
  {q:'Qual destes objetivos é SMART?',o:['Ter mais seguidores','Chegar aos 5 000 seguidores no TikTok até 30 de junho','Ficar famoso','Postar muito'],a:1,why:'Tem número e prazo: dá para medir.'},
  {q:'Um vídeo teve 2 milhões de views e só 3 vendas. Aqui as views são…',o:['O melhor KPI','Uma métrica de vaidade','Um dado secundário','Um gancho'],a:1,why:'Sobem mas não dizem se o objetivo está mais perto.'},
  {q:'Na Story Spine, que frase vem logo a seguir a «Todos os dias…»?',o:['Por causa disso…','E desde então…','Até que um dia…','Até que finalmente…'],a:2,why:'A rotina quebra-se com «Até que um dia…».'},
  {q:'Qual destes é um sinal de slop?',o:['Um número concreto','Uma pessoa com nome','Adjetivos sem prova («únicas», «perfeito»)','Uma opinião própria'],a:2,why:'O slop é texto correto e vazio: serve a qualquer marca.'},
  {q:'Uma creator recebeu dinheiro para mostrar um produto. O que tem de fazer?',o:['Nada, se gostar do produto','Assinalar que é publicidade, de forma visível','Pôr #pub no fim de 30 hashtags','Pedir autorização à CNPD'],a:1,why:'Tem de se ver que é publicidade: «#pub» ou «parceria paga», bem visível.'}]
};

/* utilitários partilhados */
const hsh=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
/* as marcas da turma (nuvem do início) passam a ser as marcas sorteadas nas atividades */
window.POOL=window.POOL||null;
window.poolFrom=w=>{const c={};Object.values(w||{}).forEach(x=>{const t=String(x).trim();const k=t.toLowerCase();if(k){c[k]=c[k]||{t,n:0};c[k].n++}});return Object.values(c).sort((a,b)=>b.n-a.n).slice(0,12).map(x=>x.t)};
window.assignList=a=>a==='marcas'&&Array.isArray(POOL)&&POOL.length>=3?POOL:ASSIGN[a];
window.assignFor=(id,pid)=>{const a=ACT[id]&&ACT[id].assign;if(!a)return '';const L=assignList(a);return L[hsh(pid+a)%L.length]};
window.formText=(id,f,A)=>{const d=ACT[id];const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return d.show.replace(/\{(\w+)\}/g,(m,k)=>k==='A'?e(A||''):(f&&f[k]?e(f[k]):'…'))};
window.formChecks=(id,f)=>{const d=ACT[id];if(!d.check)return null;const t=(f||{})[d.checkField||'t']||'';return d.check==='smart'?smartCheck(t):hookCheck(t)};
window.formFilled=(id,f)=>ACT[id].fields.filter(x=>f&&String(f[x.k]||'').trim()).length;
})();
