import "./App.css";
import Details from "./components/Details";
import RightSide from "./components/RightSide";
import GreetingAnimation from "./components/GreetingAnimation/GreetingAnimation";
function App() {

  return (
    <div className="bg-black md:h-screen overflow-hidden text-white w-full min-h-screen flex md:flex-row flex-col md:justify-center">
      <GreetingAnimation />
      {/* LeftSide */}
      <Details />
      {/* RightSide */}
      <RightSide />
    </div>
  );
}

export default App;
