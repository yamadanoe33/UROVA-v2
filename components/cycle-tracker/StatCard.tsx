import type { ReactNode } from "react";

type Props = { title: string; value: ReactNode; caption?: string; tone?: "teal" | "rose" | "violet" };

export default function StatCard({ title, value, caption, tone = "teal" }: Props) {
  return (
    <div className={`cycle-stat-card ${tone}`}>
      <p>{title}</p>
      <strong>{value}</strong>
      {caption ? <span>{caption}</span> : null}
    </div>
  );
}
