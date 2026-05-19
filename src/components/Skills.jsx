
export default function Skills() {
    const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "C", "Dart"]
    const frameworks = ["ReactJs", "NextJs", "ExpressJs", "TailwindCSS", "Bootstrap", "Flutter"]
    const backend = ["Django", "NodeJs", "REST APIs", "CRUD operations", "Socket.IO"]
    const database = ["MongoDB", "SQL", "Postgress", "Prisma"]
    const tools = ["Git", "GitHub", "Visual Studio Code", "Postman", "Docker", "Linux", "AWS"]

    const sections = [
        { title: "Languages", items: languages },
        { title: "Frameworks", items: frameworks },
        { title: "Backend", items: backend },
        { title: "Database", items: database },
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
