
import { Sliders } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-8 h-8 text-pid-blue" />
          <h1 className="text-2xl font-bold text-gray-800">
            Vibe Your PID
          </h1>
        </div>
        <div>
          <span className="text-sm text-gray-600">
            PID Controller Tuning with GPT
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
