import React from 'react';
import Button, { type ButtonProps } from 'react-bootstrap/esm/Button';
import Stack from 'react-bootstrap/esm/Stack';
import type { SelectionProps, ServiceSelection } from './types';

export function ServiceChoice({
    question,
    options,
    service,
    setService,
}: {
    question: string;
    options: ServiceSelection[];
} & SelectionProps) {
    return (
        <>
            <h3>{question}</h3>
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
        </>
    );
}

export function ButtonsLine({ children }: { children: React.ReactNode; }) {
    return (
        <Stack direction="horizontal" gap={2} className='mb-4' style={{'overflowX': 'scroll'}} >
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
