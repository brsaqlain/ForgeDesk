import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
const { email, password } = await request.json();
const user = await prisma.user.findUnique({
  where: {
    email,
  },
});
if (!user) {
  return NextResponse.json(
    { message: "Invalid email or password" },
    { status: 401 }
  );
}
const isPasswordValid = await bcrypt.compare(
  password,
  user.password
);
if (!isPasswordValid) {
  return NextResponse.json(
    { message: "Invalid email or password" },
    { status: 401 }
  );
}
return NextResponse.json(
  { message: "Login successful", user },
  { status: 200 }
);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
