const express = require("express");
const fs = require("fs/promises");
const path = require("path");
require("dotenv").config();
const { sendMessage, sendButtons, sendList } = require("./services/whatsapp");
const { setSession, getSession, addIncome, addExpense, getReport } = require("./db/db");

const app = express();

app.use(express.json());

const FLOW_FILE = path.join(__dirname, "../data/whatsapp-conve-v1.json");

async function loadFlow() {
  const raw = await fs.readFile(FLOW_FILE, "utf8");
  const parsed = JSON.parse(raw);
  return parsed?.conversation?.find((item) => item.active) || null;
}

function getActiveButtons(node) {
  return (node.answers || []).filter((a) => a.active && a.input === "button");
}

function menuBody(node) {
  return [node.question, node.dummy].filter(Boolean).join("\n\n");
}

function findButtonAnswer(node, text) {
  const normalized = text.toLowerCase();
  const buttons = (node.answers || []).filter(
    (answer) => answer.active && answer.input === "button"
  );
  const numericChoice = Number.parseInt(normalized, 10);

  if (Number.isInteger(numericChoice) && numericChoice >= 1 && numericChoice <= buttons.length) {
    return buttons[numericChoice - 1];
  }

  return buttons.find((answer) => {
    const label = answer.text?.toLowerCase() || "";
    const textWithoutNumber = label.replace(/^\d+\S*\s*/, "").trim();
    return (
      label === normalized ||
      textWithoutNumber === normalized ||
      answer.key?.toLowerCase() === normalized ||
      answer.clickId?.toLowerCase() === normalized
    );
  });
}

const isTestMode = String(process.env.WHATSAPP_TEST_MODE || "").toLowerCase() === "true";

function createResponder(res) {
  const replies = [];

  return {
    async send(to, message) {
      replies.push({ to, message });
      await sendMessage(to, message);
    },
    async sendInteractive(to, node) {
      const buttons = getActiveButtons(node);
      const body = menuBody(node);
      if (buttons.length <= 3) {
        const btns = buttons.map((b) => ({ id: b.clickId || b.key, title: b.text.replace(/^\S+\s*/, "").slice(0, 20) }));
        replies.push({ to, body, buttons: btns });
        await sendButtons(to, body, btns);
      } else {
        const rows = buttons.map((b) => ({ id: b.clickId || b.key, title: b.text.replace(/^\S+\s*/, "").slice(0, 24) }));
        const sections = [{ title: "Options", rows }];
        replies.push({ to, body, sections });
        await sendList(to, body, "Choose", sections);
      }
    },
    ok() {
      if (isTestMode) {
        return res.status(200).json({ ok: true, testMode: true, replies });
      }
      return res.sendStatus(200);
    },
  };
}

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
    const responder = createResponder(res);
    const body = req.body;
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return responder.ok();

    const from = message.from;
    const text =
      message.interactive?.button_reply?.id ||
      message.interactive?.list_reply?.id ||
      message.text?.body?.trim();

    if (!from || !text) return responder.ok();

    const flow = await loadFlow();
    if (!flow) {
      await responder.send(from, "Conversation flow is not configured.");
      return responder.ok();
    }

    const normalized = text.toLowerCase();

    if (normalized === "hi" || normalized === "hello") {
      await setSession(from, {
        current_step: "menu",
        nodeId: flow.id,
        answerKey: null,
        mode: "button",
      });
      await responder.sendInteractive(from, flow);
      return responder.ok();
    }

    let session = await getSession(from);
    if (!session) {
      session = await setSession(from, {
        current_step: "menu",
        nodeId: flow.id,
        answerKey: null,
        mode: "button",
      });
      await responder.sendInteractive(from, flow);
      return responder.ok();
    }

    if (session.current_step === "menu") {
      const selected = findButtonAnswer(flow, text);
      if (!selected) {
        await responder.send(from, "Invalid option.");
        await responder.sendInteractive(from, flow);
        return responder.ok();
      }

      const nextNode = selected.followUp?.find((item) => item.active);
      if (!nextNode) {
        await responder.send(from, "No follow-up configured for this option.");
        return responder.ok();
      }

      const hasButtons = (nextNode.answers || []).some((a) => a.active && a.input === "button");
      await setSession(from, {
        current_step: hasButtons ? "sub_menu" : "await_input",
        nodeId: nextNode.id,
        answerKey: selected.key,
        mode: hasButtons ? "button" : "text",
      });
      if (hasButtons) {
        await responder.sendInteractive(from, nextNode);
      } else {
        await responder.send(from, menuBody(nextNode));
      }
      return responder.ok();
    }

    if (session.current_step === "sub_menu") {
      const parent = (flow.answers || []).find((item) => item.key === session.answerKey);
      const subNode = parent?.followUp?.find((item) => item.id === session.nodeId);
      if (!subNode) {
        await responder.send(from, "Sub-menu not configured.");
        await setSession(from, { current_step: "menu", nodeId: flow.id, answerKey: null, mode: "button" });
        await responder.sendInteractive(from, flow);
        return responder.ok();
      }

      const selected = findButtonAnswer(subNode, text);
      if (!selected) {
        await responder.send(from, "Invalid option.");
        await setSession(from, { current_step: "menu", nodeId: flow.id, answerKey: null, mode: "button" });
        await responder.sendInteractive(from, flow);
        return responder.ok();
      }

      const done = selected.followUp?.[0];
      if (done?.module === "todayReport") {
        const report = await getReport(from, "today");
        await responder.send(from, report);
      } else if (done?.module === "weekReport") {
        const report = await getReport(from, "week");
        await responder.send(from, report);
      } else {
        const nextNode = selected.followUp?.find((item) => item.active);
        if (nextNode) {
          const hasButtons = (nextNode.answers || []).some((a) => a.active && a.input === "button");
          await setSession(from, {
            current_step: hasButtons ? "sub_menu" : "await_input",
            nodeId: nextNode.id,
            answerKey: selected.key,
            mode: hasButtons ? "button" : "text",
          });
          if (hasButtons) {
            await responder.sendInteractive(from, nextNode);
          } else {
            await responder.send(from, menuBody(nextNode));
          }
          return responder.ok();
        }
        await responder.send(from, done?.success || "Done.");
      }

      await setSession(from, { current_step: "menu", nodeId: flow.id, answerKey: null, mode: "button" });
      await responder.sendInteractive(from, flow);
      return responder.ok();
    }

    if (session.current_step === "await_input") {
      const parent = (flow.answers || []).find((item) => item.key === session.answerKey);
      const inputNode = parent?.followUp?.find((item) => item.id === session.nodeId) || parent?.followUp?.[0];
      const textAnswer = inputNode?.answers?.find((item) => item.active && item.input === "text");

      if (!textAnswer) {
        await responder.send(from, "Input step is not configured.");
        await setSession(from, { current_step: "menu", nodeId: flow.id, answerKey: null, mode: "button" });
        await responder.sendInteractive(from, flow);
        return responder.ok();
      }

      const rule = textAnswer.validation || {};
      if (
        typeof text !== "string" ||
        text.length < (rule.minLength || 0) ||
        text.length > (rule.maxLength || Number.MAX_SAFE_INTEGER)
      ) {
        await responder.send(from, rule.errorMessage || "Invalid input. Please try again.");
        await setSession(from, { current_step: "menu", nodeId: flow.id, answerKey: null, mode: "button" });
        await responder.sendInteractive(from, flow);
        return responder.ok();
      }

      const done = textAnswer.followUp?.[0];

      // Parse entries: "Egg sales 200\nMilk 500"
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const match = line.match(/^(.+?)\s+(\d+)$/);
        if (match) {
          const description = match[1].trim();
          const amount = Number(match[2]);
          if (done?.module === "saveIncome") {
            await addIncome({ phone_number: from, description, amount });
          } else if (done?.module === "saveExpense") {
            await addExpense({ phone_number: from, description, amount });
          }
        }
      }

      await responder.send(from, done?.success || "Saved successfully.");

      await setSession(from, {
        current_step: "menu",
        nodeId: flow.id,
        answerKey: null,
        mode: "button",
      });
      await responder.sendInteractive(from, flow);
      return responder.ok();
    }

    await setSession(from, { current_step: "menu", nodeId: flow.id, answerKey: null, mode: "button" });
    await responder.sendInteractive(from, flow);
    return responder.ok();
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
