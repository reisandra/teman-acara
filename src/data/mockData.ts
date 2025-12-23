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

// Unique photos for each pendamping - no duplicates, all professional/casual settings
export const talents: Talent[] = [
  {
    id: "1",
    name: "Aisyah Putri",
    age: 24,
    city: "Jakarta",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=600&h=800&fit=crop",
    ],
    skills: ["Traveling", "Kuliner", "Fotografi"],
    bio: "Hai! Aku Aisyah, suka traveling dan eksplor tempat-tempat baru. Senang banget bisa jadi teman jalan kamu! Aku orangnya ramah dan easy going.",
    pricePerHour: 150000,
    rating: 4.9,
    reviewCount: 127,
    rules: ["Hanya pendamping sosial", "Pemesanan minimal 2 jam", "Lokasi publik saja"],
    availability: "both",
    verified: true,
  },
  {
    id: "2",
    name: "Rafi Pratama",
    age: 27,
    city: "Bandung",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop",
    ],
    skills: ["Olahraga", "Gaming", "Musik"],
    bio: "Cowok Bandung yang suka ngobrol santai dan main game. Bisa jadi teman gym, nongkrong, atau sekadar ngopi bareng!",
    pricePerHour: 120000,
    rating: 4.7,
    reviewCount: 89,
    rules: ["Hanya pendamping sosial", "Bisa online atau offline"],
    availability: "both",
    verified: true,
  },
  {
    id: "3",
    name: "Maya Sari",
    age: 23,
    city: "Surabaya",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=600&h=800&fit=crop",
    ],
    skills: ["Nonton Film", "Karaoke", "Belanja"],
    bio: "Cewek Surabaya yang fun dan seru! Suka nonton film, karaoke, dan shopping. Yuk jadi teman hangout bareng!",
    pricePerHour: 130000,
    rating: 4.8,
    reviewCount: 156,
    rules: ["Hanya pendamping sosial", "Tidak menerima pemesanan malam hari"],
    availability: "offline",
    verified: true,
  },
  {
    id: "4",
    name: "Dimas Arya",
    age: 26,
    city: "Yogyakarta",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
    ],
    skills: ["Seni", "Fotografi", "Traveling"],
    bio: "Seniman Jogja yang suka eksplor budaya dan tempat-tempat unik. Cocok banget buat jadi guide atau teman ngobrol!",
    pricePerHour: 100000,
    rating: 4.6,
    reviewCount: 72,
    rules: ["Hanya pendamping sosial", "Pemesanan minimal 3 jam untuk traveling"],
    availability: "offline",
    verified: true,
  },
  {
    id: "5",
    name: "Sinta Dewi",
    age: 25,
    city: "Denpasar",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&h=800&fit=crop",
    ],
    skills: ["Yoga", "Hiking", "Kuliner"],
    bio: "Cewek Bali yang aktif dan sehat! Suka yoga, hiking, dan eksplor kuliner. Perfect companion for healthy lifestyle!",
    pricePerHour: 140000,
    rating: 4.9,
    reviewCount: 201,
    rules: ["Hanya pendamping sosial", "Aktivitas outdoor diutamakan", "Tidak merokok"],
    availability: "both",
    verified: true,
  },
  {
    id: "6",
    name: "Andi Wijaya",
    age: 28,
    city: "Jakarta",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1573497019236-61f323342eb4?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=600&h=800&fit=crop",
    ],
    skills: ["Kerja", "Networking", "Kopi"],
    bio: "Professional companion untuk meeting, event bisnis, atau sekadar ngopi sambil brainstorming. Let's connect!",
    pricePerHour: 200000,
    rating: 4.8,
    reviewCount: 93,
    rules: ["Professional setting", "Hanya pendamping sosial"],
    availability: "both",
    verified: true,
  },
  {
    id: "7",
    name: "Dewi Anggraini",
    age: 22,
    city: "Medan",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&h=800&fit=crop",
    ],
    skills: ["Kuliner", "Traveling", "Fotografi"],
    bio: "Foodie dari Medan! Suka eksplor kuliner nusantara dan traveling ke tempat-tempat baru. Yuk makan bareng!",
    pricePerHour: 110000,
    rating: 4.7,
    reviewCount: 64,
    rules: ["Hanya pendamping sosial", "Pemesanan minimal 2 jam", "Lokasi publik"],
    availability: "offline",
    verified: true,
  },
  {
    id: "8",
    name: "Fajar Nugroho",
    age: 29,
    city: "Semarang",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=600&h=800&fit=crop",
    ],
    skills: ["Olahraga", "Musik", "Gaming"],
    bio: "Cowok Semarang yang energik! Suka olahraga, main musik, dan gaming. Siap jadi teman seru kamu!",
    pricePerHour: 100000,
    rating: 4.5,
    reviewCount: 45,
    rules: ["Hanya pendamping sosial", "Bisa online atau offline", "Pemesanan fleksibel"],
    availability: "both",
    verified: true,
  },
  {
    id: "9",
    name: "Putri Handayani",
    age: 24,
    city: "Makassar",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1557862921-37829c790f19?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=800&fit=crop",
    ],
    skills: ["Belanja", "Kuliner", "Karaoke"],
    bio: "Cewek Makassar yang ramah! Hobi belanja, makan enak, dan karaoke. Ayo hangout bareng!",
    pricePerHour: 120000,
    rating: 4.8,
    reviewCount: 88,
    rules: ["Lokasi publik saja", "Hanya pendamping sosial", "Tidak ada kontak fisik"],
    availability: "offline",
    verified: true,
  },
  {
    id: "10",
    name: "Rizky Ramadhan",
    age: 25,
    city: "Palembang",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=600&h=800&fit=crop",
    ],
    skills: ["Traveling", "Fotografi", "Olahraga"],
    bio: "Cowok Palembang yang adventurous! Suka traveling, foto-foto, dan olahraga outdoor. Siap jadi guide lokal!",
    pricePerHour: 90000,
    rating: 4.6,
    reviewCount: 52,
    rules: ["Hanya pendamping sosial", "Pemesanan minimal 2 jam", "Outdoor activities preferred"],
    availability: "offline",
    verified: true,
  },
  {
    id: "11",
    name: "Anisa Rahma",
    age: 23,
    city: "Tangerang",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1502323777036-f29e3972f4e4?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop",
    ],
    skills: ["Nonton Film", "Kopi", "Membaca"],
    bio: "Bookworm yang suka nongkrong di cafe! Perfect untuk teman ngobrol sambil ngopi atau nonton film bareng.",
    pricePerHour: 110000,
    rating: 4.7,
    reviewCount: 73,
    rules: ["Hanya pendamping sosial", "Lokasi cafe atau bioskop", "Pemesanan minimal 2 jam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "12",
    name: "Bima Sakti",
    age: 27,
    city: "Depok",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=600&h=800&fit=crop",
    ],
    skills: ["Gaming", "Musik", "Podcast"],
    bio: "Gamer dan podcaster! Suka ngobrol tentang tech, gaming, dan musik. Bisa jadi teman diskusi yang asik!",
    pricePerHour: 100000,
    rating: 4.5,
    reviewCount: 41,
    rules: ["Hanya pendamping sosial", "Bisa online atau offline", "Fleksibel"],
    availability: "both",
    verified: true,
  },
  {
    id: "13",
    name: "Citra Lestari",
    age: 26,
    city: "Bekasi",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&h=800&fit=crop",
    ],
    skills: ["Belanja", "Kuliner", "Traveling"],
    bio: "Shopping buddy yang asyik! Suka eksplor mall, cari hidden gems kuliner, dan traveling weekend.",
    pricePerHour: 130000,
    rating: 4.8,
    reviewCount: 95,
    rules: ["Hanya pendamping sosial", "Lokasi publik", "Pemesanan minimal 3 jam untuk shopping"],
    availability: "offline",
    verified: true,
  },
  {
    id: "14",
    name: "Eko Prasetyo",
    age: 30,
    city: "Malang",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1480429370612-2cd0bf98cbfd?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1557862921-37829c790f19?w=600&h=800&fit=crop",
    ],
    skills: ["Hiking", "Fotografi", "Kopi"],
    bio: "Local guide Malang! Tau tempat-tempat keren untuk hiking dan cafe aesthetic. Yuk eksplor Malang bareng!",
    pricePerHour: 95000,
    rating: 4.9,
    reviewCount: 112,
    rules: ["Hanya pendamping sosial", "Outdoor activities", "Pemesanan minimal 4 jam untuk hiking"],
    availability: "offline",
    verified: true,
  },
  {
    id: "15",
    name: "Fitri Amalia",
    age: 22,
    city: "Bogor",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=600&h=800&fit=crop",
    ],
    skills: ["Kuliner", "Hiking", "Fotografi"],
    bio: "Cewek Bogor yang suka nature! Hiking ke Puncak, eksplor kebun teh, atau hunting kuliner. Let's go!",
    pricePerHour: 100000,
    rating: 4.6,
    reviewCount: 58,
    rules: ["Hanya pendamping sosial", "Aktivitas outdoor", "Pemesanan minimal 3 jam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "16",
    name: "Gilang Permana",
    age: 28,
    city: "Batam",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
    ],
    skills: ["Traveling", "Renang", "Kuliner"],
    bio: "Island hopper dari Batam! Tau semua spot pantai dan island keren. Perfect companion untuk beach trip!",
    pricePerHour: 140000,
    rating: 4.7,
    reviewCount: 67,
    rules: ["Hanya pendamping sosial", "Pemesanan minimal 4 jam", "Beach activities"],
    availability: "offline",
    verified: true,
  },
  {
    id: "17",
    name: "Hana Safira",
    age: 24,
    city: "Pekanbaru",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    ],
    skills: ["Kuliner", "Belanja", "Karaoke"],
    bio: "Cewek Pekanbaru yang fun! Suka jajan, belanja, dan karaoke. Siap jadi teman hangout yang seru!",
    pricePerHour: 105000,
    rating: 4.6,
    reviewCount: 49,
    rules: ["Hanya pendamping sosial", "Lokasi publik", "Tidak ada pemesanan malam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "18",
    name: "Irfan Hakim",
    age: 26,
    city: "Bandar Lampung",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553267751-1c148a7280a1?w=600&h=800&fit=crop",
    ],
    skills: ["Olahraga", "Traveling", "Fotografi"],
    bio: "Adventure seeker dari Lampung! Suka explore alam, olahraga outdoor, dan dokumentasi perjalanan.",
    pricePerHour: 95000,
    rating: 4.5,
    reviewCount: 38,
    rules: ["Hanya pendamping sosial", "Outdoor preferred", "Pemesanan fleksibel"],
    availability: "both",
    verified: true,
  },
  {
    id: "19",
    name: "Julia Puspita",
    age: 25,
    city: "Padang",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1502767089025-6572583495f9?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=600&h=800&fit=crop",
    ],
    skills: ["Kuliner", "Traveling", "Seni"],
    bio: "Pecinta kuliner Padang! Tau semua tempat makan enak dan hidden gems. Yuk wisata kuliner bareng!",
    pricePerHour: 100000,
    rating: 4.8,
    reviewCount: 76,
    rules: ["Hanya pendamping sosial", "Lokasi restoran atau cafe", "Pemesanan minimal 2 jam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "20",
    name: "Kevin Susanto",
    age: 27,
    city: "Manado",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    ],
    skills: ["Renang", "Traveling", "Kuliner"],
    bio: "Diving enthusiast dari Manado! Tau spot snorkeling dan diving terbaik. Perfect buddy untuk water activities!",
    pricePerHour: 150000,
    rating: 4.9,
    reviewCount: 89,
    rules: ["Hanya pendamping sosial", "Water activities", "Pemesanan minimal 4 jam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "21",
    name: "Laras Wulandari",
    age: 23,
    city: "Balikpapan",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=600&h=800&fit=crop",
    ],
    skills: ["Kopi", "Nonton Film", "Belanja"],
    bio: "Coffee addict dari Balikpapan! Tau semua cafe keren dan bioskop comfortable. Yuk nongkrong bareng!",
    pricePerHour: 110000,
    rating: 4.6,
    reviewCount: 54,
    rules: ["Hanya pendamping sosial", "Cafe atau mall", "Lokasi publik"],
    availability: "offline",
    verified: true,
  },
  {
    id: "22",
    name: "Muhammad Faisal",
    age: 29,
    city: "Solo",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=800&fit=crop",
    ],
    skills: ["Seni", "Musik", "Traveling"],
    bio: "Pecinta budaya Jawa! Expert tentang sejarah Solo, keraton, dan seni tradisional. Local guide terbaik!",
    pricePerHour: 90000,
    rating: 4.8,
    reviewCount: 98,
    rules: ["Hanya pendamping sosial", "Cultural tours", "Booking minimal 3 jam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "23",
    name: "Nadia Kusuma",
    age: 24,
    city: "Cirebon",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573496799822-b0ebb5e5e5e5?w=600&h=800&fit=crop",
    ],
    skills: ["Kuliner", "Traveling", "Fotografi"],
    bio: "Cirebon food explorer! Tau semua warung legendaris dan spot foto aesthetic. Kuliner trip specialist!",
    pricePerHour: 95000,
    rating: 4.7,
    reviewCount: 62,
    rules: ["Hanya pendamping sosial", "Food tours", "Booking minimal 2 jam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "24",
    name: "Oscar Wijaya",
    age: 26,
    city: "Pontianak",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=600&h=800&fit=crop",
    ],
    skills: ["Traveling", "Kuliner", "Fotografi"],
    bio: "Explorer Kalimantan Barat! Tau tempat-tempat hidden gem dan kuliner autentik. Yuk explore bareng!",
    pricePerHour: 100000,
    rating: 4.5,
    reviewCount: 43,
    rules: ["Hanya pendamping sosial", "Adventure trips", "Booking fleksibel"],
    availability: "both",
    verified: true,
  },
  {
    id: "25",
    name: "Patricia Angeline",
    age: 22,
    city: "Samarinda",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=600&h=800&fit=crop",
    ],
    skills: ["Belanja", "Karaoke", "Kuliner"],
    bio: "Fun girl dari Samarinda! Suka hangout, karaoke, dan eksplor tempat makan. Siap jadi bestie seharian!",
    pricePerHour: 105000,
    rating: 4.6,
    reviewCount: 47,
    rules: ["Hanya pendamping sosial", "Lokasi publik", "No late night booking"],
    availability: "offline",
    verified: true,
  },
  {
    id: "26",
    name: "Qori Akbar",
    age: 28,
    city: "Banjarmasin",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop",
    ],
    skills: ["Traveling", "Fotografi", "Kuliner"],
    bio: "Pasar Terapung expert! Local guide untuk wisata sungai dan kuliner Banjarmasin. Authentic experience!",
    pricePerHour: 95000,
    rating: 4.7,
    reviewCount: 56,
    rules: ["Hanya pendamping sosial", "River tours", "Booking minimal 3 jam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "27",
    name: "Rina Maharani",
    age: 25,
    city: "Jakarta",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop",
    ],
    skills: ["Networking", "Kopi", "Kerja"],
    bio: "Business companion Jakarta! Siap menemani meeting, networking event, atau sekadar brainstorming di cafe.",
    pricePerHour: 180000,
    rating: 4.9,
    reviewCount: 87,
    rules: ["Professional setting", "Hanya pendamping sosial", "Booking minimal 2 jam"],
    availability: "both",
    verified: true,
  },
  {
    id: "28",
    name: "Satria Wibowo",
    age: 30,
    city: "Surabaya",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
    ],
    skills: ["Kerja", "Networking", "Olahraga"],
    bio: "Executive companion Surabaya! Pengalaman menemani meeting bisnis, golf, atau dinner formal.",
    pricePerHour: 220000,
    rating: 4.8,
    reviewCount: 71,
    rules: ["Business attire", "Hanya pendamping sosial", "Professional conduct"],
    availability: "both",
    verified: true,
  },
  {
    id: "29",
    name: "Tiara Permatasari",
    age: 23,
    city: "Bandung",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573496799822-b0ebb5e5e5e5?w=600&h=800&fit=crop",
    ],
    skills: ["Kopi", "Fotografi", "Musik"],
    bio: "Cafe hopper Bandung! Tau semua cafe aesthetic dan live music venue. Perfect untuk quality time!",
    pricePerHour: 115000,
    rating: 4.7,
    reviewCount: 83,
    rules: ["Hanya pendamping sosial", "Cafe setting", "Booking minimal 2 jam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "30",
    name: "Umar Farhan",
    age: 27,
    city: "Yogyakarta",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=800&fit=crop",
    ],
    skills: ["Seni", "Fotografi", "Musik"],
    bio: "Seniman dan musisi Jogja! Bisa jadi guide untuk wisata seni, galeri, atau live music venue.",
    pricePerHour: 90000,
    rating: 4.6,
    reviewCount: 59,
    rules: ["Hanya pendamping sosial", "Art & culture focused", "Booking fleksibel"],
    availability: "both",
    verified: true,
  },
  {
    id: "31",
    name: "Vera Anjani",
    age: 24,
    city: "Denpasar",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=600&h=800&fit=crop",
    ],
    skills: ["Yoga", "Meditasi", "Kuliner"],
    bio: "Wellness companion Bali! Bisa temani yoga, meditasi, atau eksplor healthy cafe. Mind, body, soul!",
    pricePerHour: 135000,
    rating: 4.9,
    reviewCount: 104,
    rules: ["Hanya pendamping sosial", "Wellness focused", "No smoking"],
    availability: "both",
    verified: true,
  },
  {
    id: "32",
    name: "Wahyu Pratama",
    age: 26,
    city: "Jakarta",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop",
    ],
    skills: ["Gaming", "Nonton Film", "Kuliner"],
    bio: "Gaming buddy Jakarta! Bisa temani main di gaming cafe, nonton premiere, atau hunting street food.",
    pricePerHour: 100000,
    rating: 4.5,
    reviewCount: 48,
    rules: ["Hanya pendamping sosial", "Casual setting", "Booking fleksibel"],
    availability: "both",
    verified: true,
  },
  {
    id: "33",
    name: "Xena Maharani",
    age: 22,
    city: "Medan",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573496799822-b0ebb5e5e5e5?w=600&h=800&fit=crop",
    ],
    skills: ["Belanja", "Kuliner", "Fotografi"],
    bio: "Shopping and foodie expert Medan! Tau semua mall dan tempat makan legendaris. Yuk jalan bareng!",
    pricePerHour: 110000,
    rating: 4.7,
    reviewCount: 66,
    rules: ["Hanya pendamping sosial", "Daytime preferred", "Public location"],
    availability: "offline",
    verified: true,
  },
  {
    id: "34",
    name: "Yoga Aditya",
    age: 29,
    city: "Semarang",
    gender: "Pria",
    photo: "https://images.unsplash.com/photo-1480429370612-2cd0bf98cbfd?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    ],
    skills: ["Traveling", "Fotografi", "Hiking"],
    bio: "Adventure photographer Semarang! Bisa jadi guide untuk trip ke Dieng, Karimunjawa, atau sekitar.",
    pricePerHour: 105000,
    rating: 4.8,
    reviewCount: 77,
    rules: ["Hanya pendamping sosial", "Adventure trips", "Booking minimal 4 jam"],
    availability: "offline",
    verified: true,
  },
  {
    id: "35",
    name: "Zahra Putri",
    age: 25,
    city: "Makassar",
    gender: "Wanita",
    photo: "https://images.unsplash.com/photo-1573496799822-b0ebb5e5e5e5?w=400&h=400&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=600&h=800&fit=crop",
    ],
    skills: ["Kuliner", "Traveling", "Renang"],
    bio: "Seafood hunter Makassar! Expert kuliner laut dan spot pantai tersembunyi. Beach and food trip specialist!",
    pricePerHour: 125000,
    rating: 4.8,
    reviewCount: 91,
    rules: ["Hanya pendamping sosial", "Coastal activities", "Booking minimal 3 jam"],
    availability: "offline",
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

// Reviews with unique reviewers - different photos and comments
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
    userPhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Teman belanja yang asyik! Recommended banget untuk shopping trip.",
    date: "2024-01-10",
  },
  {
    id: "r3",
    talentId: "2",
    userName: "Rina Melati",
    userPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    comment: "Rafi orangnya seru dan humble, cocok buat teman nongkrong santai!",
    date: "2024-01-12",
  },
  {
    id: "r4",
    talentId: "3",
    userName: "Eko Wijaya",
    userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Maya tau banyak tempat karaoke keren di Surabaya. Seru banget!",
    date: "2024-01-08",
  },
  {
    id: "r5",
    talentId: "4",
    userName: "Sari Dewi",
    userPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Dimas jadi guide wisata budaya yang sangat informatif. Jogja trip jadi berkesan!",
    date: "2024-01-05",
  },
  {
    id: "r6",
    talentId: "5",
    userName: "Andi Prasetyo",
    userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Yoga session sama Sinta bikin refreshing. Tempatnya juga bagus pilihannya!",
    date: "2024-01-03",
  },
  {
    id: "r7",
    talentId: "6",
    userName: "Maya Kusuma",
    userPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Andi sangat professional, menemani meeting bisnis dengan baik.",
    date: "2024-01-02",
  },
  {
    id: "r8",
    talentId: "7",
    userName: "Reza Firmansyah",
    userPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    comment: "Dewi tau semua hidden gem kuliner Medan. Mantap rekomendasinya!",
    date: "2023-12-28",
  },
  {
    id: "r9",
    talentId: "8",
    userName: "Linda Wati",
    userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Fajar asik banget diajak ngobrol, teman gym yang supportive!",
    date: "2023-12-25",
  },
  {
    id: "r10",
    talentId: "9",
    userName: "Ahmad Fadli",
    userPhoto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Putri teman shopping yang tau banyak discount. Super helpful!",
    date: "2023-12-22",
  },
  {
    id: "r11",
    talentId: "10",
    userName: "Dewi Kartika",
    userPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    comment: "Rizky guide yang sabar dan tau banyak spot foto bagus di Palembang.",
    date: "2023-12-20",
  },
  {
    id: "r12",
    talentId: "11",
    userName: "Faisal Rahman",
    userPhoto: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Anisa teman nonton yang asik, selera filmnya bagus banget!",
    date: "2023-12-18",
  },
  {
    id: "r13",
    talentId: "12",
    userName: "Indah Permata",
    userPhoto: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    comment: "Bima asik diajak diskusi tentang gaming dan tech. Knowledgeable!",
    date: "2023-12-15",
  },
  {
    id: "r14",
    talentId: "13",
    userName: "Joko Susilo",
    userPhoto: "https://images.unsplash.com/photo-1480429370612-2cd0bf98cbfd?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Citra shopping buddy terbaik! Tau semua promo dan tempat bagus.",
    date: "2023-12-12",
  },
  {
    id: "r15",
    talentId: "14",
    userName: "Kartini Dewi",
    userPhoto: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Eko local guide Malang terbaik! Hiking ke Bromo jadi memorable banget.",
    date: "2023-12-10",
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
    photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face",
    role: "Pengusaha",
    comment: "RentMate sangat membantu saya mencari teman untuk event bisnis. Professional dan aman!",
  },
  {
    id: "t2",
    name: "Ahmad Fauzi",
    photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&h=200&fit=crop&crop=face",
    role: "Traveler",
    comment: "Traveling sendirian jadi lebih seru dengan RentMate. Bisa dapat local guide yang asik!",
  },
  {
    id: "t3",
    name: "Lisa Permata",
    photo: "https://images.unsplash.com/photo-1502323777036-f29e3972f4e4?w=200&h=200&fit=crop&crop=face",
    role: "Content Creator",
    comment: "Platform yang sangat user-friendly dan pendampingnya berkualitas. Love it!",
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

// Contextual chat responses based on message content
export const getContextualResponse = (userMessage: string, talentName: string): string => {
  const message = userMessage.toLowerCase();
  
  // Time/Schedule related
  if (message.includes("jam") || message.includes("waktu") || message.includes("kapan") || message.includes("schedule")) {
    const responses = [
      `Aku available mulai jam 10 pagi sampai jam 8 malam ya. Kamu prefer jam berapa?`,
      `Untuk besok aku free sepanjang hari. Mau ketemuan jam berapa?`,
      `Oke, jam segitu aku bisa. Langsung confirm ya!`,
      `Waktunya pas banget, aku lagi free jam segitu!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Location related
  if (message.includes("dimana") || message.includes("lokasi") || message.includes("tempat") || message.includes("alamat") || message.includes("ketemu")) {
    const responses = [
      `Aku biasanya prefer ketemuan di tempat publik yang nyaman. Ada preferensi cafe atau mall?`,
      `Gimana kalau kita ketemu di lobby mall aja? Lebih gampang nyarinya`,
      `Aku bisa menyesuaikan dengan lokasimu kok. Kamu lebih prefer di daerah mana?`,
      `Oke, aku cari lokasi yang enak untuk kita hangout ya!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Price/Payment related
  if (message.includes("harga") || message.includes("bayar") || message.includes("biaya") || message.includes("tarif")) {
    const responses = [
      `Untuk detail harga sudah ada di profil aku ya. Ada yang mau ditanyakan lagi?`,
      `Harga sudah include semua, tidak ada biaya tambahan. Tenang aja!`,
      `Pembayaran bisa langsung lewat platform, aman dan terjamin!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Activity related
  if (message.includes("ngapain") || message.includes("aktivitas") || message.includes("plan") || message.includes("acara")) {
    const responses = [
      `Kita bisa sesuaikan dengan mood kamu nanti. Mau santai atau eksplor?`,
      `Aku punya beberapa rekomendasi tempat seru! Nanti aku share ya`,
      `Kita bisa ngobrol dulu, terus lanjut ke aktivitas yang kamu mau`,
      `Bebas mau ngapain aja, yang penting kita enjoy bareng! 😊`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Greeting
  if (message.includes("halo") || message.includes("hai") || message.includes("hi") || message.includes("hey")) {
    const responses = [
      `Hai juga! Senang bisa connect sama kamu. Ada yang bisa aku bantu?`,
      `Halo! Makasih udah booking aku. Yuk kita koordinasi untuk ketemuan nanti`,
      `Hey! Excited banget nih buat hangout bareng! 😊`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Thank you
  if (message.includes("terima kasih") || message.includes("makasih") || message.includes("thanks")) {
    const responses = [
      `Sama-sama! Senang bisa bantu 😊`,
      `No problem! Kalau ada yang perlu ditanyain lagi, feel free ya!`,
      `Makasih juga udah percaya sama aku!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Confirmation
  if (message.includes("oke") || message.includes("ok") || message.includes("siap") || message.includes("deal")) {
    const responses = [
      `Oke siap! Sampai ketemu nanti ya! 👋`,
      `Perfect! Aku tunggu kabar selanjutnya`,
      `Noted! Kalau ada perubahan, langsung kabarin aja ya`,
      `Siap! Excited banget nih! 😊`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Food/Culinary
  if (message.includes("makan") || message.includes("kuliner") || message.includes("resto") || message.includes("cafe")) {
    const responses = [
      `Wah, aku tau beberapa tempat makan enak di sekitar sini! Mau coba?`,
      `Aku punya list cafe aesthetic yang bagus buat foto-foto juga 📸`,
      `Kalau soal kuliner, serahkan sama aku! Aku tau hidden gems-nya`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Default responses
  const defaultResponses = [
    `Oke, noted! Ada lagi yang mau dibahas?`,
    `Sip, aku mengerti. Lanjut ke hal lain?`,
    `Baik, terima kasih infonya!`,
    `Oke, aku catat ya. Kalau ada perubahan, langsung kabarin!`,
    `Got it! Sampai ketemu nanti ya 😊`,
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// Legacy export for backward compatibility
export const mockChats: ChatMessage[] = mockChatRooms[0]?.messages || [];
