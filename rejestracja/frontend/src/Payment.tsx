import { useState, useEffect, useRef } from "react"
import Stack from "react-bootstrap/Stack"
import Button from "react-bootstrap/Button"
import type { ServiceSelection } from "./Questionnaire"

export function Payment({ service, discountPercent, discountCode }: { service: ServiceSelection, discountPercent: number, discountCode: string | null }) {
    const pricePln = Math.max(1, Math.round(service.pricePln * (100 - discountPercent) / 100))
    return <PaymentWidget pricePln={pricePln} paymentWidgetUrl={service.paymentWidgetUrl} discountCode={discountCode} />
}

function PaymentWidget({ pricePln, paymentWidgetUrl, discountCode }: { pricePln: number; paymentWidgetUrl: string; discountCode: string | null }) {
    const [showWidget, setShowWidget] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (!showWidget || !iframeRef.current) return

        const iframe = iframeRef.current
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return

        const url = new URL(paymentWidgetUrl)
        url.searchParams.set('lang', 'pl')
        url.searchParams.set('price', `${pricePln}`)
        if (discountCode) {
            url.searchParams.set('promocode', discountCode)
        }

        doc.open()
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
                <link href="https://s3-eu-west-1.amazonaws.com/assets.firmlet.com/assets/fakturownia/widget.css" rel="stylesheet" type="text/css" />
            </head>
            <body>
                <script type="text/javascript" src="${url.href}"></script>
            </body>
            </html>
        `)
        doc.close()
    }, [showWidget, pricePln, paymentWidgetUrl, discountCode])

    if (showWidget) {
        return (
            <iframe
                ref={iframeRef}
                style={{ width: '100%', minHeight: '800px', border: '1px solid #dee2e6', borderRadius: '8px', boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)' }}
                title="Payment Widget"
            />
        )
    }

    return (
        <Stack>
            <Button variant="primary" className="mx-auto" onClick={() => setShowWidget(true)}>
                Przejdź do płatności i szczegółów
            </Button>
        </Stack>
    )
}
