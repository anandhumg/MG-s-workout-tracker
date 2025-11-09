import localFont from "next/font/local";
import { Covered_By_Your_Grace, Nunito_Sans } from "next/font/google";

export const arialRounded = localFont({
  src: "/ArialRoundedMTBoldRegular.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "700"], // regular and bold
  display: "swap",
});

export const coveredByYourGrace = Covered_By_Your_Grace({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-covered-by-your-grace",
  display: "swap",
});