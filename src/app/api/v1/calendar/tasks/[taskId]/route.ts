import { NextResponse } from "next/server";

import {
  deleteCalendarTask,
  getBackendStatus,
  updateCalendarTask,
} from "@/lib/server/aems-service";
import { parseRoleQuery, updateCalendarTaskSchema } from "@/lib/server/validators";

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/v1/calendar/tasks/[taskId]">,
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
  const parsedBody = updateCalendarTaskSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Calendar task payload validation failed.", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { taskId } = await context.params;
    const result = await updateCalendarTask(parsedRole.data.role, taskId, parsedBody.data);

    return NextResponse.json({
      data: result.task,
      meta: {
        ...getBackendStatus(),
        role: parsedRole.data.role,
        persisted: result.persisted,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Calendar task not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to update the calendar task." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/v1/calendar/tasks/[taskId]">,
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
    const { taskId } = await context.params;
    const result = await deleteCalendarTask(taskId);

    return NextResponse.json({
      success: true,
      meta: {
        ...getBackendStatus(),
        role: parsedRole.data.role,
        persisted: result.persisted,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Calendar task not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to delete the calendar task." }, { status: 500 });
  }
}
