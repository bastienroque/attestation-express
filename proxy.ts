import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  // Récupère les identifiants depuis les variables d'environnement (ou valeurs par défaut)
  const ADMIN_USER = process.env.ADMIN_USER || "anr";
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "anr2026";

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const authValue = authHeader.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === ADMIN_USER && pwd === ADMIN_PASS) {
      return NextResponse.next();
    }
  }

  // Demande d'authentification native au navigateur
  return new NextResponse("Accès restreint. Mot de passe requis.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Acces Admin ANR"',
    },
  });
}

// Applique le middleware uniquement sur la route /admin (et ses sous-routes)
export const config = {
  matcher: ["/admin"],
};
