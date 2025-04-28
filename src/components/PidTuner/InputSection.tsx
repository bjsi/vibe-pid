import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PidValues {
  kp: string;
  ki: string;
  kd: string;
}

interface InputSectionProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGetSuggestion: () => void;
  loading: boolean;
  attachedImages: string[];
  setAttachedImages: Dispatch<SetStateAction<string[]>>;
  setActiveTab: (tab: string) => void;
  pidValues: PidValues;
  setPidValues: Dispatch<SetStateAction<PidValues>>;
}

const InputSection = ({ 
  prompt, 
  setPrompt, 
  onGetSuggestion,
  loading,
  attachedImages,
  setAttachedImages,
  setActiveTab,
  pidValues,
  setPidValues
}: InputSectionProps) => {
  const [useExistingParams, setUseExistingParams] = useState(false);

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

  const handlePidChange = (field: keyof PidValues, value: string) => {
    setPidValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasValidPidValues = () => {
    return pidValues.kp !== '' && pidValues.ki !== '' && pidValues.kd !== '';
  };

  const handleButtonClick = () => {
    if (useExistingParams) {
      setActiveTab("data");
    } else {
      onGetSuggestion();
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Describe Your PID Tuning Requirements</h3>
      </div>
      
      <div className="space-y-4 border rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="useExisting" 
            checked={useExistingParams}
            onCheckedChange={(checked) => setUseExistingParams(checked as boolean)}
          />
          <Label htmlFor="useExisting">I already have PID parameters to optimize</Label>
        </div>
        
        {useExistingParams && (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kp">Kp Value</Label>
              <Input 
                id="kp" 
                type="number" 
                placeholder="0.0" 
                value={pidValues.kp}
                onChange={(e) => handlePidChange('kp', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ki">Ki Value</Label>
              <Input 
                id="ki" 
                type="number" 
                placeholder="0.0" 
                value={pidValues.ki}
                onChange={(e) => handlePidChange('ki', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kd">Kd Value</Label>
              <Input 
                id="kd" 
                type="number" 
                placeholder="0.0" 
                value={pidValues.kd}
                onChange={(e) => handlePidChange('kd', e.target.value)}
              />
            </div>
          </div>
        )}
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
        placeholder="Describe your system and tuning goals. Example: I need to tune a PID controller for a heating element that controls the temperature of a 3D printer hotend."
        className="min-h-[200px]"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onPaste={handlePaste}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleButtonClick} 
          disabled={loading || (useExistingParams && !hasValidPidValues())} 
          className="bg-pid-blue hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Suggestions...
            </>
          ) : (
            <>
              {useExistingParams ? "Proceed to Data Input" : "Get PID Parameter Suggestions"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default InputSection;
