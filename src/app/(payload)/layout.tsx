import type { ReactNode } from "react";
import configPromise from "@payload-config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap.js";

import "@payloadcms/next/css";

async function serverFunction(
  ...args: Parameters<typeof handleServerFunctions>
) {
  "use server";
  return handleServerFunctions(...args);
}

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return RootLayout({
    children,
    config: configPromise,
    importMap,
    serverFunction,
  });
}
