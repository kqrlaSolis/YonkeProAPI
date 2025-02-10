import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const register = async (req, res) => {
  const dataBase = new PrismaClient();
  const body = req.body;

  const user = await dataBase.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  await dataBase.user.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
    },
  });

  res.json({ message: "User created" });
};

export const login = async (req, res) => {
  const dataBase = new PrismaClient();
  const body = req.body;

  const user = await dataBase.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(body.password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({ token });
};

export const getUsers = async (req, res) => {
  const dataBase = new PrismaClient();
  const users = await dataBase.user.findMany();

  res.json(
    users.map((user) => ({
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      role: user.role,
    }))
  );
};

export const getUserById = async (req, res) => {
  const dataBase = new PrismaClient();
  const { id } = req.params;

  const user = await dataBase.user.findUnique({
    where: {
      id: id,
    },
  });

  res.json(user);
};

export const editUser = async (req, res) => {
  const dataBase = new PrismaClient();
  const { id } = req.params;
  const body = req.body;

  const editedUser = await dataBase.user.update({
    where: {
      id: id,
    },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
    },
  });

  res.json(editedUser);
};

export const deleteUser = async (req, res) => {
  const dataBase = new PrismaClient();
  const { id } = req.params;

  const deletedUser = await dataBase.user.delete({
    where: {
      id: id,
    },
  });

  res.json(deletedUser);
};
