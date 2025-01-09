import { Check } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface FeatureGroup {
  title: string;
  features: Feature[];
}

export function FeatureList() {
  const featureGroups: FeatureGroup[] = [
    {
      title: "Apply AI with New Solutions",
      features: [
        { title: "Spellbook", description: "Build language apps" },
        { title: "InstantML", description: "Build vision apps" },
      ],
    },
    {
      title: "Apply AI with Tailored Solutions",
      features: [
        { title: "Forge", description: "Generate product imagery" },
        {
          title: "Content Understanding",
          description: "Detect trends, classify content",
        },
      ],
    },
    {
      title: "Build AI with ML Tools",
      features: [
        { title: "Labeling", description: "3d, images, text, video, etc." },
        { title: "Nucleus", description: "Manage your dataset" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {featureGroups.map((group, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-gray-900 dark:text-white" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              {group.title}
            </h3>
          </div>
          <div className="ml-7 space-y-2">
            {group.features.map((feature, featureIndex) => (
              <div
                key={featureIndex}
                className="text-sm text-gray-600 dark:text-gray-300"
              >
                <span className="font-medium">{feature.title}:</span>{" "}
                {feature.description}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
