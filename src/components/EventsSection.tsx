/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MeetEvent } from '../types';
import { Calendar, Clock, MapPin, Plus, Check, MessageSquare, Tag, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventsSectionProps {
  events: MeetEvent[];
  onAddEvent: (newEvent: Omit<MeetEvent, 'id' | 'attendeesCount'>) => void;
}

export default function EventsSection({ events, onAddEvent }: EventsSectionProps) {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);
  
  // New event form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MeetEvent['type']>('Practice');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [formError, setFormError] = useState('');

  const handleRSVP = (eventId: string) => {
    if (rsvpedIds.includes(eventId)) {
      setRsvpedIds(prev => prev.filter(id => id !== eventId));
    } else {
      setRsvpedIds(prev => [...prev, eventId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location || !description) {
      setFormError('Please fill in all required fields.');
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
    setShowScheduleForm(false);
  };

  return (
    <div id="events-section" className="grid gap-8 lg:grid-cols-12">
      {/* List of Meets (Left/Main Side) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">Meets & Workout Schedule</h2>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
              Next practices, mock trials, and regional qualifiers
            </p>
          </div>
          {/* Button to toggle add meeting form */}
          {!showScheduleForm && (
            <button
              id="schedule-meet-toggle"
              onClick={() => setShowScheduleForm(true)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 font-sans text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Schedule Meet
            </button>
          )}
        </div>

        {/* List of events */}
        <div className="space-y-6">
          {events.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <p className="font-sans text-sm text-slate-400">No scheduled events at the moment.</p>
            </div>
          ) : (
            events.map((event) => {
              const hasRsvped = rsvpedIds.includes(event.id);
              const eventAttendees = event.attendeesCount + (hasRsvped ? 1 : 0);

              // Stylize event based on type
              let typeStyles = "bg-sky-50 text-sky-700 border-sky-100";
              if (event.type === 'Regional Contest' || event.type === 'National Olympiad') {
                typeStyles = "bg-rose-50 text-rose-700 border-rose-100";
              } else if (event.type === 'Local Meet') {
                typeStyles = "bg-amber-50 text-amber-700 border-amber-100";
              }

              return (
                <div
                  key={event.id}
                  id={`event-card-${event.id}`}
                  className="flex flex-col md:flex-row gap-5 rounded-3xl border border-slate-150 bg-white p-6 md:p-7 shadow-xs hover:border-slate-300 transition-colors"
                >
                  {/* Left block for Date visual calendar badge */}
                  <div className="flex md:flex-col items-center justify-center shrink-0 h-16 md:h-24 w-full md:w-24 rounded-2xl bg-slate-50 border border-slate-200 p-2 text-center">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="font-sans text-3xl font-extrabold text-slate-900 md:my-0.5">
                      {new Date(event.date).getDate() + 1 || event.date.split('-')[2]}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 font-semibold block uppercase">
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>

                  {/* Middleware for content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`inline-flex rounded-md border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${typeStyles}`}>
                        {event.type}
                      </span>
                      {hasRsvped && (
                        <span className="inline-flex items-center gap-1 text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-sm">
                          <Check className="h-3 w-3" /> Attending
                        </span>
                      )}
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
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>At {event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate" title={event.location}>{event.location}</span>
                      </div>
                    </div>

                    {/* Footer Row: Tags and CTA */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-sans text-xs text-slate-500">
                          {eventAttendees} planning to attend
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {event.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-slate-500 font-mono text-[10px] bg-slate-50 px-2 py-0.5 rounded-sm">
                            #{tag}
                          </span>
                        ))}
                        <button
                          id={`rsvp-btn-${event.id}`}
                          onClick={() => handleRSVP(event.id)}
                          className={`rounded-xl px-4 py-1.5 font-sans text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                            hasRsvped
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-slate-950 text-white hover:bg-slate-800 shadow-xs'
                          }`}
                        >
                          {hasRsvped ? 'Cancel RSVP' : 'Join / RSVP'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Scheduler Form (Right Side panel) */}
      <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
        <AnimatePresence mode="wait">
          {showScheduleForm ? (
            <motion.div
              id="event-form-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
            >
              <div>
                <h3 className="font-sans text-lg font-bold text-slate-900">Schedule Practice / Meet</h3>
                <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                  Expand the active workout schedule
                </p>
              </div>

              {formError && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-[11px] text-rose-800">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold text-slate-700">Meet Title *</label>
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
                      type="time"
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

                <div className="flex items-center gap-3 pt-2">
                  <button
                    id="submit-new-event"
                    type="submit"
                    className="flex-1 rounded-xl bg-slate-900 py-2.5 font-sans text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer text-center"
                  >
                    Save Meet Event
                  </button>
                  <button
                    id="cancel-new-event"
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="space-y-1 px-4">
                <h4 className="font-sans text-sm font-semibold text-slate-900">Introduce new Meets</h4>
                <p className="font-sans text-xs text-slate-400 leading-normal">
                  Got an upcoming contest opportunity, or want to host a specialized study workout? Schedule it here for the team!
                </p>
              </div>
              <button
                id="schedule-meet-secondary"
                onClick={() => setShowScheduleForm(true)}
                className="w-full inline-flex justify-center items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Schedule Workout Now
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
