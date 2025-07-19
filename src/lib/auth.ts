// auth.ts
import { supabase } from './supabase';

export const authService = {
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }

    return user;
  },

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
};
