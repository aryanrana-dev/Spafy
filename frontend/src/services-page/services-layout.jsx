import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import SplashScreen from "./splash";
import HomepageLayout from "./homepage-layout";

export default function ServicesLayout() {
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSplashVisible(false);
        }, 3000); // 3 Seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen">
            <AnimatePresence mode="wait">
                {isSplashVisible ? (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <SplashScreen />
                    </motion.div>
                ) : (
                    <motion.div
                        key="homepage"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <HomepageLayout />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}