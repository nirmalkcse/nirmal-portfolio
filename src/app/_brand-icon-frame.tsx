type BrandIconFrameProps = {
  variant: "browser" | "touch";
};

export function BrandIconFrame({ variant }: BrandIconFrameProps) {
  const isTouch = variant === "touch";
  const frameInset = isTouch ? 14 : 36;
  const innerInset = isTouch ? 25 : 72;
  const sealSize = isTouch ? 116 : 330;
  const sealBorder = isTouch ? 7 : 18;
  const markSize = isTouch ? 92 : 252;
  const radius = isTouch ? 38 : 104;

  return (
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(135deg, #fffdf8 0%, #f5efe4 48%, #ede1cf 100%)",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%"
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(255,253,248,0.92), rgba(255,253,248,0) 42%, rgba(161,120,45,0.18) 100%)",
          inset: 0,
          position: "absolute"
        }}
      />
      <div
        style={{
          border: "1px solid rgba(161,120,45,0.36)",
          borderRadius: radius,
          bottom: frameInset,
          left: frameInset,
          position: "absolute",
          right: frameInset,
          top: frameInset
        }}
      />
      <div
        style={{
          border: "1px solid rgba(60,111,154,0.22)",
          borderRadius: radius - 18,
          bottom: innerInset,
          left: innerInset,
          position: "absolute",
          right: innerInset,
          top: innerInset
        }}
      />
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(161,120,45,0), rgba(161,120,45,0.82), rgba(60,111,154,0.32), rgba(161,120,45,0))",
          height: isTouch ? 2 : 5,
          left: isTouch ? 28 : 88,
          position: "absolute",
          right: isTouch ? 28 : 88,
          top: isTouch ? 26 : 70
        }}
      />
      <div
        style={{
          alignItems: "center",
          background: "#342416",
          border: `${sealBorder}px solid #f1dfbd`,
          borderRadius: 999,
          display: "flex",
          height: sealSize,
          justifyContent: "center",
          position: "relative",
          width: sealSize
        }}
      >
        <svg
          aria-hidden="true"
          height={markSize}
          viewBox="0 0 512 512"
          width={markSize}
        >
          <g
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M171 356V156"
              stroke="#F4EFE4"
              strokeWidth="27.5"
            />
            <path
              d="M171 156L256 356"
              stroke="#F4EFE4"
              strokeWidth="27.5"
            />
            <path
              d="M256 256L346 166"
              stroke="#F4EFE4"
              strokeWidth="27.5"
            />
            <path
              d="M256 256L351 356"
              stroke="#F4EFE4"
              strokeWidth="27.5"
            />
            <path
              d="M256 156V356"
              stroke="#B9974A"
              strokeWidth="17.5"
            />
          </g>
        </svg>
      </div>
      <div
        style={{
          background: "#B9974A",
          bottom: isTouch ? 25 : 68,
          height: isTouch ? 3 : 7,
          left: isTouch ? 76 : 218,
          position: "absolute",
          width: isTouch ? 28 : 76
        }}
      />
    </div>
  );
}
