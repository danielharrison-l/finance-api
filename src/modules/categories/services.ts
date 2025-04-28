import { prisma } from '@/lib/prisma'
import { CreateCategoryInput, UpdateCategoryInput } from './schemas'

export async function createCategory(data: CreateCategoryInput, userId: string) {
  const category = await prisma.category.create({
    data: {
      ...data,
      userId,
    },
  })

  return category
}

export async function getCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
  })

  return categories
}

export async function getCategoryById(id: string, userId: string) {
  const category = await prisma.category.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  return category
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
  userId: string
) {
  const category = await prisma.category.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data,
  })

  return updatedCategory
}

export async function deleteCategory(id: string, userId: string) {
  const category = await prisma.category.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  await prisma.category.delete({
    where: {
      id,
    },
  })
} 