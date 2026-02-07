import React from "react";
import { InspectionTabs } from "../components/InspectionTabs";
import { TableContainer } from "../components/TableContainer";
import { NotesTextarea } from "../components/NotesTextarea";
import { AnimatedAddButton } from "../components/AnimatedAddButton";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { exportTableToPDF } from "../components/ExportByTable";

interface TableData {
  id: string;
  label: string;
  data: string[][];
  columnHeaders: string[];
  notes: string;
}

interface SectionPageProps {
  sectionName: string;
  sectionTitle: string;
  tables: TableData[];
  activeTableId: string;
  onTabChange: (tableId: string) => void;
  onRemoveTab: (tableId: string) => void;
  onRenameTab: (tableId: string, newName: string) => void;
  onDataChange: (data: string[][]) => void;
  onColumnHeaderChange: (headers: string[]) => void;
  onNotesChange: (notes: string) => void;
  onAddTable: () => void;
  onAutoSave: () => void;
}

export const SectionPage: React.FC<SectionPageProps> = ({
  sectionName,
  sectionTitle,
  tables,
  activeTableId,
  onTabChange,
  onRemoveTab,
  onRenameTab,
  onDataChange,
  onColumnHeaderChange,
  onNotesChange,
  onAddTable,
  onAutoSave,
}) => {
  const activeTable = tables.find((t) => t.id === activeTableId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      {/* Tabs for multiple tables */}
      <InspectionTabs
        tabs={tables}
        activeTab={activeTableId}
        onTabChange={onTabChange}
        onRemoveTab={onRemoveTab}
        onRenameTab={onRenameTab}
        canRemove={tables.length > 1}
      />

      {/* Table Title - Centered and Prominent */}
      <div className="text-center mb-6">
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--text-dark)",
          }}
        >
          {sectionTitle}
        </h2>
      </div>

      {/* Table Section */}
      <div className="mb-6">
        {activeTable && (
          <div
            id={`export-table-${activeTable.id}`}
            data-name={activeTable.label}
            data-table-json={JSON.stringify({
              headers: activeTable.columnHeaders || [],
              data: activeTable.data || [],
              name: activeTable.label || "",
            })}
            dir="rtl"
          >
            <TableContainer
              rows={12}
              columns={20}
              data={activeTable.data}
              columnHeaders={activeTable.columnHeaders}
              onDataChange={onDataChange}
              onColumnHeaderChange={onColumnHeaderChange}
            />
          </div>
        )}
      </div>

      {/* Add Table Button */}
      {tables.length < 3 && (
        <div className="mb-6">
          <AnimatedAddButton onClick={onAddTable}>
            إضافة جدول
          </AnimatedAddButton>
        </div>
      )}

      {/* Notes Section */}
      <div className="mb-6">
        {activeTable && (
          <NotesTextarea
            value={activeTable.notes}
            onChange={onNotesChange}
            tableName={activeTable.label}
            showSaveButton={true}
          />
        )}
      </div>

      {/* Actions Section */}
      <div className="flex gap-4 justify-start border-t border-[var(--light-gray)] pt-6">
        <PrimaryButton
          onClick={() => {
            if (!activeTable) return;
            exportTableToPDF(`export-table-${activeTable.id}`);
          }}
        >
          تصدير إلى PDF
        </PrimaryButton>
        <SecondaryButton onClick={onAutoSave}>حفظ تلقائي</SecondaryButton>
      </div>
    </div>
  );
};

export default SectionPage;
