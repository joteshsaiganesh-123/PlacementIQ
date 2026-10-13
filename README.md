# 🎓 PlacementIQ — Smart Placement & Campus Recruitment Management System

> **A Full-Stack Java Enterprise Solution Built for College Reviews, Viva Presentations, and NAAC/NBA Accreditation.**

---

## 🌟 Executive Summary

**PlacementIQ** is an enterprise-grade campus placement and recruitment portal engineered to automate and optimize every dimension of the college placement cycle. Unlike traditional static portals, **PlacementIQ** integrates:

1. **Automated Placement Eligibility Engine**: Evaluates candidate eligibility in real time against company cutoffs (CGPA, active backlogs, department restrictions, and passing year) with itemized compliance feedback.
2. **Smart ATS & Skill Gap Analyzer**: Quantifies candidate compatibility against job requisitions using algorithmic keyword and domain-token matching, providing students with tailored interview preparation recommendations.
3. **Multi-Role Executive Dashboards**: Distinct persona views tailored for **Students**, the **Training & Placement Officer (TPO Admin)**, and **Corporate Recruiters**.
4. **Accreditation Audit Exporter**: One-click generation of placement audit reports and department analytics in CSV and print-ready formats compliant with NAAC and NBA review standards.
5. **Interview Scheduling & Round Advancement**: Corporate talent leads can screen candidates ranked by ATS score, schedule technical interviews with live video links, and roll out digital offer letters.

---

## 🏗️ Architecture & Technology Stack

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|        React 18  •  Tailwind CSS  •  Lucide Icons  •  Vite SPA          |
|  (Glassmorphism Design System, Role Switcher, Interactive ATS Gauges)   |
+-------------------------------------------------------------------------+
                                    │
                               REST JSON (HTTP)
                                    ▼
+-------------------------------------------------------------------------+
|                           APPLICATION TIER                              |
|                   Spring Boot 3.2.5  •  Java 17 LTS                     |
|  • SmartEligibilityService       • SmartAtsService                      |
|  • AnalyticsService              • ApplicationService                   |
|  • PlacementDriveService         • StudentService                       |
+-------------------------------------------------------------------------+
                                    │
                               Spring Data JPA / Hibernate
                                    ▼
+-------------------------------------------------------------------------+
|                              DATA TIER                                  |
|         H2 In-Memory & File Relational Engine (Zero-Config)             |
|   (Pre-seeded with real-world companies, drives, students & offers)     |
+-------------------------------------------------------------------------+
```

### Backend Components
- **Language**: Java 17 LTS
- **Framework**: Spring Boot 3.2.5
- **ORM / Persistence**: Spring Data JPA & Hibernate
- **Database**: H2 In-Memory Relational Database (Accessible at `http://localhost:8085/h2-console`)
- **API Spec**: Clean RESTful architecture (`/api/drives`, `/api/students`, `/api/applications`, `/api/analytics`, `/api/auth`)
- **Pre-seeded Dataset**: Auto-populates 6 tier-1 companies (Google, Microsoft, Amazon, Oracle, Deloitte, TCS Digital), diverse student profiles, and multi-stage applications.

### Frontend Components
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom Glassmorphism panels, high-contrast badges, and micro-interactions
- **Icons**: Lucide React
- **Standalone Distribution**: The React production build is integrated directly into Spring Boot (`src/main/resources/static`), allowing the entire full-stack system to run from a single Spring Boot command without requiring external web servers.

---

## ⚡ Quick Start & Running the Project

### Prerequisites
- **Java 17** (Installed on system)
- Terminal (PowerShell / Command Prompt)

### Launching the Full-Stack Application
Open your terminal in the backend directory:
```powershell
cd C:\Users\DELL\.gemini\antigravity\scratch\smart-placement-portal\backend
.\mvnw.cmd spring-boot:run
```

Once started, open your web browser:
- **Web Application Portal**: `http://localhost:8085/`
- **H2 Database Console**: `http://localhost:8085/h2-console`
  - *JDBC URL*: `jdbc:h2:mem:placementdb`
  - *User Name*: `sa`
  - *Password*: `password`
- **REST API Base URL**: `http://localhost:8085/api`

---

## 🎭 Instant Persona Switcher (For College Viva & Review Demos)

At the top right of the navigation bar, an interactive **Demo Role Switcher** is provided. Examiners and reviewers can switch between perspectives with a single click:

| Role | User Persona | Credentials / Email | Key Features to Demonstrate |
|---|---|---|---|
| **Student (Placed)** | Aman Verma (CSE, 8.85 CGPA) | `aman.verma@college.edu` | Google Offer (28.5 LPA), ATS 92% match score, skill gap breakdown |
| **Student (Placed)** | Priya Nair (IT, 8.40 CGPA) | `priya.nair@college.edu` | Microsoft Offer (24 LPA), Data Science & AI profile |
| **Student (Seeking)** | Rohan Mehta (ECE, 7.35 CGPA) | `rohan.mehta@college.edu` | Real-time 1-click application, Deloitte interview invitation |
| **Student (With Backlog)** | Rahul Deshmukh (CSE, 1 Backlog) | `rahul.deshmukh@college.edu` | Demonstrates the Automated Rule Engine blocking ineligibility |
| **Placement Cell (TPO)** | Dr. Arvind Sharma (TPO Head) | `tpo@college.edu` | Executive KPI analytics, branch placement bars, CSV/NAAC report export, drive creation |
| **Corporate Recruiter** | Sarah Jenkins (Google) | `recruiter@google.com` | ATS-ranked candidate screening, scheduling interview rounds, extending offer letters |

---

## 💡 Key College Review Presentation Points

When presenting this project to your college review committee or professors, emphasize these unique features:

1. **Automated Eligibility Engine (`SmartEligibilityService.java`)**:
   - Instead of manual spreadsheet verification, the backend verifies `student.cgpa >= drive.minCgpa`, `student.activeBacklogs <= drive.maxBacklogsAllowed`, and department eligibility in microseconds, returning itemized feedback if rejected.
2. **Smart ATS Match & Skill Gap (`SmartAtsService.java`)**:
   - Analyzes candidate tech stack keywords against job requisitions, calculates compatibility percentages, and outputs actionable preparation guidance.
3. **NAAC / NBA Accreditation Readiness (`AnalyticsService.java`)**:
   - Generates verified placement percentages, average/median CTCs, and department-wise charts ready for academic audit submissions.
4. **Single-Artifact Deployability**:
   - Packaged with the Maven Wrapper and embedded frontend static bundle, allowing examiners to test and verify the entire system with zero setup hurdles.

---
© 2026 PlacementIQ Project. Built with Fullstack Java and React.
