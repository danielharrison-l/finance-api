import { prisma } from '@/lib/prisma'
import { CreateTransactionInput, TransactionFilters, UpdateTransactionInput } from './schemas'

export async function createTransaction(data: CreateTransactionInput, userId: string) {
  const category = await prisma.categories.findFirst({
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

  const transaction = await prisma.transactions.create({
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

export async function getTransactions(userId: string, filters: TransactionFilters) {
  const {
    categoryId,
    startDate,
    endDate,
    type,
    search,
    minAmount,
    maxAmount,
    page,
    limit,
    sortBy,
    order,
  } = filters

  const where = {
    userId,
    ...(categoryId && { categoryId }),
    ...(type && { type }),
    ...(search && {
      title: {
        contains: search,
        mode: 'insensitive' as const,
      },
    }),
    ...(startDate && {
      createdAt: {
        gte: new Date(startDate),
      },
    }),
    ...(endDate && {
      createdAt: {
        lte: new Date(endDate),
      },
    }),
    ...(minAmount && {
      amount: {
        gte: minAmount,
      },
    }),
    ...(maxAmount && {
      amount: {
        lte: maxAmount,
      },
    }),
  }

  const [total, transactions] = await Promise.all([
    prisma.transactions.count({ where }),
    prisma.transactions.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        [sortBy]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    transactions,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit,
    },
  }
}

export async function getTransactionById(transactionId: string, userId: string) {
  const id = parseInt(transactionId)
  
  const transaction = await prisma.transactions.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  return transaction
}

export async function updateTransaction(
  transactionId: string,
  data: UpdateTransactionInput,
  userId: string
) {
  const id = parseInt(transactionId)
  
  const transaction = await prisma.transactions.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  if (data.categoryId) {
    const category = await prisma.categories.findFirst({
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

  const updatedTransaction = await prisma.transactions.update({
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

export async function deleteTransaction(transactionId: string, userId: string) {
  const id = parseInt(transactionId)
  
  const transaction = await prisma.transactions.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  await prisma.transactions.delete({
    where: {
      id,
    },
  })
}

export async function getBalance(userId: string) {
  const transactions = await prisma.transactions.findMany({
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