export default function Experience() {
    return (
        <div className='w-full flex flex-col gap-2'>
            <h1 className='text-4xl font-bold text-violet-500 mb-3 md:text-start text-center'>Experience</h1>
            {/* Experience */}
            {/* Work Container */}
            <div className='relative flex gap-8'>
                {/* Line */}
                <div className='h-full border-l-2 border-slate-500'></div>
                <div className='flex flex-col gap-5'>
                    {/* Company Details */}
                    <div className='text-slate-400 flex items-center gap-4'>
                        <img className="rounded-full w-[80px] shadow-sm shadow-white" src="https://suvidhaen.com/static/media/logo.eb453fad0f3a5051f49f.png" alt="Sarva Suvidhayen" />
                        <div className='flex flex-col'>
                            <h1 className='text-xl font-bold text-white'>Sarva Suvidhayen Pvt. Ltd.</h1>
                            <h3 className='text-[18px]'>Full Stack Developer</h3>
                            <h4 className='text-base'>June 2024 - Present</h4>
                        </div>
                    </div>
                    {/* Works */}
                    <ul className='list-disc list-outside text-slate-300 pl-3 '>
                        <li className='mb-2 '>Worked on multiple railways projects.</li>
                        <li className='mb-2'>Contributed to the development of Full Stack Web and App from scratch.</li>
                        <li>Currently working closely with cross-functional teams in Agile environments, adapting to project challenges and ensuring the timely delivery of high-quality software solutions.</li>
                    </ul>
                    <div>{["ReactJs", "ExpressJs", "NodeJs", "TailwindCSS", "JavaScript", "Python", "Djnago", "Automation", "Flutter"].map((lang) => {
                        return <span key={lang} className='inline-block bg-green-500 bg-opacity-30 px-3 py-1.5 text-xs font-medium text-green-500 mb-2 mr-2 rounded-full'>{lang}</span>
                    })}</div>
                </div>
            </div>
        </div>
    );
}
