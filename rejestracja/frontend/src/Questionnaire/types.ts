import Button, { type ButtonProps } from 'react-bootstrap/esm/Button';
import Stack from 'react-bootstrap/esm/Stack';

export interface ServiceSelection {
    id: string;
    type: string;
    description: string;
    durationMinutes: number | null;
    pricePln: number;
    paymentLink: string
}

export interface SelectionProps {
    service: ServiceSelection | null;
    setService: (service: ServiceSelection | null) => void;
    discountPercent: number;
}
