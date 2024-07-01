import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      profileImage: "/images/profile-picture.jpg",
      companies: {
        create: {
          name: "Company A",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
      profileImage: "/images/bob-picture.jpg",
      companies: {
        create: {
          name: "Company B",
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
