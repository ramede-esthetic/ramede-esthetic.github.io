'use strict';
const header=document.querySelector('.site-header'),menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();document.querySelector('#quick-links').hidden=true;document.querySelector('.quick button').setAttribute('aria-expanded','false');}});
function updateHeader(){header.classList.toggle('scrolled',scrollY>60);}updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
const quick=document.querySelector('.quick button'),quickLinks=document.querySelector('#quick-links');quick.addEventListener('click',()=>{const open=quick.getAttribute('aria-expanded')!=='true';quick.setAttribute('aria-expanded',String(open));quick.setAttribute('aria-label',open?'빠른 메뉴 닫기':'빠른 메뉴 열기');quickLinks.hidden=!open;});
const motion=matchMedia('(prefers-reduced-motion: reduce)');
// Give each section a distinct entrance while reusing the repeatable observer.
document.querySelectorAll('.reveal').forEach((el,i)=>{el.dataset.motion=['left','right','zoom','unveil'][i%4];});
document.querySelectorAll('.story-line').forEach((el,i)=>{el.dataset.motion=i?'unveil':'zoom';});
document.querySelectorAll('.story-line,.feature-copy,.program-heading,.director-copy,.films-heading,.visit-content').forEach(el=>{[...el.children].forEach((child,i)=>{child.classList.add('text-motion');child.style.setProperty('--text-delay',Math.min(i*75,225)+'ms');});});

if('IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{const visible=entry.isIntersecting&&entry.intersectionRatio>=.08;entry.target.classList.toggle('visible',visible);if(visible)entry.target.dataset.revealRun=String(Number(entry.target.dataset.revealRun||0)+1);}),{threshold:[0,.08],rootMargin:'-6% 0px -6% 0px'});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));const eventObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('nudge',entry.isIntersecting)),{threshold:.8});eventObserver.observe(document.querySelector('.hero-event'));}
const heroVideo=document.querySelector('.hero-film');
const mobileHero=matchMedia('(max-width:760px)');
function selectHero(){const name=mobileHero.matches?'hero-unified-mobile-r23':'hero-unified-desktop-r23';heroVideo.poster=name+'.webp';heroVideo.src=name+'.mp4';heroVideo.load();heroVideo.play().catch(()=>{});}
selectHero();mobileHero.addEventListener('change',selectHero);
const videos=[...document.querySelectorAll('video')];
const videoObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting||document.hidden)entry.target.pause();else entry.target.play().catch(()=>{});}),{threshold:.1}):null;
function playVisibleVideos(){videos.forEach(v=>{const r=v.getBoundingClientRect();if(!document.hidden&&r.bottom>0&&r.top<innerHeight)v.play().catch(()=>{});});}
function syncMotion(){videos.forEach(v=>{v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('autoplay','');});playVisibleVideos();}
videos.forEach(v=>{videoObserver?.observe(v);v.addEventListener('canplay',playVisibleVideos);});syncMotion();motion.addEventListener('change',syncMotion);
document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());else playVisibleVideos();});
['pointerdown','touchstart','keydown'].forEach(event=>document.addEventListener(event,playVisibleVideos,{once:true,passive:true}));
document.querySelectorAll('[data-open-program]').forEach(a=>a.addEventListener('click',()=>{const panel=document.getElementById(a.dataset.openProgram);if(panel&&panel.tagName==='DETAILS')panel.open=true;}));
if('IntersectionObserver' in window){const headerObserver=new IntersectionObserver(entries=>{header.classList.toggle('scrolled',!entries[0].isIntersecting);},{threshold:0});headerObserver.observe(document.querySelector('.hero'));}
const facts=document.querySelector('.facts');
const factCounters=[...facts.querySelectorAll('[data-count-to]')];
let factFrame=0,factActive=false;
function formatFact(el,value){return el.dataset.countFormat?new Intl.NumberFormat(el.dataset.countFormat).format(value):String(value);}
function finishFacts(){facts.dataset.counting='complete';cancelAnimationFrame(factFrame);factCounters.forEach(el=>el.textContent=formatFact(el,Number(el.dataset.countTo)));}
function enterFacts(){
 facts.classList.add('facts-visible');
 facts.dataset.countRun=String(Number(facts.dataset.countRun||0)+1);facts.dataset.counting='running';
 cancelAnimationFrame(factFrame);factCounters.forEach(el=>el.textContent='0');
 const start=performance.now()+80,duration=650;
 function tick(now){const progress=Math.min(1,Math.max(0,(now-start)/duration));const eased=1-Math.pow(1-progress,2);factCounters.forEach(el=>el.textContent=formatFact(el,Math.min(Number(el.dataset.countTo),Math.floor(eased*Number(el.dataset.countTo)))));if(progress<1&&factActive)factFrame=requestAnimationFrame(tick);else finishFacts();}
 factFrame=requestAnimationFrame(tick);
}
if('IntersectionObserver' in window){
 facts.classList.add('fact-motion');
 const factsObserver=new IntersectionObserver(entries=>{for(const entry of entries){factActive=entry.isIntersecting&&entry.intersectionRatio>=.35;if(factActive)enterFacts();else{facts.classList.remove('facts-visible');finishFacts();}}},{threshold:.35});factsObserver.observe(facts);
}else facts.classList.add('facts-visible');
motion.addEventListener('change',()=>{if(factActive)enterFacts();});
