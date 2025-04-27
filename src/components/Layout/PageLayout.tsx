
import { ReactNode } from "react";
import Header from "./Header";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container py-6">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Vibe Your PID - Automate PID Controller Tuning with GPT
      </footer>
    </div>
  );
};

export default PageLayout;
