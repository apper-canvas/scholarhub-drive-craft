import React from "react";
import { cn } from "@/utils/cn";

const GradeBadge = ({ grade, size = "md", className = "" }) => {
  const getGradeColor = (grade) => {
    const numGrade = typeof grade === "string" ? parseFloat(grade) : grade;
    if (numGrade >= 90) return "excellent";
    if (numGrade >= 70) return "good";
    return "poor";
  };

  const getGradeLetter = (grade) => {
    const numGrade = typeof grade === "string" ? parseFloat(grade) : grade;
    if (numGrade >= 97) return "A+";
    if (numGrade >= 93) return "A";
    if (numGrade >= 90) return "A-";
    if (numGrade >= 87) return "B+";
    if (numGrade >= 83) return "B";
    if (numGrade >= 80) return "B-";
    if (numGrade >= 77) return "C+";
    if (numGrade >= 73) return "C";
    if (numGrade >= 70) return "C-";
    if (numGrade >= 67) return "D+";
    if (numGrade >= 65) return "D";
    return "F";
  };

  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm"
  };

  const colorClass = getGradeColor(grade);
  const letterGrade = getGradeLetter(grade);

  return (
    <div className={cn("grade-badge", colorClass, sizes[size], className)}>
      {letterGrade}
    </div>
  );
};

export default GradeBadge;