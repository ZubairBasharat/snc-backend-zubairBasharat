import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { getPersonFromDB } from "./db";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/user", async (req, res) => {
  const email = req.query.email as string;
  if (!email) {
    return res.status(400).send("Email query parameter is required");
  }

  try {
    const user = await getPersonFromDB(email);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/user", async (req, res) => {
  const { email, name, profileImage, companyName } = req.body;

  if (!email || !name || !profileImage || !companyName) {
    return res
      .status(400)
      .send("All fields (email, name, profileImage, companyName) are required");
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).send("User with this email already exists");
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        profileImage,
        companies: {
          create: {
            name: companyName,
          },
        },
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
