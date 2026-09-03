# TapCard

A digital contact card. You open one screen on your phone, someone points their
camera at it, and they get your details with a single tap. No typing, no app for
them to install, no dictating your number across a noisy room.

## What is in here

| File | What it does |
|---|---|
| `config.js` | **The only file you normally edit.** Your name, number, links, colours. |
| `index.html` | The page people land on when they scan you. |
| `qr.html` | The screen **you** open to show your code. This is what you install. |
| `me.vcf` | The contact file their phone saves. Regenerate with `node build-vcf.mjs`. |
| `build-vcf.mjs` | Rebuilds `me.vcf` from `config.js`. Optional, no installs needed. |
| `manifest.webmanifest`, `sw.js` | Make it installable and work with no signal. |
| `assets/`, `icons/` | Stylesheet, QR library, home screen icons. |

## Setting it up

### 1. Put your real details in

Open `config.js` and fill in `phone`, `website` and `linkedin`. Anything you
leave on its placeholder value is hidden from the card automatically, so an
unfinished field never shows up as a broken link.

The card carries **two numbers**, each with its own WhatsApp row:

| Field | What it is |
|---|---|
| `phone` / `phoneLabel` | Your primary number. This is the one phones dial by default. |
| `phone2` / `phone2Label` | A second number. Set `phone2` to `""` to hide it. |
| `whatsapp` / `whatsappLabel` | WhatsApp for the primary number. |
| `whatsapp2` / `whatsapp2Label` | A second WhatsApp, e.g. a business account. |

The labels are what appear in brackets on the card — `Call me (UK)`,
`WhatsApp (Business)`. Leave a label as `""` and the row just reads `Call me`.

Then run this from inside the folder:

```
node build-vcf.mjs
```

That rewrites `me.vcf`. If you would rather not run anything, open `me.vcf` in a
text editor and change the same values by hand. It is plain text.

### 2. Publish it on GitHub Pages

1. Create a new **public** repository. Call it `card`.
2. Upload every file in this folder to it, including the hidden `.nojekyll` file.
3. Go to **Settings**, then **Pages**.
4. Under Source pick **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Wait about a minute. Your card is now live at:

```
https://YOUR-USERNAME.github.io/card/
```

The QR code builds itself from that address, so there is nothing else to
configure. If you later move to your own domain, set `url` in `config.js` to the
new address and the code updates itself.

### 3. Put the QR screen on your home screen

On your phone, open `https://YOUR-USERNAME.github.io/card/qr.html`

**iPhone:** Share button, then Add to Home Screen.
**Android:** the three dot menu, then Install app or Add to Home screen.

Important: add it to your home screen **from the `qr.html` page**, not from the
card page. iPhone uses whichever page you are on as the starting screen.

You now have an icon that opens straight to your code, full screen, with no
browser bars. It works with no signal because the page is cached on the phone.

## Using it

Open the app, hold the phone up, done. Tapping the code switches it to a plain
white full brightness screen, which helps in dim bars and bright sunlight where
cameras struggle.

The **PNG** button saves the code as an image. Drop that into your email
signature, a slide, or the back of a printed business card.

## Updating your details later

Change `config.js`, run `node build-vcf.mjs`, push the two changed files. Anyone
who already saved you keeps the old details, since a saved contact is a copy.
But everyone who scans you from that moment gets the new ones, and the printed
code never has to change because the code only ever points at the address.

If a phone seems to be showing you an old version, bump the `CACHE` version in
`sw.js` (`'tapcard-v2'` to `'tapcard-v3'`, and so on). That forces every
installed copy to refresh.

## Notes

- A QR code can only ever carry one destination. That is why it points at your
  card page rather than trying to open your contact file and your website at
  once. The page is what puts both in front of the person.
- The Save button needs the site to be properly hosted. Opening `index.html`
  straight off your hard drive will show the card but the download will not fire.
- Nothing here phones home. There is no tracking, no account, no server. It is
  six static files.
