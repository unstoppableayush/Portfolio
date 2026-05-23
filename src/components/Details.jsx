import { useState } from "react";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { FaFileDownload, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Connect from "./Connect";
import { useProfileSettings } from "../hooks/useProfileSettings";

export default function Details() {
    const [showConnect, setShowConnect] = useState(false);
    const { settings } = useProfileSettings();

    return (
        <div className="w-full md:sticky md:top-12 md:w-full">
            {showConnect && <Connect setShowConnect={setShowConnect} />}
            <div className="flex flex-col items-center gap-y-4 text-center md:items-start md:text-left">
                <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#f7b955] to-[#5ce1e6] opacity-70 blur" />
                    <img
                        className="relative h-44 w-44 rounded-full border border-white/10 object-cover"
                        src={settings.imageUrl}
                        alt="Ayush Image"
                    />
                </div>

                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                        Software/AI Engineer 
                    </p>
                    <h1 className="mt-3 text-4xl font-display text-white">Ayush Kumar</h1>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/60">
                    <IoLocationSharp className="text-[#f7b955]" />
                    <span>New Delhi, India</span>
                </div>

                <p className="max-w-sm text-sm leading-relaxed text-white/70">
                    I build calm, high-performance web experiences and scalable systems that
                    stay elegant under pressure.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                    <a
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
                        href={settings.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaFileDownload />
                        <span>Resume</span>
                    </a>
                    <ul className="flex items-center gap-4 text-xl text-white/50">
                        <li>
                            <a
                                className="transition hover:text-white"
                                href="https://github.com/unstoppableayush"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FaGithub />
                            </a>
                        </li>
                        <li>
                            <a
                                className="transition hover:text-white"
                                href="https://www.linkedin.com/in/unstoppableayush"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FaLinkedin />
                            </a>
                        </li>
                        <li>
                            <a
                                className="transition hover:text-white"
                                href="mailto:ayushkum884@gmail.com"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <MdEmail />
                            </a>
                        </li>
                        <li>
                            <a
                                className="transition hover:text-white"
                                href="https://www.instagram.com/unstoppable_ayush.dev"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FaInstagram />
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="mt-4 flex w-full flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-center md:text-left">
                    <h2 className="text-lg font-semibold text-white">
                        Want to work together?
                    </h2>
                    <p className="text-sm text-white/60">
                        Tell me about your product vision and I will bring it to life.
                    </p>
                    <Link
                        to="/start-project"
                        className="mx-auto w-fit rounded-full bg-[#f7b955] px-4 py-2 text-sm font-semibold text-[#1a1206] transition hover:bg-[#f4a93b] md:mx-0"
                    >
                        Start a project
                    </Link>
                </div>
            </div>
        </div>
    );
}
