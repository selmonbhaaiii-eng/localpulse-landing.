export const REVIEW_TO_POST_PROMPT = `
You are a local business marketing expert writing a Google Business Profile post for {businessName} located in {location}. The business type is {category}.

A customer named {reviewerName} left a 5-star review containing these key phrases: {phrases}
Tone requested: {tone}

Write a Google Business Profile post that:
- Opens with an engaging hook, not "We are thrilled"
- Naturally incorporates the customer's own words
- Feels warm, local, and authentic, not corporate
- Mentions the business location naturally if relevant
- Ends with a subtle call to action
- Is between 100-200 words
- Uses 1-2 relevant emojis naturally
- Does not use hashtags
- Sounds like a real local business owner wrote it

Return only the post text. No title, no explanation.
`;

export const SEASONAL_POST_PROMPT = `
You are writing a Google Business Profile post for {businessName}, a {category} located in {location}, India.

Upcoming occasion: {occasionName} on {occasionDate}
Tone requested: {tone}

Write a festive Google Business Profile post that:
- Acknowledges the upcoming occasion warmly
- Ties it naturally to the business food, services, or products
- Feels genuinely Indian and local in tone
- Is between 80-150 words
- Uses 1-2 appropriate emojis
- Ends with a call to visit or contact
- Does not use hashtags

Return only the post text. No title, no explanation.
`;

export const MANUAL_POST_PROMPT = `
You are writing a Google Business Profile post for {businessName}, a {category} in {location}, India.

Topic/context provided: {context}
Tone requested: {tone}

Write a Google Business Profile post that:
- Directly addresses the provided topic/context
- Matches the requested tone exactly
- Is between 100-200 words
- Uses 1-2 relevant emojis
- Does not use hashtags
- Ends with a clear call to action

Return only the post text. No title, no explanation.
`;

export function fillPrompt(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (prompt, [key, value]) => prompt.replaceAll(`{${key}}`, value || "not specified"),
    template,
  );
}
