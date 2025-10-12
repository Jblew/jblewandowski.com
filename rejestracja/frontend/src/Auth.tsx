import { useEffect, useState } from 'react';
import { getCurrentUser } from './services';
import Button, { type ButtonProps } from 'react-bootstrap/esm/Button';
import { Stack } from 'react-bootstrap';

export function Auth({ onEmailAvailable }: { onEmailAvailable: (email: string | null) => void }) {
    const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);

    useEffect(() => {
        getCurrentUser().then((resp) => {
            if (resp.loggedIn) {
                setCurrentUser(resp)
                onEmailAvailable(resp.email)
            } else {
                setCurrentUser(null)
                onEmailAvailable(null)
            }
        })
    }, []);

    if (currentUser) {
        return (<>
            <h3>1. Jesteś zalogowany</h3>
            <p>
                Email: {currentUser.email}. <Button variant="link" href={window.apiBaseUrl + '/logout'} > Wyloguj się</Button>
            </p >
        </>)
    }
    return (<>
        <h3>1. Zaloguj się lub załóż konto</h3>
        <Stack>
            <Button variant="primary" href={window.apiBaseUrl + '/login'} className='mx-auto'>Zaloguj się</Button>
        </Stack>
    </>)
}
