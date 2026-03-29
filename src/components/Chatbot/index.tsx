import { useState } from 'react';
import type { Message, ChatOption } from './types';
import ChatToggleButton from './ChatToggleButton';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatOptions from './ChatOptions';

const chatOptions: ChatOption[] = [
    {
        question: "Sino ang love ni Reymart Omega?",
        answer: "Syempre si Angela Kate Lucot Gumatas! Ang super duper over mega unlimited love ko! napaka special niya sa puso ko! pretty pretty!💖"
    },
    {
        question: "Sino ang pinaka-pretty?",
        answer: "Si sugarmommy, baby girl, good girl, super pretty love of my life, angela kate! mwa!!💗"
    },
    {
        question: "Gaano kamahal ni Reymart si Angela Kate?",
        answer: "More than you know po love love! Mahal na mahal kita ng higit higit at sobra, at napaka special mo sa buhay ko. Ikaw ang naghubog sa akin sa kung ano ako ngayon, kaya mahal na mahal kita more than you know talaga! You made me feel so loved and special po, at napakasaya na ikaw ang kasama ko palagi sa bawat hakbang natin, at sana palagi mong maramdaman kung gaano ka kaspecial at gaano kita kamahal! hindi ako titigil iparamdam sayo iyon! mwa mwa! magiging successful tayo together! and hawak kamay tayo forever! I love you so much, Angela Kate!💗"
    },
    {
        question: "Sino ang forever ni Reymart?",
        answer: "Sino pa ba, edi si Angela Kate Lucot Gumatas! 💍❤️"
    },
    {
        question: "Bakit special si Angela Kate?",
        answer: "Because she's my sun, she makes me shine, like diamonds. would you still love when im no longer young and beautiful? wahahaahahahaa kumanta yarn, ayan ang kanta sa kasal hehehehehe she is my everything, because she gave me everything. Tinuruan niya ako sa maraming bagay, at pinaramdam sa akin ang pag-ibig na higit pa sa inaakala ko. Napakasaya na siya ang partner ko, at sobrang nakakataba siya ng puso. I wish talaga na we will be together, forever! and lets make it happen love love. Pag may panang lumipad at tatama sa kaniya, ako na lang ang sasalo, ey superhero yarn wahahaahahahahah naunsa mana i love her so much, very very very much muchie! and im just so happy na siya ang minamahal ko. na ang katulad niya ang inaalayan ko ng pag-ibig, dahil buong buo niyang pinaparanas din sa akin ito. napakasarap niyang mahalin. it may sound cliche, but i love you more than you know, love love! you're the greatest thing na nangyari sa akin! and lets be together, forever! naunsa ang tanong pang 3rd person view, pero ang sagot mix ng 1st, 2nd, 3rd person view wahaahahahaha peace yow! ☀️💗"
    },
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hi Love!! 💕 Ask me anything about our love story!", isBot: true }
    ]);

    const handleOptionClick = (option: ChatOption) => {
        setMessages(prev => [...prev, { text: option.question, isBot: false }]);
        setTimeout(() => {
            setMessages(prev => [...prev, { text: option.answer, isBot: true }]);
        }, 500);
    };

    return (
        <>
            <ChatToggleButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

            {isOpen && (
                <div className="fixed bottom-20 left-3 right-3 z-50 overflow-hidden rounded-3xl bg-white shadow-2xl sm:bottom-24 sm:left-auto sm:right-6 sm:w-96" style={{
                    boxShadow: '0 25px 50px -12px rgba(236, 72, 153, 0.4)',
                    maxHeight: '70vh'
                }}>
                    <ChatHeader
                        name="Reymart Omega"
                        subtitle="Always here for you 💗"
                        avatarSrc="/src/assets/me.jpg"
                    />
                    <MessageList messages={messages} />
                    <ChatOptions options={chatOptions} onOptionClick={handleOptionClick} />
                </div>
            )}
        </>
    );
}
