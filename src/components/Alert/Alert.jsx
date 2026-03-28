import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { removeAlert } from '../../redux/uiSlice';
import {
    IoCheckmarkCircle,
    IoCloseCircle,
    IoInformationCircle,
    IoWarning,
    IoClose
} from 'react-icons/io5';
import './Alert.css';

const icons = {
    success: <IoCheckmarkCircle className="alert-icon" />,
    error: <IoCloseCircle className="alert-icon" />,
    info: <IoInformationCircle className="alert-icon" />,
    warning: <IoWarning className="alert-icon" />,
};

const Alert = ({ alert }) => {
    const dispatch = useDispatch();
    const { id, type, title, message, duration } = alert;

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeAlert(id));
        }, duration);

        return () => clearTimeout(timer);
    }, [dispatch, id, duration]);

    const handleClose = () => {
        dispatch(removeAlert(id));
    };

    return (
        <motion.div
            className={`app-alert alert-${type}`}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
        >
            <div className="alert-icon-container">
                {icons[type]}
            </div>
            <div className="alert-content">
                {title && <h6 className="alert-title">{title}</h6>}
                <p className="alert-message">{message}</p>
            </div>
            <button className="alert-close-btn" onClick={handleClose}>
                <IoClose />
            </button>
            <div className="alert-progress-bar">
                <motion.div
                    className="alert-progress-fill"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: duration / 1000, ease: "linear" }}
                />
            </div>
        </motion.div>
    );
};

export default Alert;
