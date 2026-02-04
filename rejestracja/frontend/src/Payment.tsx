import Stack from "react-bootstrap/Stack"
import Button from "react-bootstrap/Button"
import type { ServiceSelection } from "./Questionnaire"

export function Payment({ service, discountPercent, discountCode }: { service: ServiceSelection, discountPercent: number, discountCode: string | null }) {
    const pricePln = Math.max(1, Math.round(service.pricePln * (100 - discountPercent) / 100))

    const paymentUrl = new URL(service.paymentWidgetUrl)
    paymentUrl.searchParams.set('lang', 'pl')
    paymentUrl.searchParams.set('price', `${pricePln}`)
    if (discountCode) {
        paymentUrl.searchParams.set('promocode', discountCode)
    }

    const apiPaymentUrl = `${window.apiBaseUrl}/api/payment?widgetUrl=${encodeURIComponent(paymentUrl.href)}`

    return (
        <Stack>
            <Button
                as="a"
                href={apiPaymentUrl}
                variant="primary"
                className="mx-auto"
            >
                Przejdź do płatności i szczegółów
            </Button>
        </Stack>
    )
}
