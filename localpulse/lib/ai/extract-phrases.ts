import Anthropic from "@anthropic-ai/sdk";

function anthropicKey() {
  const key = process.env.ANTHROPIC_API_KEY;
  return key && !key.startsWith("your_") ? key : null;
}

function localPhraseFallback(reviewText: string) {
  const stop = new Set([
    "the",
    "and",
    "that",
    "this",
    "with",
    "for",
    "was",
    "are",
    "they",
    "here",
    "have",
    "from",
  ]);

  const words = reviewText
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stop.has(word.toLowerCase()));

  const phrases = new Set<string>();
  for (let index = 0; index < words.length - 2 && phrases.size < 3; index += 2) {
    phrases.add(words.slice(index, Math.min(index + 5, words.length)).join(" "));
  }

  return Array.from(phrases);
}

export async function extractPhrasesFromReview(
  reviewText: string,
  reviewerName: string,
  rating: number,
): Promise<string[]> {
  if (rating < 4 || !reviewText.trim()) {
    return [];
  }

  const apiKey = anthropicKey();
  if (!apiKey) {
    return localPhraseFallback(reviewText);
  }

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Extract 2-3 specific, quotable phrases from this Google review that would make great content for a Google Business Profile post.

Rules:
- Only extract phrases the customer actually said
- Phrases must be specific, not generic like "great service"
- Each phrase should be 3-8 words maximum
- Return as JSON array of strings only
- No explanation, just the JSON array

Reviewer: ${reviewerName}
Rating: ${rating} stars
Review: "${reviewText}"

Return format: ["phrase one", "phrase two", "phrase three"]`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") return [];

  try {
    const parsed = JSON.parse(content.text.replace(/```json/g, "").replace(/```/g, "").trim());
    return Array.isArray(parsed) ? parsed.map(String).slice(0, 3) : [];
  } catch {
    return [];
  }
}
