import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface StopwatchTimerEditFormProps {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const StopwatchTimerEditForm: React.FC<StopwatchTimerEditFormProps> = ({
  initialName,
  onSave,
  onCancel,
}) => {
  const [editedName, setEditedName] = useState(initialName);

  const handleSave = () => {
    onSave(editedName.trim() || 'Stopwatch');
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="editStopwatchName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Stopwatch Name
        </label>
        <input
          type="text"
          id="editStopwatchName"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="input w-full"
          placeholder="Stopwatch Name"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="btn btn-primary"
        >
          <Check size={16} className="mr-1" />
          Save
        </button>
      </div>
    </div>
  );
};

export default StopwatchTimerEditForm; 