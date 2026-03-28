import { NextResponse } from "next/server";

import { getBackendStatus, getEmployeeDetail } from "@/lib/server/aems-service";
import { parseRoleQuery } from "@/lib/server/validators";

export async function GET(
  request: Request,
  context: RouteContext<"/api/v1/employees/[employeeId]">,
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

  const { employeeId } = await context.params;
  const data = await getEmployeeDetail(parsed.data.role, employeeId);

  if (!data) {
    return NextResponse.json(
      {
        error: "Employee record not found for the supplied role scope.",
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
