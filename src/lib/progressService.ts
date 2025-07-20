import { supabase } from './supabase';
import { authService } from './auth';

export const progressService = {
  async incrementTestCompletion(): Promise<void> {
    const user = await authService.getCurrentUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        tests_completed: supabase.sql`tests_completed + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating test completion:', error);
    }
  },

  async addStudyTime(minutes: number): Promise<void> {
    const user = await authService.getCurrentUser();
    if (!user) return;

    const hours = minutes / 60;
    const { error } = await supabase
      .from('profiles')
      .update({
        total_study_hours: supabase.sql`total_study_hours + ${hours}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating study time:', error);
    }
  }
};