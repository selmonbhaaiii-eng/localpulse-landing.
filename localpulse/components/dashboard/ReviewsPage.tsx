"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, MessageSquarePlus, RefreshCw, Search, Sparkles, Star } from "lucide-react";
import type { Database, Json } from "@/types/database";

type Review = Database["public"]["Tables"]["reviews"]["Row"];
type Business = Pick<
  Database["public"]["Tables"]["businesses"]["Row"],
  "gbp_connected" | "avg_rating" | "total_reviews"
>;

type Filter = "all" | "five" | "four" | "needs_reply" | "converted";

function initials(name: string | null) {
  return (name ?? "Anonymous")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function relativeTime(value: string | null) {
  if (!value) {
    return "Unknown date";
  }

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60_000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  if (days < 30) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

function phrasesText(value: Json | null) {
  if (!value) {
    return "";
  }

  if (typeof value === "object" && !Array.isArray(value) && "phrases" in value) {
    const phrases = value.phrases;
    if (Array.isArray(phrases)) {
      return phrases.map(String).join(", ");
    }
  }

  return JSON.stringify(value);
}

function Stars({ rating }: { rating: number | null }) {
  return (
    <div className="flex items-center gap-0.5 text-[#FFB800]" aria-label={`${rating ?? 0} star review`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`size-4 ${index < (rating ?? 0) ? "fill-current" : "opacity-25"}`}
        />
      ))}
    </div>
  );
}

function StatusBadge({ review }: { review: Review }) {
  if (review.post_created) {
    return (
      <span className="rounded-full border border-lp-accent/20 bg-lp-accent/10 px-2.5 py-1 text-xs font-bold text-lp-accent">
        Post created
      </span>
    );
  }

  if ((review.rating ?? 0) <= 3) {
    return (
      <span className="rounded-full border border-lp-red/20 bg-lp-red/10 px-2.5 py-1 text-xs font-bold text-lp-red">
        Needs attention
      </span>
    );
  }

  return (
    <span className="rounded-full border border-lp-accent3/20 bg-lp-accent3/10 px-2.5 py-1 text-xs font-bold text-lp-accent3">
      New
    </span>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const rating = review.rating ?? 0;

  return (
    <article className="relative rounded-xl border border-lp-border bg-lp-surface p-5">
      <div className="absolute right-4 top-4">
        <StatusBadge review={review} />
      </div>
      <div className="flex items-start gap-3 pr-28">
        {review.reviewer_avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.reviewer_avatar}
            alt=""
            className="size-11 rounded-lg object-cover"
          />
        ) : (
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-lp-bg"
            style={{
              background:
                index % 2 === 0
                  ? "linear-gradient(135deg, #B8FF57, #57D4FF)"
                  : "linear-gradient(135deg, #FF9F57, #B8FF57)",
            }}
          >
            {initials(review.reviewer_name)}
          </div>
        )}
        <div>
          <h3 className="font-bold text-lp-text">{review.reviewer_name ?? "Anonymous"}</h3>
          <p className="mt-1 text-xs text-lp-text3">{relativeTime(review.review_date)}</p>
          <div className="mt-2">
            <Stars rating={rating} />
          </div>
        </div>
      </div>

      <p className={`mt-5 text-sm leading-6 text-lp-text2 ${expanded ? "" : "line-clamp-3"}`}>
        {review.review_text || "No written review provided."}
      </p>
      {review.review_text && review.review_text.length > 160 ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-sm font-bold text-lp-accent"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}

      <div
        className={`mt-5 rounded-xl border p-4 ${
          rating <= 3
            ? "border-lp-accent3/25 bg-lp-accent3/10"
            : "border-lp-accent/20 bg-lp-accent/10"
        }`}
      >
        {rating <= 3 ? (
          <div className="flex items-start gap-2 text-sm text-lp-accent3">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>Pain point detected. Draft a careful reply before this becomes post content.</span>
          </div>
        ) : review.phrases_extracted ? (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-lp-accent">AI Extract</p>
            <p className="mt-2 text-sm leading-6 text-lp-text">{phrasesText(review.extracted_phrases)}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-lp-accent">
            <Sparkles className="size-4 animate-pulse" />
            <span>Extracting phrases...</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {rating >= 4 ? (
          <button
            disabled
            title="Coming in next update"
            className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-lg border border-lp-border bg-lp-surface2 px-3 text-sm font-bold text-lp-text3"
          >
            <Sparkles className="size-4" />
            Create Post
          </button>
        ) : (
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-lp-red/30 bg-lp-red/10 px-3 text-sm font-bold text-lp-red">
            <AlertCircle className="size-4" />
            Escalate
          </button>
        )}
        <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-lp-border bg-lp-surface2 px-3 text-sm font-bold text-lp-text2 transition hover:bg-lp-surface3 hover:text-lp-text">
          <MessageSquarePlus className="size-4" />
          Draft Reply
        </button>
      </div>
    </article>
  );
}

export function ReviewsPage({ reviews, business }: { reviews: Review[]; business: Business | null }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter((review) => {
      if (filter === "five" && review.rating !== 5) return false;
      if (filter === "four" && review.rating !== 4) return false;
      if (filter === "needs_reply" && !(review.reply_text === null && (review.rating ?? 0) <= 3)) {
        return false;
      }
      if (filter === "converted" && !review.post_created) return false;

      if (!query) return true;

      return [review.reviewer_name, review.review_text]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
    });
  }, [filter, reviews, search]);

  const converted = reviews.filter((review) => review.post_created).length;
  const awaitingReply = reviews.filter(
    (review) => review.reply_text === null && (review.rating ?? 0) <= 3,
  ).length;

  async function syncNow() {
    setMessage("");
    const response = await fetch("/api/reviews/sync", { method: "POST" });
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? payload.errorType ?? "Review sync failed.");
      return;
    }

    setMessage(`Synced ${payload.synced ?? 0} reviews.`);
    startTransition(() => router.refresh());
  }

  if (!business?.gbp_connected || !reviews.length) {
    return (
      <section className="flex min-h-[520px] items-center justify-center rounded-xl border border-lp-border bg-lp-surface p-8 text-center">
        <div>
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-lp-accent/10 text-lp-accent">
            <Star className="size-8" />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-bold text-lp-text">No reviews yet</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-lp-text2">
            Connect your GBP to import reviews automatically.
          </p>
          <Link
            href="/dashboard/connect"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-lg bg-lp-accent px-5 text-sm font-bold text-lp-bg"
          >
            Connect GBP
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-lp-accent2">Reviews</p>
          <h1 className="mt-2 font-heading text-4xl font-extrabold text-lp-text">Google Reviews</h1>
          <p className="mt-2 text-sm text-lp-text2">Real reviews imported from Google Business Profile.</p>
        </div>
        <button
          type="button"
          onClick={syncNow}
          disabled={isPending}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-lp-accent px-4 text-sm font-bold text-lp-bg transition hover:brightness-95 disabled:opacity-60"
        >
          <RefreshCw className={`size-4 ${isPending ? "animate-spin" : ""}`} />
          Sync Now
        </button>
      </div>

      {message ? (
        <div className="rounded-xl border border-lp-border bg-lp-surface p-4 text-sm text-lp-text2">
          {message}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Reviews", value: business.total_reviews ?? reviews.length, accent: "bg-lp-accent" },
          { label: "Average Rating", value: business.avg_rating ?? "--", accent: "bg-lp-accent2" },
          { label: "Converted to Posts", value: converted, accent: "bg-lp-accent3" },
          { label: "Awaiting Reply", value: awaitingReply, accent: "bg-lp-red" },
        ].map((stat) => (
          <div key={stat.label} className="overflow-hidden rounded-xl border border-lp-border bg-lp-surface">
            <div className={`h-0.5 ${stat.accent}`} />
            <div className="p-5">
              <p className="text-sm font-medium text-lp-text2">{stat.label}</p>
              <p className="mt-3 font-heading text-3xl font-bold text-lp-text">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-lp-border bg-lp-surface p-3">
        {[
          ["all", "All"],
          ["five", "5 star Only"],
          ["four", "4 star Only"],
          ["needs_reply", "Needs Reply"],
          ["converted", "Converted"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value as Filter)}
            className={`h-9 rounded-lg px-3 text-sm font-bold transition ${
              filter === value
                ? "bg-lp-accent text-lp-bg"
                : "border border-lp-border bg-lp-surface2 text-lp-text2 hover:bg-lp-surface3 hover:text-lp-text"
            }`}
          >
            {label}
          </button>
        ))}
        <label className="ml-auto flex h-9 min-w-[260px] items-center gap-2 rounded-lg border border-lp-border bg-lp-surface2 px-3">
          <Search className="size-4 text-lp-text3" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reviews"
            className="w-full bg-transparent text-sm text-lp-text outline-none placeholder:text-lp-text3"
          />
        </label>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredReviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}
      </section>
    </div>
  );
}
