"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { expenseApi } from "@/lib/api";
import { normalizeReport } from "@/lib/format";
export function useExpenseReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const controller = useRef(null);
  const refresh = useCallback(async () => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError("");
    try {
      setReport(normalizeReport(await expenseApi.report(request.signal)));
    } catch (error) {
      if (!request.signal.aborted) setError(error.message);
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
    return () => controller.current?.abort();
  }, [refresh]);
  return { report, loading, error, refresh };
}
