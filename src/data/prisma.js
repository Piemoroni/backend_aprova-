import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

// 1. Crie a pool de conexões com as suas credenciais
const pool = mariadb.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
});

// 2. Passe a pool para dentro do construtor do adaptador
const adapter = new PrismaMariaDb(pool);

// 3. Instancie o Prisma Client usando o adaptador
const prisma = new PrismaClient({ adapter });

export { prisma };
