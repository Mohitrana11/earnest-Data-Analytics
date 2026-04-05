import prisma from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateTokens } from "../utils/generateTokens";

// Register a new user
export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("Use Different Email or Password");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const { accessToken, refreshToken } = generateTokens(user.id) as {
    accessToken: string;
    refreshToken: string;
  };

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (token: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!storedToken) throw new Error("Invalid refresh token");

  const { accessToken } = generateTokens(storedToken.userId);

  return { accessToken };
};

export const logoutUser = async (token: string) => {
  await prisma.refreshToken.delete({
    where: { token },
  });

  return true;
};
