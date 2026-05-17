// Simple script to test the API endpoint
// First, you need to:
// 1. Run the dev server: pnpm dev
// 2. Login via browser to get session cookie
// 3. Then run: node scripts/test-api.mjs

console.log('Este script requiere que:');
console.log('1. El servidor esté corriendo (pnpm dev)');
console.log('2. Hayas iniciado sesión en el navegador');
console.log('3. Copies las cookies de sesión del navegador');
console.log('\nPara debuggear, mejor abre el navegador en:');
console.log('  http://localhost:3000/tree');
console.log('\nY revisa la consola del navegador (F12) para ver los logs de:');
console.log('  - 🔄 TreeView: setSiteId');
console.log('  - 📄 TreeView: pages actualizadas');
console.log('  - 🌳 buildTreeLayout');
console.log('  - 🎯 Auto-centrando');
console.log('\nY el overlay en la esquina inferior izquierda del canvas que muestra:');
console.log('  - Páginas, Nodos, Raíces, Pan, Bounds');
