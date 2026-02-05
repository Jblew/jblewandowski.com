import { useEffect, useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

type PaymentStatus = 'success' | 'error' | null;

function getPaymentStatusFromUrl(): PaymentStatus {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (payment === 'success' || payment === 'error') {
        return payment;
    }
    return null;
}

function clearPaymentStatusFromUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('payment');
    window.history.replaceState({}, '', url.toString());
}

interface PaymentResultProps {
    onClose: () => void;
}

export function usePaymentStatus() {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);

    useEffect(() => {
        const status = getPaymentStatusFromUrl();
        if (status) {
            setPaymentStatus(status);
            clearPaymentStatusFromUrl();
        }
    }, []);

    return { paymentStatus, clearPaymentStatus: () => setPaymentStatus(null) };
}

export function PaymentResult({ status, onClose }: { status: 'success' | 'error'; onClose: () => void }) {
    if (status === 'success') {
        return (
            <Stack gap={3} className="text-center py-4">
                <Alert variant="success">
                    <Alert.Heading>Płatność zakończona sukcesem!</Alert.Heading>
                    <p className="mb-0">
                        Wkrótce otrzymasz potwierdzenie na podany adres email.
                        Dziękujemy za dokonanie płatności.
                    </p>
                </Alert>
                <Button variant="outline-primary" onClick={onClose}>
                    Powrót do rejestracji
                </Button>
            </Stack>
        );
    }

    return (
        <Stack gap={3} className="text-center py-4">
            <Alert variant="danger">
                <Alert.Heading>Płatność nie powiodła się</Alert.Heading>
                <p className="mb-0">
                    Wystąpił problem podczas przetwarzania płatności.
                    Spróbuj ponownie lub skontaktuj się z nami.
                </p>
            </Alert>
            <Button variant="primary" onClick={onClose}>
                Spróbuj ponownie
            </Button>
        </Stack>
    );
}
