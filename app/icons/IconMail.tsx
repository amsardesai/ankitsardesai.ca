/**
 * Icons sourced from ionicons
 * https://ionic.io/ionicons
 */

import * as React from 'react';

import type { IconProps } from '../types.js';

export default function IconMail({ className }: IconProps): React.JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        fill="none"
        height="320"
        rx="40"
        ry="40"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        width="416"
        x="48"
        y="96"
      />
      <path
        d="M112 160l144 112 144-112"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
}
