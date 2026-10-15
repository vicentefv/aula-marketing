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
 const r=rankOf();b.innerHTML='<div class="who"><span class="dot" style="background:'+me.color+'"></span><span class="n">'+esc(me.name)+'</span></div><div style="display:flex;gap:12px;align-items:center"><span class="sc">'+(r?'#'+r+' · ':'')+tot(me)+' pts</span><span class="conn" id="cn"></span></div>'}
STORE.onConn(ok=>{const c=$('#cn');if(c)c.classList.toggle('off',!ok)});

/* ---------- entrada ---------- */
async function boot(){
 top();
 let exists=null;try{exists=await STORE.get(P+'/created')}catch(e){}
 if(!exists){setMain('<div class="center"><h2>Sala não encontrada</h2><p class="sub">Confirma o código '+esc(C)+' com o professor.</p><a class="btn" href="index.html">Voltar</a></div>');return}
 if(pid){const p=await STORE.get(P+'/players/'+pid);if(p){start();return}pid=null}
 joinForm();
}
function joinForm(){
 setMain('<div class="rise"><p class="sub">Sala <b style="color:var(--amber);letter-spacing:.14em">'+esc(C)+'</b></p><h2 style="margin-top:6px">Como se chama a tua equipa?</h2><div class="join"><input id="nm" maxlength="22" placeholder="Nome da equipa ou o teu" autocomplete="off"><div class="err" id="er"></div><button class="btn" id="go" style="font-size:1.1rem">Entrar</button></div></div>');
 const go=async()=>{const v=$('#nm').value.trim();if(v.length<2){$('#er').textContent='Escreve pelo menos 2 letras.';return}
  $('#go').disabled=true;pid=uid();const cores=CONTENT.cores;const color=cores[Math.floor(Math.random()*cores.length)];
  await STORE.set(P+'/players/'+pid,{name:v,color,at:STORE.TS});LS(PK,pid);vib(20);start()};
 $('#go').onclick=go;$('#nm').addEventListener('keydown',e=>{if(e.key==='Enter')go()});
}
function start(){
 STORE.on(P+'/players',v=>{players=v||{};me=players[pid]||me;top();update()});
 STORE.on(P+'/act',v=>{act=v||{id:'lobby',key:'lobby',phase:'in'};subAns();render()});
}
function subAns(){
 if(act.key===curKey)return;curKey=act.key;ans={};myVote=null;local={};
 if(unAns)unAns();if(unVt)unVt();
 unAns=STORE.on(P+'/ans/'+curKey,v=>{ans=v||{};update()});
 unVt=STORE.on(P+'/vt/'+curKey+'/'+pid,v=>{myVote=v;update()});
}
function render(){clearInterval(timer);sig=act.key+'|'+act.phase;const f=VIEWS[act.id]||VIEWS.lobby;f.render();update(true)}
function update(force){const f=VIEWS[act.id]||VIEWS.lobby;if(f.update)f.update(force)}
const briefHTML=(compact)=>{const b=me&&me.brief;if(!b)return '';const rows=[['Marca',b.m,'var(--coral)'],['Persona',b.p,'var(--violet)'],['Conflito',b.c,'var(--amber)'],['Canal',b.k,'var(--mint)']];
 return '<div class="brief">'+rows.map(r=>'<div class="row" style="--c:'+r[2]+'"><small>'+r[0]+'</small><span'+(compact?' style="font-size:1.05rem"':'')+'>'+esc(r[1])+'</span></div>').join('')+'</div>'};
const startTimer=(el,lim)=>{const f=()=>{const e=(STORE.now()-act.t0)/1000;const x=Math.max(0,1-e/lim);const b=$(el);if(b)b.style.transform='scaleX('+x+')';return e<lim};f();timer=setInterval(()=>{if(!f())clearInterval(timer)},150)};
const elapsed=()=>(STORE.now()-act.t0)/1000;

/* ---------- vistas ---------- */
const VIEWS={
lobby:{render(){setMain('<div class="center rise"><div class="bigdot" style="background:'+(me?me.color:'var(--violet)')+'"></div><h2>Estás dentro'+(me?', '+esc(me.name):'')+'</h2><p class="sub">Olha para o ecrã. A próxima atividade aparece aqui sozinha.</p></div>')}},

palavras:{render(){setMain('<h2>'+esc(PALAVRAS_Q)+'</h2><div class="join" style="margin-top:0"><input id="w" maxlength="24" placeholder="Uma palavra"><button class="btn" id="sw">Enviar palavra</button></div><div class="chips" id="mine"></div><p class="sub" id="lim"></p>');
  const send=()=>{const v=$('#w').value.trim();if(!v)return;const mine=(ans[pid]&&ans[pid].w)?Object.keys(ans[pid].w).length:0;if(mine>=3)return;STORE.set(P+'/ans/'+curKey+'/'+pid+'/w/'+uid(),v.slice(0,24));$('#w').value='';vib()};
  $('#sw').onclick=send;$('#w').addEventListener('keydown',e=>{if(e.key==='Enter')send()})},
 update(){const w=(ans[pid]&&ans[pid].w)||{};const a=Object.values(w);const m=$('#mine');if(!m)return;m.innerHTML=a.map(x=>'<span class="chip ok pop">'+esc(x)+'</span>').join('');const l=$('#lim');if(l)l.textContent=a.length>=3?'Limite de 3 palavras atingido.':'Podes enviar até 3 palavras ('+a.length+'/3).';const s=$('#sw');if(s)s.disabled=a.length>=3}},

quiz:{render(){
  const Q=QUIZ[act.idx];
  if(act.phase==='q'){
   setMain('<p class="sub">Pergunta '+(act.idx+1)+' de '+QUIZ.length+'</p><div class="tbar"><i id="tb"></i></div><h2 style="font-size:clamp(22px,6vw,30px)">'+esc(Q.q)+'</h2><div class="opts" id="ops">'+Q.o.map((o,i)=>'<button class="opt c'+i+'" data-i="'+i+'">'+esc(o)+'</button>').join('')+'</div><p class="sub" id="st"></p>');
   startTimer('#tb',act.lim);
   $('#ops').onclick=e=>{const b=e.target.closest('.opt');if(!b||ans[pid]||elapsed()>act.lim+.5)return;const i=+b.dataset.i;vib();STORE.set(P+'/ans/'+curKey+'/'+pid,{c:i,t:Math.round(STORE.now()-act.t0)})};
  }else if(act.phase==='rev'){
   const a=ans[pid],ok=a&&a.c===Q.a,p=(me&&me.pts&&me.pts[curKey])||0;
   setMain('<div class="verdict '+(ok?'ok':'no')+' pop"><b>'+(ok?'Certo!':a?'Errado':'Sem resposta')+'</b><div style="margin-top:6px;font-size:1.2rem">+'+p+' pontos</div></div><div class="card"><small style="color:var(--mut)">Resposta certa</small><div style="font-weight:700;margin-top:4px">'+esc(Q.o[Q.a])+'</div><p class="sub" style="margin-top:8px">'+esc(Q.why)+'</p></div><p class="prog">Aguarda a próxima pergunta…</p>');
  }else{setMain('<div class="center"><h2>Fim do quiz</h2><p class="sub">Vê o ranking no ecrã.</p></div>')}},
 update(){if(act.phase!=='q')return;const a=ans[pid];document.querySelectorAll('.opt').forEach(b=>{const s=a&&+b.dataset.i===a.c;b.classList.toggle('sel',!!s);b.classList.toggle('dim',!!a&&!s)});const s=$('#st');if(s)s.textContent=a?'Resposta enviada. Espera pelos outros…':'';}},

canais:{render(){
  if(act.phase!=='in'){const m=(ans[pid]&&ans[pid].m)||{};let ok=0;CANAIS.forEach((c,i)=>{if(m[i]===c.b)ok++});const p=(me&&me.pts&&me.pts[curKey])||0;
   setMain('<div class="verdict ok pop"><b>'+ok+' / '+CANAIS.length+'</b><div style="margin-top:6px">+'+p+' pontos</div></div><p class="prog">Vê as respostas certas no ecrã.</p>');return}
  setMain('<div class="tbar"><i id="tb"></i></div><p class="prog" id="pr"></p><div id="dk" style="min-height:130px"></div><div class="bks" id="bk">'+BUCKETS.map(b=>'<button class="bk" data-k="'+b.k+'" style="background:'+b.c+'">'+b.t+'</button>').join('')+'</div><p class="sub" style="text-align:center">Arrasta o cartão para o grupo certo (ou toca no grupo).</p>');
  startTimer('#tb',act.lim);
  $('#bk').onclick=e=>{const b=e.target.closest('.bk');if(b&&local.cur!=null)place(local.cur,b.dataset.k)};
 },
 update(){if(act.phase!=='in'||!$('#dk'))return;const m=(ans[pid]&&ans[pid].m)||{};const order=shuf(CANAIS.length,hash(pid+C));const next=order.find(i=>m[i]==null);const done=order.filter(i=>m[i]!=null).length;
  $('#pr').textContent=next==null?'Terminaste! Espera pelos outros.':'Cartão '+(done+1)+' de '+CANAIS.length;
  if(next==null){local.cur=null;$('#dk').innerHTML='<div class="verdict ok"><b>Feito</b></div>';$('#bk').style.display='none';return}
  if(local.cur===next&&$('#dk .dcard'))return;local.cur=next;$('#dk').innerHTML='<div class="dcard pop" id="dc">'+esc(CANAIS[next].t)+'</div>';dragCard($('#dc'))}},

desafio:{render(){setMain('<h2>O vosso desafio</h2>'+(me&&me.brief?'<div class="rise">'+briefHTML()+'</div><p class="sub">Guarda isto: vai servir nas próximas atividades.</p>':'<div class="center"><div class="bigdot" style="background:var(--amber)"></div><p class="sub">O professor vai sortear. Aguarda…</p></div>'))},
 update(){const has=!!(me&&me.brief);if(local.hb!==has){local.hb=has;this.render()}}},

smart:{render(){
  if(act.phase==='rev'){const t=(ans[pid]&&ans[pid].t)||'';const ch=smartCheck(t);const p=(me&&me.pts&&me.pts[curKey])||0;
   setMain('<div class="verdict ok pop"><b>'+ch.filter(x=>x[1]).length+' / 5</b><div style="margin-top:6px">+'+p+' pontos</div></div><div class="card">'+esc(t||'Sem resposta')+'</div><div class="chips">'+ch.map(x=>'<span class="chip '+(x[1]?'ok':'no')+'">'+(x[1]?'✓ ':'')+x[0]+'</span>').join('')+'</div>');return}
  setMain('<h2>Escreve o objetivo SMART</h2>'+(me&&me.brief?'<details class="card"><summary style="cursor:pointer;font-weight:700">O vosso desafio</summary><div style="margin-top:12px">'+briefHTML(true)+'</div></details>':'')+'<textarea class="ta" id="tx" placeholder="Ex.: Aumentar as encomendas online em 20% até ao fim de março."></textarea><div class="chips" id="ck"></div><button class="btn" id="sd">Enviar objetivo</button><p class="sub" id="ms"></p>');
  $('#tx').value=local.t||(ans[pid]&&ans[pid].t)||'';
  $('#tx').oninput=()=>{local.t=$('#tx').value;chips()};chips();
  $('#sd').onclick=()=>{const t=$('#tx').value.trim();if(!t)return;STORE.set(P+'/ans/'+curKey+'/'+pid,{t:t.slice(0,300)});vib(20)};
  function chips(){const ch=smartCheck($('#tx').value);$('#ck').innerHTML=ch.map(x=>'<span class="chip '+(x[1]?'ok':'no')+'">'+(x[1]?'✓ ':'')+x[0]+'</span>').join('')}},
 update(){const m=$('#ms');if(m&&act.phase==='in')m.textContent=ans[pid]?'Enviado. Podes melhorar e reenviar até fechar.':''}},

gancho:{render(){
  if(act.phase==='in'){
   setMain('<h2>Escreve o gancho</h2><p class="sub">A frase que abre o vosso vídeo ou post.</p>'+(me&&me.brief?'<details class="card"><summary style="cursor:pointer;font-weight:700">O vosso desafio</summary><div style="margin-top:12px">'+briefHTML(true)+'</div></details>':'')+'<textarea class="ta" id="tx" style="min-height:100px" placeholder="Ex.: Ninguém te conta isto sobre o pão de ontem…"></textarea><div class="chips" id="ck"></div><button class="btn" id="sd">Enviar gancho</button><p class="sub" id="ms"></p>');
   $('#tx').value=local.t||(ans[pid]&&ans[pid].t)||'';
   const chips=()=>{$('#ck').innerHTML=hookCheck($('#tx').value).map(x=>'<span class="chip '+(x[1]?'ok':'no')+'">'+(x[1]?'✓ ':'')+x[0]+'</span>').join('')};
   $('#tx').oninput=()=>{local.t=$('#tx').value;chips()};chips();
   $('#sd').onclick=()=>{const t=$('#tx').value.trim();if(!t)return;STORE.set(P+'/ans/'+curKey+'/'+pid,{t:t.slice(0,200)});vib(20)};
  }else if(act.phase==='vote'){
   setMain('<h2>Vota no melhor gancho</h2><p class="sub">Não podes votar no teu.</p><div id="vl" style="display:flex;flex-direction:column;gap:10px"></div>');
   $('#vl').onclick=e=>{const b=e.target.closest('.vote');if(!b)return;STORE.set(P+'/vt/'+curKey+'/'+pid,b.dataset.p);vib(20)};
  }else{
   const mine=Object.values(local.vc||{});const p=(me&&me.pts&&me.pts[curKey])||0;
   setMain('<div class="verdict ok pop"><b>+'+p+' pontos</b><div style="margin-top:6px" class="sub">Vê o vencedor no ecrã.</div></div>')}},
 update(){
  if(act.phase==='in'){const m=$('#ms');if(m)m.textContent=ans[pid]?'Enviado. Podes melhorar e reenviar até fechar.':''}
  if(act.phase==='vote'){const vl=$('#vl');if(!vl)return;const s=Object.keys(ans).filter(k=>k!==pid&&ans[k]&&ans[k].t&&players[k]);
   const h=s.map(k=>'<button class="vote'+(myVote===k?' sel':'')+'" data-p="'+k+'">'+esc(ans[k].t)+'</button>').join('')||'<p class="sub">Ainda não há ganchos para votar.</p>';
   if(vl.dataset.h!==h){vl.dataset.h=h;vl.innerHTML=h}}}},

spine:{render(){
  if(act.phase!=='in'){const o=(ans[pid]&&ans[pid].o)?ans[pid].o.split(',').map(Number):[];let ok=0;SPINE.forEach((_,i)=>{if(o[i]===i)ok++});const p=(me&&me.pts&&me.pts[curKey])||0;
   setMain('<div class="verdict ok pop"><b>'+ok+' / '+SPINE.length+'</b><div style="margin-top:6px">posições certas · +'+p+' pontos</div></div><p class="prog">A história certa está no ecrã.</p>');return}
  local.order=local.order||(ans[pid]&&ans[pid].o?ans[pid].o.split(',').map(Number):shuf(SPINE.length,hash(pid+C+'s')));
  setMain('<div class="tbar"><i id="tb"></i></div><h2 style="font-size:clamp(22px,6vw,30px)">Põe a história por ordem</h2><p class="sub">Arrasta pelo ícone ⋮⋮ à esquerda.</p><div class="sortl" id="sl">'+local.order.map(i=>'<div class="si" data-i="'+i+'"><span class="h">⋮⋮</span><span>'+esc(SPINE[i])+'</span></div>').join('')+'</div><button class="btn" id="sd">Enviar ordem</button><p class="sub" id="ms"></p>');
  startTimer('#tb',act.lim);
  sortable($('#sl'),()=>{local.order=[...$('#sl').children].map(n=>+n.dataset.i)});
  $('#sd').onclick=()=>{local.order=[...$('#sl').children].map(n=>+n.dataset.i);STORE.set(P+'/ans/'+curKey+'/'+pid,{o:local.order.join(',')});vib(25)}},
 update(){const m=$('#ms');if(m&&act.phase==='in')m.textContent=ans[pid]?'Enviado. Podes reordenar e reenviar até acabar o tempo.':''}}
};

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
