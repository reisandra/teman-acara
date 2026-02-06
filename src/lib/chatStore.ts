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
const CHAT_STORAGE_KEY = "rentmate_chats";

export function getChatSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((s: ChatSession) => ({
        ...s,
        isTalentTyping: s.isTalentTyping ?? false,
        isUserTyping: s.isUserTyping ?? false,
        isMitraAsBookerTyping: s.isMitraAsBookerTyping ?? false,
        messages: s.messages.map(m => ({ 
          ...m, 
          status: m.status ?? 'sent',
          readByMitraAsBooker: m.readByMitraAsBooker ?? false,
          unreadCountForUser: s.unreadCountForUser ?? 0,
          unreadCountForMitra: s.unreadCountForMitra ?? 0,
          unreadCountForMitraAsBooker: s.unreadCountForMitraAsBooker ?? 0,
        }))
    }));
  } catch { return []; }
}

function saveChatSessions(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));

  window.dispatchEvent(new CustomEvent("chatsUpdated"));
  window.dispatchEvent(new CustomEvent("mitraAsBookerChatsUpdated"));
}

// *** LISTENER UNTUK SINKRONISASI LINTAS TAB ***
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === CHAT_STORAGE_KEY) {
      console.log("chatStore: Perubahan terdeteksi dari tab lain, memicu update.");
      window.dispatchEvent(new CustomEvent("chatsUpdated"));
      window.dispatchEvent(new CustomEvent("mitraAsBookerChatsUpdated"));
    }
  });
}

/* ================= LOGIKA UTAMA ================= */
export function getOrCreateChatSession(booking: SharedBooking): ChatSession | null {
  if (booking.approvalStatus !== "approved") return null;

  const sessions = getChatSessions();
  let session = sessions.find(s => s.bookingId === booking.id);

  if (!session) {
    const talent = talents.find(t => t.id === booking.talentId);
    const welcomeMessage = `Halo! Terima kasih sudah booking untuk ${booking.purpose}. Yuk kita koordinasi 😊`;

    session = {
      id: `chat_${booking.id}`,
      bookingId: booking.id,
      userId: booking.userId,
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
    saveChatSessions(sessions);
  }
  return session;
}

export function getChatSessionByBookingId(bookingId: string): ChatSession | null {
  return getChatSessions().find(s => s.bookingId === bookingId) || null;
}

export function getChatSessionsForTalent(talentId: string): ChatSession[] {
  if (!talentId) return [];
  return getChatSessions().filter(session => session.talentId === talentId);
}

export async function getChatSessionsForMitraAsBooker(mitraId: string): Promise<ChatSession[]> {
  try {
    if (!mitraId) return [];
    const bookings = await getBookings() || [];
    const sessions = getChatSessions();
    
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
export function sendMitraMessage(bookingId: string, message: string) {
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return null;

  const session = sessions[idx];
  const messages = session.messages;

  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderType === "user" && messages[i].status !== "read") {
      messages[i].status = "read";
      messages[i].readByMitra = true;
      messages[i].readAt = new Date().toISOString();
      console.log(`[chatStore] Mitra membalas, menandai pesan user ${messages[i].id} sebagai 'read'.`);
      break;
    }
  }

  const newMsg: ChatMessage = { 
    id: `msg_${Date.now()}`, 
    senderId: session.talentId, 
    senderType: "talent", 
    message, 
    timestamp: new Date().toISOString(), 
    status: "sent",
    readByUser: false, 
    readByMitra: true,
    readByMitraAsBooker: true
  };
  messages.push(newMsg);
  session.lastMessage = message;
  session.lastMessageTime = newMsg.timestamp;
  session.unreadCount = 0;
  session.unreadCountForUser = 0;
  session.unreadCountForMitra = 0;
  session.unreadCountForMitraAsBooker = 0;
  
  saveChatSessions(sessions);
  return newMsg;
}

export function sendUserMessage(userId: string, message: string, bookingId: string, senderType?: "user" | "mitra-as-booker") {
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return null;

  const session = sessions[idx];
  const messages = session.messages;

  let receiverType: "talent" | "user" | "mitra-as-booker" = "talent";
  if (senderType === "mitra-as-booker") {
    receiverType = "talent";
  } else if (senderType === "talent") {
    receiverType = "user";
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderType === receiverType && messages[i].status !== "read") {
      messages[i].status = "read";
      
      if (receiverType === "user") {
        messages[i].readByUser = true;
      } else if (receiverType === "talent") {
        messages[i].readByMitra = true;
      } else if (receiverType === "mitra-as-booker") {
        messages[i].readByMitraAsBooker = true;
      }
      
      messages[i].readAt = new Date().toISOString();
      console.log(`[chatStore] ${senderType} membalas, menandai pesan ${receiverType} ${messages[i].id} sebagai 'read'.`);
      break;
    }
  }

  const newMsg: ChatMessage = { 
    id: `msg_${Date.now()}`, 
    senderId: userId, 
    senderType: senderType || "user", 
    message, 
    timestamp: new Date().toISOString(), 
    status: "sent",
    readByUser: senderType === "user",
    readByMitra: false,
    readByMitraAsBooker: senderType === "mitra-as-booker"
  };
  messages.push(newMsg);
  session.lastMessage = message;
  session.lastMessageTime = newMsg.timestamp;
  
  if (receiverType === "user") {
    session.unreadCountForUser += 1;
  } else if (receiverType === "talent") {
    session.unreadCountForMitra += 1;
  } else if (receiverType === "mitra-as-booker") {
    session.unreadCountForMitraAsBooker += 1;
  }
  
  session.unreadCount = session.unreadCountForUser + session.unreadCountForMitra + session.unreadCountForMitraAsBooker;
  
  saveChatSessions(sessions);
  
  if (senderType === "mitra-as-booker") {
    window.dispatchEvent(new CustomEvent("mitraAsBookerMessageAdded", { 
      detail: { 
        bookingId, 
        message: newMsg 
      } 
    }));
  }
  
  return newMsg;
}

export function sendMitraAsBookerMessage(mitraId: string, message: string, bookingId: string): ChatMessage | null {
  return sendUserMessage(mitraId, message, bookingId, "mitra-as-booker");
}

/* ================= STATUS PESAN & TYPING ================= */
export function markMessagesAsReadByMitra(bookingId: string) {
  console.log(`[chatStore] markMessagesAsReadByMitra dipanggil untuk bookingId: ${bookingId}`);
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  let hasUpdates = false;
  sessions[idx].messages = sessions[idx].messages.map(msg => {
    if (msg.senderType === "user" && !msg.readByMitra) { 
      console.log(`[chatStore] Menandai pesan ${msg.id} sebagai 'read' oleh Mitra.`);
      hasUpdates = true; 
      return { 
        ...msg, 
        readByMitra: true, 
        status: 'read' as MessageStatus, 
        readAt: new Date().toISOString() 
      }; 
    }
    return msg;
  });

  if (hasUpdates) { 
    sessions[idx].unreadCountForMitra = 0;
    sessions[idx].unreadCount = sessions[idx].unreadCountForUser + sessions[idx].unreadCountForMitra + sessions[idx].unreadCountForMitraAsBooker;
    saveChatSessions(sessions); 
  }
}

export function markMessagesAsReadByUser(bookingId: string) {
  console.log(`[chatStore] markMessagesAsReadByUser dipanggil untuk bookingId: ${bookingId}`);
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  let hasUpdates = false;
  sessions[idx].messages = sessions[idx].messages.map(msg => {
    if (msg.senderType === "talent" && !msg.readByUser) { 
      console.log(`[chatStore] Menandai pesan ${msg.id} sebagai 'read' oleh User.`);
      hasUpdates = true; 
      return { 
        ...msg, 
        readByUser: true, 
        status: 'read' as MessageStatus, 
        readAt: new Date().toISOString() 
      }; 
    }
    return msg;
  });

  if (hasUpdates) { 
    sessions[idx].unreadCountForUser = 0;
    sessions[idx].unreadCount = sessions[idx].unreadCountForUser + sessions[idx].unreadCountForMitra + sessions[idx].unreadCountForMitraAsBooker;
    saveChatSessions(sessions); 
  }
}

export function markMessagesAsReadByMitraAsBooker(bookingId: string) {
  console.log(`[chatStore] markMessagesAsReadByMitraAsBooker dipanggil untuk bookingId: ${bookingId}`);
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  let hasUpdates = false;
  sessions[idx].messages = sessions[idx].messages.map(msg => {
    if (msg.senderType === "talent" && !msg.readByMitraAsBooker) { 
      console.log(`[chatStore] Menandai pesan ${msg.id} sebagai 'read' oleh Mitra sebagai Booker.`);
      hasUpdates = true; 
      return { 
        ...msg, 
        readByMitraAsBooker: true, 
        status: 'read' as MessageStatus, 
        readAt: new Date().toISOString() 
      }; 
    }
    return msg;
  });

  if (hasUpdates) { 
    sessions[idx].unreadCountForMitraAsBooker = 0;
    sessions[idx].unreadCount = sessions[idx].unreadCountForUser + sessions[idx].unreadCountForMitra + sessions[idx].unreadCountForMitraAsBooker;
    saveChatSessions(sessions); 
  }
}

export function markMessagesAsReadByTalent(bookingId: string) {
  console.log(`[chatStore] markMessagesAsReadByTalent dipanggil untuk bookingId: ${bookingId}`);
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  let hasUpdates = false;
  sessions[idx].messages = sessions[idx].messages.map(msg => {
    if ((msg.senderType === "user" || msg.senderType === "mitra-as-booker") && !msg.readByTalent) { 
      console.log(`[chatStore] Menandai pesan ${msg.id} sebagai 'read' oleh Talent.`);
      hasUpdates = true; 
      return { 
        ...msg, 
        readByTalent: true, 
        status: 'read' as MessageStatus, 
        readAt: new Date().toISOString() 
      }; 
    }
    return msg;
  });

  if (hasUpdates) { 
    sessions[idx].unreadCountForUser = 0;
    sessions[idx].unreadCountForMitraAsBooker = 0;
    sessions[idx].unreadCount = sessions[idx].unreadCountForUser + sessions[idx].unreadCountForMitra + sessions[idx].unreadCountForMitraAsBooker;
    saveChatSessions(sessions); 
  }
}

export function markMessagesAsDelivered(bookingId: string, senderType: "user" | "talent" | "mitra-as-booker") {
  console.log(`[chatStore] markMessagesAsDelivered dipanggil untuk bookingId: ${bookingId}, senderType: ${senderType}`);
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1) return;

  let hasUpdates = false;
  let receiverType: "talent" | "user" | "mitra-as-booker" = "user";
  if (senderType === "user") {
    receiverType = "talent";
  } else if (senderType === "talent") {
    receiverType = "user";
  } else if (senderType === "mitra-as-booker") {
    receiverType = "talent";
  }
  
  sessions[idx].messages = sessions[idx].messages.map(msg => {
    if (msg.senderType === senderType && msg.status === "sent") { 
      console.log(`[chatStore] Menandai pesan ${msg.id} sebagai 'delivered'.`);
      hasUpdates = true; 
      return { 
        ...msg, 
        status: 'delivered' as MessageStatus
      }; 
    }
    return msg;
  });

  if (hasUpdates) { 
    saveChatSessions(sessions); 
  }
}

export function setUserTyping(bookingId: string, isTyping: boolean) {
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1 || sessions[idx].isUserTyping === isTyping) return;
  sessions[idx].isUserTyping = isTyping;
  saveChatSessions(sessions);
}

export function setTalentTyping(bookingId: string, isTyping: boolean) {
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1 || sessions[idx].isTalentTyping === isTyping) return;
  sessions[idx].isTalentTyping = isTyping;
  saveChatSessions(sessions);
}

export function setMitraAsBookerTyping(bookingId: string, isTyping: boolean) {
  const sessions = getChatSessions();
  const idx = sessions.findIndex(s => s.bookingId === bookingId);
  if (idx === -1 || sessions[idx].isMitraAsBookerTyping === isTyping) return;
  sessions[idx].isMitraAsBookerTyping = isTyping;
  saveChatSessions(sessions);
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
export async function getActiveChatSessions(): Promise<ChatSession[]> {
  try {
    const bookings = await getBookings() || [];
    const approved = bookings.filter(b => b.approvalStatus === "approved");
    
    approved.forEach(getOrCreateChatSession);
    return getChatSessions().sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  } catch (error) {
    console.error("Error getting active chat sessions:", error);
    return [];
  }
}

/* ================= FUNGSI YANG DIBUTUHKAN OLEH MitraDashboard.tsx ================= */
export function getChatSessionsByMitraId(mitraId: string): ChatSession[] {
  if (!mitraId) return [];
  return getChatSessions().filter(session => session.talentId === mitraId);
}

export async function getChatSessionsWhereMitraIsBooker(mitraId: string): Promise<ChatSession[]> {
  try {
    if (!mitraId) return [];
    const bookings = await getBookings() || [];
    const sessions = getChatSessions();
    
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