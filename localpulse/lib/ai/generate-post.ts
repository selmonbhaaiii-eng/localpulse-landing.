import Anthropic from "@anthropic-ai/sdk";
import { fillPrompt, MANUAL_POST_PROMPT, REVIEW_TO_POST_PROMPT, SEASONAL_POST_PROMPT } from "./prompts";

type BusinessPostParams = {
  businessName: string;
  location: string | null;
  category: string | null;
  tone?: string;
};

function anthropicKey() {
  const key = process.env.ANTHROPIC_API_KEY;
  return key && !key.startsWith("your_") ? key : null;
}

function cleanPost(value: string) {
  return value.replace(/^["']|["']$/g, "").trim();
}

async function runClaude(prompt: string, maxTokens: number) {
  const apiKey = anthropicKey();
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  return content.type === "text" ? cleanPost(content.text) : "";
}

export async function generatePostFromReview(
  params: BusinessPostParams & {
    reviewerName: string;
    phrases: string[];
  },
): Promise<string> {
  const prompt = fillPrompt(REVIEW_TO_POST_PROMPT, {
    businessName: params.businessName,
    location: params.location ?? "India",
    category: params.category ?? "local business",
    reviewerName: params.reviewerName,
    phrases: params.phrases.join(", "),
    tone: params.tone ?? "Warm & Friendly",
  });

  const generated = await runClaude(prompt, 1000);
  if (generated) return generated;

  const phrase = params.phrases[0] ?? "a lovely customer experience";
  return `${params.businessName} customers keep saying it best. ${params.reviewerName} recently called out "${phrase}", and that is exactly the kind of everyday moment we work for at our ${params.location ?? "local"} spot. Drop in this week, say hello, and let us make your next visit just as memorable.`;
}

export async function generateSeasonalPost(
  params: BusinessPostParams & {
    occasionName: string;
    occasionDate: string;
  },
): Promise<string> {
  const prompt = fillPrompt(SEASONAL_POST_PROMPT, {
    businessName: params.businessName,
    category: params.category ?? "local business",
    location: params.location ?? "India",
    occasionName: params.occasionName,
    occasionDate: params.occasionDate,
    tone: params.tone ?? "Warm & Friendly",
  });

  const generated = await runClaude(prompt, 800);
  if (generated) return generated;

  return `${params.occasionName} is around the corner, and ${params.businessName} is ready to help you mark it with something thoughtful, useful, and local. Visit us in ${params.location ?? "your neighbourhood"} this week and let our team help you make the occasion feel a little more special.`;
}

export async function generateManualPost(
  params: BusinessPostParams & {
    context: string;
  },
): Promise<string> {
  const prompt = fillPrompt(MANUAL_POST_PROMPT, {
    businessName: params.businessName,
    category: params.category ?? "local business",
    location: params.location ?? "India",
    context: params.context,
    tone: params.tone ?? "Warm & Friendly",
  });

  const generated = await runClaude(prompt, 800);
  if (generated) return generated;

  return `${params.businessName} has something new to share: ${params.context}. If you are nearby in ${params.location ?? "the area"}, come by, ask our team for details, and let us help you make the most of it.`;
}
