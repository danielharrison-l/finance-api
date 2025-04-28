import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(3),
  type: z.enum(['INCOME', 'EXPENSE']),
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema> 