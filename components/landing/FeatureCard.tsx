"use client";

import { motion } from "framer-motion";

import BorderGlow from "./BorderGlow";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  horizontal?: boolean;
}

const FeatureCard = ({
  title,
  description,
  icon,
  horizontal = false,
}: FeatureCardProps) => {
  return (
    <motion.div
      className="group cursor-default"
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
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
        <div
          className={`flex p-8 sm:p-10 min-h-[240px] ${
            horizontal
              ? "flex-col md:flex-row items-center md:items-start gap-6"
              : "flex-col items-center justify-center"
          }`}
        >
          <div
            className={`flex-shrink-0 text-teal-600 transition-transform duration-300 ease-out group-hover:scale-110 ${
              horizontal ? "" : "mb-5"
            }`}
          >
            {icon}
          </div>
          <div
            className={horizontal ? "md:text-left text-center" : "text-center"}
          >
            <h3 className="mb-3 text-xl sm:text-2xl font-bold text-teal-700">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </BorderGlow>
    </motion.div>
  );
};

export default FeatureCard;
