import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Hero() {
  return (
<section className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-6 text-center">   
    <h1 className="text-6xl font-extrabold leading-tight">
  Build Better
  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
    {" "}Software.
  </span>
</h1>

<p className="mt-6 max-w-2xl text-xl leading-8 text-gray-600">  
        Organize your projects, snippets, journals, and development workflow in one place.
      </p>

<div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/register">
  <Button text="Get Started" color="blue" fullWidth={false} />
</Link>

<a
  href="https://github.com/brsaqlain/ForgeDesk"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button text="GitHub" color="green" fullWidth={false} />
</a>
      </div>
    </section>
  );
}