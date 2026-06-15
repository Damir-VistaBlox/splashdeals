const { neon } = require('@neondatabase/serverless');
const sql = neon("postgresql://neondb_owner:npg_I0JW8cOuxBKG@ep-dawn-band-ag7l3jjc-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require");

async function main() {
  // Check tickets and amenities per facility
  const tickets = await sql`SELECT f.name as facility, f.city, count(t.id) as ticket_count FROM "partners"."Facility" f LEFT JOIN "partners"."Ticket" t ON t."facilityId" = f.id GROUP BY f.id, f.name, f.city ORDER BY ticket_count DESC`;
  const amenities = await sql`SELECT f.name as facility, count(fa."amenityId") as amenity_count FROM "partners"."Facility" f LEFT JOIN "partners"."FacilityAmenity" fa ON fa."facilityId" = f.id GROUP BY f.id, f.name ORDER BY amenity_count`;
  const media = await sql`SELECT f.name as facility, count(fm.id) as media_count FROM "partners"."Facility" f LEFT JOIN "partners"."FacilityMedia" fm ON fm."facilityId" = f.id GROUP BY f.id, f.name ORDER BY media_count`;
  const hours = await sql`SELECT f.name as facility, count(oh.id) as hours_count FROM "partners"."Facility" f LEFT JOIN "partners"."OperatingHours" oh ON oh."facilityId" = f.id GROUP BY f.id, f.name ORDER BY hours_count`;
  const policies = await sql`SELECT f.name as facility FROM "partners"."Facility" f LEFT JOIN "partners"."FacilityPolicy" fp ON fp."facilityId" = f.id WHERE fp.id IS NULL ORDER BY f.name`;
  
  console.log("=== TICKETS ===");
  console.log(JSON.stringify(tickets, null, 2));
  console.log("\n=== AMENITIES ===");
  console.log(JSON.stringify(amenities, null, 2));
  console.log("\n=== MEDIA ===");
  console.log(JSON.stringify(media, null, 2));
  console.log("\n=== OPERATING HOURS ===");
  console.log(JSON.stringify(hours, null, 2));
  console.log("\n=== MISSING POLICIES (no policy record) ===");
  console.log(JSON.stringify(policies, null, 2));
}

main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1) });
