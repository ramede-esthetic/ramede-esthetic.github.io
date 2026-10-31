'use strict';
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('pageshow', () => { if (!location.hash || performance.getEntriesByType('navigation')[0]?.type === 'reload') window.scrollTo({top:0,behavior:'instant'}); });
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu.focus();}});
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!motion.matches && 'IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('visible',entry.isIntersecting)),{threshold:0.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));const welcome=document.querySelector('.welcome');const eventObserver=new IntersectionObserver(entries=>entries.forEach(entry=>welcome.classList.toggle('bounce',entry.isIntersecting)),{threshold:.8});eventObserver.observe(welcome);}
motion.addEventListener('change', e=>{if(e.matches)document.documentElement.classList.remove('js-motion');});

const careVideo=document.querySelector('.care-video');
function updateVideoMotion(){if(!careVideo)return;careVideo.muted=true;if(motion.matches){careVideo.pause();careVideo.removeAttribute('autoplay');}else{careVideo.setAttribute('autoplay','');careVideo.play().catch(()=>{});}}
updateVideoMotion();motion.addEventListener('change',updateVideoMotion);
