"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AssessmentResetContextType {
  resetCount: number;
  bumpReset: () => void;
}

const AssessmentResetContext = createContext<AssessmentResetContextType>({
  resetCount: 0,
  bumpReset: () => {},
});

export function useAssessmentReset() {
  return useContext(AssessmentResetContext);
}

export function AssessmentResetProvider({ children }: { children: ReactNode }) {
  const [resetCount, setResetCount] = useState(0);
  const bumpReset = () => setResetCount((c) => c + 1);

  return (
    <AssessmentResetContext.Provider value={{ resetCount, bumpReset }}>
      {children}
    </AssessmentResetContext.Provider>
  );
}
