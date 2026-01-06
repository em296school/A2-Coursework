import { Button } from '@mantine/core';
import { ContinueButtonProps } from './types/ContinueButton';

export default function ContinueAuthenticationButton(props: ContinueButtonProps) {
    return (
        <Button disabled={props.disabled} onClick={props.onClick}>
            {props.displayText || 'Continue'}
        </Button>
    )
}