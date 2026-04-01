import { PrismaPg } from "@prisma/adapter-pg";
import secret from "../../config/secret";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: secret.database_url });
const prisma = new PrismaClient({ adapter });

export { prisma };
