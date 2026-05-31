import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex justify-center">{icon}</div>

      <h3 className="mb-3 text-center text-2xl font-bold text-teal-700">
        {title}
      </h3>

      <p className="text-center text-lg text-teal-700">{description}</p>
    </div>
  );
};
