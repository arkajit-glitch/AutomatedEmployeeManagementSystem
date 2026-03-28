import {
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  CircleDollarSign,
  Coins,
  DollarSign,
  Euro,
  FileCheck2,
  IndianRupee,
  JapaneseYen,
  PoundSterling,
  ShieldCheck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Prisma } from "@prisma/client";

import {
  canAccess,
  type DashboardDrilldown,
  departmentRecords,
  employeeRecords,
  getDashboardStatDrilldowns,
  getOverviewStats,
  getVisibleEmployees,
  isRole,
  type PortalSection,
  type Role,
  projectRecords,
  roleNames,
} from "@/lib/data";
import { getPrismaClient, prisma } from "@/lib/prisma";
import {
  createDepartmentSchema,
  createEmployeeSchema,
  createProjectSchema,
  updateDepartmentSchema,
  updateProjectSchema,
} from "@/lib/server/validators";
import { formatCompactCurrency } from "@/lib/utils";

type BackendMode = "demo" | "database";

export type DepartmentApiRecord = {
  id: string;
  name: string;
  code?: string;
  head: string;
  employees: number;
  openRoles: number;
  status: string;
  projects?: number;
};

export type EmployeeApiRecord = {
  id: string;
  employeeCode: string;
  name: string;
  role: string;
  accessRole: Role;
  status: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  manager: string;
  project: string;
  avatar: string;
  currency: string;
  salary: number;
  latestPayout: number;
  nextRenewal: string;
  contractExpiry: string;
  lastAppraisal: string;
  lastHikePercent: number;
  achievements: string[];
  documents: Array<{ label: string; state: string }>;
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
    status: string;
  }>;
  transactions: Array<{
    date: string;
    amount: number;
    note: string;
    status: string;
  }>;
};

export type ProjectApiRecord = {
  id: string;
  slug: string;
  name: string;
  topic: string;
  lead: string;
  department: string;
  status: string;
  startDate: string;
  deadline: string;
  endDate: string;
  client: string;
  summary: string;
  overview: string;
  members: number;
  objectives: string[];
  deliverables: string[];
  stack: string[];
};

export type DashboardStatRecord = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

export type ReportHighlightRecord = {
  title: string;
  body: string;
};

export type ReportMetricRow = {
  metric: string;
  current: string;
  trend: string;
  note: string;
};

export type CreateDepartmentInput = {
  name: string;
  code: string;
  headName: string;
  openRoles: number;
  status: "Healthy" | "Hiring" | "Needs Review";
};

export type CreateProjectInput = {
  name: string;
  topic: string;
  leadName: string;
  departmentName: string;
  status: "On Track" | "At Risk" | "Planning";
  startDate: string;
  deadline: string;
  endDate: string;
  client: string;
  summary: string;
  overview: string;
  members: number;
  objectives: string[];
  deliverables: string[];
  stack: string[];
};

export type CreateEmployeeInput = {
  fullName: string;
  jobTitle: string;
  accessRole: Role;
  status: "Active" | "On Leave" | "Probation";
  email: string;
  phone: string;
  experience: string;
  location: string;
  managerName: string;
  departmentName: string;
  projectName?: string;
  currencyCode: "INR" | "USD" | "EUR" | "GBP" | "JPY";
  currentSalary: number;
  latestPayout?: number;
  nextRenewal: string;
  contractExpiry: string;
};

function formatDate(value: Date | string) {
  if (typeof value === "string") {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function titleCaseEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeStatusForDatabase(status: CreateEmployeeInput["status"]) {
  if (status === "On Leave") {
    return "ON_LEAVE" as const;
  }

  if (status === "Probation") {
    return "PROBATION" as const;
  }

  return "ACTIVE" as const;
}

function normalizeDepartmentHealthForDatabase(status: CreateDepartmentInput["status"]) {
  if (status === "Needs Review") {
    return "NEEDS_REVIEW" as const;
  }

  if (status === "Hiring") {
    return "HIRING" as const;
  }

  return "HEALTHY" as const;
}

function normalizeProjectStatusForDatabase(status: CreateProjectInput["status"]) {
  if (status === "At Risk") {
    return "AT_RISK" as const;
  }

  if (status === "Planning") {
    return "PLANNING" as const;
  }

  return "ON_TRACK" as const;
}

function normalizeAccessRoleForDatabase(accessRole: Role) {
  return accessRole.toUpperCase() as "OWNER" | "HR" | "MANAGER" | "EMPLOYEE";
}

function getAvatarFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getNextEmployeeCode() {
  const maxCode = employeeRecords.reduce((max, employee) => {
    const numeric = Number(employee.id.replace(/\D/g, ""));
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 100);

  return `EMP-${String(maxCode + 1).padStart(3, "0")}`;
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

function parseDateString(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function countRenewalsDue(employees: EmployeeApiRecord[], days = 60) {
  const now = new Date();

  return employees.filter((employee) => {
    const renewalDate = parseDateString(employee.nextRenewal);

    if (!renewalDate) {
      return false;
    }

    const diff = renewalDate.getTime() - now.getTime();
    const diffDays = diff / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= days;
  }).length;
}

function getDocumentMetrics(employees: EmployeeApiRecord[]) {
  const documents = employees.flatMap((employee) => employee.documents);
  const verified = documents.filter((document) => document.state === "Verified").length;
  const percentage = documents.length === 0 ? 0 : Math.round((verified / documents.length) * 100);

  return {
    total: documents.length,
    verified,
    percentage,
  };
}

function buildDashboardStats(
  role: Role,
  employees: EmployeeApiRecord[],
  projects: ProjectApiRecord[],
): DashboardStatRecord[] {
  if (role === "employee") {
    const activeEmployee = employees[0];

    if (!activeEmployee) {
      return [];
    }

    return [
      {
        label: "Current project",
        value: activeEmployee.project,
        helper: `Managed by ${activeEmployee.manager}`,
        icon: BriefcaseBusiness,
      },
      {
        label: "Latest payout",
        value: formatCompactCurrency(activeEmployee.latestPayout, activeEmployee.currency),
        helper: `Next salary scheduled for ${activeEmployee.transactions[0]?.date ?? activeEmployee.nextRenewal}`,
        icon: getCurrencyIcon(activeEmployee.currency),
      },
      {
        label: "Last appraisal",
        value: activeEmployee.appraisal.rating,
        helper: `${activeEmployee.lastHikePercent}% hike approved in the latest cycle`,
        icon: ShieldCheck,
      },
    ];
  }

  if (role === "manager") {
    return [
      {
        label: "Projects active",
        value: String(projects.length).padStart(2, "0"),
        helper: `${projects.filter((project) => project.status === "At Risk").length} flagged for review`,
        icon: BriefcaseBusiness,
      },
      {
        label: "Team visibility",
        value: String(employees.length),
        helper: "Employees visible in manager scope",
        icon: UserRound,
      },
      {
        label: "Daily updates",
        value: "04",
        helper: "HR and project logs synced today",
        icon: Bell,
      },
    ];
  }

  const documentMetrics = getDocumentMetrics(employees);
  const renewalsDue = countRenewalsDue(employees);
  const payoutTotal = employees.reduce((sum, employee) => sum + employee.salary, 0);

  return [
    {
      label: "Employees tracked",
      value: String(employees.length).padStart(2, "0"),
      helper: `Across ${new Set(employees.map((employee) => employee.department)).size} active departments`,
      icon: UsersRound,
    },
    {
      label: "Documents verified",
      value: `${documentMetrics.percentage}%`,
      helper: `${documentMetrics.verified}/${documentMetrics.total} employee documents verified`,
      icon: FileCheck2,
    },
    {
      label: "Renewals due",
      value: String(renewalsDue).padStart(2, "0"),
      helper: "Salary or contract actions pending",
      icon: CalendarClock,
    },
    {
      label: "Monthly payout",
      value: formatCompactCurrency(payoutTotal),
      helper: "Secure payroll processing in progress",
      icon: CircleDollarSign,
    },
  ];
}

function buildDashboardDrilldowns(
  role: Role,
  employees: EmployeeApiRecord[],
  projects: ProjectApiRecord[],
): DashboardDrilldown[] {
  if (role === "employee") {
    const activeEmployee = employees[0];
    const activeProject = projects.find((project) => project.name === activeEmployee?.project);

    if (!activeEmployee) {
      return [];
    }

    return [
      {
        label: "Current project",
        title: "Assigned Project Details",
        description: "Your current delivery context, status, and who is leading the work.",
        items: [
          {
            title: activeEmployee.project,
            subtitle: `Managed by ${activeEmployee.manager}`,
            value: activeProject?.status ?? "Active",
            href: activeProject ? `/portal/${role}/projects/${activeProject.slug}` : undefined,
          },
          {
            title: "Current Focus",
            subtitle: activeProject?.topic ?? "Project context is being prepared for this employee.",
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
          value: formatCompactCurrency(transaction.amount, activeEmployee.currency),
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
        items: projects.map((project) => ({
          title: project.name,
          subtitle: `${project.department} • Deadline ${project.deadline}`,
          value: `${project.members} members`,
          status: project.status,
          href: `/portal/${role}/projects/${project.slug}`,
        })),
      },
      {
        label: "Team visibility",
        title: "Team Member Visibility",
        description: "Employees currently visible within manager oversight.",
        items: employees.map((employee) => ({
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
            subtitle: "09:10 AM • Verification reminders sent to employees with pending proofs",
            status: "Done",
          },
          {
            title: "Engineering Sprint Notes Added",
            subtitle: "10:25 AM • Scope change logged for the active rollout",
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

  const documentMetrics = getDocumentMetrics(employees);

  return [
    {
      label: "Employees tracked",
      title: role === "owner" ? "Workforce Snapshot" : "Employee Tracking List",
      description:
        role === "owner"
          ? "Company-wide employee visibility for owner-level review."
          : "Current employee records actively maintained inside the HR workspace.",
      items: employees.slice(0, 6).map((employee) => ({
        title: employee.name,
        subtitle: `${employee.department} • ${employee.role}`,
        value: employee.status,
      })),
    },
    {
      label: "Documents verified",
      title: role === "owner" ? "Verification Overview" : "Document Verification Queue",
      description: `${documentMetrics.verified} of ${documentMetrics.total} documents are verified in the current scope.`,
      items: employees.slice(0, 5).map((employee) => ({
        title: employee.name,
        subtitle: `${employee.documents.filter((document) => document.state === "Verified").length}/${employee.documents.length} documents verified`,
        value: employee.documents.some((document) => document.state === "Pending")
          ? "Pending"
          : "Verified",
      })),
    },
    {
      label: "Renewals due",
      title: role === "owner" ? "Renewal Watchlist" : "Renewals Due Soon",
      description: "Employees with salary or contract actions approaching the next review window.",
      items: employees.slice(0, 5).map((employee) => ({
        title: employee.name,
        subtitle:
          role === "owner"
            ? `Salary review due ${employee.nextRenewal}`
            : `Contract expiry ${employee.contractExpiry}`,
        value: role === "owner" ? employee.contractExpiry : employee.nextRenewal,
      })),
    },
    {
      label: "Monthly payout",
      title: role === "owner" ? "Compensation Watch" : "Monthly Payout Watch",
      description: "Employees included in the active payroll processing cycle.",
      items: employees.slice(0, 5).map((employee) => ({
        title: employee.name,
        subtitle: `${employee.department} payroll batch`,
        value: formatCompactCurrency(employee.salary, employee.currency),
      })),
    },
  ];
}

function accessRoleFromDb(value: string): Role {
  const normalized = value.toLowerCase();
  return isRole(normalized) ? normalized : "employee";
}

function getBackendMode(): BackendMode {
  return process.env.DATABASE_URL && prisma ? "database" : "demo";
}

function getRoleScopedDemoEmployees(role: Role) {
  return getVisibleEmployees(role);
}

async function getRoleScopedDatabaseEmployees(role: Role) {
  const db = getPrismaClient();

  if (role === "manager") {
    return db.employee.findMany({
      where: {
        department: {
          name: {
            in: ["Engineering", "Operations"],
          },
        },
      },
      include: {
        department: true,
        currentProject: true,
        achievements: true,
        documents: true,
        appraisals: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        salaryChanges: {
          orderBy: {
            effectiveDate: "desc",
          },
        },
        contractRenewals: {
          orderBy: {
            renewedOn: "desc",
          },
        },
        payrollTransactions: {
          orderBy: {
            transactionDate: "desc",
          },
        },
      },
      orderBy: {
        fullName: "asc",
      },
    });
  }

  if (role === "employee") {
    return db.employee.findMany({
      where: {
        employeeCode: "EMP-104",
      },
      include: {
        department: true,
        currentProject: true,
        achievements: true,
        documents: true,
        appraisals: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        salaryChanges: {
          orderBy: {
            effectiveDate: "desc",
          },
        },
        contractRenewals: {
          orderBy: {
            renewedOn: "desc",
          },
        },
        payrollTransactions: {
          orderBy: {
            transactionDate: "desc",
          },
        },
      },
      orderBy: {
        fullName: "asc",
      },
    });
  }

  return db.employee.findMany({
    include: {
      department: true,
      currentProject: true,
      achievements: true,
      documents: true,
      appraisals: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      salaryChanges: {
        orderBy: {
          effectiveDate: "desc",
        },
      },
      contractRenewals: {
        orderBy: {
          renewedOn: "desc",
        },
      },
      payrollTransactions: {
        orderBy: {
          transactionDate: "desc",
        },
      },
    },
    orderBy: {
      fullName: "asc",
    },
  });
}

function mapDemoEmployee(employee: (typeof employeeRecords)[number]): EmployeeApiRecord {
  return {
    id: employee.id,
    employeeCode: employee.id,
    name: employee.name,
    role: employee.role,
    accessRole: employee.accessRole,
    status: employee.status,
    department: employee.department,
    email: employee.email,
    phone: employee.phone,
    location: employee.location,
    experience: employee.experience,
    manager: employee.manager,
    project: employee.project,
    avatar: employee.avatar,
    currency: employee.currency,
    salary: employee.salary,
    latestPayout: employee.latestPayout,
    nextRenewal: employee.nextRenewal,
    contractExpiry: employee.contractExpiry,
    lastAppraisal: employee.lastAppraisal,
    lastHikePercent: employee.lastHikePercent,
    achievements: employee.achievements,
    documents: employee.documents,
    appraisal: {
      cycle: employee.appraisal.cycle,
      rating: employee.appraisal.rating,
      reviewer: employee.appraisal.reviewer,
      summary: employee.appraisal.summary,
    },
    salaryHistory: employee.salaryHistory.map((entry) => ({
      date: entry.date,
      previous: entry.previous,
      updated: entry.updated,
      reason: entry.reason,
    })),
    contractHistory: employee.contractHistory.map((entry) => ({
      term: entry.term,
      renewedOn: entry.renewedOn,
      expiresOn: entry.expiresOn,
      status: entry.status,
    })),
    transactions: employee.transactions.map((entry) => ({
      date: entry.date,
      amount: entry.amount,
      note: entry.note,
      status: entry.status,
    })),
  };
}

function mapDatabaseEmployee(employee: Awaited<ReturnType<typeof getRoleScopedDatabaseEmployees>>[number]): EmployeeApiRecord {
  const latestAppraisal = employee.appraisals[0];

  return {
    id: employee.id,
    employeeCode: employee.employeeCode,
    name: employee.fullName,
    role: employee.jobTitle,
    accessRole: accessRoleFromDb(employee.accessRole),
    status: titleCaseEnum(employee.status),
    department: employee.department.name,
    email: employee.email,
    phone: employee.phone,
    location: employee.location,
    experience: employee.experience,
    manager: employee.managerName,
    project: employee.currentProject?.name ?? "Unassigned",
    avatar: employee.avatar,
    currency: employee.currencyCode,
    salary: employee.currentSalary,
    latestPayout: employee.latestPayout,
    nextRenewal: formatDate(employee.nextRenewal),
    contractExpiry: formatDate(employee.contractExpiry),
    lastAppraisal: employee.lastAppraisalCycle,
    lastHikePercent: employee.lastHikePercent,
    achievements: employee.achievements.map((entry) => entry.body),
    documents: employee.documents.map((entry) => ({
      label: entry.label,
      state: titleCaseEnum(entry.state),
    })),
    appraisal: {
      cycle: latestAppraisal?.cycle ?? employee.lastAppraisalCycle,
      rating: latestAppraisal?.rating ?? "Pending",
      reviewer: latestAppraisal?.reviewerName ?? employee.managerName,
      summary: latestAppraisal?.summary ?? "No appraisal summary is stored yet.",
    },
    salaryHistory: employee.salaryChanges.map((entry) => ({
      date: formatDate(entry.effectiveDate),
      previous: entry.previousAmount,
      updated: entry.updatedAmount,
      reason: entry.reason,
    })),
    contractHistory: employee.contractRenewals.map((entry) => ({
      term: entry.term,
      renewedOn: formatDate(entry.renewedOn),
      expiresOn: formatDate(entry.expiresOn),
      status: titleCaseEnum(entry.status),
    })),
    transactions: employee.payrollTransactions.map((entry) => ({
      date: formatDate(entry.transactionDate),
      amount: entry.amount,
      note: entry.note,
      status: titleCaseEnum(entry.status),
    })),
  };
}

function mapDemoProject(project: (typeof projectRecords)[number]): ProjectApiRecord {
  return {
    id: project.slug,
    slug: project.slug,
    name: project.name,
    topic: project.topic,
    lead: project.lead,
    department: project.department,
    status: project.status,
    startDate: project.startDate,
    deadline: project.deadline,
    endDate: project.endDate,
    client: project.client,
    summary: project.summary,
    overview: project.overview,
    members: project.members,
    objectives: project.objectives,
    deliverables: project.deliverables,
    stack: project.stack,
  };
}

export async function listDepartments() {
  if (getBackendMode() === "demo") {
    return departmentRecords.map((department) => ({
      id: department.name.toLowerCase().replace(/\s+/g, "-"),
      name: department.name,
      head: department.head,
      employees: department.employees,
      openRoles: department.openRoles,
      status: department.status,
    }));
  }

  const db = getPrismaClient();
  const departments = await db.department.findMany({
    include: {
      _count: {
        select: {
          employees: true,
          projects: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return departments.map((department): DepartmentApiRecord => ({
    id: department.id,
    name: department.name,
    code: department.code,
    head: department.headName,
    employees: department._count.employees,
    openRoles: department.openRoles,
    status: titleCaseEnum(department.health),
    projects: department._count.projects,
  }));
}

export async function getDepartmentDetail(role: Role, departmentId: string) {
  if (!canAccess(role, "departments")) {
    return null;
  }

  const departments = await listDepartments();
  return departments.find((department) => department.id === departmentId);
}

export async function listEmployees(role: Role) {
  if (getBackendMode() === "demo") {
    return getRoleScopedDemoEmployees(role).map(mapDemoEmployee);
  }

  const employees = await getRoleScopedDatabaseEmployees(role);
  return employees.map(mapDatabaseEmployee);
}

export async function getEmployeeDetail(role: Role, employeeId: string) {
  const employees = await listEmployees(role);
  return employees.find(
    (employee) => employee.id === employeeId || employee.employeeCode === employeeId,
  );
}

export async function listProjects(role: Role) {
  if (getBackendMode() === "demo") {
    const visibleProjectNames = new Set(getRoleScopedDemoEmployees(role).map((employee) => employee.project));
    return projectRecords
      .filter((project) => (role === "employee" ? visibleProjectNames.has(project.name) : true))
      .map(mapDemoProject);
  }

  const db = getPrismaClient();
  const projects = await db.project.findMany({
    include: {
      department: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const mapped = projects.map(
    (project): ProjectApiRecord => ({
      id: project.id,
      slug: project.slug,
      name: project.name,
      topic: project.topic,
      lead: project.leadName,
      department: project.department.name,
      status: titleCaseEnum(project.status),
      startDate: formatDate(project.startDate),
      deadline: formatDate(project.deadline),
      endDate: formatDate(project.endDate),
      client: project.client,
      summary: project.summary,
      overview: project.overview,
      members: project.membersCount,
      objectives: Array.isArray(project.objectives) ? project.objectives.map(String) : [],
      deliverables: Array.isArray(project.deliverables)
        ? project.deliverables.map(String)
        : [],
      stack: Array.isArray(project.stack) ? project.stack.map(String) : [],
    }),
  );

  if (role !== "employee") {
    return mapped;
  }

  const visibleProjectNames = new Set((await listEmployees(role)).map((employee) => employee.project));
  return mapped.filter((project) => visibleProjectNames.has(project.name));
}

export async function getProjectDetail(role: Role, projectSlug: string) {
  const projects = await listProjects(role);
  return projects.find((project) => project.slug === projectSlug);
}

export async function createEmployee(role: Role, payload: CreateEmployeeInput) {
  if (!["owner", "hr"].includes(role)) {
    throw new Error("FORBIDDEN");
  }

  const parsed = createEmployeeSchema.parse(payload);

  if (getBackendMode() === "demo") {
    return {
      persisted: false,
      employee: {
        id: `demo-${Date.now()}`,
        employeeCode: getNextEmployeeCode(),
        name: parsed.fullName,
        role: parsed.jobTitle,
        accessRole: parsed.accessRole,
        status: parsed.status,
        department: parsed.departmentName,
        email: parsed.email,
        phone: parsed.phone,
        location: parsed.location,
        experience: parsed.experience,
        manager: parsed.managerName,
        project: parsed.projectName?.trim() || "Unassigned",
        avatar: getAvatarFromName(parsed.fullName),
        currency: parsed.currencyCode,
        salary: parsed.currentSalary,
        latestPayout: parsed.latestPayout ?? parsed.currentSalary,
        nextRenewal: parsed.nextRenewal,
        contractExpiry: parsed.contractExpiry,
        lastAppraisal: "Pending",
        lastHikePercent: 0,
        achievements: [],
        documents: [],
        appraisal: {
          cycle: "Pending",
          rating: "Pending",
          reviewer: parsed.managerName,
          summary: "This employee was created in demo mode and has no appraisal history yet.",
        },
        salaryHistory: [],
        contractHistory: [],
        transactions: [],
      } satisfies EmployeeApiRecord,
    };
  }

  const db = getPrismaClient();
  const department = await db.department.findFirst({
    where: {
      name: parsed.departmentName,
    },
  });

  if (!department) {
    throw new Error("DEPARTMENT_NOT_FOUND");
  }

  const project = parsed.projectName
    ? await db.project.findFirst({
        where: {
          name: parsed.projectName,
        },
      })
    : null;

  if (parsed.projectName && !project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const existingCount = await db.employee.count();
  const employeeCode = `EMP-${String(existingCount + 101).padStart(3, "0")}`;

  const created = await db.employee.create({
    data: {
      employeeCode,
      fullName: parsed.fullName,
      jobTitle: parsed.jobTitle,
      accessRole: normalizeAccessRoleForDatabase(parsed.accessRole),
      status: normalizeStatusForDatabase(parsed.status),
      email: parsed.email,
      phone: parsed.phone,
      experience: parsed.experience,
      location: parsed.location,
      managerName: parsed.managerName,
      currencyCode: parsed.currencyCode,
      currentSalary: parsed.currentSalary,
      latestPayout: parsed.latestPayout ?? parsed.currentSalary,
      nextRenewal: new Date(parsed.nextRenewal),
      contractExpiry: new Date(parsed.contractExpiry),
      lastAppraisalCycle: "Pending",
      lastHikePercent: 0,
      avatar: getAvatarFromName(parsed.fullName),
      department: {
        connect: {
          id: department.id,
        },
      },
      currentProject: project
        ? {
            connect: {
              id: project.id,
            },
          }
        : undefined,
      appraisals: {
        create: {
          cycle: "Pending",
          rating: "Pending",
          reviewerName: parsed.managerName,
          summary: "Initial employee profile created. Appraisal cycle not started yet.",
        },
      },
      projectAssignments: project
        ? {
            create: {
              projectId: project.id,
              roleLabel: parsed.jobTitle,
            },
          }
        : undefined,
    },
    include: {
      department: true,
      currentProject: true,
      achievements: true,
      documents: true,
      appraisals: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      salaryChanges: true,
      contractRenewals: true,
      payrollTransactions: true,
    },
  });

  return {
    persisted: true,
    employee: mapDatabaseEmployee(created),
  };
}

export async function createDepartment(role: Role, payload: CreateDepartmentInput) {
  if (!["owner", "hr"].includes(role)) {
    throw new Error("FORBIDDEN");
  }

  const parsed = createDepartmentSchema.parse(payload);

  if (getBackendMode() === "demo") {
    return {
      persisted: false,
      department: {
        id: `demo-department-${Date.now()}`,
        name: parsed.name,
        code: parsed.code.toUpperCase(),
        head: parsed.headName,
        employees: 0,
        openRoles: parsed.openRoles,
        status: parsed.status,
        projects: 0,
      } satisfies DepartmentApiRecord,
    };
  }

  const db = getPrismaClient();
  const created = await db.department.create({
    data: {
      name: parsed.name,
      code: parsed.code.toUpperCase(),
      headName: parsed.headName,
      openRoles: parsed.openRoles,
      health: normalizeDepartmentHealthForDatabase(parsed.status),
    },
    include: {
      _count: {
        select: {
          employees: true,
          projects: true,
        },
      },
    },
  });

  return {
    persisted: true,
    department: {
      id: created.id,
      name: created.name,
      code: created.code,
      head: created.headName,
      employees: created._count.employees,
      openRoles: created.openRoles,
      status: titleCaseEnum(created.health),
      projects: created._count.projects,
    } satisfies DepartmentApiRecord,
  };
}

export async function updateDepartment(
  role: Role,
  departmentId: string,
  payload: Partial<CreateDepartmentInput>,
) {
  if (!["owner", "hr"].includes(role)) {
    throw new Error("FORBIDDEN");
  }

  const parsed = updateDepartmentSchema.parse(payload);

  if (getBackendMode() === "demo") {
    const current = departmentRecords.find(
      (department) => department.name.toLowerCase().replace(/\s+/g, "-") === departmentId,
    );

    if (!current) {
      throw new Error("NOT_FOUND");
    }

    return {
      persisted: false,
      department: {
        id: departmentId,
        name: parsed.name ?? current.name,
        code: parsed.code?.toUpperCase(),
        head: parsed.headName ?? current.head,
        employees: current.employees,
        openRoles: parsed.openRoles ?? current.openRoles,
        status: parsed.status ?? current.status,
        projects: undefined,
      } satisfies DepartmentApiRecord,
    };
  }

  const db = getPrismaClient();
  const updated = await db.department.update({
    where: {
      id: departmentId,
    },
    data: {
      name: parsed.name,
      code: parsed.code?.toUpperCase(),
      headName: parsed.headName,
      openRoles: parsed.openRoles,
      health: parsed.status ? normalizeDepartmentHealthForDatabase(parsed.status) : undefined,
    },
    include: {
      _count: {
        select: {
          employees: true,
          projects: true,
        },
      },
    },
  });

  return {
    persisted: true,
    department: {
      id: updated.id,
      name: updated.name,
      code: updated.code,
      head: updated.headName,
      employees: updated._count.employees,
      openRoles: updated.openRoles,
      status: titleCaseEnum(updated.health),
      projects: updated._count.projects,
    } satisfies DepartmentApiRecord,
  };
}

export async function deleteDepartment(role: Role, departmentId: string) {
  if (!["owner", "hr"].includes(role)) {
    throw new Error("FORBIDDEN");
  }

  if (getBackendMode() === "demo") {
    return { persisted: false };
  }

  const db = getPrismaClient();

  try {
    await db.department.delete({
      where: {
        id: departmentId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new Error("DEPARTMENT_IN_USE");
      }

      if (error.code === "P2025") {
        throw new Error("NOT_FOUND");
      }
    }

    throw error;
  }

  return { persisted: true };
}

export async function createProject(role: Role, payload: CreateProjectInput) {
  if (!["owner", "hr"].includes(role)) {
    throw new Error("FORBIDDEN");
  }

  const parsed = createProjectSchema.parse(payload);

  if (getBackendMode() === "demo") {
    return {
      persisted: false,
      project: {
        id: `demo-project-${Date.now()}`,
        slug: slugify(parsed.name),
        name: parsed.name,
        topic: parsed.topic,
        lead: parsed.leadName,
        department: parsed.departmentName,
        status: parsed.status,
        startDate: parsed.startDate,
        deadline: parsed.deadline,
        endDate: parsed.endDate,
        client: parsed.client,
        summary: parsed.summary,
        overview: parsed.overview,
        members: parsed.members,
        objectives: parsed.objectives,
        deliverables: parsed.deliverables,
        stack: parsed.stack,
      } satisfies ProjectApiRecord,
    };
  }

  const db = getPrismaClient();
  const department = await db.department.findFirst({
    where: {
      name: parsed.departmentName,
    },
  });

  if (!department) {
    throw new Error("DEPARTMENT_NOT_FOUND");
  }

  const created = await db.project.create({
    data: {
      slug: slugify(parsed.name),
      name: parsed.name,
      topic: parsed.topic,
      leadName: parsed.leadName,
      department: {
        connect: {
          id: department.id,
        },
      },
      status: normalizeProjectStatusForDatabase(parsed.status),
      startDate: new Date(parsed.startDate),
      deadline: new Date(parsed.deadline),
      endDate: new Date(parsed.endDate),
      client: parsed.client,
      summary: parsed.summary,
      overview: parsed.overview,
      membersCount: parsed.members,
      objectives: parsed.objectives,
      deliverables: parsed.deliverables,
      stack: parsed.stack,
    },
    include: {
      department: true,
    },
  });

  return {
    persisted: true,
    project: {
      id: created.id,
      slug: created.slug,
      name: created.name,
      topic: created.topic,
      lead: created.leadName,
      department: created.department.name,
      status: titleCaseEnum(created.status),
      startDate: formatDate(created.startDate),
      deadline: formatDate(created.deadline),
      endDate: formatDate(created.endDate),
      client: created.client,
      summary: created.summary,
      overview: created.overview,
      members: created.membersCount,
      objectives: Array.isArray(created.objectives) ? created.objectives.map(String) : [],
      deliverables: Array.isArray(created.deliverables)
        ? created.deliverables.map(String)
        : [],
      stack: Array.isArray(created.stack) ? created.stack.map(String) : [],
    } satisfies ProjectApiRecord,
  };
}

export async function updateProject(
  role: Role,
  projectSlug: string,
  payload: Partial<CreateProjectInput>,
) {
  if (!["owner", "hr"].includes(role)) {
    throw new Error("FORBIDDEN");
  }

  const parsed = updateProjectSchema.parse(payload);

  if (getBackendMode() === "demo") {
    const current = projectRecords.find((project) => project.slug === projectSlug);

    if (!current) {
      throw new Error("NOT_FOUND");
    }

    return {
      persisted: false,
      project: {
        id: current.slug,
        slug: parsed.name ? slugify(parsed.name) : current.slug,
        name: parsed.name ?? current.name,
        topic: parsed.topic ?? current.topic,
        lead: parsed.leadName ?? current.lead,
        department: parsed.departmentName ?? current.department,
        status: parsed.status ?? current.status,
        startDate: parsed.startDate ?? current.startDate,
        deadline: parsed.deadline ?? current.deadline,
        endDate: parsed.endDate ?? current.endDate,
        client: parsed.client ?? current.client,
        summary: parsed.summary ?? current.summary,
        overview: parsed.overview ?? current.overview,
        members: parsed.members ?? current.members,
        objectives: parsed.objectives ?? current.objectives,
        deliverables: parsed.deliverables ?? current.deliverables,
        stack: parsed.stack ?? current.stack,
      } satisfies ProjectApiRecord,
    };
  }

  const db = getPrismaClient();
  const department =
    parsed.departmentName &&
    (await db.department.findFirst({
      where: {
        name: parsed.departmentName,
      },
    }));

  if (parsed.departmentName && !department) {
    throw new Error("DEPARTMENT_NOT_FOUND");
  }

  const updated = await db.project.update({
    where: {
      slug: projectSlug,
    },
    data: {
      slug: parsed.name ? slugify(parsed.name) : undefined,
      name: parsed.name,
      topic: parsed.topic,
      leadName: parsed.leadName,
      department: department
        ? {
            connect: {
              id: department.id,
            },
          }
        : undefined,
      status: parsed.status ? normalizeProjectStatusForDatabase(parsed.status) : undefined,
      startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
      deadline: parsed.deadline ? new Date(parsed.deadline) : undefined,
      endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
      client: parsed.client,
      summary: parsed.summary,
      overview: parsed.overview,
      membersCount: parsed.members,
      objectives: parsed.objectives,
      deliverables: parsed.deliverables,
      stack: parsed.stack,
    },
    include: {
      department: true,
    },
  });

  return {
    persisted: true,
    project: {
      id: updated.id,
      slug: updated.slug,
      name: updated.name,
      topic: updated.topic,
      lead: updated.leadName,
      department: updated.department.name,
      status: titleCaseEnum(updated.status),
      startDate: formatDate(updated.startDate),
      deadline: formatDate(updated.deadline),
      endDate: formatDate(updated.endDate),
      client: updated.client,
      summary: updated.summary,
      overview: updated.overview,
      members: updated.membersCount,
      objectives: Array.isArray(updated.objectives) ? updated.objectives.map(String) : [],
      deliverables: Array.isArray(updated.deliverables)
        ? updated.deliverables.map(String)
        : [],
      stack: Array.isArray(updated.stack) ? updated.stack.map(String) : [],
    } satisfies ProjectApiRecord,
  };
}

export async function deleteProject(role: Role, projectSlug: string) {
  if (!["owner", "hr"].includes(role)) {
    throw new Error("FORBIDDEN");
  }

  if (getBackendMode() === "demo") {
    return { persisted: false };
  }

  const db = getPrismaClient();

  try {
    await db.project.delete({
      where: {
        slug: projectSlug,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new Error("NOT_FOUND");
    }

    throw error;
  }

  return { persisted: true };
}

export async function getDashboardPayload(role: Role) {
  const allowedSections: PortalSection[] = [
    "dashboard",
    "departments",
    "employees",
    "projects",
    "payroll",
    "reports",
  ];
  const employees = await listEmployees(role);
  const projects = await listProjects(role);

  return {
    role,
    roleName: roleNames[role],
    backendMode: getBackendMode(),
    allowedSections: allowedSections.filter((section) => canAccess(role, section)),
    overviewStats:
      getBackendMode() === "demo" ? getOverviewStats(role) : buildDashboardStats(role, employees, projects),
    drilldowns:
      getBackendMode() === "demo"
        ? getDashboardStatDrilldowns(role)
        : buildDashboardDrilldowns(role, employees, projects),
    visibleEmployeeCount: employees.length,
    visibleProjectCount: projects.length,
  };
}

export async function getReportPayload(role: Role) {
  const employees = await listEmployees(role);
  const departments = await listDepartments();
  const documentMetrics = getDocumentMetrics(employees);
  const renewalsDue = countRenewalsDue(employees);
  const appraisalClosed = employees.filter(
    (employee) => employee.appraisal.rating !== "Pending",
  ).length;
  const appraisalPercent =
    employees.length === 0 ? 0 : Math.round((appraisalClosed / employees.length) * 100);
  const highlights: ReportHighlightRecord[] = [
    {
      title: "Appraisal momentum",
      body: `${appraisalPercent}% of visible employees already have appraisal records, with ${employees.filter((employee) => employee.appraisal.rating === "Outstanding").length} marked outstanding.`,
    },
    {
      title: "Payroll confidence",
      body: `${employees.reduce((sum, employee) => sum + employee.transactions.length, 0)} payroll transactions are visible in the current scope with role-based access still enforced.`,
    },
    {
      title: "Renewal watchlist",
      body: `${renewalsDue} salary or contract renewals fall within the next 60 days across the current report scope.`,
    },
  ];

  const rows: ReportMetricRow[] = [
    {
      metric: "Headcount coverage",
      current: `${employees.length} active records`,
      trend: "Stable",
      note: `Track ${departments.reduce((sum, department) => sum + department.openRoles, 0)} open roles across departments`,
    },
    {
      metric: "Document completion",
      current: `${documentMetrics.percentage}%`,
      trend: "Improving",
      note: `${documentMetrics.total - documentMetrics.verified} documents still need verification`,
    },
    {
      metric: "Appraisal closure",
      current: `${appraisalPercent}%`,
      trend: "Healthy",
      note: "Finalize pending reviews before the next renewal cycle",
    },
    {
      metric: "Renewal compliance",
      current: `${renewalsDue} due soon`,
      trend: renewalsDue > 0 ? "Needs focus" : "Clear",
      note: "Lock salary and contract actions before payroll processing",
    },
  ];

  return {
    highlights,
    rows,
  };
}

export function getBackendStatus() {
  return {
    mode: getBackendMode(),
    databaseConfigured: Boolean(process.env.DATABASE_URL),
  };
}
