"use client";

interface Props {
  message: string;
  className?: string;
  children: React.ReactNode;
}

export default function ConfirmButton({ message, className, children }: Props) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!confirm(message)) e.preventDefault();
  }

  return (
    <button type="submit" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
