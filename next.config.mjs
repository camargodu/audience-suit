import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const config = withNextIntl(nextConfig);

export default withSentryConfig(config, {
  silent: true,
  disableLogger: true,
  // To upload source maps add: SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT
});
