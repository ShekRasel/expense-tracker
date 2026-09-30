export const money = (value = 0) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
export const palette = [
  "#16856c",
  "#a8c66c",
  "#e9b96a",
  "#849ad4",
  "#d68c88",
  "#7eaeb5",
];

export function normalizeReport(report) {
  const data =
    report?.data &&
    typeof report.data === "object" &&
    !Array.isArray(report.data)
      ? report.data
      : {};
  const entries = Object.entries(data).map(([name, amount]) => [
    name,
    Number(amount) || 0,
  ]);
  return {
    data: Object.fromEntries(entries),
    total:
      Number(report?.totalSpending) ||
      entries.reduce((sum, [, amount]) => sum + amount, 0),
    goal: Number(report?.total_expense_goal) || 0,
  };
}
export async function exportExpenses(data, filename = "ExpenseReport.xlsx") {
  const XLSX = await import("xlsx");
  const sheet = XLSX.utils.json_to_sheet(
    Object.entries(data).map(([Category, Amount]) => ({
      Category,
      Amount: Number(Amount),
      Currency: "BDT",
    })),
  );
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Expenses");
  XLSX.writeFile(book, filename);
}
