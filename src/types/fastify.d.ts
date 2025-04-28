import { FastifyInstance, FastifyRequest } from 'fastify'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      sub: string
    }
  }
} 