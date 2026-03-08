interface CheckIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function CheckIcon({ size, style, ...others }: CheckIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, ...style }}
      {...others}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
