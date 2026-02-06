import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Stack from 'react-bootstrap/esm/Stack';
import Form from 'react-bootstrap/esm/Form';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import { verifyDiscountCode } from './services';

interface MatchedCode {
    discountPercentDefault: number
    discountPercentMin: number
    discountPercentMax: number
}

export function DiscountCodeSelection({ discountPercent, setDiscountPercent, setDiscountCode }: { discountPercent: number, setDiscountPercent: (v: number) => void, setDiscountCode: (v: string | null) => void }) {
    const [showForm, setShowForm] = useState(false);
    const [code, setCode] = useState('');
    const [matchedCode, setMatchedCode] = useState<MatchedCode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleApplyCode = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await verifyDiscountCode(code);
            if (response.valid && response.discountPercentDefault !== undefined) {
                setMatchedCode({
                    discountPercentDefault: response.discountPercentDefault,
                    discountPercentMin: response.discountPercentMin!,
                    discountPercentMax: response.discountPercentMax!,
                });
                setDiscountPercent(response.discountPercentDefault);
                setDiscountCode(code);
            } else {
                setMatchedCode(null);
                setDiscountPercent(0);
                setDiscountCode(null);
                setError("Nieprawidłowy kod rabatowy");
            }
        } catch {
            setMatchedCode(null);
            setDiscountPercent(0);
            setDiscountCode(null);
            setError("Błąd weryfikacji kodu");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCode = () => {
        setCode('');
        setMatchedCode(null);
        setDiscountPercent(0);
        setDiscountCode(null);
        setError(null);
    };

    if (!showForm) {
        return (
            <div className="text-center">
                <Button variant="outline-secondary" size="sm" onClick={() => setShowForm(true)}>
                    Dodaj kod rabatowy
                </Button>
            </div>
        );
    }

    return (<>
        <h3>Kod rabatowy</h3>
        <Stack gap={3} className='mb-4'>
            <Form.Group controlId="discountCode">
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Wpisz kod rabatowy"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        isInvalid={!!error}
                        disabled={!!matchedCode || loading}
                    />
                    <Button variant="outline-secondary" onClick={handleApplyCode} disabled={!!matchedCode || loading}>
                        {loading ? 'Sprawdzam...' : 'Zastosuj'}
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
        </>
    );
}
