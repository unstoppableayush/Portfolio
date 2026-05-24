import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WORDS_PER_MINUTE = 200;
const COVER_BUCKET = "blog-thumbs";
const RECENT_TITLES_LIMIT = 10;

// Default model for text generation (must support google_search grounding)
const DEFAULT_TEXT_MODEL = "gemini-2.0-flash";

// Model for image generation
const DEFAULT_IMAGE_MODEL = "gemini-2.0-flash-preview-image-generation";

const AI_AUTHOR_NAME = "AI";

// ---------------------------------------------------------------------------
// Utility helpers (preserved from original)
// ---------------------------------------------------------------------------

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

  // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
  let cleaned = text.replace(/```(?:json)?\s*\n?/gi, "").trim();

  // 2. Try the simple first-{ to last-} slice
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      // fall through to brace-matching
    }
  }

  // 3. Brace-matching: walk from the first { and find its balanced closing }
  if (start !== -1) {
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = start; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(cleaned.slice(start, i + 1));
          } catch {
            break;
          }
        }
      }
    }
  }

  return null;
}

function readBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

// ---------------------------------------------------------------------------
// Step 1 — Discover a trending AI topic via Gemini + Google Search grounding
// ---------------------------------------------------------------------------

async function discoverTrendingTopic({ apiKey, model }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Today is ${today}. Search for the most interesting and trending AI or artificial intelligence news story from today or the past 24 hours. Pick ONE specific, concrete topic (not generic). Return ONLY the topic as a short phrase of 5-15 words. No explanation, no quotes, no punctuation at the end.`,
            },
          ],
        },
      ],
      tools: [{ google_search: {} }],
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 60,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Trending topic discovery failed:", errText);
    return null;
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const topic = parts
    .filter((p) => p.text)
    .map((p) => p.text.trim())
    .join(" ")
    .trim();

  if (!topic || topic.length < 5) return null;
  return topic;
}

// ---------------------------------------------------------------------------
// Step 2 — Fetch recent blog titles from Supabase for deduplication
// ---------------------------------------------------------------------------

async function getRecentBlogTitles(supabase, limit = RECENT_TITLES_LIMIT) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("title, slug")
      .order("published_at", { ascending: false, nullsLast: true })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row) => ({ title: row.title, slug: row.slug }));
  } catch (err) {
    console.error("Failed to fetch recent titles:", err.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Step 3 — Generate blog content via Gemini (improved prompt)
// ---------------------------------------------------------------------------

async function generateBlogContent({ topic, recentTitles, model, apiKey }) {
  const avoidSection =
    recentTitles.length > 0
      ? `\n\nIMPORTANT — Do NOT repeat or closely resemble any of these recent blog titles:\n${recentTitles.map((t) => `- "${t}"`).join("\n")}\n`
      : "";

  const prompt = `You are a professional tech journalist and blogger with deep expertise in AI.
Write an original, in-depth, and engaging blog post about: "${topic}".

Requirements:
- Craft a creative, attention-grabbing title (NOT the topic verbatim, make it unique)
- Write 800–1200 words of insightful, well-researched content
- Include real-world implications, examples, or use-cases where relevant
- Use proper semantic HTML: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>
- Write a compelling excerpt (max 160 characters) that hooks the reader
- Suggest 3–5 relevant, specific tags (e.g. "LLM", "Computer Vision", not just "AI")
- Write a short image prompt (10-20 words) describing an ideal abstract cover image for this post (tech-themed, no text)
${avoidSection}
Return ONLY valid JSON (no markdown fences, no extra text) with these exact keys:
{
  "title": "...",
  "contentHtml": "...",
  "excerpt": "...",
  "tags": ["...", "..."],
  "imagePrompt": "..."
}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const MAX_RETRIES = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const raw =
        data?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text)
          .join("\n") || "";
      const parsed = extractJson(raw);

      if (!parsed) {
        console.error(
          `Attempt ${attempt}/${MAX_RETRIES}: Failed to parse JSON from Gemini response. Raw output (first 500 chars):`,
          raw.slice(0, 500)
        );
        throw new Error("Gemini response did not contain valid JSON.");
      }

      return {
        title: parsed.title,
        contentHtml: parsed.contentHtml,
        excerpt: parsed.excerpt,
        tags: parsed.tags,
        imagePrompt: parsed.imagePrompt || "",
      };
    } catch (err) {
      lastError = err;
      console.error(`Attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);
      if (attempt < MAX_RETRIES) {
        // Exponential backoff: 1s, 2s
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw new Error(
    `Blog content generation failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Generate a cover image via Gemini Imagen
// ---------------------------------------------------------------------------

async function generateCoverImage({ imagePrompt, title, apiKey }) {
  const prompt =
    imagePrompt ||
    `Abstract, futuristic tech blog cover for: ${title}. Vibrant gradients, geometric shapes, no text.`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_IMAGE_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a visually stunning blog cover image: ${prompt}. Style: modern, clean, abstract, tech-themed. Aspect ratio: landscape 16:9. No text or words in the image.`,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Image generation failed:", errText);
    return null;
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart) {
    console.error("No inline image data returned by Gemini.");
    return null;
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || "image/png",
  };
}

// ---------------------------------------------------------------------------
// Step 5 — Upload cover image to Supabase Storage
// ---------------------------------------------------------------------------

async function uploadCoverToStorage(supabase, imageData, slug) {
  try {
    const ext = imageData.mimeType.includes("png") ? "png" : "jpg";
    const filePath = `covers/${slug}-${Date.now()}.${ext}`;

    // Decode base64 → Buffer
    const buffer = Buffer.from(imageData.base64, "base64");

    const { error: uploadError } = await supabase.storage
      .from(COVER_BUCKET)
      .upload(filePath, buffer, {
        contentType: imageData.mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage upload failed:", uploadError.message);
      return "";
    }

    const { data } = supabase.storage
      .from(COVER_BUCKET)
      .getPublicUrl(filePath);

    return data?.publicUrl || "";
  } catch (err) {
    console.error("Cover upload error:", err.message);
    return "";
  }
}

// ---------------------------------------------------------------------------
// Step 6 — Deduplication: ensure the slug is unique
// ---------------------------------------------------------------------------

async function ensureUniqueSlug(supabase, baseSlug) {
  const { data } = await supabase
    .from("blogs")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();

  if (data) {
    // Slug already exists — append a short timestamp suffix
    const suffix = Date.now().toString(36);
    return `${baseSlug}-${suffix}`;
  }

  return baseSlug;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Auth check
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.authorization || "";
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const body = readBody(req.body);
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    return res
      .status(500)
      .json({ error: "Missing Supabase server credentials." });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY." });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const textModel =
      process.env.GEMINI_MODEL || DEFAULT_TEXT_MODEL;

    // -----------------------------------------------------------------------
    // 1. Discover today's trending AI topic
    // -----------------------------------------------------------------------
    let topic = body.topic || null;

    if (!topic) {
      console.log("Discovering trending AI topic...");
      topic = await discoverTrendingTopic({
        apiKey: geminiKey,
        model: textModel,
      });
      console.log("Trending topic:", topic);
    }

    if (!topic) {
      // Fallback: let Gemini pick something fresh
      topic = "a surprising recent breakthrough or development in AI this week";
    }

    // -----------------------------------------------------------------------
    // 2. Fetch recent blog titles to avoid repetition
    // -----------------------------------------------------------------------
    const recentBlogs = await getRecentBlogTitles(supabase);
    const recentTitles = recentBlogs.map((b) => b.title);

    // -----------------------------------------------------------------------
    // 3. Generate blog content
    // -----------------------------------------------------------------------
    console.log("Generating blog content for topic:", topic);
    const generated = await generateBlogContent({
      topic,
      recentTitles,
      model: textModel,
      apiKey: geminiKey,
    });

    const contentHtml = generated.contentHtml || "";
    const plainText = stripHtml(contentHtml);
    const excerpt = generated.excerpt || buildExcerpt(plainText);
    const title = generated.title || "Untitled";
    const tags = normalizeTags(generated.tags);
    const readTime = estimateReadTime(plainText);

    // -----------------------------------------------------------------------
    // 4. Generate cover image
    // -----------------------------------------------------------------------
    let coverUrl = "";
    console.log("Generating cover image...");
    const imageData = await generateCoverImage({
      imagePrompt: generated.imagePrompt,
      title,
      apiKey: geminiKey,
    });

    // -----------------------------------------------------------------------
    // 5. Upload cover image to Supabase Storage
    // -----------------------------------------------------------------------
    if (imageData) {
      const baseSlug = slugify(title) || `post-${Date.now()}`;
      coverUrl = await uploadCoverToStorage(supabase, imageData, baseSlug);
      console.log("Cover uploaded:", coverUrl);
    } else {
      console.warn("Skipping cover image — generation returned nothing.");
    }

    // -----------------------------------------------------------------------
    // 6. Deduplicate slug
    // -----------------------------------------------------------------------
    const baseSlug = slugify(title) || `post-${Date.now()}`;
    const slug = await ensureUniqueSlug(supabase, baseSlug);

    // -----------------------------------------------------------------------
    // 7. Insert blog into Supabase
    // -----------------------------------------------------------------------
    const payload = {
      title,
      slug,
      excerpt,
      content: contentHtml,
      author: AI_AUTHOR_NAME,
      tags,
      read_time: readTime,
      cover_url: coverUrl,
      published_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blogs")
      .insert(payload)
      .select("id, slug")
      .maybeSingle();

    if (error) {
      throw error;
    }

    console.log("Blog published:", data);
    return res.status(200).json({ ok: true, topic, data });
  } catch (error) {
    console.error("Blog generation failed:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to post blog." });
  }
}
