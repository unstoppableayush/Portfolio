import { createClient } from "@supabase/supabase-js";

const DEFAULT_TOPIC = "latest trends in AI agents";
const WORDS_PER_MINUTE = 200;

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function estimateReadTime(text) {
  if (!text) return null;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function buildExcerpt(text, maxLength = 160) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function extractJson(text) {
  if (!text) return null;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const slice = text.slice(start, end + 1);
  return JSON.parse(slice);
}

async function generateViaGemini({ topic, model, apiKey }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Write a blog post about: ${topic}. Return ONLY JSON with keys: title, contentHtml, excerpt, tags, coverUrl, url. Keep contentHtml as HTML (paragraphs and headings). Title should of one line.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini error: ${errorText}`);
  }

  const data = await response.json();
  const raw =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("\n") || "";
  const parsed = extractJson(raw);
  if (!parsed) {
    throw new Error("Gemini response did not contain valid JSON.");
  }

  return {
    title: parsed.title,
    contentHtml: parsed.contentHtml,
    excerpt: parsed.excerpt,
    tags: parsed.tags,
    coverUrl: parsed.coverUrl,
    // url: parsed.url, // Optional: If you want to include a URL in the future, ensure your Gemini prompt and response include it.
  };
}

function readBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }
  return body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.authorization || "";
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const body = readBody(req.body);
  const topic = body.topic || DEFAULT_TOPIC;

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "Missing Supabase server credentials." });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY." });
    }

    const generated = await generateViaGemini({
      topic,
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      apiKey: geminiKey,
    });

    const contentHtml = generated.contentHtml || "";
    const plainText = stripHtml(contentHtml);
    const excerpt = generated.excerpt || buildExcerpt(plainText);
    const title = generated.title || "Untitled";
    const slug = slugify(title) || `post-${Date.now()}`;
    const tags = normalizeTags(generated.tags);
    const readTime = estimateReadTime(plainText);

    const payload = {
      title,
      slug,
      excerpt,
      content: contentHtml,
      tags,
      read_time: readTime,
      url: generated.url || "",
      cover_url: generated.coverUrl || "",
      published_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blogs")
      .insert(payload)
      .select("id,slug")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to post blog." });
  }
}
