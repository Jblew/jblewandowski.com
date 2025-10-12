import axios from "axios";
import type { AvailableTimeslot } from "./vendor/react-schedule-meeting/src";

declare global {
    interface Window {
        apiBaseUrl: string;
    }
}

const apiClient = axios.create({ 
    baseURL: window.apiBaseUrl, 
    withCredentials: true,
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
    }
})

// Add request interceptor to append timestamp for cache busting
apiClient.interceptors.request.use((config) => {
    // Add timestamp to URL to prevent caching
    const timestamp = Date.now();
    const separator = config.url?.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}_t=${timestamp}`;
    return config;
});

export async function getCurrentUser(): Promise<{ loggedIn: boolean, email: string }> {
    const resp = await apiClient.get<{ loggedIn: boolean, email: string }>('/user')
    return resp.data
}

export async function getAvailableTimeSlots(): Promise<AvailableTimeslot[]> {
    const resp = await apiClient.get<{
        availableTimeSlots: {
            startTime: string
            endTime: string
            id?: string
        }[]
    }>('/api/availableTimeSlots')
    if (!resp.data.availableTimeSlots) {
        throw new Error('Malformed response')
    }
    return resp.data.availableTimeSlots
}
