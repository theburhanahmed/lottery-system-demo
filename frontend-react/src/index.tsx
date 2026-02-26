import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { App } from "./App";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (typeof sentryDsn === "string" && sentryDsn.trim()) {
  Sentry.init({
    dsn: sentryDsn.trim(),
    environment: import.meta.env.VITE_APP_ENV || "development",
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
  });
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);