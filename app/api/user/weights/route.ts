import { verifyAuthToken } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    const uid = decodedToken.uid;

    const weightsDoc = await adminDb.collection('users').doc(uid).collection('data').doc('weights').get();
    
    return NextResponse.json({ 
      weights: weightsDoc.exists ? weightsDoc.data()?.weights || [] : [] 
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

    const { weights } = await request.json();
    
    if (!weights) {
      return NextResponse.json({ error: 'Weight data is required' }, { status: 400 });
    }

    await adminDb.collection('users').doc(uid).collection('data').doc('weights').set({
      weights,
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
