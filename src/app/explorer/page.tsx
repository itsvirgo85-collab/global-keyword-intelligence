import { PageHeader } from "@/components/Sidebar";
import { ResearchPanel } from "@/components/ResearchPanel";

export default function ExplorerPage() {
  return (
    <div>
      <PageHeader title="Keyword Explorer" subtitle="Seed keyword + country + language → live suggestions from Google Autocomplete and Datamuse. Suggestions only — not verified volume." />
      <ResearchPanel mode="explorer" />
    </div>
  );
}
