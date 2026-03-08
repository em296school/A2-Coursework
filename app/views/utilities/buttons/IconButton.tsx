'use client';
/**
 * @type Component
 * Utility button which provides an icon with a button.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof Button
 */

import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { UtilityButton } from './Button';
import { Button } from '@mantine/core';
import { ButtonStyles } from '../../settings/ButtonStyleSettings.config';
import Image from 'next/image';

// Types
export interface IconButtonProps extends UtilityButton {
  icon: React.ReactNode;
  children?: string;
}

// Components
export default function IconButton({
  children,
  buttonStyle,
  icon,
  width,
  disabled,
  onClick,
}: IconButtonProps) {
  return (
    <Button
      className="button-main flex flex-row justify-center gap-2 py-2 px-3 font-main text-xl font-medium text-white"
      style={{
        paddingInline: width, // This mimics the width but I want to inherit the width: fit-content
      }}
      leftSection={icon}
      color={ButtonStyles[buttonStyle]}
      radius={'md'}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
