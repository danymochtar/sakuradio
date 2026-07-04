/**
 * Native no-op. The real implementation lives in registerPwa.web.ts and is
 * picked up automatically by Metro's platform-specific file resolution, so
 * native builds never pull in any DOM/service-worker code.
 */
export function registerPwa(): void {
  // no-op on iOS / Android
}
