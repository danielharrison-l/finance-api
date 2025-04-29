import { prisma } from '../../lib/prisma'
import { CreateCategoryInput, UpdateCategoryInput } from './schemas'

export async function createCategory(data: CreateCategoryInput, userId: string) {
  try {
    const category = await prisma.categories.create({
      data: {
        ...data,
        userId,
      },
    })
    return category
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export async function getCategories(userId: string) {
  try {
    const categories = await prisma.categories.findMany({
      where: {
        userId,
      },
    })
    return categories
  } catch (error) {
    console.error('Error getting categories:', error)
    throw error
  }
}

export async function getCategoryById(categoryId: string, userId: string) {
  try {
    const id = parseInt(categoryId)
    const category = await prisma.categories.findFirst({
      where: {
        id,
        userId,
      },
    })
    return category
  } catch (error) {
    console.error('Error getting category:', error)
    throw error
  }
}

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryInput,
  userId: string
) {
  try {
    const id = parseInt(categoryId)
    const category = await prisma.categories.update({
      where: {
        id,
        userId,
      },
      data,
    })
    return category
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export async function deleteCategory(categoryId: string, userId: string) {
  try {
    const id = parseInt(categoryId)
    await prisma.categories.delete({
      where: {
        id,
        userId,
      },
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
} 