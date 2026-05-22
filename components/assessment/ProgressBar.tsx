"use client";

import { useLanguage } from "@/context/LanguageContext";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useLanguage();
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {t("assess.progress")}
        </span>
      </div>
      <div className="h-2 bg-white rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
