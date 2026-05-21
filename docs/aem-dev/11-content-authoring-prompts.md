# Content Authoring Prompts — AEM JCR `.content.xml`

Prompts for generating AEM FileVault content (`_jcr_content/.content.xml`) for all
`dxp-ai-ue-eds` site pages. Content is sourced from the html-kit design reference files.

---

## Reference: XML Schema

Every page requires exactly **two files**:

```
aem-package/jcr_root/content/sites/dxp-ai-ue-eds/en/[PAGE]/
  .content.xml              ← page folder node (always identical)
  _jcr_content/
    .content.xml            ← page content (all blocks live here)
```

**Page folder node** (same for every page — never changes):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          jcr:primaryType="cq:Page"/>
```

**Page content node** (`_jcr_content/.content.xml`) skeleton:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          jcr:primaryType="cq:PageContent"
          jcr:title="[Page Title]"
          jcr:description="[SEO description]"
          sling:resourceType="core/franklin/components/page/v1/page"
          cq:conf="/conf/dxp-ai-ue-eds">
  <root jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/root/v1/root">

    <section_0 jcr:primaryType="nt:unstructured"
               sling:resourceType="core/franklin/components/section/v1/section">
      <BLOCK_NODE jcr:primaryType="nt:unstructured"
                  sling:resourceType="core/franklin/components/block/v1/block"
                  name="BLOCK DISPLAY NAME">
        <item_0 jcr:primaryType="nt:unstructured"
                sling:resourceType="core/franklin/components/block/v1/block/item"
                text="&lt;h2&gt;Section Heading&lt;/h2&gt;"/>
        <item_1 jcr:primaryType="nt:unstructured"
                sling:resourceType="core/franklin/components/block/v1/block/item"
                text="&lt;h3&gt;Card Title&lt;/h3&gt;&lt;p&gt;Card text.&lt;/p&gt;"/>
      </BLOCK_NODE>
    </section_0>

    <section_1 ...>...</section_1>

  </root>
</jcr:root>
```

---

## Reference: Block Node Name Map

| html-kit class | JCR node name | `name=""` attribute |
|---|---|---|
| `hero` | `hero` | `"Hero"` |
| `page-hero` | `page_hero` | `"Page Hero"` |
| `stats-band` | `stats_band` | `"Stats Band"` |
| `features` | `features` | `"Features"` |
| `carousel` | `carousel` | `"Carousel"` |
| `cms-compat` | `cms_compat` | `"Cms Compat"` |
| `who-uses` | `who_uses` | `"Who Uses"` |
| `cta` | `cta` | `"Cta"` |
| `articles` | `articles` | `"Articles"` |
| `richtext` | `richtext` | `"Richtext"` |
| `accordion` | `accordion` | `"Accordion"` |
| `pricing` | `pricing` | `"Pricing"` |
| `team` | `team` | `"Team"` |
| `timeline` | `timeline` | `"Timeline"` |
| `breadcrumb` | `breadcrumb` | `"Breadcrumb"` |
| `cards` | `cards` | `"Cards"` |
| `section-light` | `section_light` | `"Section Light"` |
| `section-dark` | `section_dark` | `"Section Dark"` |

---

## Reference: Content Rules

**Item structure per block type:**

| Block | item_0 | item_1+ |
|---|---|---|
| `features`, `carousel`, `who-uses`, `team`, `timeline`, `accordion`, `articles`, `stats-band` | `<h2>Section heading only</h2>` | One item per card/stat/entry |
| `pricing` | first plan (no heading row) | each subsequent plan |
| `hero`, `page-hero`, `cta`, `richtext`, `cms-compat` | All content in one item_0 | — |

**HTML tags inside `text="..."`:**
- Page title → `<h1>`, section heading → `<h2>`, card/item title → `<h3>`
- Body copy → `<p>`, lists → `<ul><li>`, bold → `<strong>`, italic → `<em>`
- Links → `<a href="/content/sites/dxp-ai-ue-eds/en/PAGE">Label</a>`
- Breadcrumb separator → `&amp;rsaquo;` (renders as ›)

**HTML escaping** (mandatory — the `text=""` value is an XML attribute):
```
<  →  &lt;      >  →  &gt;      "  →  &quot;      &  →  &amp;
HTML entity in text: &mdash; → &amp;mdash;   &rsaquo; → &amp;rsaquo;
                     &times; → &amp;times;   &apos;  → &amp;apos;
                     &bull;  → &amp;bull;    &amp;   → &amp;amp;
```

**Internal link base:** `/content/sites/dxp-ai-ue-eds/en/`
Known pages: `index` `about` `platform` `pricing` `solutions` `why-dxp`
             `ai-capabilities` `integrations` `security` `resources`
             `blog` `case-studies` `contact` `documentation`

---

## P-14 — Author Content for One Page

**Use when:** Creating or updating `.content.xml` for a single page.

```
Author AEM JCR content for the [PAGE_NAME] page.

READ FIRST (content source):
  [html-kit/dxp-ai/index.html  OR  html-kit/dxp-ai/pages/[PAGE_NAME].html]
  Extract all headings, body text, stats, list items, button labels, and links.
  Ignore navigation, header, footer, and purely decorative elements.

ALSO READ (for exact XML format reference):
  aem-package/jcr_root/content/sites/dxp-ai-ue-eds/en/about/_jcr_content/.content.xml

OUTPUT — write these two files:

1. aem-package/jcr_root/content/sites/dxp-ai-ue-eds/en/[PAGE_NAME]/.content.xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          jcr:primaryType="cq:Page"/>

2. aem-package/jcr_root/content/sites/dxp-ai-ue-eds/en/[PAGE_NAME]/_jcr_content/.content.xml
  Use the schema below. One <section_N> per visible content section.
  jcr:title = page title from html-kit <h1> or <title>
  jcr:description = first paragraph or meta description text

SCHEMA:
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          jcr:primaryType="cq:PageContent"
          jcr:title=""
          jcr:description=""
          sling:resourceType="core/franklin/components/page/v1/page"
          cq:conf="/conf/dxp-ai-ue-eds">
  <root jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/root/v1/root">
    <!-- sections here -->
  </root>
</jcr:root>

BLOCK MAP (html class → node name → display name):
  hero→hero→"Hero"  page-hero→page_hero→"Page Hero"
  stats-band→stats_band→"Stats Band"  features→features→"Features"
  carousel→carousel→"Carousel"  cms-compat→cms_compat→"Cms Compat"
  who-uses→who_uses→"Who Uses"  cta→cta→"Cta"
  articles→articles→"Articles"  richtext→richtext→"Richtext"
  accordion→accordion→"Accordion"  pricing→pricing→"Pricing"
  team→team→"Team"  timeline→timeline→"Timeline"

ITEM RULES:
  Multi-item blocks (features/carousel/team/timeline/accordion/articles/who-uses/stats-band):
    item_0 = <h2>Section heading only</h2>
    item_1, item_2, ... = one item per card/entry with <h3>title</h3><p>body</p>
  Single-item blocks (hero/page-hero/cta/richtext/cms-compat):
    item_0 = all content in one text attribute

HTML ESCAPING in text="..." attribute:
  < → &lt;   > → &gt;   " → &quot;   & → &amp;
  HTML entities must be double-escaped: &mdash; → &amp;mdash;  &rsaquo; → &amp;rsaquo;

LINKS: href="/content/sites/dxp-ai-ue-eds/en/[page-name]"

Do not skip any content section. Map every block in the html-kit to a section_N.
Write both files now.
```

---

## P-15 — Author Content for ALL Pages (Batch)

**Use when:** Creating or refreshing `.content.xml` for all site pages in one session.
Work through pages one at a time; read each html-kit file before writing.

```
Author AEM JCR content for all pages in the dxp-ai-ue-eds site.
Write TWO files per page: [PAGE]/.content.xml and [PAGE]/_jcr_content/.content.xml

PAGES — process in this order (html-kit source → output path):
  html-kit/dxp-ai/index.html              → en/index
  html-kit/dxp-ai/pages/platform.html     → en/platform
  html-kit/dxp-ai/pages/solutions.html    → en/solutions
  html-kit/dxp-ai/pages/pricing.html      → en/pricing
  html-kit/dxp-ai/pages/why-dxp.html      → en/why-dxp
  html-kit/dxp-ai/pages/ai-capabilities.html → en/ai-capabilities
  html-kit/dxp-ai/pages/integrations.html → en/integrations
  html-kit/dxp-ai/pages/security.html     → en/security
  html-kit/dxp-ai/pages/resources.html    → en/resources
  html-kit/dxp-ai/pages/blog.html         → en/blog
  html-kit/dxp-ai/pages/case-studies.html → en/case-studies
  html-kit/dxp-ai/pages/contact.html      → en/contact
  html-kit/dxp-ai/pages/documentation.html → en/documentation
  html-kit/dxp-ai/pages/about.html        → en/about

ALL OUTPUT PATHS under: aem-package/jcr_root/content/sites/dxp-ai-ue-eds/en/

PAGE FOLDER (.content.xml) — identical for every page:
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          jcr:primaryType="cq:Page"/>

PAGE CONTENT (_jcr_content/.content.xml) — template:
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          jcr:primaryType="cq:PageContent"
          jcr:title=""
          jcr:description=""
          sling:resourceType="core/franklin/components/page/v1/page"
          cq:conf="/conf/dxp-ai-ue-eds">
  <root jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/root/v1/root">
  </root>
</jcr:root>

BLOCK MAP (html class → JCR node → name attr):
  hero→hero→"Hero"                    page-hero→page_hero→"Page Hero"
  stats-band→stats_band→"Stats Band"  features→features→"Features"
  carousel→carousel→"Carousel"        cms-compat→cms_compat→"Cms Compat"
  who-uses→who_uses→"Who Uses"        cta→cta→"Cta"
  articles→articles→"Articles"        richtext→richtext→"Richtext"
  accordion→accordion→"Accordion"     pricing→pricing→"Pricing"
  team→team→"Team"                    timeline→timeline→"Timeline"
  cards→cards→"Cards"                 breadcrumb→breadcrumb→"Breadcrumb"

ITEM RULES:
  Multi-item blocks (features/carousel/team/timeline/accordion/articles/who-uses/stats-band/cards):
    item_0 = section heading: text="&lt;h2&gt;...&lt;/h2&gt;"
    item_1+ = one child per card/entry: text="&lt;h3&gt;title&lt;/h3&gt;&lt;p&gt;body&lt;/p&gt;"
  Single-item blocks (hero/page-hero/cta/richtext/cms-compat):
    item_0 only — pack all content (h1/h2, p, links) into one text attribute

HTML ESCAPING inside text="" (XML attribute):
  <→&lt;  >→&gt;  "→&quot;  &→&amp;
  Double-escape HTML entities: &mdash;→&amp;mdash;  &rsaquo;→&amp;rsaquo;
                                &times;→&amp;times;  &bull;→&amp;bull;

LINKS: /content/sites/dxp-ai-ue-eds/en/[page]
  Pages: index about platform pricing solutions why-dxp ai-capabilities
         integrations security resources blog case-studies contact documentation

FOR EACH PAGE:
  1. Read the html-kit file
  2. Identify each content section and its block type
  3. Write [PAGE]/.content.xml (the short folder node)
  4. Write [PAGE]/_jcr_content/.content.xml (full page content)
  5. Move to next page

Skip existing files ONLY if user says --skip-existing. Otherwise overwrite with fresh content.
Work through all 14 pages. Confirm each file written before moving to the next.
```

---

## P-16 — Update Single Block Content on Existing Page

**Use when:** Only one block on an existing page needs its content updated.

```
Update the [BLOCK_NAME] block content on the [PAGE_NAME] page.

READ CURRENT FILE:
  aem-package/jcr_root/content/sites/dxp-ai-ue-eds/en/[PAGE_NAME]/_jcr_content/.content.xml

READ NEW CONTENT SOURCE:
  html-kit/dxp-ai/[pages/][PAGE_NAME].html
  Find the section with class "[HTML_KIT_BLOCK_CLASS]" — extract updated text.

UPDATE: Replace the <[block_node]> element and all its <item_N> children with
  fresh content from the html-kit. Keep all other sections unchanged.

WRITE the updated file back to the same path.

HTML ESCAPING: < → &lt;   > → &gt;   " → &quot;   & → &amp;
Double-escape HTML entities: &mdash; → &amp;mdash;  &rsaquo; → &amp;rsaquo;
```

---

## Quick Escaping Cheat Sheet

When writing `text="..."` XML attribute values, ALL HTML must be escaped:

| Raw HTML | In XML attribute |
|---|---|
| `<h2>Title</h2>` | `&lt;h2&gt;Title&lt;/h2&gt;` |
| `<a href="/path">Link</a>` | `&lt;a href=&quot;/path&quot;&gt;Link&lt;/a&gt;` |
| `Don't` | `Don&amp;apos;t` |
| `AI — first` | `AI &amp;mdash; first` |
| `4.2×` | `4.2&amp;times;` |
| `Home › Page` | `Home &amp;rsaquo; Page` |
| `&bull; item` | `&amp;bull; item` |

**Test:** If your XML contains a raw `<` or `"` inside `text="..."` the file is malformed and AEM will reject it.

---

## Page → html-kit File Map

| JCR page path | html-kit source |
|---|---|
| `en/index` | `html-kit/dxp-ai/index.html` |
| `en/about` | `html-kit/dxp-ai/pages/about.html` |
| `en/platform` | `html-kit/dxp-ai/pages/platform.html` |
| `en/pricing` | `html-kit/dxp-ai/pages/pricing.html` |
| `en/solutions` | `html-kit/dxp-ai/pages/solutions.html` |
| `en/why-dxp` | `html-kit/dxp-ai/pages/why-dxp.html` |
| `en/ai-capabilities` | `html-kit/dxp-ai/pages/ai-capabilities.html` |
| `en/integrations` | `html-kit/dxp-ai/pages/integrations.html` |
| `en/security` | `html-kit/dxp-ai/pages/security.html` |
| `en/resources` | `html-kit/dxp-ai/pages/resources.html` |
| `en/blog` | `html-kit/dxp-ai/pages/blog.html` |
| `en/case-studies` | `html-kit/dxp-ai/pages/case-studies.html` |
| `en/contact` | `html-kit/dxp-ai/pages/contact.html` |
| `en/documentation` | `html-kit/dxp-ai/pages/documentation.html` |
