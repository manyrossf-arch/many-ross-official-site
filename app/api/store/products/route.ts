import { NextResponse } from "next/server";

import { getDemoStoreCatalog } from "@/lib/demo-store";
import { getPrintfulCatalog, hasPrintfulToken, PrintfulApiError } from "@/lib/printful/client";
import type { StoreApiErrorResponse, StoreCatalogResponse } from "@/types/store";

export const revalidate = 120;

function jsonHeaders() {
  return {
    "Cache-Control": "s-maxage=120, stale-while-revalidate=300",
  };
}

export async function GET() {
  if (!hasPrintfulToken()) {
    return NextResponse.json(getDemoStoreCatalog(), {
      status: 200,
      headers: jsonHeaders(),
    });
  }

  try {
    const products = await getPrintfulCatalog();
    const payload: StoreCatalogResponse = {
      source: "printful",
      products,
      meta: {
        source: "printful",
        count: products.length,
        fetchedAt: new Date().toISOString(),
        revalidateSeconds: revalidate,
        message:
          products.length > 0
            ? "Catalogo real sincronizado desde Printful con lectura server-side segura."
            : "La tienda API esta conectada, pero todavia no hay productos disponibles para mostrar.",
      },
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: jsonHeaders(),
    });
  } catch (error) {
    const normalized =
      error instanceof PrintfulApiError
        ? error
        : new PrintfulApiError(
            "PRINTFUL_UNKNOWN_ERROR",
            500,
            "Se produjo un error inesperado al leer el catalogo de Printful.",
            false,
          );

    const payload: StoreApiErrorResponse = {
      error: {
        code: normalized.code,
        status: normalized.status,
        message: normalized.message,
        retryable: normalized.retryable,
      },
    };

    return NextResponse.json(payload, {
      status: normalized.status,
      headers: jsonHeaders(),
    });
  }
}
