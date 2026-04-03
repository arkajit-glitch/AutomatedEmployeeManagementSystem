import { NextResponse } from "next/server";

import {
  createCalendarTask,
  getBackendStatus,
  listCalendarTasks,
} from "@/lib/server/aems-service";
import { createCalendarTaskSchema, parseRoleQuery } from "@/lib/server/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedRole = parseRoleQuery(searchParams.get("role"));

  if (!parsedRole.success) {
    return NextResponse.json(
      { error: "Invalid role query supplied.", details: parsedRole.error.flatten() },
      { status: 400 },
    );
  }

  const data = await listCalendarTasks();

  return NextResponse.json({
    data,
    meta: {
      ...getBackendStatus(),
      role: parsedRole.data.role,
      count: data.length,
    },
  });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedRole = parseRoleQuery(searchParams.get("role"));

  if (!parsedRole.success) {
    return NextResponse.json(
      { error: "Invalid role query supplied.", details: parsedRole.error.flatten() },
      { status: 400 },
    );
  }

  const body = await request.json();
  const parsedBody = createCalendarTaskSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Calendar task payload validation failed.", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await createCalendarTask(parsedRole.data.role, parsedBody.data);

    return NextResponse.json(
      {
        data: result.task,
        meta: {
          ...getBackendStatus(),
          role: parsedRole.data.role,
          persisted: result.persisted,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Unable to create the calendar task." }, { status: 500 });
  }
}
