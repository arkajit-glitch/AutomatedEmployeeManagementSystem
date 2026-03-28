import { NextResponse } from "next/server";

import { createDepartment, getBackendStatus, listDepartments } from "@/lib/server/aems-service";
import { createDepartmentSchema, parseRoleQuery } from "@/lib/server/validators";

export async function GET() {
  const data = await listDepartments();

  return NextResponse.json({
    data,
    meta: {
      ...getBackendStatus(),
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
  const parsedBody = createDepartmentSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Department payload validation failed.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const result = await createDepartment(parsedRole.data.role, parsedBody.data);

    return NextResponse.json(
      {
        data: result.department,
        meta: {
          ...getBackendStatus(),
          role: parsedRole.data.role,
          persisted: result.persisted,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Only Owner and HR can create departments.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to create the department.",
      },
      { status: 500 },
    );
  }
}
