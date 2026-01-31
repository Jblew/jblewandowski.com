import React, { useState } from 'react';
import { Questionnaire, type ServiceSelection } from './Questionnaire';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DiscountCodeSelection } from './DiscountCode';
import  Button  from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { Payment } from './Payment';


export function App() {
    const [isEnabled, setEnabled] = useState<boolean>(false);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountCode, setDiscountCode] = useState<string | null>(null);
    const [service, setService] = useState<ServiceSelection | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);

    if(!isEnabled) {
        return (
        <Stack>
            <Button variant='primary' className='mx-auto' onClick={() => setEnabled(true)}>Przejdź do rejestracji</Button>
        </Stack>
        )
    }

    return (
        <div>
            <Questionnaire service={service} setService={setService} discountPercent={discountPercent} />
            <DiscountCodeSelection discountPercent={discountPercent} setDiscountPercent={setDiscountPercent} setDiscountCode={setDiscountCode} />
            <br />
            {service && <Payment service={service} discountPercent={discountPercent} discountCode={discountCode} />}
        </div>
    );
}
