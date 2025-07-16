import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { registerUser, authenticateUser } from './services'
import { createUserSchema, loginSchema } from './schemas'
import { cookieConfig } from '@/config/cookies'
import { prisma } from '@/lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email, password, phone } = createUserSchema.parse(request.body)

    const { user } = await registerUser({
      name,
      email,
      password,
      phone,
    })

    const token = await reply.jwtSign(
      { sub: user.id },
      {
        sign: {
          sub: user.id,
        },
      }
    )

    reply.setCookie('token', token, cookieConfig.options)

    return reply.status(201).send({
      user,
    })
  })

  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = loginSchema.parse(request.body)

      const { user } = await authenticateUser({
        email,
        password,
      })

      const token = await reply.jwtSign(
        { sub: user.id },
        {
          sign: {
            sub: user.id,
          },
        }
      )

      reply.setCookie('token', token, cookieConfig.options)

      return reply.status(200).send({
        user,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        return reply.status(401).send({ message: 'Credenciais inválidas' })
      }
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })

  app.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie('token', cookieConfig.options)
    return reply.status(200).send()
  })

  app.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
      const userId = request.user.sub
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true }
      })
      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }
      return reply.send({ user })
    } catch {
      return reply.status(401).send({ message: 'Não autenticado' })
    }
  })
}
