'use client';

/**
 * @component ClearableInput
 * Provides a wrapper around Mantine's Input component to add a clear button.
 * 
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof GreenGlideApp
 */

import { CloseButton, Input, TextInput } from '@mantine/core';
import ClearableInputProps, {
  InputPropsWithoutRightSection,
} from '../types/ClearableInputProps';

export default function ClearableInput(props: ClearableInputProps) {
  // Break up this props into the setValue function and the rest of the input props
  // then we recast the InputPropsWithoutRightSection type to the rest of the props
  const { setValue, ...inputProps } = props;
  inputProps as InputPropsWithoutRightSection;

  // What this has done is extracted the setValue function,
  // and then recasted the type as an omitted extension from the ClearableInputProps
  // so that we can pass the rest of the props to the Input component with
  return (
    <TextInput
      {...inputProps}
      rightSection={
        <CloseButton
          onClick={() => {
            const blankValue = '';
            setValue(blankValue);
          }}
          style={{
            opacity: props.value ? 1 : 0,
            transition: 'opacity 150ms ease-in-out',
            pointerEvents: props.value ? 'all' : 'none',
          }}
        />
      }
    />
  );
}
