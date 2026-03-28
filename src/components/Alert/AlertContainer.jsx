import React from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import Alert from './Alert';
import './Alert.css';

const AlertContainer = () => {
    const alerts = useSelector((state) => state.ui.alerts);

    return (
        <div className="app-alert-container">
            <AnimatePresence>
                {alerts.map((alert) => (
                    <Alert key={alert.id} alert={alert} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AlertContainer;
