// App.jsx
import { useState } from "react";
import { parse, format, isSameDay, isBefore, isAfter } from "date-fns";
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

  // Check if the new/updated event is conflicting with existing ones
  const hasConflict = (newEvent) => {
    return events.some((event) => {
      if (event.id === newEvent.id) return false;

      const existingStart = parse(event.start, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date());
      const existingEnd = event.end
        ? parse(event.end, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date())
        : existingStart;

      const newStart = parse(newEvent.start, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date());
      const newEnd = newEvent.end
        ? parse(newEvent.end, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date())
        : newStart;

      return (
        (isBefore(newStart, existingEnd) && isAfter(newEnd, existingStart)) ||
        isSameDay(existingStart, newStart)
      );
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert start and end datetime to ISO format
    const startDate = parse(formData.start, "yyyy-MM-dd'T'HH:mm", new Date()).toISOString();
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

    if (hasConflict(newEvent)) {
      alert("Event conflict detected! Choose a different time.");
      return;
    }

    // Add or update event
    setEvents((prev) =>
      currentEvent ? prev.map((ev) => (ev.id === currentEvent.id ? newEvent : ev)) : [...prev, newEvent]
    );

    // Reset modal and form
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

  // Handle drag-and-drop event
  const handleEventDrop = (eventId, newDate) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) => {
        if (ev.id === eventId) {
          const startTime = new Date(ev.start);
          const updatedStart = new Date(newDate);
          updatedStart.setHours(startTime.getHours());
          updatedStart.setMinutes(startTime.getMinutes());

          const updatedEnd = ev.end ? new Date(ev.end) : null;
          if (updatedEnd) {
            const duration = new Date(ev.end) - new Date(ev.start);
            updatedEnd.setTime(updatedStart.getTime() + duration);
          }

          const updatedEvent = {
            ...ev,
            start: updatedStart.toISOString(),
            end: updatedEnd ? updatedEnd.toISOString() : undefined,
          };

          if (hasConflict(updatedEvent)) {
            alert("Drop failed: Event conflict detected!");
            return ev;
          }

          return updatedEvent;
        }
        return ev;
      })
    );
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Event Management Calendar</h1>
      <Calendar
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        onEventDrop={handleEventDrop}
      />
      <EventForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isEditing={!!currentEvent}
        events={events}
        currentEventId={currentEvent?.id || null}
      />
    </div>
  );
}

export default App;
