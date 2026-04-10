import { useState } from "react";

export function useMessage() {
  const [message, setMessage] = useState<string | null>(null);

  const show = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  return { message, show };
}