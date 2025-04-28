import { Sliders, Github } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-8 h-8 text-pid-blue" />
          <h1 className="text-2xl font-bold text-gray-800">
            Vibe PID
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            A PID Tuner for the 21st Century
          </span>
          <a 
            href="https://github.com/bjsi/vibe-pid" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
