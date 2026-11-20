import type { CallToActionSection, FeatureGridSection, HeroSection, Page, SiteSettings } from "@/sanity/types";

type Feature = NonNullable<FeatureGridSection["items"]>[number];

const feature = (key: string, title: string, body: string, link?: { label: string; href: string }): Feature => ({
  _key: key,
  _type: "feature",
  title,
  body,
  ...(link ? { link: { _type: "link", ...link } } : {}),
});

const REPO = "https://github.com/marcop135/nextfold";

/** '„Innen“, 5 von 40 Zeichen', or only the count when the text would not fit on a card. */
function filled(value: string, max: number, required: boolean): string {
  const shown = value.length <= 60 ? `„${value}“, ` : "";
  return `${shown}${value.length} von ${max} Zeichen. ${required ? "Pflichtfeld." : "Optional."}`;
}

const insideHero: HeroSection = {
  _type: "hero",
  _key: "hero",
  eyebrow: "Von innen",
  heading: "Eine Seite, in ihre Teile zerlegt",
  body: "Auf jeden Abschnitt folgt, was die Redaktion dafür im Studio eingetragen hat. Beides stammt aus demselben Datensatz und stimmt deshalb immer überein.",
};

const insideGrid: FeatureGridSection = {
  _type: "featureGrid",
  _key: "limits",
  heading: "Was ein Kachelraster enthält",
  items: [
    feature("heading", "Eine Überschrift", "Pflichtfeld, höchstens 80 Zeichen."),
    feature("count", "Zwei bis sechs Kacheln", "Das Studio akzeptiert nicht weniger als zwei und nicht mehr als sechs Kacheln."),
    feature("fields", "Titel und Text pro Kachel", "Titel sind auf 60 Zeichen begrenzt, Texte auf 200."),
  ],
};

const insideCta: CallToActionSection = {
  _type: "callToAction",
  _key: "next",
  heading: "Woher diese Grenzen kommen",
  body: "Die Leitplanken zeigen, was das Studio prüft, bevor die Redaktion veröffentlichen kann.",
  link: { _type: "link", label: "Zu den Leitplanken", href: "/guardrails" },
};

/** German seed pages, shown until the Sanity dataset publishes a German page with the same slug. */
export const pages: Page[] = [
  {
    title: "Next Fold: Next.js und Sanity, von Anfang bis Ende betrieben",
    slug: "home",
    language: "de",
    description:
      "Next Fold ist eine Next.js- und Sanity-Website, betrieben wie ein Produkt: Schema, Studio, Caching, Sicherheit, Analytics und Releases, alles öffentlich.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Next.js + Sanity",
        heading: "Eine CMS-Website ist mehr als das CMS",
        body: "Next Fold ist eine Next.js- und Sanity-Website, die ich wie ein Produkt betreibe: Schema, Studio, Caching, Sicherheit, Analytics und Releases. Die Redaktion kann jede Seite ändern, und jeder Teil liegt in einem öffentlichen Repository.",
        link: { _type: "link", label: "So läuft der Betrieb", href: "/system" },
      },
      {
        _type: "featureGrid",
        _key: "ways-in",
        heading: "Wählen Sie Ihren Einstieg",
        items: [
          feature(
            "leads",
            "Sie leiten ein Team oder stellen ein",
            "Zwei Minuten Lesezeit: wie die Website gehostet, abgesichert, gemessen und veröffentlicht wird, mit einem Link zur Prüfung jedes Teils.",
            { label: "So läuft der Betrieb", href: "/system" },
          ),
          feature(
            "builders",
            "Sie entwickeln mit Sanity",
            "Eine Seite, Feld für Feld zerlegt, und die Regeln, die das Studio prüft, bevor etwas live geht.",
            { label: "Eine Seite von innen", href: "/inside-a-page" },
          ),
          feature(
            "agents",
            "KI-Assistenten und Agenten",
            "Jede Seite gibt es auch als reines Markdown, aufgelistet in llms.txt, ohne Login und ohne API-Schlüssel.",
            { label: "Für Agenten", href: "/for-agents" },
          ),
        ],
      },
      {
        _type: "featureGrid",
        _key: "try",
        heading: "Zum Ausprobieren",
        theme: "surface",
        items: [
          feature(
            "reorder",
            "Diese Seite umsortieren",
            "Verschieben Sie die Abschnitte im Studio-Fenster oben nach oben oder unten, und die Vorschau der Seite folgt.",
          ),
          feature(
            "break",
            "Eine Regel brechen",
            "Leeren Sie eine Überschrift oder fügen Sie eine lange Zeile ein, und die Prüfungen des Studios halten die Veröffentlichung auf.",
            { label: "Zum Playground", href: "/guardrails#playground" },
          ),
          feature(
            "cache",
            "Den Cache beobachten",
            "Wann die Caching-Seite in den Cache kam, was sie ablaufen lassen kann und was eine neue Anfrage zurückgibt.",
            { label: "Den Cache untersuchen", href: "/caching#inspector" },
          ),
          feature(
            "english",
            "Auf Englisch lesen",
            "Jede Seite gibt es auch auf Englisch, unter derselben Adresse ohne /de und mit eigener Markdown-Version.",
            { label: "Read it in English", href: "/en" },
          ),
        ],
      },
      {
        _type: "callToAction",
        _key: "releases",
        heading: "Verfolgen Sie, wie es wächst",
        body: "Jedes Release zeigt, was sich geändert hat, mit Pull Request und Issue hinter jeder Zeile. Die Release Notes sind auf Englisch.",
        link: { _type: "link", label: "Release-Verlauf (auf Englisch)", href: `${REPO}/releases` },
      },
    ],
  },
  {
    title: "Eine Seite von innen: jeder Abschnitt und seine Felder",
    slug: "inside-a-page",
    language: "de",
    description:
      "Jeder Abschnitt dieser Seite, gefolgt von den Feldern, die die Redaktion dafür ausgefüllt hat: ein Hero, ein Kachelraster und ein Call to Action.",
    sections: [
      insideHero,
      {
        _type: "steps",
        _key: "flow",
        heading: "Wie eine Seite entsteht",
        items: [
          {
            _key: "define",
            _type: "step",
            title: "Definieren",
            body: "Das Entwicklungsteam legt jede Art von Abschnitt einmal fest: einen Hero, ein Kachelraster, einen Call to Action.",
          },
          {
            _key: "compose",
            _type: "step",
            title: "Zusammenstellen",
            body: "Die Redaktion stapelt diese Abschnitte im Studio zu einer Seite und füllt die Texte aus.",
          },
          {
            _key: "check",
            _type: "step",
            title: "Prüfen",
            body: "Das Studio prüft vor dem Veröffentlichen jedes Feld, damit weder eine leere Überschrift noch ein kaputter Link live geht.",
          },
          {
            _key: "publish",
            _type: "step",
            title: "Veröffentlichen",
            body: "Ein Klick stellt die Seite live. Seiten, die schon im Browser offen sind, aktualisieren sich von selbst.",
          },
          {
            _key: "read",
            _type: "step",
            title: "Lesen",
            body: "Besucher bekommen die HTML-Seite, Agenten dieselben Worte als Markdown.",
          },
        ],
      },
      {
        _type: "featureGrid",
        _key: "hero-fields",
        heading: "Hinter dem Hero: was die Redaktion eingetragen hat",
        theme: "surface",
        items: [
          feature("eyebrow", "Dachzeile", filled(insideHero.eyebrow ?? "", 40, false)),
          feature("heading", "Überschrift", filled(insideHero.heading, 80, true)),
          feature("body", "Text", filled(insideHero.body ?? "", 240, false)),
        ],
      },
      insideGrid,
      {
        _type: "featureGrid",
        _key: "grid-fields",
        heading: "Hinter dem Raster: was die Redaktion eingetragen hat",
        theme: "surface",
        items: [
          feature("heading", "Überschrift", filled(insideGrid.heading, 80, true)),
          feature(
            "cards",
            "Kacheln",
            `${insideGrid.items?.length ?? 0} Kacheln mit je einem Titel und einem Text. Die Redaktion kann sie per Drag-and-drop neu ordnen.`,
          ),
        ],
      },
      {
        _type: "featureGrid",
        _key: "cta-fields",
        heading: "Hinter dem nächsten Abschnitt: was die Redaktion eingetragen hat",
        theme: "surface",
        items: [
          feature("heading", "Überschrift", filled(insideCta.heading, 80, true)),
          feature("body", "Text", filled(insideCta.body ?? "", 200, false)),
          feature("link", "Link", `„${insideCta.link.label}“ verweist auf ${insideCta.link.href}. Pflichtfeld.`),
        ],
      },
      insideCta,
    ],
  },
  {
    title: "Leitplanken: was das Schema von Next Fold prüft",
    slug: "guardrails",
    language: "de",
    description:
      "Die Regeln, die das Sanity Studio prüft, bevor eine Seite veröffentlicht werden kann: Pflichtfelder, Längengrenzen, erlaubte Abschnitte und Linkformate.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Leitplanken",
        heading: "Regeln, die jede Seite vor dem Veröffentlichen erfüllt",
        body: "Das Schema entscheidet, was die Redaktion veröffentlichen kann. Seine Grenzen sind auf das Design abgestimmt: Text, der ins Studio passt, passt auch auf die Seite.",
        link: { _type: "link", label: "Versuchen Sie, eine Regel zu brechen", href: "/guardrails#playground" },
      },
      {
        _type: "appBlock",
        _key: "playground",
        heading: "Versuchen Sie, eine Regel zu brechen",
        body: "Ein Hero mit denselben Regeln und Meldungen wie im Studio. Die Vorschau ändert sich erst, wenn alle Felder gültig sind und Sie veröffentlichen.",
        kind: "guardrailsPlayground",
        theme: "surface",
      },
      {
        _type: "featureGrid",
        _key: "rules",
        heading: "Was das Studio prüft",
        items: [
          feature("required", "Pflichtfelder", "Ein Abschnitt ohne Überschrift lässt sich nicht veröffentlichen."),
          feature(
            "length",
            "Längengrenzen",
            "Überschriften sind auf 80 Zeichen begrenzt. Seitenbeschreibungen für Suchmaschinen umfassen 70 bis 160 Zeichen.",
          ),
          feature(
            "allowed",
            "Erlaubte Abschnitte",
            "Eine Seite nimmt nur die Abschnittstypen an, die das Entwicklungsteam freigibt. Andere erscheinen gar nicht erst im Add-Menü.",
          ),
          feature(
            "links",
            "Linkformate",
            "Ein Link ist ein Pfad auf dieser Website oder eine https://-Adresse. Alles andere lehnt das Studio ab.",
          ),
        ],
      },
      {
        _type: "steps",
        _key: "fail",
        heading: "Wenn eine Regel verletzt ist",
        items: [
          {
            _key: "mark",
            _type: "step",
            title: "Das Studio markiert das Feld",
            body: "Das Feld wird rot, und die Meldung nennt die verletzte Regel.",
          },
          {
            _key: "block",
            _type: "step",
            title: "Die Veröffentlichung wartet",
            body: "Der Button „Veröffentlichen“ bleibt gesperrt, solange ein Feld eine Regel verletzt.",
          },
          {
            _key: "fix",
            _type: "step",
            title: "Die Korrektur geht live",
            body: "Sobald alle Felder gültig sind, wird die Seite veröffentlicht, und offene Seiten aktualisieren sich.",
          },
        ],
      },
      {
        _type: "callToAction",
        _key: "next",
        heading: "Das Schema ist eine Ebene",
        body: "Hosting, Caching, Sicherheit und Releases folgen eigenen Regeln.",
        link: { _type: "link", label: "So läuft der Betrieb", href: "/system" },
      },
    ],
  },
  {
    title: "Caching bei Next Fold: was im Cache liegt und was ihn leert",
    slug: "caching",
    language: "de",
    description:
      "Wie Next Fold jede Seite mit Next.js Cache Components und Sanity-Tags cacht und was diesen Cache leert, wenn die Redaktion veröffentlicht.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Caching",
        heading: "Im Cache, bis sich etwas ändert",
        body: "Jede Seite wird einmal gebaut und aus dem Cache ausgeliefert, bis sich ihr Inhalt ändert. Eine Veröffentlichung in Sanity lässt nur die Seiten ablaufen, die das geänderte Dokument verwenden.",
        link: { _type: "link", label: "Diese Seite untersuchen", href: "/caching#inspector" },
      },
      {
        _type: "appBlock",
        _key: "inspector",
        heading: "Diese Seite, genau jetzt",
        body: "Wann diese Kopie der Seite in den Cache kam, welche Tags sie ablaufen lassen können und mit welchen Headern eine neue Anfrage beantwortet wird.",
        kind: "cacheInspector",
        theme: "surface",
      },
      {
        _type: "steps",
        _key: "publish",
        heading: "Was passiert, wenn die Redaktion veröffentlicht",
        items: [
          {
            _key: "build",
            _type: "step",
            title: "Bauen",
            body: "Der Build rendert jede bekannte Seite und speichert sie mit Tags: eines für die Seite und eines für jedes Sanity-Dokument, das sie gelesen hat.",
          },
          {
            _key: "serve",
            _type: "step",
            title: "Ausliefern",
            body: "Besucher bekommen die gespeicherte Kopie. Das CDN von Vercel hält sie in der Nähe der Besucher, sodass der Server nichts zu tun hat.",
          },
          {
            _key: "publish",
            _type: "step",
            title: "Veröffentlichen",
            body: "Die Redaktion veröffentlicht im Studio, und die Live Content API von Sanity meldet der Website, welche Dokumente sich geändert haben.",
          },
          {
            _key: "expire",
            _type: "step",
            title: "Ablaufen lassen",
            body: "Die Website lässt die Tags dieser Dokumente ablaufen. Ein signierter Webhook tut dasselbe, wenn kein Browser die Website offen hat.",
          },
          {
            _key: "render",
            _type: "step",
            title: "Neu rendern",
            body: "Die nächste Anfrage rendert eine frische Kopie und speichert sie. Seiten, die das Dokument nicht verwenden, bleiben im Cache.",
          },
        ],
      },
      {
        _type: "featureGrid",
        _key: "layers",
        heading: "Woher eine Seite kommen kann",
        items: [
          feature(
            "sanity",
            "Das CDN von Sanity",
            "Abfragen nach veröffentlichten Inhalten gehen an das API-CDN von Sanity, daher ist auch ein frisches Rendern schnell.",
          ),
          feature(
            "next",
            "Der Next.js-Cache",
            "Jede Seite und jedes Abfrageergebnis liegt mit „use cache“ unter Tags. Die Tags bestimmen, was abläuft, daher leert eine Veröffentlichung nie die ganze Website.",
          ),
          feature(
            "vercel",
            "Das CDN von Vercel",
            "Fertige Seiten kommen vom Edge-Netzwerk. Der Header x-vercel-cache zeigt, ob eine Antwort ein Treffer war.",
          ),
        ],
      },
      {
        _type: "callToAction",
        _key: "next",
        heading: "Der Rest des Systems",
        body: "Hosting, DNS, Security-Header und der Release-Ablauf rund um diesen Cache.",
        link: { _type: "link", label: "So läuft der Betrieb", href: "/system" },
      },
    ],
  },
  {
    title: "So läuft Next Fold: Hosting, Sicherheit und Releases",
    slug: "system",
    language: "de",
    description:
      "Was Next Fold am Laufen hält, von DNS und Hosting über Security-Header, Analytics und CI bis zu Releases, mit einem Link zur Prüfung jedes Teils.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "So läuft der Betrieb",
        heading: "Alles rund um das CMS",
        body: "Diese Seite zeigt, was Next Fold am Laufen hält, von DNS bis zu den Release Notes, und wo Sie jeden Teil selbst prüfen können.",
      },
      {
        _type: "featureGrid",
        _key: "stack",
        heading: "Der Stack und wo er sich prüfen lässt",
        items: [
          feature(
            "content",
            "Inhalte: Sanity",
            "Die Redaktion arbeitet im Sanity Studio. Die Website liest veröffentlichte Inhalte über das CDN von Sanity, und offene Seiten aktualisieren sich beim Veröffentlichen.",
            { label: "Architektur (auf Englisch)", href: `${REPO}/blob/main/docs/architecture.md` },
          ),
          feature(
            "hosting",
            "Hosting: Vercel",
            "Der Produktions-Build entsteht aus dem main-Branch und wird mit der Vercel CLI deployt. Preview-Builds erscheinen nicht in Suchmaschinen.",
            { label: "Vercel-Setup (auf Englisch)", href: `${REPO}/blob/main/docs/vercel.md` },
          ),
          feature(
            "dns",
            "DNS: Cloudflare",
            "Nur DNS, ohne Proxy: Besucher erreichen Vercel direkt, und Cache und Firewall von Vercel sehen den echten Traffic.",
            { label: "Cloudflare-Setup (auf Englisch)", href: `${REPO}/blob/main/docs/cloudflare.md` },
          ),
          feature(
            "headers",
            "Security-Header",
            "Eine Content Security Policy, HSTS und eine strikte Referrer-Policy auf jeder Seite. Das Studio hat eigene Header.",
            { label: "Die Header im Code (auf Englisch)", href: `${REPO}/blob/main/next.config.ts` },
          ),
          feature(
            "analytics",
            "Analytics: Matomo",
            "Selbst gehostet und ohne Cookies, daher ohne Cookie-Banner. Seitenabrufe durch KI-Assistenten zählt der Server.",
            { label: "Datenschutzhinweis", href: "/privacy" },
          ),
          feature(
            "checks",
            "Prüfungen bei jeder Änderung",
            "Jeder Pull Request durchläuft Lint, Typprüfung, einen Abgleich der generierten Sanity-Typen und einen Produktions-Build.",
            { label: "CI-Workflow (auf Englisch)", href: `${REPO}/blob/main/.github/workflows/ci.yml` },
          ),
        ],
      },
      {
        _type: "steps",
        _key: "ship",
        heading: "Wie eine Änderung live geht",
        items: [
          { _key: "issue", _type: "step", title: "Issue", body: "Jede Änderung beginnt als GitHub-Issue." },
          {
            _key: "branch",
            _type: "step",
            title: "Branch und Pull Request",
            body: "Die Arbeit läuft auf einem Feature-Branch. In develop wird erst gemergt, wenn die CI grün ist.",
          },
          {
            _key: "changelog",
            _type: "step",
            title: "Changelog",
            body: "Der Pull Request bringt seine eigene Changelog-Zeile mit, geschrieben für die Menschen, die sie lesen.",
          },
          {
            _key: "release",
            _type: "step",
            title: "Release",
            body: "Ein Release-Branch ordnet den Changelog einer Versionsnummer zu, dann bringt ein Promotion-Pull-Request ihn nach main.",
          },
          {
            _key: "deploy",
            _type: "step",
            title: "Deploy und Tag",
            body: "Der Deploy in die Produktion läuft aus einem sauberen main-Checkout. Der Commit bekommt ein Versions-Tag und ein GitHub-Release mit denselben Notes.",
          },
        ],
      },
      {
        _type: "callToAction",
        _key: "source",
        heading: "Der Code ist öffentlich",
        body: "Schema, Komponenten, CI und Release Notes, unter MIT-Lizenz. Code und Dokumentation sind auf Englisch.",
        link: { _type: "link", label: "Quellcode auf GitHub", href: REPO },
      },
    ],
  },
];

/** German header and footer, shown until the Sanity dataset publishes the siteSettings-de document. */
export const settings: SiteSettings = {
  nav: [
    { _key: "inside", _type: "link", label: "Seite von innen", href: "/inside-a-page" },
    { _key: "guardrails", _type: "link", label: "Leitplanken", href: "/guardrails" },
    { _key: "caching", _type: "link", label: "Caching", href: "/caching" },
    { _key: "system", _type: "link", label: "Betrieb", href: "/system" },
  ],
  footerNote: "Next Fold Headless-CMS-Demo",
  projectLinks: [
    { _key: "docs", _type: "link", label: "Dokumentation (auf Englisch)", href: "https://github.com/marcop135/nextfold/tree/main/docs" },
    { _key: "license", _type: "link", label: "MIT-Lizenz", href: "https://github.com/marcop135/nextfold/blob/main/LICENSE" },
  ],
  siteInfoLinks: [
    { _key: "privacy", _type: "link", label: "Datenschutz", href: "/privacy" },
    { _key: "for-agents", _type: "link", label: "Für Agenten", href: "/for-agents" },
  ],
};
