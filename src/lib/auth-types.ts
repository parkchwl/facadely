export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  termsAgreed: boolean;
}
