'use client';

import { Transition } from '@mantine/core';

export interface DropdownProps {
  opened: boolean;
  onMouseLeave?: () => void;
  children: React.ReactElement[];
}

export interface DropdownOptionProps {
  children: React.ReactElement[] | React.ReactElement;
  color?: string;
  href?: string;
  onClick?: () => void;
}

function Dropdown({ opened, onMouseLeave, children }: DropdownProps) {
  return (
    <Transition
      mounted={opened}
      transition={'scale-y'}
      duration={400}
      timingFunction={'ease'}
    >
      {(styles) => (
        <div
          style={styles}
          className="flex flex-col gap-0.5 mt-50 ml-30 absolute w-50 p-2 bg-white rounded-lg shadow-lg"
          onMouseLeave={onMouseLeave}
        >
          {children}
        </div>
      )}
    </Transition>
  );
}

function Title({ children }: { children: string }) {
  return (
    <div className="select-none text-sm text-black/40 w-full h-8 mt-2">
      {children}
    </div>
  );
}

function Division() {
  return <div className="w-full h-px bg-black/25 my-1" />;
}

function Option({ children, color, href, onClick }: DropdownOptionProps) {
  return (
    <div
      style={{
        color,
      }}
    >
      <a href={href} rel="noreferrer" onClick={onClick}>
        <div className="select-none flex flex-row gap-2 border border-current/0 items-center w-full h-6 text-current/70 px-2 py-3.5 rounded-lg hover:bg-current/4 hover:border-current/60 transition-all duration-300">
          {children}
        </div>
      </a>
    </div>
  );
}

Dropdown.Title = Title;
Dropdown.Division = Division;
Dropdown.Option = Option;
export default Dropdown;
