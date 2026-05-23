import experienceData from './experienceData';

export default function Experience() {
    return (
        <section className="w-full">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Career</p>
            <h2 className="mt-2 text-3xl font-display text-white">Experience</h2>
            {/* Experience */}
            {experienceData.map((experience) => (
                experience.positions.map((position, posIndex) => (
                    <div key={`${experience.id}-${posIndex}`} className="mt-8 flex gap-6">
                        {/* Line */}
                        <div className="h-full border-l border-white/20"></div>
                        <div className="flex flex-col gap-5">
                            {/* Company Details */}
                            <div className="flex items-center gap-4 text-white/60">
                                <img className="h-16 w-16 rounded-full border border-white/10 bg-white/5 object-contain" src={experience.logo} alt={experience.company} />
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-semibold text-white">{position.title}</h3>
                                    <p className="text-sm">{experience.company}</p>
                                    <p className="text-xs text-white/50">{position.duration}</p>
                                </div>
                            </div>
                            {/* Works */}
                            <ul className="list-disc list-outside pl-5 text-sm text-white/70">
                                {position.responsibilities.map((responsibility, idx) => (
                                    <li key={idx} className="mb-2">{responsibility}</li>
                                ))}
                            </ul>
                            <div>
                                {position.skills.map((skill) => (
                                    <span key={skill} className="mr-2 mb-2 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            ))}
        </section>
    );
}
