// Chat Store - Bind chat sessions to approved bookings
// Each approved booking creates ONE unique chat session

import { getBookings, SharedBooking, subscribeToBookings } from "./bookingStore";
import { talents } from "@/data/mockData";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: "user" | "talent";
  message: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export interface ChatSession {
  id: string;
  bookingId: string;
  talentId: string;
  talentName: string;
  talentPhoto: string;
  purpose: string;
  duration: number;
  date: string;
  time: string;
  type: "online" | "offline";
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const CHAT_STORAGE_KEY = "rentmate_chats";

// Get all chat sessions from localStorage
export function getChatSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save chat sessions to localStorage
function saveChatSessions(sessions: ChatSession[]): void {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent("chatsUpdated"));
}

// Get or create chat session for an approved booking
export function getOrCreateChatSession(booking: SharedBooking): ChatSession | null {
  // Only create chat for approved bookings
  if (booking.approvalStatus !== "approved") {
    return null;
  }

  const sessions = getChatSessions();
  let session = sessions.find((s) => s.bookingId === booking.id);

  if (!session) {
    // Find talent data - MUST exist if booking exists
    const talent = talents.find((t) => t.id === booking.talentId);
    
    // Create new chat session with booking context
    session = {
      id: `chat_${booking.id}`,
      bookingId: booking.id,
      talentId: booking.talentId,
      talentName: talent?.name || booking.talentName,
      talentPhoto: talent?.photo || booking.talentPhoto,
      purpose: booking.purpose,
      duration: booking.duration,
      date: booking.date,
      time: booking.time,
      type: booking.type,
      messages: [
        {
          id: `welcome_${Date.now()}`,
          senderId: booking.talentId,
          senderType: "talent",
          message: `Halo! Terima kasih sudah booking untuk ${booking.purpose}. Yuk kita koordinasi untuk pertemuan nanti! 😊`,
          timestamp: new Date().toISOString(),
          status: "delivered",
        },
      ],
      lastMessage: `Halo! Terima kasih sudah booking untuk ${booking.purpose}. Yuk kita koordinasi untuk pertemuan nanti! 😊`,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 1,
    };

    sessions.push(session);
    saveChatSessions(sessions);
  }

  return session;
}

// Get chat session by booking ID
export function getChatSessionByBookingId(bookingId: string): ChatSession | null {
  const sessions = getChatSessions();
  return sessions.find((s) => s.bookingId === bookingId) || null;
}

// Get all active chat sessions (only from approved bookings)
export function getActiveChatSessions(): ChatSession[] {
  const approvedBookings = getBookings().filter((b) => b.approvalStatus === "approved");
  
  // Ensure all approved bookings have chat sessions
  approvedBookings.forEach((booking) => {
    getOrCreateChatSession(booking);
  });

  // Return updated sessions sorted by last message time
  return getChatSessions().sort(
    (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );
}

// Add message to chat session
export function addMessageToChat(
  bookingId: string,
  message: Omit<ChatMessage, "id" | "timestamp">
): ChatMessage | null {
  const sessions = getChatSessions();
  const sessionIndex = sessions.findIndex((s) => s.bookingId === bookingId);

  if (sessionIndex === -1) return null;

  const newMessage: ChatMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  sessions[sessionIndex].messages.push(newMessage);
  sessions[sessionIndex].lastMessage = newMessage.message;
  sessions[sessionIndex].lastMessageTime = newMessage.timestamp;

  if (message.senderType === "talent") {
    sessions[sessionIndex].unreadCount++;
  }

  saveChatSessions(sessions);
  return newMessage;
}

// Update message status
export function updateMessageStatus(
  bookingId: string,
  messageId: string,
  status: ChatMessage["status"]
): void {
  const sessions = getChatSessions();
  const sessionIndex = sessions.findIndex((s) => s.bookingId === bookingId);

  if (sessionIndex === -1) return;

  const msgIndex = sessions[sessionIndex].messages.findIndex((m) => m.id === messageId);
  if (msgIndex !== -1) {
    sessions[sessionIndex].messages[msgIndex].status = status;
    saveChatSessions(sessions);
  }
}

// Mark all messages as read
export function markChatAsRead(bookingId: string): void {
  const sessions = getChatSessions();
  const sessionIndex = sessions.findIndex((s) => s.bookingId === bookingId);

  if (sessionIndex === -1) return;

  sessions[sessionIndex].messages = sessions[sessionIndex].messages.map((m) =>
    m.senderType === "user" && m.status !== "read" ? { ...m, status: "read" as const } : m
  );
  sessions[sessionIndex].unreadCount = 0;
  saveChatSessions(sessions);
}

// Delete a message
export function deleteMessageFromChat(bookingId: string, messageId: string): void {
  const sessions = getChatSessions();
  const sessionIndex = sessions.findIndex((s) => s.bookingId === bookingId);

  if (sessionIndex === -1) return;

  sessions[sessionIndex].messages = sessions[sessionIndex].messages.filter(
    (m) => m.id !== messageId
  );

  // Update last message
  const messages = sessions[sessionIndex].messages;
  if (messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    sessions[sessionIndex].lastMessage = lastMsg.message;
    sessions[sessionIndex].lastMessageTime = lastMsg.timestamp;
  }

  saveChatSessions(sessions);
}

// Subscribe to chat updates
export function subscribeToChats(callback: () => void): () => void {
  window.addEventListener("chatsUpdated", callback);
  return () => window.removeEventListener("chatsUpdated", callback);
}

// Get talent data for chat (GUARANTEED to return data if booking exists)
export function getTalentForChat(talentId: string): { name: string; photo: string } | null {
  const talent = talents.find((t) => t.id === talentId);
  if (talent) {
    return { name: talent.name, photo: talent.photo };
  }
  return null;
}
