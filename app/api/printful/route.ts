import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ready_for_integration",
    provider: "Printful",
    message:
      "Endpoint reservado para la futura activacion de catalogo y tienda oficial cuando recibamos la configuracion definitiva.",
  });
}
