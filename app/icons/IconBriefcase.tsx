/**
 * Icons sourced from ionicons
 * https://ionic.io/ionicons
 */

import * as React from 'react';

import type { IconProps } from '../types.js';

export default function IconBriefcase({ className }: IconProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        fill="none"
        height="320"
        rx="48"
        ry="48"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
        width="448"
        x="32"
        y="128"
      />
      <path
        d="M144 128V96a32 32 0 0132-32h160a32 32 0 0132 32v32M480 240H32M320 240v24a8 8 0 01-8 8H200a8 8 0 01-8-8v-24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
}
