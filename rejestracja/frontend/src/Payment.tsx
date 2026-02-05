import { useState } from "react"
import Stack from "react-bootstrap/Stack"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"
import type { ServiceSelection } from "./Questionnaire"
import { createPayment } from "./services"

export function Payment({ service, discountPercent, discountCode }: { service: ServiceSelection, discountPercent: number, discountCode: string | null }) {
    const [payerEmail, setPayerEmail] = useState('')
    const [payerName, setPayerName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const pricePln = Math.max(1, Math.round(service.pricePln * (100 - discountPercent) / 100))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!payerEmail || !payerName) {
            setError('Wypelnij wszystkie pola')
            return
        }

        setLoading(true)
        try {
            const response = await createPayment({
                serviceId: service.id,
                serviceName: service.type,
                amount: service.pricePln,
                payerEmail,
                payerName,
                discountCode: discountCode ?? undefined,
                discountPercent: discountCode ? discountPercent : undefined,
            })

            window.location.href = response.transactionPaymentUrl
        } catch (err) {
            console.error('Payment error:', err)
            setError('Wystapil blad podczas tworzenia platnosci. Sprobuj ponownie.')
            setLoading(false)
        }
    }

    return (
        <Stack gap={3}>
            <h3>3. Dane do platnosci</h3>

            <div className="bg-light p-3 rounded">
                <p className="mb-1"><strong>Usluga:</strong> {service.type}</p>
                <p className="mb-1"><strong>Opis:</strong> {service.description}</p>
                {discountPercent > 0 ? (
                    <p className="mb-0">
                        <strong>Cena:</strong> <del>{service.pricePln} zl</del> <span className="text-success fw-bold">{pricePln} zl</span>
                        <span className="text-muted ms-2">(-{discountPercent}%)</span>
                    </p>
                ) : (
                    <p className="mb-0"><strong>Cena:</strong> {pricePln} zl</p>
                )}
            </div>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="payerName">
                    <Form.Label>Imie i nazwisko</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Jan Kowalski"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        disabled={loading}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="payerEmail">
                    <Form.Label>Adres email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="jan.kowalski@example.com"
                        value={payerEmail}
                        onChange={(e) => setPayerEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <Form.Text className="text-muted">
                        Na ten adres otrzymasz potwierdzenie platnosci
                    </Form.Text>
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}

                <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg" disabled={loading}>
                        {loading ? 'Przekierowanie do platnosci...' : `Zaplac BLIK - ${pricePln} zl`}
                    </Button>
                </div>

                <p className="text-muted text-center mt-2 small">
                    Zostaniesz przekierowany na strone Tpay w celu dokonania platnosci BLIK
                </p>
            </Form>
        </Stack>
    )
}
