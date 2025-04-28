import { prisma } from '@/lib/prisma'
import { CreateTransactionInput, UpdateTransactionInput } from './schemas'

export async function createTransaction(data: CreateTransactionInput, userId: string) {
  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      userId,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  if (category.type !== data.type) {
    throw new Error('Transaction type does not match category type')
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      userId,
    },
    include: {
      category: true,
    },
  })

  return transaction
}

export async function getTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return transactions
}

export async function getTransactionById(id: string, userId: string) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      category: true,
    },
  })

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  return transaction
}

export async function updateTransaction(
  id: string,
  data: UpdateTransactionInput,
  userId: string
) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId,
      },
    })

    if (!category) {
      throw new Error('Category not found')
    }

    if (data.type && category.type !== data.type) {
      throw new Error('Transaction type does not match category type')
    }
  }

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id,
    },
    data,
    include: {
      category: true,
    },
  })

  return updatedTransaction
}

export async function deleteTransaction(id: string, userId: string) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  await prisma.transaction.delete({
    where: {
      id,
    },
  })
}

export async function getBalance(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
  })

  const balance = transactions.reduce((acc: number, transaction: { type: string; amount: number }) => {
    if (transaction.type === 'INCOME') {
      return acc + transaction.amount
    } else {
      return acc - transaction.amount
    }
  }, 0)

  return balance
} 