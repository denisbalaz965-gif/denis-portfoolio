# Kontaktný formulár — pripravené napojenie

Web obsluhuje Worker ESM. Pôvodné Vite súbory a médiá sú pri zostavení vložené do Workeru so zachovanými URL. Formulár používa rovnakú doménu a `/api/contact`. Bez nastavenia server vráti `ready: false` a odosielanie je vypnuté. Priamy e-mail a telefón zostávajú dostupné.

## Čo ešte treba na aktiváciu

1. Vytvoriť účet Resend a pridať vlastnú odosielaciu doménu. Overiť DNS podľa údajov Resendu. Doména `resend.dev` je obmedzená na testovanie na adresu účtu.
2. Vytvoriť kľúč s oprávnením odosielať len z tejto domény. Vložiť ho ako **serverové tajomstvo** `RESEND_API_KEY` v nastaveniach Sites. Nikdy do chatu, repozitára ani premennej s predponou `VITE_`.
3. Nastaviť `CONTACT_FROM_EMAIL` na overenú adresu. Príjemca je pevne `denisbalaz965@gmail.com`; návštevník ho nemôže meniť. Jeho overený formát e-mailu je použitý len ako `reply_to`.
4. Nastaviť limity účtu v Resende. Aktuálna ochrana má kontrolu pôvodu, skryté pole, veľkosť vstupu, maximálne 3 pokusy na IP / 10 minút a 20 celkovo na jeden Worker isolate. **Nie je to spoločný distribuovaný limit.** Pred platenou návštevnosťou alebo väčšou kampaňou doplniť spoločný limit alebo ochranu proti botom; aktuálne je doručovanie vypnuté.
5. Po pripravení účtu nastaviť `CONTACT_ENABLED=true`. Overiť reálny prijatý e-mail, možnosť odpovedať a stav doručenia v Resende. Takýto test sa zatiaľ neuskutočnil.

Pri zmene kľúča nie je potrebné meniť klientsky kód. Tajomstvá sú iba v prostredí servera. Web si neukladá zadania do databázy a neloguje obsah ani adresy. Text sa odovzdáva e-mailovej službe, nie ako HTML. Pri chybe zostáva obsah vo formulári, opakovaný pokus používa rovnaký idempotency key. Potvrdenie znamená prijatie službou na odoslanie, nie preukázané doručenie alebo prečítanie.

Lokálne: skopírovať `.env.example` do ignorovaného `.env.local`, doplniť hodnoty mimo chatu. Bez nich možno bezpečne kontrolovať vypnutý stav. Testy používajú náhradu služby a neposielajú skutočné správy.

Primárne podklady: [Send Email](https://resend.com/docs/api-reference/emails/send-email), [obmedzenie resend.dev](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).
