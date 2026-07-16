import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 px-8 py-5 backdrop-blur-md">
      <Link href="/">
        <h1 className="cursor-pointer text-3xl font-extrabold text-cyan-600">
          ForgeDesk
        </h1>
      </Link>

      <div className="flex gap-4">
        <Link href="/login">
          <Button text="Login" color="blue" fullWidth={false} />
        </Link>

        <Link href="/register">
          <Button text="Register" color="green" fullWidth={false} />
        </Link>
      </div>
    </nav>
  );
}