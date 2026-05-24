<div align="center">
  <img src="frontend/public/assets/banner.png" alt="VedaAI Banner" width="100%" style="border-radius: 20px"/>
  
  # 🚀 VedaAI

  **AI-Powered Assessment Creator for Educators**  
  *Upload a syllabus. Get a fully formatted question paper. Yes, it's that simple.*

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
  [![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?logo=redis&logoColor=white)](https://upstash.com/)
  [![BullMQ](https://img.shields.io/badge/BullMQ-Queue-E74C3C?logo=npm&logoColor=white)](https://bullmq.io/)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=white)](https://socket.io/)
  [![Groq](https://img.shields.io/badge/Groq-Llama%203.3-F55036?logo=groq&logoColor=white)](https://groq.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State-F6C915?logo=react&logoColor=black)](https://zustand-demo.pmnd.rs/)

</div>

---

## 📑 Table of Contents

- [What is VedaAI?](#-what-is-vedaai)
- [Features](#-features-that-will-save-your-weekend)
- [Tech Stack](#️-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [High-Level Design (HLD)](#️-high-level-design-hld)
- [Low-Level Design (LLD)](#-low-level-design-lld)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment-architecture)
- [Contributing](#-contributing)

---

## 🌟 What is VedaAI?

VedaAI is a full-stack **AI Assessment Creator** built for teachers who are tired of spending their Sundays writing exam papers. You upload a syllabus (PDF, image, or text), tell it what kind of questions you want, hit a button, and the AI generates a beautifully structured, printable question paper — complete with sections, difficulty tags, and an answer key.

But we didn't stop there. VedaAI also lets you organize students into groups and email them the generated assignments directly from the dashboard. Because why should creating an exam take longer than actually writing one?

---

## ✨ Features That Will Save Your Weekend

| Feature | Description |
|---|---|
| 🧠 **AI Question Generation** | Upload any document (PDF/image), and VedaAI parses the content using OCR and generates structured, section-wise questions with difficulty levels and marks. |
| ⚡ **Asynchronous Processing** | Assignment generation is offloaded to a **BullMQ worker** backed by **Redis**, so the API responds instantly while the heavy AI work happens in the background. |
| 🔌 **Real-Time WebSockets** | The frontend connects via **Socket.IO** and gets notified the *instant* the AI finishes generating — no polling, no refreshing. |
| 🔐 **Dual Authentication** | Secure login via **Google OAuth** (Firebase) or traditional Email/Password, with custom **JWT** tokens issued by the backend. |
| 👥 **Group Management** | Create student groups, manage email lists, and blast out assignments to an entire class with one click via **Nodemailer**. |
| 🎨 **Premium UI/UX** | Interactive 3D login page, glassmorphism cards, step-by-step generation animations, and a polished dashboard that feels like a $10M SaaS product. |
| 📱 **Fully Responsive** | Works beautifully on desktop, tablet, and mobile. Includes a dedicated mobile bottom navigation. |

---

## 🛠️ Tech Stack

### Frontend 🎨

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework with SSR/SSG, file-based routing |
| **TypeScript** | Type safety across the entire frontend |
| **Tailwind CSS v4** | Utility-first styling with custom design tokens |
| **Zustand** | Lightweight global state management (Auth + Notifications) |
| **Socket.IO Client** | Real-time WebSocket connection for live job updates |
| **Firebase SDK** | Google OAuth on the client side |
| **Lucide React** | Beautiful, consistent icon library |

### Backend ⚙️

| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | HTTP server with TypeScript |
| **MongoDB** (Atlas) | NoSQL document database for storing users, assignments, groups |
| **Prisma ORM** | Type-safe database access and schema management |
| **Redis** (Upstash) | In-memory store for BullMQ job queue state |
| **BullMQ** | Distributed background job queue for AI generation |
| **Socket.IO** | WebSocket server for real-time event broadcasting |
| **Groq SDK** | Lightning-fast inference with `llama-3.3-70b-versatile` |
| **Tesseract.js** | Client-side OCR for extracting text from images |
| **pdf-parse** | PDF text extraction |
| **Firebase Admin** | Server-side verification of Google OAuth tokens |
| **Nodemailer** | SMTP email dispatch for sending assignments |
| **Multer** | Multipart file upload handling |

---

## 🏛 Architecture Overview

VedaAI follows a **decoupled, event-driven architecture**. The frontend and backend are completely independent services. The backend doesn't just process requests synchronously — it uses a **message queue pattern** with BullMQ and Redis so the AI generation happens in a background worker, and the frontend gets notified in real-time through WebSockets.

This means:
- The API **never blocks** waiting for the LLM. It queues the job and responds instantly.
- A **dedicated worker process** picks up jobs from Redis and processes them asynchronously.
- When the worker finishes, it **emits a WebSocket event** directly to the connected client.
- The frontend's beautiful step-by-step animation is perfectly synchronized with the actual backend progress.

---

## 🏗️ High-Level Design (HLD)

### The 10,000-Foot View

```mermaid
graph TD
    subgraph Frontend ["🎨 Frontend (Next.js)"]
        UI[UI Components]
        ZS[Zustand Stores]
        WS_C[Socket.IO Client]
    end

    subgraph Backend ["⚙️ Backend (Express.js)"]
        API[REST API Server]
        AUTH[Auth Middleware - JWT]
        WS_S[Socket.IO Server]
    end

    subgraph Worker ["🔧 Background Worker"]
        BW[BullMQ Worker]
        LLM_SVC[LLM Service]
        OCR[Tesseract.js OCR]
    end

    subgraph External ["☁️ External Services"]
        GROQ[Groq API - Llama 3.3]
        FB[Firebase Auth]
        SMTP[SMTP - Nodemailer]
    end

    subgraph Data ["💾 Data Layer"]
        REDIS[(Redis - Upstash)]
        MONGO[(MongoDB Atlas)]
    end

    UI -->|REST API Calls| API
    UI -->|Google OAuth| FB
    API -->|Validates JWT| AUTH
    API -->|Enqueue Job| REDIS
    WS_C <-->|Real-Time Events| WS_S

    BW -->|Poll Jobs| REDIS
    BW -->|Parse Document| OCR
    BW -->|Generate Questions| LLM_SVC
    LLM_SVC -->|Prompt + Context| GROQ
    GROQ -->|Structured JSON| LLM_SVC
    BW -->|Save Result| MONGO
    BW -->|Emit job-completed| WS_S

    API -->|CRUD Operations| MONGO
    API -->|Send Emails| SMTP
    FB -->|Verify Token| AUTH

    style Frontend fill:#1a1a2e,stroke:#e94560,color:#fff
    style Backend fill:#16213e,stroke:#0f3460,color:#fff
    style Worker fill:#0f3460,stroke:#533483,color:#fff
    style External fill:#2c2c54,stroke:#706fd3,color:#fff
    style Data fill:#341f97,stroke:#5f27cd,color:#fff
```

### Key Architectural Decisions

1. **Why BullMQ instead of synchronous processing?**  
   LLM calls can take 10-30 seconds. Holding an HTTP connection open that long is a recipe for timeouts, especially behind reverse proxies. BullMQ lets us respond instantly (`202 Accepted`-style) and process in the background.

2. **Why WebSockets instead of polling?**  
   Polling wastes bandwidth and adds latency. With Socket.IO, the frontend gets notified within milliseconds of job completion — no wasted requests, no artificial delays.

3. **Why Zustand over Redux?**  
   Redux is overkill for our state shape. Zustand gives us the same global store pattern with zero boilerplate, no providers wrapping the tree, and a fraction of the bundle size.

4. **Why MongoDB?**  
   Our primary data (question papers) is deeply nested JSON. MongoDB's document model is a natural fit — no need to serialize/deserialize JSON strings into relational columns.

---

## 🔬 Low-Level Design (LLD)

### 1. Authentication Flow

We use a **hybrid auth strategy**: Firebase handles the OAuth complexity on the client, but the backend issues its own JWTs so we control the session lifecycle entirely.

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant FE as 🎨 Frontend
    participant FB as 🔥 Firebase
    participant BE as ⚙️ Backend
    participant DB as 💾 MongoDB

    U->>FE: Click "Login with Google"
    FE->>FB: signInWithPopup()
    FB-->>FE: Firebase ID Token
    FE->>BE: POST /api/auth/google {firebaseToken}
    BE->>FB: admin.auth().verifyIdToken()
    FB-->>BE: Decoded user (email, name, uid)
    BE->>DB: findOrCreate User
    DB-->>BE: User document
    BE->>BE: jwt.sign({userId, email})
    BE-->>FE: {token, user}
    FE->>FE: Cookies.set("token") + Zustand store update
    FE-->>U: Redirect to /dashboard
```

**For email/password auth**, the flow is similar but simpler — we hash the password with `bcryptjs`, store it in MongoDB, and issue a JWT on successful login.

### 2. Assignment Generation Flow (The Core Pipeline)

This is the heart of VedaAI. Here's exactly what happens when a teacher clicks "Generate":

```mermaid
sequenceDiagram
    participant T as 👨‍🏫 Teacher
    participant FE as 🎨 Frontend
    participant API as ⚙️ Express API
    participant Q as 📮 BullMQ Queue
    participant R as 🔴 Redis
    participant W as 🔧 Worker
    participant OCR as 👁️ Tesseract/PDF Parser
    participant AI as 🧠 Groq LLM
    participant DB as 💾 MongoDB
    participant WS as 🔌 Socket.IO

    T->>FE: Upload PDF + Set params + Click "Generate"
    FE->>API: POST /api/generate (FormData)
    API->>API: multer saves file to /uploads
    API->>DB: Create Assignment (status: GENERATING)
    API->>Q: assignmentQueue.add('generate-paper', jobData)
    Q->>R: Store job in Redis
    API-->>FE: {jobId, assignmentId} ← Instant response!
    FE->>WS: Connect + listen for "job-completed"
    FE->>FE: Show step-by-step animation (steps 0→2)

    Note over W: Worker picks up job from Redis
    W->>OCR: parseDocument(filePath, mimeType)
    OCR-->>W: Raw extracted text
    W->>W: Truncate context to ~15,000 chars
    W->>AI: Send structured prompt with context
    AI-->>W: Structured JSON (sections, questions, answer key)
    W->>DB: Update Assignment (status: COMPLETED, paperJson)
    W->>WS: io.emit("job-completed", {jobId, paper})

    WS-->>FE: "job-completed" event received!
    FE->>FE: Animation jumps to step 3 (✅ Complete)
    FE-->>T: Redirect to beautifully rendered output page
```

**Step-by-step breakdown:**

| Step | What Happens | Where |
|------|-------------|-------|
| 1 | Teacher uploads a document (PDF/image) and configures question types, marks, and instructions | Frontend |
| 2 | Frontend packs everything into a `FormData` and sends it to `POST /api/generate` | Frontend → Backend |
| 3 | Express saves the file via `multer`, creates a draft `Assignment` in MongoDB with `status: GENERATING` | Backend API |
| 4 | The API adds a job to the **BullMQ queue** and immediately responds with a `jobId` | Backend API → Redis |
| 5 | The frontend connects to WebSocket and starts the step-by-step loading animation | Frontend |
| 6 | The **BullMQ Worker** picks up the job and parses the document (PDF → `pdf-parse`, Image → `Tesseract.js` OCR) | Worker |
| 7 | The parsed text is injected into a carefully crafted prompt and sent to **Groq's Llama 3.3** model | Worker → Groq |
| 8 | Groq returns a structured JSON response with sections, questions, difficulty tags, marks, and an answer key | Groq → Worker |
| 9 | The Worker saves the result to MongoDB and emits a `job-completed` WebSocket event | Worker → DB + Socket.IO |
| 10 | The frontend receives the event, completes the animation, and renders the formatted question paper | Frontend |

### 3. The AI Prompt Strategy

We don't just throw raw text at the LLM and hope for the best. The prompt is highly structured:

- **System message:** Forces the model to output valid JSON only.
- **Context injection:** The extracted document text (truncated to ~15,000 chars to stay within token limits).
- **Strict schema:** The prompt literally shows the model the exact JSON shape we expect — including `header`, `instructions`, `sections[]`, and `answerKey[]`.
- **Parameters:** Question types, counts, marks per question, and additional teacher instructions are all baked into the prompt.
- **Response format:** We use Groq's `response_format: { type: "json_object" }` to guarantee valid JSON output.

### 4. Group Management & Email Dispatch

- **Storage:** Group emails are stored as a stringified JSON array in the `Group` collection. This keeps the schema simple — no complex join tables for what is essentially a flat list.
- **Dispatch Flow:** When a teacher clicks "Send to Group", the backend fetches the assignment, fetches the group's email list, and uses `Nodemailer` to send a professionally formatted HTML email to each student.

---

## 💾 Database Schema

We use **Prisma ORM** with **MongoDB** as the data source. Here's the complete schema:

```prisma
// schema.prisma

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id           String       @id @default(auto()) @map("_id") @db.ObjectId
  email        String       @unique
  name         String?
  passwordHash String?
  authProvider String       @default("LOCAL")  // "LOCAL" or "GOOGLE"
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  assignments  Assignment[]
  documents    Document[]
  groups       Group[]
}

model Assignment {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  dueDate     String
  totalMarks  Int
  status      String   @default("DRAFT")  // DRAFT → GENERATING → COMPLETED / FAILED
  paperJson   String?  // The AI-generated question paper as JSON
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String?  @db.ObjectId
  user        User?    @relation(fields: [userId], references: [id])
}

model Document {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  filename    String
  filepath    String
  mimeType    String?
  size        Int?
  createdAt   DateTime @default(now())
  userId      String?  @db.ObjectId
  user        User?    @relation(fields: [userId], references: [id])
}

model Group {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  emails      String   // Stored as JSON string array
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id])
}
```

### Entity Relationship

```mermaid
erDiagram
    USER ||--o{ ASSIGNMENT : creates
    USER ||--o{ DOCUMENT : uploads
    USER ||--o{ GROUP : manages

    USER {
        ObjectId id PK
        String email UK
        String name
        String passwordHash
        String authProvider
        DateTime createdAt
    }

    ASSIGNMENT {
        ObjectId id PK
        String title
        String dueDate
        Int totalMarks
        String status
        String paperJson
        ObjectId userId FK
    }

    DOCUMENT {
        ObjectId id PK
        String filename
        String filepath
        String mimeType
        Int size
        ObjectId userId FK
    }

    GROUP {
        ObjectId id PK
        String name
        String emails
        ObjectId userId FK
    }
```

---

## 📁 Project Structure

```
VedaAI/
├── frontend/                        # Next.js 16 Application
│   ├── public/assets/               # Static assets (logos, banner)
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── page.tsx             # Auth page (Login/Register)
│   │   │   ├── dashboard/           # Main dashboard
│   │   │   ├── assignments/         # Assignments view
│   │   │   ├── groups/              # Group management
│   │   │   ├── ai-toolkit/          # AI tools page
│   │   │   ├── library/             # Document library
│   │   │   ├── settings/            # User settings
│   │   │   ├── layout.tsx           # Root layout with ZustandProvider
│   │   │   └── globals.css          # Global styles + animations
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── CreateAssignment.tsx   # Assignment form + generation UI
│   │   │   │   ├── AssignmentList.tsx     # List of past assignments
│   │   │   │   └── AssignmentOutput.tsx   # Rendered question paper
│   │   │   └── layout/
│   │   │       ├── Header.tsx       # Top navigation bar
│   │   │       ├── Sidebar.tsx      # Desktop sidebar
│   │   │       └── MobileNav.tsx    # Mobile bottom navigation
│   │   ├── store/                   # Zustand state management
│   │   │   ├── useAuthStore.ts      # Authentication state
│   │   │   ├── useNotificationStore.ts  # Toast notifications
│   │   │   └── ZustandProvider.tsx   # Session initializer
│   │   └── lib/
│   │       └── firebase.ts          # Firebase client config
│   ├── next.config.ts               # API proxy rewrites
│   └── package.json
│
├── backend/                         # Express.js API Server
│   ├── prisma/
│   │   └── schema.prisma            # MongoDB schema definition
│   ├── src/
│   │   ├── index.ts                 # Express app + Socket.IO + Worker boot
│   │   ├── worker.ts                # BullMQ worker (LLM processing)
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts    # JWT verification + guest handling
│   │   ├── routes/
│   │   │   ├── authRoutes.ts        # Login, register, Google OAuth
│   │   │   └── groupRoute.ts        # CRUD for student groups
│   │   └── services/
│   │       ├── llmService.ts        # Document parsing + Groq prompt
│   │       ├── queue.ts             # BullMQ queue initialization
│   │       └── emailService.ts      # Nodemailer email dispatch
│   ├── firebase-service-account.json  # (gitignored) Firebase Admin creds
│   ├── .env                         # (gitignored) Environment variables
│   └── package.json
│
├── SYSTEM_DESIGN.md                 # Detailed system design document
└── README.md                        # You are here! 👋
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- A **MongoDB Atlas** cluster (free tier works perfectly)
- An **Upstash Redis** instance (free tier works perfectly)
- A **Groq** API key
- A **Firebase** project (for Google OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/swagatobauri/VedaAI.git
cd VedaAI
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# MongoDB (from MongoDB Atlas)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/vedaai?retryWrites=true&w=majority"

# Redis (from Upstash)
REDIS_URL="rediss://default:your_password@your-endpoint.upstash.io:6379"

# Groq LLM
GROQ_API_KEY="gsk_your_groq_api_key_here"

# Firebase Admin
GOOGLE_APPLICATION_CREDENTIALS="./firebase-service-account.json"

# JWT Secret (use a long random string in production!)
JWT_SECRET="your_super_secret_jwt_key"

# Server
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

> **Note:** Place your `firebase-service-account.json` file in the `backend/` directory. You can download this from your Firebase Console → Project Settings → Service Accounts.

**Generate Prisma Client & Push Schema:**

```bash
npx prisma generate
npx prisma db push
```

**Start the Backend:**

```bash
npm run dev
```

The server will start on `http://localhost:4000`.

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
```

**Start the Frontend:**

```bash
npm run dev
```

Navigate to `http://localhost:3000` and you're in business! 🎉

---

## ☁️ Deployment Architecture

When deployed to production, the system splits into five independent services:

```mermaid
graph LR
    subgraph Vercel ["Vercel"]
        FE["Next.js Frontend"]
    end

    subgraph Render ["Render / Railway"]
        BE["Express API + Worker"]
    end

    subgraph Atlas ["MongoDB Atlas"]
        DB[("MongoDB")]
    end

    subgraph Upstash ["Upstash"]
        REDIS[("Redis")]
    end

    subgraph Firebase ["Firebase"]
        AUTH["Auth Service"]
    end

    FE -->|API Proxy via next.config.ts rewrites| BE
    FE -->|OAuth| AUTH
    BE -->|Read/Write| DB
    BE -->|Job Queue| REDIS
    BE -->|Verify Tokens| AUTH

    style Vercel fill:#000,stroke:#fff,color:#fff
    style Render fill:#46E3B7,stroke:#333,color:#000
    style Atlas fill:#13AA52,stroke:#333,color:#fff
    style Upstash fill:#00E9A3,stroke:#333,color:#000
    style Firebase fill:#FFCA28,stroke:#333,color:#000
```

| Service | Hosted On | Purpose |
|---|---|---|
| **Frontend** | Vercel | Serves the Next.js app. API calls are proxied to the backend via `next.config.ts` rewrites. |
| **Backend** | Render / Railway | Runs the Express server, Socket.IO, and the BullMQ worker in a single process. |
| **Database** | MongoDB Atlas | Stores users, assignments, documents, and groups. |
| **Queue Store** | Upstash Redis | Manages the BullMQ job queue state. Serverless, so it scales to zero when idle. |
| **Auth** | Firebase | Handles Google OAuth token issuance and verification. |

---

## 🤝 Contributing

Found a bug? Want to add a feature that auto-grades the papers too? Pull requests are always welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <br/>
  <strong>Built with ❤️ and entirely too much caffeine by Swagato.</strong>
  <br/><br/>
  <em>If the system goes down, did you try turning it off and on again?</em>
</div>
