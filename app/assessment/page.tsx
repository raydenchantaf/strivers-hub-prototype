"use client";

import AssessmentEngine from "@/components/assessment/AssessmentEngine";
import { useAssessmentReset } from "@/context/AssessmentResetContext";

export default function AssessmentPage() {
  const { resetCount } = useAssessmentReset();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-rose/30 to-white">
      <AssessmentEngine key={resetCount} />
    </div>
  );
}
