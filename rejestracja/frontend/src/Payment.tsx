import  Stack from "react-bootstrap/Stack"
import  Button from "react-bootstrap/Button"
import type { ServiceSelection } from "./Questionnaire"

export function Payment({ service, discountPercent, discountCode }: { service: ServiceSelection, discountPercent: number, discountCode: string | null }) {
    const pricePln = Math.round(service.pricePln * (100 - discountPercent) / 100)
    return <PaymentClick pricePln={pricePln} paymentLink={service.paymentLink} discountCode={discountCode} />
}

function PaymentClick({ pricePln, paymentLink, discountCode }: { pricePln: number; paymentLink: string; discountCode: string | null }) {
    const url = new URL(paymentLink)
    url.searchParams.set('price', `${pricePln}`)
    if (discountCode) {
        url.searchParams.set('promocode', discountCode)
    }
        return (
        <Stack>
            <Button variant="primary" className="mx-auto" href={url.href}>Przejdź do płatności i szczegółów</Button>
        </Stack>
    ) 
}
