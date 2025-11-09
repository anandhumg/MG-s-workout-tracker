export default function LoadingScreen() {
  return (
    <>
      <svg
        className="container"
        x="0px"
        y="0px"
        viewBox="0 0 50 31.25"
        height="31.25"
        width="50"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          className="track"
          strokeWidth="4"
          fill="none"
          pathLength={100}
          d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
        />
        <path
          className="car"
          strokeWidth="4"
          fill="none"
          pathLength={100}
          d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
        />
      </svg>

      <style jsx>{`
        .container {
          --uib-size: 45px;
          --uib-color: black;
          --uib-speed: 1.75s;
          --uib-bg-opacity: 0.1;
          height: 31.25px;
          width: 50px;
          transform-origin: center;
          overflow: visible;
        }

        .car {
          stroke: var(--uib-color);
          stroke-dasharray: 100;
          stroke-dashoffset: 0;
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: travel var(--uib-speed) ease-in-out infinite,
            fade var(--uib-speed) ease-out infinite;
          will-change: stroke-dasharray, stroke-dashoffset;
          transition: stroke 0.5s ease;
        }

        .track {
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke: var(--uib-color);
          opacity: var(--uib-bg-opacity);
        }

        @keyframes travel {
          0% {
            stroke-dashoffset: 100;
          }
          75% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fade {
          0% {
            opacity: 0;
          }
          20%,
          55% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
