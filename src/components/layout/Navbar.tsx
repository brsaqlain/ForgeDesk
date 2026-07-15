import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 px-8 py-5 backdrop-blur-md">
      <h1 className="text-3xl font-extrabold text-blue-600">
        ForgeDesk
      </h1>

      <div className="flex gap-4">
        <Button text="Login" color="blue" />
        <Button text="Register" color="green" />
      </div>
    </nav>
  );
}