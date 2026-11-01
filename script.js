'use strict';
if('scrollRestoration' in history)history.scrollRestoration='manual';
window.addEventListener('pageshow',()=>{if(!location.hash||performance.getEntriesByType('navigation')[0]?.type==='reload')window.scrollTo({top:0,behavior:'instant'});});
const header=document.querySelector('.site-header'),menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();document.querySelector('#quick-links').hidden=true;document.querySelector('.quick button').setAttribute('aria-expanded','false');}});
function updateHeader(){header.classList.toggle('scrolled',scrollY>60);}updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
const quick=document.querySelector('.quick button'),quickLinks=document.querySelector('#quick-links');quick.addEventListener('click',()=>{const open=quick.getAttribute('aria-expanded')!=='true';quick.setAttribute('aria-expanded',String(open));quick.setAttribute('aria-label',open?'빠른 메뉴 닫기':'빠른 메뉴 열기');quickLinks.hidden=!open;});
const motion=matchMedia('(prefers-reduced-motion: reduce)');
if(!motion.matches&&'IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('visible',entry.isIntersecting)),{threshold:.09});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));const eventObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('nudge',entry.isIntersecting)),{threshold:.8});eventObserver.observe(document.querySelector('.hero-event'));}
const videos=[...document.querySelectorAll('video')];
const videoObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(motion.matches||!entry.isIntersecting)entry.target.pause();else entry.target.play().catch(()=>{});}),{threshold:.1}):null;
function syncMotion(){if(motion.matches)document.documentElement.classList.remove('js-motion');videos.forEach(v=>{v.muted=true;if(motion.matches){v.pause();v.removeAttribute('autoplay');}else{v.setAttribute('autoplay','');if(v.getBoundingClientRect().bottom>0&&v.getBoundingClientRect().top<innerHeight)v.play().catch(()=>{});}});}
videos.forEach(v=>videoObserver?.observe(v));syncMotion();motion.addEventListener('change',syncMotion);
document.querySelectorAll('[data-open-program]').forEach(a=>a.addEventListener('click',()=>{const panel=document.getElementById(a.dataset.openProgram);if(panel&&panel.tagName==='DETAILS')panel.open=true;}));
if('IntersectionObserver' in window){const headerObserver=new IntersectionObserver(entries=>{header.classList.toggle('scrolled',!entries[0].isIntersecting);},{threshold:0});headerObserver.observe(document.querySelector('.hero'));}
const facts=document.querySelector('.facts');
const factCounters=[...facts.querySelectorAll('[data-count-to]')];
let factFrame=0,factActive=false;
function finishFacts(){cancelAnimationFrame(factFrame);factCounters.forEach(el=>el.textContent=el.dataset.countTo);}
function enterFacts(){
 facts.classList.add('facts-visible');
 if(motion.matches){finishFacts();return;}
 cancelAnimationFrame(factFrame);factCounters.forEach(el=>el.textContent='0');
 const start=performance.now()+80,duration=650;
 function tick(now){const progress=Math.min(1,Math.max(0,(now-start)/duration));const eased=1-Math.pow(1-progress,2);factCounters.forEach(el=>el.textContent=String(Math.min(Number(el.dataset.countTo),Math.floor(eased*Number(el.dataset.countTo)))));if(progress<1&&factActive&&!motion.matches)factFrame=requestAnimationFrame(tick);else finishFacts();}
 factFrame=requestAnimationFrame(tick);
}
if('IntersectionObserver' in window){
 if(!motion.matches)facts.classList.add('fact-motion');
 const factsObserver=new IntersectionObserver(entries=>{for(const entry of entries){factActive=entry.isIntersecting;if(factActive)enterFacts();else{facts.classList.remove('facts-visible');finishFacts();}}},{threshold:.35});factsObserver.observe(facts);
}else facts.classList.add('facts-visible');
motion.addEventListener('change',()=>{finishFacts();facts.classList.toggle('fact-motion',!motion.matches);if(motion.matches)facts.classList.add('facts-visible');else if(factActive)enterFacts();else facts.classList.remove('facts-visible');});
