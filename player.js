/* Página do telemóvel */
(()=>{
const q=new URLSearchParams(location.search);
const C=(q.get('c')||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const $=s=>document.querySelector(s),main=$('#main');
if(!C){location.replace('index.html');return}
const P='rooms/'+C;
const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const PK='aula-pid-'+C+(q.get('as')||'');let pid=LS(PK),me=null,act={id:'lobby',key:'lobby',phase:'in'},players={},ans={},myVote=null,sig='',unAns=null,unVt=null,curKey=null,timer=null,local={};
const tot=p=>Object.values((p&&p.pts)||{}).reduce((a,b)=>a+(+b||0),0);
const rankOf=()=>{const a=Object.keys(players).map(k=>[k,tot(players[k])]).sort((x,y)=>y[1]-x[1]);const i=a.findIndex(x=>x[0]===pid);return i<0?null:i+1};
const vib=n=>{try{navigator.vibrate&&navigator.vibrate(n||12)}catch(e){}};
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const shuf=(n,seed)=>{const a=[...Array(n).keys()];let s=seed||1;const r=()=>{s=Math.imul(s^s>>>15,1|s);s^=s+Math.imul(s^s>>>7,61|s);return((s^s>>>14)>>>0)/4294967296};for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const setMain=h=>{main.innerHTML=h};

/* ---------- topo ---------- */
function top(){const b=$('#top');if(!me){b.innerHTML='<div class="who"><span class="n">Sala '+esc(C)+'</span></div><span class="conn" id="cn"></span>';return}
 const r=rankOf();b.innerHTML='<div class="who"><span class="dot" style="background:'+me.color+'"></span><span class="n">'+esc(me.name)+'</span></div><div style="display:flex;gap:12px;align-items:center">'+(window.__WK?'':'<span class="sc">'+(r?'#'+r+' · ':'')+tot(me)+' pts</span>')+'<span class="conn" id="cn"></span></div>'}
STORE.onConn(ok=>{const c=$('#cn');if(c)c.classList.toggle('off',!ok)});

/* ---------- entrada ---------- */
async function boot(){
 top();
 let exists=null;try{exists=await STORE.get(P+'/created')}catch(e){}
 if(!exists){setMain('<div class="center"><h2>Sala não encontrada</h2><p class="sub">Confirma o código '+esc(C)+' no ecrã da sala.</p><a class="btn" href="index.html">Voltar</a></div>');return}
 let wk=null;try{wk=await STORE.get(P+'/wk')}catch(e){}
 window.__WK=!!wk;
 if(pid){const p=await STORE.get(P+'/players/'+pid);if(p){start();return}pid=null}
 joinForm(!!wk);
}
function joinForm(wk){
 setMain('<div class="rise"><p class="sub">Sala <b style="color:var(--amber);letter-spacing:.14em">'+esc(C)+'</b></p><h2 style="margin-top:6px">'+(wk?'Como se chama a tua equipa?':'Como te chamas?')+'</h2>'+(wk?'<p class="sub">Só o responsável da equipa entra nesta sala.</p>':'')+'<div class="join"><input id="nm" maxlength="22" placeholder="'+(wk?'Nome da equipa':'O teu nome')+'" autocomplete="off"><div class="err" id="er"></div><button class="btn" id="go" style="font-size:1.1rem">Entrar</button></div></div>');
 const go=async()=>{const v=$('#nm').value.trim();if(v.length<2){$('#er').textContent='Escreve pelo menos 2 letras.';return}
  {const bn=badName(v);if(bn){$('#er').textContent=bn;return}}
  $('#go').disabled=true;pid=uid();const cores=CONTENT.cores;const color=cores[Math.floor(Math.random()*cores.length)];
  await STORE.set(P+'/players/'+pid,{name:v,color,at:STORE.TS});LS(PK,pid);vib(20);start()};
 $('#go').onclick=go;$('#nm').addEventListener('keydown',e=>{if(e.key==='Enter')go()});
}
function start(){
 STORE.on(P+'/players',v=>{players=v||{};if(pid&&me&&!players[pid]){pid=null;me=null;try{localStorage.removeItem(PK)}catch(e){}joinForm(!!window.__WK);const er=$('#er');if(er)er.textContent='O teu nome foi removido. Escolhe outro.';return}me=players[pid]||me;top();update()});
 STORE.on(P+'/act',v=>{act=v||{id:'lobby',key:'lobby',phase:'in'};subAns();render()});
 STORE.on(P+'/pool',v=>{const n=Array.isArray(v)?v:null;const ch=JSON.stringify(n)!==JSON.stringify(window.POOL);window.POOL=n;if(ch&&T()==='form'&&act.phase==='in')render()});
}
function subAns(){
 if(act.key===curKey)return;curKey=act.key;ans={};myVote=null;local={};
 if(unAns)unAns();if(unVt)unVt();
 unAns=STORE.on(P+'/ans/'+curKey,v=>{ans=v||{};update()});
 unVt=STORE.on(P+'/vt/'+curKey+'/'+pid,v=>{myVote=v;update()});
}
const T=()=>(ACT[act.id]||ACT.lobby).type;
function render(){clearInterval(timer);sig=act.key+'|'+act.phase;if(act.phase==='ready'&&(D().lim)){setMain(head()+'<div class="center rise"><div class="bigdot" style="background:'+(me?me.color:'var(--violet)')+'"></div><h2>Prepara-te</h2><p class="sub">A atividade começa daqui a pouco. Olha para o ecrã.</p></div>');return}const f=VIEWS[T()]||VIEWS.lobby;f.render();update(true)}
function update(force){if(act.phase==='ready')return;const f=VIEWS[T()]||VIEWS.lobby;if(f.update)f.update(force)}
/* quando o tempo acaba, envia o que a pessoa tiver escrito ou ordenado */
const startTimer=(el,lim,onEnd)=>{const f=()=>{const e=(STORE.now()-act.t0)/1000;const x=Math.max(0,1-e/lim);const b=$(el);if(b)b.style.transform='scaleX('+x+')';return e<lim};f();timer=setInterval(()=>{if(!f()){clearInterval(timer);if(onEnd)try{onEnd()}catch(x){}}},150)};
const elapsed=()=>(STORE.now()-act.t0)/1000;
const D=()=>ACT[act.id]||{};
const myPts=()=>(me&&me.pts&&me.pts[curKey])||0;
const chipH=ch=>ch.map(x=>'<span class="chip '+(x[1]?'ok':'no')+'">'+(x[1]?'✓ ':'')+x[0]+'</span>').join('');
const head=()=>'<p class="sub" style="text-transform:uppercase;letter-spacing:.12em;font-weight:700;font-size:.75rem;color:var(--coral)">'+esc(D().t||'')+'</p>';

/* ---------- workshop: rascunho, trabalho organizado ---------- */
const wkClean=e=>{const o={};WK.fields().forEach(f=>{const v=String((e||{})[f.k]||'').trim();if(v)o[f.k]=v.slice(0,500)});return o};
const wkSave=now=>{clearTimeout(local.svT);const L=local,go=()=>{try{STORE.set(P+'/entrega/'+pid+'/d',wkClean(L.ent))}catch(e){}};if(now)go();else local.svT=setTimeout(go,700)};
const rerender=()=>{const f=VIEWS[T()];if(f)f.render()};
const loadMy=cb=>{if(local.myL)return;local.myL=1;STORE.get(P+'/entrega/'+pid).then(v=>{local.my=(v&&v.f)||null;if(cb)cb()}).catch(()=>{local.my=null})};
const myWorkBtn=()=>'<button class="btn ghost" id="mw" style="width:100%">'+(local.showW?'Esconder o nosso trabalho':'Ver o nosso trabalho')+'</button>'+(local.showW?(local.my?boardP(local.my):'<p class="sub">'+(local.my===null?'A vossa equipa não enviou o trabalho.':'A abrir…')+'</p>'):'');
const wireMyWork=()=>{const b=$('#mw');if(b)b.onclick=()=>{local.showW=!local.showW;loadMy(rerender);rerender()}};
function boardP(f){f=f||{};const has=k=>!!String(f[k]||'').trim(),e=k=>has(k)?esc(String(f[k]).trim()):'<span class="sub">—</span>',uq=t=>String(t||'').trim().replace(/^[«"“'‘]+|[»"”'’]+$/g,'');
 const br=[['marca','Marca'],['heroi','Herói'],['conflito','Conflito'],['canal','Canal']].filter(x=>has(x[0])),SP=ACT.entrega.steps.find(s=>s.spine).f;
 return '<div class="wb">'+(br.length?'<div class="wb-brief">'+br.map(x=>'<span><small>'+x[1]+'</small>'+esc(f[x[0]])+'</span>').join('')+'</div>':'')+
  '<div class="wb-h"><b>1</b>A estratégia</div><div class="wb-c"><small>Persona</small><strong>'+e('pnome')+'</strong><p>'+e('pdor')+'</p>'+(has('ponde')?'<p class="sub" style="margin-top:6px">Online: '+esc(f.ponde)+'</p>':'')+'</div><div class="wb-c"><small>Objetivo</small><p>'+e('obj')+'</p><small>KPI</small><p>'+e('kpi')+'</p></div>'+
  '<div class="wb-h"><b>2</b>A história</div><ol class="wb-sp">'+SP.map(x=>{const t=WK.line(x.l,f[x.k]);return '<li><small>'+esc(x.l)+'</small> '+(t?esc(t):'<span class="sub">—</span>')+'</li>'}).join('')+'</ol>'+
  '<div class="wb-c"><small>Gancho</small><q>'+(uq(f.gancho)?esc(uq(f.gancho)):'—')+'</q></div><div class="wb-c"><small>A peça'+(has('canal')?' · '+esc(f.canal):'')+'</small><p>'+e('peca')+'</p>'+(has('cta')?'<small>No fim pedem</small><p>'+esc(f.cta)+'</p>':'')+'</div></div>'}

/* ---------- vistas por tipo ---------- */
const VIEWS={
deliver:{render(){const d=D(),TM=Object.values(players).some(x=>x.team);
  if(TM&&!(me&&me.team)){setMain(head()+'<div class="center rise"><div class="bigdot" style="background:'+(me?me.color:'var(--violet)')+'"></div><h2>O responsável envia</h2><p class="sub">Ajuda a tua equipa a preencher no telemóvel do responsável.</p></div>');return}
  if(!local.dl){local.dl=1;setMain(head()+'<div class="center"><p class="sub">A abrir o vosso trabalho…</p></div>');
   STORE.get(P+'/entrega/'+pid).then(v=>{local.ent=Object.assign({},(v&&(v.d||v.f))||{});local.sent=!!(v&&v.f);local.view=local.sent?'board':'form';local.st=local.st||0;if(T()==='deliver')VIEWS.deliver.render()}).catch(()=>{local.ent={};local.view='form';local.st=0;VIEWS.deliver.render()});return}
  if(!local.ent)return;
  const S_=d.steps,i=local.st||0,nm=me&&(me.team||me.name)||'';
  if(local.view==='board'){
   setMain(head()+'<div class="verdict ok pop"><b>Trabalho enviado</b><div class="sub" style="margin-top:6px">É isto que vão apresentar. Podem corrigir até ao palco.</div></div><h2 style="font-size:clamp(22px,6vw,30px)">'+esc(nm)+'</h2>'+boardP(local.ent)+'<button class="btn ghost" id="ed" style="width:100%">Corrigir o trabalho</button>');
   $('#ed').onclick=()=>{local.view='form';local.st=0;VIEWS.deliver.render();scrollTo(0,0)};return}
  const dots='<div class="wsteps">'+S_.map((s,j)=>'<i class="'+(j<=i?'on':'')+'"></i>').join('')+'<i class="'+(i>=S_.length?'on':'')+'"></i></div>';
  if(i>=S_.length){const N=WK.fields().length,k=WK.filled(local.ent);
   setMain(head()+dots+'<h2 style="font-size:clamp(22px,6vw,30px)">Rever e enviar</h2><p class="sub">'+(k<N?'Faltam '+(N-k)+' de '+N+' campos. Podem voltar atrás para completar.':'Está tudo preenchido.')+'</p>'+boardP(local.ent)+'<div class="wnav"><button class="btn ghost" id="bk">Voltar</button><button class="btn" id="sd">Enviar trabalho</button></div><p class="sub" id="ms"></p>');
   $('#bk').onclick=()=>{local.st=S_.length-1;local.ok=0;VIEWS.deliver.render();scrollTo(0,0)};
   $('#sd').onclick=()=>{const o=wkClean(local.ent);if(!Object.keys(o).length){$('#ms').textContent='Preencham pelo menos um campo.';vib(40);return}
    if(Object.values(o).some(isBad)){$('#ms').textContent='Há palavras não permitidas. Corrijam antes de enviar.';vib(40);return}
    if(k<N&&!local.ok){local.ok=1;$('#ms').textContent='Ainda faltam campos. Toquem outra vez em Enviar para enviar assim.';vib(30);return}
    STORE.set(P+'/entrega/'+pid,{f:o,d:o,at:STORE.TS});local.sent=1;local.view='board';vib(25);VIEWS.deliver.render();scrollTo(0,0)};return}
  const s=S_[i];
  setMain(head()+dots+'<p class="sub" style="font-weight:700">Passo '+(i+1)+' de '+S_.length+'</p><h2 style="font-size:clamp(24px,6.4vw,32px)">'+esc(s.t)+'</h2><p class="sub">'+esc(s.s)+'</p><div>'+s.f.map((f,j)=>{const v=esc(local.ent[f.k]||'');
    return '<label class="wl">'+(s.spine?'<em>'+(j+1)+'</em>':'')+esc(f.l)+'</label>'+(f.opts?'<div class="wopts">'+f.opts.map(o=>'<button class="wop'+(local.ent[f.k]===o?' sel':'')+'" data-o="'+f.k+'">'+esc(o)+'</button>').join('')+'</div>':'')+
     (f.ta||s.spine?'<textarea class="ta" data-k="'+f.k+'" maxlength="'+(s.spine?220:500)+'" placeholder="'+esc(s.spine?f.ph:'Ex.: '+f.ph)+'" style="min-height:'+(s.spine?64:96)+'px">'+v+'</textarea>':'<input class="fi" data-k="'+f.k+'" maxlength="'+(s.spine?220:160)+'" placeholder="'+esc(s.spine?f.ph:'Ex.: '+f.ph)+'" value="'+v+'">')+(f.chk?'<div class="chips" id="ck-'+f.k+'" style="margin-top:8px"></div>':'')}).join('')+'</div><div class="wnav">'+(i?'<button class="btn ghost" id="bk">Anterior</button>':'')+'<button class="btn" id="nx">'+(i<S_.length-1?'Seguinte':'Rever')+'</button></div>');
  const chk=k=>{const el=$('#ck-'+k),f=s.f.find(x=>x.k===k);if(!el||!f)return;const t=local.ent[k]||'';el.innerHTML=t.trim()?chipH(f.chk==='smart'?smartCheck(t):hookCheck(t)):''};
  main.querySelectorAll('[data-k]').forEach(el=>{chk(el.dataset.k);el.oninput=()=>{local.ent[el.dataset.k]=el.value;chk(el.dataset.k);wkSave();if(el.dataset.k in {marca:1,heroi:1,conflito:1,canal:1})main.querySelectorAll('[data-o="'+el.dataset.k+'"]').forEach(b=>b.classList.toggle('sel',b.textContent===el.value))}});
  main.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const k=b.dataset.o;local.ent[k]=b.textContent;const inp=main.querySelector('[data-k="'+k+'"]');if(inp)inp.value=b.textContent;main.querySelectorAll('[data-o="'+k+'"]').forEach(x=>x.classList.toggle('sel',x===b));vib();wkSave()});
  if($('#bk'))$('#bk').onclick=()=>{local.st=i-1;VIEWS.deliver.render();scrollTo(0,0)};
  $('#nx').onclick=()=>{local.st=i+1;local.ok=0;wkSave(true);VIEWS.deliver.render();scrollTo(0,0)}}},
evalw:{render(){const A=ACT.avaliacao||{},CR=A.crit||[],RB=A.rub||[];
  setMain(head()+'<div class="center rise" style="flex:none;padding-top:10px"><div class="bigdot" style="background:'+(me?me.color:'var(--violet)')+'"></div><h2>Avaliação no ecrã</h2><p class="sub">Cada trabalho é avaliado com a mesma grelha, de 1 a 5 em cada critério.</p></div><div class="card wgr">'+CR.map((c,i)=>'<div><b>'+esc(c[0])+'</b><small>1 '+esc(RB[i]?RB[i][0]:'')+' · 3 '+esc(RB[i]?RB[i][1]:'')+' · 5 '+esc(RB[i]?RB[i][2]:'')+'</small></div>').join('')+'</div>'+myWorkBtn());wireMyWork()}},
result:{render(){
  if(act.phase!=='rev'){local.fin=0;setMain(head()+'<div class="center rise"><div class="bigdot" style="background:'+(me?me.color:'var(--violet)')+'"></div><h2>Olha para o ecrã</h2><p class="sub">O vencedor junta a avaliação do trabalho e a votação da turma.</p></div>');return}
  if(!local.fin){local.fin=1;local.fv=undefined;STORE.get(P+'/fin/'+pid).then(v=>{local.fv=v||null;if(T()==='result')VIEWS.result.render()}).catch(()=>{local.fv=null;VIEWS.result.render()});setMain(head()+'<div class="center"><p class="sub">A abrir as vossas notas…</p></div>');return}
  if(local.fv===undefined)return;const v=local.fv,n1=x=>x==null?'–':(+x).toFixed(1).replace('.',',');
  if(!v){setMain(head()+'<div class="center rise"><h2>Resultados no ecrã</h2></div>');return}
  const CR=(ACT.avaliacao||{}).crit||[],ev=String(v.ev||'').split(',').map(Number);
  setMain(head()+'<div class="verdict ok pop"><b>'+(v.r===1?'Venceram!':v.r+'.º lugar')+'</b><div class="sub" style="margin-top:6px">entre '+v.n+' equipas</div></div><div class="card wres"><span>Avaliação do trabalho</span><b>'+n1(v.e)+'</b><span>Votação da turma</span><b>'+n1(v.v)+'</b><span style="font-weight:700">Total</span><b style="color:var(--coral)">'+n1(v.t)+'</b></div>'+(v.ev?'<div class="card wres"><span class="sub" style="grid-column:1/-1;font-weight:700">A vossa grelha</span>'+CR.map((c,i)=>'<span>'+esc(c[0])+'</span><b>'+(ev[i]>=1?ev[i]:'–')+'</b>').join('')+'</div>':''));if(v.r===1)vib([30,60,30])}},
team:{render(){const t=me&&me.team;
  if(t){setMain(head()+'<div class="center rise"><div class="bigdot" style="background:'+me.color+'"></div><h2>'+esc(t)+'</h2><p class="sub">És o responsável desta equipa. No fim, é neste telemóvel que a equipa vota.</p><button class="btn" id="tx" style="margin-top:14px">Mudar o nome</button></div>');$('#tx').onclick=()=>{STORE.set(P+'/players/'+pid+'/team',null)};return}
  setMain(head()+'<h2>És o responsável da tua equipa?</h2><p class="sub">Só o responsável escreve aqui. Os outros podem ignorar.</p><div class="join" style="margin-top:12px"><input id="tn" maxlength="24" placeholder="Nome da equipa"><button class="btn" id="ts">Registar</button></div><p class="sub" id="ms"></p>');
  const go=()=>{const v=$('#tn').value.trim();if(!v)return;{const bn=badName(v);if(bn){$('#ms').textContent=bn;vib(40);return}}STORE.set(P+'/players/'+pid+'/team',v.slice(0,24));vib(20)};
  $('#ts').onclick=go;$('#tn').addEventListener('keydown',e=>{if(e.key==='Enter')go()})},
 update(){const t=!!(me&&me.team);if(t!==!!local.tm){local.tm=t;VIEWS.team.render()}}},
rank:{render(){const ps=Object.keys(players).map(k=>({id:k,c:players[k].color,t:Object.values(players[k].pts||{}).reduce((a,b)=>a+(+b||0),0)})).sort((a,b)=>b.t-a.t);const i=ps.findIndex(p=>p.id===pid);
  const rv=act.phase==='rev';setMain(head()+'<div class="center rise"><div class="bigdot" style="background:'+(me?me.color:'var(--violet)')+'"></div><h2>'+(rv&&i>=0?(i+1)+'.º lugar':'Olha para o ecrã')+'</h2><p class="sub">'+(i>=0?ps[i].t+' pontos'+(rv?' · de '+ps.length:''):'')+'</p></div>')},
 update(){VIEWS.rank.render()}},
lobby:{render(){setMain('<div class="center rise"><div class="bigdot" style="background:'+(me?me.color:'var(--violet)')+'"></div><h2>Estás dentro'+(me?', '+esc(me.name):'')+'</h2><p class="sub">Olha para o ecrã. A próxima atividade aparece aqui sozinha.</p></div>')}},

cloud:{render(){setMain(head()+'<h2>'+esc(D().q)+'</h2><div class="join" style="margin-top:0"><input id="w" maxlength="24" placeholder="Escreve aqui"><button class="btn" id="sw">Enviar</button></div><div class="chips" id="mine"></div><p class="sub" id="lim"></p>');
  const send=()=>{const v=$('#w').value.trim();if(!v)return;if(isBad(v)){$('#lim').textContent='Isso não é permitido.';$('#w').value='';vib(40);return}const mine=(ans[pid]&&ans[pid].w)?Object.keys(ans[pid].w).length:0;if(mine>=3)return;STORE.set(P+'/ans/'+curKey+'/'+pid+'/w/'+uid(),v.slice(0,24));$('#w').value='';vib()};
  $('#sw').onclick=send;$('#w').addEventListener('keydown',e=>{if(e.key==='Enter')send()})},
 update(){const a=Object.values((ans[pid]&&ans[pid].w)||{});const m=$('#mine');if(!m)return;m.innerHTML=a.map(x=>'<span class="chip ok pop">'+esc(x)+'</span>').join('');const l=$('#lim');if(l)l.textContent=a.length>=3?'Limite de 3 atingido.':'Podes enviar até 3 ('+a.length+'/3).';const s=$('#sw');if(s)s.disabled=a.length>=3}},

sort:{render(){const d=D(),IT=d.items,BK=d.buckets;
  if(act.phase!=='in'){const m=(ans[pid]&&ans[pid].m)||{};let ok=0;IT.forEach((c,i)=>{if(m[i]===c.b)ok++});
   setMain(head()+'<div class="verdict ok pop"><b>'+ok+' / '+IT.length+'</b><div style="margin-top:6px">+'+myPts()+' pontos</div></div><div class="card" style="margin-top:12px">'+IT.map((c,i)=>{const b=BK.find(x=>x.k===c.b);const r=m[i]===c.b;return '<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid var(--line)"><span>'+(r?'✓ ':'✗ ')+esc(c.t)+'</span><b style="color:'+b.c+';white-space:nowrap">'+esc(b.t)+'</b></div>'}).join('')+'</div>');return}
  setMain(head()+'<p class="sub" style="margin-bottom:8px">'+esc(d.q)+'</p><div class="tbar"><i id="tb"></i></div><p class="prog" id="pr"></p><div id="dk" style="min-height:130px"></div><div class="bks" id="bk" style="grid-template-columns:repeat('+Math.min(BK.length,BK.length===4?2:3)+',1fr)">'+BK.map(b=>'<button class="bk" data-k="'+b.k+'" style="background:'+b.c+'">'+esc(b.t)+'</button>').join('')+'</div><p class="sub" style="text-align:center">Arrasta o cartão para o grupo certo (ou toca no grupo).</p>');
  startTimer('#tb',act.lim||60);
  $('#bk').onclick=e=>{const b=e.target.closest('.bk');if(b&&local.cur!=null)place(local.cur,b.dataset.k)}},
 update(){if(act.phase!=='in'||!$('#dk'))return;const IT=D().items;const m=(ans[pid]&&ans[pid].m)||{};const order=shuf(IT.length,hash(pid+C+act.id));const next=order.find(i=>m[i]==null);const done=order.filter(i=>m[i]!=null).length;
  $('#pr').textContent=next==null?'Terminaste! Espera pelos outros.':'Cartão '+(done+1)+' de '+IT.length;
  if(next==null){local.cur=null;$('#dk').innerHTML='<div class="verdict ok"><b>Feito</b></div>';$('#bk').style.display='none';return}
  if(local.cur===next&&$('#dk .dcard'))return;local.cur=next;$('#dk').innerHTML='<div class="dcard pop" id="dc">'+esc(IT[next].t)+'</div>';dragCard($('#dc'))}},

form:{render(){const d=D(),A=assignFor(act.id,pid),mine=(ans[pid]&&ans[pid].f)||{};
  const ctx=(A?'<div class="brief" style="margin:8px 0 12px"><div class="row" style="--c:var(--coral)"><small>'+(d.assign==='produtos'?'O teu produto':d.group?'A marca do grupo':'A tua marca')+'</small><span>'+esc(A)+'</span></div></div>':'');
  if(act.phase==='in'){
   setMain(head()+'<h2 style="font-size:clamp(20px,5.4vw,26px)">'+esc(d.q)+'</h2>'+ctx+'<div class="tbar" style="margin-bottom:10px"><i id="tb"></i></div>'+d.fields.map(f=>'<label class="sub" style="display:block;margin:10px 0 4px;color:var(--ink);font-weight:700">'+esc(f.l)+'</label>'+(f.ta||d.fields.length===1?'<textarea class="ta" data-k="'+f.k+'" maxlength="240" placeholder="'+esc(f.ph?'Ex.: '+f.ph:'')+'" style="min-height:'+(d.fields.length===1?110:74)+'px"></textarea>':'<input class="fi" data-k="'+f.k+'" maxlength="160" placeholder="'+esc(f.ph?'Ex.: '+f.ph:'')+'">')).join('')+'<div class="chips" id="ck" style="margin-top:10px"></div><button class="btn" id="sd" style="margin-top:14px;width:100%">Enviar</button><p class="sub" id="ms"></p>');
   main.querySelectorAll('[data-k]').forEach(el=>{el.value=(local.f&&local.f[el.dataset.k])!=null?local.f[el.dataset.k]:(mine[el.dataset.k]||'');el.oninput=()=>{local.f=local.f||{};local.f[el.dataset.k]=el.value;chk()}});
   const read=()=>{const o={};main.querySelectorAll('[data-k]').forEach(el=>{const v=el.value.trim();if(v)o[el.dataset.k]=v.slice(0,240)});return o};
   const chk=()=>{const c=formChecks(act.id,read());$('#ck').innerHTML=c?chipH(c):''};chk();
   startTimer('#tb',act.lim||120,()=>{const o=read();if(Object.keys(o).length&&!Object.values(o).some(isBad))STORE.set(P+'/ans/'+curKey+'/'+pid,{f:o,a:A});main.querySelectorAll('[data-k]').forEach(e=>e.disabled=true);const b=$('#sd');if(b)b.disabled=true;const m=$('#ms');if(m)m.textContent=Object.keys(o).length?'Acabou o tempo. A tua resposta foi enviada.':'Acabou o tempo.'});
   $('#sd').onclick=()=>{const o=read();if(!Object.keys(o).length){$('#ms').textContent='Escreve pelo menos um campo.';return}if(Object.values(o).some(isBad)){$('#ms').textContent='Há palavras não permitidas. Reformula o texto.';vib(40);return}STORE.set(P+'/ans/'+curKey+'/'+pid,{f:o,a:A});vib(20)};
  }else if(act.phase==='vote'){
   setMain(head()+'<h2>Vota no melhor</h2><p class="sub">Não podes votar no teu.</p><div id="vl" style="display:flex;flex-direction:column;gap:10px;margin-top:10px"></div>');
   $('#vl').onclick=e=>{const b=e.target.closest('.vote');if(!b)return;STORE.set(P+'/vt/'+curKey+'/'+pid,b.dataset.p);vib(20)};
  }else{
   setMain(head()+'<div class="verdict ok pop"><b>'+(myPts()?'+'+myPts()+' pontos':'Enviado')+'</b><div style="margin-top:6px" class="sub">Vê o resultado no ecrã.</div></div>'+(ans[pid]?'<div class="card" style="margin-top:12px">'+formText(act.id,ans[pid].f,ans[pid].a)+'</div>':''))}},
 update(){const d=D();
  if(act.phase==='in'){const m=$('#ms'),over=act.lim&&(STORE.now()-act.t0)/1000>=act.lim;if(m)m.textContent=over?(ans[pid]?'Acabou o tempo. A tua resposta foi enviada.':'Acabou o tempo.'):ans[pid]?'Enviado. Podes melhorar e reenviar até fechar.':''}
  if(act.phase==='vote'){const vl=$('#vl');if(!vl)return;const s=Object.keys(ans).filter(k=>k!==pid&&ans[k]&&ans[k].f&&players[k]);
   const h=s.map(k=>'<button class="vote'+(myVote===k?' sel':'')+'" data-p="'+k+'">'+formText(act.id,ans[k].f,ans[k].a)+'</button>').join('')||'<p class="sub">Ainda não há respostas para votar.</p>';
   if(vl.dataset.h!==h){vl.dataset.h=h;vl.innerHTML=h}}}},

order:{render(){
  if(act.phase!=='in'){const o=(ans[pid]&&ans[pid].o)?ans[pid].o.split(',').map(Number):[];let ok=0;SPINE.forEach((_,i)=>{if(o[i]===i)ok++});
   setMain(head()+'<div class="verdict ok pop"><b>'+ok+' / '+SPINE.length+'</b><div style="margin-top:6px">posições certas · +'+myPts()+' pontos</div></div><p class="prog">A história certa está no ecrã.</p>');return}
  local.order=local.order||(ans[pid]&&ans[pid].o?ans[pid].o.split(',').map(Number):shuf(SPINE.length,hash(pid+C+'s')));
  setMain(head()+'<div class="tbar"><i id="tb"></i></div><h2 style="font-size:clamp(22px,6vw,30px)">Põe a história por ordem</h2><p class="sub">Arrasta pelo ícone ⋮⋮ à esquerda.</p><div class="sortl" id="sl">'+local.order.map(i=>'<div class="si" data-i="'+i+'"><span class="h">⋮⋮</span><span>'+esc(SPINE[i])+'</span></div>').join('')+'</div><button class="btn" id="sd">Enviar ordem</button><p class="sub" id="ms"></p>');
  startTimer('#tb',act.lim||100,()=>{local.order=[...$('#sl').children].map(n=>+n.dataset.i);STORE.set(P+'/ans/'+curKey+'/'+pid,{o:local.order.join(',')});const b=$('#sd');if(b)b.disabled=true;const m=$('#ms');if(m)m.textContent='Acabou o tempo. A tua ordem foi enviada.'});
  sortable($('#sl'),()=>{local.order=[...$('#sl').children].map(n=>+n.dataset.i)});
  $('#sd').onclick=()=>{local.order=[...$('#sl').children].map(n=>+n.dataset.i);STORE.set(P+'/ans/'+curKey+'/'+pid,{o:local.order.join(',')});vib(25)}},
 update(){const m=$('#ms');if(m&&act.phase==='in')m.textContent=act.lim&&(STORE.now()-act.t0)/1000>=act.lim?'Acabou o tempo. A tua ordem foi enviada.':ans[pid]?'Enviado. Podes reordenar e reenviar até acabar o tempo.':''}},

rate:{render(){const d=D(),N=d.crit.length,cur=act.cur,tm=cur&&players[cur],TM=Object.values(players).some(x=>x.team),nm=x=>x.team||x.name,dn=act.done||{};
  const msg=(h,s,x)=>{setMain(head()+'<div class="center rise"'+(x?' style="flex:none;padding-top:10px"':'')+'><div class="bigdot" style="background:'+(tm?tm.color:(me?me.color:'var(--violet)'))+'"></div><h2>'+h+'</h2>'+(s?'<p class="sub">'+s+'</p>':'')+'</div>'+(x||''));wireMyWork()};
  if(act.phase==='end'){msg('Resultados no ecrã','Obrigado pelos votos.');return}
  if(cur===pid&&(act.phase==='pitch'||act.phase==='vote')){loadMy(rerender);setMain(head()+'<div class="verdict ok pop"><b>É a vossa vez!</b><div class="sub" style="margin-top:6px">'+(act.phase==='vote'?'A turma está a votar. Não votam na vossa equipa.':'Apresentem a partir daqui: primeiro a estratégia, depois a história.')+'</div></div>'+(local.my?boardP(local.my):'<p class="sub">'+(local.my===null?'Não enviaram o trabalho: apresentem de viva voz.':'A abrir o vosso trabalho…')+'</p>'));return}
  if(!tm||act.phase==='in'){msg(dn[pid]?'Já apresentaram ✓':'Aguarda a próxima equipa',dn[pid]?'Agora votam nas outras equipas.':'Olha para o ecrã. Entretanto, podem rever o vosso trabalho.',dn[pid]?'':myWorkBtn());return}
  if(cur===pid){msg('Olha para o ecrã','');return}
  if(TM&&!(me&&me.team)){msg(esc(nm(tm))+' está a apresentar','O responsável da tua equipa é quem vota.');return}
  if(act.phase==='pitch'){msg(esc(nm(tm))+' está a apresentar','Ouve com atenção: a seguir votas.');return}
  if(act.phase==='rev'){msg('Olha para o ecrã','');return}
  local.rv=local.rv||{};if(!local.rv[cur])local.rv[cur]=Array(N).fill(0);
  setMain(head()+'<h2 style="font-size:clamp(20px,5.4vw,26px)">Vota em '+esc(nm(tm))+'</h2><p class="sub" style="margin-bottom:8px">De 1 (fraco) a 5 (excelente) em cada critério.</p>'+d.crit.map((c,i)=>'<div class="rrow" data-i="'+i+'"><div class="rl2"><b>'+esc(c[0])+'</b><small>'+esc(c[1])+'</small></div><div class="rb">'+[1,2,3,4,5].map(n=>'<button class="rn" data-n="'+n+'">'+n+'</button>').join('')+'</div></div>').join('')+'<button class="btn" id="rs" style="margin-top:16px;width:100%">Enviar voto</button><p class="sub" id="ms"></p>');
  main.onclick=e=>{const b=e.target.closest('.rn');if(!b||act.phase!=='vote')return;const row=b.closest('.rrow');local.rv[cur][+row.dataset.i]=+b.dataset.n;vib();paint()};
  const rs=$('#rs');if(rs)rs.onclick=()=>{const v=local.rv[cur];if(v.some(x=>!x)){$('#ms').textContent='Falta pontuar todos os critérios.';vib(40);return}STORE.set(P+'/ans/'+curKey+'/'+pid+'/r/'+cur,v.join(','));vib(20);$('#ms').textContent='Voto enviado. Podes alterar até fechar.'};
  paint()},
 update(){if(act.phase!=='vote'||!act.cur||act.cur===pid)return;if(Object.values(players).some(x=>x.team)&&!(me&&me.team))return;const N=D().crit.length;local.rv=local.rv||{};const mine=((ans[pid]||{}).r||{})[act.cur];
  if(mine&&!(local.rv[act.cur]&&local.rv[act.cur].some(x=>x))){local.rv[act.cur]=String(mine).split(',').map(Number);paint()}
  const m=$('#ms');if(m&&mine&&!m.textContent)m.textContent='Voto enviado. Podes alterar até fechar.'}},

quiz:{render(){const QS=QSETS[act.id]||[],Q=QS[act.idx];
  if(act.phase==='q'){
   setMain(head()+'<p class="sub">'+(act.idx+1)+' de '+QS.length+'</p><div class="tbar"><i id="tb"></i></div><h2 style="font-size:clamp(20px,5.6vw,28px)">'+esc(Q.q)+'</h2><div class="opts" id="ops">'+Q.o.map((o,i)=>'<button class="opt c'+i+'" data-i="'+i+'">'+esc(o)+'</button>').join('')+'</div><p class="sub" id="st"></p>');
   startTimer('#tb',act.lim);
   $('#ops').onclick=e=>{const b=e.target.closest('.opt');if(!b||ans[pid]||elapsed()>act.lim+.5)return;vib();STORE.set(P+'/ans/'+curKey+'/'+pid,{c:+b.dataset.i,t:Math.round(STORE.now()-act.t0)})};
  }else if(act.phase==='rev'){const a=ans[pid],ok=a&&a.c===Q.a;
   setMain(head()+'<div class="verdict '+(ok?'ok':'no')+' pop"><b>'+(ok?'Certo!':a?'Errado':'Sem resposta')+'</b><div style="margin-top:6px;font-size:1.2rem">+'+myPts()+' pontos</div></div><div class="card"><small style="color:var(--mut)">Resposta certa</small><div style="font-weight:700;margin-top:4px">'+esc(Q.o[Q.a])+'</div><p class="sub" style="margin-top:8px">'+esc(Q.why)+'</p></div><p class="prog">Aguarda a próxima…</p>');
  }else{setMain('<div class="center"><h2>Fim</h2><p class="sub">Vê o ranking no ecrã.</p></div>')}},
 update(){if(act.phase!=='q')return;const a=ans[pid];document.querySelectorAll('.opt').forEach(b=>{const s=a&&+b.dataset.i===a.c;b.classList.toggle('sel',!!s);b.classList.toggle('dim',!!a&&!s)});const s=$('#st');if(s)s.textContent=a?'Resposta enviada. Espera pelos outros…':''}}
};

function paint(){const cur=act.cur,v=local.rv&&local.rv[cur];if(!v)return;main.querySelectorAll('.rrow').forEach(r=>{const x=v[+r.dataset.i];r.querySelectorAll('.rn').forEach(b=>b.classList.toggle('sel',+b.dataset.n===x))})}

/* ---------- arrastar ---------- */
function place(i,k){if(local.cur==null)return;local.cur=null;vib(15);STORE.set(P+'/ans/'+curKey+'/'+pid+'/m/'+i,k);const m=((ans[pid]||{}).m)||{};m[i]=k;ans[pid]=Object.assign({},ans[pid],{m});update()}
function dragCard(el){
 el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture(e.pointerId);const r=el.getBoundingClientRect();const ox=e.clientX-r.left,oy=e.clientY-r.top;const ph=document.createElement('div');ph.style.height=r.height+'px';el.after(ph);el.classList.add('drag');el.style.left=r.left+'px';el.style.top=r.top+'px';el.style.width=r.width+'px';
  let hov=null;
  const mv=ev=>{el.style.left=(ev.clientX-ox)+'px';el.style.top=(ev.clientY-oy)+'px';const t=document.elementFromPoint(ev.clientX,ev.clientY);const b=t&&t.closest&&t.closest('.bk');if(hov!==b){if(hov)hov.classList.remove('hov');hov=b;if(b)b.classList.add('hov')}};
  const up=ev=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);const k=hov&&hov.dataset.k;if(hov)hov.classList.remove('hov');
   if(k){place(local.cur,k)}else{el.classList.remove('drag');el.style.cssText='';ph.remove()}};
  el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)})}
function sortable(list,onEnd){
 list.addEventListener('pointerdown',e=>{const h=e.target.closest('.h');if(!h)return;e.preventDefault();const it=h.closest('.si');h.setPointerCapture(e.pointerId);
  const r=it.getBoundingClientRect(),oy=e.clientY-r.top;const ph=document.createElement('div');ph.className='si ph0';ph.style.height=r.height+'px';it.after(ph);
  it.classList.add('drag');it.style.width=r.width+'px';it.style.left=r.left+'px';it.style.top=r.top+'px';let y=e.clientY,raf=0;
  const place_=()=>{const kids=[...list.children].filter(n=>n!==it&&n!==ph);let before=null;for(const n of kids){const b=n.getBoundingClientRect();if(y<b.top+b.height/2){before=n;break}}if(before)list.insertBefore(ph,before);else list.appendChild(ph)};
  const loop=()=>{if(y<80)scrollBy(0,-10);else if(y>innerHeight-80)scrollBy(0,10);raf=requestAnimationFrame(loop)};loop();
  const mv=ev=>{y=ev.clientY;it.style.top=(y-oy)+'px';place_()};
  const up=()=>{cancelAnimationFrame(raf);h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',up);list.insertBefore(it,ph);ph.remove();it.classList.remove('drag');it.style.cssText='';vib(10);onEnd()};
  h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',up)})}

boot();
})();
