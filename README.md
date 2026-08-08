# 🚀 SkillMatch

> Connect. Collaborate. Create.

SkillMatch is a full-stack web platform that helps students find like-minded teammates, connect with people who have complementary skills, collaborate on projects, and get personalized guidance from an AI mentor.

---

## ✨ Features

- 👤 User signup and login
- 📝 Create and update student profiles
- 🔎 Discover students based on skills and interests
- 🤝 Send connection requests
- ✅ Accept or reject connection requests
- ⭐ View accepted connections
- 💬 One-to-one chat between connections
- 🤖 AI-powered project recommendations
- 🧠 AI-powered career and skill guidance
- 🎨 Modern dark glassmorphism UI
- 📱 Responsive design

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- bcrypt
- JWT

### AI
- Google Gemini API
- @google/genai

### Tools
- VS Code
- Git
- GitHub
- Postman

---

## 📂 Project Structure

```text
SkillMatch/
│
├── frontend/
│   ├── landing.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── matches.html
│   ├── requests.html
│   ├── connections.html
│   ├── chat.html
│   ├── ai.html
│   │
│   ├── css/
│   └── js/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js 
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md

🤖 AI Mentor

SkillMatch integrates Google Gemini to provide personalized assistance based on the user's profile.

Users can ask the AI to:

Recommend project ideas
Suggest skills to learn
Give career guidance
Suggest technologies
Help plan projects
Recommend complementary skills for teamwork

Example:

"Suggest projects based on my current skills."

The AI uses the user's profile information to provide personalized recommendations.

🔐 Security
Passwords are hashed using bcrypt.
JWT is used for authentication.
Sensitive credentials are stored in environment variables.
.env and node_modules are excluded from Git.
🔮 Future Improvements
🔔 Real-time message notifications
⚡ Real-time chat using Socket.IO
🧠 Advanced AI recommendations
👥 AI-powered team formation
🔍 Advanced search and filtering
☁️ Cloud deployment
📱 Improved mobile experience
👩‍💻 Author
Rishika Diwan

B.Tech CSE — Data Science

Built with 💗 and lots of debugging.
