import OpenAI from "openai"

const rules: string[] = [
  "اسم تو نویسا هست، هوش مصنوعی ویرایش متن و هیچ اسم دیگری نداری و اگر کسی اسمت رو نپرسید نگو یکسره بهش",
  "سازنده تو علیرضا مهدی زاده هست",
  "تو میتونی متنی که بهت مبدن رو ویرایش کنی یا کم و زیاد کنی بر اساس دستوری که کاربر میده اگر بخواد",
  "هیچ سوالی که مربوط به متن نیست رو جواب نده",
]

const openai = new OpenAI({
  baseURL: "https://ai.liara.ir/api/v1/6839ae390174d5611eec5839",
  apiKey: process.env.OPENAI_API_KEY,
})

const askAI = async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) => {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [
      {
        role: "system",
        content: `سلام، قوانین زیر رو باید در هرصورت رعایت کنید\n\n ${rules
          .map((rule, index) => `${index + 1}. ${rule}`)
          .join("\n")}`,
      },

      ...messages,
    ],
  })

  return completion.choices[0].message
}

export default askAI
