import { CSSProperties, SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { title?: string };

const base: CSSProperties = { display: 'inline-block', verticalAlign: 'middle' };

export function MoMoGlyph(props: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={base}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      <defs>
        <linearGradient id="momoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF2D87" />
          <stop offset="100%" stopColor="#A7286F" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#momoGrad)" />
      <path
        d="M9.5 20.4c1.4 1.2 3.4 1.9 5.8 1.9 4 0 6.7-1.9 6.7-4.8 0-2.4-1.6-3.6-4.5-4.2l-1.4-.3c-1.6-.4-2.3-.9-2.3-1.8 0-1 1-1.7 2.6-1.7 1.4 0 2.6.4 3.7 1.3l1.6-2.4c-1.4-1.1-3.2-1.7-5.3-1.7-3.7 0-6.3 1.9-6.3 4.7 0 2.4 1.6 3.7 4.4 4.2l1.4.3c1.6.4 2.3.9 2.3 1.8 0 1.1-1.1 1.8-2.8 1.8-1.7 0-3.2-.6-4.6-1.7l-1.3 2.6Z"
        fill="#fff"
      />
    </svg>
  );
}

export function ZaloPayGlyph(props: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={base}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      <defs>
        <linearGradient id="zalopayGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#zalopayGrad)" />
      <path
        d="M11.4 11.8c0-.5.4-.9.9-.9h3.4c.8 0 1.5.2 2 .7.4.4.6 1 .6 1.6 0 .9-.5 1.5-1.2 1.8.9.3 1.5 1 1.5 2.1 0 1.5-1.2 2.4-3 2.4h-3.3c-.5 0-.9-.4-.9-.9v-6.8Zm2 2.9h1.7c.6 0 .9-.3.9-.8s-.3-.8-.9-.8H13.4v1.6Zm0 3.1h1.9c.7 0 1-.3 1-.8 0-.6-.3-.9-1-.9H13.4v1.7Z"
        fill="#fff"
      />
      <path
        d="M21 21.5a.9.9 0 0 0 1.2-.4l.3-.6c.2-.4 0-.9-.4-1.1l-1.4-.6c-.4-.2-.6-.7-.4-1.1l.3-.6c.2-.4 0-.9-.4-1.1a.9.9 0 0 0-1.2.4l-.3.6c-.2.4 0 .9.4 1.1l1.4.6c.4.2.6.7.4 1.1l-.3.6c-.2.4 0 .9.4 1.1Z"
        fill="#FFD400"
      />
    </svg>
  );
}

export function BankGlyph(props: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={base}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      <defs>
        <linearGradient id="bankGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#bankGrad)" />
      <path
        d="M7 13.5 16 9l9 4.5v1.4H7v-1.4Zm1.4 2.7h2v5.2h-2v-5.2Zm4.3 0h2v5.2h-2v-5.2Zm4.3 0h2v5.2h-2v-5.2Zm4.3 0h2v5.2h-2v-5.2ZM8.2 22.7h15.6c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5H8.2c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5Z"
        fill="#fff"
      />
    </svg>
  );
}
