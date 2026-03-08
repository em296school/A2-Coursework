export default function Skeleton({
  width,
  height,
  rounded,
}: {
  width: string;
  height: string;
  rounded?: boolean;
}) {
  if (rounded) {
    return (
      <div
        className={`animate-pulse bg-neutral-700/10 rounded-full px-2 py-1 inline-block`}
        style={{
          width: width,
          height: height,
        }}
      />
    );
  }

  return (
    <div
      className={`animate-pulse bg-neutral-700/10 rounded-2xl px-2 py-1 inline-block`}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}
