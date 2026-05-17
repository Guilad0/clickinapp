import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { Prisma } from "@/generated/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, name, companyName } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const subdomain = slugify(companyName);

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: { email, passwordHash, name },
      });

      const tenant = await tx.tenant.create({
        data: { name: companyName },
      });

      await tx.tenantUser.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: "OWNER",
        },
      });

      const site = await tx.site.create({
        data: {
          tenantId: tenant.id,
          subdomain,
          defaultLanguage: "es",
        },
      });

      const homePage = await tx.page.create({
        data: {
          siteId: site.id,
          title: "Inicio",
          slug: "",
          status: "DRAFT",
          language: "es",
          sortOrder: 0,
          seoJson: {
            metaTitle: `${companyName} - Inicio`,
            metaDescription: `Sitio web de ${companyName}`,
            indexable: true,
          },
        },
      });

      return { user, tenant, site, homePage };
    });

    return NextResponse.json(
      {
        message: "Registro exitoso",
        user: { id: result.user.id, email: result.user.email, name: result.user.name },
        tenant: { id: result.tenant.id, name: result.tenant.name },
        site: { id: result.site.id, subdomain: result.site.subdomain },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
