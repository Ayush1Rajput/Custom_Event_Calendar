import { format, parseISO, isBefore } from "date-fns";
import '../styles/form.css'

function EventForm({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  onDelete,
  isEditing,
}) 
{
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

  const validateAndSubmit = (e) => {
    e.preventDefault();
    const startDate = parseISO(formData.start);
    const endDate = formData.end ? parseISO(formData.end) : startDate;

    onSubmit(e);

};


return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="model-content">
        <h2>{isEditing ? "Edit Event" : "Add Event"}</h2>

        <form onSubmit={validateAndSubmit}>
          <div className="">
            <label >Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleDateTimeChange}
              required
            />
          </div>
          <div className="">
            <label >
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="start"
              value={formatDateForInput(formData.start)}
              onChange={handleDateTimeChange}
              required
            />
          </div>
          <div className="">
            <label >End Date & Time</label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end ? formatDateForInput(formData.end) : ""}
              onChange={handleDateTimeChange}
            />
          </div>
          <div className="">
            <label >Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleDateTimeChange}
            />
          </div>
          <div className="">
            <label >Recurrence</label>
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
          </div>
          <div className="">
            <label >Event Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleDateTimeChange}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
            >
              {isEditing ? "Update Event" : "Add Event"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={onDelete}
              >
                Delete Event
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




export default EventForm;