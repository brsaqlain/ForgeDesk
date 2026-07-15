import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
<section className="grid grid-cols-1 gap-6 px-10 py-16 md:grid-cols-2 lg:grid-cols-3">      <FeatureCard
        icon="🚀"
        title="Projects"
        description="Manage all your development projects."
      />

      <FeatureCard
        icon="📝"
        title="Journal"
        description="Track your daily engineering progress."
      />

      <FeatureCard
        icon="💻"
        title="Snippets"
        description="Save and organize useful code snippets."
      />
    </section>
  );
}