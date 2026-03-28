/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv/config");

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

function date(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

async function main() {
  await prisma.projectAssignment.deleteMany();
  await prisma.payrollTransaction.deleteMany();
  await prisma.contractRenewal.deleteMany();
  await prisma.salaryChange.deleteMany();
  await prisma.appraisal.deleteMany();
  await prisma.employeeDocument.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.project.deleteMany();
  await prisma.department.deleteMany();

  const departments = [
    {
      name: "Engineering",
      code: "ENG",
      headName: "Ravi Mehta",
      openRoles: 2,
      health: "HEALTHY",
    },
    {
      name: "Human Resources",
      code: "HR",
      headName: "Neha Sharma",
      openRoles: 1,
      health: "HIRING",
    },
    {
      name: "Finance",
      code: "FIN",
      headName: "Aditi Rao",
      openRoles: 0,
      health: "HEALTHY",
    },
    {
      name: "Operations",
      code: "OPS",
      headName: "Arjun Sen",
      openRoles: 3,
      health: "NEEDS_REVIEW",
    },
  ];

  for (const department of departments) {
    await prisma.department.create({
      data: department,
    });
  }

  const departmentMap = Object.fromEntries(
    (await prisma.department.findMany()).map((department) => [department.name, department.id]),
  );

  const projects = [
    {
      slug: "aems-core-rollout",
      name: "AEMS Core Rollout",
      topic: "Employee management platform delivery",
      leadName: "Ravi Mehta",
      departmentId: departmentMap["Engineering"],
      status: "ON_TRACK",
      startDate: date("2026-01-15"),
      deadline: date("2026-04-15"),
      endDate: date("2026-04-15"),
      client: "Internal Operations",
      summary:
        "Employee records, payroll privacy, and role-aware dashboards are in active delivery.",
      overview:
        "This project covers the first production-ready version of the Automated Employee Management System, including role-aware dashboards, employee lifecycle views, payroll privacy controls, and project tracking surfaces.",
      membersCount: 14,
      objectives: [
        "Unify fragmented HR and employee workflows into one platform.",
        "Provide role-based dashboards for Owner, HR, Manager, and Employee users.",
        "Protect payroll visibility while keeping employee self-service intact.",
      ],
      deliverables: [
        "Employee profile and detail workflows",
        "Payroll and appraisal visibility controls",
        "Interactive dashboard and reporting views",
      ],
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Role-based UI architecture"],
    },
    {
      slug: "quarterly-appraisal-cycle",
      name: "Quarterly Appraisal Cycle",
      topic: "Performance review operations",
      leadName: "Neha Sharma",
      departmentId: departmentMap["Human Resources"],
      status: "PLANNING",
      startDate: date("2026-04-01"),
      deadline: date("2026-04-22"),
      endDate: date("2026-04-30"),
      client: "HR Leadership",
      summary:
        "Review templates, reviewer assignments, and hike recommendations are being prepared.",
      overview:
        "This initiative structures the quarterly review process, including reviewer mapping, rating calibration, appraisal documentation, and hike recommendation preparation.",
      membersCount: 9,
      objectives: [
        "Finalize appraisal templates for all active departments.",
        "Align reviewer responsibilities and deadlines.",
        "Prepare salary hike recommendations from review outcomes.",
      ],
      deliverables: [
        "Quarterly review templates",
        "Reviewer assignment matrix",
        "Appraisal and hike recommendation summary",
      ],
      stack: ["Internal HR workflows", "Performance records", "Review scheduling"],
    },
    {
      slug: "finance-sync-upgrade",
      name: "Finance Sync Upgrade",
      topic: "Payroll reconciliation and finance controls",
      leadName: "Aditi Rao",
      departmentId: departmentMap["Finance"],
      status: "AT_RISK",
      startDate: date("2026-02-10"),
      deadline: date("2026-04-30"),
      endDate: date("2026-04-30"),
      client: "Finance Operations",
      summary:
        "Pending payroll reconciliation rules and payout lock controls for restricted users.",
      overview:
        "This work stream upgrades salary reconciliation visibility, approval checkpoints, and restricted payout handling so finance operations remain accurate and secure.",
      membersCount: 6,
      objectives: [
        "Improve payroll reconciliation reliability.",
        "Introduce tighter payout approval controls.",
        "Reduce month-end finance exceptions.",
      ],
      deliverables: [
        "Reconciliation workflow updates",
        "Restricted payout control rules",
        "Exception tracking dashboard",
      ],
      stack: ["Finance rules", "Approval flows", "Payroll audit checkpoints"],
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }

  const projectMap = Object.fromEntries(
    (await prisma.project.findMany()).map((project) => [project.name, project.id]),
  );

  const employees = [
    {
      employeeCode: "EMP-101",
      fullName: "Neha Sharma",
      jobTitle: "HR Executive",
      accessRole: "HR",
      status: "ACTIVE",
      email: "neha.sharma@aems.local",
      phone: "+91 98765 11001",
      experience: "8 years in recruitment, payroll operations, and employee relations.",
      location: "Kolkata",
      managerName: "Aarav Khanna",
      currencyCode: "INR",
      currentSalary: 95000,
      latestPayout: 95000,
      nextRenewal: date("2026-06-10"),
      contractExpiry: date("2026-12-31"),
      lastAppraisalCycle: "Q4 2025",
      lastHikePercent: 10,
      avatar: "NS",
      departmentId: departmentMap["Human Resources"],
      currentProjectId: projectMap["Quarterly Appraisal Cycle"],
      achievements: [
        "Reduced onboarding turnaround by 38%.",
        "Standardized employee verification workflow.",
        "Led payroll issue resolution for 120 employees.",
      ],
      documents: [
        { label: "Government ID", state: "VERIFIED" },
        { label: "Experience Certificate", state: "VERIFIED" },
        { label: "Payroll Declaration", state: "PENDING" },
      ],
      appraisal: {
        cycle: "Q4 2025",
        rating: "Exceeds Expectations",
        reviewerName: "Aarav Khanna",
        summary:
          "Strong ownership across hiring, employee communication, and payroll hygiene.",
      },
      salaryChanges: [
        {
          effectiveDate: date("2025-01-01"),
          previousAmount: 82000,
          updatedAmount: 87000,
          reason: "Annual appraisal",
        },
        {
          effectiveDate: date("2026-01-01"),
          previousAmount: 87000,
          updatedAmount: 95000,
          reason: "Leadership expansion",
        },
      ],
      contractRenewals: [
        {
          term: "1 year",
          renewedOn: date("2026-01-01"),
          expiresOn: date("2026-12-31"),
          status: "RENEWED",
        },
      ],
      payrollTransactions: [
        {
          transactionDate: date("2026-02-28"),
          amount: 95000,
          note: "Monthly salary payout",
          status: "PAID",
        },
        {
          transactionDate: date("2026-03-31"),
          amount: 95000,
          note: "Salary scheduled",
          status: "SCHEDULED",
        },
      ],
    },
    {
      employeeCode: "EMP-102",
      fullName: "Ravi Mehta",
      jobTitle: "Project Manager",
      accessRole: "MANAGER",
      status: "ACTIVE",
      email: "ravi.mehta@aems.local",
      phone: "+91 98765 11002",
      experience: "10 years leading product and delivery teams across SaaS platforms.",
      location: "Bengaluru",
      managerName: "Aarav Khanna",
      currencyCode: "INR",
      currentSalary: 128000,
      latestPayout: 128000,
      nextRenewal: date("2026-07-01"),
      contractExpiry: date("2026-12-31"),
      lastAppraisalCycle: "Q4 2025",
      lastHikePercent: 12,
      avatar: "RM",
      departmentId: departmentMap["Engineering"],
      currentProjectId: projectMap["AEMS Core Rollout"],
      achievements: [
        "Delivered three enterprise dashboards on schedule.",
        "Improved sprint completion accuracy by 24%.",
      ],
      documents: [
        { label: "Manager Contract", state: "VERIFIED" },
        { label: "Education Proof", state: "VERIFIED" },
      ],
      appraisal: {
        cycle: "Q4 2025",
        rating: "Outstanding",
        reviewerName: "Aarav Khanna",
        summary:
          "Excellent project oversight and risk communication with strong team outcomes.",
      },
      salaryChanges: [
        {
          effectiveDate: date("2025-01-01"),
          previousAmount: 108000,
          updatedAmount: 116000,
          reason: "Annual appraisal",
        },
        {
          effectiveDate: date("2026-01-01"),
          previousAmount: 116000,
          updatedAmount: 128000,
          reason: "Performance hike",
        },
      ],
      contractRenewals: [
        {
          term: "2 years",
          renewedOn: date("2025-01-01"),
          expiresOn: date("2026-12-31"),
          status: "RENEWED",
        },
      ],
      payrollTransactions: [
        {
          transactionDate: date("2026-02-28"),
          amount: 128000,
          note: "Monthly salary payout",
          status: "PAID",
        },
        {
          transactionDate: date("2026-03-31"),
          amount: 128000,
          note: "Salary scheduled",
          status: "SCHEDULED",
        },
      ],
    },
    {
      employeeCode: "EMP-103",
      fullName: "Aditi Rao",
      jobTitle: "Finance Executive",
      accessRole: "HR",
      status: "ACTIVE",
      email: "aditi.rao@aems.local",
      phone: "+91 98765 11003",
      experience: "6 years in payroll reconciliation, compliance, and disbursement oversight.",
      location: "Pune",
      managerName: "Neha Sharma",
      currencyCode: "INR",
      currentSalary: 88000,
      latestPayout: 88000,
      nextRenewal: date("2026-05-20"),
      contractExpiry: date("2026-12-31"),
      lastAppraisalCycle: "Q4 2025",
      lastHikePercent: 8,
      avatar: "AR",
      departmentId: departmentMap["Finance"],
      currentProjectId: projectMap["Finance Sync Upgrade"],
      achievements: [
        "Closed monthly payroll with zero discrepancy for two quarters.",
        "Introduced transaction audit checklist.",
      ],
      documents: [
        { label: "Tax Document", state: "VERIFIED" },
        { label: "Finance Policy Acknowledgement", state: "VERIFIED" },
      ],
      appraisal: {
        cycle: "Q4 2025",
        rating: "Exceeds Expectations",
        reviewerName: "Neha Sharma",
        summary:
          "Reliable payroll execution with strong attention to sensitive financial details.",
      },
      salaryChanges: [
        {
          effectiveDate: date("2025-01-01"),
          previousAmount: 78000,
          updatedAmount: 81500,
          reason: "Annual appraisal",
        },
        {
          effectiveDate: date("2026-01-01"),
          previousAmount: 81500,
          updatedAmount: 88000,
          reason: "Performance hike",
        },
      ],
      contractRenewals: [
        {
          term: "1 year",
          renewedOn: date("2026-01-01"),
          expiresOn: date("2026-12-31"),
          status: "RENEWED",
        },
      ],
      payrollTransactions: [
        {
          transactionDate: date("2026-02-28"),
          amount: 88000,
          note: "Monthly salary payout",
          status: "PAID",
        },
        {
          transactionDate: date("2026-03-31"),
          amount: 88000,
          note: "Salary scheduled",
          status: "SCHEDULED",
        },
      ],
    },
    {
      employeeCode: "EMP-104",
      fullName: "Ishita Dey",
      jobTitle: "Full Stack Engineer",
      accessRole: "EMPLOYEE",
      status: "ACTIVE",
      email: "ishita.dey@aems.local",
      phone: "+91 98765 11004",
      experience: "4 years building internal products and workflow automation tools.",
      location: "Kolkata",
      managerName: "Ravi Mehta",
      currencyCode: "INR",
      currentSalary: 72000,
      latestPayout: 72000,
      nextRenewal: date("2026-06-18"),
      contractExpiry: date("2026-12-31"),
      lastAppraisalCycle: "Q4 2025",
      lastHikePercent: 15,
      avatar: "ID",
      departmentId: departmentMap["Engineering"],
      currentProjectId: projectMap["AEMS Core Rollout"],
      achievements: [
        "Built the employee profile service prototype.",
        "Shipped document upload workflow with PDF validation.",
      ],
      documents: [
        { label: "ID Proof", state: "VERIFIED" },
        { label: "Degree Certificate", state: "VERIFIED" },
        { label: "Experience Letter", state: "PENDING" },
      ],
      appraisal: {
        cycle: "Q4 2025",
        rating: "Outstanding",
        reviewerName: "Ravi Mehta",
        summary:
          "High-impact execution across employee lifecycle tools with strong UI delivery.",
      },
      salaryChanges: [
        {
          effectiveDate: date("2025-01-01"),
          previousAmount: 57000,
          updatedAmount: 63000,
          reason: "Annual appraisal",
        },
        {
          effectiveDate: date("2026-01-01"),
          previousAmount: 63000,
          updatedAmount: 72000,
          reason: "Merit hike",
        },
      ],
      contractRenewals: [
        {
          term: "1 year",
          renewedOn: date("2026-01-01"),
          expiresOn: date("2026-12-31"),
          status: "RENEWED",
        },
      ],
      payrollTransactions: [
        {
          transactionDate: date("2026-02-28"),
          amount: 72000,
          note: "Monthly salary payout",
          status: "PAID",
        },
        {
          transactionDate: date("2026-03-31"),
          amount: 72000,
          note: "Salary scheduled",
          status: "SCHEDULED",
        },
      ],
    },
    {
      employeeCode: "EMP-105",
      fullName: "Kabir Nanda",
      jobTitle: "UI Designer",
      accessRole: "EMPLOYEE",
      status: "PROBATION",
      email: "kabir.nanda@aems.local",
      phone: "+91 98765 11005",
      experience: "3 years designing SaaS dashboards and motion-led interactions.",
      location: "Delhi",
      managerName: "Ravi Mehta",
      currencyCode: "INR",
      currentSalary: 56000,
      latestPayout: 56000,
      nextRenewal: date("2026-09-12"),
      contractExpiry: date("2026-12-31"),
      lastAppraisalCycle: "Q1 2026",
      lastHikePercent: 0,
      avatar: "KN",
      departmentId: departmentMap["Engineering"],
      currentProjectId: projectMap["AEMS Core Rollout"],
      achievements: [
        "Designed role-aware dashboard cards.",
        "Created animated button concepts for key actions.",
      ],
      documents: [
        { label: "Offer Letter", state: "VERIFIED" },
        { label: "Joining Form", state: "VERIFIED" },
      ],
      appraisal: {
        cycle: "Q1 2026",
        rating: "On Track",
        reviewerName: "Ravi Mehta",
        summary:
          "Promising early design contribution with strong responsiveness to feedback.",
      },
      salaryChanges: [
        {
          effectiveDate: date("2026-02-01"),
          previousAmount: 0,
          updatedAmount: 56000,
          reason: "Initial offer",
        },
      ],
      contractRenewals: [
        {
          term: "11 months",
          renewedOn: date("2026-02-01"),
          expiresOn: date("2026-12-31"),
          status: "DUE_SOON",
        },
      ],
      payrollTransactions: [
        {
          transactionDate: date("2026-02-28"),
          amount: 56000,
          note: "Monthly salary payout",
          status: "PAID",
        },
        {
          transactionDate: date("2026-03-31"),
          amount: 56000,
          note: "Salary scheduled",
          status: "SCHEDULED",
        },
      ],
    },
    {
      employeeCode: "EMP-106",
      fullName: "Arjun Sen",
      jobTitle: "Operations Lead",
      accessRole: "MANAGER",
      status: "ON_LEAVE",
      email: "arjun.sen@aems.local",
      phone: "+91 98765 11006",
      experience: "9 years in workforce planning, operations, and delivery enablement.",
      location: "Hyderabad",
      managerName: "Aarav Khanna",
      currencyCode: "INR",
      currentSalary: 99000,
      latestPayout: 99000,
      nextRenewal: date("2026-08-02"),
      contractExpiry: date("2026-12-31"),
      lastAppraisalCycle: "Q4 2025",
      lastHikePercent: 9,
      avatar: "AS",
      departmentId: departmentMap["Operations"],
      currentProjectId: null,
      achievements: [
        "Reduced internal escalation response time by 30%.",
        "Set up workforce allocation planning across three verticals.",
      ],
      documents: [
        { label: "Operations Contract", state: "VERIFIED" },
        { label: "Emergency Contact Form", state: "VERIFIED" },
      ],
      appraisal: {
        cycle: "Q4 2025",
        rating: "Exceeds Expectations",
        reviewerName: "Aarav Khanna",
        summary: "Strong coordination across teams with improved operational visibility.",
      },
      salaryChanges: [
        {
          effectiveDate: date("2025-01-01"),
          previousAmount: 86000,
          updatedAmount: 91000,
          reason: "Annual appraisal",
        },
        {
          effectiveDate: date("2026-01-01"),
          previousAmount: 91000,
          updatedAmount: 99000,
          reason: "Performance hike",
        },
      ],
      contractRenewals: [
        {
          term: "1 year",
          renewedOn: date("2026-01-01"),
          expiresOn: date("2026-12-31"),
          status: "RENEWED",
        },
      ],
      payrollTransactions: [
        {
          transactionDate: date("2026-02-28"),
          amount: 99000,
          note: "Monthly salary payout",
          status: "PAID",
        },
        {
          transactionDate: date("2026-03-31"),
          amount: 99000,
          note: "Salary scheduled",
          status: "SCHEDULED",
        },
      ],
    },
  ];

  for (const employee of employees) {
    await prisma.employee.create({
      data: {
        employeeCode: employee.employeeCode,
        fullName: employee.fullName,
        jobTitle: employee.jobTitle,
        accessRole: employee.accessRole,
        status: employee.status,
        email: employee.email,
        phone: employee.phone,
        experience: employee.experience,
        location: employee.location,
        managerName: employee.managerName,
        currencyCode: employee.currencyCode,
        currentSalary: employee.currentSalary,
        latestPayout: employee.latestPayout,
        nextRenewal: employee.nextRenewal,
        contractExpiry: employee.contractExpiry,
        lastAppraisalCycle: employee.lastAppraisalCycle,
        lastHikePercent: employee.lastHikePercent,
        avatar: employee.avatar,
        department: {
          connect: {
            id: employee.departmentId,
          },
        },
        currentProject: employee.currentProjectId
          ? {
              connect: {
                id: employee.currentProjectId,
              },
            }
          : undefined,
        achievements: {
          create: employee.achievements.map((body) => ({
            body,
          })),
        },
        documents: {
          create: employee.documents,
        },
        appraisals: {
          create: employee.appraisal,
        },
        salaryChanges: {
          create: employee.salaryChanges,
        },
        contractRenewals: {
          create: employee.contractRenewals,
        },
        payrollTransactions: {
          create: employee.payrollTransactions,
        },
        projectAssignments: employee.currentProjectId
          ? {
              create: {
                projectId: employee.currentProjectId,
                roleLabel: employee.jobTitle,
              },
            }
          : undefined,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
