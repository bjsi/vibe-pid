import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";
import DataInputSection from "./DataInputSection";
import DataVisualization from "./DataVisualization";
import SettingsModal from "./SettingsModal";
import { toast } from "sonner";
import { createOpenAIClient, generateInitialPIDParams, generateUpdatedPIDParams } from "@/lib/openai";
import type OpenAI from "openai";
import html2canvas from "html2canvas";

export interface PidData {
  ms: number;
  input: number;
  output: number;
  setpoint: number;
  Kp: number;
  Ki: number;
  Kd: number;
}

interface InitialPidParams {
  Kp: number;
  Ki: number;
  Kd: number;
}

interface PidValues {
  kp: string;
  ki: string;
  kd: string;
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
  const [model, setModel] = useState<string>("gpt-4-vision-preview");
  const [openai, setOpenai] = useState<OpenAI | null>(null);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [initialParams, setInitialParams] = useState<InitialPidParams | null>(null);
  const [pidValues, setPidValues] = useState<PidValues>({
    kp: '',
    ki: '',
    kd: ''
  });

  const hasValidPidValues = () => {
    return pidValues.kp !== '' && pidValues.ki !== '' && pidValues.kd !== '';
  };

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      const client = createOpenAIClient(savedKey);
      setOpenai(client);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      const client = createOpenAIClient(apiKey);
      setOpenai(client);
    } else {
      setOpenai(null);
    }
  }, [apiKey]);

  const handleGetSuggestion = async () => {
    if (!apiKey) {
      toast.error("Please set your OpenAI API key in settings");
      return;
    }

    if (!initialParams && !prompt.trim()) {
      toast.error("Please either describe what you want to tune or provide existing PID parameters");
      return;
    }
    
    if (initialParams) {
      toast.success("Using provided PID parameters");
      setActiveTab("data");
      return;
    }

    setLoading(true);
    try {
      const client = createOpenAIClient(apiKey);
      setOpenai(client);
      
      const enhancedPrompt = hasValidPidValues() 
        ? `Initial PID values provided by the user: Kp=${pidValues.kp}, Ki=${pidValues.ki}, Kd=${pidValues.kd}\n\n${prompt}`
        : prompt;
      
      const suggestion = await generateInitialPIDParams(
        client,
        model,
        enhancedPrompt,
        attachedImages
      );
      
      setSuggestion(suggestion);
      setPreviousSuggestions(prev => [...prev, suggestion]);
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
            Kp: parseFloat(values[4]),
            Ki: parseFloat(values[5]),
            Kd: parseFloat(values[6]),
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

    if (!apiKey || !openai) {
      toast.error("Please set your OpenAI API key in settings");
      return;
    }
    
    setLoading(true);
    
    try {
      const latestParams = parsedData[parsedData.length - 1];
      
      const graphElement = document.querySelector('.recharts-wrapper') as HTMLDivElement;
      if (!graphElement) {
        toast.error("Could not capture graph image");
        return;
      }

      const canvas = await html2canvas(graphElement);
      const graphImage = canvas.toDataURL('image/png');
      
      if (!graphImage || graphImage === 'data:,') {
        toast.error("Failed to capture graph image");
        return;
      }
      
      const suggestion = await generateUpdatedPIDParams(
        openai,
        model,
        previousSuggestions,
        {
          Kp: latestParams.Kp,
          Ki: latestParams.Ki,
          Kd: latestParams.Kd
        },
        graphImage
      );
      
      setSuggestion(suggestion);
      setPreviousSuggestions(prev => [...prev, suggestion]);
      toast.success("Received new PID parameter suggestions!");
      setActiveTab("output");
    } catch (error) {
      console.error("Error getting new suggestion:", error);
      toast.error("Failed to get new suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>PID <span className="line-through">Tuner</span> Viber</CardTitle>
          <SettingsModal 
            onApiKeyChange={setApiKey} 
            onModelChange={setModel}
          />
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
                attachedImages={attachedImages}
                setAttachedImages={setAttachedImages}
                setActiveTab={setActiveTab}
                pidValues={pidValues}
                setPidValues={setPidValues}
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
