export default function Education() {
    return (
        <section className="w-full">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Academia</p>
            <h2 className="mt-2 text-3xl font-display text-white">Education</h2>
            {/* Education */}
            {/* Education Container B.tech */}
            <div className="mt-8 flex gap-6">
                {/* Line */}
                <div className="h-full border-l border-white/20"></div>

                {/* Education Details */}
                <div className="flex items-center gap-4 text-white/60">
                    {/* <img className="rounded-full w-[80px]" src="https://res.cloudinary.com/dfrcswf0n/image/upload/v1730802945/WhatsApp_Image_2024-11-05_at_16.04.31_304d3cb3_wliijk.jpg" alt="BPMCE" /> */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-white">B.Tech (C.S.E)</h3>
                        <p className="text-sm">B. P. Mandal college of engineering, Madhepura</p>
                        <p className="text-xs text-white/50">Aug 2022 - June 2025 | 8.48 CGPA</p>
                    </div>
                </div>
            </div>
            {/* Education Container Intermediate */}
            <div className="mt-8 flex gap-6">
                {/* Line */}
                <div className="h-full border-l border-white/20"></div>

                {/* Education Details */}
                <div className="flex items-center gap-4 text-white/60">
                    {/* <img className="rounded-full w-[80px]" src="https://res.cloudinary.com/dfrcswf0n/image/upload/v1730803500/WhatsApp_Image_2024-11-05_at_16.14.19_759661b7_nwsc51.jpg" alt="BPMCE" /> */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-white">Diploma (C.S.E)</h3>
                        <p className="text-sm">Government Polytechnic College, Gopalganj</p>
                        <p className="text-xs text-white/50">Sept 2019 - Aug 2022 | 8.79 CGPA</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
