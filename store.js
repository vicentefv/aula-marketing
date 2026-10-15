/* Ligação em tempo real: Firebase quando há configuração; senão, modo local (mesmo computador, vários separadores). */
window.STORE=(()=>{
 const cfg=window.FB_CONFIG;
 if(cfg&&cfg.databaseURL&&window.firebase&&!/[?&]local\b/.test(location.search)){
  firebase.initializeApp(cfg);const db=firebase.database();let off=0;
  db.ref('.info/serverTimeOffset').on('value',s=>{off=s.val()||0});
  const st={ok:false,cbs:[]};db.ref('.info/connected').on('value',s=>{st.ok=!!s.val();st.cbs.forEach(f=>f(st.ok))});
  return {mode:'online',TS:firebase.database.ServerValue.TIMESTAMP,now:()=>Date.now()+off,
   set:(p,v)=>db.ref(p).set(v),update:(p,v)=>db.ref(p).update(v),remove:p=>db.ref(p).remove(),
   get:p=>db.ref(p).get().then(s=>s.val()),
   on:(p,cb)=>{const r=db.ref(p),h=s=>cb(s.val());r.on('value',h);return()=>r.off('value',h)},
   inc:(p,n)=>db.ref(p).set(firebase.database.ServerValue.increment(n)),
   onConn:f=>{st.cbs.push(f);f(st.ok)}};
 }
 const KEY='aula-local-db';let data={};
 const load=()=>{try{data=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){data={}}};load();
 const subs=[];let bc=null;try{bc=new BroadcastChannel('aula-local')}catch(e){}
 const segs=p=>p.split('/').filter(Boolean);
 const getp=p=>segs(p).reduce((o,k)=>o==null?undefined:o[k],data);
 const setp=(p,v)=>{const ks=segs(p);let o=data;for(let i=0;i<ks.length-1;i++){if(typeof o[ks[i]]!=='object'||o[ks[i]]===null)o[ks[i]]={};o=o[ks[i]]}const k=ks[ks.length-1];if(v===null||v===undefined)delete o[k];else o[k]=JSON.parse(JSON.stringify(v))};
 const fire=()=>subs.forEach(s=>{const v=getp(s.p);const j=JSON.stringify(v===undefined?null:v);if(j!==s.last){s.last=j;s.cb(v===undefined?null:JSON.parse(j))}});
 const commit=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}if(bc)bc.postMessage(1);fire()};
 if(bc)bc.onmessage=()=>{load();fire()};
 addEventListener('storage',e=>{if(e.key===KEY){load();fire()}});
 const TS={'.sv':'timestamp'};
 const fix=v=>{if(v&&typeof v==='object'){if(v['.sv']==='timestamp')return Date.now();const o=Array.isArray(v)?[]:{};for(const k in v)o[k]=fix(v[k]);return o}return v};
 return {mode:'local',TS,now:()=>Date.now(),
  set:(p,v)=>{setp(p,fix(v));commit();return Promise.resolve()},
  update:(p,o)=>{for(const k in o)setp(p+'/'+k,fix(o[k]));commit();return Promise.resolve()},
  remove:p=>{setp(p,null);commit();return Promise.resolve()},
  get:p=>{load();const v=getp(p);return Promise.resolve(v===undefined?null:JSON.parse(JSON.stringify(v)))},
  on:(p,cb)=>{const s={p,cb,last:undefined};subs.push(s);setTimeout(()=>{const v=getp(p);s.last=JSON.stringify(v===undefined?null:v);cb(v===undefined?null:JSON.parse(s.last))});return()=>{const i=subs.indexOf(s);if(i>=0)subs.splice(i,1)}},
  inc:(p,n)=>{load();setp(p,(getp(p)||0)+n);commit();return Promise.resolve()},
  onConn:f=>f(true)};
})();
window.uid=()=>Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-3);
window.esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* conteúdos partilhados entre ecrã e telemóvel */
window.CONTENT={
 marcas:['Loja de roupa em segunda mão','Festival de música','App de entregas de comida','Ginásio low-cost','Marca de ténis sustentáveis','Café perto da faculdade','Estúdio de pilates','App de transportes','Livraria independente','Loja online de plantas'],
 personas:['Caloiro na cidade nova','Estudante Erasmus','Estudante-trabalhador','Criadora de conteúdo iniciante','Recém-licenciada à procura de emprego','Gamer de fim de semana','Estagiário no primeiro emprego','Reformado ativo'],
 conflitos:['Falta de tempo','Medo de ficar de fora (FOMO)','Desconfiança','Dinheiro apertado','Solidão na cidade nova','Excesso de opções','Vergonha de pedir ajuda','Rotina aborrecida'],
 canais:['TikTok','Reel no Instagram','Carrossel','Newsletter','Post no LinkedIn','Podcast curto','Stories com sondagem','Parceria com creator'],
 kpis:['Alcance (pessoas novas)','Retenção do vídeo','Guardados','Partilhas','Cliques para o site','Inscrições','Compras / vendas','Avaliações'],
 spine:['Era uma vez…','Todos os dias…','Até que um dia…','Por causa disso…','Por causa disso…','Por causa disso…','Até que finalmente…','E desde então…'],
 cores:['#FF6B4A','#A596FF','#FFB02E','#5ED3A1','#FF8FC7','#6EC1FF','#F6F1E9','#C9A0FF','#FF9E7A','#9BE15D','#FFD166','#7B63F0']
};
/* verificação automática SMART (sem IA) */
window.smartCheck=t=>{t=(t||'').toLowerCase();return [
 ['Específico',/\b(aumentar|reduzir|conseguir|vender|chegar|gerar|ganhar|atingir|duplicar|crescer|captar|converter|obter|levar)\b/.test(t)&&t.split(/\s+/).length>=6],
 ['Mensurável',/\d/.test(t)],
 ['Atingível',t.length>0&&!/\b(milh(ão|ões)|1000%|todos os|toda a gente)\b/.test(t)],
 ['Relevante',/\b(clientes?|vendas?|encomendas?|inscri|visitas?|reservas?|seguidores|leads?|newsletter|loja|site|marca|estudantes?|views?|tiktok|instagram|drop|comunidade)\b/.test(t)],
 ['Temporal',/\b(até|em \d+ (dias|semanas|meses)|por (semana|mês)|mensal|semanal|janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|trimestre|ano|natal|verão)\b/.test(t)]]};
/* verificação do gancho */
window.hookCheck=t=>{t=(t||'').trim();const w=t.split(/\s+/).filter(Boolean).length;return [
 ['Curto (até 15 palavras)',w>0&&w<=15],
 ['Cria curiosidade',/\?|…|\.\.\.|porque|segredo|ninguém|nunca|erro|e se/i.test(t)],
 ['Concreto',/\d|«|"|eu |me |nós /i.test(t)]]};
/* filtro de linguagem ofensiva (PT + EN): ignora acentos, maiúsculas, números por letras e letras repetidas */
(()=>{
 const col=s=>s.replace(/(.)\1+/g,'$1');
 const norm=t=>String(t==null?'':t).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/0/g,'o').replace(/1/g,'i').replace(/3/g,'e').replace(/4/g,'a').replace(/5/g,'s').replace(/7/g,'t').replace(/@/g,'a').replace(/\$/g,'s');
 const PRE=['caralh','merd','foder','fodid','fodam','fuck','bitch','cunt','nigg','slut','bastard','retard','nazi','piroca','bucet','paneleir','imbecil','estupid','idiot','crlh','badalhoc','prostitut','vadi','arrombad','escroto','otari'].map(col);
 const EXA=['puta','putas','putaria','putinha','putao','putedo','foda','fodas','fodase','fode','porra','porras','cona','conas','cu','cus','viado','viados','cabrao','cabroes','shit','shits','shitty','shite','bullshit','whore','asshole','pila','penis','vagina','tetas','mongol','mongoloide','pqp','fdp','vsf','crl','tnc','hitler','heil','vaca','cabra','gordo','gorda','feio','feia','lixo'].filter(w=>!['vaca','cabra','gordo','gorda','feio','feia','lixo'].includes(w)).map(col);
 const JOIN=['caralho','foder','fodase','filhodaputa','paneleiro','fuck','vaitefoder'].map(col);
 window.isBad=t=>{const n=norm(t);let toks=n.replace(/[^a-z]+/g,' ').trim().split(' ').filter(Boolean);const m=[];toks.forEach(w=>{if(w.length===1&&m.length&&m[m.length-1].s)m[m.length-1].w+=w;else m.push({w,s:w.length===1})});toks=m.map(x=>col(x.w));
  if(toks.some(w=>EXA.includes(w)||PRE.some(p=>w.startsWith(p))))return true;
  const j=col(n.replace(/[^a-z]/g,''));return JOIN.some(p=>j.includes(p))};
})();
