import { PageHeader } from "@/components/Sidebar";
import { ResearchPanel } from "@/components/ResearchPanel";

export default function SuggestionsPage() {
  return (
    <div>
      <PageHeader title="Keyword Suggestions" subtitle="Matching terms, questions, long-tail, commercial, transactional, informational and local — each tab has its own count. Only labelled when the underlying method supports it." />
      <ResearchPanel mode="suggestions" />
    </div>
  );
}
