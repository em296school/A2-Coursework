'use client';

interface PreferencesBooleanOption {
  onClick: () => void;
}

export function SubmitMyself({ onClick }: PreferencesBooleanOption) {
  return (
    <button
      onClick={onClick}
      className="group rounded-lg text-lg h-8 w-fit px-5"
    >
      <h2 className="font-seminormal text-black/50 group-hover:underline">
        Add myself
      </h2>
    </button>
  );
}
