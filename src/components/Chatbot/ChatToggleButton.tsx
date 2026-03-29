interface ChatToggleButtonProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function ChatToggleButton({ isOpen, onToggle }: ChatToggleButtonProps) {
    return (
        <button
            onClick={onToggle}
            className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
            style={{
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.5)'
            }}
        >
            <span className="text-2xl sm:text-3xl">{isOpen ? '💌' : '💬'}</span>
        </button>
    );
}
