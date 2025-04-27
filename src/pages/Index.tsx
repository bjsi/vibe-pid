
import { useState } from "react";
import PidTuner from "../components/PidTuner/PidTuner";
import PageLayout from "../components/Layout/PageLayout";

const Index = () => {
  return (
    <PageLayout>
      <div className="w-full">
        <PidTuner />
      </div>
    </PageLayout>
  );
};

export default Index;
