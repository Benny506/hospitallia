import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.svg';
import './Loader.css';

const Loader = () => {
    const { isVisible, text } = useSelector((state) => state.ui.loader);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="global-loader-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="loader-content">
                        <motion.div
                            className="loader-logo-container"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 0, 360],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <img src={logo} alt="Hospitallia Logo" className="loader-logo" />
                        </motion.div>

                        <motion.div
                            className="loader-text-container"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="loader-text">{text}</h3>
                            <div className="loader-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;
