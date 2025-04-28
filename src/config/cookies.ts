export const cookieConfig = {
  secret: process.env.COOKIE_SECRET || 'your-cookie-secret',
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
} 