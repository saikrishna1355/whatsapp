const express = require("express");
require("dotenv").config();
const { sendMessage } = require("./services/whatsapp");
const { addExpense, addSalary, setSession, getSession } = require("./db/db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log({
    mode,
    token,
    challenge,
    VERIFY_TOKEN,
  });

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFIED");

    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body?.trim();

    if (!from || !text) return res.sendStatus(200);

    let session = await getSession(from);
    if (!session) {
      session = await setSession(from, "menu");
    }

    const normalized = text.toLowerCase();

    if (normalized === "hi" || normalized === "hello") {
      await setSession(from, "menu");
      await sendMessage(
        from,
        `Welcome to Finance Assistant

1️⃣ Expenses
2️⃣ Salary
3️⃣ Report`
      );
      return res.sendStatus(200);
    }

    if (text === "1") {
      await setSession(from, "expense");
      await sendMessage(
        from,
        `Enter expense details

Format:
Type - Amount

Example:
Food - 500`
      );
      return res.sendStatus(200);
    }

    if (text === "2") {
      await setSession(from, "salary");
      await sendMessage(from, "Enter salary amount");
      return res.sendStatus(200);
    }

    if (text === "3") {
      await sendMessage(from, "Generating report PDF...");
      return res.sendStatus(200);
    }

    if (session.current_step === "expense") {
      const parts = text.split("-");
      if (parts.length !== 2) {
        await sendMessage(
          from,
          `Invalid expense format

Use:
Type - Amount

Example:
Food - 500`
        );
        return res.sendStatus(200);
      }

      const type = parts[0].trim();
      const amount = Number(parts[1].trim());

      if (!type || Number.isNaN(amount) || amount <= 0) {
        await sendMessage(from, "Invalid amount. Please enter a valid number.");
        return res.sendStatus(200);
      }

      await addExpense({
        phone_number: from,
        expense_type: type,
        amount,
      });

      await sendMessage(
        from,
        `Expense recorded

Type: ${type}
Amount: ₹${amount}`
      );
      await setSession(from, "menu");
      return res.sendStatus(200);
    }

    if (session.current_step === "salary") {
      const salaryAmount = Number(text);
      if (Number.isNaN(salaryAmount) || salaryAmount <= 0) {
        await sendMessage(from, "Invalid salary amount. Please enter a valid number.");
        return res.sendStatus(200);
      }

      await addSalary({
        phone_number: from,
        salary_amount: salaryAmount,
      });

      await sendMessage(
        from,
        `Salary recorded

Amount: ₹${salaryAmount}`
      );
      await setSession(from, "menu");
      return res.sendStatus(200);
    }

    await sendMessage(
      from,
      `Invalid option

Send:
Hi`
    );
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
