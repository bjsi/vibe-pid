
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
            input values, output values, setpoint and PID parameters.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-gray-500">Format your CSV data as:</p>
        <pre className="p-2 bg-gray-50 rounded-md text-sm font-mono">
          ms,input,output,setpoint,Kp,Ki,Kd
        </pre>
      </div>
      
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
