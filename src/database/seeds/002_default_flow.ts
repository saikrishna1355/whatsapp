import type { Knex } from 'knex';

const defaultFlow = {
  conversation: [
    {
      id: 1,
      active: true,
      question: "👋 Welcome to Farm Business Assistant",
      dummy: "Reply with:\n",
      answers: [
        {
          id: 1,
          input: "button",
          text: "1️⃣ Income",
          clickId: "income",
          key: "income",
          active: true,
          followUp: [
            {
              id: 2,
              question: "Enter income details",
              dummy: "Example:\nEgg sales 200\nMilk 500\nTomatoes 120",
              active: true,
              answers: [
                {
                  id: 1,
                  input: "text",
                  key: "income_entry",
                  active: true,
                  validation: { type: "textValidation", minLength: 3, maxLength: 100, errorMessage: "Please enter valid income details" },
                  followUp: [{ id: 3, success: "✅ Income saved successfully", module: "saveIncome" }]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          input: "button",
          text: "2️⃣ Expense",
          clickId: "expense",
          key: "expense",
          active: true,
          followUp: [
            {
              id: 2,
              question: "Enter expense details",
              dummy: "Example:\nFeed 100\nTransport 50\nWorkers 200",
              active: true,
              answers: [
                {
                  id: 1,
                  input: "text",
                  key: "expense_entry",
                  active: true,
                  validation: { type: "textValidation", minLength: 3, maxLength: 100, errorMessage: "Please enter valid expense details" },
                  followUp: [{ id: 3, success: "✅ Expense saved successfully", module: "saveExpense" }]
                }
              ]
            }
          ]
        },
        {
          id: 3,
          input: "button",
          text: "3️⃣ Report",
          clickId: "report",
          key: "report",
          active: true,
          followUp: [
            {
              id: 1,
              question: "Select report type",
              dummy: "Choose one option below",
              active: true,
              answers: [
                {
                  id: 1,
                  input: "button",
                  text: "1️⃣ Today",
                  clickId: "today_report",
                  key: "today_report",
                  active: true,
                  followUp: [{ id: 2, success: "📊 Today's Report\nIncome: $500\nExpense: $120\nProfit: $380", module: "todayReport" }]
                },
                {
                  id: 2,
                  input: "button",
                  text: "2️⃣ This Week",
                  clickId: "week_report",
                  key: "week_report",
                  active: true,
                  followUp: [{ id: 2, success: "📊 Weekly Report\nIncome: $3200\nExpense: $950\nProfit: $2250", module: "weekReport" }]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export async function seed(knex: Knex): Promise<void> {
  const exists = await knex('flow').where('key', 'conversation_flow').first();
  if (exists) return;

  await knex('flow').insert({
    key: 'conversation_flow',
    data: JSON.stringify(defaultFlow),
  });
}
