import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import * as argon2 from 'argon2'

async function main() {
  const pass = await argon2.hash('Admin@1234')
  await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'admin@yopmail.com',
      firstName: 'Alice',
      lastName: 'Admin',
      role: 'ADMIN',
      password: pass,
      phone: '1234567890',
      isVerified: true,
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })