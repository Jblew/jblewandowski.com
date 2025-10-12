import React, { useState } from 'react';
import { Auth } from './Auth';
import { Questionnaire, type ServiceSelection } from './Questionnaire';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DiscountCodeSelection } from './DiscountCode';
import { Schedule } from './Schedule';


export function App() {
    const [email, setEmail] = useState<string | null>(null);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [service, setService] = useState<ServiceSelection | null>(null);
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
