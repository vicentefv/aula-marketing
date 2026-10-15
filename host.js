/* Ecrã do professor (projetor) */
(()=>{
const $=s=>document.querySelector(s),body=$('#body');
const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}};
const ALPHA='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newCode=()=>Array.from({length:4},()=>ALPHA[Math.floor(Math.random()*ALPHA.length)]).join('');
let C=null,P=null,players={},act={id:'lobby',key:'lobby',phase:'in'},ans={},vt={},curKey=null,unA=null,unV=null,sigS='',showRank=false,local={},rolling=false;
const tot=p=>Object.values((p&&p.pts)||{}).reduce((a,b)=>a+(+b||0),0);
const plist=()=>Object.keys(players).map(k=>Object.assign({id:k},players[k])).sort((a,b)=>(a.at||0)-(b.at||0));
const base=new URL('.',location.href).href;
const joinURL=()=>base+'jogar.html?c='+C;
const oo=a=>a&&a.o?a.o.split(',').map(Number):[];
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const dot=c=>'<i style="display:inline-block;width:1.6vh;height:1.6vh;border-radius:50%;background:'+c+'"></i>';

/* defesa extra: nada ofensivo chega ao ecrã, mesmo que alguém contorne o telemóvel */
function cleanP(v){const o={};let n=0;for(const k in v){n++;const p=Object.assign({},v[k]);if(isBad(p.name))p.name='Equipa '+n;o[k]=p}return o}
function cleanA(v){const o={};for(const k in v){const a=Object.assign({},v[k]);if(a.t&&isBad(a.t))continue;if(a.w){const w={};for(const x in a.w)if(!isBad(a.w[x]))w[x]=a.w[x];a.w=w}o[k]=a}return o}
/* ---------- sala ---------- */
async function init(){
 C=(new URLSearchParams(location.search).get('c')||LS('aula-room')||'').toUpperCase();
 if(C){let e=null;try{e=await STORE.get('rooms/'+C+'/created')}catch(x){}if(!e)C=null}
 if(!C)await createRoom();
 P='rooms/'+C;LS('aula-room',C);
 $('#pcode').textContent=C;$('#purl').textContent=base.replace(/^https?:\/\//,'').replace(/\/$/,'');
 STORE.on(P+'/players',v=>{players=cleanP(v||{});update()});
 STORE.on(P+'/act',v=>{act=v||{id:'lobby',key:'lobby',phase:'in'};subs();render()});
 setInterval(tick,150);
}
async function createRoom(){let c,t=0;do{c=newCode();t++}while(t<8&&await STORE.get('rooms/'+c+'/created'));C=c;await STORE.set('rooms/'+c,{created:STORE.TS,act:{id:'lobby',key:'lobby',phase:'in'}})}
function subs(){if(act.key===curKey)return;curKey=act.key;ans={};vt={};if(unA)unA();if(unV)unV();unA=STORE.on(P+'/ans/'+curKey,v=>{ans=cleanA(v||{});update()});unV=STORE.on(P+'/vt/'+curKey,v=>{vt=v||{};update()})}
const setAct=o=>STORE.set(P+'/act',o);
const now=()=>STORE.now();

/* ---------- navegação entre atividades ---------- */
function go(id){const run=uid().slice(0,4);local={};rolling=false;showRank=false;
 const A={id,run,phase:'in',t0:now()};
 if(id==='quiz'){A.idx=0;A.phase='q';A.lim=20;A.key='quiz'+run+'_0'}
 else{A.key=id+run;if(id==='canais')A.lim=75;if(id==='smart')A.lim=150;if(id==='gancho')A.lim=120;if(id==='spine')A.lim=100}
 if(id==='lobby')A.key='lobby';
 setAct(A)}
const nextId=()=>{const i=ACTS.findIndex(a=>a.id===act.id);return ACTS[Math.min(ACTS.length-1,i+1)].id};

/* ---------- pontuação ---------- */
function award(map){const u={};for(const pid in map)u[pid+'/pts/'+act.key]=map[pid];return STORE.update(P+'/players',u)}
const submitted=()=>Object.keys(ans).filter(k=>players[k]);
function revealQuiz(){if(local.rv===act.key)return;local.rv=act.key;const Q=QUIZ[act.idx],m={};plist().forEach(p=>{const a=ans[p.id];m[p.id]=a&&a.c===Q.a?Math.round(1000*(1-Math.min(1,a.t/(act.lim*1000))*.5)):0});award(m).then(()=>setAct(Object.assign({},act,{phase:'rev'})))}
function revealCanais(){const m={};plist().forEach(p=>{const a=(ans[p.id]||{}).m||{};m[p.id]=CANAIS.reduce((s,c,i)=>s+(a[i]===c.b?30:0),0)});award(m).then(()=>setAct(Object.assign({},act,{phase:'rev'})))}
function revealSmart(){const m={};plist().forEach(p=>{const a=ans[p.id];m[p.id]=a?smartCheck(a.t).filter(x=>x[1]).length*20:0});award(m).then(()=>setAct(Object.assign({},act,{phase:'rev'})))}
function revealGancho(){const c={};Object.values(vt).forEach(t=>{c[t]=(c[t]||0)+1});const m={};plist().forEach(p=>m[p.id]=(c[p.id]||0)*100);award(m).then(()=>setAct(Object.assign({},act,{phase:'rev'})))}
function revealSpine(){const m={};plist().forEach(p=>{const o=oo(ans[p.id]);m[p.id]=SPINE.reduce((s,_,i)=>s+(o[i]===i?40:0),0)});award(m).then(()=>setAct(Object.assign({},act,{phase:'rev'})))}
function roll(){if(rolling)return;rolling=true;render();setTimeout(()=>{const ps=plist(),m=shuf(CONTENT.marcas),pe=shuf(CONTENT.personas),co=shuf(CONTENT.conflitos),ca=shuf(CONTENT.canais),u={};
  ps.forEach((p,i)=>{u[p.id+'/brief']={m:m[i%m.length],p:pe[i%pe.length],c:co[i%co.length],k:ca[i%ca.length]}});
  STORE.update(P+'/players',u).then(()=>{rolling=false;setAct(Object.assign({},act,{phase:'rev'}));render()})},1300)}

/* ---------- barra de ação ---------- */
function action(){const id=act.id,ph=act.phase,nx={label:'Seguinte atividade',fn:()=>go(nextId())};
 if(id==='lobby')return{label:'Começar',fn:()=>go('palavras')};
 if(id==='quiz'){if(ph==='q')return{label:'Revelar',fn:revealQuiz};if(ph==='rev')return act.idx<QUIZ.length-1?{label:'Pergunta seguinte',fn:()=>{const i=act.idx+1;setAct(Object.assign({},act,{idx:i,phase:'q',t0:now(),key:'quiz'+act.run+'_'+i}))}}:{label:'Ver resultado final',fn:()=>setAct(Object.assign({},act,{phase:'end'}))};return nx}
 if(id==='canais')return ph==='in'?{label:'Revelar',fn:revealCanais}:nx;
 if(id==='desafio')return ph==='in'?{label:'Sortear',fn:roll}:Object.assign({sec:{label:'Sortear outra vez',fn:roll}},nx);
 if(id==='smart')return ph==='in'?{label:'Revelar e pontuar',fn:revealSmart}:nx;
 if(id==='gancho')return ph==='in'?{label:'Abrir votação',fn:()=>setAct(Object.assign({},act,{phase:'vote'}))}:ph==='vote'?{label:'Revelar vencedor',fn:revealGancho}:nx;
 if(id==='spine')return ph==='in'?{label:'Revelar',fn:revealSpine}:nx;
 return nx}

/* ---------- vistas ---------- */
const eb=t=>'<div class="eyebrow">'+t+'</div>';
function ranking(n){const a=plist().map(p=>[p,tot(p)]).sort((x,y)=>y[1]-x[1]).slice(0,n||8);const mx=Math.max(1,...a.map(x=>x[1]));
 if(!a.length)return '<p class="sub">Ainda ninguém entrou.</p>';
 return '<div class="board">'+a.map((x,i)=>'<div class="brow"><span class="rk">'+(i+1)+'</span><div class="bar"><i data-w="'+Math.round(x[1]/mx*100)+'" style="width:0;background:'+x[0].color+'"></i><b>'+esc(x[0].name)+'</b></div><span class="pt">'+x[1]+'</span></div>').join('')+'</div>'}
const grow=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelectorAll('.bar i[data-w]').forEach(i=>i.style.width=i.dataset.w+'%')));
const chipsH=(ch)=>ch.map(x=>'<span class="chip '+(x[1]?'ok':'no')+'">'+(x[1]?'✓ ':'')+x[0]+'</span>').join('');
const timerH=()=>'<div class="tl"><i id="tl"></i></div>';
const cntH=(label)=>'<div class="sidei"><span>'+label+'</span><b id="cn">0</b></div>';

const V={
lobby:{render(){const url=joinURL();let svg='';try{const qr=qrcode(0,'M');qr.addData(url);qr.make();svg=qr.createSvgTag({cellSize:4,margin:0,scalable:true})}catch(e){svg=''}
  setBody('<div class="lobby"><div class="qr rise">'+svg+'</div><div class="rise" style="animation-delay:.12s;display:flex;flex-direction:column;gap:2.6vh">'+eb('Aula ao vivo')+'<h1 style="font-size:6.6vh">Entra com o telemóvel</h1><div style="font-size:2.6vh;color:var(--mut)">Lê o QR ou escreve o código em <b style="color:var(--ink)">'+esc(base.replace(/^https?:\/\//,'').replace(/\/$/,''))+'</b></div><div class="codebig">'+C+'</div><div><div class="eyebrow" style="color:var(--mut);margin-bottom:1.4vh"><span id="np">0</span> na sala</div><div class="plist" id="pl"></div></div></div></div>')},
 update(){const l=$('#pl');if(!l)return;const ps=plist();$('#np').textContent=ps.length;const have=new Set([...l.children].map(n=>n.dataset.i));ps.forEach(p=>{if(!have.has(p.id)){const d=document.createElement('span');d.className='pl pop';d.dataset.i=p.id;d.innerHTML='<i style="background:'+p.color+'"></i>'+esc(p.name);l.appendChild(d)}});[...l.children].forEach(n=>{if(!players[n.dataset.i])n.remove()})}},

palavras:{render(){local.cl={};setBody(eb('Palavras')+'<h2 style="margin:1.4vh 0 0;max-width:70vw">'+esc(PALAVRAS_Q)+'</h2>'+cntH('Participantes')+'<div class="cloud" id="cloud"></div>')},
 update(){const cl=$('#cloud');if(!cl)return;const c={};let who=0;Object.keys(ans).forEach(k=>{if(!players[k])return;who++;Object.values((ans[k]||{}).w||{}).forEach(w=>{const x=String(w).trim().toLowerCase();if(x)c[x]=(c[x]||0)+1})});$('#cn').textContent=who;
  const cols=CONTENT.cores;let i=0;Object.keys(c).forEach(w=>{let s=local.cl[w];if(!s){s=document.createElement('span');s.textContent=w;s.style.color=cols[(i+3)%cols.length];local.cl[w]=s;cl.appendChild(s)}s.style.fontSize=Math.min(16,4.5+c[w]*2.6)+'vh';i++})}},

quiz:{render(){const Q=QUIZ[act.idx];
  if(act.phase==='end'){setBody(eb('Quiz · resultado final')+'<h2 style="margin:1.4vh 0 3vh">Quem sabe mais?</h2>'+ranking(8));grow();return}
  const rv=act.phase==='rev';
  setBody(eb('Quiz · pergunta '+(act.idx+1)+' de '+QUIZ.length)+cntH('Respostas')+'<div style="height:2vh"></div>'+(rv?'<div class="tl"><i style="width:0"></i></div>':timerH())+'<div class="qbig">'+esc(Q.q)+'</div><div class="qgrid">'+Q.o.map((o,i)=>'<div class="qo c'+i+(rv?(i===Q.a?' right':' dim'):'')+'"><span>'+esc(o)+'</span><span class="cnt" id="q'+i+'"></span></div>').join('')+'</div>'+(rv?'<div class="why rise">'+esc(Q.why)+'</div>':''))},
 update(){if(act.phase==='end')return;const Q=QUIZ[act.idx];const n=submitted().length;const c=$('#cn');if(c)c.textContent=n+' / '+plist().length;
  if(act.phase==='rev'){const k=[0,0,0,0];Object.keys(ans).forEach(p=>{if(players[p]&&ans[p].c!=null)k[ans[p].c]++});k.forEach((v,i)=>{const e=$('#q'+i);if(e)e.textContent=v})}
  else if(n&&n>=plist().length)revealQuiz()}},

canais:{render(){
  if(act.phase==='rev'){setBody(eb('Próprio, pago ou ganho?')+'<h2 style="margin:1.4vh 0 1.4vh">As respostas</h2><div style="display:flex;gap:1.4vw;margin-bottom:1vh">'+BUCKETS.map(b=>'<span class="it3 tag" style="background:'+b.c+';color:#17121f;font-weight:800;padding:.6vh 1.4vw;border-radius:99px;font-size:2.2vh">'+b.t+'</span>').join('')+'</div><div class="items3" id="it"></div>');return}
  setBody(eb('Próprio, pago ou ganho?')+'<h2 style="margin:1.4vh 0 2vh;max-width:70vw">Arrastem cada canal para o grupo certo</h2>'+cntH('Terminaram')+timerH()+'<div class="bks" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.6vw;margin-bottom:3vh">'+BUCKETS.map(b=>'<div style="background:'+b.c+';color:#17121f;border-radius:2.4vh;padding:3vh 1vw;font-family:Syne;font-weight:800;font-size:4vh;text-align:center">'+b.t+'</div>').join('')+'</div><div class="prog3" id="pg"></div>')},
 update(){const n=CANAIS.length;
  if(act.phase==='rev'){const it=$('#it');if(!it)return;const ps=plist();it.innerHTML=CANAIS.map((c,i)=>{const ok=ps.filter(p=>((ans[p.id]||{}).m||{})[i]===c.b).length;const b=BUCKETS.find(x=>x.k===c.b);return '<div class="it3"><span>'+esc(c.t)+'</span><span style="display:flex;gap:1vw;align-items:center"><span style="color:var(--mut)">'+ok+'/'+ps.length+'</span><span class="tag" style="background:'+b.c+'">'+b.t+'</span></span></div>'}).join('');return}
  const pg=$('#pg');if(!pg)return;let d=0;pg.innerHTML=plist().map(p=>{const m=Object.keys((ans[p.id]||{}).m||{}).length;if(m>=n)d++;return '<span class="pg'+(m>=n?' done':'')+'">'+dot(p.color)+esc(p.name)+' · '+m+'/'+n+'</span>'}).join('');$('#cn').textContent=d+' / '+plist().length}},

desafio:{render(){
  if(act.phase==='rev'&&!rolling){setBody(eb('Sorteio de desafio')+'<h2 style="margin:1.4vh 0 2vh">Cada equipa tem o seu desafio</h2><div class="briefs" id="br"></div>');return}
  setBody(eb('Sorteio de desafio')+'<h1 style="margin:1.4vh 0 3vh">'+(rolling?'A sortear…':'Marca · persona · conflito · canal')+'</h1><div class="cloud" id="cloud" style="font-size:7vh"></div>');
  if(rolling){const all=[].concat(CONTENT.marcas,CONTENT.personas,CONTENT.conflitos,CONTENT.canais);const cl=$('#cloud');clearInterval(local.fl);local.fl=setInterval(()=>{if(!rolling||!$('#cloud')){clearInterval(local.fl);return}cl.innerHTML=shuf(all).slice(0,5).map((w,i)=>'<span style="color:'+CONTENT.cores[i*2]+';font-size:6vh">'+esc(w)+'</span>').join('')},90)}},
 update(){const b=$('#br');if(!b)return;b.innerHTML=plist().filter(p=>p.brief).map(p=>'<div class="bcard pop"><div class="nm">'+dot(p.color)+esc(p.name)+'</div><div class="m">'+esc(p.brief.m)+'</div><div class="l"><small>Persona</small> '+esc(p.brief.p)+'</div><div class="l"><small>Conflito</small> '+esc(p.brief.c)+'</div><div class="l"><small>Canal</small> '+esc(p.brief.k)+'</div></div>').join('')}},

smart:{render(){const rv=act.phase==='rev';setBody(eb('Objetivo SMART')+'<h2 style="margin:1.4vh 0 2vh;max-width:70vw">'+(rv?'Resultados':'Escrevam um objetivo SMART para o vosso desafio')+'</h2>'+cntH('Enviados')+(rv?'':timerH())+'<div class="tiles" id="tl2"></div>')},
 update(){const t=$('#tl2');if(!t)return;const rv=act.phase==='rev';let a=submitted().map(k=>({p:players[k],id:k,t:ans[k].t||'',ch:smartCheck(ans[k].t)}));$('#cn').textContent=a.length+' / '+plist().length;
  if(rv)a.sort((x,y)=>y.ch.filter(c=>c[1]).length-x.ch.filter(c=>c[1]).length);
  t.innerHTML=a.map((x,i)=>'<div class="tile pop'+(rv&&i===0?' win':'')+'"><div class="nm">'+dot(x.p.color)+esc(x.p.name)+(rv?'<span style="margin-left:auto;color:var(--amber);font-family:Syne;font-size:3vh">+'+((x.p.pts||{})[act.key]||0)+'</span>':'')+'</div><div class="tx">'+esc(x.t)+'</div><div class="chips">'+chipsH(x.ch)+'</div></div>').join('')}},

gancho:{render(){const ph=act.phase;setBody(eb('Melhor gancho')+'<h2 style="margin:1.4vh 0 2vh;max-width:72vw">'+(ph==='in'?'Escrevam a frase que abre o vosso vídeo':ph==='vote'?'Votem no melhor gancho':'O vencedor')+'</h2>'+cntH(ph==='in'?'Enviados':'Votos')+(ph==='in'?timerH():'')+'<div class="tiles" id="tl2"></div>')},
 update(){const t=$('#tl2');if(!t)return;const ph=act.phase;let a=submitted().map(k=>({p:players[k],id:k,t:ans[k].t||''}));const c={};Object.values(vt).forEach(x=>{c[x]=(c[x]||0)+1});const nv=Object.keys(vt).length;
  $('#cn').textContent=ph==='in'?a.length+' / '+plist().length:nv+' / '+plist().length;
  if(ph==='rev')a.sort((x,y)=>(c[y.id]||0)-(c[x.id]||0));
  const mx=Math.max(1,...Object.values(c));
  t.innerHTML=a.map((x,i)=>'<div class="tile pop'+(ph==='rev'&&i===0?' win':'')+'"><div class="nm">'+dot(x.p.color)+esc(x.p.name)+(ph!=='in'?'<span style="margin-left:auto;color:var(--mint);font-family:Syne;font-size:3vh">'+(c[x.id]||0)+' voto'+((c[x.id]||0)===1?'':'s')+'</span>':'')+'</div><div class="tx">«'+esc(x.t)+'»</div>'+(ph==='in'?'<div class="chips">'+chipsH(hookCheck(x.t))+'</div>':'<div class="vb"><i style="width:'+Math.round((c[x.id]||0)/mx*100)+'%"></i></div>')+'</div>').join('')}},

spine:{render(){if(act.phase==='rev'){setBody(eb('Story Spine')+'<h2 style="margin:1.4vh 0 2vh">A ordem certa</h2><div style="display:flex;gap:3vw;min-height:0"><div class="story" id="st">'+SPINE.map((s,i)=>'<div class="ln rise" style="animation-delay:'+i*.12+'s"><b>'+(i+1)+'</b><span>'+esc(s)+'</span></div>').join('')+'</div><div style="flex:1;min-width:0"><div class="eyebrow" style="color:var(--mut);margin-bottom:1.4vh">Posições certas</div><div id="rk2"></div></div></div>');return}
  setBody(eb('Story Spine')+'<h2 style="margin:1.4vh 0 2vh;max-width:72vw">Ordenem a história a arrastar</h2>'+cntH('Enviaram')+timerH()+'<div class="prog3" id="pg"></div>')},
 update(){if(act.phase==='rev'){const rk=$('#rk2');if(!rk)return;const a=plist().map(p=>{const o=oo(ans[p.id]);return[p,SPINE.reduce((s,_,i)=>s+(o[i]===i?1:0),0)]}).sort((x,y)=>y[1]-x[1]).slice(0,8);rk.innerHTML=a.map(x=>'<div class="pg" style="margin-bottom:1vh;font-size:2.6vh;justify-content:space-between">'+'<span>'+dot(x[0].color)+' '+esc(x[0].name)+'</span><b style="font-family:Syne;color:var(--amber)">'+x[1]+' / '+SPINE.length+'</b></div>').join('');return}
  const pg=$('#pg');if(!pg)return;let d=0;pg.innerHTML=plist().map(p=>{const s=!!(ans[p.id]&&ans[p.id].o);if(s)d++;return '<span class="pg'+(s?' done':'')+'">'+dot(p.color)+esc(p.name)+(s?' · enviou':'')+'</span>'}).join('');$('#cn').textContent=d+' / '+plist().length}}
};

/* ---------- ciclo ---------- */
function setBody(h){body.innerHTML=h}
function render(){sigS=act.key+'|'+act.phase+'|'+rolling;local.rv=local.rv;(V[act.id]||V.lobby).render();chrome();update()}
function update(){const np=$('#npl');if(np)np.textContent=plist().length;(V[act.id]||V.lobby).update&&(V[act.id]||V.lobby).update();if(showRank)rankOv()}
function chrome(){
 const a=action();const bar=$('#act');bar.textContent=a.label;bar.onclick=a.fn;
 const s=$('#sec');if(a.sec){s.style.display='';s.textContent=a.sec.label;s.onclick=a.sec.fn}else s.style.display='none';
 document.querySelectorAll('.nv[data-id]').forEach(n=>n.classList.toggle('on',n.dataset.id===act.id))}
function tick(){const l=$('#tl');if(!l||!act.lim)return;const e=(now()-act.t0)/1000;l.style.width=Math.max(0,100-e/act.lim*100)+'%';
 if(act.id==='quiz'&&act.phase==='q'&&e>act.lim+.4)revealQuiz()}
function rankOv(){let o=$('#rk-ov');if(!showRank){if(o)o.remove();return}
 if(!o){o=document.createElement('div');o.id='rk-ov';o.className='rankov';$('.s-body').appendChild(o)}
 o.innerHTML=eb('Ranking')+'<h1 style="font-size:6vh">Quem está à frente</h1>'+ranking(10);grow()}
function toggleRank(){showRank=!showRank;$('#rk').classList.toggle('on',showRank);rankOv()}

/* ---------- UI fixa ---------- */
$('#nav').innerHTML=ACTS.map(a=>'<button class="nv" data-id="'+a.id+'" title="'+esc(a.d)+'">'+esc(a.t)+'</button>').join('');
$('#nav').onclick=e=>{const b=e.target.closest('.nv');if(b)go(b.dataset.id)};
$('#rk').onclick=toggleRank;
let nr=0;$('#newr').onclick=async function(){if(!nr){this.textContent='Confirmar nova sala?';nr=setTimeout(()=>{nr=0;this.textContent='Nova sala'},3000);return}clearTimeout(nr);nr=0;this.textContent='Nova sala';LS('aula-room',null);await createRoom();location.href='ecra.html?c='+C};
addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea'))return;if(e.key==='r'||e.key==='R')toggleRank();else if(e.key===' '||e.key==='Enter'||e.key==='ArrowRight'){e.preventDefault();$('#act').click()}});
init();
})();
