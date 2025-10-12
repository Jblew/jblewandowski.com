import { useEffect, useState } from 'react';
import { ScheduleMeeting } from './vendor/react-schedule-meeting/src';
import { getAvailableTimeSlots } from './services';
import type { AvailableTimeslot } from './vendor/react-schedule-meeting/src/index';

export function Schedule({ durationMinutes }: { durationMinutes: number }) {
    const [availableTimeslots, setAvailableTimeslots] = useState<AvailableTimeslot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        console.log('USE EFFECT')
        setLoading(true);
        getAvailableTimeSlots()
            .then((availableTimeSlots) => {
                setAvailableTimeslots(availableTimeSlots);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [durationMinutes]);

    if (loading) {
        return <div className="alert alert-info">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error: {error.message}</div>;
    }

    // Docs: https://react-schedule-meeting.netlify.app/docs/all-props
    if (availableTimeslots.length > 0) {
        return (
            <ScheduleMeeting
                borderRadius={10}
                primaryColor="#3f5b85"
                eventDurationInMinutes={durationMinutes}
                availableTimeslots={availableTimeslots}
                onStartTimeSelect={console.log}
            />
        );
    }
    return (<strong>W najbliszych dniach praktyka nie jest otwarta</strong>)
}
