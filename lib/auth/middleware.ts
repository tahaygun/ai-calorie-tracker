import { adminAuth } from '@/lib/firebase/admin';
import { NextRequest } from 'next/server';

export async function verifyAuthToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export interface AuthenticatedRequest extends NextRequest {
  user: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export function createAuthenticatedRequest(request: NextRequest, user: any): AuthenticatedRequest {
  return {
    ...request,
    user: {
      uid: user.uid,
      email: user.email,
      name: user.name,
    },
  } as AuthenticatedRequest;
}
