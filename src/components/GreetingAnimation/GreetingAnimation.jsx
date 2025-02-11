import React, { useState, useEffect } from 'react';
import './GreetingAnimation.css';

const GreetingAnimation = () => {
    const greetings = [
        'Hello',
        'Namaste',
        'Hola',
        // 'Bonjour',
        // 'Hallo',
        // 'Ciao',
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (isCompleted) return; // Stop the animation if completed

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                if (prevIndex + 1 === greetings.length) {
                    // If last greeting is reached, mark as complete and clear interval
                    setIsCompleted(true);
                    clearInterval(interval);
                    return prevIndex; // Return the current index to stop updating
                }
                return prevIndex + 1;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [isCompleted, greetings.length]);

    return (
        !isCompleted && (
            <div className="animation-container absolute h-screen w-screen bg-black">
                <h1 className="greeting-text">{greetings[currentIndex]}</h1>
            </div>
        )
    );
};

export default GreetingAnimation;
