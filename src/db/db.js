const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");
const FILES = {
  expenses: path.join(DATA_DIR, "expenses.json"),
  salaries: path.join(DATA_DIR, "salaries.json"),
  sessions: path.join(DATA_DIR, "sessions.json"),
};

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(filePath, data) {
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

async function addExpense({ phone_number, expense_type, amount }) {
  const expenses = await readJson(FILES.expenses, []);
  const record = toRecordWithId(expenses, {
    phone_number,
    expense_type,
    amount: Number(amount),
  });
  expenses.push(record);
  await writeJson(FILES.expenses, expenses);
  return record;
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
  sessions[phone_number] = { current_step };
  await writeJson(FILES.sessions, sessions);
  return sessions[phone_number];
}

async function getSession(phone_number) {
  const sessions = await readJson(FILES.sessions, {});
  return sessions[phone_number] || null;
}

module.exports = {
  addExpense,
  addSalary,
  setSession,
  getSession,
};
