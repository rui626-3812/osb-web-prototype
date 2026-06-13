/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Member, Alumni, Achievement, MeetEvent, ProblemSet, ResourceItem, FAQItem } from './types';

export const teamIntro = {
  title: "The Olympiad Coding & Mathematics Team",
  subtitle: "Challenging elite minds in algorithmic problem solving and advanced mathematics.",
  description: "Established in 2021, our team brings together the brightest analytical minds to compete in regional, national, and international arenas including ICPC, USACO, USAMO, and Putnam. We practice twice a week, solving intricate combinatorial puzzles, dynamic programming matrices, and number theoretic lemmas. We believe in collaborative excellence, shared intelligence, and rigorous intellectual growth.",
  mismatchBanner: "Our club is fully student-run, featuring mentoring pipelines and open-source study guides for high-stakes problem-solving competitions."
};

export const initialMembers: Member[] = [
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
];

export const initialAlumni: Alumni[] = [
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
];

export const initialAchievements: Achievement[] = [
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
];

export const initialEvents: MeetEvent[] = [
  {
    id: "e1",
    title: "Advanced Dynamic Programming Workshop",
    type: "Practice",
    date: "2026-06-18",
    time: "18:00",
    location: "Mechanical Engineering Bldg, Room 302 / Zoom link available",
    description: "Deep dive into Bitmask DP, Convex Hull optimization, and multi-dimensional state transitions with Beatrice and Cyrus.",
    attendeesCount: 14,
    tags: ["DP", "Optimization"]
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
    tags: ["Contest", "Social"]
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
    tags: ["Hardcore", "Mock"]
  }
];

export const initialProblemSets: ProblemSet[] = [
  {
    id: "ps1",
    title: "Olympiad Math & Combinatorics Classics",
    description: "A collection of beautiful counting questions and number theoretic puzzles designed to sharpen your mathematical logic.",
    difficulty: "Medium",
    topics: ["Combinatorics", "Number Theory"],
    dateUploaded: "2026-06-01",
    problems: [
      {
        id: "p1_1",
        title: "Subset Sums Multiplier",
        description: "Given the integer set S = {1, 2, 3, 4, 5, 6, 7}. What is the sum of the elements over all non-empty subsets of S? (Hint: each element appears exactly the same number of times across subsets.)",
        difficulty: "Easy",
        category: "Combinatorics",
        points: 50,
        sampleInput: "Set = {1, 2, 3} -> subsets are {1},{2},{3},{1,2},{2,3},{1,3},{1,2,3}. Total sum = 1+2+3+3+5+4+6 = 24. Modulo arithmetic or counting occurrences applies.",
        sampleOutput: "24 (for the {1, 2, 3} case)",
        correctAnswer: "1792",
        hints: [
          "A set of size N has 2^N total subsets.",
          "By symmetry, each element from the 7 elements occurs in exactly 2^(7-1) subsets.",
          "Multiply the total sum of the single set elements (1+2+3+4+5+6+7) by the subset occurrence frequency."
        ]
      },
      {
        id: "p1_2",
        title: "The Distinct Digit Counter",
        description: "How many 4-digit positive integers (i.e. integers in the range [1000, 9999]) have entirely distinct, unique digits?",
        difficulty: "Medium",
        category: "Combinatorics",
        points: 80,
        sampleInput: "Single digit constraint. Leading digit cannot be zero.",
        sampleOutput: "None (Simple arithmetic calculation)",
        correctAnswer: "4536",
        hints: [
          "For the first digit (thousands place), you have 9 choices (1-9, since it cannot be 0).",
          "For the second digit, you have 9 choices (0-9, excluding the thousands digit).",
          "For the third digit, you have 8 choices. For the fourth digit, you have 7 choices.",
          "Apply the multiplicative rule: 9 * 9 * 8 * 7."
        ]
      },
      {
        id: "p1_3",
        title: "Minimum Spanning Tree Weights",
        description: "Consider a complete graph on 5 vertices labeled {1, 2, 3, 4, 5}. The weight of the undirected edge between vertex i and vertex j is defined as (i - j)^2. What is the total edge weight of the Minimum Spanning Tree of this graph?",
        difficulty: "Hard",
        category: "Graph Theory",
        points: 120,
        sampleInput: "Vertices: V = {1, 2, 3, 4, 5}\nEdge weight(i,j) = (i - j)^2",
        sampleOutput: "Scalar integer output",
        correctAnswer: "4",
        hints: [
          "To minimize tree weight, we should focus on edges with the smallest weights.",
          "The minimum non-zero weight for an edge is (i - (i-1))^2 = 1.",
          "We can connect 1 to 2, 2 to 3, 3 to 4, and 4 to 5. Each of these 4 edges has a weight of 1.",
          "No graph of 5 vertices can be connected with fewer than 4 edges."
        ]
      }
    ]
  },
  {
    id: "ps2",
    title: "Algorithmic Speed trials - Binary & Pointers",
    description: "Practical problems based on search space pruning, two-pointer sweeps, and modular arithmetic.",
    difficulty: "Easy",
    topics: ["Searching", "Two-Pointers", "Mathematics"],
    dateUploaded: "2026-06-10",
    problems: [
      {
        id: "p2_1",
        title: "Modular Fibonacci Remainder",
        description: "What is the remainder of the 2026th Fibonacci number when divided by 1000? Let Fib(1) = 1, Fib(2) = 1, Fib(3) = 2, and so on... We are looking for Fib(2026) mod 1000.",
        difficulty: "Medium",
        category: "Number Theory / Pisano Period",
        points: 100,
        sampleInput: "Fib(1)=1, Fib(2)=1, Fib(3)=2, Fib(4)=3\nFib(n) = Fib(n-1) + Fib(n-2)",
        sampleOutput: "An integer between 0 and 999",
        correctAnswer: "901",
        hints: [
          "The sequence of Fibonacci numbers modulo 1000 is periodic. This is called the Pisano period.",
          "The Pisano period modulo 1000 is exactly 1500.",
          "Therefore, Fib(2026) mod 1000 is equivalent to Fib(2026 - 1500) mod 1000 = Fib(526) mod 1000.",
          "You can simulate this using a simple Javascript state loop: let a = 1, b = 1; for i = 3 to 2026 ..."
        ]
      }
    ]
  }
];

export const initialResources: ResourceItem[] = [
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
];

export const initialFAQs: FAQItem[] = [
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
];
