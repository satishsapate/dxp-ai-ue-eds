# EDS Content Query API & Sitemap

## Content Query Index

EDS maintains a query index at `/query-index.json` that aggregates all published pages. This is used by listing blocks like `articles` to fetch and display page lists dynamically.

### Configuration (`helix-query.yaml`)

```yaml
version: 1
indices:
  pages:
    include:
      - /
    exclude:
      - '**.json'
    target: /query-index.json
    properties:
      lastModified:
        select: none
        value: >-
          {{#formatDate}}{{date}}{{/formatDate}}
      robots:
        select: head > meta[name="robots"]
        value: attr{content}
```

### Query Index Response Format

`GET https://{eds-domain}/query-index.json`

```json
{
  "total": 42,
  "offset": 0,
  "limit": 256,
  "data": [
    {
      "path": "/blog/article-1",
      "title": "Article Title",
      "description": "Article description",
      "image": "/path/to/image.jpg",
      "lastModified": "2024-01-15",
      "robots": "index, follow"
    }
  ],
  ":type": "sheet"
}
```

### Fetching Query Index in Blocks

```javascript
// Standard pattern for fetching the query index
async function fetchIndex(indexPath = '/query-index.json') {
  const response = await fetch(indexPath);
  if (!response.ok) return { data: [] };
  const json = await response.json();
  return json;
}

// Usage in articles block
export default async function decorate(block) {
  const { data } = await fetchIndex();
  
  // Filter articles by current section
  const articles = data.filter((item) => item.path.startsWith('/blog/'));
  
  // Sort by lastModified descending
  articles.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  
  // Render articles
  articles.forEach((article) => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <a href="${article.path}">
        <img src="${article.image}" alt="${article.title}">
        <h3>${article.title}</h3>
        <p>${article.description}</p>
      </a>
    `;
    block.append(card);
  });
}
```

### Pagination Support

The query index supports pagination via URL parameters:

```javascript
// Fetch page 2 (limit 10 items)
const response = await fetch('/query-index.json?limit=10&offset=10');
```

---

## Sitemap Generation

The sitemap is automatically generated from the query index.

### Configuration (`helix-sitemap.yaml`)

```yaml
sitemaps:
  sitemap:
    origin: https://your-domain.com
    source: /query-index.json
    destination: /sitemap.xml
    lastmod: YYYY-MM-DD
    changefreq: weekly
    priority: 0.5
```

### Sitemap Output

`GET https://{eds-domain}/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2024-01-15</lastmod>
  </url>
  <url>
    <loc>https://your-domain.com/blog/article-1</loc>
    <lastmod>2024-01-14</lastmod>
  </url>
</urlset>
```

---

## EDS API Endpoints

| Endpoint | Description |
|---|---|
| `/.rum/` | Real User Monitoring collection endpoint |
| `/query-index.json` | Page index for listing blocks |
| `/sitemap.xml` | Generated XML sitemap |
| `/{path}.plain.html` | Raw HTML content without header/footer |
| `/{path}.json` | Page content as JSON (for API consumers) |

### Using `.plain.html` for Fragments

The `fragment` block fetches fragment pages using `.plain.html`:

```javascript
// Fragment block pattern
async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const response = await fetch(`${path}.plain.html`);
    if (response.ok) {
      const main = document.createElement('main');
      main.innerHTML = await response.text();
      // Decorate the loaded content
      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}
```

---

## Content Metadata in Pages

Pages can define metadata using a Metadata section (table at the bottom of page content):

| Property | Value |
|---|---|
| Title | Page SEO title |
| Description | Meta description |
| Image | OG image path |
| Robots | `index, follow` |
| Keywords | comma, separated, keywords |

These map to `<meta>` tags injected into `<head>` by EDS.

---

## Performance Considerations for API Calls

1. **Cache query index results** in `window.hlx` to avoid duplicate fetches
2. **Use `async/await`** in decorate functions (they can return a Promise)
3. **Show loading skeleton** while fetching to avoid layout shift
4. **Handle fetch failures gracefully** - check `response.ok` before parsing JSON
5. **Limit fetch scope** - use `?limit=` parameter for large indexes

```javascript
// Caching pattern
window.hlx = window.hlx || {};
window.hlx.queryIndex = window.hlx.queryIndex || fetch('/query-index.json').then((r) => r.json());

export default async function decorate(block) {
  const { data } = await window.hlx.queryIndex;
  // Use cached data
}
```
