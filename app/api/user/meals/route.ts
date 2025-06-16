import { verifyAuthToken } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    const uid = decodedToken.uid;

    // Get user's meals for a specific date
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const mealsDoc = await adminDb.collection('users').doc(uid).collection('meals').doc(date).get();
    
    if (!mealsDoc.exists) {
      return NextResponse.json({ meals: [] });
    }

    return NextResponse.json({ meals: mealsDoc.data()?.meals || [] });
  } catch (error: any) {
    console.error('API Error:', error);
    
    if (error.message.includes('token') || error.message.includes('authorization')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    const uid = decodedToken.uid;

    const { date, meals } = await request.json();
    
    if (!date || !meals) {
      return NextResponse.json({ error: 'Date and meals are required' }, { status: 400 });
    }

    await adminDb.collection('users').doc(uid).collection('meals').doc(date).set({
      meals,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error:', error);
    
    if (error.message.includes('token') || error.message.includes('authorization')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
