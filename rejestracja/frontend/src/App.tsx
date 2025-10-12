import React, { useState } from 'react';
import { Auth } from './Auth';
import { Questionnaire, type ServiceSelection } from './Questionnaire';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DiscountCodeSelection } from './DiscountCode';
import { Schedule } from './Schedule';
import  Button  from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';


export function App() {
    const [isEnabled, setEnabled] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [service, setService] = useState<ServiceSelection | null>(null);
    if(!isEnabled) {
        return (
        <Stack>
            <Button variant='primary' className='mx-auto' onClick={() => setEnabled(true)}>Przejdź do rejestracji</Button>
        </Stack>
        )
    }
    return (
        <div>
            <Auth onEmailAvailable={setEmail} />
            {!!email && <>
                <Questionnaire service={service} setService={setService} discountPercent={discountPercent} />
                <DiscountCodeSelection discountPercent={discountPercent} setDiscountPercent={setDiscountPercent} />
                {service?.durationMinutes && <><hr /><Schedule durationMinutes={service.durationMinutes} /></>}
            </>}
        </div>
    );
}
