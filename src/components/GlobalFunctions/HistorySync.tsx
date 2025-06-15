import { useEffect } from "react";
import { userAPI } from "@/connections/api";

const HistorySync = () => {
    useEffect(() => {
        const sync = async () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);
            if (!Array.isArray(user.lastViewed)) return;
            try {
                await userAPI.updateHistory(user.lastViewed);
            } catch (error) {
                console.error('Error updating user history:', error);
            }
        }
        sync();
        const interval = setInterval(sync, 300000); // Sync every 5 minutes
        return () => clearInterval(interval);
    }, []);
    return null; // This component does not render anything
}

export default HistorySync;