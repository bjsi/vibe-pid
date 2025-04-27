import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";
import DataInputSection from "./DataInputSection";
import DataVisualization from "./DataVisualization";
import SettingsModal from "./SettingsModal";
import { toast } from "sonner";

export interface PidData {
  ms: number;
  input: number;
  output: number;
  setpoint: number;
  error: number;
  Kp: number;
  Ki: number;
  Kd: number;
}

const PidTuner = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string>("");
  const [parsedData, setParsedData] = useState<PidData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("input");
  const [previousSuggestions, setPreviousSuggestions] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState<string>("");
  
  const handleGetSuggestion = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what you want to tune");
      return;
    }

    if (!apiKey) {
      toast.error("Please set your OpenAI API key in settings");
      return;
    }
    
    setLoading(true);
    try {
      // Mock API call for now - in a real implementation we would connect to an AI API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration, generate a mock suggestion
      const mockSuggestion = `Based on your description, I suggest starting with these PID parameters:
      
Kp = 2.5
Ki = 0.06
Kd = 8.0

Try these values first and then share the resulting data so I can help refine them further.`;
      
      setSuggestion(mockSuggestion);
      setPreviousSuggestions(prev => [...prev, mockSuggestion]);
      toast.success("Received PID parameter suggestions!");
      setActiveTab("output");
    } catch (error) {
      toast.error("Failed to get suggestions. Please check your API key and try again.");
      console.error("Error getting suggestion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataInput = (data: string) => {
    setCsvData(data);
    
    try {
      const lines = data.trim().split('\n');
      
      // Skip header if present
      const startIndex = lines[0].startsWith('ms,') ? 1 : 0;
      
      const parsedRows: PidData[] = [];
      
      for (let i = startIndex; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 8) {
          parsedRows.push({
            ms: parseFloat(values[0]),
            input: parseFloat(values[1]),
            output: parseFloat(values[2]),
            setpoint: parseFloat(values[3]),
            error: parseFloat(values[4]),
            Kp: parseFloat(values[5]),
            Ki: parseFloat(values[6]),
            Kd: parseFloat(values[7]),
          });
        }
      }
      
      setParsedData(parsedRows);
      if (parsedRows.length > 0) {
        toast.success(`Successfully parsed ${parsedRows.length} data points`);
        setActiveTab("visualization");
      } else {
        toast.error("No valid data rows found. Please check your CSV format.");
      }
    } catch (error) {
      toast.error("Failed to parse CSV data. Please check the format.");
      console.error("Error parsing CSV:", error);
    }
  };

  const handleNewIteration = async () => {
    if (parsedData.length === 0) {
      toast.error("Please input data before requesting a new suggestion");
      return;
    }
    
    setLoading(true);
    
    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration, generate a new mock suggestion based on "data"
      const mockNewSuggestion = `Based on the data you provided, I recommend adjusting your PID parameters to:
      
Kp = 2.2
Ki = 0.08
Kd = 7.5

I've reduced Kp slightly to decrease overshoot and increased Ki to improve steady-state response.`;
      
      setSuggestion(mockNewSuggestion);
      setPreviousSuggestions(prev => [...prev, mockNewSuggestion]);
      toast.success("Received new PID parameter suggestions!");
      setActiveTab("output");
    } catch (error) {
      toast.error("Failed to get new suggestions. Please try again.");
      console.error("Error getting new suggestion:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>PID Controller Tuning Assistant</CardTitle>
          <SettingsModal onApiKeyChange={setApiKey} />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="input">1. Input</TabsTrigger>
              <TabsTrigger value="output">2. Suggestions</TabsTrigger>
              <TabsTrigger value="data">3. Data Input</TabsTrigger>
              <TabsTrigger value="visualization">4. Visualization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="input">
              <InputSection 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onGetSuggestion={handleGetSuggestion}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="output">
              <OutputSection 
                suggestion={suggestion} 
                previousSuggestions={previousSuggestions}
                onProceed={() => setActiveTab("data")}
              />
            </TabsContent>
            
            <TabsContent value="data">
              <DataInputSection 
                csvData={csvData} 
                onDataInput={handleDataInput}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="visualization">
              <DataVisualization 
                data={parsedData} 
                onNewIteration={handleNewIteration}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PidTuner;
