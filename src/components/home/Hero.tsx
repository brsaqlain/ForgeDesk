import Button from "@/components/ui/Button";

export default function Hero() {
  return (
<section className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-6 text-center">      <h1 className="text-6xl font-extrabold leading-tight">
  Build Better
  <span className="text-blue-600"> Software.</span>
</h1>

<p className="mt-6 max-w-2xl text-xl leading-8 text-gray-600">        Organize your projects, snippets, journals, and development workflow in one place.
      </p>

<div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button text="Get Started" color="blue" />
        <Button text="GitHub" color="green" />
      </div>
    </section>
  );
}