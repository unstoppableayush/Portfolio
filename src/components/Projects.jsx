import { FaGithub } from "react-icons/fa";
import { BsBoxArrowUpRight } from "react-icons/bs";
import projectData from "./projectData";

export default function Projects() {
    // const [projectDataToShow, setProjectDataToShow] = useState([])
    // useEffect(() => {
    //     if (!showMore) {
    //         setProjectDataToShow(projectData.slice(0, 3));
    //     }
    //     else {
    //         setProjectDataToShow(projectData)
    //     }
    // }, [showMore])

    return (
        <section className="w-full">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Work</p>
            <h2 className="mt-2 text-3xl font-display text-white">Projects</h2>
            <div className="mt-8 flex flex-col gap-6">
                {projectData.map((project) => (
                    <div key={project.id} className="flex gap-6">
                        <div className="h-full border-l border-white/20"></div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                                    <a
                                        className="flex items-center gap-2 transition hover:text-white"
                                        href={project.github}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <FaGithub />
                                        <span>View code</span>
                                    </a>
                                    <a
                                        className="flex items-center gap-2 transition hover:text-white"
                                        href={project.live}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <BsBoxArrowUpRight />
                                        <span>Live demo</span>
                                    </a>
                                </div>
                            </div>

                            <ul className="list-disc list-outside pl-5 text-sm text-white/70">
                                {project.points.map((list, i) => (
                                    <li key={i} className="mb-2">{list}</li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
