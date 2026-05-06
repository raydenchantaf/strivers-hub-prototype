import AssessmentEngine from "@/components/assessment/AssessmentEngine";

export const metadata = {
  title: "Business Readiness Assessment — Strivers' Hub",
  description: "Take our self-assessment to discover your entrepreneurial stage and get personalised recommendations.",
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-rose/30 to-white">
      <AssessmentEngine />
    </div>
  );
}
