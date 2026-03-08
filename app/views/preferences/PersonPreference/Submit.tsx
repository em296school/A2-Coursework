'use client';

interface PreferencesBooleanOption {
  onClick: () => void;
  children: string;
}

export function Submit({ onClick, children }: PreferencesBooleanOption) {
  return (
    <button
      onClick={onClick}
      className="bg-gg-green rounded-lg text-white text-lg h-8 w-fit px-5"
    >
      <h2 className="font-semibold">{children}</h2>
    </button>
  );
}
