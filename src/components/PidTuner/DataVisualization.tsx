import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, Copy } from "lucide-react";
import { PidData } from "./PidTuner";
import { toast } from "sonner";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";

interface DataVisualizationProps {
  data: PidData[];
  onNewIteration: () => void;
  loading: boolean;
}

const DataVisualization = ({ data, onNewIteration, loading }: DataVisualizationProps) => {
  const [visualization, setVisualization] = useState<"response" | "variables">("response");
  const chartRef = useRef<HTMLDivElement>(null);
  
  const handleCopyGraph = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        const dataUrl = canvas.toDataURL();
        const blob = await (await fetch(dataUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        toast.success("Graph copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy graph");
      }
    }
  };

  const handleCopyContext = () => {
    const context = {
      data,
      currentView: visualization,
      latestValues: data[data.length - 1],
      timestamp: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(context, null, 2));
    toast.success("Context data copied to clipboard");
  };
  
  if (data.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          No data available for visualization. Please go back to the Data Input tab and enter your CSV data.
        </p>
      </div>
    );
  }
  
  const latestValues = data[data.length - 1];
  
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">PID Response Visualization</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyGraph}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Graph
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyContext}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Context
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Visualizing {data.length} data points from your test run.
          </p>
          <div className="flex gap-2">
            <Button 
              variant={visualization === "response" ? "default" : "outline"} 
              size="sm"
              onClick={() => setVisualization("response")}
              className={visualization === "response" ? "bg-pid-blue hover:bg-blue-700" : ""}
            >
              System Response
            </Button>
            <Button 
              variant={visualization === "variables" ? "default" : "outline"} 
              size="sm"
              onClick={() => setVisualization("variables")}
              className={visualization === "variables" ? "bg-pid-blue hover:bg-blue-700" : ""}
            >
              PID Variables
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="h-[400px] w-full" ref={chartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="ms" 
                  label={{ value: 'Time (ms)', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis />
                <Tooltip />
                <Legend />
                
                {visualization === "response" ? (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="setpoint" 
                      stroke="#0d9488" 
                      dot={false} 
                      strokeWidth={2} 
                      name="Setpoint" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="input" 
                      stroke="#ef4444" 
                      dot={false} 
                      strokeWidth={2}
                      name="Input"
                    />
                  </>
                ) : (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="Kp" 
                      stroke="#2563eb" 
                      strokeWidth={2} 
                      name="Kp" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Ki" 
                      stroke="#22c55e" 
                      strokeWidth={2} 
                      name="Ki" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Kd" 
                      stroke="#ec4899" 
                      strokeWidth={2} 
                      name="Kd" 
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-500">Kp Value</h4>
            <p className="text-2xl font-bold text-pid-blue">{latestValues.Kp.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-500">Ki Value</h4>
            <p className="text-2xl font-bold text-pid-green">{latestValues.Ki.toFixed(4)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-500">Kd Value</h4>
            <p className="text-2xl font-bold text-pid-teal">{latestValues.Kd.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onNewIteration} 
          disabled={loading}
          className="bg-pid-teal hover:bg-teal-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Get Improved PID Parameters
              <RefreshCw className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DataVisualization;
