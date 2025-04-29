import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getBalance,
} from './services'
import {
  createTransactionSchema,
  transactionFiltersSchema,
  updateTransactionSchema,
} from './schemas'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (request: FastifyRequest) => {
    await request.jwtVerify()
  })

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = createTransactionSchema.parse(request.body)
    const userId = request.user.sub

    const transaction = await createTransaction(data, userId)

    return reply.status(201).send(transaction)
  })

  app.get('/balance', async (request: FastifyRequest) => {
    const userId = request.user.sub
    const balance = await getBalance(userId)
    return { balance }
  })

  app.get('/', async (request: FastifyRequest) => {
    const userId = request.user.sub
    const filters = transactionFiltersSchema.parse(request.query)

    const result = await getTransactions(userId, filters)
    return result
  })

  app.get('/:id', async (request: FastifyRequest) => {
    const { id } = request.params as { id: string }
    const userId = request.user.sub

    const transaction = await getTransactionById(id, userId)

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return transaction
  })

  app.put('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const data = updateTransactionSchema.parse(request.body)
    const userId = request.user.sub

    const transaction = await updateTransaction(id, data, userId)

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return reply.status(200).send(transaction)
  })

  app.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const userId = request.user.sub

    await deleteTransaction(id, userId)
    return reply.status(204).send()
  })
} 