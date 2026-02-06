export interface RequiredData {
    appointmentDate: boolean;
    address: boolean;
    prescriptionInfo: boolean;
}

export interface ServiceSelection {
    id: string;
    type: string;
    description: string;
    durationMinutes: number | null;
    pricePln: number;
    requiredData: RequiredData;
}

export interface SelectionProps {
    service: ServiceSelection | null;
    setService: (service: ServiceSelection | null) => void;
}

export interface PatientData {
    name: string;
    phone: string;
    suggestedDates?: string;
    address?: string;
    medications?: string;
    healthDescription?: string;
    comment?: string;
}
