import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { plannedRoutes } from "@/lib/constants/routes";

export const dynamic = "force-static";

export const alt =
  "Nirmal Kumar data engineering portfolio share card with Fabric, Databricks, SQL, Power BI, proof metrics, and case-study routes";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

const proofSignals = [
  {
    value: "90%",
    label: "fewer discrepancies"
  },
  {
    value: "15+",
    label: "reports validated"
  },
  {
    value: "3",
    label: "telecom systems"
  },
  {
    value: plannedRoutes.length.toString(),
    label: "review routes"
  }
] as const;

const routeSignals = ["Work", "Skills", "Credentials", "Resume"] as const;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #fffdf8 0%, #f5efe4 46%, #eee4d4 100%)",
          color: "#241f18",
          display: "flex",
          fontFamily: "Inter, Arial, sans-serif",
          height: "100%",
          overflow: "hidden",
          padding: 40,
          position: "relative",
          width: "100%"
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(90deg, rgba(161,120,45,0), rgba(161,120,45,0.58), rgba(60,111,154,0.24), rgba(161,120,45,0))",
            height: 2,
            left: 40,
            position: "absolute",
            right: 40,
            top: 30
          }}
        />
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(36,31,24,0.05) 0 1px, transparent 1px), linear-gradient(90deg, rgba(36,31,24,0.045) 0 1px, transparent 1px)",
            backgroundSize: "84px 84px",
            inset: 0,
            opacity: 0.48,
            position: "absolute"
          }}
        />
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(40,98,79,0.08), transparent 36%, rgba(161,120,45,0.12) 74%, transparent)",
            inset: 0,
            position: "absolute"
          }}
        />

        <div
          style={{
            border: "1px solid rgba(139,115,93,0.28)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: 32,
            position: "relative",
            width: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: 18
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: "#342416",
                  border: "5px solid #f1dfbd",
                  borderRadius: 999,
                  color: "#fff8ee",
                  display: "flex",
                  fontSize: 28,
                  fontWeight: 800,
                  height: 74,
                  justifyContent: "center",
                  letterSpacing: 0,
                  width: 74
                }}
              >
                NK.
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}
              >
                <div
                  style={{
                    color: "#a1782d",
                    fontSize: 17,
                    fontWeight: 800,
                    letterSpacing: 0,
                    textTransform: "uppercase"
                  }}
                >
                  Data Engineer Portfolio
                </div>
                <div
                  style={{
                    color: "#6f675b",
                    fontSize: 17
                  }}
                >
                  Microsoft Fabric / Databricks / SQL / Power BI
                </div>
              </div>
            </div>

            <div
              style={{
                alignItems: "center",
                border: "1px solid rgba(139,115,93,0.28)",
                color: "#40382e",
                display: "flex",
                fontSize: 17,
                fontWeight: 700,
                height: 42,
                justifyContent: "center",
                paddingLeft: 18,
                paddingRight: 18
              }}
            >
              Portfolio review path
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 38
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
                width: 700
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14
                }}
              >
                <div
                  style={{
                    fontSize: 78,
                    fontWeight: 800,
                    letterSpacing: 0,
                    lineHeight: 0.96
                  }}
                >
                  {profile.displayName}
                </div>
                <div
                  style={{
                    color: "#40382e",
                    fontSize: 34,
                    fontWeight: 700,
                    lineHeight: 1.14
                  }}
                >
                  Data systems built for migration, validation, and reporting
                  trust.
                </div>
              </div>

              <div
                style={{
                  color: "#6f675b",
                  display: "flex",
                  fontSize: 20,
                  gap: 20,
                  lineHeight: 1.2
                }}
              >
                {routeSignals.map((route) => (
                  <div
                    key={route}
                    style={{
                      alignItems: "center",
                      borderLeft: "2px solid rgba(161,120,45,0.44)",
                      display: "flex",
                      height: 28,
                      paddingLeft: 14
                    }}
                  >
                    {route}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                border: "1px solid rgba(139,115,93,0.3)",
                display: "flex",
                flexDirection: "column",
                gap: 0,
                width: 300
              }}
            >
              <div
                style={{
                  background: "rgba(255,253,248,0.74)",
                  borderBottom: "1px solid rgba(139,115,93,0.24)",
                  color: "#a1782d",
                  fontSize: 15,
                  fontWeight: 800,
                  padding: "14px 18px",
                  textTransform: "uppercase"
                }}
              >
                Proof ledger
              </div>
              {proofSignals.map((signal) => (
                <div
                  key={signal.label}
                  style={{
                    background: "rgba(255,253,248,0.58)",
                    borderBottom: "1px solid rgba(139,115,93,0.18)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    padding: "12px 18px"
                  }}
                >
                  <div
                    style={{
                      fontSize: 33,
                      fontWeight: 800,
                      lineHeight: 1
                    }}
                  >
                    {signal.value}
                  </div>
                  <div
                    style={{
                      color: "#6f675b",
                      fontSize: 16,
                      lineHeight: 1.18
                    }}
                  >
                    {signal.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              borderTop: "1px solid rgba(139,115,93,0.28)",
              color: "#6f675b",
              display: "flex",
              fontSize: 18,
              justifyContent: "space-between",
              paddingTop: 16
            }}
          >
            <div>{profile.location}</div>
            <div style={{ color: "#40382e", fontWeight: 700 }}>
              Case studies / Credentials / Resume / Contact
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
