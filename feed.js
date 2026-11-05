(function(){
var feed=document.getElementById("feed"),fim=feed.querySelector(".fim"),agora=Date.now();
var TZ={timeZone:"America/Sao_Paulo"};
function dia(t){return new Date(t).toLocaleDateString("pt-BR",TZ)}
function ev(n,p){if(window.gtag)gtag("event",n,p||{})}
function ultima(s){var d=s.getAttribute("data-postagens").split("|").map(function(x){return Date.parse(x)}).filter(function(t){return t<=agora});return d.length?Math.max.apply(null,d):0}
var slides=[].slice.call(feed.querySelectorAll(".slide[data-n]"));
slides.forEach(function(s){s._t=ultima(s);if(!s._t)s.remove()});
slides=slides.filter(function(s){return s._t}).sort(function(a,b){return b._t-a._t});
var pedido=new URLSearchParams(location.search).get("v");
if(pedido)slides.sort(function(a,b){return (b.getAttribute("data-n")===pedido)-(a.getAttribute("data-n")===pedido)});
slides.forEach(function(s,i){feed.insertBefore(s,fim);s._i=i;
  var v=s.querySelector("video");if(i>0)v.removeAttribute("autoplay");
  var selo=s.querySelector(".selo"),hoje=dia(agora),ontem=dia(agora-864e5),d=dia(s._t);
  if(d===hoje||d===ontem){selo.textContent=d===hoje?"Saiu hoje no TikTok":"Saiu ontem no TikTok";selo.hidden=false}
});
var comSom=false,ativo=null,tocou={},tres={};
function ligar(s){var v=s.querySelector("video");if(!v||v.getAttribute("src"))return;v.poster=v.getAttribute("data-capa");v.src=v.getAttribute("data-src");v.preload="auto"}
function desligar(s){var v=s.querySelector("video");if(!v||!v.getAttribute("src"))return;v.pause();v.removeAttribute("src");v.load()}
function tocar(v){v.muted=!comSom;var p=v.play();if(p)p.catch(function(){})}
function avisoSom(){document.querySelectorAll(".som").forEach(function(x){x.hidden=comSom})}
slides.forEach(function(s){var v=s.querySelector("video"),n=s.getAttribute("data-n");
  v.addEventListener("playing",function(){if(!tocou[n]){tocou[n]=1;ev("video_play",{achado:n,posicao:s._i+1})}});
  v.addEventListener("timeupdate",function(){if(!tres[n]&&v.currentTime>=3){tres[n]=1;ev("video_3s",{achado:n,posicao:s._i+1})}});
  v.addEventListener("canplay",function(){if(ativo===s&&v.paused)tocar(v)});
});
var perto=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)ligar(e.target);else desligar(e.target)})},{root:feed,rootMargin:"150% 0px"});
var visivel=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target.querySelector("video");if(!v)return;
  if(e.isIntersecting){ativo=e.target;ligar(e.target);tocar(v)}else v.pause()})},{root:feed,threshold:.6});
slides.forEach(function(s){perto.observe(s);visivel.observe(s)});
visivel.observe(fim);
document.addEventListener("visibilitychange",function(){if(!ativo)return;var v=ativo.querySelector("video");if(!v)return;if(document.hidden)v.pause();else tocar(v)});
var interagiu=false;
function primeira(){if(interagiu)return;interagiu=true;ev("interacao")}
["touchstart","pointerdown","wheel","keydown"].forEach(function(t){document.addEventListener(t,primeira,{passive:true,once:true})});
var cookies=document.getElementById("cookies");
feed.addEventListener("scroll",function(){if(cookies&&feed.scrollTop>50)cookies.hidden=true},{passive:true});
function proximo(s){return s.nextElementSibling}
var CHAVE="achadaria-proximo";
function lembrar(s){try{var n=proximo(s);if(n&&n.getAttribute("data-n"))sessionStorage.setItem(CHAVE,n.getAttribute("data-n"))}catch(x){}}
try{var volta=sessionStorage.getItem(CHAVE);sessionStorage.removeItem(CHAVE);if(volta&&!pedido){var alvo=feed.querySelector('.slide[data-n="'+volta+'"]');if(alvo)alvo.scrollIntoView()}}catch(x){}
feed.addEventListener("click",function(e){
  var tela=e.target.closest(".tela");
  if(tela){comSom=!comSom;avisoSom();tocar(tela.querySelector("video"));return}
  var loja=e.target.closest(".loja");
  if(loja){var s=loja.closest(".slide");lembrar(s);setTimeout(function(){var n=proximo(s);if(n)n.scrollIntoView()},500);return}
  var m=e.target.closest("[data-mandar]");
  if(m)ev("compartilhar",{achado:m.getAttribute("data-mandar")});
});
var buscar=document.querySelector(".buscar"),forma=document.querySelector(".busca-topo");
buscar.addEventListener("click",function(){forma.hidden=!forma.hidden;if(!forma.hidden)forma.n.focus()});
})();
