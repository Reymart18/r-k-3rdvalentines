import { useState, useEffect, useCallback } from 'react';
import Chatbot from './components/Chatbot';
import Header from './components/Header';
import BackgroundEffects from './components/BackgroundEffects';
import StoriesRow from './components/StoriesRow';
import BouquetSection from './components/BouquetSection';
import ClawMachineSection from './components/ClawMachineSection';
import BottleExperience from './components/Bottle';
import StoryViewer from './components/StoryViewer';
import type { Story } from './components/types';

const STORY_DURATION = 5000; // 5 seconds per slide

interface LandingPageProps {
    onLogout: () => void;
}

function LandingPage({ onLogout }: LandingPageProps) {
    const [activeStory, setActiveStory] = useState<number | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const [viewedStories, setViewedStories] = useState<Set<number>>(new Set());

    const stories: Story[] = [
        {
            id: 0,
            label: 'First date 💕',
            cover: '/assets/stories/firstdate.jpg',
            slides: [
                { img: '/assets/stories/firstdate.jpg', caption: 'Our first moment together 💕' },
                { img: '/assets/stories/firstdate(1).jpg', caption: '' },
            ],
        },
        {
            id: 1,
            label: 'First pic at school 😊',
            cover: '/assets/stories/school.jpg',
            slides: [{ img: '/assets/stories/school.jpg', caption: 'You make me smile 😊' }],
        },
        {
            id: 2,
            label: 'First pic at church 💖',
            cover: '/assets/stories/firstchurch.jpg',
            slides: [{ img: '/assets/stories/firstchurch.jpg', caption: 'My favorite person 💖' }],
        },
        {
            id: 3,
            label: 'Picture from my birthday 2023 💍',
            cover: '/assets/stories/birth2023.jpg',
            slides: [{ img: '/assets/stories/birth2023.jpg', caption: 'Forever with you!!' },
            { img: '/assets/stories/birth2023(1).jpg', caption: '' },
            { img: '/assets/stories/birth2023(2).jpg', caption: '' }
            ],
        },
        {
            id: 4,
            label: 'Picture when i said i would court you 🥰',
            cover: '/assets/stories/court.jpg',
            slides: [{ img: '/assets/stories/court.jpg', caption: 'My happiness 🥰' }],
        },
        {
            id: 5,
            label: 'Picture when you said yes to me 🌍',
            cover: '/assets/stories/sinagot.jpg',
            slides: [{ img: '/assets/stories/sinagot.jpg', caption: '<3333' },
            { img: '/assets/stories/sinagot(1).jpg', caption: '' },
            ],
        },
        {
            id: 6,
            label: 'Picture from our First Dikit ulo',
            cover: '/assets/stories/dikitulo.jpg',
            slides: [{ img: '/assets/stories/dikitulo.jpg', caption: 'You are my sunshine ☀️' }],
        },
        {
            id: 7,
            label: 'Christmas 2023 💝',
            cover: '/assets/stories/christmas2023.jpg',
            slides: [{ img: '/assets/stories/christmas2023.jpg', caption: 'My heart is yours :)))' },
            { img: '/assets/stories/christmas2023(1).jpg', caption: '' },
            ],
        },
        {
            id: 8,
            label: '1st valentines pic together 2024 💞',
            cover: '/assets/stories/valentines1st.jpg',
            slides: [{ img: '/assets/stories/valentines1st.jpg', caption: 'Always and forever 💞' },
            { img: '/assets/stories/valentines1stt.jpg', caption: '' },
            ],
        },
        {
            id: 9,
            label: 'Picture from my 2nd birthday ✨',
            cover: '/assets/stories/2ndbd.jpg',
            slides: [{ img: '/assets/stories/2ndbd.jpg', caption: 'Your smile lights up my world! mwa!' },
            { img: '/assets/stories/2ndbd(1).jpg', caption: '' },
            { img: '/assets/stories/2ndbd(2).jpg', caption: '' }
            ],
        },
        {
            id: 10,
            label: 'Picture from our 1st anniversary 🤗',
            cover: '/assets/stories/1stanniv.jpg',
            slides: [{ img: '/assets/stories/1stanniv.jpg', caption: 'Happiest with you 🤗' },
            { img: '/assets/stories/1stanniv(1).jpg', caption: '' },
            { img: '/assets/stories/1stanniv(2).jpg', caption: '' }
            ],
        },
        {
            id: 11,
            label: 'Picture from your 2nd birthday 🏠💕',
            cover: '/assets/stories/2ndketbirth.jpg',
            slides: [{ img: '/assets/stories/2ndketbirth.jpg', caption: 'My safe place 🏠' },
            { img: '/assets/stories/2ndketbirth(1).jpg', caption: '' },
            { img: '/assets/stories/2ndketbirth(2).jpg', caption: '' }
            ],
        },
        {
            id: 12,
            label: 'Christmas 2024 💑',
            cover: '/assets/stories/dec2024.jpg',
            slides: [{ img: '/assets/stories/dec2024.jpg', caption: 'Together is my favorite place 💑' },
            { img: '/assets/stories/dec2024(1).jpg', caption: '' },
            { img: '/assets/stories/dec2024(2).jpg', caption: '' },
            { img: '/assets/stories/dec2024(3).jpg', caption: '' },
            { img: '/assets/stories/dec2024(4).jpg', caption: '' },
            ],
        },
        {
            id: 13,
            label: '2nd valentines pic together 2025 🙏',
            cover: '/assets/stories/2ndvalentines.jpg',
            slides: [{ img: '/assets/stories/2ndvalentines.jpg', caption: 'My answered prayer :))' },
            { img: '/assets/stories/2ndvalentines(1).jpg', caption: '' },
            { img: '/assets/stories/2ndvalentines(2).jpg', caption: '' },
            { img: '/assets/stories/2ndvalentines(3).jpg', caption: '' },
            { img: '/assets/stories/2ndvalentines(4).jpg', caption: '' },
            { img: '/assets/stories/2ndvalentines(5).jpg', caption: '' },
            ],
        },
        {
            id: 14,
            label: 'Picture from my 3rd birthday 🌹',
            cover: '/assets/stories/3rdbd.jpg',
            slides: [{ img: '/assets/stories/3rdbd.jpg', caption: 'Best thing in my life 🌹' },
            { img: '/assets/stories/3rdbd(1).jpg', caption: '' },
            { img: '/assets/stories/3rdbd(2).jpg', caption: '' },
            { img: '/assets/stories/3rdbd(3).jpg', caption: '' },
            ],
        },
        {
            id: 15,
            label: '2nd anniversary 💗',
            cover: '/assets/stories/2ndanniv.jpg',
            slides: [{ img: '/assets/stories/2ndanniv.jpg', caption: 'Ikaw lang, palagi!' },
            { img: '/assets/stories/2ndanniv(1).jpg', caption: '' },
            { img: '/assets/stories/2ndanniv(2).jpg', caption: '' },
            { img: '/assets/stories/2ndanniv(3).jpg', caption: '' },
            ],
        },
        {
            id: 16,
            label: 'Picture from your 3rd birthday 💘',
            cover: '/assets/stories/ketbd.jpg',
            slides: [{ img: '/assets/stories/ketbd.jpg', caption: 'Mahal na mahal kita 💘' },
            { img: '/assets/stories/ketbd(1).jpg', caption: '' },
            { img: '/assets/stories/ketbd(2).jpg', caption: '' },
            { img: '/assets/stories/ketbd(3).jpg', caption: '' },
            { img: '/assets/stories/ketbd(4).jpg', caption: '' },
            ],
        },
        {
            id: 17,
            label: 'Picture from our 3rd christmas and new year together 🚀',
            cover: '/assets/stories/2025(1).jpg',
            slides: [{ img: '/assets/stories/2025(1).jpg', caption: '<3333333' },
            { img: '/assets/stories/2025.jpg', caption: '' },
            { img: '/assets/stories/2025(2).jpg', caption: '' },
            { img: '/assets/stories/2025(3).jpg', caption: '' },
            { img: '/assets/stories/2025(4).jpg', caption: '' },
            ],
        },
    ];

    const currentStory = activeStory !== null ? stories[activeStory] : null;

    const goNextSlide = useCallback(() => {
        if (activeStory === null || !currentStory) return;
        if (activeSlide < currentStory.slides.length - 1) {
            setActiveSlide(prev => prev + 1);
            setProgress(0);
        } else {
            if (activeStory < stories.length - 1) {
                const nextStory = activeStory + 1;
                setActiveStory(nextStory);
                setActiveSlide(0);
                setProgress(0);
                setViewedStories(prev => new Set(prev).add(nextStory));
            } else {
                setActiveStory(null);
                setActiveSlide(0);
                setProgress(0);
            }
        }
    }, [activeStory, activeSlide, currentStory, stories.length]);

    const goPrevSlide = useCallback(() => {
        if (activeStory === null) return;
        if (activeSlide > 0) {
            setActiveSlide(prev => prev - 1);
            setProgress(0);
        } else if (activeStory > 0) {
            const prevStoryIndex = activeStory - 1;
            setActiveStory(prevStoryIndex);
            setActiveSlide(stories[prevStoryIndex].slides.length - 1);
            setProgress(0);
        }
    }, [activeStory, activeSlide, stories]);

    useEffect(() => {
        if (activeStory === null) return;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    goNextSlide();
                    return 0;
                }
                return prev + (100 / (STORY_DURATION / 50));
            });
        }, 50);
        return () => clearInterval(interval);
    }, [activeStory, activeSlide, goNextSlide]);

    const openStory = (index: number) => {
        setActiveStory(index);
        setActiveSlide(0);
        setProgress(0);
        setViewedStories(prev => new Set(prev).add(index));
    };

    const closeStory = () => {
        setActiveStory(null);
        setActiveSlide(0);
        setProgress(0);
    };

    const handleStoryTap = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 3) {
            goPrevSlide();
        } else {
            goNextSlide();
        }
        setProgress(0);
    };

    return (
        <div
            className="relative min-h-screen overflow-hidden pb-24 sm:pb-28"
            style={{
                backgroundImage:
                    "linear-gradient(180deg, rgba(21,10,18,0.85) 0%, rgba(28,14,24,0.9) 40%, rgba(18,8,16,0.95) 100%), url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80&cs=tinysrgb')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <BackgroundEffects />
            <Header onLogout={onLogout} />
            <StoriesRow stories={stories} viewedStories={viewedStories} onOpenStory={openStory} />
            <BouquetSection />
            <ClawMachineSection />
            <BottleExperience />
            {activeStory !== null && currentStory && (
                <StoryViewer
                    story={currentStory}
                    activeSlide={activeSlide}
                    progress={progress}
                    onTap={handleStoryTap}
                    onClose={closeStory}
                />
            )}
            <Chatbot />
        </div>
    );
}

export default LandingPage;
