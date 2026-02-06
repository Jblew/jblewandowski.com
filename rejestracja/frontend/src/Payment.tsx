import { useState } from "react"
import Stack from "react-bootstrap/Stack"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"
import type { ServiceSelection } from "./Questionnaire"
import type { PatientData } from "./Questionnaire/types"
import { sendReceipt } from "./services"
import { PatientDataForm } from "./PatientDataForm"
import { encryptData } from "./encryption"

export function Payment({ service, discountPercent, discountCode }: { service: ServiceSelection, discountPercent: number, discountCode: string | null }) {
    const [payerEmail, setPayerEmail] = useState('')
    const [patientData, setPatientData] = useState<PatientData>({
        name: '',
        phone: '',
        suggestedDates: '',
        address: '',
        medications: '',
        healthDescription: '',
        comment: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)

    const pricePln = Math.max(1, Math.round(service.pricePln * (100 - discountPercent) / 100))

    const validatePatientData = (): string | null => {
        if (!patientData.name.trim()) return 'Podaj imię i nazwisko'
        if (!patientData.phone.trim()) return 'Podaj numer telefonu'
        if (service.requiredData.appointmentDate && !patientData.suggestedDates?.trim()) {
            return 'Podaj proponowane terminy wizyty'
        }
        if (service.requiredData.address && !patientData.address?.trim()) {
            return 'Podaj adres wizyty domowej'
        }
        if (service.requiredData.prescriptionInfo) {
            if (!patientData.medications?.trim()) return 'Podaj leki do przedłużenia'
            if (!patientData.healthDescription?.trim()) return 'Opisz stan zdrowia'
        }
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!payerEmail) {
            setError('Podaj adres e-mail')
            return
        }

        const validationError = validatePatientData()
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        try {
            const encryptedPatientData = await encryptData(patientData)
            await sendReceipt({
                serviceId: service.id,
                payerEmail,
                discountCode: discountCode ?? undefined,
                discountPercent: discountCode ? discountPercent : undefined,
                encryptedPatientData,
            })
            setSent(true)
        } catch (err) {
            console.error('Błąd wysyłania paragonu:', err)
            setError('Wystąpił błąd podczas wysyłania paragonu. Spróbuj ponownie.')
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <Stack gap={3}>
                <Alert variant="success">
                    <Alert.Heading>Paragon wysłany!</Alert.Heading>
                    <p className="mb-0">
                        Na adres <strong>{payerEmail}</strong> został wysłany paragon z linkiem do płatności.
                        Sprawdź swoją skrzynkę e-mail.
                    </p>
                </Alert>
            </Stack>
        )
    }

    return (
        <Stack gap={3}>
            <h3>Paragon i płatność</h3>
            <Alert variant="info" className="mb-0">
                <p className="mb-1"><strong>Usługa:</strong> {service.type}</p>
                <p className="mb-1"><strong>Opis:</strong> {service.description}</p>
                {discountPercent > 0 ? (
                    <p className="mb-0">
                        <strong>Cena:</strong> <del>{service.pricePln} zł</del> <span className="text-success fw-bold">{pricePln} zł</span>
                        <span className="text-muted ms-2">(-{discountPercent}%)</span>
                    </p>
                ) : (
                    <p className="mb-0"><strong>Cena:</strong> {pricePln} zł</p>
                )}
            </Alert>

            <Form onSubmit={handleSubmit}>
                <PatientDataForm
                    service={service}
                    patientData={patientData}
                    setPatientData={setPatientData}
                    disabled={loading}
                />

                <Form.Group className="mb-3" controlId="payerEmail">
                    <Form.Label>Adres e-mail <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="jan.kowalski@example.com"
                        value={payerEmail}
                        onChange={(e) => setPayerEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <Form.Text className="text-muted">
                        Na ten adres otrzymasz paragon z linkiem do płatności
                    </Form.Text>
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}

                <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg" disabled={loading}>
                        {loading ? 'Wysyłanie...' : `Wyślij link do płatności`}
                    </Button>
                </div>
            </Form>
        </Stack>
    )
}
