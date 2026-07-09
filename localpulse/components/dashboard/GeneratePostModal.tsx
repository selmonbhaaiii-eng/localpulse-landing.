"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Send, Sparkles, X } from "lucide-react";

export type ReviewOption = {
  id: string;
  reviewer_name: string | null;
  rating: number | null;
  review_text: string | null;
};

export type OccasionOption = {
  name: string;
  date: string;
  daysUntil: number;
};

type SourceType = "review" | "seasonal" | "manual";

const tones = ["Warm & Friendly", "Professional", "Playful", "Urgent"];

export function GeneratePostModal({
  reviews,
  occasions,
  triggerLabel = "Generate post",
}: {
  reviews: ReviewOption[];
  occasions: OccasionOption[];
  triggerLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sourceType, setSourceType] = useState<SourceType>("review");
  const [reviewId, setReviewId] = useState(reviews[0]?.id ?? "");
  const [occasionName, setOccasionName] = useState(occasions[0]?.name ?? "");
  const [manualContext, setManualContext] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<{ id: string; content: string } | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === reviewId) ?? reviews[0],
    [reviewId, reviews],
  );
  const selectedOccasion = useMemo(
    () => occasions.find((occasion) => occasion.name === occasionName) ?? occasions[0],
    [occasionName, occasions],
  );

  async function generatePost() {
    setMessage("");
    setPreview(null);

    const payload =
      sourceType === "review"
        ? { source_type: sourceType, review_id: selectedReview?.id, tone }
        : sourceType === "seasonal"
          ? {
              source_type: sourceType,
              occasionName: selectedOccasion?.name,
              occasionDate: selectedOccasion?.date,
              tone,
            }
          : { source_type: sourceType, context: manualContext, tone };

    const response = await fetch("/api/posts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Generation failed. Try again.");
      return;
    }

    setPreview({ id: data.post.id, content: data.post.content });
    setPreviewContent(data.post.content);
    setMessage("Post generated and saved for approval.");
    startTransition(() => router.refresh());
  }

  async function approveNow() {
    if (!preview) return;

    const response = await fetch("/api/posts/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: preview.id,
        action: previewContent === preview.content ? "approve" : "edit",
        edited_content: previewContent,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Approval failed.");
      return;
    }

    setMessage("Post approved and scheduled.");
    startTransition(() => router.refresh());
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-lp-accent px-4 text-sm font-bold text-lp-bg transition hover:brightness-95"
      >
        <Sparkles className="size-4" />
        {triggerLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-lp-border bg-lp-surface shadow-glow">
            <div className="flex items-center justify-between border-b border-lp-border p-5">
              <div>
                <h2 className="font-heading text-2xl font-bold text-lp-text">Generate Post</h2>
                <p className="mt-1 text-sm text-lp-text2">Create a review, seasonal, or manual GBP post.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg border border-lp-border text-lp-text2 hover:bg-lp-surface2 hover:text-lp-text"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                {[
                  ["review", "From Review"],
                  ["seasonal", "Seasonal"],
                  ["manual", "Manual"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSourceType(value as SourceType)}
                    className={`h-9 rounded-lg px-3 text-sm font-bold ${
                      sourceType === value
                        ? "bg-lp-accent text-lp-bg"
                        : "border border-lp-border bg-lp-surface2 text-lp-text2 hover:bg-lp-surface3"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {sourceType === "review" ? (
                <div className="space-y-3">
                  {reviews.length ? (
                    <>
                      <select
                        value={selectedReview?.id ?? ""}
                        onChange={(event) => setReviewId(event.target.value)}
                        className="h-10 w-full rounded-lg border border-lp-border bg-lp-surface2 px-3 text-sm text-lp-text outline-none"
                      >
                        {reviews.map((review) => (
                          <option key={review.id} value={review.id}>
                            {review.reviewer_name ?? "Anonymous"} - {review.rating ?? 0} stars
                          </option>
                        ))}
                      </select>
                      <div className="rounded-lg border border-lp-border bg-lp-bg/40 p-4 text-sm leading-6 text-lp-text2">
                        {selectedReview?.review_text}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-lp-accent3/20 bg-lp-accent3/10 p-4 text-sm text-lp-accent3">
                      No unprocessed reviews found. Sync reviews first or choose Manual.
                    </div>
                  )}
                </div>
              ) : null}

              {sourceType === "seasonal" ? (
                <select
                  value={selectedOccasion?.name ?? ""}
                  onChange={(event) => setOccasionName(event.target.value)}
                  className="h-10 w-full rounded-lg border border-lp-border bg-lp-surface2 px-3 text-sm text-lp-text outline-none"
                >
                  {occasions.map((occasion) => (
                    <option key={occasion.name} value={occasion.name}>
                      {occasion.name} - in {occasion.daysUntil} days
                    </option>
                  ))}
                </select>
              ) : null}

              {sourceType === "manual" ? (
                <textarea
                  value={manualContext}
                  onChange={(event) => setManualContext(event.target.value)}
                  placeholder="e.g. Mention our weekend brunch deal..."
                  className="min-h-28 w-full rounded-lg border border-lp-border bg-lp-surface2 p-3 text-sm leading-6 text-lp-text outline-none placeholder:text-lp-text3"
                />
              ) : null}

              <div className="grid gap-2 sm:grid-cols-4">
                {tones.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTone(option)}
                    className={`h-9 rounded-lg px-2 text-sm font-bold ${
                      tone === option
                        ? "bg-lp-accent2 text-lp-bg"
                        : "border border-lp-border bg-lp-surface2 text-lp-text2 hover:bg-lp-surface3"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {message ? (
                <div className="rounded-lg border border-lp-border bg-lp-bg/40 p-3 text-sm text-lp-text2">{message}</div>
              ) : null}

              {preview ? (
                <div className="rounded-xl border border-lp-border bg-lp-bg/40 p-4">
                  <textarea
                    value={previewContent}
                    onChange={(event) => setPreviewContent(event.target.value)}
                    className="min-h-40 w-full resize-y bg-transparent text-sm leading-6 text-lp-text outline-none"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={approveNow}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-lp-accent px-3 text-sm font-bold text-lp-bg"
                    >
                      <Check className="size-4" />
                      Approve Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessage("Edit the preview text, then approve when ready.")}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-lp-border bg-lp-surface2 px-3 text-sm font-bold text-lp-text2"
                    >
                      <Pencil className="size-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                onClick={generatePost}
                disabled={isPending || (sourceType === "review" && !reviews.length)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-lp-accent px-4 text-sm font-bold text-lp-bg transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {isPending ? "Writing your post..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
