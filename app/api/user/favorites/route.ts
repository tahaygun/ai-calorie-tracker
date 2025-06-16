import { verifyAuthToken } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    const uid = decodedToken.uid;

    const favoritesDoc = await adminDb.collection('users').doc(uid).collection('data').doc('favorites').get();
    
    return NextResponse.json({ 
      favorites: favoritesDoc.exists ? favoritesDoc.data()?.favorites || [] : [] 
    });
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

    const { favorites } = await request.json();
    
    if (!favorites) {
      return NextResponse.json({ error: 'Favorites data is required' }, { status: 400 });
    }

    await adminDb.collection('users').doc(uid).collection('data').doc('favorites').set({
      favorites,
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
