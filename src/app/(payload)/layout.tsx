import type { ReactNode } from "react";
import configPromise from "@payload-config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import { importMap } from "./admin/importMap.js";

import "@payloadcms/next/css";

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
};

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return RootLayout({
    children,
    config: configPromise,
    importMap,
    serverFunction,
  });
}
