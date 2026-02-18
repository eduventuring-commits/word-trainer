/**
 * Pronunciation-anchored word data for all 120 words in the dataset.
 *
 * Each entry provides:
 *   syllables  — spelling chunks that match how the word is SPOKEN
 *   soundCues  — teacher-friendly pronunciation label per syllable
 *                (matches the whole-word pronunciation — no misleading sounds)
 *   morphemes  — meaning-based split (prefix / root / suffix)
 *   morphCues  — pronunciation cue per morpheme chunk
 *
 * Derived from the teacher-authored decoding_notes in morphology_dataset.json.
 * The cues use schwa /uh/ where vowels reduce, "shun" for -tion/-sion, etc.
 */

export interface SyllableEntry {
  syllables: string[];   // e.g. ["por","ta","ble"]
  soundCues:  string[];  // e.g. ["/por/", "/tuh/", "/buhl/"]
  morphemes:  string[];  // e.g. ["port","able"]
  morphCues:  string[];  // e.g. ["/port/", "/uh-buhl/"]
  morphRoles: string[];  // e.g. ["root","suffix"]
}

const WORD_DATA: Record<string, SyllableEntry> = {
  // ── port root ──────────────────────────────────────────────────────────────
  transport: {
    syllables: ["trans","port"],
    soundCues: ["/tranz/", "/port/"],
    morphemes: ["trans","port"],
    morphCues: ["/tranz/", "/port/"],
    morphRoles: ["prefix","root"],
  },
  portable: {
    syllables: ["por","ta","ble"],
    soundCues: ["/por/", "/tuh/", "/buhl/"],
    morphemes: ["port","able"],
    morphCues: ["/port/", "/uh-buhl/"],
    morphRoles: ["root","suffix"],
  },
  import: {
    syllables: ["im","port"],
    soundCues: ["/im/", "/port/"],
    morphemes: ["im","port"],
    morphCues: ["/im/", "/port/"],
    morphRoles: ["prefix","root"],
  },
  report: {
    syllables: ["re","port"],
    soundCues: ["/rih/", "/port/"],
    morphemes: ["re","port"],
    morphCues: ["/rih/", "/port/"],
    morphRoles: ["prefix","root"],
  },
  export: {
    syllables: ["ex","port"],
    soundCues: ["/eks/", "/port/"],
    morphemes: ["ex","port"],
    morphCues: ["/eks/", "/port/"],
    morphRoles: ["prefix","root"],
  },
  portfolio: {
    syllables: ["port","fo","li","o"],
    soundCues: ["/port/", "/foh/", "/lee/", "/oh/"],
    morphemes: ["port","folio"],
    morphCues: ["/port/", "/foh-lee-oh/"],
    morphRoles: ["root","root"],
  },

  // ── vis root ───────────────────────────────────────────────────────────────
  visible: {
    syllables: ["vis","i","ble"],
    soundCues: ["/viz/", "/ih/", "/buhl/"],
    morphemes: ["vis","ible"],
    morphCues: ["/viz/", "/ih-buhl/"],
    morphRoles: ["root","suffix"],
  },
  invisible: {
    syllables: ["in","vis","i","ble"],
    soundCues: ["/in/", "/viz/", "/ih/", "/buhl/"],
    morphemes: ["in","vis","ible"],
    morphCues: ["/in/", "/viz/", "/ih-buhl/"],
    morphRoles: ["prefix","root","suffix"],
  },
  revise: {
    syllables: ["re","vise"],
    soundCues: ["/rih/", "/vize/"],
    morphemes: ["re","vise"],
    morphCues: ["/rih/", "/vize/"],
    morphRoles: ["prefix","root"],
  },
  supervise: {
    syllables: ["su","per","vise"],
    soundCues: ["/soo/", "/per/", "/vize/"],
    morphemes: ["super","vise"],
    morphCues: ["/soo-per/", "/vize/"],
    morphRoles: ["prefix","root"],
  },
  preview: {
    syllables: ["pre","view"],
    soundCues: ["/pree/", "/vyoo/"],
    morphemes: ["pre","view"],
    morphCues: ["/pree/", "/vyoo/"],
    morphRoles: ["prefix","root"],
  },
  vision: {
    syllables: ["vi","sion"],
    soundCues: ["/vizh/", "/uhn/"],
    morphemes: ["vis","ion"],
    morphCues: ["/viz/", "/yuhn/"],
    morphRoles: ["root","suffix"],
  },
  revision: {
    syllables: ["re","vi","sion"],
    soundCues: ["/rih/", "/vizh/", "/uhn/"],
    morphemes: ["re","vis","ion"],
    morphCues: ["/rih/", "/viz/", "/yuhn/"],
    morphRoles: ["prefix","root","suffix"],
  },

  // ── rupt root ──────────────────────────────────────────────────────────────
  interrupt: {
    syllables: ["in","ter","rupt"],
    soundCues: ["/in/", "/ter/", "/rupt/"],
    morphemes: ["inter","rupt"],
    morphCues: ["/in-ter/", "/rupt/"],
    morphRoles: ["prefix","root"],
  },
  erupt: {
    syllables: ["e","rupt"],
    soundCues: ["/ih/", "/rupt/"],
    morphemes: ["e","rupt"],
    morphCues: ["/ih/", "/rupt/"],
    morphRoles: ["prefix","root"],
  },
  disrupt: {
    syllables: ["dis","rupt"],
    soundCues: ["/dis/", "/rupt/"],
    morphemes: ["dis","rupt"],
    morphCues: ["/dis/", "/rupt/"],
    morphRoles: ["prefix","root"],
  },
  corrupt: {
    syllables: ["cor","rupt"],
    soundCues: ["/kor/", "/rupt/"],
    morphemes: ["cor","rupt"],
    morphCues: ["/kor/", "/rupt/"],
    morphRoles: ["prefix","root"],
  },
  disruption: {
    syllables: ["dis","rup","tion"],
    soundCues: ["/dis/", "/rup/", "/shun/"],
    morphemes: ["dis","rupt","ion"],
    morphCues: ["/dis/", "/rupt/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  eruptive: {
    syllables: ["e","rup","tive"],
    soundCues: ["/ih/", "/rup/", "/tiv/"],
    morphemes: ["e","rupt","ive"],
    morphCues: ["/ih/", "/rupt/", "/tiv/"],
    morphRoles: ["prefix","root","suffix"],
  },

  // ── scrib / script root ────────────────────────────────────────────────────
  describe: {
    syllables: ["de","scribe"],
    soundCues: ["/dih/", "/skribe/"],
    morphemes: ["de","scribe"],
    morphCues: ["/dih/", "/skribe/"],
    morphRoles: ["prefix","root"],
  },
  prescription: {
    syllables: ["pre","scrip","tion"],
    soundCues: ["/pree/", "/skrip/", "/shun/"],
    morphemes: ["pre","script","ion"],
    morphCues: ["/pree/", "/skript/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  inscription: {
    syllables: ["in","scrip","tion"],
    soundCues: ["/in/", "/skrip/", "/shun/"],
    morphemes: ["in","script","ion"],
    morphCues: ["/in/", "/skript/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  manuscript: {
    syllables: ["man","u","script"],
    soundCues: ["/man/", "/yoo/", "/skript/"],
    morphemes: ["manu","script"],
    morphCues: ["/man-yoo/", "/skript/"],
    morphRoles: ["root","root"],
  },
  description: {
    syllables: ["de","scrip","tion"],
    soundCues: ["/dih/", "/skrip/", "/shun/"],
    morphemes: ["de","script","ion"],
    morphCues: ["/dih/", "/skript/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  subscription: {
    syllables: ["sub","scrip","tion"],
    soundCues: ["/sub/", "/skrip/", "/shun/"],
    morphemes: ["sub","script","ion"],
    morphCues: ["/sub/", "/skript/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },

  // ── dict root ──────────────────────────────────────────────────────────────
  predict: {
    syllables: ["pre","dict"],
    soundCues: ["/prih/", "/dikt/"],
    morphemes: ["pre","dict"],
    morphCues: ["/prih/", "/dikt/"],
    morphRoles: ["prefix","root"],
  },
  contradiction: {
    syllables: ["con","tra","dic","tion"],
    soundCues: ["/kon/", "/truh/", "/dik/", "/shun/"],
    morphemes: ["contra","dict","ion"],
    morphCues: ["/kon-truh/", "/dikt/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  dictate: {
    syllables: ["dic","tate"],
    soundCues: ["/dik/", "/tayt/"],
    morphemes: ["dict","ate"],
    morphCues: ["/dikt/", "/ayt/"],
    morphRoles: ["root","suffix"],
  },
  prediction: {
    syllables: ["pre","dic","tion"],
    soundCues: ["/prih/", "/dik/", "/shun/"],
    morphemes: ["pre","dict","ion"],
    morphCues: ["/prih/", "/dikt/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  dictator: {
    syllables: ["dic","ta","tor"],
    soundCues: ["/dik/", "/tay/", "/ter/"],
    morphemes: ["dict","ator"],
    morphCues: ["/dikt/", "/ay-ter/"],
    morphRoles: ["root","suffix"],
  },

  // ── struct root ────────────────────────────────────────────────────────────
  instruct: {
    syllables: ["in","struct"],
    soundCues: ["/in/", "/strukt/"],
    morphemes: ["in","struct"],
    morphCues: ["/in/", "/strukt/"],
    morphRoles: ["prefix","root"],
  },
  construction: {
    syllables: ["con","struc","tion"],
    soundCues: ["/kon/", "/struk/", "/shun/"],
    morphemes: ["con","struct","ion"],
    morphCues: ["/kon/", "/strukt/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  destructive: {
    syllables: ["de","struc","tive"],
    soundCues: ["/dih/", "/struk/", "/tiv/"],
    morphemes: ["de","struct","ive"],
    morphCues: ["/dih/", "/strukt/", "/tiv/"],
    morphRoles: ["prefix","root","suffix"],
  },
  infrastructure: {
    syllables: ["in","fra","struc","ture"],
    soundCues: ["/in/", "/fruh/", "/struk/", "/cher/"],
    morphemes: ["infra","struct","ure"],
    morphCues: ["/in-fruh/", "/strukt/", "/cher/"],
    morphRoles: ["prefix","root","suffix"],
  },
  instruction: {
    syllables: ["in","struc","tion"],
    soundCues: ["/in/", "/struk/", "/shun/"],
    morphemes: ["in","struct","ion"],
    morphCues: ["/in/", "/strukt/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  restructure: {
    syllables: ["re","struc","ture"],
    soundCues: ["/rih/", "/struk/", "/cher/"],
    morphemes: ["re","struct","ure"],
    morphCues: ["/rih/", "/strukt/", "/cher/"],
    morphRoles: ["prefix","root","suffix"],
  },
  structure: {
    syllables: ["struc","ture"],
    soundCues: ["/struk/", "/cher/"],
    morphemes: ["struct","ure"],
    morphCues: ["/strukt/", "/cher/"],
    morphRoles: ["root","suffix"],
  },

  // ── act root ───────────────────────────────────────────────────────────────
  reaction: {
    syllables: ["re","ac","tion"],
    soundCues: ["/rih/", "/ak/", "/shun/"],
    morphemes: ["re","act","ion"],
    morphCues: ["/rih/", "/akt/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  interact: {
    syllables: ["in","ter","act"],
    soundCues: ["/in/", "/ter/", "/akt/"],
    morphemes: ["inter","act"],
    morphCues: ["/in-ter/", "/akt/"],
    morphRoles: ["prefix","root"],
  },
  inactive: {
    syllables: ["in","ac","tive"],
    soundCues: ["/in/", "/ak/", "/tiv/"],
    morphemes: ["in","act","ive"],
    morphCues: ["/in/", "/akt/", "/tiv/"],
    morphRoles: ["prefix","root","suffix"],
  },
  action: {
    syllables: ["ac","tion"],
    soundCues: ["/ak/", "/shun/"],
    morphemes: ["act","ion"],
    morphCues: ["/akt/", "/shun/"],
    morphRoles: ["root","suffix"],
  },
  interaction: {
    syllables: ["in","ter","ac","tion"],
    soundCues: ["/in/", "/ter/", "/ak/", "/shun/"],
    morphemes: ["inter","act","ion"],
    morphCues: ["/in-ter/", "/akt/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  actor: {
    syllables: ["ac","tor"],
    soundCues: ["/ak/", "/ter/"],
    morphemes: ["act","or"],
    morphCues: ["/akt/", "/er/"],
    morphRoles: ["root","suffix"],
  },
  activist: {
    syllables: ["ac","tiv","ist"],
    soundCues: ["/ak/", "/tiv/", "/ist/"],
    morphemes: ["act","iv","ist"],
    morphCues: ["/akt/", "/iv/", "/ist/"],
    morphRoles: ["root","suffix","suffix"],
  },
  counteract: {
    syllables: ["coun","ter","act"],
    soundCues: ["/kown/", "/ter/", "/akt/"],
    morphemes: ["counter","act"],
    morphCues: ["/kown-ter/", "/akt/"],
    morphRoles: ["prefix","root"],
  },

  // ── form root ──────────────────────────────────────────────────────────────
  reform: {
    syllables: ["re","form"],
    soundCues: ["/rih/", "/form/"],
    morphemes: ["re","form"],
    morphCues: ["/rih/", "/form/"],
    morphRoles: ["prefix","root"],
  },
  transform: {
    syllables: ["trans","form"],
    soundCues: ["/tranz/", "/form/"],
    morphemes: ["trans","form"],
    morphCues: ["/tranz/", "/form/"],
    morphRoles: ["prefix","root"],
  },
  uniform: {
    syllables: ["u","ni","form"],
    soundCues: ["/yoo/", "/nih/", "/form/"],
    morphemes: ["uni","form"],
    morphCues: ["/yoo-nih/", "/form/"],
    morphRoles: ["prefix","root"],
  },
  transformation: {
    syllables: ["trans","for","ma","tion"],
    soundCues: ["/tranz/", "/for/", "/may/", "/shun/"],
    morphemes: ["trans","form","ation"],
    morphCues: ["/tranz/", "/form/", "/ay-shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  formation: {
    syllables: ["for","ma","tion"],
    soundCues: ["/for/", "/may/", "/shun/"],
    morphemes: ["form","ation"],
    morphCues: ["/form/", "/ay-shun/"],
    morphRoles: ["root","suffix"],
  },

  // ── mit / miss root ────────────────────────────────────────────────────────
  submit: {
    syllables: ["sub","mit"],
    soundCues: ["/sub/", "/mit/"],
    morphemes: ["sub","mit"],
    morphCues: ["/sub/", "/mit/"],
    morphRoles: ["prefix","root"],
  },
  transmit: {
    syllables: ["trans","mit"],
    soundCues: ["/tranz/", "/mit/"],
    morphemes: ["trans","mit"],
    morphCues: ["/tranz/", "/mit/"],
    morphRoles: ["prefix","root"],
  },
  permission: {
    syllables: ["per","mis","sion"],
    soundCues: ["/per/", "/mis/", "/shun/"],
    morphemes: ["per","miss","ion"],
    morphCues: ["/per/", "/mis/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },
  mission: {
    syllables: ["mis","sion"],
    soundCues: ["/mish/", "/uhn/"],
    morphemes: ["miss","ion"],
    morphCues: ["/mis/", "/shun/"],
    morphRoles: ["root","suffix"],
  },
  submission: {
    syllables: ["sub","mis","sion"],
    soundCues: ["/sub/", "/mish/", "/uhn/"],
    morphemes: ["sub","miss","ion"],
    morphCues: ["/sub/", "/mis/", "/shun/"],
    morphRoles: ["prefix","root","suffix"],
  },

  // ── aud root ───────────────────────────────────────────────────────────────
  audience: {
    syllables: ["au","di","ence"],
    soundCues: ["/aw/", "/dee/", "/ents/"],
    morphemes: ["aud","ience"],
    morphCues: ["/awd/", "/ee-ents/"],
    morphRoles: ["root","suffix"],
  },
  audible: {
    syllables: ["au","di","ble"],
    soundCues: ["/aw/", "/dih/", "/buhl/"],
    morphemes: ["aud","ible"],
    morphCues: ["/awd/", "/ih-buhl/"],
    morphRoles: ["root","suffix"],
  },
  auditorium: {
    syllables: ["au","di","to","ri","um"],
    soundCues: ["/aw/", "/dih/", "/tor/", "/ee/", "/um/"],
    morphemes: ["audi","torium"],
    morphCues: ["/aw-dih/", "/tor-ee-um/"],
    morphRoles: ["root","suffix"],
  },
  auditory: {
    syllables: ["au","di","to","ry"],
    soundCues: ["/aw/", "/dih/", "/tor/", "/ee/"],
    morphemes: ["aud","itory"],
    morphCues: ["/awd/", "/ih-tor-ee/"],
    morphRoles: ["root","suffix"],
  },
  audition: {
    syllables: ["au","di","tion"],
    soundCues: ["/aw/", "/dih/", "/shun/"],
    morphemes: ["aud","ition"],
    morphCues: ["/awd/", "/ih-shun/"],
    morphRoles: ["root","suffix"],
  },
  inaudible: {
    syllables: ["in","au","di","ble"],
    soundCues: ["/in/", "/aw/", "/dih/", "/buhl/"],
    morphemes: ["in","aud","ible"],
    morphCues: ["/in/", "/awd/", "/ih-buhl/"],
    morphRoles: ["prefix","root","suffix"],
  },

  // ── spect / spec root ──────────────────────────────────────────────────────
  inspect: {
    syllables: ["in","spect"],
    soundCues: ["/in/", "/spekt/"],
    morphemes: ["in","spect"],
    morphCues: ["/in/", "/spekt/"],
    morphRoles: ["prefix","root"],
  },
  spectator: {
    syllables: ["spec","ta","tor"],
    soundCues: ["/spek/", "/tay/", "/ter/"],
    morphemes: ["spect","ator"],
    morphCues: ["/spekt/", "/ay-ter/"],
    morphRoles: ["root","suffix"],
  },
  perspective: {
    syllables: ["per","spec","tive"],
    soundCues: ["/per/", "/spek/", "/tiv/"],
    morphemes: ["per","spec","tive"],
    morphCues: ["/per/", "/spek/", "/tiv/"],
    morphRoles: ["prefix","root","suffix"],
  },
  speculate: {
    syllables: ["spec","u","late"],
    soundCues: ["/spek/", "/yuh/", "/layt/"],
    morphemes: ["spec","ulate"],
    morphCues: ["/spek/", "/yuh-layt/"],
    morphRoles: ["root","suffix"],
  },
  spectacle: {
    syllables: ["spec","ta","cle"],
    soundCues: ["/spek/", "/tuh/", "/kul/"],
    morphemes: ["spect","acle"],
    morphCues: ["/spekt/", "/uh-kul/"],
    morphRoles: ["root","suffix"],
  },
  inspector: {
    syllables: ["in","spec","tor"],
    soundCues: ["/in/", "/spek/", "/ter/"],
    morphemes: ["in","spect","or"],
    morphCues: ["/in/", "/spekt/", "/er/"],
    morphRoles: ["prefix","root","suffix"],
  },

  // ── fer root ───────────────────────────────────────────────────────────────
  transfer: {
    syllables: ["trans","fer"],
    soundCues: ["/tranz/", "/fer/"],
    morphemes: ["trans","fer"],
    morphCues: ["/tranz/", "/fer/"],
    morphRoles: ["prefix","root"],
  },
  prefer: {
    syllables: ["pre","fer"],
    soundCues: ["/prih/", "/fer/"],
    morphemes: ["pre","fer"],
    morphCues: ["/prih/", "/fer/"],
    morphRoles: ["prefix","root"],
  },
  refer: {
    syllables: ["re","fer"],
    soundCues: ["/rih/", "/fer/"],
    morphemes: ["re","fer"],
    morphCues: ["/rih/", "/fer/"],
    morphRoles: ["prefix","root"],
  },
  conference: {
    syllables: ["con","fer","ence"],
    soundCues: ["/kon/", "/fer/", "/ents/"],
    morphemes: ["con","fer","ence"],
    morphCues: ["/kon/", "/fer/", "/ents/"],
    morphRoles: ["prefix","root","suffix"],
  },
  interference: {
    syllables: ["in","ter","fer","ence"],
    soundCues: ["/in/", "/ter/", "/fer/", "/ents/"],
    morphemes: ["inter","fer","ence"],
    morphCues: ["/in-ter/", "/fer/", "/ents/"],
    morphRoles: ["prefix","root","suffix"],
  },

  // ── un- / dis- / re- / mis- prefix words ──────────────────────────────────
  rewrite: {
    syllables: ["re","write"],
    soundCues: ["/rih/", "/rite/"],
    morphemes: ["re","write"],
    morphCues: ["/rih/", "/rite/"],
    morphRoles: ["prefix","root"],
  },
  unclear: {
    syllables: ["un","clear"],
    soundCues: ["/un/", "/kleer/"],
    morphemes: ["un","clear"],
    morphCues: ["/un/", "/kleer/"],
    morphRoles: ["prefix","root"],
  },
  unfinished: {
    syllables: ["un","fin","ished"],
    soundCues: ["/un/", "/fin/", "/isht/"],
    morphemes: ["un","finished"],
    morphCues: ["/un/", "/fin-isht/"],
    morphRoles: ["prefix","root"],
  },
  disagree: {
    syllables: ["dis","a","gree"],
    soundCues: ["/dis/", "/uh/", "/gree/"],
    morphemes: ["dis","agree"],
    morphCues: ["/dis/", "/uh-gree/"],
    morphRoles: ["prefix","root"],
  },
  disconnect: {
    syllables: ["dis","con","nect"],
    soundCues: ["/dis/", "/kon/", "/nekt/"],
    morphemes: ["dis","connect"],
    morphCues: ["/dis/", "/kuh-nekt/"],
    morphRoles: ["prefix","root"],
  },
  submarine: {
    syllables: ["sub","ma","rine"],
    soundCues: ["/sub/", "/muh/", "/reen/"],
    morphemes: ["sub","marine"],
    morphCues: ["/sub/", "/muh-reen/"],
    morphRoles: ["prefix","root"],
  },
  subtract: {
    syllables: ["sub","tract"],
    soundCues: ["/sub/", "/trakt/"],
    morphemes: ["sub","tract"],
    morphCues: ["/sub/", "/trakt/"],
    morphRoles: ["prefix","root"],
  },
  interstate: {
    syllables: ["in","ter","state"],
    soundCues: ["/in/", "/ter/", "/stayt/"],
    morphemes: ["inter","state"],
    morphCues: ["/in-ter/", "/stayt/"],
    morphRoles: ["prefix","root"],
  },
  impossible: {
    syllables: ["im","pos","si","ble"],
    soundCues: ["/im/", "/pos/", "/sih/", "/buhl/"],
    morphemes: ["im","possible"],
    morphCues: ["/im/", "/pos-ih-buhl/"],
    morphRoles: ["prefix","root"],
  },
  incomplete: {
    syllables: ["in","com","plete"],
    soundCues: ["/in/", "/kum/", "/pleet/"],
    morphemes: ["in","complete"],
    morphCues: ["/in/", "/kum-pleet/"],
    morphRoles: ["prefix","root"],
  },
  misspell: {
    syllables: ["mis","spell"],
    soundCues: ["/mis/", "/spel/"],
    morphemes: ["mis","spell"],
    morphCues: ["/mis/", "/spel/"],
    morphRoles: ["prefix","root"],
  },
  misunderstand: {
    syllables: ["mis","un","der","stand"],
    soundCues: ["/mis/", "/un/", "/der/", "/stand/"],
    morphemes: ["mis","understand"],
    morphCues: ["/mis/", "/un-der-stand/"],
    morphRoles: ["prefix","root"],
  },
  misconduct: {
    syllables: ["mis","con","duct"],
    soundCues: ["/mis/", "/kon/", "/dukt/"],
    morphemes: ["mis","conduct"],
    morphCues: ["/mis/", "/kon-dukt/"],
    morphRoles: ["prefix","root"],
  },

  // ── Suffix words ───────────────────────────────────────────────────────────
  movement: {
    syllables: ["move","ment"],
    soundCues: ["/moov/", "/ment/"],
    morphemes: ["move","ment"],
    morphCues: ["/moov/", "/ment/"],
    morphRoles: ["root","suffix"],
  },
  agreement: {
    syllables: ["a","gree","ment"],
    soundCues: ["/uh/", "/gree/", "/ment/"],
    morphemes: ["agree","ment"],
    morphCues: ["/uh-gree/", "/ment/"],
    morphRoles: ["root","suffix"],
  },
  statement: {
    syllables: ["state","ment"],
    soundCues: ["/stayt/", "/ment/"],
    morphemes: ["state","ment"],
    morphCues: ["/stayt/", "/ment/"],
    morphRoles: ["root","suffix"],
  },
  kindness: {
    syllables: ["kind","ness"],
    soundCues: ["/kind/", "/ness/"],
    morphemes: ["kind","ness"],
    morphCues: ["/kind/", "/ness/"],
    morphRoles: ["root","suffix"],
  },
  darkness: {
    syllables: ["dark","ness"],
    soundCues: ["/dark/", "/ness/"],
    morphemes: ["dark","ness"],
    morphCues: ["/dark/", "/ness/"],
    morphRoles: ["root","suffix"],
  },
  awareness: {
    syllables: ["a","ware","ness"],
    soundCues: ["/uh/", "/wair/", "/ness/"],
    morphemes: ["aware","ness"],
    morphCues: ["/uh-wair/", "/ness/"],
    morphRoles: ["root","suffix"],
  },
  helpful: {
    syllables: ["help","ful"],
    soundCues: ["/help/", "/ful/"],
    morphemes: ["help","ful"],
    morphCues: ["/help/", "/ful/"],
    morphRoles: ["root","suffix"],
  },
  powerful: {
    syllables: ["pow","er","ful"],
    soundCues: ["/pow/", "/er/", "/ful/"],
    morphemes: ["power","ful"],
    morphCues: ["/pow-er/", "/ful/"],
    morphRoles: ["root","suffix"],
  },
  meaningful: {
    syllables: ["mean","ing","ful"],
    soundCues: ["/meen/", "/ing/", "/ful/"],
    morphemes: ["meaning","ful"],
    morphCues: ["/meen-ing/", "/ful/"],
    morphRoles: ["root","suffix"],
  },
  homeless: {
    syllables: ["home","less"],
    soundCues: ["/hohm/", "/les/"],
    morphemes: ["home","less"],
    morphCues: ["/hohm/", "/les/"],
    morphRoles: ["root","suffix"],
  },
  careless: {
    syllables: ["care","less"],
    soundCues: ["/kair/", "/les/"],
    morphemes: ["care","less"],
    morphCues: ["/kair/", "/les/"],
    morphRoles: ["root","suffix"],
  },
  powerless: {
    syllables: ["pow","er","less"],
    soundCues: ["/pow/", "/er/", "/les/"],
    morphemes: ["power","less"],
    morphCues: ["/pow-er/", "/les/"],
    morphRoles: ["root","suffix"],
  },
  readable: {
    syllables: ["read","a","ble"],
    soundCues: ["/reed/", "/uh/", "/buhl/"],
    morphemes: ["read","able"],
    morphCues: ["/reed/", "/uh-buhl/"],
    morphRoles: ["root","suffix"],
  },
  comfortable: {
    syllables: ["com","fort","a","ble"],
    soundCues: ["/kum/", "/fert/", "/uh/", "/buhl/"],
    morphemes: ["comfort","able"],
    morphCues: ["/kum-fert/", "/uh-buhl/"],
    morphRoles: ["root","suffix"],
  },
  remarkable: {
    syllables: ["re","mark","a","ble"],
    soundCues: ["/rih/", "/mark/", "/uh/", "/buhl/"],
    morphemes: ["re","mark","able"],
    morphCues: ["/rih/", "/mark/", "/uh-buhl/"],
    morphRoles: ["prefix","root","suffix"],
  },
  teacher: {
    syllables: ["teach","er"],
    soundCues: ["/teech/", "/er/"],
    morphemes: ["teach","er"],
    morphCues: ["/teech/", "/er/"],
    morphRoles: ["root","suffix"],
  },
  quickly: {
    syllables: ["quick","ly"],
    soundCues: ["/kwik/", "/lee/"],
    morphemes: ["quick","ly"],
    morphCues: ["/kwik/", "/lee/"],
    morphRoles: ["root","suffix"],
  },
  clearly: {
    syllables: ["clear","ly"],
    soundCues: ["/kleer/", "/lee/"],
    morphemes: ["clear","ly"],
    morphCues: ["/kleer/", "/lee/"],
    morphRoles: ["root","suffix"],
  },
  accurately: {
    syllables: ["ac","cu","rate","ly"],
    soundCues: ["/ak/", "/kyuh/", "/rit/", "/lee/"],
    morphemes: ["accurate","ly"],
    morphCues: ["/ak-kyuh-rit/", "/lee/"],
    morphRoles: ["root","suffix"],
  },
  scientist: {
    syllables: ["sci","en","tist"],
    soundCues: ["/sie/", "/en/", "/tist/"],
    morphemes: ["science","ist"],
    morphCues: ["/sie-ents/", "/ist/"],
    morphRoles: ["root","suffix"],
  },
  dangerous: {
    syllables: ["dan","ger","ous"],
    soundCues: ["/dayn/", "/jer/", "/us/"],
    morphemes: ["danger","ous"],
    morphCues: ["/dayn-jer/", "/us/"],
    morphRoles: ["root","suffix"],
  },
  famous: {
    syllables: ["fa","mous"],
    soundCues: ["/fay/", "/mus/"],
    morphemes: ["fame","ous"],
    morphCues: ["/faym/", "/us/"],
    morphRoles: ["root","suffix"],
  },
  courageous: {
    syllables: ["cou","ra","geous"],
    soundCues: ["/kuh/", "/ray/", "/jus/"],
    morphemes: ["courage","ous"],
    morphCues: ["/ker-ij/", "/us/"],
    morphRoles: ["root","suffix"],
  },

  // ── Other prefix words ─────────────────────────────────────────────────────
  nonfiction: {
    syllables: ["non","fic","tion"],
    soundCues: ["/non/", "/fik/", "/shun/"],
    morphemes: ["non","fiction"],
    morphCues: ["/non/", "/fik-shun/"],
    morphRoles: ["prefix","root"],
  },
  semifinal: {
    syllables: ["sem","i","fi","nal"],
    soundCues: ["/sem/", "/ee/", "/fie/", "/nul/"],
    morphemes: ["semi","final"],
    morphCues: ["/sem-ee/", "/fie-nul/"],
    morphRoles: ["prefix","root"],
  },
  multicultural: {
    syllables: ["mul","ti","cul","tur","al"],
    soundCues: ["/mul/", "/tih/", "/kul/", "/cher/", "/ul/"],
    morphemes: ["multi","cultural"],
    morphCues: ["/mul-tih/", "/kul-cher-ul/"],
    morphRoles: ["prefix","root"],
  },
  bilingual: {
    syllables: ["bi","lin","gual"],
    soundCues: ["/bie/", "/ling/", "/gwul/"],
    morphemes: ["bi","lingual"],
    morphCues: ["/bie/", "/ling-gwul/"],
    morphRoles: ["prefix","root"],
  },
  postwar: {
    syllables: ["post","war"],
    soundCues: ["/pohst/", "/wor/"],
    morphemes: ["post","war"],
    morphCues: ["/pohst/", "/wor/"],
    morphRoles: ["prefix","root"],
  },
  context: {
    syllables: ["con","text"],
    soundCues: ["/kon/", "/tekst/"],
    morphemes: ["con","text"],
    morphCues: ["/kon/", "/tekst/"],
    morphRoles: ["prefix","root"],
  },
};

export function getWordData(word: string): SyllableEntry | null {
  return WORD_DATA[word.toLowerCase()] ?? null;
}
