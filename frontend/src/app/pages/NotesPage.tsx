import React from "react";
import { GeneralNotes } from "../components/GeneralNotes";

interface NotesPageProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({
  value,
  onChange,
  onSave,
}) => {
  return (
    <div>
      <GeneralNotes value={value} onChange={onChange} onSave={onSave} />
    </div>
  );
};

export default NotesPage;
