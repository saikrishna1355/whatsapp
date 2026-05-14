const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");
const FILES = {
  expenses: path.join(DATA_DIR, "expenses.json"),
  incomes: path.join(DATA_DIR, "incomes.json"),
  salaries: path.join(DATA_DIR, "salaries.json"),
  sessions: path.join(DATA_DIR, "sessions.json"),
};

async function ensureDataFile(filePath, fallback) {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await writeJson(filePath, fallback);
  }
}

async function readJson(filePath, fallback) {
  await ensureDataFile(filePath, fallback);
  const raw = await fs.readFile(filePath, "utf8");
  return raw ? JSON.parse(raw) : fallback;
}

async function writeJson(filePath, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function toRecordWithId(list, payload) {
  const lastId = list.length ? list[list.length - 1].id : 0;

  return {
    id: lastId + 1,
    ...payload,
    created_at: new Date().toISOString(),
  };
}

async function addIncome({ phone_number, description, amount }) {
  const incomes = await readJson(FILES.incomes, []);
  const record = toRecordWithId(incomes, {
    phone_number,
    description,
    amount: Number(amount),
    date: new Date().toISOString().slice(0, 10),
  });
  incomes.push(record);
  await writeJson(FILES.incomes, incomes);
  return record;
}

async function addExpense({ phone_number, description, amount }) {
  const expenses = await readJson(FILES.expenses, []);
  const record = toRecordWithId(expenses, {
    phone_number,
    description,
    amount: Number(amount),
    date: new Date().toISOString().slice(0, 10),
  });
  expenses.push(record);
  await writeJson(FILES.expenses, expenses);
  return record;
}

async function getReport(phone_number, period) {
  const incomes = await readJson(FILES.incomes, []);
  const expenses = await readJson(FILES.expenses, []);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  let startDate;
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    startDate = d.toISOString().slice(0, 10);
  } else {
    startDate = today;
  }

  const filterByDate = (list) =>
    list.filter((r) => r.phone_number === phone_number && r.date >= startDate);

  const userIncomes = filterByDate(incomes);
  const userExpenses = filterByDate(expenses);

  const totalIncome = userIncomes.reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = userExpenses.reduce((sum, r) => sum + r.amount, 0);
  const profit = totalIncome - totalExpense;

  const label = period === "week" ? "Weekly" : "Today's";
  return `📊 ${label} Report\nIncome: $${totalIncome}\nExpense: $${totalExpense}\nProfit: $${profit}`;
}

async function addSalary({ phone_number, salary_amount }) {
  const salaries = await readJson(FILES.salaries, []);
  const record = toRecordWithId(salaries, {
    phone_number,
    salary_amount: Number(salary_amount),
  });

  salaries.push(record);
  await writeJson(FILES.salaries, salaries);
  return record;
}

async function setSession(phone_number, current_step) {
  const sessions = await readJson(FILES.sessions, {});

  sessions[phone_number] =
    typeof current_step === "object" && current_step !== null
      ? current_step
      : { current_step };
  await writeJson(FILES.sessions, sessions);
  return sessions[phone_number];
}

async function getSession(phone_number) {
  const sessions = await readJson(FILES.sessions, {});
  return sessions[phone_number] || null;
}

module.exports = {
  addIncome,
  addExpense,
  addSalary,
  setSession,
  getSession,
  getReport,
};
