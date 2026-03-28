import { z } from "zod";

export const roleSchema = z.enum(["owner", "hr", "manager", "employee"]);
export const accessRoleSchema = z.enum(["owner", "hr", "manager", "employee"]);
export const employmentStatusSchema = z.enum(["Active", "On Leave", "Probation"]);
export const currencyCodeSchema = z.enum(["INR", "USD", "EUR", "GBP", "JPY"]);
export const departmentHealthSchema = z.enum(["Healthy", "Hiring", "Needs Review"]);
export const projectStatusSchema = z.enum(["On Track", "At Risk", "Planning"]);

export const roleQuerySchema = z.object({
  role: roleSchema.default("owner"),
});

export const createEmployeeSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  jobTitle: z.string().trim().min(2, "Job title is required."),
  accessRole: accessRoleSchema,
  status: employmentStatusSchema,
  email: z.string().trim().email("A valid email is required."),
  phone: z.string().trim().min(7, "Phone number is required."),
  experience: z.string().trim().min(8, "Experience summary is required."),
  location: z.string().trim().min(2, "Location is required."),
  managerName: z.string().trim().min(2, "Manager name is required."),
  departmentName: z.string().trim().min(2, "Department is required."),
  projectName: z.string().trim().optional().or(z.literal("")),
  currencyCode: currencyCodeSchema.default("INR"),
  currentSalary: z.coerce.number().int().nonnegative(),
  latestPayout: z.coerce.number().int().nonnegative().optional(),
  nextRenewal: z.string().trim().min(1, "Next renewal date is required."),
  contractExpiry: z.string().trim().min(1, "Contract expiry date is required."),
});

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Department name is required."),
  code: z
    .string()
    .trim()
    .min(2, "Department code is required.")
    .max(10, "Department code should stay short."),
  headName: z.string().trim().min(2, "Department head is required."),
  openRoles: z.coerce.number().int().min(0),
  status: departmentHealthSchema,
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name is required."),
  topic: z.string().trim().min(4, "Project topic is required."),
  leadName: z.string().trim().min(2, "Project head is required."),
  departmentName: z.string().trim().min(2, "Department is required."),
  status: projectStatusSchema,
  startDate: z.string().trim().min(1, "Start date is required."),
  deadline: z.string().trim().min(1, "Deadline is required."),
  endDate: z.string().trim().min(1, "End date is required."),
  client: z.string().trim().min(2, "Client name is required."),
  summary: z.string().trim().min(12, "Project summary is required."),
  overview: z.string().trim().min(20, "Project overview is required."),
  members: z.coerce.number().int().min(1),
  objectives: z.array(z.string().trim().min(2)).min(1, "Add at least one objective."),
  deliverables: z.array(z.string().trim().min(2)).min(1, "Add at least one deliverable."),
  stack: z.array(z.string().trim().min(1)).min(1, "Add at least one tool or stack item."),
});

export const updateDepartmentSchema = createDepartmentSchema.partial().extend({
  name: z.string().trim().min(2).optional(),
  code: z.string().trim().min(2).max(10).optional(),
  headName: z.string().trim().min(2).optional(),
  openRoles: z.coerce.number().int().min(0).optional(),
  status: departmentHealthSchema.optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  name: z.string().trim().min(2).optional(),
  topic: z.string().trim().min(4).optional(),
  leadName: z.string().trim().min(2).optional(),
  departmentName: z.string().trim().min(2).optional(),
  status: projectStatusSchema.optional(),
  startDate: z.string().trim().min(1).optional(),
  deadline: z.string().trim().min(1).optional(),
  endDate: z.string().trim().min(1).optional(),
  client: z.string().trim().min(2).optional(),
  summary: z.string().trim().min(12).optional(),
  overview: z.string().trim().min(20).optional(),
  members: z.coerce.number().int().min(1).optional(),
  objectives: z.array(z.string().trim().min(2)).min(1).optional(),
  deliverables: z.array(z.string().trim().min(2)).min(1).optional(),
  stack: z.array(z.string().trim().min(1)).min(1).optional(),
});

export function parseRoleQuery(role: string | null) {
  return roleQuerySchema.safeParse({
    role: role ?? "owner",
  });
}
