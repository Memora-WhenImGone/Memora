import { Shield, Users, Clock, FileText } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Shield,
    title: "Secure Vault",
    description: "Store documents, credentials, and notes with enterprise-grade encryption."
  },
  {
    icon: Users,
    title: "Trusted Contacts",
    description: "Designate trusted people who can access your vault when needed."
  },
  {
    icon: Clock,
    title: "Smart Triggers",
    description: "Set inactivity triggers to automatically notify your contacts."
  },
  {
    icon: FileText,
    title: "Digital Will",
    description: "Control exactly what each contact can access from your vault."
  }
];

export default function Features() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}