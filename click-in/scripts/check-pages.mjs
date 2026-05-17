import { PrismaClient } from '../generated/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando datos en la base de datos...\n');

  // Check tenants
  const tenants = await prisma.tenant.findMany();
  console.log(`📦 Tenants: ${tenants.length}`);
  tenants.forEach(t => console.log(`  - ${t.name} (${t.id})`));

  // Check sites
  const sites = await prisma.site.findMany({
    include: { tenant: true }
  });
  console.log(`\n🌐 Sites: ${sites.length}`);
  sites.forEach(s => console.log(`  - ${s.name} (${s.id}) - Tenant: ${s.tenant.name}`));

  // Check pages
  const pages = await prisma.page.findMany({
    include: { site: true },
    orderBy: { createdAt: 'asc' }
  });
  console.log(`\n📄 Pages: ${pages.length}`);
  pages.forEach(p => {
    const indent = p.parentId ? '    ' : '  ';
    console.log(`${indent}${p.parentId ? '└─ ' : ''}${p.title} (${p.slug}) - Status: ${p.status} - Site: ${p.site.name}`);
  });

  // Check for orphaned pages
  const orphans = await prisma.page.findMany({
    where: {
      parentId: {
        not: null
      }
    }
  });
  
  const orphanedPages = orphans.filter(p => {
    const parentExists = pages.some(parent => parent.id === p.parentId);
    return !parentExists;
  });

  if (orphanedPages.length > 0) {
    console.log(`\n⚠️  Páginas huérfanas (parentId inválido): ${orphanedPages.length}`);
    orphanedPages.forEach(p => console.log(`  - ${p.title} (parentId: ${p.parentId})`));
  }

  console.log('\n✅ Verificación completa');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
