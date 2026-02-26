// src/lib/chatStore.ts
import { getBookings, SharedBooking } from "./bookingStore";
import { talents } from "@/data/mockData";

/* ================= TYPES ================= */
export type MessageStatus = "sent" | "delivered" | "read";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: "user" | "talent" | "mitra-as-booker";
  message: string;
  timestamp: string;
  status: MessageStatus;
  readByUser: boolean;
  readByMitra: boolean;
  readByTalent?: boolean;
  readByMitraAsBooker?: boolean;
  readAt?: string;
  isAutoResponse?: boolean;
}

export interface ChatSession {
  id: string;
  bookingId: string;
  userName: string;
  userPhoto: string;
  userId: string;
  talentId: string;
  talentName: string;
  talentPhoto: string;
  purpose: string;
  duration: number;
  date: string;
  time: string;
  type: "online" | "offline";
  messages: ChatMessage[];
  isTalentTyping?: boolean;
  isUserTyping?: boolean;
  isMitraAsBookerTyping?: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  unreadCountForUser?: number;
  unreadCountForMitra?: number;
  unreadCountForMitraAsBooker?: number;
}

/* ================= STORAGE ================= */
function getChatStorageKey(userId: string) {
  return `rentmate_chats_${userId}`;
}

export function getChatSessions(userId: string): ChatSession[] {
  if (typeof window === "undefined") return [];
  if (!userId) return [];

  try {
    const stored = localStorage.getItem(getChatStorageKey(userId));
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}


function saveChatSessions(userId: string, sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getChatStorageKey(userId), JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent("chatsUpdated"));
}


/* ================= LOGIKA UTAMA ================= */
export function getOrCreateChatSession(
  userId: string,
  booking: SharedBooking | undefined | null
): ChatSession | null {

  if (!booking) return null;
  if (booking.approvalStatus !== "approved") return null;

  const sessions = getChatSessions(userId);
  let session = sessions.find(s => s.bookingId === booking.id);

  // ✅ kalau sudah ada → return
  if (session) return session;

  const talent = talents.find(t => t.id === booking.talentId);
  const welcomeMessage =
    `Halo! Terima kasih sudah booking untuk ${booking.purpose}. Yuk kita koordinasi 😊`;

  session = {
    id: `chat_${booking.id}`,
    bookingId: booking.id,
    userId: booking.bookerId,
    userName: booking.userName,
    userPhoto: booking.userPhoto,
    talentId: booking.talentId,
    talentName: talent?.name || booking.talentName,
    talentPhoto: talent?.photo || booking.talentPhoto,
    purpose: booking.purpose,
    duration: booking.duration,
    date: booking.date,
    time: booking.time,
    type: booking.type,
    messages: [{
      id: `welcome_${Date.now()}`,
      senderId: booking.talentId,
      senderType: "talent",
      message: welcomeMessage,
      timestamp: new Date().toISOString(),
      status: "delivered",
      readByUser: false,
      readByMitra: true,
      readByMitraAsBooker: true,
      isAutoResponse: true
    }],
    lastMessage: welcomeMessage,
    lastMessageTime: new Date().toISOString(),
    unreadCount: 1,
    unreadCountForUser: 1,
    unreadCountForMitra: 0,
    unreadCountForMitraAsBooker: 0,
    isTalentTyping: false,
    isUserTyping: false,
    isMitraAsBookerTyping: false,
  };

  sessions.push(session);
  saveChatSessions(userId, sessions);

  return session;
}

export function getChatSessionsForTalent(
  userId: string,
  talentId: string
): ChatSession[] {
  return getChatSessions(userId).filter(
    (session) => session.talentId === talentId
  );
}

export async function getChatSessionsForMitraAsBooker(
  userId: string,
  mitraId: string
): Promise<ChatSession[]> {
  try {
    if (!mitraId) return [];
    const bookings = await getBookings() || [];
    const sessions = getChatSessions(userId);

    return sessions.filter(session => {
      const booking = bookings.find(b =>
        b.bookerId === mitraId &&
        b.bookerType === "mitra" &&
        b.talentId === session.talentId
      );
      return booking !== undefined;
    });
  } catch (error) {
    console.error("Error getting chat sessions for mitra as booker:", error);
    return [];
  }
}

/* ================= KIRIM PESAN ================= */
export function sendMitraMessage(
  userId: string,
  bookingId: string,
  message: string
): ChatMessage | null {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex((s) => s.bookingId === bookingId);
  if (idx === -1) return null;

  const session = sessions[idx];

  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}`,
    senderId: session.talentId,
    senderType: "talent",
    message,
    timestamp: new Date().toISOString(),
    status: "sent",
    readByUser: false,
    readByMitra: true,
    readByTalent: true,
    readByMitraAsBooker: true,
  };

  session.messages.push(newMsg);
  session.lastMessage = message;
  session.lastMessageTime = newMsg.timestamp;
  session.unreadCountForUser = (session.unreadCountForUser || 0) + 1;
  session.unreadCount = (session.unreadCount || 0) + 1;

  saveChatSessions(userId, sessions);

  // Sync ke user lawan
  const otherUserId = session.userId;
  const otherSessions = getChatSessions(otherUserId);
  const otherIdx = otherSessions.findIndex(s => s.bookingId === bookingId);

  if (otherIdx !== -1) {
    otherSessions[otherIdx].messages.push(newMsg);
    otherSessions[otherIdx].lastMessage = message;
    otherSessions[otherIdx].lastMessageTime = newMsg.timestamp;
    saveChatSessions(otherUserId, otherSessions);
  }

  return newMsg;
}

export function sendUserMessage(
  userId: string,
  bookingId: string,
  message: string,
  senderType: "user" | "mitra-as-booker" = "user"
) {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return null;

  const session = sessions[idx];

  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}`,
    senderId: userId,
    senderType,
    message,
    timestamp: new Date().toISOString(),
    status: "sent",
    readByUser: senderType === "user",
    readByMitra: false,
    readByTalent: false,
    readByMitraAsBooker: senderType === "mitra-as-booker"
  };

  session.messages.push(newMsg);
  session.lastMessage = message;
  session.lastMessageTime = newMsg.timestamp;

  session.unreadCountForMitra = (session.unreadCountForMitra || 0) + 1;
  session.unreadCount = (session.unreadCount || 0) + 1;

  saveChatSessions(userId, sessions);

  // 🔥 SYNC KE PIHAK LAWAN
  const otherUserId =
    session.userId === userId
      ? session.talentId
      : session.userId;

  const otherSessions = getChatSessions(otherUserId);
  const otherIdx = otherSessions.findIndex(s => s.bookingId === bookingId);

  if (otherIdx !== -1) {
    otherSessions[otherIdx].messages.push(newMsg);
    otherSessions[otherIdx].lastMessage = message;
    otherSessions[otherIdx].lastMessageTime = newMsg.timestamp;

    otherSessions[otherIdx].unreadCountForMitra =
      (otherSessions[otherIdx].unreadCountForMitra || 0) + 1;

    saveChatSessions(otherUserId, otherSessions);
  }

  return newMsg; // 🔥 return dipindah ke bawah
}

export function sendMitraAsBookerMessage(
  mitraId: string,
  bookingId: string,
  message: string
): ChatMessage | null {
  return sendUserMessage(
    mitraId,
    bookingId,
    message,
    "mitra-as-booker"
  );
}

/* ================= STATUS PESAN & TYPING ================= */
export function markMessagesAsReadByMitra(
  userId: string,
  bookingId: string
) {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  const session = sessions[idx];
  let hasUpdates = false;

  session.messages = session.messages.map(msg => {
    if (msg.senderType === "user" && !msg.readByMitra) {
      hasUpdates = true;
      return {
        ...msg,
        readByMitra: true,
        status: "read",
        readAt: new Date().toISOString()
      };
    }
    return msg;
  });

  if (hasUpdates) {
    session.unreadCountForMitra = 0;
    saveChatSessions(userId, sessions);

    // 🔥 SYNC KE LAWAN
    const otherSessions = getChatSessions(session.userId);
    const otherIdx = otherSessions.findIndex(s => s.bookingId === bookingId);

    if (otherIdx !== -1) {
      otherSessions[otherIdx].messages = session.messages;
      saveChatSessions(session.userId, otherSessions);
    }
  }
}


export function markMessagesAsReadByUser(userId: string, bookingId: string) {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  const session = sessions[idx];
  let hasUpdates = false;

  session.messages = session.messages.map(msg => {
    if (msg.senderType === "talent" && !msg.readByUser) {
      hasUpdates = true;
      return {
        ...msg,
        readByUser: true,
        status: "read",
        readAt: new Date().toISOString()
      };
    }
    return msg;
  });

  if (hasUpdates) {
    session.unreadCountForUser = 0;
    saveChatSessions(userId, sessions);

    // 🔥 SYNC KE LAWAN
    const otherSessions = getChatSessions(session.talentId);
    const otherIdx = otherSessions.findIndex(s => s.bookingId === bookingId);

   if (otherIdx !== -1) {
  otherSessions[otherIdx].messages = session.messages;
  saveChatSessions(session.talentId, otherSessions);
}
}
}

export function markMessagesAsReadByMitraAsBooker(
  userId: string,
  bookingId: string
) {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  let hasUpdates = false;

  sessions[idx].messages = sessions[idx].messages.map(msg => {
    if (msg.senderType === "talent" && !msg.readByMitraAsBooker) {
      hasUpdates = true;
      return {
        ...msg,
        readByMitraAsBooker: true,
        status: "read",
        readAt: new Date().toISOString()
      };
    }
    return msg;
  });

  if (hasUpdates) {
    sessions[idx].unreadCountForMitraAsBooker = 0;
    sessions[idx].unreadCount =
      (sessions[idx].unreadCountForUser || 0) +
      (sessions[idx].unreadCountForMitra || 0) +
      (sessions[idx].unreadCountForMitraAsBooker || 0);

    saveChatSessions(userId, sessions);
  }
}

export function markMessagesAsReadByTalent(
  userId: string,
  bookingId: string
) {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  let hasUpdates = false;

  sessions[idx].messages = sessions[idx].messages.map(msg => {
    if (
      (msg.senderType === "user" || msg.senderType === "mitra-as-booker") &&
      !msg.readByTalent
    ) {
      hasUpdates = true;
      return {
        ...msg,
        readByTalent: true,
        status: "read",
        readAt: new Date().toISOString()
      };
    }
    return msg;
  });

  if (hasUpdates) {
    sessions[idx].unreadCountForUser = 0;
    sessions[idx].unreadCountForMitraAsBooker = 0;

    sessions[idx].unreadCount =
      (sessions[idx].unreadCountForUser || 0) +
      (sessions[idx].unreadCountForMitra || 0) +
      (sessions[idx].unreadCountForMitraAsBooker || 0);

    saveChatSessions(userId, sessions);
  }
}

export function markMessagesAsDelivered(
  userId: string,
  bookingId: string,
  viewerType: "user" | "talent" | "mitra-as-booker"
) {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  const session = sessions[idx];
  let hasUpdates = false;

  session.messages = session.messages.map(msg => {
    // Delivered untuk pesan dari lawan chat
    if (msg.senderType !== viewerType && msg.status === "sent") {
      hasUpdates = true;
      return {
        ...msg,
        status: "delivered"
      };
    }
    return msg;
  });

  if (!hasUpdates) return;

  saveChatSessions(userId, sessions);

  // 🔥 SYNC KE LAWAN CHAT
  const otherUserId =
    viewerType === "talent"
      ? session.userId
      : session.talentId;

  const otherSessions = getChatSessions(otherUserId);
  const otherIdx = otherSessions.findIndex(
    s => s.bookingId === bookingId
  );

  if (otherIdx !== -1) {
    otherSessions[otherIdx].messages = session.messages;
    saveChatSessions(otherUserId, otherSessions);
  }
}



export function setUserTyping(userId: string, bookingId: string, isTyping: boolean) {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1 || sessions[idx].isUserTyping === isTyping) return;
  sessions[idx].isUserTyping = isTyping;
  saveChatSessions(userId, sessions);
}

export function setTalentTyping(
  userId: string,
  bookingId: string,
  isTyping: boolean
) {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  if (sessions[idx].isTalentTyping === isTyping) return;

  sessions[idx].isTalentTyping = isTyping;
  saveChatSessions(userId, sessions);
}

export function setMitraAsBookerTyping(
  userId: string,
  bookingId: string,
  isTyping: boolean
) {
  const sessions = getChatSessions(userId);
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  if (sessions[idx].isMitraAsBookerTyping === isTyping) return;

  sessions[idx].isMitraAsBookerTyping = isTyping;
  saveChatSessions(userId, sessions);
}

/* ================= SUBSCRIBE REAL-TIME ================= */
export function subscribeToChats(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  
  const handleChatsUpdate = async () => {
    try {
      await callback();
    } catch (error) {
      console.error("Error in chats update callback:", error);
    }
  };
  
  window.addEventListener("chatsUpdated", handleChatsUpdate);
  return () => window.removeEventListener("chatsUpdated", handleChatsUpdate);
}

export function subscribeToMitraAsBookerChats(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  
  const handleMitraChatsUpdate = async () => {
    try {
      await callback();
    } catch (error) {
      console.error("Error in mitra chats update callback:", error);
    }
  };
  
  window.addEventListener("mitraAsBookerChatsUpdated", handleMitraChatsUpdate);
  return () => window.removeEventListener("mitraAsBookerChatsUpdated", handleMitraChatsUpdate);
}

/* ================= FUNGSI YANG DIBUTUHKAN OLEH ChatList.tsx ================= */
export async function getActiveChatSessions(userId: string): Promise<ChatSession[]> {
  try {
    const bookings = await getBookings() || [];

    const relatedBookings = bookings.filter(b =>
      b.approvalStatus === "approved" &&
      (
        b.bookerId === userId ||
        b.talentId === userId
      )
    );

    relatedBookings.forEach(b => getOrCreateChatSession(userId, b));

    return getChatSessions(userId).sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
    );

  } catch (error) {
    console.error("Error getting active chat sessions:", error);
    return [];
  }
}

/* ================= FUNGSI YANG DIBUTUHKAN OLEH MitraDashboard.tsx ================= */
export function getChatSessionsByMitraId(
  userId: string,
  mitraId: string
): ChatSession[] {
  if (!mitraId) return [];
  return getChatSessions(userId).filter(
    session => session.userId === mitraId
  );
}

export function getChatSessionByBookingId(
  userId: string,
  bookingId: string
): ChatSession | null {
  if (!bookingId) return null;

  return (
    getChatSessions(userId).find(
      s => s.bookingId === bookingId
    ) || null
  );
}

export async function getChatSessionsWhereMitraIsBooker(
  userId: string,
  mitraId: string
): Promise<ChatSession[]> {
  try {
    if (!mitraId) return [];
    const bookings = await getBookings() || [];
    const sessions = getChatSessions(userId);

    return sessions.filter(session => {
      const booking = bookings.find(b =>
        b.bookerId === mitraId &&
        b.bookerType === "mitra" &&
        b.talentId === session.talentId
      );
      return booking !== undefined;
    });
  } catch (error) {
    console.error("Error getting chat sessions where mitra is booker:", error);
    return [];
  }
}