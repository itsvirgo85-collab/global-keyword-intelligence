import { PageHeader } from "@/components/Sidebar";
import { ResearchPanel } from "@/components/ResearchPanel";

export default function ClusteringPage() {
  return (
    <div>
      <PageHeader title="Keyword Clustering" subtitle="Grouped by parent topic + intent. Different intents and different country/language contexts are never merged into one cluster." />
      <ResearchPanel mode="clustering" />
    </div>
  );
}
