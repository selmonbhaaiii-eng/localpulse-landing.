"use client";

import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import type { Database } from "@/types/database";

export type QueuePost = Database["public"]["Tables"]["posts"]["Row"] & {
  reviews?: {
    reviewer_name: string | null;
    rating: number | null;
    review_text?: string | null;
  } | null;
};

const sourceMeta: Record<string, { label: string; dot: string }> = {
  review: { label: "From Review", dot: "bg-lp-accent" },
  seasonal: { label: "Seasonal", dot: "bg-lp-accent3" },
  event: { label: "Event", dot: "bg-lp-accent2" },
  manual: { label: "Manual", dot: "bg-lp-text3" },
  promo: { label: "Promo", dot: "bg-lp-accent2" },
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(
    new Date(value),
  );
}

function stars(rating: number | null) {
  return "★".repeat(rating ?? 0);
}

export function PostCard({
  post,
  onUpdate,
  onDelete,
  onMessage,
}: {
  post: QueuePost;
  onUpdate: (post: QueuePost) => void;
  onDelete: (postId: string) => void;
  onMessage: (message: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [busy, setBusy] = useState(false);
  const meta = sourceMeta[post.source_type ?? "manual"] ?? sourceMeta.manual;
  const canApprove = post.status === "pending_approval" || post.status === "draft";

  async function approve(action: "approve" | "edit") {
    setBusy(true);
    const optimistic = {
      ...post,
      content: action === "edit" ? content : post.content,
      status: "approved" as const,
      scheduled_at: post.scheduled_at ?? new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
    onUpdate(optimistic);

    const response = await fetch("/api/posts/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: post.id, action, edited_content: content }),
    });
    const data = await response.json();

    setBusy(false);
    if (!response.ok) {
      onUpdate(post);
      onMessage(data.error ?? "Approval failed.");
      return;
    }

    setEditing(false);
    onUpdate(data.post);
    onMessage("Post approved and scheduled.");
  }

  async function deletePost() {
    setBusy(true);
    const response = await fetch(`/api/posts?post_id=${post.id}`, { method: "DELETE" });
    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      onMessage(data.error ?? "Delete failed.");
      return;
    }

    onDelete(post.id);
    onMessage("Post deleted.");
  }

  return (
    <article className="rounded-xl border border-lp-border bg-lp-surface p-5">
      <div className="flex items-start gap-3">
        <span className={`mt-2 size-2.5 shrink-0 rounded-full ${meta.dot}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-lp-border bg-lp-surface2 px-2.5 py-1 text-xs font-bold text-lp-text2">
              {meta.label}
            </span>
            <span className="rounded-full border border-lp-border bg-lp-bg px-2.5 py-1 text-xs font-bold capitalize text-lp-text2">
              {post.status?.replace("_", " ")}
            </span>
            {formatDate(post.scheduled_at) ? (
              <span className="text-xs text-lp-text3">Scheduled {formatDate(post.scheduled_at)}</span>
            ) : null}
          </div>

          {editing ? (
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mt-4 min-h-40 w-full resize-y rounded-lg border border-lp-border bg-lp-surface2 p-3 text-sm leading-6 text-lp-text outline-none"
            />
          ) : (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-lp-text">{post.content}</p>
          )}

          {post.reviews ? (
            <p className="mt-4 text-xs text-lp-text3">
              From {post.reviews.reviewer_name ?? "a customer"}&apos;s review {stars(post.reviews.rating)}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={() => approve("edit")}
                  disabled={busy}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-lp-accent px-3 text-sm font-bold text-lp-bg disabled:opacity-60"
                >
                  <Check className="size-4" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContent(post.content);
                    setEditing(false);
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-lp-border bg-lp-surface2 px-3 text-sm font-bold text-lp-text2"
                >
                  <X className="size-4" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => approve("approve")}
                  disabled={busy || !canApprove}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-lp-accent px-3 text-sm font-bold text-lp-bg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="size-4" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  disabled={busy || post.status === "published"}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-lp-border bg-lp-surface2 px-3 text-sm font-bold text-lp-text2 hover:bg-lp-surface3 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Pencil className="size-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={deletePost}
                  disabled={busy}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-lp-red/25 bg-lp-red/10 px-3 text-sm font-bold text-lp-red disabled:opacity-60"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
