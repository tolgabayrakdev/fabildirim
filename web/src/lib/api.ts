const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:1234";

export const apiUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (BACKEND_URL) {
    const baseUrl = BACKEND_URL.endsWith("/") ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
    return `${baseUrl}/${cleanPath}`;
  }

  return `/${cleanPath}`;
};