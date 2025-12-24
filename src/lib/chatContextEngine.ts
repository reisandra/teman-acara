// Chat Context Engine - Multi-topic conversation with full context awareness
// Generates natural responses based on entire conversation history

import { ChatMessage } from "./chatStore";

interface ConversationContext {
  recentTopics: string[];
  lastTopic: string | null;
  messageCount: number;
  userMood: "casual" | "formal" | "excited" | "neutral";
  hasGreeted: boolean;
}

// Analyze conversation to extract context
function analyzeConversation(messages: ChatMessage[]): ConversationContext {
  const topics: string[] = [];
  let userMood: ConversationContext["userMood"] = "neutral";
  let hasGreeted = false;

  messages.forEach((msg) => {
    const text = msg.message.toLowerCase();

    // Detect greetings
    if (text.match(/\b(halo|hai|hi|hey|hallo)\b/)) {
      hasGreeted = true;
    }

    // Detect topics
    if (text.match(/\b(jam|waktu|kapan|schedule)\b/)) topics.push("schedule");
    if (text.match(/\b(dimana|lokasi|tempat|alamat|ketemu)\b/)) topics.push("location");
    if (text.match(/\b(harga|bayar|biaya|tarif|uang)\b/)) topics.push("payment");
    if (text.match(/\b(makan|kuliner|resto|cafe|kopi)\b/)) topics.push("food");
    if (text.match(/\b(film|movie|bioskop|nonton)\b/)) topics.push("movies");
    if (text.match(/\b(hobi|suka|interest|minat)\b/)) topics.push("hobbies");
    if (text.match(/\b(kerja|kerjaan|kantor|profesi)\b/)) topics.push("work");
    if (text.match(/\b(musik|lagu|band|playlist)\b/)) topics.push("music");
    if (text.match(/\b(game|gaming|main)\b/)) topics.push("gaming");
    if (text.match(/\b(travel|jalan|liburan|wisata)\b/)) topics.push("travel");
    if (text.match(/\b(cuaca|hujan|panas|dingin)\b/)) topics.push("weather");
    if (text.match(/\b(ngapain|aktivitas|plan|acara)\b/)) topics.push("activity");

    // Detect mood
    if (text.match(/[!]{2,}|😊|🎉|excited|senang|happy/)) {
      userMood = "excited";
    } else if (text.match(/\b(tolong|mohon|bisa|apakah)\b/)) {
      userMood = "formal";
    } else if (text.match(/\b(santai|chill|wkwk|haha|lol)\b/)) {
      userMood = "casual";
    }
  });

  // Get unique recent topics (last 3)
  const uniqueTopics = [...new Set(topics)].slice(-3);

  return {
    recentTopics: uniqueTopics,
    lastTopic: uniqueTopics[uniqueTopics.length - 1] || null,
    messageCount: messages.length,
    userMood,
    hasGreeted,
  };
}

// Detect the intent of the current message
function detectIntent(message: string): string {
  const text = message.toLowerCase();

  // Greeting
  if (text.match(/\b(halo|hai|hi|hey|hallo)\b/)) return "greeting";

  // Questions
  if (text.includes("?") || text.match(/\b(apa|siapa|dimana|kapan|gimana|bagaimana|kenapa|mengapa)\b/)) {
    return "question";
  }

  // Agreement/Confirmation
  if (text.match(/\b(oke|ok|siap|deal|setuju|boleh|iya|yoi|yup|ya)\b/)) return "confirmation";

  // Thanks
  if (text.match(/\b(terima kasih|makasih|thanks|thank you)\b/)) return "thanks";

  // Topic-specific
  if (text.match(/\b(jam|waktu|kapan|schedule)\b/)) return "schedule";
  if (text.match(/\b(dimana|lokasi|tempat|alamat|ketemu)\b/)) return "location";
  if (text.match(/\b(harga|bayar|biaya|tarif)\b/)) return "payment";
  if (text.match(/\b(makan|kuliner|resto|cafe|kopi)\b/)) return "food";
  if (text.match(/\b(film|movie|bioskop|nonton)\b/)) return "movies";
  if (text.match(/\b(hobi|suka|interest|minat)\b/)) return "hobbies";
  if (text.match(/\b(kerja|kerjaan|kantor|profesi)\b/)) return "work";
  if (text.match(/\b(musik|lagu|band|playlist)\b/)) return "music";
  if (text.match(/\b(game|gaming|main)\b/)) return "gaming";
  if (text.match(/\b(travel|jalan|liburan|wisata)\b/)) return "travel";
  if (text.match(/\b(cuaca|hujan|panas|dingin)\b/)) return "weather";
  if (text.match(/\b(ngapain|aktivitas|plan|acara)\b/)) return "activity";

  // Short casual messages
  if (text.length < 20) return "casual";

  return "general";
}

// Generate context-aware response
export function generateContextualResponse(
  currentMessage: string,
  messageHistory: ChatMessage[],
  talentName: string
): string {
  const context = analyzeConversation(messageHistory);
  const intent = detectIntent(currentMessage);
  const messageText = currentMessage.toLowerCase();

  // Response pools organized by intent and context
  const responses: Record<string, string[]> = {
    greeting: context.hasGreeted
      ? [
          `Hey, apa kabar? Ada yang mau dibahas lagi?`,
          `Halo lagi! What's up?`,
          `Hai! Yuk lanjut ngobrol 😊`,
        ]
      : [
          `Hai juga! Senang bisa ngobrol sama kamu. Ada yang mau ditanyain?`,
          `Halo! Makasih udah booking aku. Yuk kita kenalan dulu!`,
          `Hey! Excited banget buat hangout bareng! Ada rencana apa nih? 😊`,
        ],

    schedule: [
      `Aku available mulai jam 10 pagi sampai jam 8 malam ya. Kamu prefer jam berapa?`,
      `Untuk besok aku free sepanjang hari. Mau ketemuan jam berapa?`,
      `Waktunya fleksibel kok, tinggal sesuaikan sama jadwal kamu aja!`,
      `Oke, jam segitu aku bisa. Langsung confirm ya!`,
    ],

    location: [
      `Aku biasanya prefer ketemuan di tempat publik yang nyaman. Ada preferensi cafe atau mall?`,
      `Gimana kalau kita ketemu di lobby mall aja? Lebih gampang nyarinya`,
      `Aku bisa menyesuaikan dengan lokasimu kok. Kamu lebih prefer di daerah mana?`,
      `Ada rekomendasi tempat seru nih, nanti aku share ya!`,
    ],

    payment: [
      `Untuk detail harga sudah ada di profil aku ya. Ada yang mau ditanyakan lagi?`,
      `Harga sudah include semua, tidak ada biaya tambahan. Tenang aja!`,
      `Pembayaran bisa langsung lewat platform, aman dan terjamin!`,
    ],

    food: [
      `Wah, aku tau beberapa tempat makan enak di sekitar sini! Ada cuisine favorit?`,
      `Aku punya list cafe aesthetic yang bagus buat foto-foto juga 📸`,
      `Kalau soal kuliner, serahkan sama aku! Aku tau hidden gems-nya`,
      `Aku lagi ngidam Korean food nih, kamu suka?`,
    ],

    movies: [
      `Aku baru nonton film yang bagus banget! Genre favorit kamu apa?`,
      `Ada film baru yang lagi rame, pengen nonton bareng gak?`,
      `Horror, comedy, atau romance? Aku suka semuanya sih 😄`,
      `Kalau mau movie date, aku tau bioskop yang nyaman banget!`,
    ],

    music: [
      `Aku suka dengerin berbagai genre! Kamu lagi suka lagu apa?`,
      `Ada band atau artist favorit? Siapa tau selera kita sama!`,
      `Aku bisa recommend playlist yang enak nih! Mau genre apa?`,
      `Live music atau streaming? Personally aku suka keduanya!`,
    ],

    gaming: [
      `Oh, kamu gamer juga? Main game apa biasanya?`,
      `Aku casual gamer sih, tapi lumayan suka main juga!`,
      `Mobile game atau PC? Atau console?`,
      `Kapan-kapan kita main bareng bisa tuh!`,
    ],

    hobbies: [
      `Hobi aku lumayan random sih, dari reading sampai hiking! Kamu suka ngapain?`,
      `Aku seneng explore hal baru! Kalau kamu?`,
      `That's interesting! Ceritain dong lebih lanjut!`,
      `Kita bisa coba hobi bareng nanti! Sounds fun gak?`,
    ],

    work: [
      `Kerja apa nih? Pasti seru deh!`,
      `Work-life balance penting banget ya. Gimana caramu maintain itu?`,
      `Wah, kedengarannya challenging but rewarding!`,
      `Aku appreciate orang yang passionate sama kerjaannya!`,
    ],

    travel: [
      `Aku suka banget traveling! Destinasi favorit kamu dimana?`,
      `Ada bucket list places yang pengen dikunjungi?`,
      `Local trip atau overseas? Aku suka keduanya!`,
      `Kalau liburan, kamu tipe yang adventure atau santai?`,
    ],

    weather: [
      `Iya nih cuacanya lagi gini ya. Tapi tetep semangat!`,
      `Hujan gini enaknya ngopi sambil ngobrol ya 😊`,
      `Cuaca panas gini mending hangout di tempat indoor aja!`,
      `Weather-nya perfect buat jalan-jalan nih!`,
    ],

    activity: [
      `Kita bisa sesuaikan dengan mood kamu nanti. Mau santai atau eksplor?`,
      `Aku punya beberapa rekomendasi tempat seru! Nanti aku share ya`,
      `Kita bisa ngobrol dulu, terus lanjut ke aktivitas yang kamu mau`,
      `Bebas mau ngapain aja, yang penting kita enjoy bareng! 😊`,
    ],

    confirmation: [
      `Oke siap! Sampai ketemu nanti ya! 👋`,
      `Perfect! Aku tunggu kabar selanjutnya`,
      `Noted! Kalau ada perubahan, langsung kabarin aja ya`,
      `Siap! Excited banget nih! 😊`,
      `Sip, deal! 🤝`,
    ],

    thanks: [
      `Sama-sama! Senang bisa ngobrol 😊`,
      `No problem! Kalau ada yang perlu ditanyain lagi, feel free ya!`,
      `Makasih juga udah percaya sama aku!`,
      `Anytime! Yuk lanjut ngobrol lagi!`,
    ],

    question: [
      `Hmm, pertanyaan bagus! Coba aku jawab ya...`,
      `Oke, aku jelasin deh!`,
      `Good question! Jadi gini...`,
    ],

    casual: [
      `Haha iya bener banget!`,
      `Setuju sih sama itu 😄`,
      `Wkwk, kamu bisa aja!`,
      `That's cool! Lanjut dong ceritanya`,
      `Aku juga nih, relate banget!`,
      `Seru ya kalau gitu!`,
    ],

    general: [
      `Oke, noted! Ada lagi yang mau dibahas?`,
      `Sip, aku mengerti. Cerita lagi dong!`,
      `Interesting! Terus terus?`,
      `That's nice! Gimana selanjutnya?`,
      `Aku seneng dengerin cerita kamu 😊`,
    ],
  };

  // Get response pool based on intent
  let responsePool = responses[intent] || responses.general;

  // Add context-aware continuity for follow-up messages
  if (context.messageCount > 3 && intent === "casual") {
    // More natural follow-up responses after some conversation
    responsePool = [
      ...responsePool,
      `Haha bener banget! Kamu emang seru diajak ngobrol 😊`,
      `Aku enjoy banget nih ngobrol sama kamu!`,
      `Vibes kita match ya kayaknya!`,
      `Makin penasaran sama kamu nih!`,
    ];
  }

  // Continuity responses when topic shifts naturally
  if (context.lastTopic && intent !== context.lastTopic && intent !== "casual" && intent !== "general") {
    const transitionResponses = [
      `Oh btw, soal ${getTopicName(intent)}...`,
      `Ngomong-ngomong tentang itu,`,
    ];
    // Sometimes add a transition phrase
    if (Math.random() > 0.7) {
      const prefix = transitionResponses[Math.floor(Math.random() * transitionResponses.length)];
      const mainResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
      return `${prefix} ${mainResponse.charAt(0).toLowerCase()}${mainResponse.slice(1)}`;
    }
  }

  // Select random response from pool
  return responsePool[Math.floor(Math.random() * responsePool.length)];
}

// Helper to get topic display name
function getTopicName(topic: string): string {
  const names: Record<string, string> = {
    schedule: "jadwal",
    location: "lokasi",
    payment: "pembayaran",
    food: "makanan",
    movies: "film",
    music: "musik",
    gaming: "game",
    hobbies: "hobi",
    work: "kerjaan",
    travel: "traveling",
    weather: "cuaca",
    activity: "aktivitas",
  };
  return names[topic] || topic;
}
