/* Regenerates me.vcf from config.js.
   Run it from the site folder after you edit your details:

       node build-vcf.mjs

   No installs, no dependencies. If you would rather not run anything,
   just edit me.vcf by hand instead. It is plain text. */

import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('./config.js', import.meta.url), 'utf8');
const CARD = new Function(src + '\nreturn CARD;')();

// vCard lines must use CRLF, and commas, semicolons and backslashes escape.
const esc = v => String(v).replace(/([\\,;])/g, '\\$1').replace(/\n/g, '\\n');
const tel = v => String(v).replace(/[^\d+]/g, '');
const placeholder = v =>
  !v || /example\.com|your-profile|7000 000000|7000000000|7911 123456/.test(v);

const L = [];
const add = (k, v) => { if (v) L.push(k + ':' + v); };

L.push('BEGIN:VCARD', 'VERSION:3.0');
add('N', `${esc(CARD.lastName)};${esc(CARD.firstName)};;;`);
add('FN', esc(CARD.displayName));
add('TITLE', esc(CARD.title));
add('ORG', esc(CARD.company));

// Primary number first, so it is the one phones dial by default.
// The second gets TYPE=WORK, which every phone labels sensibly on import.
if (!placeholder(CARD.phone))  L.push('TEL;TYPE=CELL,VOICE,PREF:' + tel(CARD.phone));
if (!placeholder(CARD.phone2)) L.push('TEL;TYPE=WORK,VOICE:' + tel(CARD.phone2));

if (CARD.email) L.push('EMAIL;TYPE=INTERNET,PREF:' + esc(CARD.email));
if (!placeholder(CARD.website)) L.push('URL:' + CARD.website);

// Labelled extras. iPhone shows the X-ABLabel name; others fall back gracefully.
let item = 0;
const labelled = (line, label) => {
  const n = ++item;
  L.push(`item${n}.${line}`);
  L.push(`item${n}.X-ABLabel:${label}`);
};

if (!placeholder(CARD.linkedin)) {
  labelled('URL:' + CARD.linkedin, 'LinkedIn');
  L.push('X-SOCIALPROFILE;TYPE=linkedin:' + CARD.linkedin);
}

// WhatsApp numbers, so they are reachable straight from the saved contact.
const wa = w => (String(w).startsWith('http') ? w : 'https://wa.me/' + String(w).replace(/[^\d]/g, ''));
if (CARD.whatsapp)  labelled('URL:' + wa(CARD.whatsapp),  'WhatsApp' + (CARD.whatsappLabel ? ' (' + CARD.whatsappLabel + ')' : ''));
if (CARD.whatsapp2) labelled('URL:' + wa(CARD.whatsapp2), 'WhatsApp' + (CARD.whatsapp2Label ? ' (' + CARD.whatsapp2Label + ')' : ''));

if (CARD.calendar) labelled('URL:' + CARD.calendar, 'Book a time');

// The card page itself, so people can always get back to the live version.
if (CARD.url) labelled('URL:' + CARD.url, 'Digital card');

if (CARD.location) {
  const [city, ...rest] = CARD.location.split(',').map(s => s.trim());
  L.push(`ADR;TYPE=WORK:;;;${esc(city)};;;${esc(rest.join(', '))}`);
}
if (CARD.tagline) L.push('NOTE:' + esc(CARD.tagline));
L.push('REV:' + new Date().toISOString().replace(/\.\d+/, ''));
L.push('END:VCARD');

writeFileSync(new URL('./me.vcf', import.meta.url), L.join('\r\n') + '\r\n');
console.log('me.vcf written:\n\n' + L.join('\n') + '\n');

const missing = [
  placeholder(CARD.phone) && 'phone',
  placeholder(CARD.website) && 'website',
  placeholder(CARD.linkedin) && 'linkedin'
].filter(Boolean);
if (missing.length) {
  console.log('Still on placeholder values, so left out of the card: ' + missing.join(', '));
}
