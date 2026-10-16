# 🚀 Zentrix AI — AI-Powered Career & Placement Preparation Platform

**Your Personal AI Career Copilot for Placements, DSA, Interviews, and Career Growth.**

Zentrix AI is a full-stack, AI-powered career development platform designed to help students prepare for technical interviews, improve their coding skills, analyze their resumes, identify skill gaps, and follow personalized learning roadmaps.

By combining Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), vector search, and personalized learning workflows, Zentrix AI aims to transform placement preparation into a structured, intelligent, and measurable experience.

---

## ✨ Key Features

### 🤖 1. AI Career Copilot
- Get personalized career guidance and placement preparation advice.
- Ask questions about DSA, programming, technical interviews, and career paths.
- Receive contextual responses generated using an LLM.
- Maintain conversation history for a continuous learning experience.

### 📄 2. AI Resume Intelligence
- Upload and analyze resumes.
- Extract relevant skills, education, experience, and projects.
- Identify missing skills and areas for improvement.
- Generate actionable suggestions to improve resume quality.
- Compare resume skills against job descriptions to identify skill gaps.

### 🧠 3. RAG-Powered Knowledge Retrieval
- Retrieve relevant information from supported documents and learning resources.
- Use embeddings to represent text as searchable vectors.
- Store and retrieve vectors using Pinecone.
- Provide retrieved context to the LLM to generate more relevant, grounded answers.

### 🎯 4. AI Mock Interviews
- Generate technical and HR interview questions.
- Practice answering interview questions.
- Evaluate answers using defined assessment criteria.
- Identify weak areas and receive improvement suggestions.

### 🗺️ 5. Personalized Learning Roadmaps
- Create structured learning plans based on career goals.
- Break large learning objectives into manageable tasks.
- Track progress toward placement preparation milestones.
- Adapt recommendations using available learning progress and skill-gap information.

### 💻 6. DSA Practice & Analytics
- Track coding practice and problem-solving progress.
- Organize learning goals by topic and difficulty.
- Monitor completed problems and practice consistency.
- Identify topics that need more attention.

### 🐙 7. GitHub Intelligence
- Analyze supported GitHub profile and repository information.
- Summarize projects, programming languages, and development activity.
- Identify opportunities to improve project presentation and portfolio quality.

### 📅 8. Study Planner & Task Management
- Organize daily and weekly learning activities.
- Track pending and completed tasks.
- Connect learning objectives with a structured preparation workflow.
- Monitor progress toward career goals.

### 🔐 9. Secure User Management
- User registration and login.
- JWT-based authentication.
- Password hashing with bcrypt.
- User-specific data access and persistent application records.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, REST APIs |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| LLM Integration | Groq API |
| AI Retrieval | RAG, embeddings, Pinecone |
| AI Orchestration | LangGraph, if enabled in the application |
| Version Control | Git, GitHub |
| Development Tools | VS Code, Postman |

**Note:** Keep this table aligned with your actual dependencies and working integrations. For example, list LangGraph only if your code uses it, and list Pinecone only if vector storage and retrieval are connected.

---

## 🧩 System Architecture

```text
                   ┌─────────────────────────┐
                   │       User / Student    │
                   └────────────┬────────────┘
                                │
                                ▼
                   ┌─────────────────────────┐
                   │   Next.js Frontend      │
                   │ Dashboard and UI        │
                   └────────────┬────────────┘
                                │ REST API
                                ▼
                   ┌─────────────────────────┐
                   │ Node.js + Express       │
                   │ Authentication & APIs   │
                   └────────────┬────────────┘
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
          ┌────────────┐ ┌────────────┐ ┌────────────┐
          │ MongoDB    │ │ Groq LLM   │ │ Pinecone   │
          │ App Data   │ │ Generation │ │ Vector     │
          │            │ │            │ │ Retrieval  │
          └────────────┘ └────────────┘ └────────────┘
```

The architecture is illustrative. Pinecone and Groq participate in the same request only when the relevant RAG workflow is implemented and connected.

---

## 🔄 How RAG Works in Zentrix AI

1. **Document ingestion:** Extract text from a supported document, such as a resume or study material.
2. **Chunking:** Split the extracted text into smaller sections.
3. **Embedding generation:** Convert each section into a vector using an embedding model.
4. **Vector storage:** Store the vectors and relevant metadata in Pinecone.
5. **Semantic retrieval:** Search for sections relevant to the user's question.
6. **Context augmentation:** Add the retrieved sections to the prompt.
7. **LLM response:** Use the Groq API to generate a response grounded in the retrieved context.

The embedding model and the chat-generation model are separate components. Pinecone stores and searches vectors; it does not generate embeddings or produce natural-language answers by itself.

---

## 📁 Project Structure

The following is a representative structure for the frontend/backend architecture. Adjust it to match your repository.

```text
Zentrix-AI/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- MongoDB or a MongoDB Atlas connection
- A Groq API key for LLM functionality
- Pinecone credentials and an index, if using RAG

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Zentrix-AI.git
cd Zentrix-AI
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal from the project root:

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend/` directory.

Example configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
GROQ_API_KEY=your_groq_api_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

Add other variables only if required by your implementation, such as embedding-provider credentials or a frontend API base URL.

**Security:** Never commit real API keys, database credentials, JWT secrets, or `.env` files to GitHub. Keep `.env` in `.gitignore` and provide placeholders in `.env.example`.

### 5. Start the backend

```bash
cd backend
npm run dev
```

If your backend does not define a `dev` script, check `backend/package.json` and use its configured start command, such as:

```bash
npm start
```

### 6. Start the frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

Open the local URL printed by the frontend terminal, commonly `http://localhost:3000`.

If that port is already in use, Next.js may select another port.

---
---

## 🧪 Testing

Before deployment, verify the following:

- [ ] Registration and login work correctly.
- [ ] Protected endpoints reject unauthenticated requests.
- [ ] AI responses work with valid API credentials.
- [ ] Chat history persists as expected.
- [ ] Resume uploads handle invalid files and extraction errors.
- [ ] Pinecone ingestion and retrieval return relevant results, if enabled.
- [ ] Users can access only their own protected data.
- [ ] Frontend and backend handle API failures gracefully.
- [ ] No secrets are committed to the repository.

---

## 🔒 Security Considerations

- Store secrets in environment variables.
- Hash passwords instead of storing plain-text passwords.
- Validate request payloads and uploaded files.
- Protect user-specific resources with authentication and authorization checks.
- Apply rate limits to expensive AI endpoints.
- Avoid logging API keys, passwords, tokens, or sensitive resume contents.
- Keep dependencies updated and configure appropriate CORS policies.
- Restrict document retrieval by user or tenant to prevent cross-user data exposure.

---

## 🚀 Future Enhancements

Potential extensions include:

- Advanced multi-agent career workflows.
- Persistent conversational memory.
- Voice-enabled mock interviews.
- Automated job matching and application tracking.
- More detailed coding-performance analytics.
- AI-generated interview reports.
- Background processing for document ingestion.
- Evaluation pipelines for response quality and retrieval relevance.
- Production monitoring and observability.

These items should be marked as completed only after implementation and testing.

---

## 💡 Why Zentrix AI?

Traditional placement preparation often requires switching between multiple tools for resumes, coding practice, interview preparation, roadmaps, and progress tracking.

Zentrix AI aims to bring these workflows together in one personalized platform, using AI to turn career goals into actionable preparation steps.

**Vision:** Help students prepare smarter, understand their skill gaps, and approach placement interviews with greater confidence.

---

## 👩‍💻 Author

**Nivedita Rai**

- GitHub: https://github.com/Niveditarai

**Built with ❤️ to make career preparation more personalized, structured, and intelligent.**
