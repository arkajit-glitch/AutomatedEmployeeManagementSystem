import { NextResponse } from "next/server";

import { getDashboardPayload } from "@/lib/server/aems-service";
import { isRole } from "@/lib/data";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/v1/dashboard/[role]">,
) {
  const { role } = await context.params;

  if (!isRole(role)) {
    return NextResponse.json(
      {
        error: "Invalid role supplied.",
      },
      { status: 400 },
    );
  }

  const data = await getDashboardPayload(role);

  return NextResponse.json({
    data,
  });
}
