import axios from "axios";
import type { AvailableTimeslot } from "./vendor/react-schedule-meeting/src";

declare global {
    interface Window {
        apiBaseUrl: string;
    }
}

const apiClient = axios.create({ baseURL: window.apiBaseUrl, withCredentials: true })

export async function getCurrentUser(): Promise<{ loggedIn: boolean, email: string }> {
    const resp = await apiClient.get<{ loggedIn: boolean, email: string }>('/api/user')
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
