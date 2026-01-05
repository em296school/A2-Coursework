/**
 * @type Page
 * Page which renders the login form for the Accounts application.
 * 
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import { Stack } from '@mantine/core'
import { PasswordInputStyle, EmailInputStyle } from '@/config/constants'
import PasswordInputStrength from './components/PasswordInputStrength'
import EmailInput from './components/EmailInput'

// Export the Login page component
export default function Login() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Stack justify="center" align="center">
                <EmailInput {...EmailInputStyle}>Email Address</EmailInput>
                <PasswordInputStrength {...PasswordInputStyle}>Password</PasswordInputStrength>
            </Stack>
        </div>
    )
}