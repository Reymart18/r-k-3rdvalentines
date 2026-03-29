interface ChatHeaderProps {
    name: string;
    subtitle: string;
    avatarSrc: string;
}

export default function ChatHeader({ name, subtitle, avatarSrc }: ChatHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 text-white">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                    <img src={avatarSrc} alt="" className="w-full h-full object-cover scale-[1.5]" />
                </div>
                <div>
                    <h3 className="font-bold">{name}</h3>
                    <p className="text-xs text-pink-100">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}
