"use client";
import { ErrorState } from "@/components/ui/states";
export default function Error({ reset }) {
  return (
    <main id="main-content">
      <ErrorState
        message="An unexpected error occurred. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
