// Public builds run without the desktop launcher's shared filesystem APIs.
export const PUBLIC_SITE = import.meta.env?.VITE_PUBLIC_SITE === 'true';
