import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CircleDollarSign,
  Coins,
  DollarSign,
  Euro,
  FileCheck2,
  IndianRupee,
  JapaneseYen,
  LayoutDashboard,
  LineChart,
  LucideIcon,
  PoundSterling,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { formatCurrency } from "@/lib/utils";

export type Role = "owner" | "hr" | "manager" | "employee";

export type PortalSection =
  | "dashboard"
  | "departments"
  | "employees"
  | "projects"
  | "payroll"
  | "reports";

export type EmployeeRecord = {
  id: string;
  name: string;
  role:
    | "HR Executive"
    | "Project Manager"
    | "Full Stack Engineer"
    | "UI Designer"
    | "Finance Executive"
    | "Operations Lead";
  accessRole: Role;
  department: string;
  avatar: string;
  status: "Active" | "On Leave" | "Probation";
  email: string;
  phone: string;
  experience: string;
  location: string;
  project: string;
  manager: string;
  currency: string;
  salary: number;
  latestPayout: number;
  nextRenewal: string;
  contractExpiry: string;
  lastAppraisal: string;
  lastHikePercent: number;
  achievements: string[];
  documents: Array<{ label: string; state: "Verified" | "Pending" }>;
  appraisal: {
    cycle: string;
    rating: string;
    reviewer: string;
    summary: string;
  };
  salaryHistory: Array<{
    date: string;
    previous: number;
    updated: number;
    reason: string;
  }>;
  contractHistory: Array<{
    term: string;
    renewedOn: string;
    expiresOn: string;
    status: "Renewed" | "Due Soon";
  }>;
  transactions: Array<{
    date: string;
    amount: number;
    note: string;
    status: "Paid" | "Scheduled";
  }>;
};

export type DepartmentRecord = {
  name: string;
  head: string;
  employees: number;
  openRoles: number;
  status: "Healthy" | "Hiring" | "Needs Review";
};

export type ProjectRecord = {
  name: string;
  lead: string;
  department: string;
  status: "On Track" | "At Risk" | "Planning";
  deadline: string;
  summary: string;
  members: number;
};

export type DashboardDrilldown = {
  label: string;
  title: string;
  description: string;
  items: Array<{
    title: string;
    subtitle: string;
    value?: string;
    status?: string;
  }>;
};

export const roleNames: Record<Role, string> = {
  owner: "Owner",
  hr: "HR",
  manager: "Manager",
  employee: "Employee",
};

export const roleTaglines: Record<Role, string> = {
  owner: "Total command over hiring, payroll, and company operations.",
  hr: "Operational control over people, policies, payroll, and records.",
  manager: "Team and project visibility with delivery-focused oversight.",
  employee: "A personal workspace for profile, payments, and growth history.",
};

export const roleAccent: Record<Role, string> = {
  owner: "from-amber-300/30 via-amber-100/10 to-transparent",
  hr: "from-cyan-300/30 via-cyan-100/10 to-transparent",
  manager: "from-emerald-300/30 via-emerald-100/10 to-transparent",
  employee: "from-rose-300/30 via-rose-100/10 to-transparent",
};

export const navItems: Array<{
  key: PortalSection;
  label: string;
  hint: string;
  href: (role: Role) => string;
  icon: typeof LayoutDashboard;
  allowedRoles: Role[];
}> = [
  {
    key: "dashboard",
    label: "Dashboard",
    hint: "Core overview",
    href: (role) => `/portal/${role}/dashboard`,
    icon: LayoutDashboard,
    allowedRoles: ["owner", "hr", "manager", "employee"],
  },
  {
    key: "departments",
    label: "Departments",
    hint: "Team structure",
    href: (role) => `/portal/${role}/departments`,
    icon: Building2,
    allowedRoles: ["owner", "hr", "manager"],
  },
  {
    key: "employees",
    label: "Employees",
    hint: "People records",
    href: (role) => `/portal/${role}/employees`,
    icon: UsersRound,
    allowedRoles: ["owner", "hr", "manager", "employee"],
  },
  {
    key: "projects",
    label: "Projects",
    hint: "Delivery view",
    href: (role) => `/portal/${role}/projects`,
    icon: BriefcaseBusiness,
    allowedRoles: ["owner", "hr", "manager", "employee"],
  },
  {
    key: "payroll",
    label: "Payroll",
    hint: "Compensation flow",
    href: (role) => `/portal/${role}/payroll`,
    icon: CircleDollarSign,
    allowedRoles: ["owner", "hr", "employee"],
  },
  {
    key: "reports",
    label: "Reports",
    hint: "Operational trends",
    href: (role) => `/portal/${role}/reports`,
    icon: LineChart,
    allowedRoles: ["owner", "hr", "manager"],
  },
];

export const departmentRecords: DepartmentRecord[] = [
  {
    name: "Engineering",
    head: "Ravi Mehta",
    employees: 18,
    openRoles: 2,
    status: "Healthy",
  },
  {
    name: "Human Resources",
    head: "Neha Sharma",
    employees: 10,
    openRoles: 1,
    status: "Hiring",
  },
  {
    name: "Finance",
    head: "Aditi Rao",
    employees: 7,
    openRoles: 0,
    status: "Healthy",
  },
  {
    name: "Operations",
    head: "Arjun Sen",
    employees: 12,
    openRoles: 3,
    status: "Needs Review",
  },
];

export const projectRecords: ProjectRecord[] = [
  {
    name: "AEMS Core Rollout",
    lead: "Ravi Mehta",
    department: "Engineering",
    status: "On Track",
    deadline: "15 Apr 2026",
    summary:
      "Employee records, payroll privacy, and role-aware dashboards are in active delivery.",
    members: 14,
  },
  {
    name: "Quarterly Appraisal Cycle",
    lead: "Neha Sharma",
    department: "Human Resources",
    status: "Planning",
    deadline: "22 Apr 2026",
    summary:
      "Review templates, reviewer assignments, and hike recommendations are being prepared.",
    members: 9,
  },
  {
    name: "Finance Sync Upgrade",
    lead: "Aditi Rao",
    department: "Finance",
    status: "At Risk",
    deadline: "30 Apr 2026",
    summary:
      "Pending payroll reconciliation rules and payout lock controls for restricted users.",
    members: 6,
  },
];

export const employeeRecords: EmployeeRecord[] = [
  {
    id: "EMP-101",
    name: "Neha Sharma",
    role: "HR Executive",
    accessRole: "hr",
    department: "Human Resources",
    avatar: "NS",
    status: "Active",
    email: "neha.sharma@aems.local",
    phone: "+91 98765 11001",
    experience: "8 years in recruitment, payroll operations, and employee relations.",
    location: "Kolkata",
    project: "Quarterly Appraisal Cycle",
    manager: "Aarav Khanna",
    currency: "INR",
    salary: 95000,
    latestPayout: 95000,
    nextRenewal: "10 Jun 2026",
    contractExpiry: "31 Dec 2026",
    lastAppraisal: "Q4 2025",
    lastHikePercent: 10,
    achievements: [
      "Reduced onboarding turnaround by 38%.",
      "Standardized employee verification workflow.",
      "Led payroll issue resolution for 120 employees.",
    ],
    documents: [
      { label: "Government ID", state: "Verified" },
      { label: "Experience Certificate", state: "Verified" },
      { label: "Payroll Declaration", state: "Pending" },
    ],
    appraisal: {
      cycle: "Q4 2025",
      rating: "Exceeds Expectations",
      reviewer: "Aarav Khanna",
      summary:
        "Strong ownership across hiring, employee communication, and payroll hygiene.",
    },
    salaryHistory: [
      { date: "01 Jan 2025", previous: 82000, updated: 87000, reason: "Annual appraisal" },
      {
        date: "01 Jan 2026",
        previous: 87000,
        updated: 95000,
        reason: "Leadership expansion",
      },
    ],
    contractHistory: [
      {
        term: "1 year",
        renewedOn: "01 Jan 2026",
        expiresOn: "31 Dec 2026",
        status: "Renewed",
      },
    ],
    transactions: [
      { date: "28 Feb 2026", amount: 95000, note: "Monthly salary payout", status: "Paid" },
      { date: "31 Mar 2026", amount: 95000, note: "Salary scheduled", status: "Scheduled" },
    ],
  },
  {
    id: "EMP-102",
    name: "Ravi Mehta",
    role: "Project Manager",
    accessRole: "manager",
    department: "Engineering",
    avatar: "RM",
    status: "Active",
    email: "ravi.mehta@aems.local",
    phone: "+91 98765 11002",
    experience: "10 years leading product and delivery teams across SaaS platforms.",
    location: "Bengaluru",
    project: "AEMS Core Rollout",
    manager: "Aarav Khanna",
    currency: "INR",
    salary: 128000,
    latestPayout: 128000,
    nextRenewal: "01 Jul 2026",
    contractExpiry: "31 Dec 2026",
    lastAppraisal: "Q4 2025",
    lastHikePercent: 12,
    achievements: [
      "Delivered three enterprise dashboards on schedule.",
      "Improved sprint completion accuracy by 24%.",
    ],
    documents: [
      { label: "Manager Contract", state: "Verified" },
      { label: "Education Proof", state: "Verified" },
    ],
    appraisal: {
      cycle: "Q4 2025",
      rating: "Outstanding",
      reviewer: "Aarav Khanna",
      summary:
        "Excellent project oversight and risk communication with strong team outcomes.",
    },
    salaryHistory: [
      { date: "01 Jan 2025", previous: 108000, updated: 116000, reason: "Annual appraisal" },
      { date: "01 Jan 2026", previous: 116000, updated: 128000, reason: "Performance hike" },
    ],
    contractHistory: [
      {
        term: "2 years",
        renewedOn: "01 Jan 2025",
        expiresOn: "31 Dec 2026",
        status: "Renewed",
      },
    ],
    transactions: [
      { date: "28 Feb 2026", amount: 128000, note: "Monthly salary payout", status: "Paid" },
      { date: "31 Mar 2026", amount: 128000, note: "Salary scheduled", status: "Scheduled" },
    ],
  },
  {
    id: "EMP-103",
    name: "Aditi Rao",
    role: "Finance Executive",
    accessRole: "hr",
    department: "Finance",
    avatar: "AR",
    status: "Active",
    email: "aditi.rao@aems.local",
    phone: "+91 98765 11003",
    experience: "6 years in payroll reconciliation, compliance, and disbursement oversight.",
    location: "Pune",
    project: "Finance Sync Upgrade",
    manager: "Neha Sharma",
    currency: "INR",
    salary: 88000,
    latestPayout: 88000,
    nextRenewal: "20 May 2026",
    contractExpiry: "31 Dec 2026",
    lastAppraisal: "Q4 2025",
    lastHikePercent: 8,
    achievements: [
      "Closed monthly payroll with zero discrepancy for two quarters.",
      "Introduced transaction audit checklist.",
    ],
    documents: [
      { label: "Tax Document", state: "Verified" },
      { label: "Finance Policy Acknowledgement", state: "Verified" },
    ],
    appraisal: {
      cycle: "Q4 2025",
      rating: "Exceeds Expectations",
      reviewer: "Neha Sharma",
      summary:
        "Reliable payroll execution with strong attention to sensitive financial details.",
    },
    salaryHistory: [
      { date: "01 Jan 2025", previous: 78000, updated: 81500, reason: "Annual appraisal" },
      { date: "01 Jan 2026", previous: 81500, updated: 88000, reason: "Performance hike" },
    ],
    contractHistory: [
      {
        term: "1 year",
        renewedOn: "01 Jan 2026",
        expiresOn: "31 Dec 2026",
        status: "Renewed",
      },
    ],
    transactions: [
      { date: "28 Feb 2026", amount: 88000, note: "Monthly salary payout", status: "Paid" },
      { date: "31 Mar 2026", amount: 88000, note: "Salary scheduled", status: "Scheduled" },
    ],
  },
  {
    id: "EMP-104",
    name: "Ishita Dey",
    role: "Full Stack Engineer",
    accessRole: "employee",
    department: "Engineering",
    avatar: "ID",
    status: "Active",
    email: "ishita.dey@aems.local",
    phone: "+91 98765 11004",
    experience: "4 years building internal products and workflow automation tools.",
    location: "Kolkata",
    project: "AEMS Core Rollout",
    manager: "Ravi Mehta",
    currency: "INR",
    salary: 72000,
    latestPayout: 72000,
    nextRenewal: "18 Jun 2026",
    contractExpiry: "31 Dec 2026",
    lastAppraisal: "Q4 2025",
    lastHikePercent: 15,
    achievements: [
      "Built the employee profile service prototype.",
      "Shipped document upload workflow with PDF validation.",
    ],
    documents: [
      { label: "ID Proof", state: "Verified" },
      { label: "Degree Certificate", state: "Verified" },
      { label: "Experience Letter", state: "Pending" },
    ],
    appraisal: {
      cycle: "Q4 2025",
      rating: "Outstanding",
      reviewer: "Ravi Mehta",
      summary:
        "High-impact execution across employee lifecycle tools with strong UI delivery.",
    },
    salaryHistory: [
      { date: "01 Jan 2025", previous: 57000, updated: 63000, reason: "Annual appraisal" },
      { date: "01 Jan 2026", previous: 63000, updated: 72000, reason: "Merit hike" },
    ],
    contractHistory: [
      {
        term: "1 year",
        renewedOn: "01 Jan 2026",
        expiresOn: "31 Dec 2026",
        status: "Renewed",
      },
    ],
    transactions: [
      { date: "28 Feb 2026", amount: 72000, note: "Monthly salary payout", status: "Paid" },
      { date: "31 Mar 2026", amount: 72000, note: "Salary scheduled", status: "Scheduled" },
    ],
  },
  {
    id: "EMP-105",
    name: "Kabir Nanda",
    role: "UI Designer",
    accessRole: "employee",
    department: "Engineering",
    avatar: "KN",
    status: "Probation",
    email: "kabir.nanda@aems.local",
    phone: "+91 98765 11005",
    experience: "3 years designing SaaS dashboards and motion-led interactions.",
    location: "Delhi",
    project: "AEMS Core Rollout",
    manager: "Ravi Mehta",
    currency: "INR",
    salary: 56000,
    latestPayout: 56000,
    nextRenewal: "12 Sep 2026",
    contractExpiry: "31 Dec 2026",
    lastAppraisal: "Q1 2026",
    lastHikePercent: 0,
    achievements: [
      "Designed role-aware dashboard cards.",
      "Created animated button concepts for key actions.",
    ],
    documents: [
      { label: "Offer Letter", state: "Verified" },
      { label: "Joining Form", state: "Verified" },
    ],
    appraisal: {
      cycle: "Q1 2026",
      rating: "On Track",
      reviewer: "Ravi Mehta",
      summary:
        "Promising early design contribution with strong responsiveness to feedback.",
    },
    salaryHistory: [{ date: "01 Feb 2026", previous: 0, updated: 56000, reason: "Initial offer" }],
    contractHistory: [
      {
        term: "11 months",
        renewedOn: "01 Feb 2026",
        expiresOn: "31 Dec 2026",
        status: "Due Soon",
      },
    ],
    transactions: [
      { date: "28 Feb 2026", amount: 56000, note: "Monthly salary payout", status: "Paid" },
      { date: "31 Mar 2026", amount: 56000, note: "Salary scheduled", status: "Scheduled" },
    ],
  },
  {
    id: "EMP-106",
    name: "Arjun Sen",
    role: "Operations Lead",
    accessRole: "manager",
    department: "Operations",
    avatar: "AS",
    status: "On Leave",
    email: "arjun.sen@aems.local",
    phone: "+91 98765 11006",
    experience: "9 years in workforce planning, operations, and delivery enablement.",
    location: "Hyderabad",
    project: "Operations Stability Program",
    manager: "Aarav Khanna",
    currency: "INR",
    salary: 99000,
    latestPayout: 99000,
    nextRenewal: "02 Aug 2026",
    contractExpiry: "31 Dec 2026",
    lastAppraisal: "Q4 2025",
    lastHikePercent: 9,
    achievements: [
      "Reduced internal escalation response time by 30%.",
      "Set up workforce allocation planning across three verticals.",
    ],
    documents: [
      { label: "Operations Contract", state: "Verified" },
      { label: "Emergency Contact Form", state: "Verified" },
    ],
    appraisal: {
      cycle: "Q4 2025",
      rating: "Exceeds Expectations",
      reviewer: "Aarav Khanna",
      summary: "Strong coordination across teams with improved operational visibility.",
    },
    salaryHistory: [
      { date: "01 Jan 2025", previous: 86000, updated: 91000, reason: "Annual appraisal" },
      { date: "01 Jan 2026", previous: 91000, updated: 99000, reason: "Performance hike" },
    ],
    contractHistory: [
      {
        term: "1 year",
        renewedOn: "01 Jan 2026",
        expiresOn: "31 Dec 2026",
        status: "Renewed",
      },
    ],
    transactions: [
      { date: "28 Feb 2026", amount: 99000, note: "Monthly salary payout", status: "Paid" },
      { date: "31 Mar 2026", amount: 99000, note: "Salary scheduled", status: "Scheduled" },
    ],
  },
];

export function isRole(value: string): value is Role {
  return ["owner", "hr", "manager", "employee"].includes(value);
}

export function getPortalHome(role: Role) {
  return `/portal/${role}/dashboard`;
}

export function canAccess(role: Role, section: PortalSection) {
  return navItems.some((item) => item.key === section && item.allowedRoles.includes(role));
}

export function getEmployeeForRole(role: Role): EmployeeRecord {
  if (role === "employee") {
    return employeeRecords.find((employee) => employee.id === "EMP-104") ?? employeeRecords[0];
  }

  if (role === "manager") {
    return employeeRecords.find((employee) => employee.id === "EMP-102") ?? employeeRecords[0];
  }

  if (role === "hr") {
    return employeeRecords.find((employee) => employee.id === "EMP-101") ?? employeeRecords[0];
  }

  return {
    ...employeeRecords[0],
    id: "OWN-001",
    name: "Aarav Khanna",
    role: "Project Manager",
    accessRole: "owner",
    department: "Executive Office",
    avatar: "AK",
    status: "Active",
    email: "aarav.khanna@aems.local",
    phone: "+91 98765 11999",
    experience: "12 years leading operations, hiring, and company-wide transformation.",
    location: "Mumbai",
    project: "Enterprise Workforce Governance",
    manager: "Board",
    currency: "INR",
    salary: 240000,
    latestPayout: 240000,
    nextRenewal: "01 Jan 2027",
    contractExpiry: "31 Dec 2026",
    lastAppraisal: "Board Review 2025",
    lastHikePercent: 14,
  };
}

export function getVisibleEmployees(role: Role) {
  if (role === "employee") {
    return employeeRecords.filter((employee) => employee.id === "EMP-104");
  }

  if (role === "manager") {
    return employeeRecords.filter((employee) =>
      ["Engineering", "Operations"].includes(employee.department),
    );
  }

  return employeeRecords;
}

function getCurrencyIcon(currency: string): LucideIcon {
  switch (currency) {
    case "INR":
      return IndianRupee;
    case "USD":
      return DollarSign;
    case "EUR":
      return Euro;
    case "GBP":
      return PoundSterling;
    case "JPY":
      return JapaneseYen;
    default:
      return Coins;
  }
}

export function getOverviewStats(role: Role) {
  const totalPayout = employeeRecords.reduce((sum, employee) => sum + employee.salary, 0);
  const activeEmployee = getEmployeeForRole(role);

  const shared = [
    {
      label: "Employees tracked",
      value: "47",
      helper: "Across 4 active departments",
      icon: UsersRound,
    },
    {
      label: "Documents verified",
      value: "94%",
      helper: "PDF proofs cleared this month",
      icon: FileCheck2,
    },
    {
      label: "Renewals due",
      value: "08",
      helper: "Salary or contract actions pending",
      icon: CalendarClock,
    },
  ];

  if (role === "employee") {
    return [
      {
        label: "Current project",
        value: "AEMS Core",
        helper: "Delivery sprint 6 is active",
        icon: BriefcaseBusiness,
      },
      {
        label: "Latest payout",
        value: `${activeEmployee.currency} ${new Intl.NumberFormat("en-IN", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(activeEmployee.latestPayout)}`,
        helper: "Next salary scheduled for 31 Mar",
        icon: getCurrencyIcon(activeEmployee.currency),
      },
      {
        label: "Last appraisal",
        value: "Outstanding",
        helper: "15% hike approved in Jan 2026",
        icon: ShieldCheck,
      },
    ];
  }

  if (role === "manager") {
    return [
      {
        label: "Projects active",
        value: "05",
        helper: "2 flagged for weekly review",
        icon: BriefcaseBusiness,
      },
      {
        label: "Team visibility",
        value: "31",
        helper: "Employees across Engineering and Ops",
        icon: UserRound,
      },
      {
        label: "Daily updates",
        value: "12",
        helper: "HR and project logs synced today",
        icon: Bell,
      },
    ];
  }

  if (role === "hr") {
    return [
      ...shared,
      {
        label: "Monthly payout",
        value: "INR 5.4L",
        helper: "Secure payroll processing in progress",
        icon: CircleDollarSign,
      },
    ];
  }

  return [
    ...shared,
    {
      label: "Monthly payout",
      value: "INR 5.4L",
      helper: `Current modeled payout ${new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        notation: "compact",
      }).format(totalPayout)}`,
      icon: CircleDollarSign,
    },
  ];
}

export function getDashboardStatDrilldowns(role: Role): DashboardDrilldown[] {
  const visibleEmployees = getVisibleEmployees(role);
  const activeEmployee = getEmployeeForRole(role);

  if (role === "employee") {
    return [
      {
        label: "Current project",
        title: "Assigned Project Details",
        description: "Your current delivery context, status, and who is leading the work.",
        items: [
          {
            title: activeEmployee.project,
            subtitle: `Managed by ${activeEmployee.manager}`,
            value: "Sprint 6 active",
          },
          {
            title: "Current Focus",
            subtitle: "Profile workflows, document status, and HR sync improvements",
          },
          {
            title: "Project Access",
            subtitle: "Visible only to assigned employees and leadership roles",
          },
        ],
      },
      {
        label: "Latest payout",
        title: "Latest Payout Activity",
        description: "Your private payment activity with HR.",
        items: activeEmployee.transactions.map((transaction) => ({
          title: transaction.note,
          subtitle: transaction.date,
          value: formatCurrency(transaction.amount),
          status: transaction.status,
        })),
      },
      {
        label: "Last appraisal",
        title: "Appraisal Summary",
        description: "Your latest review outcome and what it means for progression.",
        items: [
          {
            title: activeEmployee.appraisal.rating,
            subtitle: `${activeEmployee.appraisal.cycle} reviewed by ${activeEmployee.appraisal.reviewer}`,
          },
          {
            title: "Review Summary",
            subtitle: activeEmployee.appraisal.summary,
          },
          {
            title: "Latest Hike",
            subtitle: `${activeEmployee.lastHikePercent}% approved in the latest cycle`,
          },
        ],
      },
    ];
  }

  if (role === "manager") {
    return [
      {
        label: "Projects active",
        title: "Active Project List",
        description: "Project portfolio visible to the manager workspace with live status signals.",
        items: projectRecords.map((project) => ({
          title: project.name,
          subtitle: `${project.department} • Deadline ${project.deadline}`,
          value: `${project.members} members`,
          status: project.status,
        })),
      },
      {
        label: "Team visibility",
        title: "Team Member Visibility",
        description: "Employees currently visible within manager oversight.",
        items: visibleEmployees.map((employee) => ({
          title: employee.name,
          subtitle: `${employee.role} • ${employee.department}`,
          value: employee.status,
        })),
      },
      {
        label: "Daily updates",
        title: "Daily Update Notifications",
        description: "Operational notifications synced from HR and project delivery updates.",
        items: [
          {
            title: "HR Synced Pending Documents",
            subtitle: "09:10 AM • Verification reminders sent to 3 employees",
            status: "Done",
          },
          {
            title: "Engineering Sprint Notes Added",
            subtitle: "10:25 AM • Scope change logged for the AEMS rollout",
            status: "Updated",
          },
          {
            title: "Operations Coverage Adjusted",
            subtitle: "12:05 PM • Backup approvals assigned for leave coverage",
            status: "Live",
          },
          {
            title: "Finance Payroll Dependency Flagged",
            subtitle: "02:40 PM • Approval needed before end-of-month cycle",
            status: "Attention",
          },
        ],
      },
    ];
  }

  if (role === "hr") {
    return [
      {
        label: "Employees tracked",
        title: "Employee Tracking List",
        description: "Current employee records actively maintained inside the HR workspace.",
        items: employeeRecords.slice(0, 6).map((employee) => ({
          title: employee.name,
          subtitle: `${employee.department} • ${employee.role}`,
          value: employee.status,
        })),
      },
      {
        label: "Documents verified",
        title: "Document Verification Queue",
        description: "Recent proof and compliance document checks across employee records.",
        items: employeeRecords.slice(0, 5).map((employee) => ({
          title: employee.name,
          subtitle: `${employee.documents.filter((document) => document.state === "Verified").length}/${employee.documents.length} documents verified`,
          value: employee.documents.some((document) => document.state === "Pending")
            ? "Pending"
            : "Verified",
        })),
      },
      {
        label: "Renewals due",
        title: "Renewals Due Soon",
        description: "Employees with salary or contract actions approaching the next review window.",
        items: employeeRecords.slice(0, 5).map((employee) => ({
          title: employee.name,
          subtitle: `Contract expiry ${employee.contractExpiry}`,
          value: employee.nextRenewal,
        })),
      },
      {
        label: "Monthly payout",
        title: "Monthly Payout Watch",
        description: "Employees included in the active payroll processing cycle.",
        items: employeeRecords.slice(0, 5).map((employee) => ({
          title: employee.name,
          subtitle: `${employee.department} payroll batch`,
          value: formatCurrency(employee.salary),
        })),
      },
    ];
  }

  return [
    {
      label: "Employees tracked",
      title: "Workforce Snapshot",
      description: "Company-wide employee visibility for owner-level review.",
      items: employeeRecords.slice(0, 6).map((employee) => ({
        title: employee.name,
        subtitle: `${employee.department} • ${employee.role}`,
        value: employee.status,
      })),
    },
    {
      label: "Documents verified",
      title: "Verification Overview",
      description: "Recent document compliance state across tracked employees.",
      items: employeeRecords.slice(0, 5).map((employee) => ({
        title: employee.name,
        subtitle: `${employee.documents.filter((document) => document.state === "Verified").length}/${employee.documents.length} documents verified`,
        value: employee.documents.some((document) => document.state === "Pending")
          ? "Pending"
          : "Verified",
      })),
    },
    {
      label: "Renewals due",
      title: "Renewal Watchlist",
      description: "Upcoming renewal events that need leadership attention.",
      items: employeeRecords.slice(0, 5).map((employee) => ({
        title: employee.name,
        subtitle: `Salary review due ${employee.nextRenewal}`,
        value: employee.contractExpiry,
      })),
    },
    {
      label: "Monthly payout",
      title: "Compensation Watch",
      description: "Top payout entries in the current modeled payroll cycle.",
      items: employeeRecords.slice(0, 5).map((employee) => ({
        title: employee.name,
        subtitle: employee.department,
        value: formatCurrency(employee.salary),
      })),
    },
  ];
}

export const reportHighlights = [
  {
    title: "Appraisal momentum",
    body:
      "86% of employees completed the latest review cycle, with the highest rating concentration inside Engineering.",
  },
  {
    title: "Payroll confidence",
    body:
      "No cross-employee payroll visibility leaks are modeled in the current access matrix.",
  },
  {
    title: "Renewal watchlist",
    body:
      "8 salary or contract renewals need action within the next 45 days to avoid delays.",
  },
];
