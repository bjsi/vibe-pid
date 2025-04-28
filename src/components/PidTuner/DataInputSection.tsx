
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowRight, Loader2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DataInputSectionProps {
  csvData: string;
  onDataInput: (data: string) => void;
  loading: boolean;
}

const DataInputSection = ({ csvData, onDataInput, loading }: DataInputSectionProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Enter CSV Data</h3>
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Log data from your device in CSV format, then copy and paste it here. The data should include timestamps,
            input values, output values, setpoint, error, and PID parameters.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-gray-500">Format your CSV data as:</p>
        <pre className="p-2 bg-gray-50 rounded-md text-sm font-mono">
          ms,input,output,setpoint,error,Kp,Ki,Kd
        </pre>
      </div>

      <Alert variant="default" className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Important</AlertTitle>
        <AlertDescription className="text-amber-700">
          Make sure your data includes all the columns in the correct order. The data will be used to visualize
          the performance and generate improved PID parameters.
        </AlertDescription>
      </Alert>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          When requesting updated PID parameters, we'll include:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>A screenshot of your system response graph</li>
            <li>Your raw CSV data for detailed analysis</li>
            <li>Current PID parameters (Kp, Ki, Kd)</li>
            <li>Previous suggestions and their outcomes</li>
          </ul>
          This context helps in providing more accurate and informed PID tuning recommendations.
        </AlertDescription>
      </Alert>
      
      <Textarea
        placeholder="Paste your CSV data here..."
        className="min-h-[300px] font-mono text-sm"
        value={csvData}
        onChange={(e) => onDataInput(e.target.value)}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={() => onDataInput(csvData)} 
          disabled={loading || !csvData.trim()}
          className="bg-pid-blue hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Process Data & Visualize
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DataInputSection;
