import { PageHeader } from "@/components/Sidebar";
import { ResearchPanel } from "@/components/ResearchPanel";

export default function OpportunitiesPage() {
  return (
    <div>
      <PageHeader title="Keyword Opportunities" subtitle="Prioritised by a transparent Opportunity Score (0–100). The score is a documented heuristic — not an Ahrefs KD — and confidence stays low until volume/KD come from a provider or CSV." />
      <ResearchPanel mode="opportunities" />
    </div>
  );
}
