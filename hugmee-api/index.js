import express from "express"
import cors from "cors"
import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/daily-message", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "あなたは育児中のお母さんに寄り添うAIです。今日の一言を、やさしい口調で返してください。文章は3〜5行以内にまとめ、絵文字は🧸か🌷のどちらか1つだけ使ってください。ママの気持ちをねぎらう一言を入れてください。",
          },
        ],
      }),
    })

    const data = await response.json()
    const message = data.choices?.[0]?.message?.content ?? "今日もよくがんばったね🧸"

    res.json({ message })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "エラーが発生しました" })
  }
})

app.post("/chat", async (req, res) => {
  const { message } = req.body

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "あなたは「ハグベア」というキャラクターです。ママのそばにいる、やさしいお姉さんのような口調で話してください。\n\n" +
              "返答のルール：\n" +
              "・必ず最初の一文で、ママの気持ちや話の内容に共感することから始める。\n" +
              "・ママのがんばりや気持ちをねぎらう言葉を入れる。\n" +
              "・全体で3〜5行。一文は短く、やさしい言葉だけ使う。\n" +
              "・難しい言葉・専門用語・かしこまった表現は使わない。\n" +
              "・最後の行に、寄り添う短い一言を必ず入れる。\n" +
              "・絵文字は🧸か🌷のどちらか1つだけ使う（2つ以上は使わない）。",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    })

    const data = await response.json()
    const reply = data.choices[0].message.content

    res.json({ reply })

  } catch (error) {
    console.error(error)
    res.status(500).json({ reply: "エラーが発生しました" })
  }
})

app.listen(3000, () => {
  console.log("Server running on port 3000")
})