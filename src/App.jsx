import { useState } from "react";
import { parse, format } from "date-fns";
import Calendar from "./components/Calendar";
import EventForm from "./components/EventForm";

function App() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    recurrence: "none",
    color: "#3788d8",
  });

  // Handle when a date is clicked on the calendar
  const handleDateClick = (date) => {
    const dateStr = format(date, "yyyy-MM-dd'T'HH:mm");
    setFormData({
      title: "",
      start: dateStr,
      end: dateStr,
      description: "",
      recurrence: "none",
      color: "#3788d8",
    });
    setCurrentEvent(null);
    setModalOpen(true);
  };

  // Handle when an existing event is clicked
  const handleEventClick = (event) => {
    setFormData({
      title: event.title,
      start: event.start,
      end: event.end || event.start,
      description: event.description || "",
      recurrence: event.recurrence || "none",
      color: event.backgroundColor || "#3788d8",
    });
    setCurrentEvent(event);
    setModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert start and end datetime to ISO format
    const startDate = parse(
      formData.start,
      "yyyy-MM-dd'T'HH:mm",
      new Date()
    ).toISOString();
    const endDate = formData.end
      ? parse(formData.end, "yyyy-MM-dd'T'HH:mm", new Date()).toISOString()
      : startDate;

    const newEvent = {
      id: currentEvent ? currentEvent.id : Date.now().toString(),
      title: formData.title,
      start: startDate,
      end: endDate,
      description: formData.description,
      recurrence: formData.recurrence,
      backgroundColor: formData.color,
    };

    setEvents((prev) =>
      currentEvent
        ? prev.map((ev) => (ev.id === currentEvent.id ? newEvent : ev))
        : [...prev, newEvent]
    );
    setModalOpen(false);
    setFormData({
      title: "",
      start: "",
      end: "",
      description: "",
      recurrence: "none",
      color: "#3788d8",
    });
  };

  // Handle delete enevnt
  const handleDelete = () => {
    if (currentEvent) {
      setEvents((prev) => prev.filter((ev) => ev.id !== currentEvent.id));
      setModalOpen(false);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Event Management Calendar</h1>
      <Calendar
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />
      <EventForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isEditing={!!currentEvent}
      />
    </div>
  );
}

export default App;
