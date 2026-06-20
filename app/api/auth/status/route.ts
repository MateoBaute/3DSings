import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  
  const hasSession = cookieStore.has('session');

  if (hasSession) {
    return NextResponse.json(
      { authenticated: true }, 
      { status: 200 }
    );
  }

  return NextResponse.json(
    { authenticated: false, message: 'No se encontró la sesión' }, 
    { status: 401 }
  );
}
