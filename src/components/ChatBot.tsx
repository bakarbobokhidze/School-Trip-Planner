import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageCircle, Send, X, Bot } from "lucide-react";

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "model", parts: [{ text: "გამარჯობა! რით შემიძლია დაგეხმაროთ?" }] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ავტომატური სქროლი ბოლო მესიჯზე
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: "user", parts: [{ text: input }] };
        const newMessages = [...messages, userMsg]; // ვამატებთ ახალ მესიჯს ისტორიაში

        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const res = await axios.post("http://localhost:3000/api/ai/site-chat", {
            message: input,
            history: messages // ვაგზავნით მთელ ისტორიას
            });

            const aiMsg = { role: "model", parts: [{ text: res.data.reply }] };
            setMessages([...newMessages, aiMsg]); // ვინახავთ AI-ს პასუხსაც მეხსიერებაში
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {isOpen ? (
        <div className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl flex flex-col border border-primary/10 overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="p-4 bg-primary text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Trip Assistant</p>
                <p className="text-[10px] text-white/80">Online | AI Powered</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {m.parts[0].text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start italic text-xs text-muted-foreground animate-pulse">
                AI ფიქრობს...
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="დაწერეთ მესიჯი..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-primary p-2 rounded-xl text-white hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-primary w-14 h-14 rounded-full text-white shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative"
        >
          <div className="absolute -top-2 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
          <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};