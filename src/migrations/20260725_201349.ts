import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Eventos de mais de um dia: término opcional (is_multi_day, end_date, end_time).
// As demais diferenças apontadas pelo diff (owner_id, search_body, registration_url)
// já foram aplicadas pelas migrations manuais 20260531/20260614/20260623 — o snapshot
// .json desta migration realinha o drizzle com o estado real do banco.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "is_multi_day" boolean DEFAULT false;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "end_date" timestamp(3) with time zone;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "end_time" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" DROP COLUMN IF EXISTS "is_multi_day";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "end_date";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "end_time";
  `)
}
