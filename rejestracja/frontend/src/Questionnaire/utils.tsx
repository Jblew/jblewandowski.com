import React from 'react';
import Button, { type ButtonProps } from 'react-bootstrap/esm/Button';
import Stack from 'react-bootstrap/esm/Stack';
import type { SelectionProps, ServiceSelection } from './types';

export function ServiceSummary({ selection, discountPercent }: { selection: ServiceSelection, discountPercent: number }) {
    const discountedPrice = Math.round(selection.pricePln * (1 - discountPercent / 100));
    const hasDiscount = discountPercent > 0;

    return (
        <div>
            <h4>Wybrana usługa: {selection.type} </h4>
            < p > {selection.description} </p>
            < p > Czas trwania: {selection.durationMinutes === null ? "Asynchronicznie" : `${selection.durationMinutes} min`} </p>
            {hasDiscount ? (
                <p>
                    Cena: <del>{selection.pricePln} zł</del> {discountedPrice} zł
                </p>
            ) : (
                <p>Cena: {selection.pricePln} zł</p>
            )}
        </div>
    );
}

export function ServiceChoice({
    question,
    options,
    service,
    setService,
    discountPercent,
}: {
    question: string;
    options: ServiceSelection[];
} & SelectionProps) {
    return (
        <>
            <h4>{question} </h4>
            <ButtonsLine>
                {
                    options.map((option) => (
                        <SelectionButton
                            key={option.type}
                            value={option.id}
                            selectedValue={service?.id}
                            onClick={() => setService(option)}
                        >
                            {option.type}
                        </SelectionButton>
                    ))
                }
            </ButtonsLine>
            {service && <ServiceSummary selection={service} discountPercent={discountPercent} />}
        </>
    );
}

export function ButtonsLine({ children }: { children: React.ReactNode; }) {
    return (
        <Stack direction="horizontal" gap={2} className='mb-4' >
            <span className='mx-auto' > </span>
            {children}
            <span className='mx-auto' > </span>
        </Stack>
    )
}

interface SelectionButtonProps<T> extends Omit<ButtonProps, 'value'> {
    value: T;
    selectedValue: T | null;
}

export function SelectionButton<T>({ value, selectedValue, ...props }: SelectionButtonProps<T>) {
    const variant = selectedValue === null ? "primary" : value === selectedValue ? "success" : "secondary";
    return <Button variant={variant} {...props} />;
}
