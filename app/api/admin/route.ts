import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  // Hardcoded credentials (user can change)
  const validUsername = 'admin'
  const validPassword = '1234'

  if (username === validUsername && password === validPassword) {
    const response = NextResponse.json({ success: true })
    // Set httpOnly cookie
    response.cookies.set('session', 'authenticated', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    })
    return response
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}