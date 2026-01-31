import { supabase } from './supabase';
import { talents, reviews, mockBookings } from '@/data/mockData';

export const migrateTalentsToSupabase = async () => {
  try {
    for (const talent of talents) {
      const { error } = await supabase.from('talents').upsert({
        id: talent.id,
        name: talent.name,
        email: talent.email,
        photo: talent.photo,
        city: talent.city,
        price_per_hour: talent.pricePerHour,
        rating: talent.rating,
        skills: talent.skills,
        bio: talent.bio,
        is_verified: talent.verified,
        created_at: new Date().toISOString()
      });
      
      if (error) console.error('Error uploading talent:', error);
    }
    console.log('All talents migrated!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
