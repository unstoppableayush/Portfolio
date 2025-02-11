import React from 'react'

export default function Skills() {
    const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "C", "Dart"]
    const frameworks = ["ReactJs", "NextJs", "ExpressJs", "TailwindCSS", "Bootstrap", "Flutter"]
    const backend = ["Django", "NodeJs", "REST APIs", "CRUD operations", "Socket.IO"]
    const database = ["MongoDB", "SQL", "Postgress", "Prisma"]
    const tools = ["Git", "GitHub", "Visual Studio Code", "Postman", "Docker" , "Linux" , "AWS"]

    return (
        <div className='w-full text-center md:text-start flex flex-col gap-2'>
            <h1 className='text-4xl font-bold text-violet-500 mb-3'>Skills</h1>
            {/* Languages */}
            <div>
                <h2 className='text-xl font-semibold mb-2'>Languages</h2>
                {languages.map((lang) => {
                    return <span key={languages} className='inline-block bg-blue-500 bg-opacity-30 px-3 py-1.5 text-xs font-medium text-blue-500 mr-2 mb-2 rounded-full'>{lang}</span>
                })}
            </div>
            {/* Frameworks */}
            <div>
                <h2 className='text-xl font-semibold mb-2'>Frameworks</h2>
                {frameworks.map((lang) => {
                    return <span key={lang} className='inline-block bg-green-500 bg-opacity-30 px-3 py-1.5 text-xs font-medium text-green-500 mr-2 mb-2 rounded-full'>{lang}</span>
                })}
            </div>
            {/* Backend */}
            <div>
                <h2 className='text-xl font-semibold mb-2'>Backend</h2>
                {backend.map((lang) => {
                    return <span key={lang} className="inline-block bg-purple-500 bg-opacity-30 px-3 py-1.5 text-xs font-medium text-purple-500 mr-2 mb-2 rounded-full">{lang}</span>
                })}
            </div>
            {/* Database */}
            <div>
                <h2 className='text-xl font-semibold mb-2'>Database</h2>
                {database.map((lang) => {
                    return <span key={lang} className="inline-block bg-red-500 bg-opacity-30 px-3 py-1.5 text-xs font-medium text-red-500 mr-2 mb-2 rounded-full">{lang}</span>
                })}
            </div>
            {/* Tools */}
            <div >
                <h2 className='text-xl font-semibold mb-2'>Tools</h2>
                {tools.map((lang) => {
                    return <span key={lang} className="inline-block bg-yellow-500 bg-opacity-30 px-3 py-1.5 text-xs font-medium text-yellow-500 mr-2 mb-2 rounded-full">{lang}</span>
                })}
            </div>
        </div>
    )
}
