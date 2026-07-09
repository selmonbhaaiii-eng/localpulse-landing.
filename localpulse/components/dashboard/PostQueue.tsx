"use client";

import { useMemo, useState } from "react";
import { GeneratePostModal, type OccasionOption, type ReviewOption } from "./GeneratePostModal";
import { PostCard, type QueuePost } from "./PostCard";

type Filter = "all" | "pending_approval" | "approved" | "published" | "draft";

export function PostQueue({
  initialPosts,
  reviews,
  occasions,
  postsThisMonth,
}: {
  initialPosts: QueuePost[];
  reviews: ReviewOption[];
  occasions: OccasionOption[];
  postsThisMonth: number;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState<Filter>("all");
  const [message, setMessage] = useState("");

  const counts = useMemo(
    () => ({
      pending_approval: posts.filter((post) => post.status === "pending_approval").length,
      approved: posts.filter((post) => post.status === "approved").length,
      published: posts.filter((post) => post.status === "published").length,
      draft: posts.filter((post) => post.status === "draft").length,
    }),
    [posts],
  );

  const filteredPosts = filter === "all" ? posts : posts.filter((post) => post.status === filter);

  function updatePost(updated: QueuePost) {
    setPosts((current) => current.map((post) => (post.id === updated.id ? updated : post)));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-lp-accent2">Queue</p>
          <h1 className="mt-2 font-heading text-4xl font-extrabold text-lp-text">Post Queue</h1>
          <p className="mt-2 text-sm text-lp-text2">Approve, edit, and schedule AI-generated GBP posts.</p>
        </div>
        <GeneratePostModal reviews={reviews} occasions={occasions} triggerLabel="Generate New" />
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pending Approval", value: counts.pending_approval, accent: "bg-lp-accent" },
          { label: "Published This Month", value: postsThisMonth, accent: "bg-lp-accent2" },
          { label: "Scheduled", value: counts.approved, accent: "bg-lp-accent3" },
          { label: "Draft", value: counts.draft, accent: "bg-lp-red" },
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

      <section className="flex flex-wrap items-center gap-2 rounded-xl border border-lp-border bg-lp-surface p-3">
        {[
          ["all", `All (${posts.length})`],
          ["pending_approval", `Pending (${counts.pending_approval})`],
          ["approved", `Approved (${counts.approved})`],
          ["published", `Published (${counts.published})`],
          ["draft", `Draft (${counts.draft})`],
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
      </section>

      {message ? <div className="rounded-xl border border-lp-border bg-lp-surface p-4 text-sm text-lp-text2">{message}</div> : null}

      <section className="grid gap-4">
        {filteredPosts.length ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpdate={updatePost}
              onDelete={(postId) => setPosts((current) => current.filter((post) => post.id !== postId))}
              onMessage={setMessage}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-lp-border2 bg-lp-surface p-10 text-center">
            <p className="font-heading text-2xl font-bold text-lp-text">No posts in this view</p>
            <p className="mt-2 text-sm text-lp-text2">Generate a new post or switch filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
