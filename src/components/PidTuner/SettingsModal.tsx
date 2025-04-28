import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface SettingsModalProps {
  onApiKeyChange: (key: string) => void;
  onModelChange: (model: string) => void;
}

const SettingsModal = ({ onApiKeyChange, onModelChange }: SettingsModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("o4-mini");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    const savedModel = localStorage.getItem("openai_model") || "o4-mini";
    if (savedKey) {
      setApiKey(savedKey);
      onApiKeyChange(savedKey);
    }
    setModel(savedModel);
    onModelChange(savedModel);
  }, [onApiKeyChange, onModelChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey);
      localStorage.setItem("openai_model", model);
      onApiKeyChange(apiKey);
      onModelChange(model);
      toast.success("Settings saved successfully");
      setOpen(false);
    } else {
      toast.error("Please enter an API key");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">OpenAI API Key</p>
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Model Name</p>
            <Input
              type="text"
              placeholder="o4-mini"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
