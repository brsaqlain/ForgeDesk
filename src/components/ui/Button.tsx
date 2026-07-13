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
      className={`${colors[color]} text-white px-4 py-2 rounded-lg transition`}
    >
      {text}
    </button>
  );
}