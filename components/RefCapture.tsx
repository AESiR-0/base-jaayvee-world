'use client';
import { useEffect } from 'react';

export default function RefCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      const cookieRef = document.cookie.split('; ').find(x => x.startsWith('ref='))?.split('=')[1];
      const ref = refParam || cookieRef;
      if (ref) sessionStorage.setItem('ref', ref);
    } catch {}
  }, []);
  return null;
}
