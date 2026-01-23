declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    adsbygoogle?: any[];
  }
}

export {};
