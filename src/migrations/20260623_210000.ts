import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Adds Postgres full-text-search infrastructure (pg_trgm + unaccent) and
// materializes a `search_body` column on posts populated from the Lexical body.
// The same expression used in the GIN index is also used at query time
// (see SEARCH_EXPR_POSTS / SEARCH_EXPR_EVENTS in src/lib/search.ts).

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE EXTENSION IF NOT EXISTS unaccent;

    -- IMMUTABLE wrapper so unaccent() can be used inside index expressions.
    CREATE OR REPLACE FUNCTION public.f_unaccent(text)
    RETURNS text
    AS $$ SELECT public.unaccent('public.unaccent', $1) $$
    LANGUAGE SQL IMMUTABLE PARALLEL SAFE STRICT;

    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "search_body" varchar;

    -- Backfill: extract all text leaves from the Lexical JSON body and
    -- concatenate the tags from posts_tags into the same column.
    UPDATE "posts" p
    SET "search_body" = btrim(
      coalesce(
        (
          SELECT string_agg(value, ' ')
          FROM jsonb_array_elements_text(
            jsonb_path_query_array(p."body", 'strict $.**.text')
          )
        ),
        ''
      )
      || ' '
      || coalesce(
        (
          SELECT string_agg(t."tag", ' ')
          FROM "posts_tags" t
          WHERE t."_parent_id" = p."id"
        ),
        ''
      )
    )
    WHERE p."search_body" IS NULL;

    CREATE INDEX IF NOT EXISTS "posts_search_trgm_idx" ON "posts" USING GIN (
      lower(public.f_unaccent(
        coalesce("title", '') || ' ' ||
        coalesce("excerpt", '') || ' ' ||
        coalesce("serie", '') || ' ' ||
        coalesce("author", '') || ' ' ||
        coalesce("search_body", '')
      )) gin_trgm_ops
    );

    CREATE INDEX IF NOT EXISTS "events_search_trgm_idx" ON "events" USING GIN (
      lower(public.f_unaccent(
        coalesce("title", '') || ' ' ||
        coalesce("desc", '') || ' ' ||
        coalesce("location", '') || ' ' ||
        coalesce("recurring", '')
      )) gin_trgm_ops
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "events_search_trgm_idx";
    DROP INDEX IF EXISTS "posts_search_trgm_idx";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "search_body";
    DROP FUNCTION IF EXISTS public.f_unaccent(text);
    -- Extensions intentionally retained to avoid impacting other usages.
  `)
}
