import { NextResponse } from "next/server";

import { createProject, getBackendStatus, listProjects } from "@/lib/server/aems-service";
import { createProjectSchema, parseRoleQuery } from "@/lib/server/validators";

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

  const data = await listProjects(parsed.data.role);

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
  const parsedBody = createProjectSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Project payload validation failed.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const result = await createProject(parsedRole.data.role, parsedBody.data);

    return NextResponse.json(
      {
        data: result.project,
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
            error: "Only Owner and HR can create projects.",
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
    }

    return NextResponse.json(
      {
        error: "Unable to create the project.",
      },
      { status: 500 },
    );
  }
}
