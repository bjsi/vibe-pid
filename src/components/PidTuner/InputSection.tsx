
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";

interface InputSectionProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGetSuggestion: () => void;
  loading: boolean;
}

const InputSection = ({ 
  prompt, 
  setPrompt, 
  onGetSuggestion,
  loading 
}: InputSectionProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Describe Your PID Tuning Task</h3>
        <p className="text-sm text-gray-500">
          Tell us about what you're trying to control (e.g., temperature, motor position),
          the system characteristics, and any specific requirements.
        </p>
      </div>
      
      <Textarea
        placeholder="Example: I need to tune a PID controller for a heating element that controls the temperature of a 3D printer hotend. The temperature range is 180-260°C, and I need minimal overshoot with fast response time."
        className="min-h-[200px]"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      
      <div className="flex justify-end">
        <Button onClick={onGetSuggestion} disabled={loading} className="bg-pid-blue hover:bg-blue-700">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Suggestions...
            </>
          ) : (
            <>
              Get PID Parameter Suggestions
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default InputSection;
