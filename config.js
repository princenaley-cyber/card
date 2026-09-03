/* ==========================================================================
   TAPCARD  ·  EDIT THIS FILE AND NOTHING ELSE
   --------------------------------------------------------------------------
   Everything on your card comes from the CARD object below.
   Change the values between the quote marks, save, and you are done.
   Then run  node build-vcf.mjs  to refresh me.vcf (or edit me.vcf by hand).
   ========================================================================== */

const CARD = {

  /* ---- WHO YOU ARE ------------------------------------------------------ */
  firstName: "Prince Naley",
  lastName:  "Alobari",
  // Shown big at the top. Leave as-is to use firstName + lastName.
  displayName: "Prince Naley Alobari",
  title:    "Strategic Business Analyst",
  company:  "NESO",
  // One short line under your name. Keep it under about 90 characters.
  tagline:  "Business transformation, data and delivery. Energy and beyond.",
  // Two or three initials for the avatar circle. Leave "" to auto-generate.
  initials: "",
  // Optional: put a square photo at site/icons/photo.jpg and set this to true.
  usePhoto: false,

  /* ---- HOW PEOPLE REACH YOU --------------------------------------------- */
  // Phones in full international format. These are what get saved to contacts.
  phone:       "+44 7580 760180",       // primary — UK mobile
  phoneLabel:  "UK",                    // shown after "Call me", e.g. Call me (UK)
  phone2:      "+234 904 485 1312",     // second number. Set to "" to hide it.
  phone2Label: "Nigeria",

  email:    "naleydeprince@gmail.com",
  website:  "https://princenaleyalobari.com",
  linkedin: "https://www.linkedin.com/in/princenaleyalobari",

  // WhatsApp. Set any of these to "" to hide that button entirely.
  whatsapp:       "+447580760180",      // UK WhatsApp
  whatsappLabel:  "UK",
  whatsapp2:      "+2349044851312",     // business WhatsApp
  whatsapp2Label: "Business",

  calendar: "",              // e.g. a Calendly link
  location: "London, United Kingdom",

  /* ---- THE ADDRESS YOUR QR CODE POINTS AT -------------------------------- */
  // Leave "" and the QR builds itself from wherever this site is hosted.
  // Only set this if you want the QR to point somewhere else, e.g. a short link.
  url: "",

  /* ---- LOOK -------------------------------------------------------------- */
  theme: {
    bg:     "#0B0F14",   // page background
    card:   "#121820",   // card surface
    line:   "#1E2833",   // hairlines and borders
    text:   "#EAF0F7",   // main text
    muted:  "#8A9AAC",   // secondary text
    accent: "#C9A227",   // buttons, avatar ring, highlights
    accentInk: "#0B0F14" // text sitting on top of the accent colour
  }
};

/* ---- Derived values. You do not need to touch anything below this line. --- */
CARD.displayName = CARD.displayName || (CARD.firstName + " " + CARD.lastName);
CARD.initials = CARD.initials ||
  (CARD.firstName.trim()[0] || "") + (CARD.lastName.trim()[0] || "");

CARD.publicUrl = function () {
  if (CARD.url) return CARD.url;
  return new URL("./index.html", location.href).href.replace(/index\.html$/, "");
};

CARD.telHref = function (p) {
  var n = arguments.length ? p : CARD.phone;
  return n ? "tel:" + String(n).replace(/[^\d+]/g, "") : "";
};

CARD.waHref = function (w) {
  var n = arguments.length ? w : CARD.whatsapp;
  if (!n) return "";
  if (String(n).startsWith("http")) return n;
  return "https://wa.me/" + String(n).replace(/[^\d]/g, "");
};

/* Shows a WhatsApp number in the same readable spacing as the phone fields. */
CARD.pretty = function (n) {
  var d = String(n).replace(/[^\d]/g, "");
  var match = [CARD.phone, CARD.phone2].filter(Boolean).find(function (p) {
    return p.replace(/[^\d]/g, "") === d;
  });
  return match || n;
};

CARD.tidy = function (u) {
  return String(u).replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
};

if (typeof module !== "undefined") module.exports = { CARD };
