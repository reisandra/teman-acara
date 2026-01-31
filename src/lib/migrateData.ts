import { supabase } from './supabase';
import { talents, reviews, mockBookings, testimonials } from '@/data/mockData';

// Upload Talents
export const uploadTalents = async () => {
  console.log('📤 Uploading talents...');
  
  for (const talent of talents) {
    const { error } = await supabase.from('talents').upsert({
      id: talent.id,
      name: talent.name,
      age: talent.age,
      city: talent.city,
      gender: talent.gender,
      photo: talent.photo,
      email: talent.email,
      skills: talent.skills,
      bio: talent.bio,
      price_per_hour: talent.pricePerHour,
      rating: talent.rating,
      review_count: talent.reviewCount,
      rules: talent.rules,
      availability: talent.availability,
      verified: talent.verified,
      created_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });
    
    if (error) {
      console.error(`❌ Error uploading ${talent.name}:`, error);
    } else {
      console.log(`✅ Uploaded: ${talent.name}`);
    }
  }
};

// Upload Reviews
export const uploadReviews = async () => {
  console.log('📤 Uploading reviews...');
  
  for (const review of reviews) {
    const { error } = await supabase.from('reviews').upsert({
      id: review.id,
      booking_id: review.id, // Sementara pakai review.id
      talent_id: review.talentId,
      user_id: 'user-' + review.id,
      user_name: review.userName,
      user_photo: review.userPhoto,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      created_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });
    
    if (error) {
      console.error(`❌ Error uploading review ${review.id}:`, error);
    } else {
      console.log(`✅ Uploaded review: ${review.id}`);
    }
  }
};

// Upload Bookings
export const uploadBookings = async () => {
  console.log('📤 Uploading bookings...');
  
  for (const booking of mockBookings) {
    const talent = talents.find(t => t.id === booking.talentId);
    
    const { error } = await supabase.from('bookings').upsert({
      id: booking.id,
      booker_id: booking.userId,
      booker_name: 'User Name', // Ganti dengan data user
      booker_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      talent_id: booking.talentId,
      talent_name: talent?.name || '',
      talent_photo: talent?.photo || '',
      purpose: booking.purpose,
      type: booking.type,
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      total: booking.totalPrice,
      status: booking.status,
      payment_status: 'pending',
      approval_status: 'pending_approval',
      created_at: booking.createdAt
    }, {
      onConflict: 'id'
    });
    
    if (error) {
      console.error(`❌ Error uploading booking ${booking.id}:`, error);
    } else {
      console.log(`✅ Uploaded booking: ${booking.id}`);
    }
  }
};

// Upload Testimonials
export const uploadTestimonials = async () => {
  console.log('📤 Uploading testimonials...');
  
  for (const testimonial of testimonials) {
    const { error } = await supabase.from('testimonials').upsert({
      id: testimonial.id,
      name: testimonial.name,
      photo: testimonial.photo,
      role: testimonial.role,
      comment: testimonial.comment,
      created_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });
    
    if (error) {
      console.error(`❌ Error uploading testimonial ${testimonial.id}:`, error);
    } else {
      console.log(`✅ Uploaded testimonial: ${testimonial.id}`);
    }
  }
};

// Master function
export const migrateAllData = async () => {
  try {
    await uploadTalents();
    await uploadReviews();
    await uploadBookings();
    await uploadTestimonials();
    console.log('🎉 All data migrated successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};