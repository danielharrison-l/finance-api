import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './services'
import { createCategorySchema, updateCategorySchema } from './schemas'

export async function categoryRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (request: FastifyRequest) => {
    await request.jwtVerify()
  })

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, type } = createCategorySchema.parse(request.body)
    const userId = request.user.sub

    const category = await createCategory({ name, type }, userId)

    return reply.status(201).send(category)
  })

  app.get('/', async (request: FastifyRequest) => {
    const userId = request.user.sub
    const categories = await getCategories(userId)
    return categories
  })

  app.get('/:id', async (request: FastifyRequest) => {
    const { id } = request.params as { id: string }
    const userId = request.user.sub
    const category = await getCategoryById(id, userId)
    return category
  })

  app.put('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const data = updateCategorySchema.parse(request.body)
    const userId = request.user.sub

    const category = await updateCategory(id, data, userId)
    return reply.status(200).send(category)
  })

  app.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const userId = request.user.sub

    await deleteCategory(id, userId)
    return reply.status(204).send()
  })
} 