import { ImageResponse } from "next/og";
import { BrandIconFrame } from "./_brand-icon-frame";

export const dynamic = "force-static";

export const alt =
  "Nirmal Kumar portfolio touch icon with the NK Gold Thread monogram";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandIconFrame variant="touch" />, size);
}
