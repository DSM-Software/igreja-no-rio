import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN "owner_id" integer;
    ALTER TABLE "downloads" ADD COLUMN "owner_id" integer;
    ALTER TABLE "events" ADD COLUMN "owner_id" integer;

    UPDATE "posts"
    SET "owner_id" = COALESCE(
      (SELECT "id" FROM "users" WHERE "role" = 'admin' ORDER BY "id" LIMIT 1),
      (SELECT "id" FROM "users" ORDER BY "id" LIMIT 1)
    )
    WHERE "owner_id" IS NULL;

    UPDATE "downloads"
    SET "owner_id" = COALESCE(
      (SELECT "id" FROM "users" WHERE "role" = 'admin' ORDER BY "id" LIMIT 1),
      (SELECT "id" FROM "users" ORDER BY "id" LIMIT 1)
    )
    WHERE "owner_id" IS NULL;

    UPDATE "events"
    SET "owner_id" = COALESCE(
      (SELECT "id" FROM "users" WHERE "role" = 'admin' ORDER BY "id" LIMIT 1),
      (SELECT "id" FROM "users" ORDER BY "id" LIMIT 1)
    )
    WHERE "owner_id" IS NULL;

    ALTER TABLE "posts" ADD CONSTRAINT "posts_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "downloads" ADD CONSTRAINT "downloads_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "events" ADD CONSTRAINT "events_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX "posts_owner_idx" ON "posts" USING btree ("owner_id");
    CREATE INDEX "downloads_owner_idx" ON "downloads" USING btree ("owner_id");
    CREATE INDEX "events_owner_idx" ON "events" USING btree ("owner_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "posts_owner_idx";
    DROP INDEX "downloads_owner_idx";
    DROP INDEX "events_owner_idx";

    ALTER TABLE "posts" DROP CONSTRAINT "posts_owner_id_users_id_fk";
    ALTER TABLE "downloads" DROP CONSTRAINT "downloads_owner_id_users_id_fk";
    ALTER TABLE "events" DROP CONSTRAINT "events_owner_id_users_id_fk";

    ALTER TABLE "posts" DROP COLUMN "owner_id";
    ALTER TABLE "downloads" DROP COLUMN "owner_id";
    ALTER TABLE "events" DROP COLUMN "owner_id";
  `)
}