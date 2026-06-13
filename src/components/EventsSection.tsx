/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MeetEvent } from '../types';
import { Calendar, Clock, MapPin, Plus, Check, MessageSquare, Tag, Users, Edit, Trash2, X, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Timezone-safe local date parser to prevent UTC offset shifting (month, day off by 1)
const parseLocalDateString = (dateStr: string): Date => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1; // 0-indexed month
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d, 12, 0, 0); // safe mid-day setting
  }
  return new Date(dateStr);
};

interface EventsSectionProps {
  isAdmin: boolean;
  titles: {
    eventsTitle: string;
    eventsSubtitle: string;
    [key: string]: string;
  };
  onUpdateTitles: (updated: { [key: string]: string }) => void;
  events: MeetEvent[];
  onAddEvent: (newEvent: Omit<MeetEvent, 'id' | 'attendeesCount'>) => void;
  onUpdateEvent: (id: string, updatedFields: Partial<MeetEvent>) => void;
  onDeleteEvent: (id: string) => void;
  schedulePassword?: string;
  onUpdateSchedulePassword?: (newPassword: string) => void;
}

export default function EventsSection({
  isAdmin,
  titles,
  onUpdateTitles,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  schedulePassword = "239power",
  onUpdateSchedulePassword = () => {},
}: EventsSectionProps) {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);
  
  // Custom unregistration form states
  const [unregisteringEventId, setUnregisteringEventId] = useState<string | null>(null);
  const [unregistNameInput, setUnregistNameInput] = useState('');
  const [unregistError, setUnregistError] = useState('');
  
  // Custom header title editing
  const [isEditingEventsHeader, setIsEditingEventsHeader] = useState(false);
  const [eventsTitle, setEventsTitle] = useState(titles.eventsTitle || "Meets & Workout Schedule");
  const [eventsSubtitle, setEventsSubtitle] = useState(titles.eventsSubtitle || "Next practices, mock trials, and regional qualifiers");

  // Inline Event card editing state variables
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<MeetEvent['type']>('Practice');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTagsString, setEditTagsString] = useState('');

  // Password / Deletion states
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // New event form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MeetEvent['type']>('Practice');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [formError, setFormError] = useState('');

  // Tag filter state
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Calendar specific states
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [navDate, setNavDate] = useState<Date>(() => {
    if (events && events.length > 0) {
      return parseLocalDateString(events[0].date);
    }
    return new Date();
  });

  // Custom Join RSVP states
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(() => {
    return localStorage.getItem('olympiad_rsvp_name') || '';
  });

  const handleStartJoin = (eventId: string) => {
    setJoiningEventId(eventId);
    // Auto-close any active unregister form for this event
    setUnregisteringEventId(null);
  };

  const handleConfirmJoinSubmit = (eventId: string) => {
    if (!nameInput.trim()) return;
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return;

    const currentAttendees = targetEvent.attendees || [];
    const exists = currentAttendees.some(
      a => a.name.toLowerCase() === nameInput.trim().toLowerCase()
    );

    let nextAttendees = [...currentAttendees];
    if (!exists) {
      nextAttendees.push({
        name: nameInput.trim(),
        date: new Date().toISOString()
      });
    }

    onUpdateEvent(eventId, { attendees: nextAttendees });
    
    // Set transient session rsvped state
    if (!rsvpedIds.includes(eventId)) {
      setRsvpedIds(prev => [...prev, eventId]);
    }
    localStorage.setItem('olympiad_rsvp_name', nameInput.trim());
    setJoiningEventId(null);
  };

  const handleConfirmUnregisterSubmit = (eventId: string) => {
    const trimmedVal = unregistNameInput.trim();
    if (!trimmedVal) {
      setUnregistError('Please enter a name.');
      return;
    }

    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return;

    const currentAttendees = targetEvent.attendees || [];
    const exists = currentAttendees.some(
      a => a.name.toLowerCase() === trimmedVal.toLowerCase()
    );

    if (!exists) {
      setUnregistError('This name is not registered for this event.');
      return;
    }

    // Filter out target registered user from roster (casing & trim safe)
    const nextAttendees = currentAttendees.filter(
      a => a.name.toLowerCase() !== trimmedVal.toLowerCase()
    );

    onUpdateEvent(eventId, { attendees: nextAttendees });

    // Instantly slide off the temporary local sessions registered badge
    setRsvpedIds(prev => prev.filter(id => id !== eventId));

    // Reset workflow states
    setUnregistNameInput('');
    setUnregistError('');
    setUnregisteringEventId(null);
  };

  const handleSaveEventsHeader = () => {
    onUpdateTitles({
      eventsTitle,
      eventsSubtitle,
    });
    setIsEditingEventsHeader(false);
  };

  const handleStartEdit = (event: MeetEvent) => {
    setEditingEventId(event.id);
    setEditTitle(event.title);
    setEditType(event.type);
    setEditDate(event.date);
    setEditTime(event.time);
    setEditLocation(event.location);
    setEditDescription(event.description);
    setEditTagsString(event.tags.join(', '));
  };

  const handleSaveEdit = (id: string) => {
    onUpdateEvent(id, {
      title: editTitle,
      type: editType,
      date: editDate,
      time: editTime,
      location: editLocation,
      description: editDescription,
      tags: editTagsString.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    setEditingEventId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location || !description) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (!isAdmin && enteredPassword !== schedulePassword) {
      setFormError('Incorrect scheduling password. Please check your credentials.');
      return;
    }

    setFormError('');
    const tags = tagsString
      ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    onAddEvent({
      title,
      type,
      date,
      time,
      location,
      description,
      tags,
    });

    // Reset Form
    setTitle('');
    setType('Practice');
    setDate('');
    setTime('');
    setLocation('');
    setDescription('');
    setTagsString('');
    setEnteredPassword('');
    setShowScheduleForm(false);
  };

  const allTags = Array.from(new Set(events.flatMap(ev => ev.tags || []))).filter(Boolean);

  const filteredEvents = events.filter(event => {
    const matchTag = selectedTag ? (event.tags && event.tags.includes(selectedTag)) : true;
    const matchDate = selectedDateFilter ? (event.date === selectedDateFilter) : true;
    return matchTag && matchDate;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div id="events-section" className="grid gap-8 lg:grid-cols-12">
      {/* List of Meets (Left/Main Side) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          {isEditingEventsHeader && isAdmin ? (
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-full max-w-md">
              <input
                type="text"
                value={eventsTitle}
                onChange={(e) => setEventsTitle(e.target.value)}
                className="w-full font-sans text-sm font-bold text-slate-950 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="Calendar Title"
              />
              <textarea
                value={eventsSubtitle}
                onChange={(e) => setEventsSubtitle(e.target.value)}
                className="w-full font-sans text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="Calendar Subtitle"
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingEventsHeader(false)}
                  className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1 text-[10px] font-bold shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEventsHeader}
                  className="rounded-lg bg-slate-950 text-white px-3 py-1 text-[10px] font-bold shadow-xs"
                >
                  Save Title
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative flex items-center gap-2">
              <div>
                <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
                  {titles.eventsTitle || eventsTitle}
                </h2>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                  {titles.eventsSubtitle || eventsSubtitle}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setEventsTitle(titles.eventsTitle || eventsTitle);
                    setEventsSubtitle(titles.eventsSubtitle || eventsSubtitle);
                    setIsEditingEventsHeader(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                  title="Edit calendar headers"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Button to toggle add meeting form */}
          {!showScheduleForm && (
            <button
              id="schedule-event-toggle"
              onClick={() => {
                setShowScheduleForm(true);
                // Pre-populate today's date for ease of schedule
                const today = new Date();
                setDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 font-sans text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Schedule Event
            </button>
          )}
        </div>

        {/* Tag Filters Row */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 py-3 border-t border-b border-slate-100">
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1.5">Filter meets:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold transition cursor-pointer ${
                selectedTag === null
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-105 bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Events
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold transition cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Date Filter Indicator block */}
        {selectedDateFilter && (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-700 font-sans">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-450" />
              Showing only events scheduled on <strong className="text-slate-950 font-bold">{parseLocalDateString(selectedDateFilter).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
            </span>
            <button
              onClick={() => setSelectedDateFilter(null)}
              className="flex items-center gap-1 font-bold text-rose-600 hover:text-rose-800 tracking-tight"
            >
              Cancel filter <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* List of events */}
        <div className="space-y-6">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <p className="font-sans text-sm text-slate-450">No matching events scheduled at the moment.</p>
              {(selectedTag || selectedDateFilter) && (
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setSelectedDateFilter(null);
                  }}
                  className="mt-3 font-sans text-xs underline text-slate-650 font-bold"
                >
                  Clear active search filters
                </button>
              )}
            </div>
          ) : (
            sortedEvents.map((event) => {
              const isEditingThisEvent = editingEventId === event.id;
              
              // Validate user local registered state
              const hasRsvped = rsvpedIds.includes(event.id);
              
              // Dynamic attendees count - make the default 0 if no one is listed
              const eventAttendees = (event.attendees && event.attendees.length > 0) ? event.attendees.length : 0;

              // Stylize event based on type
              let typeStyles = "bg-sky-50 text-sky-700 border-sky-100";
              if (event.type === 'Regional Contest' || event.type === 'National Olympiad') {
                typeStyles = "bg-rose-50 text-rose-700 border-rose-100";
              } else if (event.type === 'Local Meet') {
                typeStyles = "bg-amber-50 text-amber-700 border-amber-100";
              }

              if (isEditingThisEvent && isAdmin) {
                return (
                  <div
                    key={event.id}
                    className="rounded-3xl border-2 border-slate-900 bg-slate-50/70 p-6 md:p-7 space-y-4 shadow-md"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-mono text-xs font-bold text-slate-900 uppercase">Updating Scheduled Event</span>
                      <button
                        onClick={() => setEditingEventId(null)}
                        className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-sans text-[11px] font-bold text-slate-700 block">Meet/Event Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full rounded-xl border border-slate-250 bg-white py-2 px-3 font-sans text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-sans text-[11px] font-bold text-slate-700 block">Event Type</label>
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value as MeetEvent['type'])}
                          className="w-full rounded-xl border border-slate-250 bg-white py-2 px-3 font-sans text-xs focus:outline-none"
                        >
                          <option value="Practice">Practice</option>
                          <option value="Local Meet">Local Meet</option>
                          <option value="Regional Contest">Regional Contest</option>
                          <option value="National Olympiad">National Olympiad</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-sans text-[11px] font-bold text-slate-700 block">Date</label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full rounded-xl border border-slate-250 bg-white py-2 px-2 font-sans text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-sans text-[11px] font-bold text-slate-700 block">Time</label>
                        <input
                          type="text"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          placeholder="e.g. 15:30 PDT"
                          className="w-full rounded-xl border border-slate-250 bg-white py-2 px-2 font-sans text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-sans text-[11px] font-bold text-slate-700 block">Location</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full rounded-xl border border-slate-250 bg-white py-2 px-2 font-sans text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans text-[11px] font-bold text-slate-700 block">Description *</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-slate-250 bg-white py-2 px-3 font-sans text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans text-[11px] font-bold text-slate-700 block">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={editTagsString}
                        onChange={(e) => setEditTagsString(e.target.value)}
                        className="w-full rounded-xl border border-slate-250 bg-white py-2 px-3 font-sans text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                      {isDeletingId === event.id ? (
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 p-2 rounded-xl">
                          <span className="text-xs text-rose-700 font-bold">Confirm delete forever?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteEvent(event.id);
                              setEditingEventId(null);
                              setIsDeletingId(null);
                            }}
                            className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-700 transition"
                          >
                            Yes, Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsDeletingId(null)}
                            className="border border-slate-200 bg-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsDeletingId(event.id)}
                          className="rounded-xl border border-slate-250 bg-rose-50 text-rose-700 px-4 py-2 text-xs font-bold hover:bg-rose-100 transition"
                        >
                          Delete Event
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(event.id)}
                        className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold hover:bg-slate-800 transition"
                      >
                        Keep Changes
                      </button>
                    </div>
                  </div>
                );
              }

              // Event Card visual shell
              const evDateParts = parseLocalDateString(event.date);
              const badgeMonth = evDateParts.toLocaleDateString('en-US', { month: 'short' });
              const badgeDay = evDateParts.getDate();
              const badgeYear = evDateParts.getFullYear();
              const badgeWeekday = evDateParts.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div
                  key={event.id}
                  id={`event-card-${event.id}`}
                  className="group relative flex flex-col md:flex-row gap-5 rounded-3xl border border-slate-150 bg-white p-6 md:p-7 shadow-xs hover:border-slate-350 transition"
                >
                  {/* Left block for Date visual calendar badge - Fully immune to timezone offsets */}
                  <div className="flex md:flex-col items-center justify-center shrink-0 h-20 md:h-24 w-full md:w-24 rounded-2xl bg-slate-50 border border-slate-200 p-2 text-center shadow-3xs">
                    <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      {badgeMonth}
                    </span>
                    <span className="font-sans text-3xl font-extrabold text-slate-900 leading-none md:my-0.5 block">
                      {badgeDay}
                    </span>
                    <span className="font-sans text-[10px] font-bold text-slate-500 leading-none block">
                      {badgeYear}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 font-semibold block uppercase tracking-wider mt-1.5">
                      {badgeWeekday}
                    </span>
                  </div>

                  {/* Core Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`inline-flex rounded-md border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${typeStyles}`}>
                        {event.type}
                      </span>
                      <div className="flex items-center gap-2">
                        {hasRsvped && (
                          <span className="inline-flex items-center gap-1 text-emerald-650 font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-sm">
                            <Check className="h-3 w-3" /> Registered
                          </span>
                        )}
                        {isAdmin && (
                          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-0.5 px-2">
                            {isDeletingId === event.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    onDeleteEvent(event.id);
                                    setIsDeletingId(null);
                                  }}
                                  className="text-rose-600 hover:text-rose-800 font-bold text-[10px] px-1"
                                  title="Confirm delete"
                                >
                                  Confirm
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  onClick={() => setIsDeletingId(null)}
                                  className="text-slate-500 hover:text-slate-700 text-[10px]"
                                  title="Cancel"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEdit(event)}
                                  className="text-slate-500 hover:text-slate-950 p-1"
                                  title="Edit scheduled event details"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setIsDeletingId(event.id)}
                                  className="text-rose-500 hover:text-rose-700 p-1"
                                  title="Delete scheduled event"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-sans text-base font-bold text-slate-900">
                        {event.title}
                      </h3>
                      <p className="font-sans text-xs text-slate-500 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Metadata items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-500 py-1 font-sans text-xs border-t border-b border-slate-100 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>At {event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate" title={event.location}>{event.location}</span>
                      </div>
                    </div>

                    {/* Persistent Student Roster List - Visible to Admin ONLY */}
                    {isAdmin && (
                      event.attendees && event.attendees.length > 0 ? (
                        <div className="mt-2.5 bg-slate-50 border border-slate-150 rounded-2xl p-3 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block font-bold leading-none">
                            Registered Roster ({event.attendees.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {event.attendees.map((att, idx) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-lg py-1 px-2 font-sans text-xs font-semibold text-slate-700 shadow-3xs"
                              >
                                <span>{att.name}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const nextAttendees = (event.attendees || []).filter(a => a.name !== att.name);
                                    onUpdateEvent(event.id, { attendees: nextAttendees });
                                    setRsvpedIds(prev => prev.filter(id => id !== event.id));
                                  }}
                                  className="text-slate-400 hover:text-rose-600 transition ml-0.5 p-0.5 cursor-pointer"
                                  title="Delete registration"
                                >
                                  <X className="h-3 w-3 shrink-0" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 font-sans italic leading-none pt-1">
                          No individual validations yet. Roster empty.
                        </div>
                      )
                    )}

                    {/* Footer Row: Tags and CTA */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-450" />
                        <span className="font-sans text-xs text-slate-650 font-semibold">
                          {eventAttendees === 0 ? "zero" : eventAttendees} planning to attend
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {event.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-slate-500 font-mono text-[10px] bg-slate-50 px-2 py-0.5 rounded-sm">
                            #{tag}
                          </span>
                        ))}
                        {hasRsvped ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1.5 rounded-xl border border-emerald-100 uppercase tracking-wider font-mono">
                              Registered
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setUnregisteringEventId(event.id);
                                setUnregistNameInput('');
                                setUnregistError('');
                                setJoiningEventId(null);
                              }}
                              className="rounded-xl bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 px-3 py-1.5 font-sans text-xs font-bold transition-all cursor-pointer"
                            >
                              Unregister
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              id={`rsvp-btn-${event.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleStartJoin(event.id);
                              }}
                              className="rounded-xl bg-slate-950 text-white hover:bg-slate-800 shadow-xs px-4 py-1.5 font-sans text-xs font-bold tracking-tight transition-all cursor-pointer"
                            >
                              Join / RSVP
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setUnregisteringEventId(event.id);
                                setUnregistNameInput('');
                                setUnregistError('');
                                setJoiningEventId(null);
                              }}
                              className="rounded-xl bg-slate-100 text-slate-700 border border-slate-205 hover:bg-slate-202 px-3 py-1.5 font-sans text-xs font-bold transition-all cursor-pointer"
                            >
                              Unregister
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inline Student Join Attendance Dialog */}
                    {joiningEventId === event.id && (
                      <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3 animate-fadeIn">
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-xs font-bold text-emerald-900">Registration Attendance Sign-up</span>
                          <button
                            onClick={() => { setJoiningEventId(null); }}
                            className="text-slate-400 hover:text-emerald-700 transition p-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-sans leading-normal">
                          Registering for this meet adds you to the visual roster. Enter your name below:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Type your full name..."
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="flex-1 rounded-xl border border-emerald-200 bg-white py-1.5 px-3 font-sans text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleConfirmJoinSubmit(event.id);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleConfirmJoinSubmit(event.id)}
                            className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 font-sans text-xs font-semibold shadow-xs transition"
                          >
                            Join Meet
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Inline Student Unregistration Dialog */}
                    {unregisteringEventId === event.id && (
                      <div className="mt-4 bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-3 animate-fadeIn">
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-xs font-bold text-rose-900">Cancel Your Registration</span>
                          <button
                            onClick={() => { setUnregisteringEventId(null); setUnregistError(''); }}
                            className="text-slate-400 hover:text-rose-700 transition p-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-rose-800 font-sans leading-normal">
                          To unregister, enter the exact name you signed up with:
                        </p>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Name used during RSVP..."
                              value={unregistNameInput}
                              onChange={(e) => {
                                setUnregistNameInput(e.target.value);
                                setUnregistError('');
                              }}
                              className="flex-1 rounded-xl border border-rose-200 bg-white py-1.5 px-3 font-sans text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleConfirmUnregisterSubmit(event.id);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleConfirmUnregisterSubmit(event.id)}
                              className="rounded-xl bg-rose-700 hover:bg-rose-800 text-white px-4 py-1.5 font-sans text-xs font-semibold shadow-xs transition cursor-pointer"
                            >
                              Unregister
                            </button>
                          </div>
                          {unregistError && (
                            <p className="text-[11px] font-sans font-semibold text-rose-600">
                              {unregistError}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Scheduler Form / Calendar Side Panel (Right Side, occupancy 4 cols) */}
      <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-4">
        {showScheduleForm ? (
          <AnimatePresence mode="wait">
            <motion.div
              id="event-form-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
            >
              <div>
                <h3 className="font-sans text-lg font-bold text-slate-900">Schedule Event</h3>
                <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                  Publish an official study session, challenge, or qualifier
                </p>
              </div>

              {formError && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-[11px] text-rose-800">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold text-slate-700">Event Title *</label>
                  <input
                    id="new-event-title"
                    type="text"
                    required
                    placeholder="e.g. Graph Flow Algorithms Practice"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-sans text-xs focus:bg-white focus:border-slate-350 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold text-slate-700">Event Type *</label>
                  <select
                    id="new-event-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as MeetEvent['type'])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-sans text-xs focus:bg-white focus:border-slate-350 focus:outline-none"
                  >
                    <option value="Practice">Practice</option>
                    <option value="Local Meet">Local Meet</option>
                    <option value="Regional Contest">Regional Contest</option>
                    <option value="National Olympiad">National Olympiad</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold text-slate-700">Date *</label>
                    <input
                      id="new-event-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-sans text-xs focus:bg-white focus:border-slate-350 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold text-slate-700">Time *</label>
                    <input
                      id="new-event-time"
                      type="text"
                      placeholder="e.g. 15:30 PDT"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-sans text-xs focus:bg-white focus:border-slate-350 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold text-slate-700">Location / Platform *</label>
                  <input
                    id="new-event-location"
                    type="text"
                    required
                    placeholder="e.g. Science Library Room 4 or Zoom Link ..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-sans text-xs focus:bg-white focus:border-slate-350 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold text-slate-700">Description *</label>
                  <textarea
                    id="new-event-desc"
                    required
                    rows={3}
                    placeholder="Provide details, scope of discussion, prerequisites, etc..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-sans text-xs focus:bg-white focus:border-slate-350 focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold text-slate-700">Tags (comma-separated)</label>
                  <input
                    id="new-event-tags"
                    type="text"
                    placeholder="e.g. Geometry, C++, Math"
                    value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-sans text-xs focus:bg-white focus:border-slate-350 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold text-slate-700">Enter Scheduling Password *</label>
                  <input
                    id="scheduling-password-input"
                    type="password"
                    required
                    placeholder="Required to publish events"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 px-3 font-sans text-xs focus:bg-white focus:border-slate-350 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Publishing new scheduled events is restricted. Enter the authorized scheduling password or request admin assistance.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    id="submit-new-event"
                    type="submit"
                    className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center font-sans text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Save Event
                  </button>
                  <button
                    id="cancel-new-event"
                    type="button"
                    onClick={() => {
                      setShowScheduleForm(false);
                      setEnteredPassword('');
                      setFormError('');
                    }}
                    className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="space-y-4">
            {/* Visual calendar widget built in identical side panel space closed */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-sans text-sm font-bold text-slate-900">
                    {navDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h4>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1))}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    title="Previous Month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1))}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    title="Next Month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Day abbreviations */}
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none pb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(wd => (
                  <div key={wd}>{wd[0]}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {(() => {
                  const cyIndex = navDate.getFullYear();
                  const cmIndex = navDate.getMonth();
                  const fdi = new Date(cyIndex, cmIndex, 1).getDay();
                  const maxDays = new Date(cyIndex, cmIndex + 1, 0).getDate();

                  const gridElements = [];
                  for (let i = 0; i < fdi; i++) {
                    gridElements.push(<div key={`empty-${i}`} />);
                  }

                  for (let day = 1; day <= maxDays; day++) {
                    const dateVal = `${cyIndex}-${String(cmIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEventsList = events.filter(e => e.date === dateVal);
                    const hasMeetsOnThisDay = dayEventsList.length > 0;
                    const isFocusDate = selectedDateFilter === dateVal;

                    let bgStyles = "bg-white text-slate-800 hover:bg-slate-50";
                    if (isFocusDate) {
                      bgStyles = "bg-slate-950 text-white font-extrabold shadow-sm";
                    } else if (hasMeetsOnThisDay) {
                      const topType = dayEventsList[0].type;
                      if (topType === 'Regional Contest' || topType === 'National Olympiad') {
                        bgStyles = "bg-rose-50 text-rose-700 font-bold border border-rose-100 hover:bg-rose-100";
                      } else if (topType === 'Local Meet') {
                        bgStyles = "bg-amber-50 text-amber-700 font-bold border border-amber-100 hover:bg-amber-100";
                      } else {
                        bgStyles = "bg-sky-50 text-sky-700 font-bold border border-sky-100 hover:bg-sky-100";
                      }
                    }

                    gridElements.push(
                      <button
                        key={`day-${day}`}
                        onClick={() => {
                          if (isFocusDate) {
                            setSelectedDateFilter(null);
                          } else {
                            setSelectedDateFilter(dateVal);
                          }
                        }}
                        className={`h-7 w-7 rounded-xl text-xs flex flex-col items-center justify-center transition-all cursor-pointer relative ${bgStyles}`}
                        title={hasMeetsOnThisDay ? `${dayEventsList.length} events scheduled: ${dayEventsList.map(e => e.title).join(', ')}` : undefined}
                      >
                        <span>{day}</span>
                        {hasMeetsOnThisDay && !isFocusDate && (
                          <span className="absolute bottom-1 h-0.5 w-0.5 rounded-full bg-current" />
                        )}
                      </button>
                    );
                  }
                  return gridElements;
                })()}
              </div>

              {selectedDateFilter && (
                <button
                  onClick={() => setSelectedDateFilter(null)}
                  className="w-full py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition text-[10px] font-sans font-bold block text-center"
                >
                  Clear Date Filter
                </button>
              )}
            </div>

            {/* Admin Dedicated Schedule Event Password Configuration Settings Panel */}
            {isAdmin && (
              <div className="rounded-3xl border border-slate-200 bg-slate-55 p-5 bg-slate-50/70 space-y-3.5 shadow-3xs border-dashed">
                <div className="space-y-0.5">
                  <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-widest">
                    Security Command
                  </h4>
                  <p className="font-sans text-[10px] text-slate-400 leading-normal">
                    Admins can dynamically alter the student publishing passkey below instantly.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={schedulePassword}
                      onChange={(e) => onUpdateSchedulePassword(e.target.value)}
                      placeholder="e.g. 239power"
                      className="flex-1 rounded-xl border border-slate-300 bg-white py-1.5 px-3 font-mono text-xs focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <p className="text-[9px] text-emerald-600 font-semibold font-sans leading-none flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 shrink-0 text-emerald-500" /> Saved to database across all clients
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
