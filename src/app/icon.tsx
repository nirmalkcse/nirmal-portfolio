import { ImageResponse } from "next/og";
import { BrandIconFrame } from "./_brand-icon-frame";

export const dynamic = "force-static";

export const alt =
  "Nirmal Kumar portfolio app icon with the NK Gold Thread monogram";

export const size = {
  width: 512,
  height: 512
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandIconFrame variant="browser" />, size);
}
