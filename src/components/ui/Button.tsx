type ButtonProps = {
  text: string;
  color: "blue" | "green" | "red";
};

export default function Button({ text, color }: ButtonProps) {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
className={`${colors[color]} rounded-lg px-5 py-2 text-white font-medium transition duration-300 hover:scale-105`} >
      {text}
    </button>
  );
}