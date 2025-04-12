import { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, addEvent, deleteEvent } from '../redux/eventSlice';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) =>
    state.events.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }))
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: '', end: '' });

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: '', description: '', start: new Date(start), end: new Date(end) });
    setModalOpen(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return alert('Title is required!');
    dispatch(addEvent(newEvent));
    setModalOpen(false);
    setNewEvent({ title: '', description: '', start: '', end: '' });
  };

  const handleDelete = (event) => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      dispatch(deleteEvent(event._id));
    }
  };

  const handleClearForm = () => {
    setNewEvent({ title: '', description: '', start: '', end: '' });
  };
  const CustomEvent = ({ event }) => (
    <div className="custom-event">
      <strong>{event.title}</strong>
      {event.description && <div className="text-xs text-gray-200">{event.description}</div>}
    </div>
  );
  

  return (
    <div className="calendar-container">
      <BigCalendar
        className="big-calendar"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={['month', 'week', 'day']}
        defaultView="month"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleDelete}
        components={{ event: CustomEvent }}
        popup
        dayPropGetter={(date) => ({
          className: moment().isSame(date, 'day') ? 'today-highlight' : '',
        })}
      />


      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-slide-in">
            <h2 className="modal-title">Add New Event</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <textarea
              className="modal-input"
              placeholder="Event Description (optional)"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleAddEvent}>
                Add
              </button>
              <button className="btn btn-secondary" onClick={handleClearForm}>
                Clear
              </button>
              <button className="btn btn-cancel" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
