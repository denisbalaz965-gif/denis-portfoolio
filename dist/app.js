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
  {
    "icon": "↙",
    "title": "Pochopiť,<br>čo treba riešiť.",
    "description": "Z porady alebo správy vyberiem konkrétnu požiadavku. Rozlíšim, čo máme doplniť a ktoré informácie chýbajú.",
    "label": "ZADANIE",
    "example": "„Fond žiada doplniť rozpočet. Posledná verzia ešte čaká na kontrolu.“",
    "tags": [
      "Porada",
      "Dokumenty",
      "E-mail"
    ],
    "caption": "Najprv si ujasním zadanie."
  },
  {
    "icon": "⌁",
    "title": "Spojiť zadanie<br>s podkladmi.",
    "description": "Požiadavku priradím k projektu, dohľadám súvisiace dokumenty a zapíšem úlohu aj to, na čo čakáme.",
    "label": "PROJEKT A SÚVISLOSTI",
    "example": "Úloha: doplniť rozpočet. Podklad: posledná verzia. Čakáme: potvrdenie kontroly.",
    "tags": [
      "Projekt",
      "Podklady",
      "Závislosti"
    ],
    "caption": "Každá úloha má svoj kontext."
  },
  {
    "icon": "✓",
    "title": "Overiť verziu<br>aj skutočný stav.",
    "description": "Kontrolujem zdroj, údaje a verziu dokumentu. Rozlišujem hotový podklad od návrhu, ktorý ešte čaká na kontrolu.",
    "label": "KONTROLA PODKLADOV",
    "example": "Rozpočet máme, kontrolu zatiaľ nie. Doplnenie preto ešte nie je pripravené na odoslanie.",
    "tags": [
      "Zdroj",
      "Verzia",
      "Kontrola"
    ],
    "caption": "Rozhodujem podľa overených podkladov."
  },
  {
    "icon": "↗",
    "title": "Pripraviť výstup<br>a ďalší krok.",
    "description": "Z podkladov pripravím návrh odpovede a určím, čo treba dokončiť. Pred odoslaním výstup skontrolujem.",
    "label": "PRACOVNÝ VÝSTUP",
    "example": "Vyžiadať potvrdenie kontroly rozpočtu, doplniť prílohy a pripraviť odpoveď fondu.",
    "tags": [
      "Odpoveď",
      "Prílohy",
      "Ďalší krok"
    ],
    "caption": "Je jasné, čo nasleduje."
  }
];
  let stage=0;
  function showStep(index){stage=index%steps.length;const s=steps[stage];$('#stage-icon').textContent=s.icon;$('#stage-title').innerHTML=s.title;$('#stage-description').textContent=s.description;$('#stage-example').innerHTML='';const label=document.createElement('span');label.textContent=s.label;const p=document.createElement('p');p.textContent=s.example;$('#stage-example').append(label,p);$('#stage-tags').replaceChildren(...s.tags.map(t=>{const e=document.createElement('span');e.textContent=t;return e;}));$('#stage-caption').textContent=s.caption;$('#stage-counter').textContent=String(stage+1).padStart(2,'0')+' / 04';$$('.step').forEach(b=>{b.classList.toggle('active',Number(b.dataset.step)===stage);b.setAttribute('aria-pressed',String(Number(b.dataset.step)===stage));});if(window.gsap)gsap.fromTo('.stage-content',{opacity:.4,y:9},{opacity:1,y:0,duration:.35,clearProps:'all'});}
  $$('.step').forEach(b=>b.addEventListener('click',()=>showStep(Number(b.dataset.step))));
  $('#next-step').addEventListener('click',()=>showStep(stage+1));

  const cases={
  "eurofondy": {
    "category": "AI v praxi / projektová agenda",
    "title": "Eurofondy s podporou AI",
    "intro": "Pracovný postup, ktorý používam pri príprave a implementácii projektov v CASSIS Consult.",
    "sections": [
      [
        "Zadanie",
        "Informácie o projekte prichádzajú v e-mailoch, dokumentoch a poradách. Potrebujem ich spojiť tak, aby bolo jasné, čo riešime, ktoré podklady platia a čo nasleduje."
      ],
      [
        "Moja úloha",
        "Pripravujem a implementujem eurofondové projekty. Riešim žiadosti, rozpočtové podklady, zmeny a projektovú administratívu. AI využívam na spracovanie informácií a pracovné návrhy; kontrolujem zdroje aj výsledok."
      ],
      [
        "Ako to funguje",
        "Vstup priradím k projektu, prepojím s podkladmi a rozdelím na úlohy a čakania. Po kontrole údajov pripravím výstup a konkrétny ďalší krok. Významné odoslania a podania prechádzajú schválením."
      ],
      [
        "Aktuálny stav",
        "Postup používam v každodennej práci s AI a kontrolou človeka. Interaktívna ukážka na stránke pracuje s modelovými údajmi."
      ]
    ]
  },
  "chlpac": {
    "category": "UX/UI / web / rezervácie",
    "title": "Štýlový chlpáč",
    "intro": "Web pre psí salón — od prvého zoznámenia so službami po výber starostlivosti a postup rezervácie.",
    "sections": [
      [
        "Zadanie",
        "Zákazník potrebuje rozumieť službám, zorientovať sa v cenníku a vedieť, ako sa objednať. Tím salónu potrebuje spravovať obsah a pracovať s rezerváciami podľa reálnej prevádzky."
      ],
      [
        "Moja úloha",
        "Navrhujem a vytváram web s podporou AI. Riešim vizuál, texty, služby, cenník, mobilné rozloženie, správu obsahu aj rezervačný postup. Úpravy overujem na konkrétnych scenároch a podľa spätnej väzby salónu."
      ],
      [
        "Ako to funguje",
        "Návštevník sa zoznámi so salónom, porovná služby a vyberie starostlivosť pre svojho psa. Rezervačný postup nadväzuje na ponuku služieb, ich trvanie a dostupnosť pracovníčok."
      ],
      [
        "Aktuálny stav",
        "Pripravujem verejné nasadenie. Na karte je ukážka z vývojovej verzie; odkaz na živý web doplním po spustení."
      ]
    ]
  },
  "ponuky": {
    "category": "Vlastný produkt / dokumentová automatizácia",
    "title": "Zákazko.sk",
    "intro": "Cenová ponuka, zákazkový list a preberací protokol zo spoločných údajov o zákazke.",
    "sections": [
      [
        "Zadanie",
        "Údaje o firme, zákazníkovi a zákazke sa opakujú vo viacerých dokumentoch. Ručné prepisovanie pridáva prácu a pri zmene údajov môže viesť k rozdielnym výstupom."
      ],
      [
        "Moja úloha",
        "Spolupracujem na zadaní produktu, návrhu používateľského postupu, realizácii a overovaní s podporou AI. Sústreďujem sa na zrozumiteľný vstup a konzistentné výsledné dokumenty."
      ],
      [
        "Ako to funguje",
        "Používateľ vyplní údaje o zákazke a vyberie potrebné dokumenty. Zo spoločného vstupu vytvorí cenovú ponuku, zákazkový list alebo preberací protokol. Ilustrácia na karte používa modelové údaje."
      ],
      [
        "Aktuálny stav",
        "Zákazko.sk je zverejnený produkt. Teraz pracujeme na oslovení prvých zákazníkov a overení jeho prínosu v každodennej praxi."
      ]
    ]
  }
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
