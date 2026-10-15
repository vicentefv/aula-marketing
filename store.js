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
 marcas:['Café de bairro','Ginásio low-cost','Livraria independente','App de transportes','Loja online de plantas','Marca de ténis sustentáveis','Clínica veterinária','Escola de línguas','Azeite artesanal','Padaria de bairro'],
 personas:['Estudante universitária','Reformado ativo','Pai solteiro','Freelancer','Turista perdido','Criadora iniciante','Enfermeira de turnos','Gestor sem tempo'],
 conflitos:['Falta de tempo','Medo de falhar','Desconfiança','Dinheiro apertado','Solidão','Excesso de opções','Vergonha de pedir ajuda','Rotina aborrecida'],
 canais:['Reel / TikTok','Carrossel','Newsletter','Post no LinkedIn','Podcast curto','Anúncio em vídeo','Stories com sondagem','Parceria com criador'],
 kpis:['Alcance (pessoas novas)','Retenção do vídeo','Guardados','Partilhas','Cliques para o site','Inscrições','Encomendas / vendas','Avaliações'],
 spine:['Era uma vez…','Todos os dias…','Até que um dia…','Por causa disso…','Por causa disso…','Por causa disso…','Até que finalmente…','E desde então…'],
 cores:['#FF6B4A','#A596FF','#FFB02E','#5ED3A1','#FF8FC7','#6EC1FF','#F6F1E9','#C9A0FF','#FF9E7A','#9BE15D','#FFD166','#7B63F0']
};
/* verificação automática SMART (sem IA) */
window.smartCheck=t=>{t=(t||'').toLowerCase();return [
 ['Específico',/\b(aumentar|reduzir|conseguir|vender|chegar|gerar|ganhar|atingir|duplicar|crescer|captar|converter|obter|levar)\b/.test(t)&&t.split(/\s+/).length>=6],
 ['Mensurável',/\d/.test(t)],
 ['Atingível',t.length>0&&!/\b(milh(ão|ões)|1000%|todos os|toda a gente)\b/.test(t)],
 ['Relevante',/\b(clientes?|vendas?|encomendas?|inscri|visitas?|reservas?|seguidores|leads?|newsletter|loja|site|marca)\b/.test(t)],
 ['Temporal',/\b(até|em \d+ (dias|semanas|meses)|por (semana|mês)|mensal|semanal|janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|trimestre|ano|natal|verão)\b/.test(t)]]};
/* verificação do gancho */
window.hookCheck=t=>{t=(t||'').trim();const w=t.split(/\s+/).filter(Boolean).length;return [
 ['Curto (até 15 palavras)',w>0&&w<=15],
 ['Cria curiosidade',/\?|…|\.\.\.|porque|segredo|ninguém|nunca|erro|e se/i.test(t)],
 ['Concreto',/\d|«|"|eu |me |nós /i.test(t)]]};
