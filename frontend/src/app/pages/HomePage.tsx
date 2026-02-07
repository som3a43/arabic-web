import React from "react";
import ExportByTableExample from "../components/ExportByTable";
import PrintableTableDemo from "../components/PrintableTableDemo";

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* Initial State Message */}
      <div className="bg-white p-12 rounded-lg shadow-sm text-center">
        <p
          style={{
            fontSize: "var(--font-size-lg)",
            color: "var(--text-medium)",
          }}
        >
          الرجاء اختيار قسم من الأعلى للبدء
        </p>
      </div>

      {/* Example exporter */}
      <div className="mt-6">
        <ExportByTableExample />
      </div>

      {/* Printable table demo */}
      <div className="mt-6">
        <PrintableTableDemo />
      </div>
    </div>
  );
};

export default HomePage;
