import { format, parseISO, isBefore, isAfter, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import "../styles/form.css";

function EventForm({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  onDelete,
  isEditing,
  events,
  currentEventId,
}) {
  const [conflictWarning, setConflictWarning] = useState("");

  // Function for format the date
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    try {
      return format(parseISO(isoDate), "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  };

  // Handle the change event for form inputs
  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Conflict detection logic
  const checkConflict = () => {
    if (!formData.start) return;

    const newStart = parseISO(formData.start);
    const newEnd = formData.end ? parseISO(formData.end) : newStart;

    const hasConflict = events.some((event) => {
      // Don't compare with itself
      if (event.id === currentEventId) return false;

      const existingStart = parseISO(event.start);
      const existingEnd = event.end ? parseISO(event.end) : existingStart;

      return (
        (isBefore(newStart, existingEnd) && isAfter(newEnd, existingStart)) ||
        isSameDay(newStart, existingStart)
      );
    });

    setConflictWarning(hasConflict ? "⚠️ Event conflict detected!" : "");
  };

  useEffect(() => {
    checkConflict();
  }, [formData.start, formData.end, currentEventId]);

  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (conflictWarning) {
      alert("Please resolve the conflict before submitting.");
      return;
    }

    onSubmit(e); 
  };

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="model-content">
        <h2>{isEditing ? "Edit Event" : "Add Event"}</h2>

        <form onSubmit={validateAndSubmit}>
          <label>Event Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleDateTimeChange}
            required
          />

          <label>Start Date & Time</label>
          <input
            type="datetime-local"
            name="start"
            value={formatDateForInput(formData.start)}
            onChange={handleDateTimeChange}
            required
          />

          <label>End Date & Time</label>
          <input
            type="datetime-local"
            name="end"
            value={formData.end ? formatDateForInput(formData.end) : ""}
            onChange={handleDateTimeChange}
          />

          {conflictWarning && (
            <p style={{ color: "red", fontSize: "14px" }}>{conflictWarning}</p>
          )}

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleDateTimeChange}
          />

          <label>Recurrence</label>
          <select
            name="recurrence"
            value={formData.recurrence}
            onChange={handleDateTimeChange}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>

          <label>Event Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleDateTimeChange}
          />

          <div className="flex justify-between mt-3">
            <button type="submit" disabled={!!conflictWarning}>
              {isEditing ? "Update Event" : "Add Event"}
            </button>

            {isEditing && (
              <button type="button" onClick={onDelete}>
                Delete Event
              </button>
            )}
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
