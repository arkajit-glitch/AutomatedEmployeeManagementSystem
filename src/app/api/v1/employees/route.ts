import { NextResponse } from "next/server";

import { createEmployee, getBackendStatus, listEmployees } from "@/lib/server/aems-service";
import { createEmployeeSchema, parseRoleQuery } from "@/lib/server/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = parseRoleQuery(searchParams.get("role"));

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid role query supplied.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = await listEmployees(parsed.data.role);

  return NextResponse.json({
    data,
    meta: {
      ...getBackendStatus(),
      role: parsed.data.role,
      count: data.length,
    },
  });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedRole = parseRoleQuery(searchParams.get("role"));

  if (!parsedRole.success) {
    return NextResponse.json(
      {
        error: "Invalid role query supplied.",
        details: parsedRole.error.flatten(),
      },
      { status: 400 },
    );
  }

  const body = await request.json();
  const parsedBody = createEmployeeSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Employee payload validation failed.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const result = await createEmployee(parsedRole.data.role, parsedBody.data);

    return NextResponse.json(
      {
        data: result.employee,
        meta: {
          ...getBackendStatus(),
          role: parsedRole.data.role,
          persisted: result.persisted,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            error: "Only Owner and HR can create employee records.",
          },
          { status: 403 },
        );
      }

      if (error.message === "DEPARTMENT_NOT_FOUND") {
        return NextResponse.json(
          {
            error: "The selected department was not found.",
          },
          { status: 404 },
        );
      }

      if (error.message === "PROJECT_NOT_FOUND") {
        return NextResponse.json(
          {
            error: "The selected project was not found.",
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Unable to create the employee record.",
      },
      { status: 500 },
    );
  }
}
