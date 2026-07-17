import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ready_for_integration",
    provider: "YouTube API",
    message:
      "Endpoint reservado para la futura integracion del canal oficial. No se conecta todavia hasta aprobar la version estable del sitio.",
  });
}
