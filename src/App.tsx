/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import TeamSection from './components/TeamSection';
import EventsSection from './components/EventsSection';
import ResourcesSection from './components/ResourcesSection';

import {
  initialMembers,
  initialAlumni,
  initialAchievements,
  initialEvents,
  initialResources,
  initialFAQs,
} from './data';

import { MeetEvent, Member, Alumni, Achievement, ResourceItem, FAQItem } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Stateful text & content arrays with localstorage backups
  const [intro, setIntro] = useState(() => {
    const saved = localStorage.getItem('olympiad_portal_team_intro_v2');
    return saved ? JSON.parse(saved) : {
      title: "The Olympiad Coding & Mathematics Team",
      subtitle: "Challenging elite minds in algorithmic problem solving and advanced mathematics.",
      description: "Established in 2021, our team brings together the brightest analytical minds to compete in regional, national, and international arenas including ICPC, USACO, USAMO, and Putnam. We practice twice a week, solving intricate combinatorial puzzles, dynamic programming matrices, and number theoretic lemmas. We believe in collaborative excellence, shared intelligence, and rigorous intellectual growth.",
      mismatchBanner: "Our club is fully student-run, featuring mentoring pipelines and open-source study guides for high-stakes problem-solving competitions."
    };
  });

  const [events, setEvents] = useState<MeetEvent[]>(() => {
    const saved = localStorage.getItem('olympiad_portal_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('olympiad_portal_members_v2');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [alumniList, setAlumniList] = useState<Alumni[]>(() => {
    const saved = localStorage.getItem('olympiad_portal_alumni_v2');
    return saved ? JSON.parse(saved) : initialAlumni;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('olympiad_portal_achievements_v2');
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('olympiad_portal_resources_v2');
    return saved ? JSON.parse(saved) : initialResources;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem('olympiad_portal_faqs_v2');
    return saved ? JSON.parse(saved) : initialFAQs;
  });

  // Serialization effects to synchronize with localStorage
  useEffect(() => {
    localStorage.setItem('olympiad_portal_team_intro_v2', JSON.stringify(intro));
  }, [intro]);

  useEffect(() => {
    localStorage.setItem('olympiad_portal_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('olympiad_portal_members_v2', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('olympiad_portal_alumni_v2', JSON.stringify(alumniList));
  }, [alumniList]);

  useEffect(() => {
    localStorage.setItem('olympiad_portal_achievements_v2', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('olympiad_portal_resources_v2', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('olympiad_portal_faqs_v2', JSON.stringify(faqs));
  }, [faqs]);

  // Handle scheduling new team meeting / event
  const handleAddEvent = (newEvent: Omit<MeetEvent, 'id' | 'attendeesCount'>) => {
    const eventWithId: MeetEvent = {
      ...newEvent,
      id: `e_${Date.now()}`,
      attendeesCount: Math.floor(Math.random() * 8) + 5, // mock initial registrants
    };
    setEvents(prev => [eventWithId, ...prev]);
  };

  // CMS: update intro paragraph texts
  const handleUpdateIntro = (updatedIntro: typeof intro) => {
    setIntro(updatedIntro);
  };

  // CMS: Achievements CRUD
  const handleAddAchievement = (newAch: Omit<Achievement, 'id'>) => {
    const created: Achievement = {
      ...newAch,
      id: `ach_${Date.now()}`,
    };
    setAchievements(prev => [created, ...prev]);
  };

  const handleUpdateAchievement = (id: string, updatedFields: Partial<Achievement>) => {
    setAchievements(prev =>
      prev.map(ach => (ach.id === id ? { ...ach, ...updatedFields } : ach))
    );
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(ach => ach.id !== id));
  };

  // CMS: Members CRUD
  const handleAddMember = (newMem: Omit<Member, 'id' | 'avatarSeed'>) => {
    const created: Member = {
      ...newMem,
      id: `m_${Date.now()}`,
      avatarSeed: newMem.name.toLowerCase().replace(/\s+/g, '_'),
    };
    setMembers(prev => [...prev, created]);
  };

  const handleUpdateMember = (id: string, updatedFields: Partial<Member>) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updatedFields } : m))
    );
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // CMS: Alumni CRUD
  const handleAddAlumni = (newAlum: Omit<Alumni, 'id' | 'avatarSeed'>) => {
    const created: Alumni = {
      ...newAlum,
      id: `a_${Date.now()}`,
      avatarSeed: newAlum.name.toLowerCase().replace(/\s+/g, '_'),
    };
    setAlumniList(prev => [...prev, created]);
  };

  const handleUpdateAlumni = (id: string, updatedFields: Partial<Alumni>) => {
    setAlumniList(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updatedFields } : a))
    );
  };

  const handleDeleteAlumni = (id: string) => {
    setAlumniList(prev => prev.filter(a => a.id !== id));
  };

  // CMS: Resources CRUD
  const handleAddResource = (newRes: Omit<ResourceItem, 'id'>) => {
    const created: ResourceItem = {
      ...newRes,
      id: `res_${Date.now()}`,
    };
    setResources(prev => [created, ...prev]);
  };

  const handleUpdateResource = (id: string, updatedFields: Partial<ResourceItem>) => {
    setResources(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updatedFields } : r))
    );
  };

  const handleDeleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  // CMS: FAQ CRUD
  const handleAddFAQ = (newFaq: Omit<FAQItem, 'id'>) => {
    const created: FAQItem = {
      ...newFaq,
      id: `faq_${Date.now()}`,
    };
    setFaqs(prev => [created, ...prev]);
  };

  const handleUpdateFAQ = (id: string, updatedFields: Partial<FAQItem>) => {
    setFaqs(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updatedFields } : f))
    );
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  // Renders correct active tab component
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeSection
            isAdmin={isAdmin}
            achievements={achievements}
            upcomingEventsCount={events.length}
            membersCount={members.length}
            onNavigate={(tab) => setActiveTab(tab)}
            teamIntro={intro}
            onUpdateIntro={handleUpdateIntro}
            onAddAchievement={handleAddAchievement}
            onUpdateAchievement={handleUpdateAchievement}
            onDeleteAchievement={handleDeleteAchievement}
          />
        );
      case 'team':
        return (
          <TeamSection
            isAdmin={isAdmin}
            members={members}
            alumniList={alumniList}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onAddAlumni={handleAddAlumni}
            onUpdateAlumni={handleUpdateAlumni}
            onDeleteAlumni={handleDeleteAlumni}
          />
        );
      case 'events':
        return <EventsSection events={events} onAddEvent={handleAddEvent} />;
      case 'resources':
        return (
          <ResourcesSection
            isAdmin={isAdmin}
            resources={resources}
            faqs={faqs}
            onAddResource={handleAddResource}
            onUpdateResource={handleUpdateResource}
            onDeleteResource={handleDeleteResource}
            onAddFAQ={handleAddFAQ}
            onUpdateFAQ={handleUpdateFAQ}
            onDeleteFAQ={handleDeleteFAQ}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50/50 flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      {/* Portals Master Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      {/* Main Core Stage viewport */}
      <main id="app-main-content" className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id="tab-transition-wrapper"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footnote / Footer */}
      <footer id="app-footer" className="w-full border-t border-slate-250 bg-white py-8 px-6 mt-16 mt-auto">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-sans text-xs text-slate-500 font-semibold">
              © {new Date().getFullYear()} Olympiad Team Hub. Created for academic and competitive coaching.
            </p>
            <p className="font-sans text-[10px] text-slate-400 mt-1">
              Maintained with deep appreciation for open-source algorithmic resources and mathematics.
            </p>
          </div>
          
          <div className="flex gap-4 font-sans text-xs font-semibold text-slate-600">
            <a href="https://usaco.org" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">USACO</a>
            <span className="text-slate-200 select-none">|</span>
            <a href="https://icpc.global" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">ICPC</a>
            <span className="text-slate-200 select-none">|</span>
            <a href="https://projecteuler.net" target="_blank" rel="noreferrer" className="hover:text-slate-950 transition-colors">Euler</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
