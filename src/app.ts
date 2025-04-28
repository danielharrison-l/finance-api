import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import { authRoutes } from './modules/auth/routes'
import { categoryRoutes } from './modules/categories/routes'
import { transactionRoutes } from './modules/transactions/routes'
import { cookieConfig } from './config/cookies'

export const app = fastify()

app.register(cors, {
  origin: true,
  credentials: true,
})

app.register(cookie, {
  secret: cookieConfig.secret,
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-token',
  sign: {
    sub: '',
  },
  cookie: {
    cookieName: 'token',
    signed: false,
    ...cookieConfig.options,
  },
})

app.register(authRoutes, { prefix: '/auth' })
app.register(categoryRoutes, { prefix: '/categories' })
app.register(transactionRoutes, { prefix: '/transactions' }) 