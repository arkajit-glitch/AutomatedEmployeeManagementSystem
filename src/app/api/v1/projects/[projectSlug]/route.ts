import { NextResponse } from "next/server";

import {
  deleteProject,
  getBackendStatus,
  getProjectDetail,
  updateProject,
} from "@/lib/server/aems-service";
import { parseRoleQuery, updateProjectSchema } from "@/lib/server/validators";

export async function GET(
  request: Request,
  context: RouteContext<"/api/v1/projects/[projectSlug]">,
) {
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

  const { projectSlug } = await context.params;
  const data = await getProjectDetail(parsed.data.role, projectSlug);

  if (!data) {
    return NextResponse.json(
      {
        error: "Project not found for the supplied role scope.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data,
    meta: {
      ...getBackendStatus(),
      role: parsed.data.role,
    },
  });
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/v1/projects/[projectSlug]">,
) {
  const { searchParams } = new URL(request.url);
  const parsedRole = parseRoleQuery(searchParams.get("role"));

  if (!parsedRole.success) {
    return NextResponse.json(
      { error: "Invalid role query supplied.", details: parsedRole.error.flatten() },
      { status: 400 },
    );
  }

  const body = await request.json();
  const parsedBody = updateProjectSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Project payload validation failed.", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { projectSlug } = await context.params;
    const result = await updateProject(parsedRole.data.role, projectSlug, parsedBody.data);

    return NextResponse.json({
      data: result.project,
      meta: {
        ...getBackendStatus(),
        role: parsedRole.data.role,
        persisted: result.persisted,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ error: "Only Owner and HR can update projects." }, { status: 403 });
      }

      if (error.message === "NOT_FOUND") {
        return NextResponse.json({ error: "Project not found." }, { status: 404 });
      }

      if (error.message === "DEPARTMENT_NOT_FOUND") {
        return NextResponse.json({ error: "The selected department was not found." }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Unable to update the project." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/v1/projects/[projectSlug]">,
) {
  const { searchParams } = new URL(request.url);
  const parsedRole = parseRoleQuery(searchParams.get("role"));

  if (!parsedRole.success) {
    return NextResponse.json(
      { error: "Invalid role query supplied.", details: parsedRole.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { projectSlug } = await context.params;
    const result = await deleteProject(parsedRole.data.role, projectSlug);

    return NextResponse.json({
      success: true,
      meta: {
        ...getBackendStatus(),
        role: parsedRole.data.role,
        persisted: result.persisted,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ error: "Only Owner and HR can delete projects." }, { status: 403 });
      }

      if (error.message === "NOT_FOUND") {
        return NextResponse.json({ error: "Project not found." }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Unable to delete the project." }, { status: 500 });
  }
}
