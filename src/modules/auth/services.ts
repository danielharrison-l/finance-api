import { hash, compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { CreateUserInput, LoginInput } from './schemas'

export async function registerUser(data: CreateUserInput) {
  const { email, password, name, phone } = data

  const passwordHash = await hash(password, 6)

  const userWithSameEmail = await prisma.users.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    throw new Error('Email already exists')
  }

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: passwordHash,
      phone,
    },
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  }
}

export async function authenticateUser(data: LoginInput) {
  const { email, password } = data

  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      phone: true,
    },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const isPasswordValid = await compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Invalid credentials')
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  }
}
