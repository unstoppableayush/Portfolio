import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Education from "./Education";
import Projects from "./Projects";

export default function RightSide() {
  return (
    <div className="flex w-full flex-col gap-16 md:w-full">
      <div id="about" className="scroll-mt-24">
        <About />
      </div>
      <div id="skills" className="scroll-mt-24">
        <Skills />
      </div>
      <div id="experience" className="scroll-mt-24">
        <Experience />
      </div>
      <div id="education" className="scroll-mt-24">
        <Education />
      </div>
      <div id="projects" className="scroll-mt-24">
        <Projects />
      </div>
    </div>
  );
}
