'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  function initMotion(){
    if(!window.gsap)return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.context(()=>{
      gsap.from('.hero-line',{y:65,opacity:0,duration:1.15,stagger:.13,ease:'power3.out',clearProps:'all'});
      gsap.from('.hero-enter',{y:20,opacity:0,duration:.9,delay:.35,stagger:.12,ease:'power3.out',clearProps:'all'});
      gsap.from('.world-stage',{y:60,opacity:0,scale:.94,duration:1.5,delay:.1,ease:'power3.out',clearProps:'opacity,transform'});
      $$('.reveal').forEach(el=>gsap.from(el,{y:35,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'transform,opacity'}));
      if(innerWidth>760){
        gsap.to('.world-image',{y:65,rotation:3,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
        gsap.to('.document-stack',{rotation:8,y:-22,ease:'none',scrollTrigger:{trigger:'.quotes-art',start:'top bottom',end:'bottom top',scrub:1}});
        gsap.to('.salon-browser',{rotation:1,y:-15,ease:'none',scrollTrigger:{trigger:'.salon-art',start:'top bottom',end:'bottom top',scrub:1}});
        gsap.to('.about-monogram',{rotation:8,ease:'none',scrollTrigger:{trigger:'.about',start:'top bottom',end:'bottom top',scrub:1}});
      }
    });
  }
  initMotion();
  const world=$('.world-stage');
  world.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!window.gsap)return;const r=world.getBoundingClientRect();gsap.to('.world-parallax',{x:((e.clientX-r.left)/r.width-.5)*22,y:((e.clientY-r.top)/r.height-.5)*18,duration:.9,ease:'power2.out'});});
  world.addEventListener('pointerleave',()=>{if(window.gsap)gsap.to('.world-parallax',{x:0,y:0,duration:1});});

  const menu=$('#mobile-menu'),menuButton=$('.menu-toggle');
  function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Otvoriť navigáciu');}
  menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Zavrieť navigáciu':'Otvoriť navigáciu');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  addEventListener('resize',()=>{if(innerWidth>760)closeMenu();});

  const chapters=$$('.chapter-nav a'),navLinks=$$('.nav a');
  const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;const hash='#'+entry.target.id;
    [...chapters,...navLinks].forEach(a=>{const active=a.getAttribute('href')===hash;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }),{rootMargin:'-20% 0px -45% 0px'});
  $$('main>section').forEach(s=>sectionObserver.observe(s));

  $$('.filters button').forEach(button=>button.addEventListener('click',()=>{
    $$('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    $$('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&!card.dataset.tags.split(' ').includes(button.dataset.filter);});
    if(window.ScrollTrigger)ScrollTrigger.refresh();
  }));

  const steps=[
    {icon:'↙',title:'Najprv pochopiť,<br>čo prišlo.',description:'Správa z porady nie je hotová úloha. Najprv potrebujem rozlíšiť projekt, požiadavku a chýbajúci kontext.',label:'VSTUP Z PORADY',example:'„Potrebujeme doplniť podklady k projektu. Rozpočet ešte čaká na kontrolu.“',tags:['Rozhovor','Dokumenty','E-mail'],caption:'Človek určuje cieľ.'},
    {icon:'⌁',title:'Priradiť.<br>Prepojiť. Usporiadať.',description:'Požiadavka dostane projekt, súvisiace podklady a jasný stav. Návrh AI porovnám s pôvodným vstupom.',label:'PRACOVNÉ SPRACOVANIE',example:'Projekt: modelová obecná budova. Úloha: doplnenie podkladov. Čakanie: kontrola rozpočtu.',tags:['Projekt','Úloha','Čakanie'],caption:'Kontext sa nestráca.'},
    {icon:'✓',title:'Overiť, čo<br>naozaj vieme.',description:'Rozlišujem doložené údaje, návrhy a chýbajúce dôkazy. Rozhodujúce čísla a podmienky kontrolujem voči zdroju.',label:'KONTROLA PRED POUŽITÍM',example:'Rozpočet existuje. Jeho kontrola ešte nie je potvrdená. Úloha preto zostáva otvorená.',tags:['Zdroj','Súlad','Ľudská kontrola'],caption:'Návrh ešte nie je schválenie.'},
    {icon:'↗',title:'Ďalší krok,<br>ktorý je jasný.',description:'Výsledkom je použiteľný prehľad alebo návrh odpovede. Pri odoslaní a podaní zostáva rozhodnutie na človeku.',label:'VÝSTUP PRACOVNÉHO POSTUPU',example:'Doplniť konkrétne prílohy a vyžiadať potvrdenie kontroly rozpočtu. Návrh pripravený na kontrolu.',tags:['Prehľad','Návrh odpovede','Schválenie'],caption:'Pripravené ≠ odoslané.'}
  ];
  let stage=0;
  function showStep(index){stage=index%steps.length;const s=steps[stage];$('#stage-icon').textContent=s.icon;$('#stage-title').innerHTML=s.title;$('#stage-description').textContent=s.description;$('#stage-example').innerHTML='';const label=document.createElement('span');label.textContent=s.label;const p=document.createElement('p');p.textContent=s.example;$('#stage-example').append(label,p);$('#stage-tags').replaceChildren(...s.tags.map(t=>{const e=document.createElement('span');e.textContent=t;return e;}));$('#stage-caption').textContent=s.caption;$('#stage-counter').textContent=String(stage+1).padStart(2,'0')+' / 04';$$('.step').forEach(b=>{b.classList.toggle('active',Number(b.dataset.step)===stage);b.setAttribute('aria-pressed',String(Number(b.dataset.step)===stage));});if(window.gsap)gsap.fromTo('.stage-content',{opacity:.4,y:9},{opacity:1,y:0,duration:.35,clearProps:'all'});}
  $$('.step').forEach(b=>b.addEventListener('click',()=>showStep(Number(b.dataset.step))));
  $('#next-step').addEventListener('click',()=>showStep(stage+1));

  const cases={
    eurofondy:{category:'AI v praxi / pracovný postup',title:'Eurofondy, v súvislostiach.',intro:'Ako používam AI pri spracovaní skutočnej projektovej agendy — so zdrojmi, kontrolou a jasným rozlíšením stavov.',sections:[['Problém','Informácie prichádzajú v e-mailoch, dokumentoch a poradách. Úloha bez súvislostí môže znamenať nesprávny projekt, prehliadnutý podklad alebo nepravdivé hlásenie o dokončení.'],['Moja úloha','Pripravujem a implementujem eurofondové projekty. Spracúvam podklady, žiadosti, zmeny a projektovú administratívu počas realizácie; kontrolujem ich vecný súlad. AI používam na štruktúrovanie, sumarizáciu a pomocné overovanie. Rozhodnutia a významné kroky zostávajú pod kontrolou človeka.'],['Konkrétny priechod','Vstup → priradenie k projektu → úlohy a čakania → kontrola zdrojov → pracovný výstup → schválenie. Na stránke si môžeš prejsť modelový príklad bez klientskych dát.'],['Stav a hranice','Ide o používaný AI podporovaný pracovný postup. Jednotlivé kroky sú riadené človekom; ukážka nepredstavuje bezobslužný firemný systém ani úplnú produkčnú integráciu cez n8n/Make. Meraná časová úspora sa netvrdí.']]},
    chlpac:{category:'UX/UI / web / rezervácie',title:'Štýlový chlpáč.',intro:'Digitálna prezentácia salónu s vlastnou osobnosťou, jasným cenníkom a premysleným postupom objednania.',sections:[['Problém','Návštevník potrebuje rýchlo pochopiť služby, orientovať sa vo veľkostiach a možnostiach starostlivosti a vedieť, ako sa objednať. Salón zároveň potrebuje upravovať obsah bez zásahu do kódu.'],['Moja úloha','Na projekte pracujem ako tvorca návrhu a realizácie s podporou AI. Riešim kompozíciu, texty, mobilný postup, služby, obsahové rozhranie a kontrolu jednotlivých scenárov podľa spätnej väzby salónu.'],['Čo ukážka dokladá','Na karte je skutočný screenshot lokálneho návrhu. Projekt zahŕňa prezentáciu služieb, cenník, správu obsahu a lokálne overovaný rezervačný postup.'],['Stav a hranice','Lokálna verzia. Verejné nasadenie a ostré rezervácie neprezentujem ako dokončené; nadväzujú na skutočné rozvrhy, trvania služieb a potvrdenie prevádzkových údajov. Projekt je portfóliová spolupráca, nie doložená platená zákazka.']]},
    ponuky:{category:'Produkt / dokumentová automatizácia',title:'Zákazko.sk.',intro:'Jeden vstup údajov pre cenovú ponuku, zákazkový list a preberací protokol.',sections:[['Problém','Opakované údaje o firme, zákazníkovi a zákazke sa medzi dokumentmi prepisujú. Pri zmene potom hrozí nesúlad jednotlivých výstupov.'],['Moja úloha','Spolupracujem na produktovom zadaní, používateľskom postupe, realizácii a overovaní s podporou AI. Sledujem zrozumiteľný vstup, spoločné údaje a konzistentné výsledné dokumenty.'],['Princíp riešenia','Údaje sa zadajú raz, vyberú sa potrebné dokumenty a vytvoria sa konkrétne výstupy. Vizualizácia na karte je ilustračná a používa modelové údaje.'],['Stav a hranice','Zákazko.sk je zverejnený vlastný produkt vo fáze získavania prvých zákazníkov. Ukážka vysvetľuje princíp spoločných údajov a výstupov. Výsledky predaja a merané úspory zatiaľ neuvádzam.']]}
  };
  const dialog=$('#case-dialog');let lastOpener;
  function closeCase(){dialog.close();document.body.classList.remove('dialog-open');lastOpener?.focus();}
  $$('[data-case]').forEach(b=>b.addEventListener('click',()=>{const c=cases[b.dataset.case];lastOpener=b;$('#case-category').textContent=c.category;$('#case-title').textContent=c.title;$('#case-intro').textContent=c.intro;$('#case-details').replaceChildren(...c.sections.map(([title,body])=>{const s=document.createElement('section');s.className='case-section';const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=body;s.append(h,p);return s;}));dialog.showModal();dialog.scrollTop=0;document.body.classList.add('dialog-open');}));
  $('.dialog-close').addEventListener('click',closeCase);$('.dialog-done').addEventListener('click',closeCase);
  dialog.addEventListener('cancel',()=>{document.body.classList.remove('dialog-open');});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeCase();}});

  $('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('denisbalaz965@gmail.com');$('#copy-status').textContent='E-mail je skopírovaný.';}catch{$('#copy-status').textContent='E-mail: denisbalaz965@gmail.com';}});
  addEventListener('load',()=>window.ScrollTrigger?.refresh());
})();
