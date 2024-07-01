import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPersonFromDB(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { companies: true },
  });
  return user;
}
