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
  var selo=s.querySelector(".selo"),hoje=dia(agora),ontem=dia(agora-864e5),d=dia(s._t);
  if(d===hoje||d===ontem){selo.textContent=d===hoje?"Saiu hoje no TikTok":"Saiu ontem no TikTok";selo.hidden=false}
});
var player=document.getElementById("player"),comSom=false,bloqueado=false,ativo=null,tocou={},tres={};
function temVideo(s){return s&&s.getAttribute("data-n")}
function avisoSom(){document.querySelectorAll(".som").forEach(function(x){x.hidden=comSom&&!bloqueado;x.textContent=bloqueado?"Toque pra assistir":"Toque pra ouvir";x.classList.toggle("parado",bloqueado)})}
function tocar(){if(document.hidden||!temVideo(ativo))return;bloqueado=false;player.muted=!comSom;avisoSom();
  var p=player.play();if(!p)return;p.catch(function(e){if(e.name!=="NotAllowedError")return;
    if(comSom){comSom=false;tocar();return}
    bloqueado=true;avisoSom();ev("video_bloqueado",{achado:ativo.getAttribute("data-n")})})}
function adiantar(s){var n=s.nextElementSibling,c=navigator.connection;if(!temVideo(n)||(c&&c.saveData))return;fetch(n.getAttribute("data-video")).catch(function(){})}
function ativar(s){if(s===ativo)return;if(ativo)ativo.querySelector(".tela")&&ativo.querySelector(".tela").classList.remove("tocando");ativo=s;
  if(!temVideo(s)){player.pause();return}
  var tela=s.querySelector(".tela"),video=s.getAttribute("data-video");
  tela.insertBefore(player,tela.firstChild);player.setAttribute("aria-label",tela.querySelector(".capa").alt);
  if(player.getAttribute("src")!==video)player.setAttribute("src",video);
  tocar();adiantar(s)}
function atual(){return feed.children[Math.round(feed.scrollTop/feed.clientHeight)]}
player.addEventListener("playing",function(){if(!temVideo(ativo))return;var n=ativo.getAttribute("data-n");ativo.querySelector(".tela").classList.add("tocando");
  if(!tocou[n]){tocou[n]=1;ev("video_play",{achado:n,posicao:ativo._i+1})}});
player.addEventListener("timeupdate",function(){if(!temVideo(ativo))return;var n=ativo.getAttribute("data-n");if(!tres[n]&&player.currentTime>=3){tres[n]=1;ev("video_3s",{achado:n,posicao:ativo._i+1})}});
player.addEventListener("canplay",function(){if(player.paused&&!bloqueado)tocar()});
var parou;
feed.addEventListener("scroll",function(){clearTimeout(parou);parou=setTimeout(function(){ativar(atual())},60)},{passive:true});
document.addEventListener("visibilitychange",function(){if(document.hidden)player.pause();else tocar()});
var interagiu=false;
function primeira(){if(interagiu)return;interagiu=true;ev("interacao")}
["touchstart","pointerdown","wheel","keydown"].forEach(function(t){document.addEventListener(t,primeira,{passive:true,once:true})});
var cookies=document.getElementById("cookies");
feed.addEventListener("scroll",function(){if(cookies&&feed.scrollTop>50)cookies.hidden=true},{passive:true});
function proximo(s){return s.nextElementSibling}
var CHAVE="achadaria-proximo";
function lembrar(s){try{var n=proximo(s);if(n&&n.getAttribute("data-n"))sessionStorage.setItem(CHAVE,n.getAttribute("data-n"))}catch(x){}}
try{var volta=sessionStorage.getItem(CHAVE);sessionStorage.removeItem(CHAVE);if(volta&&!pedido){var alvo=feed.querySelector('.slide[data-n="'+volta+'"]');if(alvo)alvo.scrollIntoView()}}catch(x){}
ativar(atual());
feed.addEventListener("click",function(e){
  if(e.target.closest(".tela")){comSom=bloqueado||player.paused?true:!comSom;tocar();return}
  var loja=e.target.closest(".loja");
  if(loja){var s=loja.closest(".slide");lembrar(s);setTimeout(function(){var n=proximo(s);if(n)n.scrollIntoView()},500);return}
  var m=e.target.closest("[data-mandar]");
  if(m)ev("compartilhar",{achado:m.getAttribute("data-mandar")});
});
var buscar=document.querySelector(".buscar"),forma=document.querySelector(".busca-topo");
buscar.addEventListener("click",function(){forma.hidden=!forma.hidden;if(!forma.hidden)forma.n.focus()});
})();
