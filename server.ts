/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'data_store.json');

// Default starting values
const defaultData = {
  schedulePassword: "239power",
  titles: {
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
  },
  intro: {
    title: "OSB Portal",
    subtitle: "Ocean Science Hub",
    description: "Established in 2021, our team brings together the brightest analytical minds to explore oceanography, fluid dynamics, marine biochemistry, and computational environmental modeling. We compete in national and global olympiads, researching physical ocean mechanics, chemical marine tracers, and ecological trophic webs. We believe in sharing critical marine science tools, collaborative field studies, and rigorous mathematical prep for all elite qualifiers.",
    mismatchBanner: "Our hub is completely student-led, providing reference files, curated practice sets, and mentoring pipelines for next-generation oceanographers."
  },
  members: [
    {
      id: "m1",
      name: "Dr. Arthur Pendelton",
      role: "Coach",
      bio: "Professor of Theoretical Computer Science. Guided three teams to the ICPC World Finals and teaches advanced computational complexity.",
      specialty: "Complexity Theory & Turing Machines",
      achievements: ["ICPC Coach Award 2024", "Excellence in Mentorship 2023"],
      avatarSeed: "arthur",
      joinedYear: 2021
    },
    {
      id: "m2",
      name: "Beatrice Chen",
      role: "Captain",
      bio: "Senior pursuing a dual degree in pure Mathematics and Computer Science. USACO Platinum competitor and avid chess player.",
      specialty: "Combinatorics & Graph Algorithms",
      achievements: ["First Place Individual - State Coding Bowl 2025", "Putnam Honorable Mention (Top 100)"],
      avatarSeed: "beatrice",
      joinedYear: 2022
    },
    {
      id: "m3",
      name: "Cyrus Vance",
      role: "Co-Captain",
      bio: "Junior specializing in high-performance computing in C++. Passionate about geometric queries and tree decompositions.",
      specialty: "Dynamic Programming & Computational Geometry",
      achievements: ["Codeforces Grandmaster (2400+ rating)", "USACO Platinum Rank #14"],
      avatarSeed: "cyrus",
      joinedYear: 2023
    },
    {
      id: "m4",
      name: "Diana Prince",
      role: "Member",
      bio: "Sophomore with a strong math olympiad background. National Merit Scholar and developer of custom geometry visualization libraries.",
      specialty: "Matrix Exponentiation & Abstract Algebra",
      achievements: ["USAMO Qualifier 2024", "Top 5% - Kaggle Algorithmic Division"],
      avatarSeed: "diana",
      joinedYear: 2024
    },
    {
      id: "m5",
      name: "Ethan Hunt",
      role: "Member",
      bio: "Freshman who already conquered USACO Gold and enjoys decrypting algebraic RSA variants. Specialist in advanced modular arithmetic.",
      specialty: "Number Theory & Network Flow",
      achievements: ["Perfect Score - AMC 12 (2025)", "USACO Gold Top Scorer"],
      avatarSeed: "ethan",
      joinedYear: 2025
    }
  ],
  alumniList: [
    {
      id: "a1",
      name: "Dr. Frank Zhou",
      graduationYear: 2024,
      currentRole: "Ph.D. Candidate in Modern Cryptography at MIT",
      achievement: "Co-founded the club's resource library; ICPC World Finalist in 2023.",
      avatarSeed: "frank"
    },
    {
      id: "a2",
      name: "Gertrude Bell",
      graduationYear: 2023,
      currentRole: "Research Engineer at Google DeepMind",
      achievement: "Solved all 12 problems in the 24-hour Winter Coding Marathon. USACO Platinum Alum.",
      avatarSeed: "gertrude"
    },
    {
      id: "a3",
      name: "Henry Cavil",
      graduationYear: 2022,
      currentRole: "Quantitative Trader at Jane Street",
      achievement: "Putnam High scorer (A/B Section) and state mathematics medalist.",
      avatarSeed: "henry"
    }
  ],
  achievements: [
    {
      id: "ach1",
      title: "State Coding Sweep",
      eventName: "State Intercollegiate Coding Bowl",
      date: "2025-11-23",
      medal: "First",
      description: "Our core team clean-swept the scoreboard, solving all remaining geometry and network flow problems with 92% submission accuracy."
    },
    {
      id: "ach2",
      title: "Regional Gold Certification",
      eventName: "ACM-ICPC Regional Championship",
      date: "2025-10-15",
      medal: "Gold",
      description: "Ranked #2 out of 80 regional division collegiate contenders, securing a ticket to the continental play-offs."
    },
    {
      id: "ach3",
      title: "Youth Olympic Double Silver",
      eventName: "National Mathematics Olympiad Selection",
      date: "2024-04-10",
      medal: "Silver",
      description: "Two members (Beatrice and Former Captain Frank) won Silver medals at the high-stakes qualifying division."
    }
  ],
  events: [
    {
      id: "e1",
      title: "Advanced Dynamic Programming Workshop",
      type: "Practice",
      date: "2026-06-18",
      time: "18:00",
      location: "Mechanical Engineering Bldg, Room 302 / Zoom link available",
      description: "Deep dive into Bitmask DP, Convex Hull optimization, and multi-dimensional state transitions with Beatrice and Cyrus.",
      attendeesCount: 14,
      tags: ["DP", "Optimization"],
      attendees: [
        { name: "Beatrice Chen", date: "2026-06-13T10:00:00Z" },
        { name: "Cyrus Vance", date: "2026-06-13T10:05:00Z" },
        { name: "Frank Zhou", date: "2026-06-13T11:20:00Z" },
        { name: "Diana Prince", date: "2026-06-13T11:45:00Z" }
      ]
    },
    {
      id: "e2",
      title: "Summer Solstice Mini-Contest",
      type: "Local Meet",
      date: "2026-06-25",
      time: "14:00",
      location: "Shedd Computer Laboratory, Sandbox Lab",
      description: "A fast-paced 3-hour trial contest featuring past Putnam and USACO problems, complete with pizza and post-contest review.",
      attendeesCount: 22,
      tags: ["Contest", "Social"],
      attendees: [
        { name: "Henry Cavil", date: "2026-06-13T10:15:00Z" },
        { name: "Gertrude Bell", date: "2026-06-13T10:20:00Z" },
        { name: "Beatrice Chen", date: "2026-06-13T10:30:00Z" },
        { name: "Ethan Hunt", date: "2026-06-13T11:00:00Z" }
      ]
    },
    {
      id: "e3",
      title: "ACM Regional Mock Trial #3",
      type: "Regional Contest",
      date: "2026-07-09",
      time: "10:00",
      location: "Virtual - HackerRank Arena",
      description: "Simulating high-pressure competition environment with 8 rigorous problems across geometry, graph flow, and game theory.",
      attendeesCount: 8,
      tags: ["Hardcore", "Mock"],
      attendees: [
        { name: "Beatrice Chen", date: "2026-06-13T10:00:00Z" },
        { name: "Cyrus Vance", date: "2026-06-13T10:05:00Z" }
      ]
    }
  ],
  resources: [
    {
      id: "r1",
      title: "Competitive Programmer's Handbook",
      category: "Algorithms",
      type: "Book",
      url: "https://cses.fi/book/book.pdf",
      description: "An incredible, comprehensive PDF guide written by Antti Laaksonen covering graphs, dynamic programming, segment trees, and math."
    },
    {
      id: "r2",
      title: "USACO Guide",
      category: "Algorithms",
      type: "Platform",
      url: "https://usaco.guide/",
      description: "The gold standard training platform categorized by divisions (Bronze, Silver, Gold, Platinum) with complete resource tracking and mocks."
    },
    {
      id: "r3",
      title: "Kactl C++ Notebook",
      category: "Platform",
      type: "Cheatsheet",
      url: "https://github.com/kth-competitive-programming/kactl",
      description: "The official KTH Royal Institute of Technology 25-page standard algorithm cheatsheet, containing hyper-optimized templates for ICPC."
    },
    {
      id: "r4",
      title: "Project Euler",
      category: "Mathematics",
      type: "Website",
      url: "https://projecteuler.net/",
      description: "An absolute playground for combining mathematics with programming, helping to train efficient factorization, searching, and division puzzles."
    }
  ],
  faqs: [
    {
      id: "q1",
      question: "Do I need to be a Computer Science or Mathematics major to join?",
      answer: "Absolutely not! We have members from Physics, Mechanical Engineering, Chemistry, and Philosophy. Anyone who enjoys intensive problem-solving and logic puzzles is warmly welcome.",
      category: "Requirements"
    },
    {
      id: "q2",
      question: "What programming languages are permitted in team competitions?",
      answer: "While most competitors align with C++ due to its unmatched execution speed and standard template library (STL), Python and Java are widely supported in USACO, ICPC, and other modern competitions.",
      category: "Contests"
    },
    {
      id: "q3",
      question: "How do practices work, and are they beginner-friendly?",
      answer: "Practices are divided into structural levels. Senior members deliver interactive lectures on advanced topics, while beginners receive scaffolded problem sets with tailored hints to progress steadily.",
      category: "General"
    },
    {
      id: "q4",
      question: "How do I qualify for the traveling competition roster?",
      answer: "We host periodic 'trial contests' simulating genuine contest environments. Team rosters are assembled based on consistency of participation, problem set submissions, and trial outcomes.",
      category: "Requirements"
    }
  ]
};

// Database state in memory
let dbState = { ...defaultData };

// Load database state from disk or initialize it
async function loadDatabase() {
  try {
    const RawData = await fs.readFile(DB_PATH, 'utf-8');
    dbState = { ...defaultData, ...JSON.parse(RawData) };
    console.log(`Database loaded successfully from ${DB_PATH}`);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log('Database file not found. Creating a new database file...');
      await saveDatabase();
    } else {
      console.error('Error reading database file:', err);
    }
  }
}

// Save database state to disk
async function saveDatabase() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(dbState, null, 2), 'utf-8');
    console.log(`Saved database to disk.`);
  } catch (err) {
    console.error('Failed to write database file to disk:', err);
  }
}

async function startServer() {
  await loadDatabase();

  const app = express();
  app.use(express.json());

  // API Route to fetch all current portal data
  app.get('/api/data', (_req, res) => {
    res.json(dbState);
  });

  // API Route to overwrite specific state fields or full catalog
  app.post('/api/data', async (req, res) => {
    try {
      const payload = req.body;
      dbState = {
        ...dbState,
        ...payload
      };
      await saveDatabase();
      res.json({ success: true, message: "Database state updated", data: dbState });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // API Healthcheck
  app.get('/api/health', (_req, res) => {
    res.json({ status: "alive", code: 200 });
  });

  // Vite development middleware integration or production static serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware for full-stack Development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Open-Portal Full-Stack server running on port ${PORT}`);
  });
}

startServer();
