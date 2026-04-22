import {useEffect} from 'react';
import '../assets/SongToast.css';

const SongToast = ({message,type="error", onClose}) => {
    useEffect(() => {
        if(!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    if(!message) return null;
    return (
        <div className={`song-toast ${type}`}>
            <span>{String(message)}</span>
            <button className="song-toast-close" onClick={onClose}>
                &times;
            </button>
        </div>
    );
};

export default SongToast;