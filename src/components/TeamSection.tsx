/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Member, Alumni } from '../types';
import { Search, Sparkles, GraduationCap, Github, Linkedin, Briefcase, Award, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TeamSectionProps {
  isAdmin: boolean;
  titles: {
    teamTitle: string;
    teamSubtitle: string;
    alumniTitle: string;
    alumniSubtitle: string;
    [key: string]: string;
  };
  onUpdateTitles: (updated: { [key: string]: string }) => void;
  members: Member[];
  alumniList: Alumni[];
  onAddMember: (member: Omit<Member, 'id' | 'avatarSeed'>) => void;
  onUpdateMember: (id: string, updated: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
  onAddAlumni: (alumni: Omit<Alumni, 'id' | 'avatarSeed'>) => void;
  onUpdateAlumni: (id: string, updated: Partial<Alumni>) => void;
  onDeleteAlumni: (id: string) => void;
}

export default function TeamSection({
  isAdmin,
  titles,
  onUpdateTitles,
  members,
  alumniList,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onAddAlumni,
  onUpdateAlumni,
  onDeleteAlumni,
}: TeamSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Coach' | 'Captain' | 'Member'>('All');

  // Interactive UI states for Admin Mode
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isAddingAlumni, setIsAddingAlumni] = useState(false);

  // States to edit section header titles staterfully
  const [isEditingTeamHeader, setIsEditingTeamHeader] = useState(false);
  const [teamTitle, setTeamTitle] = useState(titles.teamTitle || "Active Roster");
  const [teamSubtitle, setTeamSubtitle] = useState(titles.teamSubtitle || "Meet our competitors and coaches");

  const [isEditingAlumniHeader, setIsEditingAlumniHeader] = useState(false);
  const [alumniTitle, setAlumniTitle] = useState(titles.alumniTitle || "Alumni & Legacy");
  const [alumniSubtitle, setAlumniSubtitle] = useState(titles.alumniSubtitle || "Previous stars who paved the algorithmic road");

  const handleSaveTeamHeader = () => {
    onUpdateTitles({ teamTitle, teamSubtitle });
    setIsEditingTeamHeader(false);
  };

  const handleSaveAlumniHeader = () => {
    onUpdateTitles({ alumniTitle, alumniSubtitle });
    setIsEditingAlumniHeader(false);
  };

  // New member inputs
  const [newMemName, setNewMemName] = useState('');
  const [newMemRole, setNewMemRole] = useState<'Coach' | 'Captain' | 'Co-Captain' | 'Member'>('Member');
  const [newMemSpecialty, setNewMemSpecialty] = useState('');
  const [newMemBio, setNewMemBio] = useState('');
  const [newMemJointYear, setNewMemJointYear] = useState(new Date().getFullYear());
  const [newMemHonorsRaw, setNewMemHonorsRaw] = useState(''); // comma-separated

  // New alumni inputs
  const [newAlumName, setNewAlumName] = useState('');
  const [newAlumGradYear, setNewAlumGradYear] = useState(new Date().getFullYear());
  const [newAlumRole, setNewAlumRole] = useState('');
  const [newAlumAch, setNewAlumAch] = useState('');

  // Editing states
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editMemName, setEditMemName] = useState('');
  const [editMemRole, setEditMemRole] = useState<'Coach' | 'Captain' | 'Co-Captain' | 'Member'>('Member');
  const [editMemSpecialty, setEditMemSpecialty] = useState('');
  const [editMemBio, setEditMemBio] = useState('');
  const [editMemJointYear, setEditMemJointYear] = useState(2025);
  const [editMemHonorsRaw, setEditMemHonorsRaw] = useState('');

  const [editingAlumniId, setEditingAlumniId] = useState<string | null>(null);
  const [editAlumName, setEditAlumName] = useState('');
  const [editAlumGradYear, setEditAlumGradYear] = useState(2025);
  const [editAlumRole, setEditAlumRole] = useState('');
  const [editAlumAch, setEditAlumAch] = useState('');

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName) return;
    const honors = newMemHonorsRaw
      ? newMemHonorsRaw.split(',').map((h) => h.trim()).filter(Boolean)
      : [];
    onAddMember({
      name: newMemName,
      role: newMemRole,
      specialty: newMemSpecialty,
      bio: newMemBio,
      joinedYear: Number(newMemJointYear),
      achievements: honors,
    });
    setIsAddingMember(false);
    setNewMemName('');
    setNewMemSpecialty('');
    setNewMemBio('');
    setNewMemHonorsRaw('');
    showToast('Team member added to the roster.');
  };

  const handleAddAlumniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumName) return;
    onAddAlumni({
      name: newAlumName,
      graduationYear: Number(newAlumGradYear),
      currentRole: newAlumRole,
      achievement: newAlumAch,
    });
    setIsAddingAlumni(false);
    setNewAlumName('');
    setNewAlumRole('');
    setNewAlumAch('');
    showToast('Alumni logged successfully.');
  };

  const startEditMember = (m: Member) => {
    setEditingMemberId(m.id);
    setEditMemName(m.name);
    setEditMemRole(m.role as any);
    setEditMemSpecialty(m.specialty);
    setEditMemBio(m.bio);
    setEditMemJointYear(m.joinedYear);
    setEditMemHonorsRaw(m.achievements ? m.achievements.join(', ') : '');
  };

  const handleSaveMemberEdit = (id: string) => {
    const honors = editMemHonorsRaw
      ? editMemHonorsRaw.split(',').map((h) => h.trim()).filter(Boolean)
      : [];
    onUpdateMember(id, {
      name: editMemName,
      role: editMemRole,
      specialty: editMemSpecialty,
      bio: editMemBio,
      joinedYear: Number(editMemJointYear),
      achievements: honors,
    });
    setEditingMemberId(null);
    showToast('Member profile updated.');
  };

  const startEditAlumni = (a: Alumni) => {
    setEditingAlumniId(a.id);
    setEditAlumName(a.name);
    setEditAlumGradYear(a.graduationYear);
    setEditAlumRole(a.currentRole);
    setEditAlumAch(a.achievement);
  };

  const handleSaveAlumniEdit = (id: string) => {
    onUpdateAlumni(id, {
      name: editAlumName,
      graduationYear: Number(editAlumGradYear),
      currentRole: editAlumRole,
      achievement: editAlumAch,
    });
    setEditingAlumniId(null);
    showToast('Alumni record updated.');
  };

  // SVG stylized avatars to fit unique seeds with geometric shapes
  const getAvatarCircle = (seed: string, name: string) => {
    const tones = [
      { bg: "bg-slate-900 text-white", border: "border-slate-800" },
      { bg: "bg-indigo-900 text-indigo-100", border: "border-indigo-800" },
      { bg: "bg-cyan-950 text-cyan-200", border: "border-cyan-800" },
      { bg: "bg-teal-950 text-teal-200", border: "border-teal-800" },
      { bg: "bg-orange-950 text-orange-200", border: "border-orange-850" },
    ];
    const index = (name.charCodeAt(0) + name.length) % tones.length;
    const tone = tones[index];
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);

    return (
      <div className={`relative flex h-14 w-14 shrink-0 select-none items-center justify-center rounded-2xl border-2 font-mono text-base font-bold shadow-xs ${tone.bg} ${tone.border}`}>
        {initials}
        <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] text-slate-900 font-bold border border-slate-200">
          ★
        </div>
      </div>
    );
  };

  // Filter members based on search query and selected role
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
      const roleGroup = member.role === 'Coach' ? 'Coach' :
                        (member.role === 'Captain' || member.role === 'Co-Captain') ? 'Captain' : 'Member';

      const matchesRole = selectedRole === 'All' || roleGroup === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, selectedRole]);

  return (
    <div id="team-section" className="space-y-12">
      {/* Toast alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 rounded-2xl bg-slate-900 text-white py-3 px-5 shadow-lg flex items-center gap-2 font-sans text-xs font-semibold"
          >
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and search panel */}
      <section id="team-header-panel" className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-6">
        <div>
          {isEditingTeamHeader && isAdmin ? (
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 max-w-md">
              <input
                type="text"
                value={teamTitle}
                onChange={(e) => setTeamTitle(e.target.value)}
                className="w-full font-sans text-sm font-bold text-slate-950 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="Roster Title"
              />
              <textarea
                value={teamSubtitle}
                onChange={(e) => setTeamSubtitle(e.target.value)}
                className="w-full font-sans text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="Roster Subtitle"
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingTeamHeader(false)}
                  className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1 text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTeamHeader}
                  className="rounded-lg bg-slate-950 text-white px-3 py-1 text-[10px] font-bold"
                >
                  Save Title
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative flex items-center gap-2">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
                    {titles.teamTitle || teamTitle}
                  </h2>
                  {isAdmin && (
                    <button
                      id="add-member-trigger-btn"
                      onClick={() => setIsAddingMember(!isAddingMember)}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 font-sans text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Competitor / Coach
                    </button>
                  )}
                </div>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                  {titles.teamSubtitle || teamSubtitle}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setTeamTitle(titles.teamTitle || teamTitle);
                    setTeamSubtitle(titles.teamSubtitle || teamSubtitle);
                    setIsEditingTeamHeader(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                  title="Edit team section headers"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role filter pills */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/50">
            {(['All', 'Coach', 'Captain', 'Member'] as const).map((role) => (
              <button
                key={role}
                id={`filter-role-${role.toLowerCase()}`}
                onClick={() => setSelectedRole(role)}
                className={`rounded-lg px-3 py-1 font-sans text-xs font-medium transition-all ${
                  selectedRole === role
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {role}s
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full max-w-xs md:w-64">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <input
              id="team-search-input"
              type="text"
              placeholder="Search member or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-9 font-sans text-xs transition-hover placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Add active member block */}
      <AnimatePresence>
        {isAddingMember && (
          <motion.form
            id="add-member-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddMemberSubmit}
            className="bg-slate-100/70 rounded-2xl p-6 border border-slate-200 grid gap-4 sm:grid-cols-2 shadow-inner"
          >
            <div className="sm:col-span-2 flex justify-between items-center">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-950">Add New Active Roster Profile</h4>
                <p className="font-sans text-xs text-slate-500">Provide stats and descriptors to feature below.</p>
              </div>
              <button type="button" onClick={() => setIsAddingMember(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-slate-600">Full Name</label>
              <input
                type="text"
                required
                value={newMemName}
                onChange={(e) => setNewMemName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-slate-600">Club Role Placement</label>
              <select
                value={newMemRole}
                onChange={(e) => setNewMemRole(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
              >
                <option value="Member">General Roster Member</option>
                <option value="Captain">Team Captain</option>
                <option value="Co-Captain">Co-Captain</option>
                <option value="Coach">Academic Coach / Advisor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-slate-600">Core Specialty Focus</label>
              <input
                type="text"
                required
                value={newMemSpecialty}
                onChange={(e) => setNewMemSpecialty(e.target.value)}
                placeholder="e.g. Number Theory & Dynamic Programming"
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-slate-600">Joined Year</label>
              <input
                type="number"
                required
                value={newMemJointYear}
                onChange={(e) => setNewMemJointYear(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-sans text-[11px] font-bold text-slate-600">Bio / Background Description</label>
              <textarea
                rows={2}
                required
                value={newMemBio}
                onChange={(e) => setNewMemBio(e.target.value)}
                placeholder="Briefly review major olympiad background or core interests..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-sans text-[11px] font-bold text-slate-600 block">Key Honors & Medals (Separated by comma)</label>
              <input
                type="text"
                value={newMemHonorsRaw}
                onChange={(e) => setNewMemHonorsRaw(e.target.value)}
                placeholder="e.g. USACO Platinum Qualifier 2024, Putnam Top Score, IMO Silver"
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAddingMember(false)}
                className="rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-2 px-4 font-sans text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="submit"
                className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 py-2 px-5 font-sans text-xs font-semibold"
              >
                Log Member Profile
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Roster Cards Grid */}
      <section id="roster-grid">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="font-sans text-sm text-slate-400">No active members match your filter criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => {
              const isEditingThis = editingMemberId === member.id;

              if (isEditingThis) {
                return (
                  <div
                    key={member.id}
                    className="flex flex-col gap-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50/20 p-5 shadow-xs"
                  >
                    <span className="font-mono text-[9px] font-bold text-indigo-700 uppercase">Editing Member Profile</span>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editMemName}
                        onChange={(e) => setEditMemName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                      />
                      <select
                        value={editMemRole}
                        onChange={(e) => setEditMemRole(e.target.value as any)}
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                      >
                        <option value="Member">Member</option>
                        <option value="Captain">Captain</option>
                        <option value="Co-Captain">Co-Captain</option>
                        <option value="Coach">Coach</option>
                      </select>
                      <input
                        type="text"
                        value={editMemSpecialty}
                        onChange={(e) => setEditMemSpecialty(e.target.value)}
                        placeholder="Specialty"
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                      />
                      <input
                        type="number"
                        value={editMemJointYear}
                        onChange={(e) => setEditMemJointYear(Number(e.target.value))}
                        placeholder="Joined Year"
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                      />
                      <textarea
                        value={editMemBio}
                        onChange={(e) => setEditMemBio(e.target.value)}
                        placeholder="Bio description..."
                        rows={2}
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editMemHonorsRaw}
                        onChange={(e) => setEditMemHonorsRaw(e.target.value)}
                        placeholder="Honors (comma-separated)"
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-1.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingMemberId(null)}
                        className="rounded-lg border border-slate-200 bg-white py-1 px-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveMemberEdit(member.id)}
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
                  key={member.id}
                  layout
                  id={`member-card-${member.id}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-350 transition-colors"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-20 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Edit Profile"
                        onClick={() => startEditMember(member)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        title="Remove Profile"
                        onClick={() => {
                          if (confirm(`Remove ${member.name} from the active roster?`)) {
                            onDeleteMember(member.id);
                            showToast(`${member.name} removed.`);
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-rose-50 text-slate-600 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Photo row */}
                    <div className="flex gap-4">
                      {getAvatarCircle(member.avatarSeed || 'john', member.name)}
                      <div>
                        <span className={`inline-flex rounded-md px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${
                          member.role === 'Coach' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          (member.role === 'Captain' || member.role === 'Co-Captain') ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-slate-50 text-slate-600 border border-slate-100'
                        }`}>
                          {member.role}
                        </span>
                        <h4 className="font-sans text-base font-bold text-slate-900 mt-1 leading-snug">
                          {member.name}
                        </h4>
                        <p className="font-mono text-[10px] text-slate-400 leading-none mt-1">
                          Joined in {member.joinedYear}
                        </p>
                      </div>
                    </div>

                    {/* Specialty */}
                    <div className="space-y-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400 block leading-none">
                        Core Specialty
                      </span>
                      <p className="font-sans text-xs font-semibold text-slate-700">
                        {member.specialty}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="font-sans text-xs text-slate-500 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  {/* Achievements inline list */}
                  {member.achievements && member.achievements.length > 0 && (
                    <div className="mt-5 border-t border-slate-100 pt-4 space-y-1.5">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Award className="h-3 w-3 text-amber-500" /> Key Honors
                      </span>
                      <ul className="space-y-1">
                        {member.achievements.map((ach, idx) => (
                          <li key={idx} className="font-sans text-[11px] text-slate-600 flex items-start gap-1">
                            <span className="text-slate-400 select-none">•</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Alumni Legacy Section */}
      <section id="alumni-portfolio" className="border-t border-slate-200/80 pt-12 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {isEditingAlumniHeader && isAdmin ? (
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-full max-w-md">
              <input
                type="text"
                value={alumniTitle}
                onChange={(e) => setAlumniTitle(e.target.value)}
                className="w-full font-sans text-sm font-bold text-slate-950 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="Alumni Title"
              />
              <textarea
                value={alumniSubtitle}
                onChange={(e) => setAlumniSubtitle(e.target.value)}
                className="w-full font-sans text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="Alumni Subtitle"
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingAlumniHeader(false)}
                  className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1 text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAlumniHeader}
                  className="rounded-lg bg-slate-950 text-white px-3 py-1 text-[10px] font-bold"
                >
                  Save Title
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative flex items-center gap-2">
              <div>
                <h3 className="font-sans text-xl font-bold text-slate-950 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-slate-700" />
                  {titles.alumniTitle || alumniTitle}
                </h3>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                  {titles.alumniSubtitle || alumniSubtitle}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setAlumniTitle(titles.alumniTitle || alumniTitle);
                    setAlumniSubtitle(titles.alumniSubtitle || alumniSubtitle);
                    setIsEditingAlumniHeader(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                  title="Edit alumni section headers"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {isAdmin && (
            <button
              id="add-alumni-trigger-btn"
              onClick={() => setIsAddingAlumni(!isAddingAlumni)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-250 bg-white hover:bg-slate-50 py-1.5 px-3.5 font-sans text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Legacy Alumni
            </button>
          )}
        </div>

        {/* Add Alumni Form block */}
        <AnimatePresence>
          {isAddingAlumni && (
            <motion.form
              id="add-alumni-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddAlumniSubmit}
              className="bg-slate-100/70 rounded-2xl p-6 border border-slate-200 grid gap-4 sm:grid-cols-2 shadow-inner"
            >
              <div className="sm:col-span-2 flex justify-between items-center">
                <div>
                  <h4 className="font-sans text-sm font-bold text-slate-950">Add Alumni Achievement File</h4>
                  <p className="font-sans text-xs text-slate-500">Log graduated seniors along with current university or job roles.</p>
                </div>
                <button type="button" onClick={() => setIsAddingAlumni(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-650">Alumni Name</label>
                <input
                  type="text"
                  required
                  value={newAlumName}
                  onChange={(e) => setNewAlumName(e.target.value)}
                  placeholder="e.g. Frank Zhou"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-655">Graduation Year</label>
                <input
                  type="number"
                  required
                  value={newAlumGradYear}
                  onChange={(e) => setNewAlumGradYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-650">Current Professional/Academic Role</label>
                <input
                  type="text"
                  required
                  value={newAlumRole}
                  onChange={(e) => setNewAlumRole(e.target.value)}
                  placeholder="e.g. PhD Candidate in Modern Cryptography at MIT"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-655 block block">Major Undergraduate / Club Legacy Contribution</label>
                <textarea
                  rows={2}
                  required
                  value={newAlumAch}
                  onChange={(e) => setNewAlumAch(e.target.value)}
                  placeholder="e.g. ICPC World Finalist in 2023. Created our custom sorting libraries."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAlumni(false)}
                  className="rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-2 px-4 font-sans text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 py-2 px-5 font-sans text-xs font-semibold"
                >
                  Save Alumni File
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {alumniList.map((alumni) => {
            const isEditingAlum = editingAlumniId === alumni.id;
            const initials = alumni.name.split(' ').map(n => n[0]).join('').substring(0, 2);

            if (isEditingAlum) {
              return (
                <div
                  key={alumni.id}
                  className="flex flex-col gap-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50/20 p-5 shadow-xs bg-white"
                >
                  <span className="font-mono text-[9px] font-bold text-indigo-700 uppercase">Updating Alumni File</span>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editAlumName}
                      onChange={(e) => setEditAlumName(e.target.value)}
                      placeholder="Name"
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                    <input
                      type="number"
                      value={editAlumGradYear}
                      onChange={(e) => setEditAlumGradYear(Number(e.target.value))}
                      placeholder="Graduation Year"
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editAlumRole}
                      onChange={(e) => setEditAlumRole(e.target.value)}
                      placeholder="Current Role Placement"
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                    <textarea
                      value={editAlumAch}
                      onChange={(e) => setEditAlumAch(e.target.value)}
                      placeholder="Legacy contribution quote..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-1.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingAlumniId(null)}
                      className="rounded-lg border border-slate-250 bg-white py-1 px-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveAlumniEdit(alumni.id)}
                      className="rounded-lg bg-slate-900 py-1 px-3 text-[10px] font-bold text-white hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={alumni.id}
                id={`alumni-card-${alumni.id}`}
                className="group relative flex gap-4 rounded-2xl border border-slate-150 bg-slate-50/50 p-5 shadow-xs hover:bg-slate-50 transition-colors"
              >
                {isAdmin && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                    <button
                      title="Edit Alumni details"
                      onClick={() => startEditAlumni(alumni)}
                      className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      title="Delete Alumni details"
                      onClick={() => {
                        if (confirm(`Remove alum ${alumni.name} from public archives?`)) {
                          onDeleteAlumni(alumni.id);
                          showToast(`${alumni.name} file archived.`);
                        }
                      }}
                      className="p-1 rounded-md hover:bg-rose-50 text-slate-500 hover:text-rose-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Simplified Alumni Avatar */}
                <div className="flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-xl bg-slate-200 text-slate-700 border border-slate-300 font-mono text-xs font-semibold">
                  {initials}
                </div>
                
                <div className="space-y-2 mr-6">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full inline-block">
                      Class of {alumni.graduationYear}
                    </span>
                    <h4 className="font-sans text-sm font-semibold text-slate-900 mt-1">
                      {alumni.name}
                    </h4>
                  </div>

                  {/* Current Position */}
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <Briefcase className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                    <p className="font-sans text-[11px] font-medium leading-tight">
                      {alumni.currentRole}
                    </p>
                  </div>

                  <p className="font-sans text-[11px] text-slate-500 leading-relaxed italic border-l border-slate-300 pl-2">
                    "{alumni.achievement}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
