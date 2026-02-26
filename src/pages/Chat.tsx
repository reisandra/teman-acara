// src/pages/UserChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Loader2, Check, CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

import {
  sendUserMessage,
  getChatSessionByBookingId,
  subscribeToChats,
  markMessagesAsReadByUser,
  setUserTyping,
  ChatMessage,
  ChatSession
} from '@/lib/chatStore';

export default function UserChat() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [session, setSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);
  const { user } = useAuth();


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!bookingId || !user) return
setUserTyping(user.id, bookingId, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => { setIsCurrentlyTyping(false); setUserTyping(user.id, bookingId, false); }, 1000);
  };

  const loadChat = () => {
  if (!user || !bookingId) return;

  const chatSession = getChatSessionByBookingId(user.id, bookingId);
  if (chatSession) {
    setSession(chatSession);
    markMessagesAsReadByUser(user.id, bookingId);
  }
  setIsLoading(false);
  setTimeout(scrollToBottom, 100);
};

  useEffect(() => {
    if (!bookingId) { navigate('/'); return; }
    loadChat();
    const unsubscribe = subscribeToChats(loadChat);
    return () => { unsubscribe(); if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); };
  }, [bookingId, navigate, user]);

  useEffect(() => { scrollToBottom(); }, [session?.messages, session?.isTalentTyping]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !bookingId) return;
    setIsSending(true);
    try {
      sendUserMessage(
      user.id,
      bookingId,
      newMessage.trim()
    );
      setNewMessage('');
      setUserTyping(user.id, bookingId, false);
    } catch (err) {
      toast({ title: 'Gagal Mengirim', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  
  // Perbarui komponen MessageStatusIcon untuk menampilkan status dengan benar
  const MessageStatusIcon = ({ message }: { message: ChatMessage }) => {
    if (message.senderType !== 'user') return null;
    
    // Status sent: satu centang abu-abu
    if (message.status === 'sent') return <Check className="w-4 h-4 text-gray-400" />;
    
    // Status delivered: dua centang abu-abu
    if (message.status === 'delivered') return <CheckCheck className="w-4 h-4 text-gray-400" />;
    
    // Status read: dua centang biru
    if (message.status === 'read') return <CheckCheck className="w-4 h-4 text-blue-500" />;
    
    return null;
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4"><Card className="p-8 text-center"><h2 className="text-xl font-bold mb-2">Chat tidak ditemukan</h2><Button onClick={() => navigate('/')}>Kembali</Button></Card></div>;

  return (
  <div className="min-h-screen bg-gray-50 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">

    {/* CHAT LIST */}
    <Card className="lg:col-span-1 flex flex-col">
      <CardHeader>
        <CardTitle>Chat Saya</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2">
        <div
          className="p-3 rounded-lg border bg-gray-100"
        >
          <div className="flex justify-between items-center">
            <p className="font-medium">{session.talentName}</p>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {session.lastMessage}
          </p>
        </div>
      </CardContent>
    </Card>

    {/* CHAT AREA */}
    <Card className="lg:col-span-2 flex flex-col h-[600px]">
      
      {/* HEADER */}
      <div className="p-4 border-b bg-white shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <img
            src={session.talentPhoto}
            alt={session.talentName}
            className="w-10 h-10 rounded-full object-cover border"
          />

          <div className="flex-1">
            <h3 className="font-semibold">{session.talentName}</h3>
            <p className="text-sm text-muted-foreground">
              {session.purpose} • {session.duration} jam
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {session.date} • {session.time}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollAreaRef}>
        {session.messages.map((msg) => {
          const isMe =
            msg.senderType === "user" &&
            msg.senderId === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  isMe
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {msg.message}
                </p>

                <div className="flex items-center justify-end gap-1 mt-1">
                  <p
                    className={`text-xs ${
                      isMe
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                  <MessageStatusIcon message={msg} />
                </div>
              </div>
            </div>
          );
        })}

        {session.isTalentTyping && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* INPUT */}
      <div className="p-4 border-t shrink-0">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Ketik pesan..."
            onKeyDown={(e) =>
              e.key === "Enter" && handleSendMessage()
            }
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

    </Card>
  </div>
);
}