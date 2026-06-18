/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Achievement, MeetEvent, Member } from '../types';
import { Award, Star, Trophy, ArrowRight, BookOpen, Target, Flame, Edit, Trash2, Plus, Check, Settings2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeSectionProps {
  isAdmin: boolean;
  achievements: Achievement[];
  upcomingEventsCount: number;
  membersCount: number;
  resourcesCount: number;
  onNavigate: (tab: string) => void;
  teamIntro: { title: string; subtitle: string; description: string; mismatchBanner: string };
  onUpdateIntro: (updatedIntro: { title: string; subtitle: string; description: string; mismatchBanner: string }) => void;
  onAddAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  onUpdateAchievement: (id: string, updated: Partial<Achievement>) => void;
  onDeleteAchievement: (id: string) => void;
}

export default function HomeSection({
  isAdmin,
  achievements,
  upcomingEventsCount,
  membersCount,
  resourcesCount,
  onNavigate,
  teamIntro,
  onUpdateIntro,
  onAddAchievement,
  onUpdateAchievement,
  onDeleteAchievement,
}: HomeSectionProps) {
  // Intro editing state
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [editedTitle, setEditedTitle] = useState(teamIntro.title);
  const [editedSubtitle, setEditedSubtitle] = useState(teamIntro.subtitle);
  const [editedDescription, setEditedDescription] = useState(teamIntro.description);
  const [editedMismatchBanner, setEditedMismatchBanner] = useState(teamIntro.mismatchBanner);

  // Achievement add form state
  const [isAddingAch, setIsAddingAch] = useState(false);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchEvent, setNewAchEvent] = useState('');
  const [newAchDate, setNewAchDate] = useState('');
  const [newAchMedal, setNewAchMedal] = useState<'Gold' | 'Silver' | 'Bronze' | 'First' | 'Special'>('Gold');
  const [newAchDesc, setNewAchDesc] = useState('');

  // Achievement edit state (individual card)
  const [editingAchId, setEditingAchId] = useState<string | null>(null);
  const [editAchTitle, setEditAchTitle] = useState('');
  const [editAchEvent, setEditAchEvent] = useState('');
  const [editAchDate, setEditAchDate] = useState('');
  const [editAchMedal, setEditAchMedal] = useState<'Gold' | 'Silver' | 'Bronze' | 'First' | 'Special'>('Gold');
  const [editAchDesc, setEditAchDesc] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveIntro = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateIntro({
      title: editedTitle,
      subtitle: editedSubtitle,
      description: editedDescription,
      mismatchBanner: editedMismatchBanner,
    });
    setIsEditingIntro(false);
    showToast('Hero section text updated successfully!');
  };

  const handleAddAchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle || !newAchEvent || !newAchDate) return;
    onAddAchievement({
      title: newAchTitle,
      eventName: newAchEvent,
      date: newAchDate,
      medal: newAchMedal,
      description: newAchDesc,
    });
    setIsAddingAch(false);
    // Reset values
    setNewAchTitle('');
    setNewAchEvent('');
    setNewAchDate('');
    setNewAchMedal('Gold');
    setNewAchDesc('');
    showToast('Achievement logged successfully!');
  };

  const startEditAch = (ach: Achievement) => {
    setEditingAchId(ach.id);
    setEditAchTitle(ach.title);
    setEditAchEvent(ach.eventName);
    setEditAchDate(ach.date);
    setEditAchMedal(ach.medal);
    setEditAchDesc(ach.description);
  };

  const handleSaveEditAch = (id: string) => {
    onUpdateAchievement(id, {
      title: editAchTitle,
      eventName: editAchEvent,
      date: editAchDate,
      medal: editAchMedal,
      description: editAchDesc,
    });
    setEditingAchId(null);
    showToast('Milestone updated successfully!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div
      id="home-section"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 rounded-2xl bg-slate-900 border border-slate-755 text-white py-3 px-5 shadow-lg flex items-center gap-2.5 font-sans text-xs font-semibold"
          >
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner / Introduction */}
      <section id="club-hero" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-b from-slate-50 via-white to-slate-50 p-8 sm:p-12 shadow-xs">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-slate-100 opacity-50 blur-3xl"></div>
        <div className="relative max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 font-mono text-[10px] font-semibold text-white tracking-wider uppercase">
              <Target className="h-3 w-3" />
              Competitive Minds
            </div>
            {isAdmin && (
              <button
                id="edit-intro-btn"
                onClick={() => setIsEditingIntro(!isEditingIntro)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-1.5 px-3 font-sans text-xs font-bold text-slate-700 transition"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit Club Banner
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isEditingIntro ? (
              <motion.form
                id="edit-intro-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onSubmit={handleSaveIntro}
                className="space-y-4 bg-slate-100/80 p-6 rounded-2xl border border-slate-200 mt-4 outline-none"
              >
                <div className="space-y-1">
                  <label className="font-sans text-[11px] font-bold text-slate-600 block">Club Header Main Title</label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:ring-1 focus:ring-slate-350 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[11px] font-bold text-slate-600 block">Subtitle/Tagline Summary</label>
                  <input
                    type="text"
                    value={editedSubtitle}
                    onChange={(e) => setEditedSubtitle(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:ring-1 focus:ring-slate-350 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[11px] font-bold text-slate-600 block">Detailed Paragraph</label>
                  <textarea
                    rows={4}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:ring-1 focus:ring-slate-350 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[11px] font-bold text-slate-600 block">Mismatch / Student Running Banner</label>
                  <input
                    type="text"
                    value={editedMismatchBanner}
                    onChange={(e) => setEditedMismatchBanner(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:ring-1 focus:ring-slate-350 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingIntro(false);
                      setEditedTitle(teamIntro.title);
                      setEditedSubtitle(teamIntro.subtitle);
                      setEditedDescription(teamIntro.description);
                      setEditedMismatchBanner(teamIntro.mismatchBanner);
                    }}
                    className="rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-2 px-4 font-sans text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 py-2 px-4 font-sans text-xs font-bold"
                  >
                    Save Header Text
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4.5xl leading-tight">
                  {teamIntro.title}
                </h2>
                <p className="font-sans text-lg font-medium text-slate-600">
                  {teamIntro.subtitle}
                </p>
                <p className="font-sans text-sm text-slate-500 leading-relaxed max-w-2xl">
                  {teamIntro.description}
                </p>
                {teamIntro.mismatchBanner && (
                  <p className="font-sans text-[11px] italic text-slate-400 border-l-2 border-slate-300 pl-3">
                    {teamIntro.mismatchBanner}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => onNavigate('events')}
              className="group flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 font-sans text-xs font-semibold text-white transition-all hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Check Team Calendar
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-sans text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 cursor-pointer shadow-xs"
            >
              Browse References & FAQ
            </button>
          </div>
        </div>
      </section>

      {/* Key Stats Grid */}
      <section id="key-statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Active Members", count: membersCount, icon: Flame, color: "text-amber-500 bg-amber-50" },
          { label: "Medals & Honors", count: achievements.length, icon: Trophy, color: "text-violet-500 bg-violet-50" },
          { label: "Resources Defined", count: resourcesCount, icon: BookOpen, color: "text-emerald-500 bg-emerald-50" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs transition-hover hover:border-slate-350"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <span className="font-mono text-3xl font-bold text-slate-900">
                  {stat.count}
                </span>
                <p className="mt-1 font-sans text-[11px] font-medium text-slate-500 uppercase tracking-widest leading-none">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Past Achievements & Wins */}
      <section id="past-achievements" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-sans text-xl font-bold text-slate-900">Past Milestones & Achievements</h3>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
              Reflecting our historical excellence
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                id="add-ach-btn"
                onClick={() => setIsAddingAch(!isAddingAch)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-650 hover:bg-slate-900 bg-slate-900 py-1.5 px-3.5 font-sans text-xs font-bold text-white transition shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Milestone
              </button>
            )}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-amber-400 shadow-sm">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Milestone add block */}
        <AnimatePresence>
          {isAddingAch && (
            <motion.form
              id="add-achievement-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddAchSubmit}
              className="bg-slate-100/70 rounded-2xl p-6 border border-slate-200 grid gap-4 sm:grid-cols-2 shadow-inner"
            >
              <div className="sm:col-span-2">
                <h4 className="font-sans text-sm font-bold text-slate-950">Record New Team Milestone</h4>
                <p className="font-sans text-xs text-slate-500">Capture medals, sweep scores, and honorary rankings here.</p>
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11.5px] font-semibold text-slate-700">Milestone Title</label>
                <input
                  type="text"
                  placeholder="e.g. Regional Sweep Victory"
                  required
                  value={newAchTitle}
                  onChange={(e) => setNewAchTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11.5px] font-semibold text-slate-700">Official Tournament/Event Name</label>
                <input
                  type="text"
                  placeholder="e.g. AMC Regional / USACO"
                  required
                  value={newAchEvent}
                  onChange={(e) => setNewAchEvent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11.5px] font-semibold text-slate-700">Date Awarded</label>
                <input
                  type="date"
                  required
                  value={newAchDate}
                  onChange={(e) => setNewAchDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11.5px] font-semibold text-slate-700">Medal Classification</label>
                <select
                  value={newAchMedal}
                  onChange={(e) => setNewAchMedal(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                >
                  <option value="Gold">Gold Medal</option>
                  <option value="Silver">Silver Medal</option>
                  <option value="Bronze">Bronze Medal</option>
                  <option value="First">1st Place / Championship</option>
                  <option value="Special">Special Honor / Mention</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-sans text-[11.5px] font-semibold text-slate-700">Honor Description & Stats</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Finished with 95%+ precision on combinatorial problems..."
                  value={newAchDesc}
                  onChange={(e) => setNewAchDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAch(false)}
                  className="rounded-xl border border-slate-200 bg-white py-2 px-4 font-sans text-xs font-semibold text-slate-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 text-white py-2 px-5 font-sans text-xs font-semibold"
                >
                  Create Record
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* List of achievements cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => {
            const isEditingThis = editingAchId === achievement.id;

            let badgeStyle = "bg-amber-50 border-amber-200 text-amber-700";
            if (achievement.medal === "Gold" || achievement.medal === "First") {
              badgeStyle = "bg-amber-100 border-amber-300 text-amber-800 font-semibold";
            } else if (achievement.medal === "Silver") {
              badgeStyle = "bg-slate-100 border-slate-200 text-slate-700";
            } else if (achievement.medal === "Bronze") {
              badgeStyle = "bg-orange-50 border-orange-200 text-orange-700";
            } else if (achievement.medal === "Special") {
              badgeStyle = "bg-violet-50 border-violet-200 text-violet-750";
            }

            if (isEditingThis) {
              return (
                <div
                  key={achievement.id}
                  className="flex flex-col gap-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50/20 p-5 shadow-xs"
                >
                  <span className="font-mono text-[9px] font-bold text-indigo-700 uppercase">Updating Milestone</span>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editAchTitle}
                      onChange={(e) => setEditAchTitle(e.target.value)}
                      placeholder="Milestone Title"
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editAchEvent}
                      onChange={(e) => setEditAchEvent(e.target.value)}
                      placeholder="Tournament/Event"
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="date"
                        value={editAchDate}
                        onChange={(e) => setEditAchDate(e.target.value)}
                        className="w-1/2 rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-[10px] focus:outline-none"
                      />
                      <select
                        value={editAchMedal}
                        onChange={(e) => setEditAchMedal(e.target.value as any)}
                        className="w-1/2 rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-[10px] focus:outline-none"
                      >
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Bronze">Bronze</option>
                        <option value="First">First</option>
                        <option value="Special">Special</option>
                      </select>
                    </div>
                    <textarea
                      value={editAchDesc}
                      onChange={(e) => setEditAchDesc(e.target.value)}
                      placeholder="Milestone stats..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-1.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingAchId(null)}
                      className="rounded-lg border border-slate-200 bg-white py-1 px-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEditAch(achievement.id)}
                      className="rounded-lg bg-slate-900 py-1 px-3 text-[10px] font-bold text-white hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-150 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors cursor-default"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      title="Edit Past Milestone"
                      onClick={() => startEditAch(achievement)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      title="Delete Past Milestone"
                      onClick={() => {
                        if (confirm(`Remove "${achievement.title}" permanently?`)) {
                          onDeleteAchievement(achievement.id);
                          showToast('Milestone record removed.');
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-rose-50 text-slate-600 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 mr-10">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${badgeStyle}`}>
                      <Award className="h-3 w-3" />
                      {achievement.medal === "First" ? "1st Place" : `${achievement.medal} Medal`}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {achievement.date}
                    </span>
                  </div>
                  <h4 className="font-sans text-base font-bold text-slate-900 mt-1 leading-snug">
                    {achievement.title}
                  </h4>
                  <p className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {achievement.eventName}
                  </p>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
