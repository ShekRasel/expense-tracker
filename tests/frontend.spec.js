const { test, expect } = require("@playwright/test");

const apiBase = "**/api/backend";
const token = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ sub: "test-user", exp: 4102444800 })).toString("base64url")}.test-signature`;

async function mockApi(
  page,
  { signedIn = true, empty = false, reportError = false } = {},
) {
  const state = {
    data: empty ? {} : { Groceries: 5000, Transport: 2000, Coffee: 550 },
    goal: empty ? 0 : 30000,
    requests: [],
    reportError,
  };
  if (signedIn)
    await page.addInitScript(
      (value) => localStorage.setItem("authToken", value),
      token,
    );
  await page.route(apiBase + "/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = decodeURIComponent(url.pathname).replace(
      /^\/api\/backend/,
      "",
    );
    const method = request.method();
    const body = request.postData() ? request.postDataJSON() : null;
    state.requests.push({
      path,
      method,
      body,
      authorization: request.headers().authorization,
    });
    let data = {};
    let status = 200;
    if (path === "/user/profile")
      data = { fullname: "Alex Morgan", email: "alex@example.com" };
    else if (path === "/maintenance/alert") data = {};
    else if (path === "/expense/user/expensereport") {
      if (state.reportError) {
        status = 503;
        data = { message: "Temporarily unavailable" };
      } else
        data = {
          data: state.data,
          totalSpending: Object.values(state.data).reduce((a, b) => a + b, 0),
          total_expense_goal: state.goal,
        };
    } else if (path === "/users/auth/userlogin") data = { access_token: token };
    else if (path === "/users/auth/user/register")
      data = { message: "Created" };
    else if (path === "/expense/goal") {
      state.goal = body.total_expense_goal;
      state.data = body.data;
    } else if (path === "/expense/category/price")
      Object.assign(state.data, body.data);
    else if (path.startsWith("/expense/category/rename/")) {
      const parts = path.split("/");
      state.data[parts[5]] = state.data[parts[4]];
      delete state.data[parts[4]];
    } else if (path.startsWith("/expense/category/delete/"))
      delete state.data[path.split("/")[4]];
    else if (path.startsWith("/expense/user/")) {
      const parts = path.split("/");
      state.data[parts[3]] = Number(parts[4]);
    } else if (path === "/guest/budget") data = body;
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(data),
    });
  });
  return state;
}

async function expectNoOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

test("all main layouts fit the screen without runtime errors", async ({
  page,
}, testInfo) => {
  await mockApi(page);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/",
    "/dashboard",
    "/dashboard/expenses",
    "/dashboard/budgets",
    "/dashboard/feedback",
    "/guest",
    "/sign-in",
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (path === "/dashboard")
      await expect(
        page.getByRole("heading", { name: "Welcome back, Alex." }),
      ).toBeVisible();
    await expectNoOverflow(page);
    await page.screenshot({
      path: testInfo.outputPath(
        (path === "/" ? "home" : path.replaceAll("/", "-")) + ".png",
      ),
      fullPage: true,
      animations: "disabled",
    });
  }
  expect(errors).toEqual([]);
});

test("public pages and mobile navigation are usable", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Less money stress",
  );
  await expectNoOverflow(page);
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeVisible();
  }
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Sign in", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
  await expectNoOverflow(page);
  await page.getByRole("link", { name: "Create an account" }).click();
  await expect(page.getByLabel("Full name", { exact: true })).toBeVisible();
  await expectNoOverflow(page);
  expect(errors).toEqual([]);
});

test("unauthenticated and malformed sessions redirect to sign in", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/sign-in/);
  await page.evaluate(() => localStorage.setItem("authToken", "broken-token"));
  await page.goto("/dashboard/budgets");
  await expect(page).toHaveURL(/sign-in/);
});

test("sign-in sends the original API payload and loads the dashboard", async ({
  page,
}) => {
  const state = await mockApi(page, { signedIn: false });
  await page.goto("/sign-in");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("Password", { exact: true }).fill("Password1!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome back, Alex." }),
  ).toBeVisible();
  expect(
    state.requests.find((item) => item.path.endsWith("userlogin")).body,
  ).toEqual({ email: "alex@example.com", password: "Password1!" });
  expect(
    state.requests.find((item) => item.path.endsWith("expensereport"))
      .authorization,
  ).toBe("Bearer " + token);
  await expectNoOverflow(page);
});

test("registration validates passwords and handles a response without a token", async ({
  page,
}) => {
  const state = await mockApi(page, { signedIn: false });
  await page.goto("/sign-up");
  await page.getByLabel("Full name", { exact: true }).fill("Alex Morgan");
  await page.getByLabel("Username", { exact: true }).fill("alex");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("Password", { exact: true }).fill("weak");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Use at least 8 characters",
  );
  await expect(
    page.getByRole("button", { name: "Create account" }),
  ).toBeEnabled();
  await page.getByLabel("Password", { exact: true }).fill("Password1!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/sign-in/);
  expect(
    state.requests.find((item) => item.path.endsWith("register")).body.username,
  ).toBe("alex");
});

test("login uses the same-origin API and displays a backend rejection", async ({
  page,
}) => {
  await page.route("**/api/backend/users/auth/userlogin", async (route) => {
    expect(new URL(route.request().url()).origin).toBe("http://127.0.0.1:3100");
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "Invalid email or password." }),
    });
  });
  await page.goto("/sign-in");
  await page.getByLabel("Email address").fill("test@example.invalid");
  await page.getByLabel("Password", { exact: true }).fill("incorrect-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveText(
    "Invalid email or password.",
  );
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeEnabled();
  await expect(page).toHaveURL(/sign-in/);
});

test("expense CRUD updates the report and exports Excel", async ({ page }) => {
  const state = await mockApi(page);
  await page.goto("/dashboard/expenses");
  await expect(
    page.getByRole("cell", { name: "Groceries", exact: true }),
  ).toBeVisible();
  await expectNoOverflow(page);
  await page.getByRole("button", { name: "Add expense", exact: true }).click();
  await page.getByLabel("Category name").fill("Books & learning");
  await page.getByLabel("Amount (BDT)").fill("1500");
  await page.getByRole("button", { name: "Save expense" }).click();
  await expect(
    page.getByRole("cell", { name: "Books & learning", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Update Books & learning amount" })
    .click();
  await page.getByLabel("Amount (BDT)").fill("1750");
  await page.getByRole("button", { name: "Save expense" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(state.data["Books & learning"]).toBe(1750);
  await page.getByRole("button", { name: "Rename Books & learning" }).click();
  await page.getByLabel("Category name").fill("Learning");
  await page.getByRole("button", { name: "Save expense" }).click();
  await expect(
    page.getByRole("cell", { name: "Learning", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Search categories").fill("Learning");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Search categories").fill("");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export Excel" }).click();
  expect((await download).suggestedFilename()).toBe("ExpenseReport.xlsx");
  await page.getByRole("button", { name: "Delete Learning" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(state.data.Learning).toBe(1750);
  await page.getByRole("button", { name: "Delete Learning" }).click();
  await page
    .getByRole("button", { name: "Delete category", exact: true })
    .click();
  await expect(
    page.getByRole("cell", { name: "Learning", exact: true }),
  ).not.toBeVisible();
  expect(state.data.Learning).toBeUndefined();
});

test("budget changes preserve loaded categories", async ({ page }) => {
  const state = await mockApi(page);
  await page.goto("/dashboard/budgets");
  await expect(
    page.getByRole("button", { name: "Edit budget goal" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Edit budget goal" }).click();
  await page.getByLabel("Budget goal (BDT)").fill("45000");
  await page.getByRole("button", { name: "Save budget goal" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(state.goal).toBe(45000);
  expect(state.data).toEqual({ Groceries: 5000, Transport: 2000, Coffee: 550 });
  await expectNoOverflow(page);
});

test("empty and failed reports provide useful next actions", async ({
  page,
}) => {
  const state = await mockApi(page, { empty: true });
  await page.goto("/dashboard");
  await expect(
    page.getByRole("button", { name: "Add your first expense" }),
  ).toBeVisible();
  state.reportError = true;
  await page.goto("/dashboard/expenses");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Temporarily unavailable",
  );
  await expect(
    page.getByRole("button", { name: "Export Excel" }),
  ).toBeDisabled();
  state.reportError = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(
    page.getByRole("button", { name: "Add your first expense" }),
  ).toBeVisible();
});

test("feedback sends once and shows a success state", async ({ page }) => {
  const state = await mockApi(page);
  await page.goto("/dashboard/feedback");
  await page
    .getByLabel("Your feedback")
    .fill("I would love a monthly comparison.");
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(
    page.getByRole("heading", { name: "Thanks for sharing." }),
  ).toBeVisible();
  expect(
    state.requests.filter((item) => item.path === "/feedback/addFeedback"),
  ).toHaveLength(1);
  await expectNoOverflow(page);
});

test("guest planner submits the existing contract and downloads its report", async ({
  page,
}) => {
  const state = await mockApi(page, { signedIn: false });
  await page.goto("/guest");
  await expectNoOverflow(page);
  await page.getByRole("button", { name: "Create guest budget" }).click();
  await expect(
    page.getByRole("button", { name: "Download Excel" }),
  ).toBeVisible();
  expect(
    state.requests.find((item) => item.path === "/guest/budget").body,
  ).toEqual({
    total_expense_goal: 30000,
    categories: [
      { name: "Groceries", price: 5000 },
      { name: "Transport", price: 2000 },
    ],
  });
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Excel" }).click();
  expect((await download).suggestedFilename()).toBe("Budget_Report.xlsx");
  await page.getByLabel("Total budget goal (BDT)").fill("40000");
  await expect(
    page.getByRole("button", { name: "Download Excel" }),
  ).not.toBeVisible();
});

test("password reset dialog is keyboard accessible and sends both requests", async ({
  page,
}) => {
  const state = await mockApi(page, { signedIn: false });
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Email address").fill("alex@example.com");
  await dialog.getByRole("button", { name: "Send reset instructions" }).click();
  await dialog.getByLabel("Reset token").fill("test-reset-token");
  await dialog.getByLabel("New password").fill("Password2!");
  await dialog.getByRole("button", { name: "Update password" }).click();
  await expect(dialog).not.toBeVisible();
  expect(
    state.requests.find((item) => item.path === "/user/updatepassword").body,
  ).toEqual({ token: "test-reset-token", newPassword: "Password2!" });
  await expect(
    page.getByRole("button", { name: "Forgot password?" }),
  ).toBeFocused();
});
