import Stack from "react-bootstrap/Stack"
import Button from "react-bootstrap/Button"
import type { ServiceSelection } from "./Questionnaire"

export function Payment({ service, discountPercent, discountCode }: { service: ServiceSelection, discountPercent: number, discountCode: string | null }) {
    const pricePln = Math.max(1, Math.round(service.pricePln * (100 - discountPercent) / 100))
    // TODO implement payments
    return (
        <Stack>
        </Stack>
    )
}
