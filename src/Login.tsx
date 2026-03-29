import { useState } from 'react';
import Chatbot from './components/Chatbot';
import FloatingHearts from './components/Login/FloatingHearts';
import ImagePopup from './components/Login/ImagePopup';
import VideoPopup from './components/Login/VideoPopup';
import HeroSection from './components/Login/HeroSection';
import LoginCard from './components/Login/LoginCard';

interface LoginProps {
    onLogin: () => void;
}

const heartVideos = [
    '/src/assets/vid1.mp4',
    '/src/assets/vid2.mp4',
    '/src/assets/vid3.mp4',
];

const heartImages = [
    '/src/assets/pic1.jpg', '/src/assets/pic2.jpg', '/src/assets/pic3.jpg',
    '/src/assets/pic4.jpg', '/src/assets/pic5.jpg', '/src/assets/pic6.jpg',
    '/src/assets/pic7.jpg', '/src/assets/pic8.jpg', '/src/assets/pic9.jpg',
    '/src/assets/pic10.jpg', '/src/assets/pic11.jpg', '/src/assets/pic12.jpg',
    '/src/assets/pic13.jpg', '/src/assets/pic14.jpg', '/src/assets/pic15.jpg',
    '/src/assets/pic16.jpg', '/src/assets/pic17.jpg', '/src/assets/pic18.jpg',
];

const failMessages = [
    "Did you forget it?",
    "How can you forget it?! 😤💔",
    "Seriously love?? Think harder! 💔",
    "Love, ouch ouch na hays... 😢",
    "Naunsa mana! 😤",
    "ARE WE OKAY?! 😩",
    "I can't believe this... 💀",
    "Eme lang ba yan mhie?",
    "Kiss mo ako ng marami dapat pag nagkita tayo!😤",
    "Matanda na yarn? makakalimutin na yarn?",
];

function Login({ onLogin }: LoginProps) {
    const [callsign, setCallsign] = useState('');
    const [specialDay, setSpecialDay] = useState('');
    const [heartOpen, setHeartOpen] = useState(false);
    const [clickedHeart, setClickedHeart] = useState<number | null>(null);
    const [clickedVideo, setClickedVideo] = useState<number | null>(null);
    const [failCount, setFailCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = () => {
        if (callsign.toLowerCase() === 'tightest' && specialDay === '2023-09-18') {
            setErrorMsg('');
            onLogin();
        } else {
            const msg = failMessages[failCount % failMessages.length];
            setErrorMsg(msg);
            setFailCount(prev => prev + 1);
        }
    };

    const handleBgHeartClick = (index: number, _e: React.MouseEvent) => {
        setClickedHeart(index);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-200 via-red-100 to-pink-300">
            <FloatingHearts onHeartClick={handleBgHeartClick} />

            {clickedHeart !== null && (
                <ImagePopup
                    imageSrc={heartImages[clickedHeart % heartImages.length]}
                    onClose={() => setClickedHeart(null)}
                />
            )}

            {clickedVideo !== null && (
                <VideoPopup
                    videoSrc={heartVideos[clickedVideo]}
                    onClose={() => setClickedVideo(null)}
                />
            )}

            <div className="flex min-h-screen flex-col lg:flex-row">
                <HeroSection onVideoClick={setClickedVideo} />
                <LoginCard
                    callsign={callsign}
                    specialDay={specialDay}
                    heartOpen={heartOpen}
                    errorMsg={errorMsg}
                    onCallsignChange={setCallsign}
                    onSpecialDayChange={setSpecialDay}
                    onHeartToggle={() => setHeartOpen(!heartOpen)}
                    onLogin={handleLogin}
                />
            </div>

            <Chatbot />
        </div>
    );
}

export default Login;