const RIDERS = [120, 193, 270, 300, 330, 406, 442];
const BELLOWS = [135, 237, 347, 449];
const WIDE_DOORS = [45, 526];
const NARROW_DOORS = [164, 206, 377, 419];
const CAR_BOGIES = [72, 300, 528];

const SHELL =
  "M29.2 16.9C25.5 17 21.8 18.6 19.6 22 18 42 13 65 10 69.6c0 .4 0 .6.1 1 .8 6 2.5 9.5 5.7 10C120 82 480 82 584.2 80.6c3.2-.5 4.9-4 5.7-10 .1-.4.1-.6.1-1-3-4.6-8-27.6-9.6-47.6-2.2-3.4-5.9-5-9.6-5.1C420 15.6 180 15.6 29.2 16.9Z";

const Pax = ({ x, i }: { x: number; i: number }) => (
  <g className="tr-pax" fill="#8a8175" opacity="0.45" style={{ animationDelay: `${i * 0.16}s` }}>
    <circle cx={x} cy="43" r="3.9" />
    <path d={`M${x - 5.4} 62.4v-12a5.4 5.4 0 0 1 10.8 0v12z`} />
  </g>
);

const Door = ({ x, w }: { x: number; w: number }) => (
  <g style={{ ["--travel" as string]: `${w / 2 - 0.5}px` }}>
    <rect x={x} y="30.2" width={w} height="50" fill="#040404" />
    <rect x={x + 1} y="72" width={w - 2} height="8" fill="#5a5751" />
    <g className="tr-leaf-l">
      <rect x={x} y="30.2" width={w / 2} height="50" fill="#141414" />
      <rect x={x + w / 2 - 0.5} y="30.2" width="0.5" height="50" fill="#2e2e2e" />
    </g>
    <g className="tr-leaf-r">
      <rect x={x + w / 2} y="30.2" width={w / 2} height="50" fill="#141414" />
      <rect x={x + w / 2} y="30.2" width="0.5" height="50" fill="#2e2e2e" />
    </g>
  </g>
);

export function Streetcar({ sign, code }: { sign: string; code: string }) {
  return (
    <>
      <defs>
        <clipPath id="tr-shell">
          <path d={SHELL} />
        </clipPath>
      </defs>

      {CAR_BOGIES.map((c) =>
        [-22, 22].map((o) => (
          <g key={`${c}${o}`} className="tr-wheel">
            <circle cx={c + o} cy="81" r="7" fill="#26231f" />
            <circle cx={c + o} cy="81" r="3.2" fill="none" stroke="#6b6259" strokeWidth="1.7" strokeDasharray="1.9 2.8" />
          </g>
        ))
      )}
      <rect x="275" y="78" width="46" height="8.5" rx="1.5" fill="#17150f" />
      <rect x="79" y="78" width="9" height="7" rx="1" fill="#17150f" />
      <rect x="511" y="78" width="10" height="7" rx="1" fill="#17150f" />

      <rect x="288" y="13" width="40" height="4" rx="1.5" fill="#5f574e" />
      <rect x="365" y="13.5" width="22" height="3.5" rx="1.5" fill="#5f574e" />
      <path
        d="M300 14 328 -12 293 -30"
        stroke="#2b2b2b"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M303 14 315 4" stroke="#2b2b2b" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path
        d="M280 -31h27M282 -31l-4 3M305 -31l4 3"
        stroke="#2b2b2b"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />

      <path d={SHELL} fill="#dc0a06" />

      <g clipPath="url(#tr-shell)">
        <rect x="8" y="22.9" width="584" height="7.3" fill="#ffffff" />
        <rect x="8" y="30.2" width="584" height="32.2" fill="#141414" />
        {RIDERS.map((x, i) => (
          <Pax key={x} x={x} i={i} />
        ))}
        <rect x="8" y="62.4" width="584" height="7.3" fill="#f4f4f4" />

        <ellipse className="tr-glow" cx="13" cy="71.5" rx="10" ry="6" fill="#fff4d6" />
        <ellipse className="tr-glow" cx="587" cy="71.5" rx="10" ry="6" fill="#fff4d6" />
        <rect x="8" y="68.9" width="7.5" height="5.4" rx="1.8" fill="#fff4d6" />
        <rect x="584.5" y="68.9" width="7.5" height="5.4" rx="1.8" fill="#fff4d6" />

        {WIDE_DOORS.map((x) => (
          <Door key={x} x={x} w={29} />
        ))}
        {NARROW_DOORS.map((x) => (
          <Door key={x} x={x} w={17} />
        ))}

        {BELLOWS.map((x) => (
          <g key={x}>
            <rect x={x} y="14" width="16" height="70" fill="#0c0c0c" />
            {[2.6, 5.6, 8.6, 11.6].map((o) => (
              <rect key={o} x={x + o} y="14" width="1.1" height="70" fill="#232323" />
            ))}
          </g>
        ))}

        <circle cx="300" cy="66.5" r="3" fill="#dc0a06" />
        <circle cx="300" cy="66.5" r="3" fill="none" stroke="#ffffff" strokeWidth="0.8" />

        <rect x="467" y="31.5" width="58" height="10" rx="1" fill="#0b0a09" />
        <text
          className="tr-signtext"
          style={{ transformOrigin: "496px 0" }}
          x="496"
          y="39.4"
          textAnchor="middle"
          fontSize="6"
          fontFamily="ui-monospace, monospace"
          fill="#ffae2b"
        >
          {sign}
        </text>
        <rect x="78" y="31.5" width="26" height="10" rx="1" fill="#0b0a09" />
        <text
          className="tr-signtext"
          style={{ transformOrigin: "91px 0" }}
          x="91"
          y="39.4"
          textAnchor="middle"
          fontSize="7"
          fontFamily="ui-monospace, monospace"
          fill="#ffae2b"
        >
          {code}
        </text>

      </g>
    </>
  );
}

const COACHES = [141, 249, 357];
const TGV_BOGIES = [48, 110, 138, 246, 354, 462, 490, 552];
const TGV_PAX = [174, 192, 210, 282, 300, 318, 390, 408, 426];

const NOSE =
  "M92 20c-28 0-52 7-70 21-8 6-12 10-12 13v3c1 6 5 12 14 15.5C40 76 62 76.5 92 76.5Z";

export function Tgv({ sign }: { sign: string }) {
  return (
    <>
      <defs>
        <clipPath id="tr-tgv">
          <path d="M92 20c-28 0-52 7-70 21-8 6-12 10-12 13v3c1 6 5 12 14 15.5C40 76 62 76.5 92 76.5h416c30 0 52-.5 68-4 9-3.5 13-9.5 14-15.5v-3c0-3-4-7-12-13-18-14-42-21-70-21z" />
        </clipPath>
      </defs>

      {TGV_BOGIES.map((c) => (
        <g key={c} className="tr-wheel">
          <circle cx={c} cy="79" r="6.5" fill="#1b1d21" />
          <circle cx={c} cy="79" r="3" fill="none" stroke="#7d838c" strokeWidth="1.6" strokeDasharray="1.8 2.6" />
        </g>
      ))}

      <rect x="504" y="15" width="34" height="5" rx="1.5" fill="#4a4d53" />
      <rect x="62" y="16.5" width="24" height="3.5" rx="1.5" fill="#4a4d53" />
      <path
        d="M518 16 546 -10 511 -28"
        stroke="#3a3d42"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M521 16 533 6" stroke="#3a3d42" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path
        d="M498 -29h27M500 -29l-4 3M523 -29l4 3"
        stroke="#3a3d42"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M92 20c-28 0-52 7-70 21-8 6-12 10-12 13v3c1 6 5 12 14 15.5C40 76 62 76.5 92 76.5h416c30 0 52-.5 68-4 9-3.5 13-9.5 14-15.5v-3c0-3-4-7-12-13-18-14-42-21-70-21z"
        fill="#f2f1ee"
      />

      <g clipPath="url(#tr-tgv)">
        <rect x="8" y="20" width="584" height="4" fill="#d9d7d2" />
        <rect x="8" y="66" width="584" height="4" fill="#c8102e" />
        <rect x="8" y="70" width="584" height="14" fill="#3c4048" />

        <path d="M26 44c14-11 34-17 60-17.5v10c-24 .5-42 5-54 13z" fill="#14161b" />
        <path d="M574 44c-14-11-34-17-60-17.5v10c24 .5 42 5 54 13z" fill="#14161b" />
        <rect x="98" y="30" width="26" height="14" rx="3" fill="#1c1f26" />
        <rect x="476" y="30" width="26" height="14" rx="3" fill="#1c1f26" />
        {[98, 472].map((gx) => (
          <g key={gx}>
            <rect x={gx} y="50" width="30" height="14" rx="1.5" fill="#dedcd7" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={gx + 3 + i * 6} y="52" width="1.6" height="10" fill="#a9a6a0" />
            ))}
          </g>
        ))}
        <path d="M30 47c14-9 32-14 56-14.5v4C64 37 47 41 34 48z" fill="#c8102e" />
        <path d="M570 47c-14-9-32-14-56-14.5v4c22 .5 39 4.5 52 11.5z" fill="#c8102e" />

        <ellipse className="tr-glow" cx="20" cy="53" rx="13" ry="6" fill="#fffdf2" />
        <ellipse className="tr-glow" cx="580" cy="53" rx="13" ry="6" fill="#fffdf2" />
        <rect x="13" y="50" width="14" height="5" rx="2.5" fill="#fffdf2" />
        <rect x="573" y="50" width="14" height="5" rx="2.5" fill="#fffdf2" />

        {COACHES.map((c) => (
          <g key={c}>
            <rect x={c + 29} y="30" width="45" height="16" rx="2" fill="#1c1f26" />
            {[0, 1].map((i) => (
              <rect key={i} x={c + 44 + i * 15} y="30" width="1.6" height="16" fill="#f2f1ee" />
            ))}
            {[
              [c + 4, 12, 1],
              [c + 87, 12, -1],
            ].map(([x, w, dir]) => (
              <g key={x} style={{ ["--travel" as string]: `${w}px` }}>
                <rect x={x} y="28" width={w} height="42" fill="#0b0d10" />
                <g className={dir > 0 ? "tr-leaf-r" : "tr-leaf-l"}>
                  <rect x={x} y="28" width={w} height="42" rx="1.5" fill="#c8102e" />
                  <rect x={x + 1.6} y="30" width={w - 3.2} height="14" rx="1" fill="#1c1f26" />
                  <rect x={x + 1.6} y="60" width={w - 3.2} height="1.6" rx="0.8" fill="#f2f1ee" opacity="0.7" />
                </g>
              </g>
            ))}
          </g>
        ))}

        {TGV_PAX.map((x, i) => (
          <g key={x} className="tr-pax" fill="#6d7f96" opacity="0.5" style={{ animationDelay: `${i * 0.15}s` }}>
            <circle cx={x} cy="35" r="3.2" />
            <path d={`M${x - 4.4} 46v-8a4.4 4.4 0 0 1 8.8 0v8z`} />
          </g>
        ))}

        {[135, 243, 351, 459].map((x) => (
          <rect key={x} x={x + 1} y="20" width="4" height="50" fill="#15171b" />
        ))}

        <rect x="196" y="52" width="80" height="9" rx="1" fill="#0a0908" />
        <text
          className="tr-signtext"
          style={{ transformOrigin: "236px 0" }}
          x="236"
          y="59.2"
          textAnchor="middle"
          fontSize="6.4"
          fontFamily="ui-monospace, monospace"
          fill="#dfe8ff"
        >
          {sign}
        </text>

      </g>
    </>
  );
}
