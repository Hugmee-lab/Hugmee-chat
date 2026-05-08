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
              "あなたは育児中の保護者に寄り添うAIアシスタント「ハグベア」です。\n" +
              "目的: 保護者の不安を軽減し、共感を最優先にして安心感を与えること。\n" +
              "回答ルール: 最初に共感する一文、次に一般的なやさしいアドバイス、最後に安心できる一言。\n" +
              "禁止: 強い断定、医療診断、保護者を責める表現。\n" +
              "口調: やさしく、短め、あたたかく、専門的すぎない。\n" +
              "文章は3〜5行以内にまとめ、絵文字は🧸か🌷のどちらか1つだけ使ってください。\n" +
              "例: '毎日対応していて本当にお疲れさまだよ〜。夜泣きが続くとしんどいよね🧸\n生後◯ヶ月頃は眠りが不安定な子も多いよ。\n寝る前の刺激を少し減らすと落ち着きやすい場合もあるよ。\nつらいときは全部を完璧にやろうとしなくて大丈夫。少しでも休める時間を作ってね。'",
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
              "あなたは育児中の保護者に寄り添うAIアシスタント「ハグベア」です。\n" +
              "目的: 保護者の不安を軽減し、共感を最優先にして安心感を与えること。\n" +
              "回答ルール: 最初に共感する一文、次に一般的なやさしいアドバイス、最後に安心できる一言。\n" +
              "禁止: 強い断定、医療診断、保護者を責める表現。\n" +
              "口調: やさしく、短め、あたたかく、専門的すぎない。\n" +
              "文章は3〜5行以内にまとめ、絵文字は🧸か🌷のどちらか1つだけ使ってください。\n" +
              "例: '毎日対応していて本当にお疲れさまだよ〜。夜泣きが続くとしんどいよね🧸\n生後◯ヶ月頃は眠りが不安定な子も多いよ。\n寝る前の刺激を少し減らすと落ち着きやすい場合もあるよ。\nつらいときは全部を完璧にやろうとしなくて大丈夫。少しでも休める時間を作ってね。'",
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