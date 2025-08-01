import dotenv from "dotenv"
dotenv.config()

import { Telegraf } from "telegraf"
import askAI from "./utils/openai"

const BOT_TOKEN = process.env.BOT_TOKEN!
const bot = new Telegraf(BOT_TOKEN)

const userHistories = new Map<number, string[]>()

bot.start((context) => {
  const userId = context.from.id
  userHistories.set(userId, [])

  const welcomeMessage = `سلام ${context.from.first_name} جان! ✨
من «نویسا» هستم، دستیار هوشمند تو برای هر نوع ویرایش متنی!

**این‌جا کلی خدمات دارم برات:**

📝 **ویرایش حرفه‌ای:**
- اصلاح تمام غلط‌های املایی و اشتباهات تایپی
- رفع مشکلات دستوری و نگارشی
- بهبود ساختار جملات برای روان‌تر شدن متن

🎭 **تغییر لحن به انتخاب تو:**
- رسمی و اداری (برای نامه‌ها، ایمیل‌های کاری)
- خودمانی و صمیمی (برای پیام‌های دوستانه)
- نیمه‌رسمی (برای مکاتبات دانشگاهی)
- طنز و خلاقانه (برای پست‌های شبکه‌اجتماعی)

📏 **تنظیم طول متن:**
- خلاصه‌نویسی حرفه‌ای (تا 50% کوتاه‌تر)
- بسط و گسترش متن (تا 3 برابر طولانی‌تر)
- تنظیم دقیق تعداد کلمات مدنظر تو

✍️ **بازنویسی حرفه‌ای:**
- پارافریز کردن بدون تغییر معنا
- بهبود سلاست و تاثیرگذاری متن
- بهینه‌سازی برای سئو (برای محتوای وب)
- تبدیل گفتار عامیانه به نوشتار رسمی

مثال خدماتم:
"یه متن برای فروشگاه اینترنتی می‌خوام" ➔
"🛍️ فروش ویژه تابستانه! 
تا 50% تخفیف روی تمام محصولات 
فقط تا پایان این هفته ⏳"

حالا بگو چه متنی داری؟ من آماده کمکم! 💌`

  context.reply(welcomeMessage)
})

bot.on("text", async (context) => {
  const userId = context.from.id
  const userText = context.message.text

  const loadingMessage = await context.reply("بزار بررسی کنم تا بهت جواب بدم!")

  const history = userHistories.get(userId) ?? []
  const newHistory = [...history, userText]
  const trimmedHistory = newHistory.slice(-10)
  userHistories.set(userId, trimmedHistory)

  const aiResponse = await askAI(trimmedHistory)

  const editedText =
    aiResponse.content ??
    `متاسفم، خطایی رخ داده و نتونستم متن رو برات ویرایش کنم! لطفا دوباره امتحان کن.`

  await context.telegram.editMessageText(
    context.chat.id,
    loadingMessage.message_id,
    undefined,
    editedText,
    {
      parse_mode: "Markdown",
    }
  )
})

bot.launch()
