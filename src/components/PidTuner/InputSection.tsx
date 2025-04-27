
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2, ImageIcon } from "lucide-react";
import { useState } from "react";

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
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setAttachedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Describe Your PID Tuning Task</h3>
        <p className="text-sm text-gray-500">
          Tell us about what you're trying to control (e.g., temperature, motor position),
          the system characteristics, and any specific requirements.
        </p>
      </div>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Example: I need to tune a PID controller for a heating element that controls the temperature of a 3D printer hotend. The temperature range is 180-260°C, and I need minimal overshoot with fast response time."
          className="min-h-[200px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onPaste={handlePaste}
        />
        
        {attachedImage && (
          <div className="rounded-lg border bg-card p-2">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Attached Image</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setAttachedImage(null)}
              >
                Remove
              </Button>
            </div>
            <img
              src={attachedImage}
              alt="Attached content"
              className="max-h-[200px] w-full rounded-lg object-contain"
            />
          </div>
        )}
      </div>
      
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
