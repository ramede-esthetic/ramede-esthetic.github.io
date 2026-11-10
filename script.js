'use strict';
const header=document.querySelector('.site-header'),menuButton=document.querySelector('.menu-toggle'),fullMenu=document.querySelector('#full-menu'),closeButton=document.querySelector('.menu-close');
let savedFocus;
function setMenu(open){
 if(open)savedFocus=document.activeElement;
 fullMenu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);
 [...document.body.children].filter(el=>el!==fullMenu).forEach(el=>{el.inert=open;});
 if(open)closeButton.focus();else savedFocus?.focus();
}
menuButton.addEventListener('click',()=>setMenu(true));closeButton.addEventListener('click',()=>setMenu(false));
fullMenu.querySelectorAll('.menu-row button').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));document.getElementById(button.getAttribute('aria-controls')).hidden=!open;}));
fullMenu.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);return;}if(e.key==='Tab'){const focusable=[...fullMenu.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
const current=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.desktop-nav a').forEach(a=>{if(a.getAttribute('href')===current)a.setAttribute('aria-current','page');});
function updateHeader(){header.classList.toggle('scrolled',scrollY>60||document.body.classList.contains('subpage'));}updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
const motion=matchMedia('(prefers-reduced-motion: reduce)');
// Replay on each viewport entry, with content visible by default.
const revealElements=[...document.querySelectorAll('.reveal,.hero-brand-line,.hero-brand-korean')];
revealElements.forEach((el,i)=>{el.dataset.motion=['left','right','zoom','unveil'][i%4];});
function revealAgain(el){
 el.classList.add('visible');el.dataset.revealRun=String(Number(el.dataset.revealRun||0)+1);
 if(!el.animate)return;el._revealAnimation?.cancel();
 const poses={left:'translateX(-18px)',right:'translateX(18px)',zoom:'scale(.975)',unveil:'translateY(10px)'};
 el._revealAnimation=el.animate([{opacity:.18,transform:poses[el.dataset.motion]},{opacity:1,transform:'none'}],{duration:850,easing:'cubic-bezier(.22,.65,.3,1)',fill:'none'});
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)revealAgain(e.target);else e.target._revealAnimation?.cancel();}),{threshold:0,rootMargin:'-5% 0px -5% 0px'});revealElements.forEach(el=>observer.observe(el));}else revealElements.forEach(el=>el.classList.add('visible'));
const heroVideo=document.querySelector('.hero-film');
if(heroVideo){const mobileHero=matchMedia('(max-width:760px)');function selectHero(){const name=mobileHero.matches?'hero-unified-mobile-r23':'hero-unified-desktop-r23';heroVideo.poster=name+'.webp';heroVideo.src=name+'.mp4';heroVideo.load();heroVideo.play().catch(()=>{});}heroVideo.addEventListener('playing',()=>heroVideo.classList.add('is-playing'));heroVideo.addEventListener('error',()=>heroVideo.classList.remove('is-playing'));selectHero();mobileHero.addEventListener('change',selectHero);}
const videos=[...document.querySelectorAll('video')];
function playVisibleVideos(){videos.forEach(v=>{const r=v.getBoundingClientRect();if(!document.hidden&&r.bottom>0&&r.top<innerHeight)v.play().catch(()=>{});});}
const videoObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting||document.hidden)e.target.pause();else e.target.play().catch(()=>{});}),{threshold:.05}):null;
videos.forEach(v=>{v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('autoplay','');videoObserver?.observe(v);v.addEventListener('canplay',playVisibleVideos);});
playVisibleVideos();document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());else playVisibleVideos();});['pointerdown','touchstart','keydown'].forEach(e=>document.addEventListener(e,playVisibleVideos,{once:true,passive:true}));window.addEventListener('pageshow',playVisibleVideos);
document.querySelectorAll('.program-care-film video').forEach(v=>{v.addEventListener('playing',()=>v.classList.add('is-playing'));v.addEventListener('error',()=>v.classList.remove('is-playing'));});
const facts=document.querySelector('.facts');
if(facts){const counters=[...facts.querySelectorAll('[data-count-to]')];let frame=0,active=false;function format(el,n){return el.dataset.countFormat?new Intl.NumberFormat(el.dataset.countFormat).format(n):String(n);}function finish(){cancelAnimationFrame(frame);counters.forEach(el=>el.textContent=format(el,Number(el.dataset.countTo)));}function enter(){facts.classList.add('facts-visible');facts.dataset.countRun=String(Number(facts.dataset.countRun||0)+1);cancelAnimationFrame(frame);const start=performance.now();function tick(now){const t=Math.min(1,(now-start)/1300);counters.forEach(el=>el.textContent=format(el,Math.floor((1-(1-t)**2)*Number(el.dataset.countTo))));if(t<1&&active)frame=requestAnimationFrame(tick);else finish();}frame=requestAnimationFrame(tick);}if('IntersectionObserver' in window){facts.classList.add('fact-motion');new IntersectionObserver(entries=>entries.forEach(e=>{active=e.isIntersecting;if(active)enter();else{facts.classList.remove('facts-visible');finish();}}),{threshold:.2}).observe(facts);}else finish();}
