/**
 * Brand marks. lucide-react v1 dropped brand icons, so social + tech logos live
 * here as inline SVG. Anything I can't draw faithfully at 20px is rendered as a
 * deliberate lettermark tile instead of a bad logo trace.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A11.99 11.99 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function ReactIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="2.05" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.1">
        <ellipse cx="12" cy="12" rx="10.5" ry="4.05" />
        <ellipse cx="12" cy="12" rx="10.5" ry="4.05" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10.5" ry="4.05" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

export function PythonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#3776AB"
        d="M11.9 1.5c-1.9 0-3.4.2-4.4.6-1 .4-1.5 1.2-1.5 2.4v2.3h5.9v.8H4.1c-1.2 0-2.2.7-2.9 2.1-.7 1.4-.8 2.9-.4 4.4.5 1.8 1.5 2.7 3.1 2.7h1.6v-2.7c0-1.3.5-2.3 1.4-3 .7-.5 1.6-.8 2.7-.8h3.9c1.1 0 2-.3 2.6-.9.6-.6.9-1.4.9-2.4V4.5c0-1-.4-1.7-1.3-2.2-.9-.5-2.2-.8-3.8-.8Zm-3.2 1.4c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9Z"
      />
      <path
        fill="#FFD43B"
        d="M12.1 22.5c1.9 0 3.4-.2 4.4-.6 1-.4 1.5-1.2 1.5-2.4v-2.3h-5.9v-.8h7.8c1.2 0 2.2-.7 2.9-2.1.7-1.4.8-2.9.4-4.4-.5-1.8-1.5-2.7-3.1-2.7h-1.6v2.7c0 1.3-.5 2.3-1.4 3-.7.5-1.6.8-2.7.8H10.5c-1.1 0-2 .3-2.6.9-.6.6-.9 1.4-.9 2.4v3.5c0 1 .4 1.7 1.3 2.2.9.5 2.2.8 3.8.8Zm3.2-1.4c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9Z"
      />
    </svg>
  );
}

export function JavaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#EA2D2E"
        d="M11.6 6.7c-.9-1 .2-1.9.9-2.6.9-.9 1.6-1.9 1-3.1 1.9 1.5 1.1 2.9.2 3.9-.8.9-1.6 1.6-1 2.7-.4-.3-.8-.6-1.1-.9Zm3.2-.6c.6-.7-.1-1.4-.6-2 1.4.7 2 1.7 1 2.9-.6.7-1.2 1.3-1 2.1-.6-.5-.9-1.1-.5-1.8.3-.4.7-.8 1.1-1.2Z"
      />
      <path
        fill="#4E7896"
        d="M8.3 14.2c-2 .6-.6 1.3.4 1.5 2.9.5 6.1.4 8.6-.6 0 0-.6.4-1.3.6-4.5 1.2-13.2.6-10.7-.7 1-.5 2-.8 3-.8Zm7.8-1.9c2.2 1.1-.9 2.1-2.7 2.5 2.9-.4 5.1-1.3 4.2-2.2-.6-.6-2.2-.9-4-.9.9.1 1.7.3 2.5.6Zm1.9 5.7c-2.8 1.6-9.3 1.8-13 .5-1.4-.5.1-1.2.9-1.4.4-.1.6-.1.6-.1-1.6-1.1 5.9-2.4 8.5-.9-.7-.2-1.6-.3-2.5-.3-3.4 0-5.5.9-4.2 1.4 3.2 1.1 8.2 1.1 11.4.1.6-.2.9-.4 1.1-.6-.6.5-1.5.9-2.8 1.3Zm-6.6 3.5c3.2.2 8.1-.1 8.2-1.6 0 0-.2.6-2.6 1-2.7.5-6.1.4-8.1.1 0 0 .4.3 2.5.5Zm.9-15.1c1.3 1.5-.3 2.8-.3 2.8s3.3-1.7 1.8-3.8c-1.4-2-2.5-3 3.3-6.3 0 0-9.2 2.3-4.8 7.3Z"
      />
    </svg>
  );
}

export function NextIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="12" cy="12" r="11.5" fill="#0A0A0A" />
      <path
        fill="#fff"
        d="M8.1 7.2h1.72l7.28 9.85a8.9 8.9 0 0 1-1.5 1.02L8.1 8.87V17.2H6.6V7.2h1.5Zm7.15 0h1.5v6.55l-1.5-2.03V7.2Z"
      />
    </svg>
  );
}

export function MongoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#00ED64"
        d="M12 1.5c1.9 2.5 5.6 5.7 5.6 10.2 0 4.1-2.8 7-4.9 8.4l-.4 2.4h-.6l-.4-2.4c-2.1-1.4-4.9-4.3-4.9-8.4C6.4 7.2 10.1 4 12 1.5Z"
      />
      <path
        fill="#00684A"
        d="M12 1.5v18.6l-.3 2.4h.6l.4-2.4c2.1-1.4 4.9-4.3 4.9-8.4C17.6 7.2 13.9 4 12 1.5Z"
        opacity=".55"
      />
    </svg>
  );
}

export function TailwindIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#06B6D4"
        d="M12 6c-2.7 0-4.4 1.35-5.1 4.05.9-1.2 1.95-1.65 3.15-1.35.68.17 1.17.67 1.72 1.22.89.9 1.92 1.94 4.17 1.94 2.7 0 4.4-1.35 5.1-4.05-.9 1.2-1.95 1.65-3.15 1.35-.68-.17-1.17-.67-1.72-1.22C15.28 7.04 14.25 6 12 6Zm-5.1 6.14c-2.7 0-4.4 1.35-5.1 4.05.9-1.2 1.95-1.65 3.15-1.35.68.17 1.17.67 1.72 1.22.89.9 1.92 1.94 4.17 1.94 2.7 0 4.4-1.35 5.1-4.05-.9 1.2-1.95 1.65-3.15 1.35-.68-.17-1.17-.67-1.72-1.22-.89-.9-1.92-1.94-4.17-1.94Z"
      />
    </svg>
  );
}

export function FlutterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#47C5FB" d="M14.3 1.2 3.5 12l3.35 3.35L21 1.2h-6.7Z" />
      <path fill="#47C5FB" d="M14.2 11.1 8.6 16.7l5.65 5.7H21l-5.6-5.65 5.6-5.65h-6.8Z" opacity=".85" />
      <path fill="#00569E" d="M8.6 16.7 11.9 20l2.35-2.35-3.3-3.3-2.35 2.35Z" />
    </svg>
  );
}

/** Lettermark tile — used where a faithful small-size logo isn't achievable. */
export function LetterMark({
  text,
  bg = "#EAF2FF",
  fg = "#1261FF",
  ...props
}: IconProps & { text: string; bg?: string; fg?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="1" y="1" width="22" height="22" rx="6.5" fill={bg} />
      <text
        x="12"
        y="12.2"
        textAnchor="middle"
        dominantBaseline="central"
        fill={fg}
        fontFamily="var(--font-mono-jb), ui-monospace, monospace"
        fontSize={text.length > 2 ? 7 : text.length > 1 ? 8.6 : 11}
        fontWeight="700"
        letterSpacing="-0.5"
      >
        {text}
      </text>
    </svg>
  );
}
