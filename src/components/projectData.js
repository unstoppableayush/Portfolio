const projectData = [
  {
    id: 0,
    name: "Speaking App - AI-Powered",
    poster: "", // Add poster image URL here
    points: [
      "Developed an AI-powered English speaking practice app with real-time voice sessions, multi-provider LLM fallback, and Deepgram speech-to-text streaming.",
      "Built a speech scoring engine with AI feedback, leaderboard, and weakness analysis.",
      "Secured the platform with JWT + RBAC and Redis Pub/Sub for scalable WebSocket communication.",
    ],
    technologies: [
      "ReactJs",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "WebSocket",
      "Docker",
      "LLM",
    ],
    github: "https://github.com/unstoppableayush/Talk-In-English",
    live: "https://talk-in-english.vercel.app/",
  },
  {
    id: 2,
    name: "SmartPrep - E learning Platform",
    poster: "", // Add poster image URL here
    points: [
      `SmartPrep is a comprehensive platform built for engineering students to learn, share, and grow together as a community. It offers a responsive and interactive interface accessible across all devices, with separate dashboards for students and administrators.`,
      `Community-driven platform where students can upload and access PYQs, notes, and quizzes.`,
      `AI-powered quiz generation from PDFs or selected text.`,
      `One-click solutions for PYQs to support quick learning.`,
      `Collaborative chat feature to connect students and encourage knowledge sharing.`,
      `Admin panel for verifying, approving, or removing uploaded content and managing quizzes.`,
    ],
    technologies: ["React.js", "Node.js", "Gemini", "LangChain", "Cloudinary", "Google API", "Firebase", "Pinecone", "MongoDB"],
    github: "https://github.com/unstoppableayush/BiharEngineering-A-Platform", // Add GitHub URL here
    live: "https://bihar-engineering.vercel.app/", // Add live URL here
  },
  {
    id: 3,
    name: "RAG Chatbot",
    poster: "", // Add poster image URL here
    points: [
      `Built a RAG chatbot that answers queries using context from uploaded documents.`,
      `Implemented document processing and retrieval for relevant AI-generated responses.`,
      `Integrated large language model APIs for natural and context-aware replies.`,
      `Created a modular Python workflow for document ingestion, retrieval, and response generation.`,
      `Answer Operating system related questions based on provided PDF.`,
    ],
    technologies: ["Python", "Vector", "Faiss", "Grok", "Retrieval-Augmented Generation (RAG)"],
    github: "https://github.com/unstoppableayush/RAG-AI-Chatbot", // Add GitHub URL here
    live: "https://operating-system-ai-chatbot.streamlit.app/", // Add live URL here
  },
  {
    id: 4,
    name: "Event Management Web App (GAIS)",
    poster: "", // Add poster image URL here
    company: "Global Investors Forum",
    points: [
      `Developed an event management web application for Global Investors Forum.`,
      `Built responsive and interactive user interface for seamless event registration and management.`,
      `Implemented features for event tracking, attendee management, and real-time updates.`,
    ],
    technologies: ["React.js", "Node.js", "Tailwind CSS"],
    github: "https://github.com/globalinvestorsforum/GAIS", // Add GitHub URL here
    live: "https://www.global-investors-forum.com/", // Add live URL here
  },
  {
    id: 5,
    name: "MV Secure Solutions - Ecom Website",
    poster: "", // Add poster image URL here
    points: [
      `Developed an e-commerce website for MV Secure Solutions startup.`,
      `Integrated payment gateway using Razorpay for secure transactions.`,
      `Implemented PDF generation for invoices and receipts.`,
      `Created admin dashboard for managing products, orders, and customer data.`,
      `Deployed on Vercel for optimal performance and scalability.`,
    ],
    technologies: ["React.js", "Tailwind CSS", "Node.js", "Vercel", "Payment Gateways", "Razorpay", "PDF"],
    github: "", // Add GitHub URL here
    live: "https://www.powertechinsulation.in/", // Add live URL here
  },
  {
    id: 6,
    name: "Power Tech Insulation - Company Portfolio Website",
    poster: "", // Add poster image URL here
    points: [
      `Developed a professional company portfolio website for Power Tech Insulation.`,
      `Implemented smooth animations using Framer Motion for enhanced user experience.`,
      `Integrated Cloudinary for optimized image storage and delivery.`,
      `Built responsive design to ensure seamless experience across all devices.`,
    ],
    technologies: ["React.js", "Node.js", "Cloudinary", "Framer Motion"],
    github: "", // Add GitHub URL here
    live: "", // Add live URL here
  },
  {
    id: 1,
    name: "OJAS’X (Event Management Platform for College)",
    poster:
      "https://res.cloudinary.com/dfrcswf0n/image/upload/v1730803846/Screenshot_2024-11-05_162028_cw8xlo.png",
    points: [
      `Developed a full-stack event management platform with React, Node.js, Express, and MongoDB, serving 
            1000+ registered students and processing 700+ secure transactions through Razorpay.`,
      `Enhanced platform security with private routes and Redux for state management, enabling seamless 
            navigation and secure user interactions.`,
      `Designed invoice and event tracking features, reducing administrative workload by 30% and allowing users 
            to track registrations and download invoices directly. `,
    ],
    technologies: ["ReactJs", "ExpressJS", "NodeJS", "TailwindCSS", "MongoDB"],
    github: "https://github.com/unstoppableayush/ojasx",
    live: "https://ojasxislive.vercel.app/",
  },
];
export default projectData;
