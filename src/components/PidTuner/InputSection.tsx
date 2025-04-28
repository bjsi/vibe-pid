import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setAttachedImages(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  const removeImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Describe Your PID Tuning Task</h3>
        <p className="text-sm text-gray-500">
          Tell us about what you're trying to control (e.g., temperature, motor position),
          the system characteristics, and any specific requirements.
        </p>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Pro tip: You can paste images (screenshots, graphs, etc.) directly into the text box below by using Ctrl+V or Cmd+V.
          </AlertDescription>
        </Alert>
      </div>
      
      {attachedImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachedImages.map((image, index) => (
            <div key={index} className="relative group">
              <button
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 z-10 rounded-full bg-background/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity border shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
              <img
                src={image}
                alt={`Attached content ${index + 1}`}
                className="h-20 w-20 object-cover rounded-lg border"
              />
            </div>
          ))}
        </div>
      )}
      
      <Textarea
        placeholder="Example: I need to tune a PID controller for a heating element that controls the temperature of a 3D printer hotend. The temperature range is 180-260°C, and I need minimal overshoot with fast response time."
        className="min-h-[200px]"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onPaste={handlePaste}
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
