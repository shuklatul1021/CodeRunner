import { PrismaClient } from "../generated/prisma/client.js";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma || new PrismaClient({});
