import { useState, useEffect } from "react"
import  Stack from "react-bootstrap/Stack"
import  Button from "react-bootstrap/Button"
import type { ServiceSelection } from "./Questionnaire"
import axios from "axios"

export function Payment({ service, discountPercent }: { service: ServiceSelection, discountPercent: number }) {
    const pricePln = Math.round(service.pricePln * (100 - discountPercent) / 100)
    return <PaymentClick pricePln={pricePln} paymentLink={service.paymentLink} />
}

function PaymentClick({ pricePln, paymentLink }: { pricePln: number; paymentLink: string }) {
    // const [isEnabled, setEnabled] = useState(false)
    
    // useEffect(() => {
    //     setEnabled(false)
    // }, [pricePln])

    // if(isEnabled) {
    //     // const src = `https://app.fakturownia.pl/a/jedrzejlewandowski/p/W8hbdVpHfyGULqs1mL3v.js?lang=pl&price=${pricePln}`
    //     // return (
    //     //     <script type="text/javascript" src={src}></script>
    //     // )
    //     return <PaymentForPrice pricePln={pricePln} paymentLink={paymentLink} />
    // }
    // return (
    //     <Stack>
    //         <Button variant="primary" className="mx-auto" onClick={() => setEnabled(true)}>Przejdź do płatności</Button>
    //     </Stack>
    // )
        return (
        <Stack>
            <Button variant="primary" className="mx-auto" href={paymentLink}>Przejdź do płatności</Button>
        </Stack>
    ) 
}

// function PaymentForPrice({ pricePln, paymentLink }: { pricePln: number; paymentLink: string }) {
//     const [isLoading, setLoading] = useState(false)
//     useEffect(() => {loadComponent().catch(console.error)}, []) // TODO error display
//     async function loadComponent() {
//         setLoading(true)
//         try {
//             const res = await axios(`https://app.fakturownia.pl/a/jedrzejlewandowski/p/W8hbdVpHfyGULqs1mL3v.js?lang=pl&price=${pricePln}`)
//             console.dir(res)
//         } finally {
//             setLoading(false)
//         }
//     }

//     if(isLoading) {
//        return (
//         <strong>Loading...</strong>
//        )
//     }
//    return (
//         <strong>Payment will be here</strong>
//        )
    // return (<strong>Tutaj będzie formularz płatności</strong>)
    // return (
    //     <script type="text/javascript" src="https://app.fakturownia.pl/a/jedrzejlewandowski/p/kz2MA0TkQxH0QOKPjSHR.js?lang=pl"></script>
    // )
// }


/*
<link href="https://s3-eu-west-1.amazonaws.com/assets.firmlet.com/assets/fakturownia/widget.css" media="screen" rel="stylesheet" type="text/css" />
<div id="f_c210084332975" style="display:none;"></div>
<script type="text/javascript">$(function(){$.getJSON("https://app.fakturownia.pl/a/jedrzejlewandowski/p/W8hbdVpHfyGULqs1mL3v.json?lang=pl&price=&callback=?", function(data) {
$('#f_c210084332975').html(data.f1).fadeIn();
  $('#f_oid210084332975').val('');
  // $('#payment_first_name').val('this is example of insert custom value!')
  // $('#payment_last_name').val('<?= $user_last_name ?>')
  // $('#payment_field1').val('...')
  // $('#payment_field2').val('...')
});})</script>
*/