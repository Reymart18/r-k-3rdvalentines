import type { ChatOption } from './types';

interface ChatOptionsProps {
    options: ChatOption[];
    onOptionClick: (option: ChatOption) => void;
}

export default function ChatOptions({ options, onOptionClick }: ChatOptionsProps) {
    return (
        <div className="p-4 bg-white border-t border-pink-100 max-h-48 overflow-y-auto">
            <p className="text-xs text-pink-400 mb-2 text-center">💕 Tap a question to ask:</p>
            <div className="space-y-2">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onOptionClick(option)}
                        className="w-full text-left p-3 bg-pink-50 hover:bg-pink-100 rounded-xl text-pink-600 text-sm transition-all duration-200 hover:scale-[1.02] border border-pink-200"
                    >
                        💭 {option.question}
                    </button>
                ))}
            </div>
        </div>
    );
}
