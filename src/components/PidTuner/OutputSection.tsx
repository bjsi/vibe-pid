import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Copy, History } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { marked } from "marked";

interface OutputSectionProps {
  suggestion: string | null;
  previousSuggestions: string[];
  onProceed: () => void;
}

const OutputSection = ({ suggestion, previousSuggestions, onProceed }: OutputSectionProps) => {
  const [showHistory, setShowHistory] = useState(false);
  
  const handleCopy = () => {
    if (suggestion) {
      navigator.clipboard.writeText(suggestion);
      toast.success("Copied to clipboard!");
    }
  };
  
  if (!suggestion) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          No suggestions yet. Please go back to the Input tab and describe what you want to tune.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">PID Parameter Suggestions</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4 mr-2" />
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Here are the suggested PID parameters based on your description.
        </p>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: marked(suggestion) }}
          />
        </CardContent>
      </Card>
      
      {showHistory && previousSuggestions.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Previous Suggestions</h4>
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {previousSuggestions.slice(0, -1).map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Suggestion {index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => {
                      navigator.clipboard.writeText(item);
                      toast.success("Copied to clipboard!");
                    }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: marked(item) }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <Separator className="my-6" />
      
      <div className="space-y-2">
        <p className="text-sm">
          Now you can copy these values, test them in your system, and then proceed to enter the 
          resulting data for visualization and further tuning.
        </p>
        <div className="flex justify-end">
          <Button onClick={onProceed} className="bg-pid-teal hover:bg-teal-700">
            Enter Test Data
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OutputSection;
