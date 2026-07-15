type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
};

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition hover:-translate-y-2 hover:shadow-xl">
      <h2 className="text-5xl">{icon}</h2>

      <h3 className="mt-3 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-gray-600">
        {description}
      </p>
    </div>
  );
}