import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert'
import type { PatientData, ServiceSelection } from './Questionnaire/types'

interface PatientDataFormProps {
    service: ServiceSelection
    patientData: PatientData
    setPatientData: (data: PatientData) => void
    disabled?: boolean
}

function EncryptedInput({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    as,
    rows,
    disabled,
    required = false,
    helpText,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    type?: string
    as?: 'textarea'
    rows?: number
    disabled?: boolean
    required?: boolean
    helpText?: string
}) {
    const controlId = label.toLowerCase().replace(/\s/g, '-')
    return (
        <Form.Group className="mb-3" controlId={controlId}>
            <Form.Label>🔐 {label} {required && <span className="text-danger">*</span>}</Form.Label>
                <Form.Control
                    type={type}
                    as={as}
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    required={required}
                />
            {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
        </Form.Group>
    )
}

export function PatientDataForm({ service, patientData, setPatientData, disabled }: PatientDataFormProps) {
    const updateField = <K extends keyof PatientData>(field: K, value: PatientData[K]) => {
        setPatientData({ ...patientData, [field]: value })
    }

    const { appointmentDate: showAppointmentDate, address: showAddress, prescriptionInfo: showPrescriptionFields } = service.requiredData

    return (
        <>
            <Alert variant="info" className="d-flex align-items-center gap-2 mb-3">
                    Pola oznaczone kłódką (🔐) są <strong>szyfrowane</strong> i mogą zostać odczytane wyłącznie przez lekarza.
            </Alert>

            <EncryptedInput
                label="Imię i nazwisko"
                value={patientData.name}
                onChange={(v) => updateField('name', v)}
                placeholder="Jan Kowalski"
                disabled={disabled}
                type="text"
                required
            />

            <EncryptedInput
                label="Numer telefonu"
                value={patientData.phone}
                onChange={(v) => updateField('phone', v)}
                placeholder="+48 123 456 789"
                type="tel"
                disabled={disabled}
                required
            />

            {showAppointmentDate && (
                <EncryptedInput
                    label="Proponowane terminy wizyty"
                    value={patientData.suggestedDates || ''}
                    onChange={(v) => updateField('suggestedDates', v)}
                    placeholder="np. poniedziałek po 16:00, środa rano, sobota cały dzień..."
                    as="textarea"
                    rows={4}
                    disabled={disabled}
                    required
                    helpText="Podaj kilka propozycji terminów. Odpiszę SMS-em, czy termin jest dostępny lub zaproponuję inny."
                />
            )}

            {showAddress && (
                <EncryptedInput
                    label="Adres wizyty domowej"
                    value={patientData.address || ''}
                    onChange={(v) => updateField('address', v)}
                    placeholder="ul. Przykładowa 15/3, 00-001 Warszawa"
                    disabled={disabled}
                    required
                    helpText="Wizyty domowe realizowane w promieniu 5 km od centrum."
                />
            )}

            {showPrescriptionFields && (
                <>
                    <Alert variant="warning" className="mb-3">
                        <strong>Uwaga:</strong> Przedłużam recepty wyłącznie w sytuacji, gdy:
                            (1) sam wypisałem dany lek wcześniej, lub (2) uzgodniliśmy na wcześniejszej kontynuację leczenia danym lekiem wypisanym przez innego lekarza.
                    </Alert>

                    <EncryptedInput
                        label="Leki do przedłużenia"
                        value={patientData.medications || ''}
                        onChange={(v) => updateField('medications', v)}
                        placeholder="np. Metformina 500mg, Amlodypina 5mg..."
                        as="textarea"
                        rows={4}
                        disabled={disabled}
                        required
                        helpText="Podaj nazwy leków i dawkowanie."
                    />

                    <EncryptedInput
                        label="Opis stanu zdrowia"
                        value={patientData.healthDescription || ''}
                        onChange={(v) => updateField('healthDescription', v)}
                        placeholder="Aktualny stan zdrowia, ostatnie wyniki badań, zmiany w samopoczuciu..."
                        as="textarea"
                        rows={4}
                        disabled={disabled}
                        required
                    />
                </>
            )}

            <EncryptedInput
                label="Dodatkowy komentarz"
                value={patientData.comment || ''}
                onChange={(v) => updateField('comment', v)}
                placeholder="Dodatkowe informacje, pytania..."
                as="textarea"
                rows={4}
                disabled={disabled}
            />
        </>
    )
}
