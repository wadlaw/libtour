"use client"
export default function Error({ error, reset }) {
  return (
    <>
      An error occurred: {error.message}
      <button onClock={() => reset()}>Retry</button>
    </>
  );
}
