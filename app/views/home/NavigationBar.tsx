'use client';
/**
 * @type Component
 * Handles the global navigation bar across the site.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof GreenGlide
 */

import { useSticky } from '@/app/hooks/useSticky';
import { Container } from '@mantine/core';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import React from 'react';

// Types
export interface NavigationBarProps {
  children: React.ReactElement[];
}

export interface NavigationButtonProps {
  children: string;
  clickPath?: string;
}

export interface NavigationEmblemProps {
  children: StaticImport;
  scale?: number;
}

export interface NavigationDocketProps {
  children: React.ReactElement | React.ReactElement[];
}

// Configuration
const OUTER_IS_FLOATING = 'sticky top-0';
const OUTER_IS_RELATIVE = 'relative';
const INNER_IS_FLOATING =
  'bg-black/8 backdrop-blur-md ring ring-black/10 shadow-xl';
const INNER_IS_RELATIVE = '';

// Private functions
function selectPropsForFloating(isFloating: boolean): {
  outerProps: string;
  innerProps: string;
} {
  return {
    outerProps: isFloating ? OUTER_IS_FLOATING : OUTER_IS_RELATIVE,
    innerProps: isFloating ? INNER_IS_FLOATING : INNER_IS_RELATIVE,
  };
}

// Component
function NavigationBar({ children }: NavigationBarProps) {
  // Detect if the user has scrolled down (and if so let
  // the Component know we must follow them.)
  const navBarIsFloating = useSticky(10);

  const { outerProps, innerProps } = selectPropsForFloating(navBarIsFloating);
  return (
    <nav
      className={`flex justify-center items-center z-100 w-full transition-all duration-700 out-expo ${outerProps}`}
    >
      <Container
        className={`w-max mt-10 mb-5 transition-all duration-700 out-expo rounded-full ${innerProps}`}
      >
        <div className="flex flex-row justify-center px-4 items-center gap-8 py-3">
          {children}
        </div>
      </Container>
    </nav>
  );
}

// Compound Components
function Button({ children, clickPath }: NavigationButtonProps) {
  return (
    <a rel="noreferrer" href={clickPath}>
      <h3 className="text-neutral-400 text-2xl font-main font-semimedium text-size-1.5xl transition-colors duration-500 hover:text-neutral-800">
        {children}
      </h3>
    </a>
  );
}

function Emblem({ children, scale }: NavigationEmblemProps) {
  return (
    <a rel="noreferrer" href="/">
      <Image src={children} alt="home" width={scale} height={scale} />
    </a>
  );
}

function Docket({ children }: NavigationDocketProps) {
  return <div className="flex flex-row ml-9 gap-2">{children}</div>;
}

NavigationBar.Button = Button;
NavigationBar.Emblem = Emblem;
NavigationBar.Docket = Docket;
export default NavigationBar;
