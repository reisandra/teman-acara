export const cities = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Tangerang",
  "Depok",
  "Bekasi",
  "Yogyakarta",
  "Denpasar",
  "Malang",
  "Bogor",
  "Batam",
  "Pekanbaru",
  "Bandar Lampung",
  "Padang",
  "Manado",
  "Balikpapan",
  "Solo",
  "Cirebon",
  "Pontianak",
  "Samarinda",
  "Banjarmasin",
];

export const hobbies = [
  "Traveling",
  "Nonton Film",
  "Kuliner",
  "Fotografi",
  "Gaming",
  "Musik",
  "Olahraga",
  "Membaca",
  "Seni",
  "Memasak",
  "Hiking",
  "Yoga",
  "Renang",
  "Basket",
  "Badminton",
  "Sepak Bola",
  "Karaoke",
  "Belanja",
  "Kopi",
  "Podcast",
];

export const bookingPurposes = [
  "Nongkrong / Ngobrol",
  "Dinner / Makan Malam",
  "Traveling / Liburan",
  "Event / Acara",
  "Nonton Film",
  "Belanja",
  "Olahraga Bareng",
  "Kerja / Meeting",
  "Pesta / Party",
  "Lainnya",
];

export interface Talent {
  id: string;
  name: string;
  age: number;
  city: string;
  gender: "Pria" | "Wanita";
  photo: string;
  gallery: string[];
  skills: string[];
  bio: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  rules: string[];
  availability: "online" | "offline" | "both";
  verified: boolean;
}

export const talents: Talent[] = [
  {
    id: "1",
    name: "Aisyah Putri",
    age: 24,
    city: "Jakarta",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop",
    ],
    skills: ["Traveling", "Kuliner", "Fotografi"],
    bio: "Hai! Aku Aisyah, suka traveling dan eksplor tempat-tempat baru. Senang banget bisa jadi teman jalan kamu! Aku orangnya ramah dan easy going.",
    pricePerHour: 150000,
    rating: 4.9,
    reviewCount: 127,
    rules: ["Tidak ada kontak fisik berlebihan", "Booking minimal 2 jam", "Lokasi publik saja"],
    availability: "both",
    verified: true,
  },
  {
    id: "2",
    name: "Rafi Pratama",
    age: 27,
    city: "Bandung",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop",
    ],
    skills: ["Olahraga", "Gaming", "Musik"],
    bio: "Cowok Bandung yang suka ngobrol santai dan main game. Bisa jadi teman gym, nongkrong, atau sekadar ngopi bareng!",
    pricePerHour: 120000,
    rating: 4.7,
    reviewCount: 89,
    rules: ["Booking minimal 1 jam", "Bisa online atau offline"],
    availability: "both",
    verified: true,
  },
  {
    id: "3",
    name: "Maya Sari",
    age: 23,
    city: "Surabaya",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=800&fit=crop",
    ],
    skills: ["Nonton Film", "Karaoke", "Belanja"],
    bio: "Cewek Surabaya yang fun dan seru! Suka nonton film, karaoke, dan shopping. Yuk jadi teman hangout bareng!",
    pricePerHour: 130000,
    rating: 4.8,
    reviewCount: 156,
    rules: ["Lokasi publik", "Tidak menerima booking malam hari"],
    availability: "offline",
    verified: true,
  },
  {
    id: "4",
    name: "Dimas Arya",
    age: 26,
    city: "Yogyakarta",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=600&h=800&fit=crop",
    ],
    skills: ["Seni", "Fotografi", "Traveling"],
    bio: "Seniman Jogja yang suka eksplor budaya dan tempat-tempat unik. Cocok banget buat jadi guide atau teman ngobrol!",
    pricePerHour: 100000,
    rating: 4.6,
    reviewCount: 72,
    rules: ["Booking minimal 3 jam untuk traveling"],
    availability: "offline",
    verified: true,
  },
  {
    id: "5",
    name: "Sinta Dewi",
    age: 25,
    city: "Denpasar",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=600&h=800&fit=crop",
    ],
    skills: ["Yoga", "Hiking", "Kuliner"],
    bio: "Cewek Bali yang aktif dan sehat! Suka yoga, hiking, dan eksplor kuliner. Perfect companion for healthy lifestyle!",
    pricePerHour: 140000,
    rating: 4.9,
    reviewCount: 201,
    rules: ["Aktivitas outdoor diutamakan", "Tidak merokok"],
    availability: "both",
    verified: true,
  },
  {
    id: "6",
    name: "Andi Wijaya",
    age: 28,
    city: "Jakarta",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1507081323647-4d250478b919?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1480429370612-2cd0bf98cbfd?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&h=800&fit=crop",
    ],
    skills: ["Kerja", "Networking", "Kopi"],
    bio: "Professional companion untuk meeting, event bisnis, atau sekadar ngopi sambil brainstorming. Let's connect!",
    pricePerHour: 200000,
    rating: 4.8,
    reviewCount: 93,
    rules: ["Professional setting", "Bisa invoice untuk perusahaan"],
    availability: "both",
    verified: true,
  },
];

export interface Review {
  id: string;
  talentId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: "r1",
    talentId: "1",
    userName: "Budi Santoso",
    userPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Aisyah sangat ramah dan asik diajak ngobrol. Traveling ke Bali jadi lebih seru!",
    date: "2024-01-15",
  },
  {
    id: "r2",
    talentId: "1",
    userName: "Diana Putri",
    userPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Teman belanja yang asyik! Recommended banget.",
    date: "2024-01-10",
  },
  {
    id: "r3",
    talentId: "2",
    userName: "Rina Melati",
    userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    comment: "Rafi orangnya seru, cocok buat teman nongkrong!",
    date: "2024-01-12",
  },
];

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  role: string;
  comment: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Amelia",
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
    role: "Pengusaha",
    comment: "RentMate sangat membantu saya mencari teman untuk event bisnis. Professional dan aman!",
  },
  {
    id: "t2",
    name: "Ahmad Fauzi",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    role: "Traveler",
    comment: "Traveling sendirian jadi lebih seru dengan RentMate. Bisa dapat local guide yang asik!",
  },
  {
    id: "t3",
    name: "Lisa Permata",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    role: "Content Creator",
    comment: "Platform yang sangat user-friendly dan talent-nya berkualitas. Love it!",
  },
];

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: "user" | "talent";
  message: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export interface Booking {
  id: string;
  talentId: string;
  userId: string;
  duration: number;
  purpose: string;
  type: "online" | "offline";
  date: string;
  time: string;
  status: "active" | "completed" | "cancelled";
  totalPrice: number;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  bookingId: string;
  talentId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

// Mock bookings - each booking creates a unique chat
export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    talentId: "1",
    userId: "user1",
    duration: 2,
    purpose: "Nongkrong / Ngobrol",
    type: "offline",
    date: "2024-01-20",
    time: "14:00",
    status: "active",
    totalPrice: 300000,
    createdAt: "2024-01-18T10:00:00",
  },
  {
    id: "booking-2",
    talentId: "3",
    userId: "user1",
    duration: 3,
    purpose: "Traveling / Liburan",
    type: "offline",
    date: "2024-01-22",
    time: "10:00",
    status: "active",
    totalPrice: 390000,
    createdAt: "2024-01-19T15:00:00",
  },
  {
    id: "booking-3",
    talentId: "5",
    userId: "user1",
    duration: 2,
    purpose: "Olahraga Bareng",
    type: "offline",
    date: "2024-01-15",
    time: "07:00",
    status: "completed",
    totalPrice: 280000,
    createdAt: "2024-01-10T09:00:00",
  },
];

// Each booking has its own chat room with unique messages
export const mockChatRooms: ChatRoom[] = [
  {
    id: "chat-1",
    bookingId: "booking-1",
    talentId: "1",
    lastMessage: "Siap! Aku tunggu di lobby ya. Sampai ketemu! 😊",
    lastMessageTime: "2024-01-20T10:36:00",
    unreadCount: 2,
    messages: [
      {
        id: "m1-1",
        senderId: "user1",
        senderType: "user",
        message: "Halo Aisyah! Booking saya sudah dikonfirmasi ya?",
        timestamp: "2024-01-20T10:30:00",
        status: "read",
      },
      {
        id: "m1-2",
        senderId: "1",
        senderType: "talent",
        message: "Halo! Iya sudah dikonfirmasi. Kita ketemuan di mana ya?",
        timestamp: "2024-01-20T10:32:00",
        status: "read",
      },
      {
        id: "m1-3",
        senderId: "user1",
        senderType: "user",
        message: "Di Grand Indonesia ya, jam 2 siang. Bisa kan?",
        timestamp: "2024-01-20T10:35:00",
        status: "read",
      },
      {
        id: "m1-4",
        senderId: "1",
        senderType: "talent",
        message: "Siap! Aku tunggu di lobby ya. Sampai ketemu! 😊",
        timestamp: "2024-01-20T10:36:00",
        status: "delivered",
      },
    ],
  },
  {
    id: "chat-2",
    bookingId: "booking-2",
    talentId: "3",
    lastMessage: "Oke, besok ya! Jangan lupa bawa kamera 📸",
    lastMessageTime: "2024-01-19T15:20:00",
    unreadCount: 0,
    messages: [
      {
        id: "m2-1",
        senderId: "user1",
        senderType: "user",
        message: "Hai Maya! Aku booking untuk traveling ke Bromo nih",
        timestamp: "2024-01-19T15:00:00",
        status: "read",
      },
      {
        id: "m2-2",
        senderId: "3",
        senderType: "talent",
        message: "Wah seru banget! Aku udah pernah ke sana, tempatnya keren!",
        timestamp: "2024-01-19T15:05:00",
        status: "read",
      },
      {
        id: "m2-3",
        senderId: "user1",
        senderType: "user",
        message: "Asik! Kita berangkat jam 10 pagi ya dari Surabaya",
        timestamp: "2024-01-19T15:15:00",
        status: "read",
      },
      {
        id: "m2-4",
        senderId: "3",
        senderType: "talent",
        message: "Oke, besok ya! Jangan lupa bawa kamera 📸",
        timestamp: "2024-01-19T15:20:00",
        status: "read",
      },
    ],
  },
  {
    id: "chat-3",
    bookingId: "booking-3",
    talentId: "5",
    lastMessage: "Makasih ya udah yoga bareng! Next time lagi ya 🧘‍♀️",
    lastMessageTime: "2024-01-15T10:00:00",
    unreadCount: 0,
    messages: [
      {
        id: "m3-1",
        senderId: "user1",
        senderType: "user",
        message: "Hai Sinta! Aku mau yoga di pantai besok pagi",
        timestamp: "2024-01-14T20:00:00",
        status: "read",
      },
      {
        id: "m3-2",
        senderId: "5",
        senderType: "talent",
        message: "Perfect! Aku rekomendasiin Sanur Beach, sunrise-nya bagus banget",
        timestamp: "2024-01-14T20:15:00",
        status: "read",
      },
      {
        id: "m3-3",
        senderId: "user1",
        senderType: "user",
        message: "Terima kasih sessionnya tadi! Refreshing banget 😊",
        timestamp: "2024-01-15T09:30:00",
        status: "read",
      },
      {
        id: "m3-4",
        senderId: "5",
        senderType: "talent",
        message: "Makasih ya udah yoga bareng! Next time lagi ya 🧘‍♀️",
        timestamp: "2024-01-15T10:00:00",
        status: "read",
      },
    ],
  },
];

// Legacy export for backward compatibility
export const mockChats: ChatMessage[] = mockChatRooms[0]?.messages || [];
