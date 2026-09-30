const API_BASE_PATH = "/api/backend";

export async function apiRequest(
  path,
  { method = "GET", body, authenticated = true, signal } = {},
) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token =
    authenticated && typeof window !== "undefined"
      ? localStorage.getItem("authToken")
      : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${API_BASE_PATH}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "We couldn’t connect. Check your connection and try again.",
    );
  }
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    if (response.ok) {
      throw new Error(
        "The server returned an unexpected response. Please try again.",
      );
    }
    data = null;
  }
  if (!response.ok) {
    if (response.status === 401 && token && typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      window.dispatchEvent(new Event("session-expired"));
    }
    const message = data?.message || data?.error || data?.detail;
    throw new Error(
      typeof message === "string"
        ? message
        : response.status === 401
          ? "Your session has expired. Please sign in again."
          : "Something went wrong. Please try again.",
    );
  }
  return data;
}

const segment = (value) => encodeURIComponent(value);
export const expenseApi = {
  report: (signal) => apiRequest("/expense/user/expensereport", { signal }),
  add: (category, amount) =>
    apiRequest(`/expense/user/${segment(category)}/${amount}`, {
      method: "PUT",
    }),
  rename: (category, name) =>
    apiRequest(
      `/expense/category/rename/${segment(category)}/${segment(name)}`,
      { method: "PATCH", body: {} },
    ),
  updateAmount: (category, amount) =>
    apiRequest("/expense/category/price", {
      method: "PATCH",
      body: { data: { [category]: amount } },
    }),
  remove: (category) =>
    apiRequest(`/expense/category/delete/${segment(category)}`, {
      method: "PATCH",
      body: {},
    }),
  setGoal: (amount, data) =>
    apiRequest("/expense/goal", {
      method: "PUT",
      body: { id: Date.now(), total_expense_goal: amount, data },
    }),
};
