/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Member {
  id: string;
  name: string;
  role: 'Captain' | 'Co-Captain' | 'Coach' | 'Member';
  bio: string;
  specialty: string;
  achievements: string[];
  avatarSeed: string; // for custom stylized avatar matching their persona
  joinedYear: number;
}

export interface Alumni {
  id: string;
  name: string;
  graduationYear: number;
  currentRole: string; // e.g. "PhD Candidate at MIT", "Software Engineer at Google"
  achievement: string;
  avatarSeed: string;
}

export interface Achievement {
  id: string;
  title: string;
  eventName: string;
  date: string; // e.g. "2025-11-23"
  medal: 'Gold' | 'Silver' | 'Bronze' | 'First' | 'Special';
  description: string;
}

export interface MeetEvent {
  id: string;
  title: string;
  type: 'Practice' | 'Local Meet' | 'Regional Contest' | 'National Olympiad';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  description: string;
  attendeesCount: number;
  tags: string[];
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  points: number;
  sampleInput?: string;
  sampleOutput?: string;
  correctAnswer: string; // For auto-answering check
  hints?: string[];
}

export interface ProblemSet {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  dateUploaded: string;
  problems: Problem[];
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Algorithms' | 'Mathematics' | 'Platform' | 'Guide';
  type: 'Book' | 'Website' | 'Cheatsheet' | 'Platform';
  url: string;
  description: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Puzzles' | 'Contests' | 'Requirements';
}
