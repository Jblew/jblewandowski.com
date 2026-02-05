
export interface ServiceSelection {
    id: string;
    type: string;
    description: string;
    durationMinutes: number | null;
    pricePln: number;
}

export interface SelectionProps {
    service: ServiceSelection | null;
    setService: (service: ServiceSelection | null) => void;
}
