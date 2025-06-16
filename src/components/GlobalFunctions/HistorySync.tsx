import { useEffect } from "react";
import { userAPI } from "@/connections/api";

const HistorySync = () => {
    useEffect(() => {
        const sync = async () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);
            if (!Array.isArray(user.lastViewedTasks)) return;
            try {
                await userAPI.updateLastViewed(user.lastViewedTasks);
            } catch (error) {
                console.error('Error updating user last viewed:', error);
            }
        }
        sync();
        const interval = setInterval(sync, 300000); // Sync every 5 minutes
        return () => clearInterval(interval);
    }, []);
    return null; // This component does not render anything
}

export default HistorySync;