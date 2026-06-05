"use client";

import BorderGlow from "./BorderGlow";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <BorderGlow
      backgroundColor="#FFFFFF"
      borderRadius={28}
      colors={["#1e8279", "#38bdf8", "#0d9488"]}
      coneSpread={25}
      edgeSensitivity={30}
      fillOpacity={0.5}
      glowColor="30 130 121"
      glowIntensity={1}
      glowRadius={40}
    >
      <div className="flex flex-col items-center justify-center p-8 sm:p-10 min-h-[280px]">
        <div className="mb-5 text-teal-600">{icon}</div>
        <h3 className="mb-3 text-center text-xl sm:text-2xl font-bold text-teal-700">
          {title}
        </h3>
        <p className="text-center text-sm sm:text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </BorderGlow>
  );
};

export default FeatureCard;
