import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  let session = null;
  try {
    const cookieStore = await cookies();
    session = cookieStore.get('session');
  } catch (error) {
    console.error('Error accessing cookies:', error);
    // Si falla, asumimos que no hay sesión
    session = null;
  }

  if (session && session.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json({ authenticated: false });
  }
}