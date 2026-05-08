# DXP AI — ZensAI Brand Website
## Powered by ZensAI · A Zensar Technologies Product

A complete 15-page HTML/CSS/SCSS brand website for DXP AI.

## Project Structure

```
/
├── index.html                    # Homepage
├── assets/
│   ├── css/
│   │   ├── main.css              # Compiled CSS (all styles)
│   │   ├── _variables.scss       # Brand design tokens
│   │   └── _base.scss            # Base styles & utilities
│   └── images/
│       └── dxp-ai-logo.png       # Brand logo
├── components/
│   ├── header/                   # header.html + header.scss
│   ├── footer/                   # footer.html + footer.scss
│   ├── hero/                     # hero.html + hero.scss
│   ├── cards/                    # cards.scss
│   ├── carousel/                 # carousel.html + carousel.scss
│   ├── articles/                 # articles.scss
│   └── richtext/                 # richtext.scss
└── pages/
    ├── platform.html             # Platform Overview
    ├── ai-capabilities.html      # AI Capabilities (ZensAI)
    ├── solutions.html            # Solutions (Marketing, IT, Enterprise)
    ├── why-dxp.html              # Why DXP AI / DXP vs CMS
    ├── integrations.html         # Integrations Hub
    ├── security.html             # Security & Compliance
    ├── pricing.html              # Pricing Plans
    ├── about.html                # About / Company
    ├── blog.html                 # Blog & Articles listing
    ├── case-studies.html         # Customer Case Studies
    ├── documentation.html        # Developer Documentation
    ├── resources.html            # Resource Center
    ├── contact.html              # Contact & Demo Request
    └── article-detail.html       # Article detail / Rich text template
```

## Brand Colors (from logo)
- Deep Navy: #0D0E2A
- Royal Blue: #1E3A8A
- Vivid Blue: #2563EB
- Purple: #7C3AED
- Violet: #9333EA
- Magenta: #A855F7
- Cyan: #06B6D4
- Sky: #38BDF8

## Typography
- Display/Headings: Sora (Google Fonts)
- Body: DM Sans (Google Fonts)
- Code: JetBrains Mono (Google Fonts)

## Usage
Open `index.html` in any browser. All pages are self-contained HTML with
styles loaded from `assets/css/main.css` and fonts from Google Fonts (requires internet).

For production, compile the SCSS source files in `assets/css/` using:
`sass assets/css/_base.scss assets/css/main.css`
