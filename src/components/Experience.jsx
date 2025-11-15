import experienceData from './experienceData';

export default function Experience() {
    return (
        <div className='w-full flex flex-col gap-5'>
            <h1 className='text-4xl font-bold text-violet-500 mb-3 md:text-start text-center'>Experience</h1>
            {/* Experience */}
            {experienceData.map((experience) => (
                experience.positions.map((position, posIndex) => (
                    <div key={`${experience.id}-${posIndex}`} className='relative flex gap-8'>
                        {/* Line */}
                        <div className='h-full border-l-2 border-slate-500'></div>
                        <div className='flex flex-col gap-5'>
                            {/* Company Details */}
                            <div className='text-slate-400 flex items-center gap-4'>
                                <img className="rounded-full w-[80px] shadow-sm shadow-white" src={experience.logo} alt={experience.company} />
                                <div className='flex flex-col'>
                                    <h1 className='text-xl font-bold text-white'>{experience.company}</h1>
                                    <h3 className='text-[18px]'>{position.title}</h3>
                                    <h4 className='text-base'>{position.duration}</h4>
                                </div>
                            </div>
                            {/* Works */}
                            <ul className='list-disc list-outside text-slate-300 pl-3 '>
                                {position.responsibilities.map((responsibility, idx) => (
                                    <li key={idx} className='mb-2'>{responsibility}</li>
                                ))}
                            </ul>
                            <div>
                                {position.skills.map((skill) => (
                                    <span key={skill} className='inline-block bg-green-500 bg-opacity-30 px-3 py-1.5 text-xs font-medium text-green-500 mb-2 mr-2 rounded-full'>{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            ))}
        </div>
    );
}
