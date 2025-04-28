
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface InputSectionProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGetSuggestion: () => void;
  loading: boolean;
  attachedImages: string[];
  setAttachedImages: Dispatch<SetStateAction<string[]>>;
}

const InputSection = ({ 
  prompt, 
  setPrompt, 
  onGetSuggestion, 
  loading,
  attachedImages,
  setAttachedImages
}: InputSectionProps) => {
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64Image = e.target?.result as string;
            setAttachedImages(prev => [...prev, base64Image]);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Describe Your PID Tuning Requirements</h3>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You can either describe your system to get initial PID parameters, or input your existing parameters below to skip straight to optimization. You can also paste images of your system's current behavior or setup.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="space-y-4 border rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="useExisting" />
          <Label htmlFor="useExisting">I already have PID parameters to optimize</Label>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="kp">Kp Value</Label>
            <Input id="kp" type="number" placeholder="0.0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ki">Ki Value</Label>
            <Input id="ki" type="number" placeholder="0.0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kd">Kd Value</Label>
            <Input id="kd" type="number" placeholder="0.0" />
          </div>
        </div>
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
        placeholder="If you're starting fresh: describe your system and tuning goals. Example: I need to tune a PID controller for a heating element that controls the temperature of a 3D printer hotend."
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
              {prompt.trim() ? "Get PID Parameter Suggestions" : "Proceed to Data Input"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default InputSection;
