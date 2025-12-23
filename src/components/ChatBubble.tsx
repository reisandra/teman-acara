import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/data/mockData";

interface ChatBubbleProps {
  message: ChatMessage;
  senderPhoto?: string;
  senderName?: string;
}

export function ChatBubble({ message, senderPhoto, senderName }: ChatBubbleProps) {
  const isUser = message.senderType === "user";
  const time = new Date(message.timestamp).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex gap-2 max-w-[85%] animate-fade-in",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {senderPhoto && (
        <img
          src={senderPhoto}
          alt={senderName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
        />
      )}
      <div className={cn("space-y-1", isUser && "items-end")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl",
            isUser
              ? "bg-chat-user text-chat-user-foreground rounded-br-md"
              : "bg-chat-talent text-chat-talent-foreground rounded-bl-md"
          )}
        >
          <p className="text-sm leading-relaxed">{message.message}</p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-[10px] text-muted-foreground px-1",
            isUser && "justify-end"
          )}
        >
          <span>{time}</span>
          {isUser && (
            <>
              {message.status === "sent" && <Check className="w-3 h-3" />}
              {message.status === "delivered" && <CheckCheck className="w-3 h-3" />}
              {message.status === "read" && (
                <CheckCheck className="w-3 h-3 text-primary" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
