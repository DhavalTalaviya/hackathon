"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, X, Send, Bot, Loader2, Sparkles } from "lucide-react";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    component?: React.ReactNode;
};

export default function ChatWidget() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        console.log("ChatWidget Mounted");
    }, []);

    const [inputValue, setInputValue] = useState("");

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping, loadingStep]);

    // Simulated progress steps for long-running AI tasks
    const loadingSteps = [
        "Analyzing intent...",
        "Querying database schema...",
        "Generating SQL queries...",
        "Executing analysis...",
        "Building dashboard UI..."
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTyping) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
            }, 2500); // Progress to next step every 2.5 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTyping]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await response.json();

            if (data.dataviz && data.componentCode) {
                // Return a friendly message before routing if needed
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.content || "Your dashboard is ready! Opening now...",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);

                // Allow user to see the "success" message attached briefly before routing
                setTimeout(() => {
                    router.push('/?view=dashboard');
                }, 1000);
                return;
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content || "Sorry, I couldn't understand that.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, something went wrong. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${isOpen
                    ? "bg-red-500 hover:bg-red-600 rotate-90"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/50"
                    } text-white`}
                aria-label="Toggle chat"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-6 z-[9999] w-[90vw] sm:w-[450px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-10 pointer-events-none"
                    }`}
                style={{ height: "min(700px, 85vh)" }}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-2xl flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                AI Analyst
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Data Intelligence Active</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 bg-gray-50 dark:bg-gray-950/30">
                    <div className="text-center py-4">
                        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
                            <Sparkles size={12} /> Powered by Multi-Agent System
                        </p>
                    </div>

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[90%] rounded-2xl p-3 shadow-sm ${message.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
                                    }`}
                            >
                                <div className="text-sm leading-relaxed">{message.content}</div>

                                {/* Dynamic Component Rendering */}
                                {message.component && (
                                    <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        {message.component}
                                        <div className="mt-2 text-right">
                                            <a href="/dashboard" target="_blank" className="text-xs text-blue-600 hover:underline flex items-center justify-end gap-1">
                                                View Full Dashboard <Sparkles size={10} />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`text-[10px] mt-1 opacity-70 ${message.role === "user" ? "text-blue-100" : "text-gray-400"
                                        }`}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 rounded-bl-none flex flex-col gap-2 shadow-sm min-w-[200px]">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 animate-pulse flex items-center gap-2">
                                    <Sparkles size={12} className="text-blue-400" />
                                    {loadingSteps[loadingStep]}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 rounded-b-2xl">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about bookings, costs, or calls..."
                            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center min-w-[3rem]"
                        >
                            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
