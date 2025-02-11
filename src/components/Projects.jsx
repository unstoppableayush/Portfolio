import React, { useEffect, useState } from 'react'
import { FaGithub } from "react-icons/fa";
import { BsBoxArrowUpRight } from "react-icons/bs";
import projectData from './projectData';
export default function Projects() {
    const [showMore, setShowMore] = useState(false)
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
        <div className='w-full flex flex-col gap-2'>
            <h1 className='text-4xl font-bold text-violet-500 mb-3 md:text-start text-center'>Projects</h1>
            {/* Projects */}
            {/* Work Container */}
            {
                projectData.map((project) => {
                    return <div key={project.id} className='relative flex gap-8 mb-5'>
                        {/* Line */}
                        <div className='h-full border-l-2 border-slate-500'></div>
                        <div className='flex flex-col gap-5'>
                            {/* project Details */}
                            <div className='text-slate-400 relative flex flex-col items-start gap-4 mb-'>
                                <h1 className='text-xl text-white font-bold'>{project.name}</h1>
                                {/* links */}
                                <div className='flex gap-5'>
                                    <a className='flex items-center text-gray-300 hover:text-white transition-colors duration-300' href={project.github} target='_blank'><FaGithub /> <span className='ml-2'>View Code</span></a>
                                    <a className='flex items-center text-gray-300 hover:text-white transition-colors duration-300' href={project.live} target='_blank'><BsBoxArrowUpRight /> <span className='ml-2'>Live Demo</span></a>
                                </div>
                                <div className='relative group'>
                                    <div className='transition-all duration-200 bottom-0 left-0 px-4  text-white w-full overflow-y-scroll bg-black  rounded-md hide-scrollbar'> {/* Works */}
                                        <ul className='list-disc list-outside  pl-3'>
                                            {
                                                project.points.map((list, i) => {
                                                    return <li key={i} className='mb-2 '>{list}</li>
                                                })
                                            }
                                        </ul>
                                        {/* technologies used */}
                                        <div>{project.technologies.map((tech) => {
                                            return <span key={tech} className="inline-block bg-blue-500 bg-opacity-30 px-3 py-1.5 text-xs font-medium text-blue-500 mr-2 mb-2 rounded-full">{tech}</span>
                                        })}</div></div>

                                    {/* <img className="rounded-md h-[300px] shadow-sm shadow-white" src={project.poster} alt={project.name} /> */}
                                </div>


                            </div>

                        </div>
                    </div>
                })
            }
            {/* <button onClick={() => {
                setShowMore(!showMore)
            }} className='text-black -mt-3 mb-5 mx-auto bg-violet-600 hover:bg-violet-800 transition-all duration-200 px-2 py-1 text-xs w-fit rounded-full'>{showMore ? "Show Less" : "Show More"}</button> */}
        </div>
    )
}
