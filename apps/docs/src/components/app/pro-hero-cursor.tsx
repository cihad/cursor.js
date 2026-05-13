'use client';

import { Comet } from '@/components/app/comet';

export function ProHeroCursor() {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top,#eefbf1,transparent_38%),linear-gradient(180deg,#ffffff,rgba(240,253,244,0.82))] shadow-sm dark:bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_30%),linear-gradient(180deg,rgba(24,24,27,1),rgba(24,24,27,0.96))]">
      <div className="relative flex min-h-[320px] items-center justify-center px-6 py-10">
        <div className="relative h-[220px] w-[280px]">
          <Comet angle={55} isVisible />

          <div className="absolute right-[32px] top-[112px] z-10 rotate-[10deg] drop-shadow-[0_18px_30px_rgba(34,197,94,0.35)]">
            <svg
              width="54"
              height="62"
              viewBox="0 0 26 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#pro-cursor-shadow)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26 18L0 0L6.62243 30L14.5 22L26 18Z"
                  fill="#00FF26"
                />
              </g>
              <path
                d="M24.9062 17.8506L14.3359 21.5273L14.2256 21.5664L14.1436 21.6494L6.91113 28.9932L0.762695 1.13574L24.9062 17.8506Z"
                stroke="#272727"
                strokeMiterlimit="16"
              />
              <defs>
                <filter
                  id="pro-cursor-shadow"
                  x="0"
                  y="0"
                  width="26"
                  height="30"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="2" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.8 0"
                  />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_114_46" />
                </filter>
              </defs>
            </svg>
          </div>

          <div className="absolute right-[18px] top-[92px] h-16 w-16 rounded-full border-2 border-green-500/70 bg-green-400/10" />
        </div>
      </div>
    </div>
  );
}
