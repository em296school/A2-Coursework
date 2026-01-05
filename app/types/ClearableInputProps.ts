/**
 * @type ClearableInputProps
 * Types associated with the ClearableInput component.
 * 
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof GreenGlideApp
 */

import React from 'react';
import { __BaseInputProps, StyleProp, MantineSpacing } from '@mantine/core'

// We union only the necessary props for our ClearableInput
// as these types are scattered
// TODO: Find a way to automatically include any new necessary props from Mantine's Input component
type UnionInputNecessaries = {
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    m?: StyleProp<MantineSpacing>;
    style?: React.CSSProperties;
    onBlur?: () => void;
}

// We omit the rightSection prop as this is hardcoded within the ClearableInput component,
// and we do not want confliction. From here we just take the base input types and union them with
// our necessary props.
export type InputPropsWithoutRightSection = Omit<__BaseInputProps, 'rightSection'> & UnionInputNecessaries;
export default interface ClearableInputProps extends InputPropsWithoutRightSection {
  setValue: (value: string) => void;
}