import { useState } from 'react';
import type { SelectionProps } from './types';
import { ButtonsLine, SelectionButton, ServiceChoice } from './utils';

/*
```mermaid
graph LR
CzyNowy[Czy jesteś już moim pacjentem?]

CzyNowy --> Nowy["Nowy"]
CzyNowy --> Powracajacy["Powracający"]

Nowy --> NowyFull["Przejrzenie całej dotychczasowej dokumentacji<br />Omówienie sytuacji zdrowotnej<br />Opracowanie planu"]
Nowy --> NowyJedenProblem["Konsultacja z konkretnym<br /> problemem zdrowotnym"]
Powracajacy --> PowracajacyKontynuacja["Kontynuacja leczenia"]
Powracajacy --> PowracajacyNowyProblem["Nowy problem zdrowotny"]

NowyFull --> NowyFullTeleporada["Teleporada 1h video<br />120zł"]
NowyFull --> NowyFullWizytaDomowa["Wizyta domowa<br />1h15min, promień 5km od adresu<br />250zł"]

NowyJedenProblem --> NowyJedenProblemTeleporada["Wideo<br />30min<br />80zł"]
NowyJedenProblem --> NowyJedenProblemWizytaDomowa["Wizyta domowa<br />45min<br />200zł"]

PowracajacyKontynuacja --> PowracajacyKontynuacjaRecepta["Recepta przez formularz<br />15zł"]
PowracajacyKontynuacja --> PowracajacyKontynuacjaTelefon["Telefon 15min<br />40zł"]
PowracajacyKontynuacja --> PowracajacyKontynuacjaWideo["Wideo 15min<br />40zł"]
PowracajacyKontynuacja --> PowracajacyKontynuacjaWizytaDomowa["30min<br />175zł"]

PowracajacyNowyProblem --> PowracajacyNowyProblemWideo["Wideo 30min<br />80zł"]
PowracajacyNowyProblem --> PowracajacyNowyProblemWizytaDomowa["Wizyta domowa<br />30min<br />200zł"]
```
*/

export function Questionnaire({ service, setService, discountPercent }: SelectionProps) {
    return (
        <IsReturningPatient service={service} setService={setService} discountPercent={discountPercent} />
    );
}



function IsReturningPatient({ service, setService, discountPercent }: SelectionProps) {
    const [isReturning, setIsReturning] = useState<boolean | null>(null);

    const handleClick = (value: boolean) => {
        if (isReturning !== value) {
            setService(null);
        }
        setIsReturning(value);
    }

    return (
        <>
            <h3>2. Czy jesteś już moim pacjentem?</h3>
            <ButtonsLine>
                <SelectionButton value={true} selectedValue={isReturning} onClick={() => handleClick(true)}>Tak</SelectionButton>
                <SelectionButton value={false} selectedValue={isReturning} onClick={() => handleClick(false)}>Nie</SelectionButton>
            </ButtonsLine>
            {isReturning === true && <ReturningPatient service={service} setService={setService} discountPercent={discountPercent} />}
            {isReturning === false && <NewPatient service={service} setService={setService} discountPercent={discountPercent} />}
        </>
    );
}

function ReturningPatient({ service, setService, discountPercent }: SelectionProps) {
    const [isContinuation, setIsContinuation] = useState<boolean | null>(null);

    const handleClick = (value: boolean) => {
        if (isContinuation !== value) {
            setService(null);
        }
        setIsContinuation(value);
    }

    return (
        <>
            <h4>Czy chcesz kontynuować leczenie?</h4>
            <ButtonsLine>
                <SelectionButton value={true} selectedValue={isContinuation} onClick={() => handleClick(true)}>Kontynuacja leczenia</SelectionButton>
                <SelectionButton value={false} selectedValue={isContinuation} onClick={() => handleClick(false)}>Nowy problem zdrowotny</SelectionButton>
            </ButtonsLine>
            {isContinuation === true && <ReturningPatientContinuation service={service} setService={setService} discountPercent={discountPercent} />}
            {isContinuation === false && <ReturningPatientNewProblem service={service} setService={setService} discountPercent={discountPercent} />}
        </>
    );
}

function ReturningPatientContinuation({ service, setService, discountPercent }: SelectionProps) {
    return (
        <>
            <ServiceChoice
                question="Wybierz formę kontynuacji:"
                options={[
                    {
                        id: "returning_continuation_prescription",
                        type: "Recepta przez formularz",
                        description: "Przedłużenie recepty po analizie dokumentacji.",
                        durationMinutes: null,
                        pricePln: 15,
                    },
                    {
                        id: "returning_continuation_phone",
                        type: "Telefon 15 min",
                        description: "Rozmowa telefoniczna dotycząca dalszego leczenia.",
                        durationMinutes: 15,
                        pricePln: 40,
                    },
                    {
                        id: "returning_continuation_video",
                        type: "Wideo 15 min",
                        description: "Teleporada wideo dotycząca kontynuacji leczenia.",
                        durationMinutes: 15,
                        pricePln: 40,
                    },
                    {
                        id: "returning_continuation_home_visit",
                        type: "Wizyta domowa 30 min",
                        description: "Kontynuacja leczenia podczas wizyty domowej.",
                        durationMinutes: 30,
                        pricePln: 175,
                    },
                ]}
                service={service}
                setService={setService}
                discountPercent={discountPercent}
            />
        </>
    );
}

function ReturningPatientNewProblem({ service, setService, discountPercent }: SelectionProps) {
    return (
        <>
            <ServiceChoice
                question="Wybierz formę konsultacji:"
                options={[
                    {
                        id: "returning_new_problem_video",
                        type: "Wideo 30 min",
                        description: "Teleporada wideo dotycząca nowego problemu.",
                        durationMinutes: 30,
                        pricePln: 80,
                    },
                    {
                        id: "returning_new_problem_home_visit",
                        type: "Wizyta domowa 30 min",
                        description: "Wizyta domowa w celu diagnostyki nowego problemu.",
                        durationMinutes: 30,
                        pricePln: 200,
                    },
                ]}
                service={service}
                setService={setService}
                discountPercent={discountPercent}
            />
        </>
    );
}

function NewPatient({ service, setService, discountPercent }: SelectionProps) {
    const [visitType, setVisitType] = useState<"full" | "single" | null>(null);

    const handleClick = (value: "full" | "single") => {
        if (visitType !== value) {
            setService(null);
        }
        setVisitType(value);
    }

    return (
        <>
            <h4>Jaki zakres konsultacji jest potrzebny?</h4>
            <ButtonsLine>
                <SelectionButton value="full" selectedValue={visitType} onClick={() => handleClick("full")}>
                    Przejrzenie całej dokumentacji i opracowanie planu
                </SelectionButton>
                <SelectionButton value="single" selectedValue={visitType} onClick={() => handleClick("single")}>
                    Konsultacja z jednym problemem zdrowotnym
                </SelectionButton>
            </ButtonsLine>
            {visitType === "full" && <NewPatientFullDocumentation service={service} setService={setService} discountPercent={discountPercent} />}
            {visitType === "single" && <NewPatientSingleConsultation service={service} setService={setService} discountPercent={discountPercent} />}
        </>
    );
}

function NewPatientFullDocumentation({ service, setService, discountPercent }: SelectionProps) {
    return (
        <ServiceChoice
            question="Wybierz formę konsultacji:"
            options={[
                {
                    id: "new_patient_full_teleconsult_video",
                    type: "Teleporada 1h video",
                    description: "Szczegółowa teleporada z omawianiem dokumentacji.",
                    durationMinutes: 60,
                    pricePln: 120,
                },
                {
                    id: "new_patient_full_home_visit",
                    type: "Wizyta domowa 1h15min",
                    description: "Wizyta domowa w promieniu 5 km od adresu.",
                    durationMinutes: 75,
                    pricePln: 250,
                },
            ]}
            service={service}
            setService={setService}
            discountPercent={discountPercent}
        />
    );
}

function NewPatientSingleConsultation({ service, setService, discountPercent }: SelectionProps) {
    return (
        <ServiceChoice
            question="Wybierz formę konsultacji:"
            options={[
                {
                    id: "new_patient_single_teleconsult_video",
                    type: "Teleporada wideo 30 min",
                    description: "Teleporada dotycząca konkretnego problemu.",
                    durationMinutes: 30,
                    pricePln: 80,
                },
                {
                    id: "new_patient_single_home_visit",
                    type: "Wizyta domowa 45 min",
                    description: "Wizyta domowa dotycząca konkretnego problemu.",
                    durationMinutes: 45,
                    pricePln: 200,
                },
            ]}
            service={service}
            setService={setService}
            discountPercent={discountPercent}
        />
    );
}
