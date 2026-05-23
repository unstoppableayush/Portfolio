
export default function Skills() {
    const languages = ["Python", "JavaScript", "TypeScript", "Java", "C++", "C"]
    const frameworks = ["ReactJs", "NextJs", "ExpressJs", "TailwindCSS", "Flutter"]
    const backend = ["Django", "FastAPI", "NodeJs", "REST APIs", "Supabase", "Socket.IO"]
    const database = ["Postgress", "MongoDB", "SQLite", "Redis", "ChromaDB", "Pineocode"]
    const aiMl = ["LLMs", "RAG", "LangChain", "LangGraph", "MCP", "Crew AI", "Copilot Studio", "Vector Databases", "Prompt Engineering"]
    const tools = ["Git", "GitHub", "Visual Studio Code", "Postman", "Docker", "Linux", "AWS", "GCP", "Ngnix"]

    const sections = [
        { title: "Languages", items: languages },
        { title: "Frameworks", items: frameworks },
        { title: "Backend", items: backend },
        { title: "Database", items: database },
        { title: "AI/ML", items: aiMl },
        { title: "Tools", items: tools },
    ]

    return (
        <section className="w-full">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Stack</p>
            <h2 className="mt-2 text-3xl font-display text-white">Skills</h2>
            <div className="mt-6 grid gap-6">
                {sections.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-sm font-semibold text-white/80">
                            {section.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {section.items.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
