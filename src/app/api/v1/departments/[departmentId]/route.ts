import { NextResponse } from "next/server";

import {
  deleteDepartment,
  getBackendStatus,
  getDepartmentDetail,
  updateDepartment,
} from "@/lib/server/aems-service";
import { parseRoleQuery, updateDepartmentSchema } from "@/lib/server/validators";

export async function GET(
  request: Request,
  context: RouteContext<"/api/v1/departments/[departmentId]">,
) {
  const { searchParams } = new URL(request.url);
  const parsedRole = parseRoleQuery(searchParams.get("role"));

  if (!parsedRole.success) {
    return NextResponse.json(
      { error: "Invalid role query supplied.", details: parsedRole.error.flatten() },
      { status: 400 },
    );
  }

  const { departmentId } = await context.params;
  const data = await getDepartmentDetail(parsedRole.data.role, departmentId);

  if (!data) {
    return NextResponse.json({ error: "Department not found." }, { status: 404 });
  }

  return NextResponse.json({
    data,
    meta: {
      ...getBackendStatus(),
      role: parsedRole.data.role,
    },
  });
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/v1/departments/[departmentId]">,
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
  const parsedBody = updateDepartmentSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Department payload validation failed.", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { departmentId } = await context.params;
    const result = await updateDepartment(parsedRole.data.role, departmentId, parsedBody.data);

    return NextResponse.json({
      data: result.department,
      meta: {
        ...getBackendStatus(),
        role: parsedRole.data.role,
        persisted: result.persisted,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ error: "Only Owner and HR can update departments." }, { status: 403 });
      }

      if (error.message === "NOT_FOUND") {
        return NextResponse.json({ error: "Department not found." }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Unable to update the department." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/v1/departments/[departmentId]">,
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
    const { departmentId } = await context.params;
    const result = await deleteDepartment(parsedRole.data.role, departmentId);

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
        return NextResponse.json({ error: "Only Owner and HR can delete departments." }, { status: 403 });
      }

      if (error.message === "NOT_FOUND") {
        return NextResponse.json({ error: "Department not found." }, { status: 404 });
      }

      if (error.message === "DEPARTMENT_IN_USE") {
        return NextResponse.json(
          { error: "This department still has employees or projects attached to it." },
          { status: 409 },
        );
      }
    }

    return NextResponse.json({ error: "Unable to delete the department." }, { status: 500 });
  }
}
