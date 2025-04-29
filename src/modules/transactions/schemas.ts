import { z } from 'zod'

export const createTransactionSchema = z.object({
  title: z.string(),
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.number(),
})

export const updateTransactionSchema = z.object({
  title: z.string().optional(),
  amount: z.number().positive().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.number().optional(),
})

export const transactionFiltersSchema = z.object({
  categoryId: z.string().transform(Number).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  search: z.string().optional(),
  minAmount: z.string().transform(Number).optional(),
  maxAmount: z.string().transform(Number).optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  sortBy: z.enum(['title', 'amount', 'type', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type TransactionFilters = z.infer<typeof transactionFiltersSchema> 