import type { Message } from './types';

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
    return (
        <div className="h-64 overflow-y-auto p-4 space-y-3 bg-pink-50">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                    <div
                        className={`max-w-[80%] p-3 rounded-2xl ${msg.isBot
                            ? 'bg-white text-pink-600 rounded-tl-none shadow-md'
                            : 'bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-tr-none'
                            }`}
                    >
                        {msg.isBot && <span className="mr-1"></span>}
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>
    );
}
