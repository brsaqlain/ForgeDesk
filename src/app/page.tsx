import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-5xl font-bold">ForgeDesk</h1>

      <Button text="Login" color="blue" />
      <Button text="Register" color="green" />
      <Button text="Get Started" color="red" />
    </main>
  );
}