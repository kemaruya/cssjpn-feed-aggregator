const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");

const FEEDS_FILE = path.join(__dirname, "..", "feeds.yml");
const OUTPUT_FILE = path.join(__dirname, "..", "public", "data", "feeds.json");
const MAX_ITEMS_PER_FEED = 10;

// Simple YAML parser (handles our specific structure only)
function parseSimpleYaml(text) {
  const categories = [];
  let currentCategory = null;
  let currentFeed = null;

  for (const line of text.split("\n")) {
    const trimmed = line.trimEnd();
    if (trimmed.startsWith("  - name:") && !trimmed.startsWith("      - name:")) {
      // Category level
      currentCategory = { name: extractValue(trimmed), id: "", feeds: [] };
      categories.push(currentCategory);
    } else if (trimmed.startsWith("    id:") && currentCategory) {
      currentCategory.id = extractValue(trimmed);
    } else if (trimmed.startsWith("      - name:")) {
      // Feed level
      currentFeed = { name: extractValue(trimmed), url: "", site: "" };
      if (currentCategory) currentCategory.feeds.push(currentFeed);
    } else if (trimmed.startsWith("        url:") && currentFeed) {
      currentFeed.url = extractValue(trimmed);
    } else if (trimmed.startsWith("        site:") && currentFeed) {
      currentFeed.site = extractValue(trimmed);
    }
  }
  return categories;
}

function extractValue(line) {
  const match = line.match(/:\s*"?([^"]*)"?\s*$/);
  return match ? match[1].trim() : "";
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function parseAtom(xml, feedMeta) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);

  let entries = [];
  if (doc.feed && doc.feed.entry) {
    entries = Array.isArray(doc.feed.entry) ? doc.feed.entry : [doc.feed.entry];
  } else if (doc.rss && doc.rss.channel && doc.rss.channel.item) {
    entries = Array.isArray(doc.rss.channel.item) ? doc.rss.channel.item : [doc.rss.channel.item];
  }

  return entries.slice(0, MAX_ITEMS_PER_FEED).map((entry) => {
    // Atom format
    if (entry.title && (entry.updated || entry.published)) {
      const link = typeof entry.link === "object"
        ? (entry.link["@_href"] || (Array.isArray(entry.link) ? entry.link[0]["@_href"] : ""))
        : entry.link || "";
      return {
        title: typeof entry.title === "object" ? entry.title["#text"] || "" : entry.title,
        url: link,
        date: entry.published || entry.updated || "",
        summary: truncate(stripHtml(entry.summary || entry.content || ""), 200),
        blog: feedMeta.name,
        blogUrl: feedMeta.site,
        category: feedMeta.categoryId,
      };
    }
    // RSS format
    return {
      title: entry.title || "",
      url: entry.link || entry.guid || "",
      date: entry.pubDate || "",
      summary: truncate(stripHtml(entry.description || ""), 200),
      blog: feedMeta.name,
      blogUrl: feedMeta.site,
      category: feedMeta.categoryId,
    };
  });
}

function stripHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + "..." : str;
}

async function main() {
  const yamlText = fs.readFileSync(FEEDS_FILE, "utf-8");
  const categories = parseSimpleYaml(yamlText);

  const allItems = [];
  const feedStatus = [];

  for (const cat of categories) {
    for (const feed of cat.feeds) {
      const meta = { name: feed.name, site: feed.site, categoryId: cat.id };
      try {
        console.log(`Fetching: ${feed.name} ...`);
        const xml = await fetchWithTimeout(feed.url);
        const items = parseAtom(xml, meta);
        allItems.push(...items);
        feedStatus.push({ name: feed.name, status: "ok", count: items.length });
        console.log(`  -> ${items.length} items`);
      } catch (err) {
        console.error(`  -> FAILED: ${err.message}`);
        feedStatus.push({ name: feed.name, status: "error", error: err.message });
      }
    }
  }

  // Sort by date descending
  allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

  const output = {
    generatedAt: new Date().toISOString(),
    totalItems: allItems.length,
    categories: categories.map((c) => ({ id: c.id, name: c.name })),
    feedStatus,
    items: allItems,
  };

  const outDir = path.dirname(OUTPUT_FILE);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\nDone! ${allItems.length} items written to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
