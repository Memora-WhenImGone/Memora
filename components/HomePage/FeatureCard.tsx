import { LucideIcon } from "lucide-react";


// if someone using this component I wrote it in typescript so you have to provide these props 

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 text-left">
      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-gray-900" strokeWidth={2} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}