import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface CountdownTimerEditFormProps {
  initialName: string;
  initialDuration: number; // in seconds
  onSave: (name: string, duration: number) => void;
  onCancel: () => void;
}

const CountdownTimerEditForm: React.FC<CountdownTimerEditFormProps> = ({
  initialName,
  initialDuration,
  onSave,
  onCancel,
}) => {
  const [editedName, setEditedName] = useState(initialName);
  const [editedHours, setEditedHours] = useState(Math.floor(initialDuration / 3600));
  const [editedMinutes, setEditedMinutes] = useState(Math.floor((initialDuration % 3600) / 60));
  const [editedSeconds, setEditedSeconds] = useState(initialDuration % 60);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const totalSeconds = (editedHours * 3600) + (editedMinutes * 60) + editedSeconds;

    // Validation for countdown timer duration
    if (totalSeconds <= 0) {
      setError('Countdown duration must be greater than 0');
      return;
    }

    // Clear any previous errors
    setError(null);

    onSave(editedName.trim() || 'Countdown', totalSeconds);
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="editTimerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Timer Name
        </label>
        <input
          type="text"
          id="editTimerName"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="input w-full"
          placeholder="Timer Name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Duration
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="editHours" className="block text-xs text-gray-500 mb-1">
              Hours
            </label>
            <input
              type="number"
              id="editHours"
              min="0"
              max="23"
              value={editedHours}
              onChange={(e) => setEditedHours(parseInt(e.target.value) || 0)}
              className="input w-full"
              aria-label="Hours for countdown duration"
            />
          </div>
          <div>
            <label htmlFor="editMinutes" className="block text-xs text-gray-500 mb-1">
              Minutes
            </label>
            <input
              type="number"
              id="editMinutes"
              min="0"
              max="59"
              value={editedMinutes}
              onChange={(e) => setEditedMinutes(parseInt(e.target.value) || 0)}
              className="input w-full"
              aria-label="Minutes for countdown duration"
            />
          </div>
          <div>
            <label htmlFor="editSeconds" className="block text-xs text-gray-500 mb-1">
              Seconds
            </label>
            <input
              type="number"
              id="editSeconds"
              min="0"
              max="59"
              value={editedSeconds}
              onChange={(e) => setEditedSeconds(parseInt(e.target.value) || 0)}
              className="input w-full"
              aria-label="Seconds for countdown duration"
            />
          </div>
        </div>

        {error && (
          <p className="text-error-700 text-sm mt-2">{error}</p>
        )}

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

export default CountdownTimerEditForm; 