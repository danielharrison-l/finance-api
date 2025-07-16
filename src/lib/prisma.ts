import { Prisma, PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

console.log('Initializing Prisma...')
console.log('Prisma initialized:') 