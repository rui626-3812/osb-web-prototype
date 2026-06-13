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

  // Guard reference to prevent server polling from overwriting local changes immediately
  const lastPushTimeRef = React.useRef<number>(0);

  // Helper to push modified state data to Express database
  const pushToServer = async (payload: {
    intro?: typeof intro;
    events?: MeetEvent[];
    members?: Member[];
    alumniList?: Alumni[];
    achievements?: Achievement[];
    resources?: ResourceItem[];
    faqs?: FAQItem[];
    titles?: typeof titles;
    schedulePassword?: string;
  }) => {
    lastPushTimeRef.current = Date.now();
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        if (result && result.success && result.data) {
          if (payload.intro) setIntro(result.data.intro);
          if (payload.events) setEvents(result.data.events);
          if (payload.members) setMembers(result.data.members);
          if (payload.alumniList) setAlumniList(result.data.alumniList);
          if (payload.achievements) setAchievements(result.data.achievements);
          if (payload.resources) setResources(result.data.resources);
          if (payload.faqs) setFaqs(result.data.faqs);
          if (payload.titles) setTitles(result.data.titles);
          if (payload.schedulePassword !== undefined) setSchedulePassword(result.data.schedulePassword);
        }
      }
    } catch (err) {
      console.error('Failed to sync state changes with server', err);
    }
  };

  // Titles state dictionary
  const [titles, setTitles] = useState(() => {
    const saved = localStorage.getItem('olympiand_portal_titles');
    return saved ? JSON.parse(saved) : {
      brandName: "OSB Portal",
      brandSubtitle: "Ocean Science Hub",
      teamTitle: "Active Roster",
      teamSubtitle: "Meet our competitors and coaches guiding our divisions.",
      alumniTitle: "Alumni & Legacy",
      alumniSubtitle: "Previous outstanding minds who paved the scientific road.",
      eventsTitle: "Meets & Workout Schedule",
      eventsSubtitle: "Upcoming team meetings, mock trials, and regional qualifier dates.",
      resourcesTitle: "Curated References & Resources",
      resourcesSubtitle: "Core documentation, study kits, templates, and training datasets.",
      faqsTitle: "Frequently Asked Questions",
      faqsSubtitle: "Everything you need to know regarding qualifiers, practices, and academic requirements."
    };
  });

  // Scheduling password configured on server
  const [schedulePassword, setSchedulePassword] = useState<string>(() => {
    const saved = localStorage.getItem('olympiad_portal_schedule_password');
    return saved || "239power";
  });

  // Stateful text & content arrays with localstorage backups for instant initial paint
  const [intro, setIntro] = useState(() => {
    const saved = localStorage.getItem('olympiad_portal_team_intro_v2');
    return saved ? JSON.parse(saved) : {
      title: "OSB Portal",
      subtitle: "Ocean Science Hub",
      description: "Established in 2021, our team brings together the brightest analytical minds to explore oceanography, fluid dynamics, marine biochemistry, and computational environmental modeling. We compete in national and global olympiads, researching physical ocean mechanics, chemical marine tracers, and ecological trophic webs. We believe in sharing critical marine science tools, collaborative field studies, and rigorous mathematical prep for all elite qualifiers.",
      mismatchBanner: "Our hub is completely student-led, providing reference files, curated practice sets, and mentoring pipelines for next-generation oceanographers."
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

  // Master server-side state synchronizer with 5s delta checks
  useEffect(() => {
    let active = true;
    const fetchLatestServerData = async () => {
      // Abort updating from server if the user recently performed local mutations
      if (Date.now() - lastPushTimeRef.current < 4000) {
        return;
      }
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to load server data');
        const data = await response.json();
        if (active && data) {
          // Double guard check after network round-trip completes
          if (Date.now() - lastPushTimeRef.current < 4000) {
            return;
          }
          if (data.intro) setIntro(data.intro);
          if (data.events) setEvents(data.events);
          if (data.members) setMembers(data.members);
          if (data.alumniList) setAlumniList(data.alumniList);
          if (data.achievements) setAchievements(data.achievements);
          if (data.resources) setResources(data.resources);
          if (data.faqs) setFaqs(data.faqs);
          if (data.titles) setTitles(data.titles);
          if (data.schedulePassword !== undefined) setSchedulePassword(data.schedulePassword);
        }
      } catch (err) {
        console.error('Failed to sync master portal state:', err);
      }
    };

    fetchLatestServerData();

    // Poll server database state every 5 seconds to automatically sync multiple concurrent client instances
    const timer = setInterval(fetchLatestServerData, 5000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  // Sync state variables to LocalStorage for local quick fallback caches
  useEffect(() => {
    localStorage.setItem('olympiand_portal_titles', JSON.stringify(titles));
  }, [titles]);

  useEffect(() => {
    localStorage.setItem('olympiad_portal_schedule_password', schedulePassword);
  }, [schedulePassword]);

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
      attendeesCount: 0,
      attendees: [],
    };
    const next = [eventWithId, ...events];
    setEvents(next);
    pushToServer({ events: next });
  };

  const handleUpdateEvent = (id: string, updatedFields: Partial<MeetEvent>) => {
    const next = events.map(ev => (ev.id === id ? { ...ev, ...updatedFields } : ev));
    setEvents(next);
    pushToServer({ events: next });
  };

  const handleDeleteEvent = (id: string) => {
    const next = events.filter(ev => ev.id !== id);
    setEvents(next);
    pushToServer({ events: next });
  };

  const handleUpdateTitles = (updatedTitles: Partial<typeof titles>) => {
    const next = { ...titles, ...updatedTitles };
    setTitles(next);
    pushToServer({ titles: next });
  };

  // CMS: update intro paragraph texts
  const handleUpdateIntro = (updatedIntro: typeof intro) => {
    setIntro(updatedIntro);
    pushToServer({ intro: updatedIntro });
  };

  // CMS: Achievements CRUD
  const handleAddAchievement = (newAch: Omit<Achievement, 'id'>) => {
    const created: Achievement = {
      ...newAch,
      id: `ach_${Date.now()}`,
    };
    const next = [created, ...achievements];
    setAchievements(next);
    pushToServer({ achievements: next });
  };

  const handleUpdateAchievement = (id: string, updatedFields: Partial<Achievement>) => {
    const next = achievements.map(ach => (ach.id === id ? { ...ach, ...updatedFields } : ach));
    setAchievements(next);
    pushToServer({ achievements: next });
  };

  const handleDeleteAchievement = (id: string) => {
    const next = achievements.filter(ach => ach.id !== id);
    setAchievements(next);
    pushToServer({ achievements: next });
  };

  // CMS: Members CRUD
  const handleAddMember = (newMem: Omit<Member, 'id' | 'avatarSeed'>) => {
    const created: Member = {
      ...newMem,
      id: `m_${Date.now()}`,
      avatarSeed: newMem.name.toLowerCase().replace(/\s+/g, '_'),
    };
    const next = [...members, created];
    setMembers(next);
    pushToServer({ members: next });
  };

  const handleUpdateMember = (id: string, updatedFields: Partial<Member>) => {
    const next = members.map(m => (m.id === id ? { ...m, ...updatedFields } : m));
    setMembers(next);
    pushToServer({ members: next });
  };

  const handleDeleteMember = (id: string) => {
    const next = members.filter(m => m.id !== id);
    setMembers(next);
    pushToServer({ members: next });
  };

  // CMS: Alumni CRUD
  const handleAddAlumni = (newAlum: Omit<Alumni, 'id' | 'avatarSeed'>) => {
    const created: Alumni = {
      ...newAlum,
      id: `a_${Date.now()}`,
      avatarSeed: newAlum.name.toLowerCase().replace(/\s+/g, '_'),
    };
    const next = [...alumniList, created];
    setAlumniList(next);
    pushToServer({ alumniList: next });
  };

  const handleUpdateAlumni = (id: string, updatedFields: Partial<Alumni>) => {
    const next = alumniList.map(a => (a.id === id ? { ...a, ...updatedFields } : a));
    setAlumniList(next);
    pushToServer({ alumniList: next });
  };

  const handleDeleteAlumni = (id: string) => {
    const next = alumniList.filter(a => a.id !== id);
    setAlumniList(next);
    pushToServer({ alumniList: next });
  };

  // CMS: Resources CRUD
  const handleAddResource = (newRes: Omit<ResourceItem, 'id'>) => {
    const created: ResourceItem = {
      ...newRes,
      id: `res_${Date.now()}`,
    };
    const next = [created, ...resources];
    setResources(next);
    pushToServer({ resources: next });
  };

  const handleUpdateResource = (id: string, updatedFields: Partial<ResourceItem>) => {
    const next = resources.map(r => (r.id === id ? { ...r, ...updatedFields } : r));
    setResources(next);
    pushToServer({ resources: next });
  };

  const handleDeleteResource = (id: string) => {
    const next = resources.filter(r => r.id !== id);
    setResources(next);
    pushToServer({ resources: next });
  };

  // CMS: FAQ CRUD
  const handleAddFAQ = (newFaq: Omit<FAQItem, 'id'>) => {
    const created: FAQItem = {
      ...newFaq,
      id: `faq_${Date.now()}`,
    };
    const next = [created, ...faqs];
    setFaqs(next);
    pushToServer({ faqs: next });
  };

  const handleUpdateFAQ = (id: string, updatedFields: Partial<FAQItem>) => {
    const next = faqs.map(f => (f.id === id ? { ...f, ...updatedFields } : f));
    setFaqs(next);
    pushToServer({ faqs: next });
  };

  const handleDeleteFAQ = (id: string) => {
    const next = faqs.filter(f => f.id !== id);
    setFaqs(next);
    pushToServer({ faqs: next });
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
            titles={titles}
            onUpdateTitles={handleUpdateTitles}
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
        return (
          <EventsSection 
            isAdmin={isAdmin}
            titles={titles}
            onUpdateTitles={handleUpdateTitles}
            events={events} 
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            schedulePassword={schedulePassword}
            onUpdateSchedulePassword={(pw) => {
              setSchedulePassword(pw);
              pushToServer({ schedulePassword: pw });
            }}
          />
        );
      case 'resources':
        return (
          <ResourcesSection
            isAdmin={isAdmin}
            titles={titles}
            onUpdateTitles={handleUpdateTitles}
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
      <Header activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} titles={titles} onUpdateTitles={handleUpdateTitles} />

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
