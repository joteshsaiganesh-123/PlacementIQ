import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Database, 
  Cpu, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Layers,
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';

export default function PlacementPrepPage() {
  const [activeCategory, setActiveCategory] = useState('dsa');

  const categories = [
    { id: 'dsa', name: 'DSA & Coding Patterns', icon: Code2 },
    { id: 'fullstack', name: 'Java & Spring Boot Core', icon: Layers },
    { id: 'core', name: 'DBMS, OS & Networks', icon: Database },
    { id: 'system-design', name: 'System Design Basics', icon: Cpu },
    { id: 'hr', name: 'HR & Behavioral Rounds', icon: MessageSquare }
  ];

  const prepData = {
    dsa: [
      {
        topic: 'Two Pointers & Sliding Window',
        difficulty: 'Medium',
        description: 'Crucial for string and array subarray problems (e.g. Longest Substring Without Repeating Characters, 3Sum, Container With Most Water).',
        tips: 'Always check array boundary conditions and edge cases with empty or 1-element arrays.'
      },
      {
        topic: 'Fast & Slow Pointers (Cycle Detection)',
        difficulty: 'Easy-Medium',
        description: 'Used for detecting loops in Linked Lists (Floyd cycle detection algorithm) and finding midpoints in single passes.',
        tips: 'Initialize slow = head, fast = head.next or head, advance fast by 2 and slow by 1.'
      },
      {
        topic: 'Binary Search & Monotonic Search Space',
        difficulty: 'Medium',
        description: 'Applied not just on sorted arrays, but on predicate functions (e.g. Search in Rotated Array, Minimum Capacity to Ship Packages).',
        tips: 'Watch out for integer overflow: use mid = low + (high - low) / 2.'
      },
      {
        topic: 'Tree Traversals & Lowest Common Ancestor (LCA)',
        difficulty: 'Medium-Hard',
        description: 'Master BFS (Level Order), DFS (Pre/In/Postorder), and recursive subtree comparisons for binary search trees and general trees.',
        tips: 'Use recursion for DFS and queue for BFS. For BST LCA, compare current node value against p and q.'
      },
      {
        topic: 'Dynamic Programming Patterns',
        difficulty: 'Hard',
        description: '0/1 Knapsack, Unbounded Knapsack, Longest Common Subsequence (LCS), Longest Increasing Subsequence (LIS), and Matrix DP.',
        tips: 'First write the recursive brute-force top-down recurrence, then memoize, then convert to iterative bottom-up table.'
      }
    ],
    fullstack: [
      {
        topic: 'Spring Boot Dependency Injection & IoC Container',
        difficulty: 'Core',
        description: 'Understand how Spring ApplicationContext manages beans, lifecycle annotations (@Component, @Service, @Repository, @Autowired, @Bean).',
        tips: 'Explain Constructor Injection vs Field Injection (Constructor injection is favored for testability and immutability).'
      },
      {
        topic: 'Spring Data JPA & Hibernate Internals',
        difficulty: 'Core',
        description: 'Entity mapping (@Entity, @Table, @OneToMany, @ManyToOne), Lazy vs Eager fetch types, and how to avoid the N+1 select problem with JOIN FETCH.',
        tips: 'Understand dirty checking and first-level vs second-level caching.'
      },
      {
        topic: 'RESTful API Architecture & HTTP Status Codes',
        difficulty: 'Essential',
        description: 'Proper use of idempotency, 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error.',
        tips: 'Know the difference between PUT (full replacement, idempotent) and PATCH (partial update).'
      },
      {
        topic: 'Multithreading & Concurrency in Java',
        difficulty: 'Advanced',
        description: 'Thread states, synchronized blocks, volatile keyword, ExecutorService thread pools, ConcurrentHashMap, and CompletableFuture.',
        tips: 'Know why Volatile ensures visibility across CPU caches but does not guarantee compound atomicity without locks or AtomicInteger.'
      }
    ],
    core: [
      {
        topic: 'DBMS: Normalization & Indexing (B-Trees vs Hash)',
        difficulty: 'Core',
        description: '1NF, 2NF, 3NF, BCNF. B+Tree indexing mechanics, clustered vs non-clustered indexes, and query execution plans (EXPLAIN ANALYZE).',
        tips: 'Indexes speed up SELECT queries but add overhead to INSERT, UPDATE, and DELETE operations.'
      },
      {
        topic: 'ACID Properties & Transaction Isolation Levels',
        difficulty: 'Core',
        description: 'Atomicity, Consistency, Isolation, Durability. Read Uncommitted, Read Committed, Repeatable Read, and Serializable.',
        tips: 'Know concurrency phenomena: Dirty Read, Non-repeatable Read, Phantom Read.'
      },
      {
        topic: 'Operating Systems: Concurrency & Deadlocks',
        difficulty: 'Core',
        description: 'Processes vs Threads, CPU scheduling algorithms, Semaphores vs Mutexes, and Coffman 4 conditions for Deadlock.',
        tips: 'Remember Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.'
      },
      {
        topic: 'Computer Networks: TCP 3-Way Handshake & OSI Layers',
        difficulty: 'Core',
        description: 'SYN, SYN-ACK, ACK handshake, TCP vs UDP tradeoffs, DNS lookup resolution flow, and TLS/HTTPS encryption negotiation.',
        tips: 'Know why TCP has a 4-way FIN termination handshake to handle half-closed connections.'
      }
    ],
    'system-design': [
      {
        topic: 'Load Balancing & Horizontal Scaling',
        difficulty: 'High-Level',
        description: 'Layer 4 (Transport) vs Layer 7 (Application) load balancers, Round-Robin, Least Connections, and IP Hash algorithms.',
        tips: 'Explain horizontal scaling (adding nodes) vs vertical scaling (upgrading RAM/CPU limits).'
      },
      {
        topic: 'Caching Strategies (Redis / Memcached)',
        difficulty: 'High-Level',
        description: 'Cache-Aside, Write-Through, Write-Behind, and eviction policies (LRU - Least Recently Used, LFU - Least Frequently Used).',
        tips: 'Watch out for Cache Invalidation and Cache Stampede / Dogpiling.'
      },
      {
        topic: 'Database Sharding & Replication',
        difficulty: 'High-Level',
        description: 'Master-Slave replication for read-heavy workloads, range-based sharding vs consistent hashing sharding keys.',
        tips: 'State CAP theorem: In the presence of a Network Partition (P), you must choose between Consistency (C) and Availability (A).'
      }
    ],
    hr: [
      {
        topic: 'Tell Me About Yourself',
        difficulty: 'Must-Know',
        description: 'Structure: Present (what you are currently building & skills), Past (academic foundation & key achievements), Future (why you are excited about this role).',
        tips: 'Keep it within 90-120 seconds. Focus on real technical impact and problem-solving drive.'
      },
      {
        topic: 'The STAR Method for Behavioral Questions',
        difficulty: 'Must-Know',
        description: 'Situation (context), Task (your goal), Action (specific technical actions YOU took), Result (measurable outcome, e.g. improved speed by 35%).',
        tips: 'Never use vague "we did this" answers; specify YOUR contribution in team projects.'
      },
      {
        topic: 'Describe a Conflict or Technical Challenge You Resolved',
        difficulty: 'Common',
        description: 'Focus on constructive communication, data-driven decisions, code reviews, and positive post-resolution outcomes.',
        tips: 'Never blame teammates or faculty; demonstrate professional ownership and growth.'
      }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Recruitment Preparation Center</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
              Placement Preparation & Interview Mastery
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Curated coding roadmaps, core computer science review, full-stack Java concepts, and proven interview frameworks for technical and HR rounds.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[200px]">
            <p className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Curated Modules</p>
            <p className="text-2xl font-black mt-1 text-white">5 Core Pillars</p>
            <p className="text-xs text-slate-300 mt-1 font-medium">Coding, Tech & HR</p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Topics Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prepData[activeCategory]?.map((item, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-extrabold text-indigo-600 text-xs">
                  {idx + 1}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                  {item.difficulty}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base mt-3">
                {item.topic}
              </h3>

              <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100/80">
              <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider flex items-center space-x-1 mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Placement Pro Tip</span>
              </span>
              <p className="text-xs text-slate-700 font-semibold">
                {item.tips}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
