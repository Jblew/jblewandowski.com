import React, { useState, useEffect } from 'react';
import Button, { type ButtonProps } from 'react-bootstrap/esm/Button';
import Stack from 'react-bootstrap/esm/Stack';
import Form from 'react-bootstrap/esm/Form';
import InputGroup from 'react-bootstrap/esm/InputGroup';

interface DiscountCode {
    code: string
    discountPercentDefault: number
    discountPercentMin: number
    discountPercentMax: number
}

const allowedDiscountCodes: DiscountCode[] = [
    {
        code: 'b2x19a1a',
        discountPercentMin: 25,
        discountPercentMax: 100,
        discountPercentDefault: 100,
    },
    {
        code: 'b2c19a0k',
        discountPercentMin: 25,
        discountPercentMax: 100,
        discountPercentDefault: 100,
    }
]

export function DiscountCodeSelection({ discountPercent, setDiscountPercent }: { discountPercent: number, setDiscountPercent: (v: number) => void }) {
    const [showForm, setShowForm] = useState(false);
    const [code, setCode] = useState('');
    const [matchedCode, setMatchedCode] = useState<DiscountCode | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleApplyCode = () => {
        const foundCode = allowedDiscountCodes.find(c => c.code === code);
        if (foundCode) {
            setMatchedCode(foundCode);
            setDiscountPercent(foundCode.discountPercentDefault);
            setError(null);
        } else {
            setMatchedCode(null);
            setDiscountPercent(0);
            setError("Nieprawidłowy kod rabatowy");
        }
    };

    const handleRemoveCode = () => {
        setCode('');
        setMatchedCode(null);
        setDiscountPercent(0);
        setError(null);
    };

    if (!showForm) {
        return (
            <div className="text-end">
                <Button variant="link" onClick={() => setShowForm(true)}>
                    Czy masz kod zniżkowy?
                </Button>
            </div>
        );
    }

    return (
        <Stack gap={3}>
            <Form.Group controlId="discountCode">
                <Form.Label>Kod rabatowy</Form.Label>
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Wpisz kod rabatowy"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        isInvalid={!!error}
                        disabled={!!matchedCode}
                    />
                    <Button variant="outline-secondary" onClick={handleApplyCode} disabled={!!matchedCode}>
                        Zastosuj
                    </Button>
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                </InputGroup>
                {matchedCode && (
                    <div className="text-end">
                        <Button variant="link" size="sm" onClick={handleRemoveCode}>
                            Usuń kod
                        </Button>
                    </div>
                )}
            </Form.Group>

            {matchedCode && (
                <Form.Group controlId="discountPercent">
                    <Form.Label>Zniżka: {discountPercent}%</Form.Label>
                    <Form.Range
                        min={matchedCode.discountPercentMin}
                        max={matchedCode.discountPercentMax}
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(parseInt(e.target.value, 10))}
                    />
                </Form.Group>
            )}
        </Stack>
    );
}
