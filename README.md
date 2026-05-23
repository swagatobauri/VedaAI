<div align="center">
  <img src="frontend/public/assets/banner.png" alt="VedaAI Banner" width="100%" style="border-radius: 20px"/>
  
  # 🚀 VedaAI
  **The ultimate AI-powered Teacher Toolkit.**  
  *Because grading papers and writing exams manually is so 2010.*

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-Backend-blue?logo=express)](https://expressjs.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?logo=prisma)](https://prisma.io/)
  [![Groq](https://img.shields.io/badge/Groq-Llama%203.3-F55036?logo=groq)](https://groq.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)

</div>

---

## 🌟 What is VedaAI?

Welcome to **VedaAI**, your new favorite digital teaching assistant! VedaAI takes the soul-crushing work out of creating question papers. You just toss it a syllabus, a PDF, or an image of some notes, tell it how many marks you want, and boom—it uses state-of-the-art AI (shoutout to Groq and Llama 3) to generate a fully formatted, professional question paper. 

Oh, and it also organizes your students into groups and emails them the assignments. You basically just sit back and sip your coffee. ☕

## ✨ Features That Will Save Your Weekend

- 🧠 **Instant Exam Generation:** Upload a PDF or image, and VedaAI parses the text and crafts highly relevant questions (MCQs, Short Answer, Long Answer).
- ⚡ **Lightning Fast AI:** Powered by Groq's insanely fast inference engine. It thinks faster than a student making excuses for missing homework.
- 🔐 **Bulletproof Auth:** Secure login via Google (Firebase) or traditional Email/Password, backed by custom JWTs.
- 👥 **Group Management:** Create classes/groups, add student emails, and blast out assignments with one click.
- 🎨 **Gorgeous UI:** A buttery-smooth, interactive interface built with Next.js and Tailwind that makes you actually *want* to do work.

---

## 🛠️ Tech Stack (The Geeky Stuff)

### Frontend 🎨
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Lucide React Icons
- **State Management:** React Context API

### Backend ⚙️
- **Server:** Node.js with Express (TypeScript)
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Prisma
- **Auth:** Firebase Admin + Custom JWTs
- **File Parsing:** `pdf-parse` & `Tesseract.js` (OCR)
- **AI Brain:** Groq SDK (`llama-3.3-70b-versatile`)
- **Email:** Nodemailer

---

## 🚀 Getting Started

Want to run this beast on your own machine? It’s easier than getting a teenager out of bed on a Monday.

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/VedaAI.git
cd VedaAI
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres"
GROQ_API_KEY="your_groq_key"
JWT_SECRET="some_super_secret_string"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```
*(Don't forget to put your `firebase-service-account.json` in the backend folder for Google Auth!)*

**Push the database schema:**
```bash
npx prisma generate
npx prisma db push
```

**Start the engine:**
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend/` directory with your Firebase public keys.

**Start the UI:**
```bash
npm run dev
```
Navigate to `http://localhost:3000` and marvel at your creation!

---

## 📚 Documentation
Want to know how the gears turn? Check out the **[SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)** for our High-Level and Low-Level architecture docs. It's written in plain English, we promise.

## 🤝 Contributing
Found a bug? Want to add a feature that grades the papers automatically so we literally never have to work again? Pull requests are welcome!

---
*Built with ❤️ (and entirely too much caffeine) by Swagato.*
