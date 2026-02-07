--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.4 (Ubuntu 17.4-1.pgdg22.04+2)

-- Started on 2026-02-06 23:03:49 PST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 20 (class 2615 OID 16494)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "auth";


--
-- TOC entry 14 (class 2615 OID 16388)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "extensions";


--
-- TOC entry 19 (class 2615 OID 16624)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "graphql";


--
-- TOC entry 18 (class 2615 OID 16613)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "graphql_public";


--
-- TOC entry 10 (class 2615 OID 16386)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "pgbouncer";


--
-- TOC entry 4472 (class 0 OID 0)
-- Dependencies: 37
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- TOC entry 11 (class 2615 OID 16605)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "realtime";


--
-- TOC entry 21 (class 2615 OID 16542)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "storage";


--
-- TOC entry 17 (class 2615 OID 16653)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "vault";


--
-- TOC entry 6 (class 3079 OID 16689)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- TOC entry 4473 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION "pg_graphql"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_graphql" IS 'pg_graphql: GraphQL support';


--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- TOC entry 4474 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "pg_stat_statements"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_stat_statements" IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 4 (class 3079 OID 16443)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- TOC entry 4475 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION "pgcrypto"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pgcrypto" IS 'cryptographic functions';


--
-- TOC entry 5 (class 3079 OID 16654)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";


--
-- TOC entry 4476 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION "supabase_vault"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "supabase_vault" IS 'Supabase Vault Extension';


--
-- TOC entry 3 (class 3079 OID 16432)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- TOC entry 4477 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1218 (class 1247 OID 16784)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- TOC entry 1242 (class 1247 OID 16925)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


--
-- TOC entry 1215 (class 1247 OID 16778)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


--
-- TOC entry 1212 (class 1247 OID 16773)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- TOC entry 1260 (class 1247 OID 17028)
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_authorization_status" AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- TOC entry 1272 (class 1247 OID 17101)
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_client_type" AS ENUM (
    'public',
    'confidential'
);


--
-- TOC entry 1254 (class 1247 OID 17006)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_registration_type" AS ENUM (
    'dynamic',
    'manual'
);


--
-- TOC entry 1263 (class 1247 OID 17038)
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_response_type" AS ENUM (
    'code'
);


--
-- TOC entry 1248 (class 1247 OID 16967)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- TOC entry 1317 (class 1247 OID 17625)
-- Name: activity_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."activity_type" AS ENUM (
    'rating',
    'review',
    'playlist_add',
    'favorite',
    'diary_entry'
);


--
-- TOC entry 1314 (class 1247 OID 17607)
-- Name: favorite_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."favorite_type" AS ENUM (
    'song',
    'album',
    'artist'
);


--
-- TOC entry 1302 (class 1247 OID 17312)
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."action" AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- TOC entry 1293 (class 1247 OID 17272)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."equality_op" AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- TOC entry 1296 (class 1247 OID 17287)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."user_defined_filter" AS (
	"column_name" "text",
	"op" "realtime"."equality_op",
	"value" "text"
);


--
-- TOC entry 1308 (class 1247 OID 17358)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."wal_column" AS (
	"name" "text",
	"type_name" "text",
	"type_oid" "oid",
	"value" "jsonb",
	"is_pkey" boolean,
	"is_selectable" boolean
);


--
-- TOC entry 1305 (class 1247 OID 17325)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."wal_rls" AS (
	"wal" "jsonb",
	"is_rls_enabled" boolean,
	"subscription_ids" "uuid"[],
	"errors" "text"[]
);


--
-- TOC entry 1287 (class 1247 OID 17241)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE "storage"."buckettype" AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- TOC entry 470 (class 1255 OID 16540)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- TOC entry 4478 (class 0 OID 0)
-- Dependencies: 470
-- Name: FUNCTION "email"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 480 (class 1255 OID 16755)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."jwt"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- TOC entry 434 (class 1255 OID 16539)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."role"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- TOC entry 4479 (class 0 OID 0)
-- Dependencies: 434
-- Name: FUNCTION "role"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 451 (class 1255 OID 16538)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- TOC entry 4480 (class 0 OID 0)
-- Dependencies: 451
-- Name: FUNCTION "uid"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 508 (class 1255 OID 16597)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_cron_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- TOC entry 4481 (class 0 OID 0)
-- Dependencies: 508
-- Name: FUNCTION "grant_pg_cron_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_cron_access"() IS 'Grants access to pg_cron';


--
-- TOC entry 489 (class 1255 OID 16618)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_graphql_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- TOC entry 4482 (class 0 OID 0)
-- Dependencies: 489
-- Name: FUNCTION "grant_pg_graphql_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_graphql_access"() IS 'Grants access to pg_graphql';


--
-- TOC entry 463 (class 1255 OID 16599)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_net_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- TOC entry 4483 (class 0 OID 0)
-- Dependencies: 463
-- Name: FUNCTION "grant_pg_net_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_net_access"() IS 'Grants access to pg_net';


--
-- TOC entry 429 (class 1255 OID 16609)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."pgrst_ddl_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 519 (class 1255 OID 16610)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."pgrst_drop_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 440 (class 1255 OID 16620)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."set_graphql_placeholder"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- TOC entry 4484 (class 0 OID 0)
-- Dependencies: 440
-- Name: FUNCTION "set_graphql_placeholder"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."set_graphql_placeholder"() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 472 (class 1255 OID 16387)
-- Name: get_auth("text"); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION "pgbouncer"."get_auth"("p_usename" "text") RETURNS TABLE("username" "text", "password" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- TOC entry 435 (class 1255 OID 17351)
-- Name: apply_rls("jsonb", integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer DEFAULT (1024 * 1024)) RETURNS SETOF "realtime"."wal_rls"
    LANGUAGE "plpgsql"
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- TOC entry 549 (class 1255 OID 17431)
-- Name: broadcast_changes("text", "text", "text", "text", "text", "record", "record", "text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text" DEFAULT 'ROW'::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- TOC entry 486 (class 1255 OID 17363)
-- Name: build_prepared_statement_sql("text", "regclass", "realtime"."wal_column"[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) RETURNS "text"
    LANGUAGE "sql"
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- TOC entry 447 (class 1255 OID 17309)
-- Name: cast("text", "regtype"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") RETURNS "jsonb"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- TOC entry 474 (class 1255 OID 17304)
-- Name: check_equality_op("realtime"."equality_op", "regtype", "text", "text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") RETURNS boolean
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- TOC entry 517 (class 1255 OID 17359)
-- Name: is_visible_through_filters("realtime"."wal_column"[], "realtime"."user_defined_filter"[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) RETURNS boolean
    LANGUAGE "sql" IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- TOC entry 535 (class 1255 OID 17370)
-- Name: list_changes("name", "name", integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer) RETURNS SETOF "realtime"."wal_rls"
    LANGUAGE "sql"
    SET "log_min_messages" TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- TOC entry 527 (class 1255 OID 17303)
-- Name: quote_wal2json("regclass"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."quote_wal2json"("entity" "regclass") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- TOC entry 454 (class 1255 OID 17430)
-- Name: send("jsonb", "text", "text", boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean DEFAULT true) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- TOC entry 493 (class 1255 OID 17301)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."subscription_check_filters"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- TOC entry 500 (class 1255 OID 17340)
-- Name: to_regrole("text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."to_regrole"("role_name" "text") RETURNS "regrole"
    LANGUAGE "sql" IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- TOC entry 482 (class 1255 OID 17423)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."topic"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- TOC entry 495 (class 1255 OID 17219)
-- Name: add_prefixes("text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."add_prefixes"("_bucket_id" "text", "_name" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- TOC entry 543 (class 1255 OID 17145)
-- Name: can_insert_object("text", "text", "uuid", "jsonb"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- TOC entry 481 (class 1255 OID 17259)
-- Name: delete_leaf_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- TOC entry 441 (class 1255 OID 17220)
-- Name: delete_prefix("text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_prefix"("_bucket_id" "text", "_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- TOC entry 494 (class 1255 OID 17223)
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_prefix_hierarchy_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- TOC entry 499 (class 1255 OID 17238)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."enforce_bucket_name_length"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- TOC entry 477 (class 1255 OID 17119)
-- Name: extension("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."extension"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- TOC entry 483 (class 1255 OID 17118)
-- Name: filename("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."filename"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- TOC entry 545 (class 1255 OID 17117)
-- Name: foldername("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."foldername"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- TOC entry 432 (class 1255 OID 17201)
-- Name: get_level("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_level"("name" "text") RETURNS integer
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- TOC entry 485 (class 1255 OID 17217)
-- Name: get_prefix("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_prefix"("name" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- TOC entry 478 (class 1255 OID 17218)
-- Name: get_prefixes("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_prefixes"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- TOC entry 526 (class 1255 OID 17236)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- TOC entry 473 (class 1255 OID 17184)
-- Name: list_multipart_uploads_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "next_key_token" "text" DEFAULT ''::"text", "next_upload_token" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "id" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- TOC entry 498 (class 1255 OID 17147)
-- Name: list_objects_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "start_after" "text" DEFAULT ''::"text", "next_token" "text" DEFAULT ''::"text") RETURNS TABLE("name" "text", "id" "uuid", "metadata" "jsonb", "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- TOC entry 487 (class 1255 OID 17258)
-- Name: lock_top_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."lock_top_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


--
-- TOC entry 444 (class 1255 OID 17260)
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- TOC entry 520 (class 1255 OID 17222)
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_insert_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 433 (class 1255 OID 17261)
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


--
-- TOC entry 532 (class 1255 OID 17266)
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_level_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


--
-- TOC entry 491 (class 1255 OID 17237)
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 460 (class 1255 OID 17200)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."operation"() RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- TOC entry 502 (class 1255 OID 17262)
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."prefixes_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- TOC entry 504 (class 1255 OID 17221)
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."prefixes_insert_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- TOC entry 510 (class 1255 OID 17134)
-- Name: search("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- TOC entry 528 (class 1255 OID 17234)
-- Name: search_legacy_v1("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 464 (class 1255 OID 17233)
-- Name: search_v1_optimised("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_v1_optimised"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 524 (class 1255 OID 17257)
-- Name: search_v2("text", "text", integer, integer, "text", "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "start_after" "text" DEFAULT ''::"text", "sort_order" "text" DEFAULT 'asc'::"text", "sort_column" "text" DEFAULT 'name'::"text", "sort_column_after" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


--
-- TOC entry 449 (class 1255 OID 17135)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- TOC entry 356 (class 1259 OID 16525)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" json,
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- TOC entry 4485 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE "audit_log_entries"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 373 (class 1259 OID 16929)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text",
    "code_challenge_method" "auth"."code_challenge_method",
    "code_challenge" "text",
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone,
    "invite_token" "text",
    "referrer" "text",
    "oauth_client_state_id" "uuid",
    "linking_target_id" "uuid",
    "email_optional" boolean DEFAULT false NOT NULL
);


--
-- TOC entry 4486 (class 0 OID 0)
-- Dependencies: 373
-- Name: TABLE "flow_state"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."flow_state" IS 'Stores metadata for all OAuth/SSO login flows';


--
-- TOC entry 364 (class 1259 OID 16727)
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- TOC entry 4487 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE "identities"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4488 (class 0 OID 0)
-- Dependencies: 364
-- Name: COLUMN "identities"."email"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 355 (class 1259 OID 16518)
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


--
-- TOC entry 4489 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE "instances"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 368 (class 1259 OID 16816)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);


--
-- TOC entry 4490 (class 0 OID 0)
-- Dependencies: 368
-- Name: TABLE "mfa_amr_claims"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 367 (class 1259 OID 16804)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL,
    "otp_code" "text",
    "web_authn_session_data" "jsonb"
);


--
-- TOC entry 4491 (class 0 OID 0)
-- Dependencies: 367
-- Name: TABLE "mfa_challenges"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 366 (class 1259 OID 16791)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text",
    "phone" "text",
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" "jsonb",
    "web_authn_aaguid" "uuid",
    "last_webauthn_challenge_data" "jsonb"
);


--
-- TOC entry 4492 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE "mfa_factors"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';


--
-- TOC entry 4493 (class 0 OID 0)
-- Dependencies: 366
-- Name: COLUMN "mfa_factors"."last_webauthn_challenge_data"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."mfa_factors"."last_webauthn_challenge_data" IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- TOC entry 376 (class 1259 OID 17041)
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_authorizations" (
    "id" "uuid" NOT NULL,
    "authorization_id" "text" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "redirect_uri" "text" NOT NULL,
    "scope" "text" NOT NULL,
    "state" "text",
    "resource" "text",
    "code_challenge" "text",
    "code_challenge_method" "auth"."code_challenge_method",
    "response_type" "auth"."oauth_response_type" DEFAULT 'code'::"auth"."oauth_response_type" NOT NULL,
    "status" "auth"."oauth_authorization_status" DEFAULT 'pending'::"auth"."oauth_authorization_status" NOT NULL,
    "authorization_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:03:00'::interval) NOT NULL,
    "approved_at" timestamp with time zone,
    "nonce" "text",
    CONSTRAINT "oauth_authorizations_authorization_code_length" CHECK (("char_length"("authorization_code") <= 255)),
    CONSTRAINT "oauth_authorizations_code_challenge_length" CHECK (("char_length"("code_challenge") <= 128)),
    CONSTRAINT "oauth_authorizations_expires_at_future" CHECK (("expires_at" > "created_at")),
    CONSTRAINT "oauth_authorizations_nonce_length" CHECK (("char_length"("nonce") <= 255)),
    CONSTRAINT "oauth_authorizations_redirect_uri_length" CHECK (("char_length"("redirect_uri") <= 2048)),
    CONSTRAINT "oauth_authorizations_resource_length" CHECK (("char_length"("resource") <= 2048)),
    CONSTRAINT "oauth_authorizations_scope_length" CHECK (("char_length"("scope") <= 4096)),
    CONSTRAINT "oauth_authorizations_state_length" CHECK (("char_length"("state") <= 4096))
);


--
-- TOC entry 428 (class 1259 OID 32069)
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_client_states" (
    "id" "uuid" NOT NULL,
    "provider_type" "text" NOT NULL,
    "code_verifier" "text",
    "created_at" timestamp with time zone NOT NULL
);


--
-- TOC entry 4494 (class 0 OID 0)
-- Dependencies: 428
-- Name: TABLE "oauth_client_states"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."oauth_client_states" IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- TOC entry 375 (class 1259 OID 17011)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_clients" (
    "id" "uuid" NOT NULL,
    "client_secret_hash" "text",
    "registration_type" "auth"."oauth_registration_type" NOT NULL,
    "redirect_uris" "text" NOT NULL,
    "grant_types" "text" NOT NULL,
    "client_name" "text",
    "client_uri" "text",
    "logo_uri" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "client_type" "auth"."oauth_client_type" DEFAULT 'confidential'::"auth"."oauth_client_type" NOT NULL,
    "token_endpoint_auth_method" "text" NOT NULL,
    CONSTRAINT "oauth_clients_client_name_length" CHECK (("char_length"("client_name") <= 1024)),
    CONSTRAINT "oauth_clients_client_uri_length" CHECK (("char_length"("client_uri") <= 2048)),
    CONSTRAINT "oauth_clients_logo_uri_length" CHECK (("char_length"("logo_uri") <= 2048)),
    CONSTRAINT "oauth_clients_token_endpoint_auth_method_check" CHECK (("token_endpoint_auth_method" = ANY (ARRAY['client_secret_basic'::"text", 'client_secret_post'::"text", 'none'::"text"])))
);


--
-- TOC entry 377 (class 1259 OID 17074)
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_consents" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "scopes" "text" NOT NULL,
    "granted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "revoked_at" timestamp with time zone,
    CONSTRAINT "oauth_consents_revoked_after_granted" CHECK ((("revoked_at" IS NULL) OR ("revoked_at" >= "granted_at"))),
    CONSTRAINT "oauth_consents_scopes_length" CHECK (("char_length"("scopes") <= 2048)),
    CONSTRAINT "oauth_consents_scopes_not_empty" CHECK (("char_length"(TRIM(BOTH FROM "scopes")) > 0))
);


--
-- TOC entry 374 (class 1259 OID 16979)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);


--
-- TOC entry 354 (class 1259 OID 16507)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);


--
-- TOC entry 4495 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE "refresh_tokens"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 353 (class 1259 OID 16506)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4496 (class 0 OID 0)
-- Dependencies: 353
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";


--
-- TOC entry 371 (class 1259 OID 16858)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);


--
-- TOC entry 4497 (class 0 OID 0)
-- Dependencies: 371
-- Name: TABLE "saml_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 372 (class 1259 OID 16876)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);


--
-- TOC entry 4498 (class 0 OID 0)
-- Dependencies: 372
-- Name: TABLE "saml_relay_states"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 357 (class 1259 OID 16533)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


--
-- TOC entry 4499 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE "schema_migrations"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 365 (class 1259 OID 16757)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text",
    "oauth_client_id" "uuid",
    "refresh_token_hmac_key" "text",
    "refresh_token_counter" bigint,
    "scopes" "text",
    CONSTRAINT "sessions_scopes_length" CHECK (("char_length"("scopes") <= 4096))
);


--
-- TOC entry 4500 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE "sessions"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4501 (class 0 OID 0)
-- Dependencies: 365
-- Name: COLUMN "sessions"."not_after"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 4502 (class 0 OID 0)
-- Dependencies: 365
-- Name: COLUMN "sessions"."refresh_token_hmac_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_hmac_key" IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- TOC entry 4503 (class 0 OID 0)
-- Dependencies: 365
-- Name: COLUMN "sessions"."refresh_token_counter"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_counter" IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- TOC entry 370 (class 1259 OID 16843)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);


--
-- TOC entry 4504 (class 0 OID 0)
-- Dependencies: 370
-- Name: TABLE "sso_domains"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 369 (class 1259 OID 16834)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "disabled" boolean,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);


--
-- TOC entry 4505 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE "sso_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4506 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN "sso_providers"."resource_id"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 352 (class 1259 OID 16495)
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2)))
);


--
-- TOC entry 4507 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE "users"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4508 (class 0 OID 0)
-- Dependencies: 352
-- Name: COLUMN "users"."is_sso_user"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 420 (class 1259 OID 22767)
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."activities" (
    "activity_id" integer NOT NULL,
    "user_id" integer,
    "type" "public"."activity_type" NOT NULL,
    "target_id" integer,
    "description" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 419 (class 1259 OID 22766)
-- Name: activities_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."activities_activity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4509 (class 0 OID 0)
-- Dependencies: 419
-- Name: activities_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."activities_activity_id_seq" OWNED BY "public"."activities"."activity_id";


--
-- TOC entry 400 (class 1259 OID 22530)
-- Name: albums; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."albums" (
    "album_id" integer NOT NULL,
    "spotify_id" "text",
    "mbid" "uuid",
    "artist_id" integer,
    "title" character varying(255),
    "release_year" integer,
    "cover_url" "text",
    "total_tracks" integer,
    "last_fetched" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 399 (class 1259 OID 22529)
-- Name: albums_album_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."albums_album_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4510 (class 0 OID 0)
-- Dependencies: 399
-- Name: albums_album_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."albums_album_id_seq" OWNED BY "public"."albums"."album_id";


--
-- TOC entry 398 (class 1259 OID 22516)
-- Name: artists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."artists" (
    "artist_id" integer NOT NULL,
    "spotify_id" "text",
    "mbid" "uuid",
    "name" character varying(255),
    "image_url" "text",
    "followers" integer,
    "genres" "text"[],
    "last_fetched" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 397 (class 1259 OID 22515)
-- Name: artists_artist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."artists_artist_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4511 (class 0 OID 0)
-- Dependencies: 397
-- Name: artists_artist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."artists_artist_id_seq" OWNED BY "public"."artists"."artist_id";


--
-- TOC entry 393 (class 1259 OID 22457)
-- Name: auth_local; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."auth_local" (
    "user_id" integer NOT NULL,
    "password_hash" "text" NOT NULL
);


--
-- TOC entry 411 (class 1259 OID 22652)
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."comments" (
    "comment_id" integer NOT NULL,
    "review_id" integer,
    "user_id" integer,
    "content" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 410 (class 1259 OID 22651)
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."comments_comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4512 (class 0 OID 0)
-- Dependencies: 410
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."comments_comment_id_seq" OWNED BY "public"."comments"."comment_id";


--
-- TOC entry 413 (class 1259 OID 22688)
-- Name: diary_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."diary_entries" (
    "entry_id" integer NOT NULL,
    "user_id" integer,
    "song_id" integer,
    "listened_at" timestamp without time zone DEFAULT "now"(),
    "rating" numeric(2,1),
    "review_id" integer,
    "notes" "text",
    CONSTRAINT "diary_entries_rating_check" CHECK ((("rating" IS NULL) OR (("rating" >= (0)::numeric) AND ("rating" <= (5)::numeric))))
);


--
-- TOC entry 412 (class 1259 OID 22687)
-- Name: diary_entries_entry_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."diary_entries_entry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4513 (class 0 OID 0)
-- Dependencies: 412
-- Name: diary_entries_entry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."diary_entries_entry_id_seq" OWNED BY "public"."diary_entries"."entry_id";


--
-- TOC entry 414 (class 1259 OID 22712)
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."favorites" (
    "user_id" integer NOT NULL,
    "item_type" "public"."favorite_type" NOT NULL,
    "item_id" integer NOT NULL,
    "added_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 395 (class 1259 OID 22482)
-- Name: follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."follows" (
    "follower_id" integer NOT NULL,
    "following_id" integer NOT NULL,
    "followed_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 416 (class 1259 OID 22734)
-- Name: listen_later; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."listen_later" (
    "user_id" integer NOT NULL,
    "song_id" integer NOT NULL,
    "added_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 427 (class 1259 OID 22855)
-- Name: message_reactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."message_reactions" (
    "message_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "reaction" "text",
    "reacted_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 426 (class 1259 OID 22835)
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."messages" (
    "message_id" integer NOT NULL,
    "thread_id" integer,
    "sender_id" integer,
    "content" "text",
    "attachment_url" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 425 (class 1259 OID 22834)
-- Name: messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."messages_message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4514 (class 0 OID 0)
-- Dependencies: 425
-- Name: messages_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."messages_message_id_seq" OWNED BY "public"."messages"."message_id";


--
-- TOC entry 418 (class 1259 OID 22751)
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."notifications" (
    "notification_id" integer NOT NULL,
    "user_id" integer,
    "type" "text" NOT NULL,
    "payload" "jsonb",
    "is_read" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 417 (class 1259 OID 22750)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."notifications_notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4515 (class 0 OID 0)
-- Dependencies: 417
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."notifications_notification_id_seq" OWNED BY "public"."notifications"."notification_id";


--
-- TOC entry 406 (class 1259 OID 22598)
-- Name: playlist_songs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."playlist_songs" (
    "playlist_id" integer NOT NULL,
    "song_id" integer NOT NULL,
    "position" integer
);


--
-- TOC entry 405 (class 1259 OID 22583)
-- Name: playlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."playlists" (
    "playlist_id" integer NOT NULL,
    "user_id" integer,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "is_public" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 404 (class 1259 OID 22582)
-- Name: playlists_playlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."playlists_playlist_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4516 (class 0 OID 0)
-- Dependencies: 404
-- Name: playlists_playlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."playlists_playlist_id_seq" OWNED BY "public"."playlists"."playlist_id";


--
-- TOC entry 409 (class 1259 OID 22635)
-- Name: review_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."review_likes" (
    "review_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "liked_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 408 (class 1259 OID 22614)
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."reviews" (
    "review_id" integer NOT NULL,
    "user_id" integer,
    "song_id" integer,
    "rating" numeric(2,1),
    "content" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "album_id" integer,
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= (0)::numeric) AND ("rating" <= (5)::numeric))),
    CONSTRAINT "reviews_target_one_check" CHECK ((((("song_id" IS NOT NULL))::integer + (("album_id" IS NOT NULL))::integer) = 1))
);


--
-- TOC entry 407 (class 1259 OID 22613)
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."reviews_review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4517 (class 0 OID 0)
-- Dependencies: 407
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."reviews_review_id_seq" OWNED BY "public"."reviews"."review_id";


--
-- TOC entry 403 (class 1259 OID 22567)
-- Name: song_artists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."song_artists" (
    "song_id" integer NOT NULL,
    "artist_id" integer NOT NULL
);


--
-- TOC entry 402 (class 1259 OID 22549)
-- Name: songs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."songs" (
    "song_id" integer NOT NULL,
    "spotify_id" "text",
    "mbid" "uuid",
    "album_id" integer,
    "title" character varying(255),
    "duration" integer,
    "track_number" integer,
    "isrc" character varying(50),
    "popularity" integer,
    "preview_url" "text",
    "spotify_url" "text",
    "last_fetched" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 401 (class 1259 OID 22548)
-- Name: songs_song_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."songs_song_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4518 (class 0 OID 0)
-- Dependencies: 401
-- Name: songs_song_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."songs_song_id_seq" OWNED BY "public"."songs"."song_id";


--
-- TOC entry 421 (class 1259 OID 22781)
-- Name: stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."stats" (
    "user_id" integer NOT NULL,
    "total_reviews" integer DEFAULT 0,
    "total_ratings" integer DEFAULT 0,
    "avg_rating" numeric(3,2) DEFAULT 0,
    "total_songs_listened" integer DEFAULT 0,
    "total_artists" integer DEFAULT 0,
    "last_updated" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 424 (class 1259 OID 22818)
-- Name: thread_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."thread_members" (
    "thread_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "joined_at" timestamp without time zone DEFAULT "now"(),
    "last_read_at" timestamp without time zone
);


--
-- TOC entry 423 (class 1259 OID 22798)
-- Name: threads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."threads" (
    "thread_id" integer NOT NULL,
    "is_group" boolean DEFAULT false,
    "name" character varying(255),
    "created_by" integer,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "last_message_text" "text",
    "last_message_sender" integer,
    "last_message_at" timestamp without time zone
);


--
-- TOC entry 422 (class 1259 OID 22797)
-- Name: threads_thread_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."threads_thread_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4519 (class 0 OID 0)
-- Dependencies: 422
-- Name: threads_thread_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."threads_thread_id_seq" OWNED BY "public"."threads"."thread_id";


--
-- TOC entry 396 (class 1259 OID 22499)
-- Name: user_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."user_blocks" (
    "blocker_id" integer NOT NULL,
    "blocked_id" integer NOT NULL,
    "blocked_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 415 (class 1259 OID 22723)
-- Name: user_pins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."user_pins" (
    "user_id" integer NOT NULL,
    "item_type" "public"."favorite_type" NOT NULL,
    "item_id" integer NOT NULL,
    "pinned_at" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 394 (class 1259 OID 22469)
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."user_profiles" (
    "user_id" integer NOT NULL,
    "first_name" character varying(100),
    "last_name" character varying(100),
    "bio" "text",
    "location" character varying(150),
    "website" character varying(255),
    "banner_url" "text",
    "last_updated" timestamp without time zone DEFAULT "now"()
);


--
-- TOC entry 392 (class 1259 OID 22441)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users" (
    "user_id" integer NOT NULL,
    "email" character varying(100) NOT NULL,
    "username" character varying(50) NOT NULL,
    "display_name" character varying(100),
    "avatar_url" "text",
    "joined_at" timestamp without time zone DEFAULT "now"(),
    "oauth_provider" "text",
    "oauth_sub" "text"
);


--
-- TOC entry 391 (class 1259 OID 22440)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."users_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4520 (class 0 OID 0)
-- Dependencies: 391
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."users_user_id_seq" OWNED BY "public"."users"."user_id";


--
-- TOC entry 388 (class 1259 OID 17434)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
)
PARTITION BY RANGE ("inserted_at");


--
-- TOC entry 378 (class 1259 OID 17112)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."schema_migrations" (
    "version" bigint NOT NULL,
    "inserted_at" timestamp(0) without time zone
);


--
-- TOC entry 385 (class 1259 OID 17289)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."subscription" (
    "id" bigint NOT NULL,
    "subscription_id" "uuid" NOT NULL,
    "entity" "regclass" NOT NULL,
    "filters" "realtime"."user_defined_filter"[] DEFAULT '{}'::"realtime"."user_defined_filter"[] NOT NULL,
    "claims" "jsonb" NOT NULL,
    "claims_role" "regrole" GENERATED ALWAYS AS ("realtime"."to_regrole"(("claims" ->> 'role'::"text"))) STORED NOT NULL,
    "created_at" timestamp without time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "action_filter" "text" DEFAULT '*'::"text",
    CONSTRAINT "subscription_action_filter_check" CHECK (("action_filter" = ANY (ARRAY['*'::"text", 'INSERT'::"text", 'UPDATE'::"text", 'DELETE'::"text"])))
);


--
-- TOC entry 384 (class 1259 OID 17288)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE "realtime"."subscription" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "realtime"."subscription_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 358 (class 1259 OID 16546)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text",
    "type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype" NOT NULL
);


--
-- TOC entry 4521 (class 0 OID 0)
-- Dependencies: 358
-- Name: COLUMN "buckets"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 382 (class 1259 OID 17246)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets_analytics" (
    "name" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'ANALYTICS'::"storage"."buckettype" NOT NULL,
    "format" "text" DEFAULT 'ICEBERG'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "deleted_at" timestamp with time zone
);


--
-- TOC entry 389 (class 1259 OID 22127)
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets_vectors" (
    "id" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'VECTOR'::"storage"."buckettype" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- TOC entry 360 (class 1259 OID 16588)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 359 (class 1259 OID 16561)
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text",
    "user_metadata" "jsonb",
    "level" integer
);


--
-- TOC entry 4522 (class 0 OID 0)
-- Dependencies: 359
-- Name: COLUMN "objects"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 381 (class 1259 OID 17202)
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."prefixes" (
    "bucket_id" "text" NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "level" integer GENERATED ALWAYS AS ("storage"."get_level"("name")) STORED NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


--
-- TOC entry 379 (class 1259 OID 17149)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_metadata" "jsonb"
);


--
-- TOC entry 380 (class 1259 OID 17163)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- TOC entry 390 (class 1259 OID 22137)
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."vector_indexes" (
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "bucket_id" "text" NOT NULL,
    "data_type" "text" NOT NULL,
    "dimension" integer NOT NULL,
    "distance_metric" "text" NOT NULL,
    "metadata_configuration" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- TOC entry 3803 (class 2604 OID 16510)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");


--
-- TOC entry 3889 (class 2604 OID 22770)
-- Name: activities activity_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."activities" ALTER COLUMN "activity_id" SET DEFAULT "nextval"('"public"."activities_activity_id_seq"'::"regclass");


--
-- TOC entry 3868 (class 2604 OID 22533)
-- Name: albums album_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."albums" ALTER COLUMN "album_id" SET DEFAULT "nextval"('"public"."albums_album_id_seq"'::"regclass");


--
-- TOC entry 3866 (class 2604 OID 22519)
-- Name: artists artist_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."artists" ALTER COLUMN "artist_id" SET DEFAULT "nextval"('"public"."artists_artist_id_seq"'::"regclass");


--
-- TOC entry 3879 (class 2604 OID 22655)
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments" ALTER COLUMN "comment_id" SET DEFAULT "nextval"('"public"."comments_comment_id_seq"'::"regclass");


--
-- TOC entry 3881 (class 2604 OID 22691)
-- Name: diary_entries entry_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."diary_entries" ALTER COLUMN "entry_id" SET DEFAULT "nextval"('"public"."diary_entries_entry_id_seq"'::"regclass");


--
-- TOC entry 3901 (class 2604 OID 22838)
-- Name: messages message_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."messages" ALTER COLUMN "message_id" SET DEFAULT "nextval"('"public"."messages_message_id_seq"'::"regclass");


--
-- TOC entry 3886 (class 2604 OID 22754)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."notifications" ALTER COLUMN "notification_id" SET DEFAULT "nextval"('"public"."notifications_notification_id_seq"'::"regclass");


--
-- TOC entry 3872 (class 2604 OID 22586)
-- Name: playlists playlist_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."playlists" ALTER COLUMN "playlist_id" SET DEFAULT "nextval"('"public"."playlists_playlist_id_seq"'::"regclass");


--
-- TOC entry 3875 (class 2604 OID 22617)
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reviews" ALTER COLUMN "review_id" SET DEFAULT "nextval"('"public"."reviews_review_id_seq"'::"regclass");


--
-- TOC entry 3870 (class 2604 OID 22552)
-- Name: songs song_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."songs" ALTER COLUMN "song_id" SET DEFAULT "nextval"('"public"."songs_song_id_seq"'::"regclass");


--
-- TOC entry 3897 (class 2604 OID 22801)
-- Name: threads thread_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."threads" ALTER COLUMN "thread_id" SET DEFAULT "nextval"('"public"."threads_thread_id_seq"'::"regclass");


--
-- TOC entry 3861 (class 2604 OID 22444)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users" ALTER COLUMN "user_id" SET DEFAULT "nextval"('"public"."users_user_id_seq"'::"regclass");


--
-- TOC entry 4401 (class 0 OID 16525)
-- Dependencies: 356
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- TOC entry 4415 (class 0 OID 16929)
-- Dependencies: 373
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
\.


--
-- TOC entry 4406 (class 0 OID 16727)
-- Dependencies: 364
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
\.


--
-- TOC entry 4400 (class 0 OID 16518)
-- Dependencies: 355
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4410 (class 0 OID 16816)
-- Dependencies: 368
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
\.


--
-- TOC entry 4409 (class 0 OID 16804)
-- Dependencies: 367
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- TOC entry 4408 (class 0 OID 16791)
-- Dependencies: 366
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- TOC entry 4418 (class 0 OID 17041)
-- Dependencies: 376
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- TOC entry 4466 (class 0 OID 32069)
-- Dependencies: 428
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- TOC entry 4417 (class 0 OID 17011)
-- Dependencies: 375
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- TOC entry 4419 (class 0 OID 17074)
-- Dependencies: 377
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- TOC entry 4416 (class 0 OID 16979)
-- Dependencies: 374
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4399 (class 0 OID 16507)
-- Dependencies: 354
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
\.


--
-- TOC entry 4413 (class 0 OID 16858)
-- Dependencies: 371
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- TOC entry 4414 (class 0 OID 16876)
-- Dependencies: 372
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- TOC entry 4402 (class 0 OID 16533)
-- Dependencies: 357
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."schema_migrations" ("version") FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
\.


--
-- TOC entry 4407 (class 0 OID 16757)
-- Dependencies: 365
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
\.


--
-- TOC entry 4412 (class 0 OID 16843)
-- Dependencies: 370
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4411 (class 0 OID 16834)
-- Dependencies: 369
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- TOC entry 4397 (class 0 OID 16495)
-- Dependencies: 352
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
\.


--
-- TOC entry 4458 (class 0 OID 22767)
-- Dependencies: 420
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."activities" ("activity_id", "user_id", "type", "target_id", "description", "created_at") FROM stdin;
1	1	rating	1	TEST rating activity	2025-11-20 06:34:20.960616
2	3	review	2	Reviewed an album	2026-02-06 10:50:31.812932
3	3	review	3	Reviewed an album	2026-02-06 10:50:51.696361
4	3	review	4	Reviewed an album	2026-02-06 10:53:24.212941
5	3	review	5	Reviewed an album	2026-02-06 11:04:29.23793
6	3	review	6	Reviewed a song	2026-02-06 11:52:18.249594
7	3	review	7	Reviewed an album	2026-02-06 12:02:05.961894
8	3	review	8	Reviewed a song	2026-02-06 12:32:09.90876
9	3	review	9	Reviewed an album	2026-02-06 12:32:27.611423
10	3	review	10	Reviewed an album	2026-02-06 12:33:12.997383
11	3	review	11	Reviewed a song	2026-02-06 12:51:55.151325
12	13	review	12	Reviewed an album	2026-02-06 13:14:21.501034
13	3	review	13	Reviewed a song	2026-02-06 13:14:27.57742
\.


--
-- TOC entry 4438 (class 0 OID 22530)
-- Dependencies: 400
-- Data for Name: albums; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."albums" ("album_id", "spotify_id", "mbid", "artist_id", "title", "release_year", "cover_url", "total_tracks", "last_fetched") FROM stdin;
4	5vkqYmiPBYLaalcmjujWxK	\N	4	In Rainbows	2007	https://i.scdn.co/image/ab67616d0000b273a68a3f2e9ce24f36d2e4fba8	10	2025-11-20 08:07:46.784638
5	3KzAvEXcqJKBF97HrXwlgf	\N	5	Abbey Road (Remastered)	1969	https://i.scdn.co/image/ab67616d0000b2730f4d6c908e44f9e0f8ca9a0a	17	2025-11-20 08:07:46.784638
1	\N	cc0acb14-1ffd-4065-886f-76f7c5df3acd	1	TEST ALBUM	2024	https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228	\N	2025-11-20 06:34:20.960616
3	5fy0X0JmZRZvIzqKosH1eM	\N	3	Midnights	2022	https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228	13	2025-11-20 08:07:46.784638
2	2sEDErJidRN4nBw75TTrIU	\N	2	The Poop Song	2020	https://i.scdn.co/image/ab67616d0000b2739765d4efd783fc466e0d45ba	1	2026-02-01 13:05:56.8419
7	3MATDdrpHmQCmuOcozZjDa	\N	10	TESTING	2018	https://i.scdn.co/image/ab67616d0000b273bfcb8d00cee4f8257a6b7fe1	15	2026-02-01 13:10:49.6194
10	7vjGzjSsDOZsFMz6PSZkmB	\N	13	Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom	2014	https://i.scdn.co/image/ab67616d0000b273bab8c0739ddef1035d96adb6	4	2026-02-01 13:11:38.821403
11	3j1vIG4vbuU4Rgy10qEOHd	\N	14	That’s Just My Baby Doge	2021	https://i.scdn.co/image/ab67616d0000b27366041d8512759a4df589d056	1	2026-02-02 04:35:10.066148
12	4JDXBZdRPId4devseaAOKH	\N	15	DECIDE	2022	https://i.scdn.co/image/ab67616d0000b273fddfffec51b4580acae727c1	13	2026-02-02 04:35:54.282501
13	1KoqaRZV5JUzXReXgGkJrB	\N	16	STUPID PUNK	2025	https://i.scdn.co/image/ab67616d0000b273edd10c1649518a0d7180d3a0	10	2026-02-02 04:37:09.961562
17	2IYQwwgxgOIn7t3iF6ufFD	\N	20	APT.	2024	https://i.scdn.co/image/ab67616d0000b27336032cb4acd9df050bc2e197	1	2026-02-02 04:39:24.971844
6	2YOfpbW6kCd2XHW2Ln2Uih	\N	9	I Just Might	2026	https://i.scdn.co/image/ab67616d0000b273e2887a1b6b98fc6c73bab12b	1	2026-02-02 04:39:51.568035
19	4VZ7jhV0wHpoNPCB7Vmiml	\N	9	An Evening With Silk Sonic	2021	https://i.scdn.co/image/ab67616d0000b273d0bbd3ea2ec554f17a6603cc	10	2026-02-02 04:41:48.261374
20	58ufpQsJ1DS5kq4hhzQDiI	\N	9	Unorthodox Jukebox	2012	https://i.scdn.co/image/ab67616d0000b273926f43e7cce571e62720fd46	10	2026-02-02 04:42:30.616591
21	4PgleR09JVnm3zY1fW3XBA	\N	9	24K Magic	2016	https://i.scdn.co/image/ab67616d0000b273232711f7d66a1e19e89e28c5	9	2026-02-02 04:43:12.053517
23	1uyf3l2d4XYwiEqAb7t7fX	\N	9	Doo-Wops & Hooligans	2010	https://i.scdn.co/image/ab67616d0000b273f6b55ca93bd33211227b502b	10	2026-02-02 04:45:02.88573
25	1M5ZgfbHD0qjGqdvDXXT8N	\N	28	KPop Demon Hunters: Piano Instrumentals	2025	https://i.scdn.co/image/ab67616d0000b2738f144f9ffcc7e741d6f15130	10	2026-02-02 05:04:35.466647
32	5enIvPn8EEPWMGxzBzxvcm	\N	35	Folded	2025	https://i.scdn.co/image/ab67616d0000b273c23c6110d6061ba7e2311141	1	2026-02-06 03:45:17.839836
24	0QLILSOq1IqAqx62drmv4E	\N	27	back to friends	2024	https://i.scdn.co/image/ab67616d0000b2739d24f74c1e2d8a12b1e591ec	1	2026-02-06 03:45:18.958685
8	14JkAa6IiFaOh5s0nMyMU9	\N	31	KPop Demon Hunters (Soundtrack from the Netflix Film)	2025	https://i.scdn.co/image/ab67616d0000b2734dcb6c5df15cf74596ab25a4	12	2026-02-02 05:14:28.165537
29	6e1aI8ukHaLV2dNBZQqzrz	\N	32	BUILT 4 THIS	2026	https://i.scdn.co/image/ab67616d0000b273a4da5b0218d1a0ad7e191a9a	4	2026-02-04 02:56:43.568993
30	37Vw00Rrpb0klzR4Tez4bo	\N	33	GEEKALEEK (feat. Cash Kidd)	2023	https://i.scdn.co/image/ab67616d0000b273c8233e9beb0ad58627ce02e2	1	2026-02-04 02:57:39.755175
31	2KkMVsxymoNR7hRmBcMttd	\N	34	Born This Way	2011	https://i.scdn.co/image/ab67616d0000b2734ba15b951a5cff36133ca5bd	14	2026-02-04 02:58:05.103578
34	0sLnNGW4PzCYFQ4Pn7aVCP	\N	37	U.F.O.F.	2019	https://i.scdn.co/image/ab67616d0000b2730007f1f8cfe30940c30b310f	12	2026-02-06 03:45:02.375852
35	4ggV0IaczfDFjVSwBM8yvi	\N	38	Choosin' Texas	2025	https://i.scdn.co/image/ab67616d0000b27390958927fbba47a62c3e63f8	1	2026-02-06 03:45:09.534012
33	0Bv6OJO0L5gcf20DMww54a	\N	36	Man I Need	2025	https://i.scdn.co/image/ab67616d0000b273e3d69e17dde129037a1f09e2	3	2026-02-06 03:45:13.869305
40	6l2aad6LJghHkbd0KX1f7w	\N	43	The Last Wun	2025	https://i.scdn.co/image/ab67616d0000b2737fd9dc3a93bd4fa2be8ed715	25	2026-02-06 03:48:03.725487
41	5IZ8sY5FjtL9hloXpv0XbD	\N	44	I’m The Problem	2025	https://i.scdn.co/image/ab67616d0000b27335ea219ce47813b5e2dc3745	37	2026-02-06 03:48:04.643078
42	5vD5M5VW62LL78Ko8x0CVZ	\N	45	SWAG	2025	https://i.scdn.co/image/ab67616d0000b273d65c4773bc5061fd27facc5b	21	2026-02-06 03:48:06.018726
43	1prQBN9FUobW9g4xDDKSly	\N	46	What You Saying	2025	https://i.scdn.co/image/ab67616d0000b27338b6341d4c2a56836a650165	1	2026-02-06 03:48:07.241093
44	0b64yYszabe2wxhG1PiSQo	\N	47	MUTT	2024	https://i.scdn.co/image/ab67616d0000b27382a5b97ffaf87e21ce6fdf4a	1	2026-02-06 03:48:08.592006
45	12Lig9oAX9nvpWHft5cHgF	\N	48	Fancy Some More?	2025	https://i.scdn.co/image/ab67616d0000b2738c2de5de3e20fa408171f517	31	2026-02-06 03:48:18.028785
46	2umoqwMrmjBBPeaqgYu6J9	\N	49	Purple Rain	1984	https://i.scdn.co/image/ab67616d0000b2738a2ce3f148f57584269c3782	9	2026-02-06 03:48:18.878595
47	2gKQvajkEEaDtkqJ8FJ4uw	\N	50	Fetty Wap (Deluxe)	2015	https://i.scdn.co/image/ab67616d0000b273df7c1e1c441dd172ea8f29f9	20	2026-02-06 03:48:20.102617
48	2z3hZ8WdbWz7swmVwQbkJU	\N	51	DKR	2016	https://i.scdn.co/image/ab67616d0000b273d4362f19ec1532f198dc4c7f	1	2026-02-06 10:15:41.593881
49	0AeC1S1Khew2zuaPb7caHD	\N	52	Kleine Episode	2026	https://i.scdn.co/image/ab67616d0000b27362be5aeec0ede7dc4258ee65	1	2026-02-06 10:15:55.537243
50	4hUpEROffCaxLIy3C201Pw	\N	53	ti prego non piangere	2026	https://i.scdn.co/image/ab67616d0000b2737631ea13aad7886e834bd195	1	2026-02-06 11:04:15.261235
51	3fQb5TKl4P5MYEAUq8UHuo	\N	54	All Five Nights	2016	https://i.scdn.co/image/ab67616d0000b273d17a7815e16e7da6c8f5a1de	12	2026-02-06 11:21:51.850691
52	2S7kUsL0G9T7AHGGsdzioD	\N	55	Bomayé	2026	https://i.scdn.co/image/ab67616d0000b273228593d70adc15957cc3cabd	1	2026-02-06 11:38:33.879459
53	239o15fR2WfAfsPAhh0FKs	\N	56	Back At It	2023	https://i.scdn.co/image/ab67616d0000b27307e76940a1afe344b7ef5a47	1	2026-02-06 11:41:38.520053
54	3e6X9B9YYhCkT6tlUbEkYJ	\N	57	BARRIO FINO	2025	https://i.scdn.co/image/ab67616d0000b273a4dd4f5c18e3a209cdd811e8	1	2026-02-06 11:42:36.318017
55	1kLWQJYzHP0kX6peGevMkC	\N	58	Anyways, Life’s Great…	2022	https://i.scdn.co/image/ab67616d0000b27377b82f970494b304d4957318	9	2026-02-06 11:43:48.86732
56	5e8iH1AhUmh4Xn4c5GnwQV	\N	59	Yedi Lofi Remix	2026	https://i.scdn.co/image/ab67616d0000b2731ba06e4af81b0a3bc3b099e8	1	2026-02-06 11:46:13.41589
57	7pcBXbl1g198PNAxt44bHQ	\N	60	BELOVED	2025	https://i.scdn.co/image/ab67616d0000b273f949fecf209f5e20900c126d	14	2026-02-06 11:46:21.02667
58	1dJpgn1rqvvr4yyNYLEYBG	\N	61	Crowded House	1986	https://i.scdn.co/image/ab67616d0000b2733ce3e2272e25916844f10d86	11	2026-02-06 11:51:48.32839
36	6xomx5ekO7qHDvDh57rZ5S	\N	39	Ordinary	2025	https://i.scdn.co/image/ab67616d0000b273fa2bcf3df669bde08b2e7d36	1	2026-02-06 12:32:49.491198
59	5O0zUvdnJr0RbWzLFneN2i	\N	62	Popular (Music from the HBO Original Series)	2023	https://i.scdn.co/image/ab67616d0000b2734c8f092adc59b4bf4212389d	1	2026-02-06 11:58:54.285954
60	1LieP8zDeCySTx04W66xX5	\N	63	City Baby Attacked By Rats (Expanded Version)	1982	https://i.scdn.co/image/ab67616d0000b27357cc54f712833a0ed0badb6c	19	2026-02-06 12:01:57.043526
61	6mVBfVy1H0ck8jNLuISkTI	\N	64	Test For Echo	1996	https://i.scdn.co/image/ab67616d0000b27319a12731ee835780f1c202c5	11	2026-02-06 12:05:47.955212
62	4UdzbwmdygME5g4OXDSA0f	\N	65	Big Wave (Remix)	2026	https://i.scdn.co/image/ab67616d0000b2730f465a5cde98db7daf973dd8	1	2026-02-06 12:12:44.2794
63	0mUZuEh2lynrgooJLC8FBc	\N	66	Bluey Theme Tune / Bluey Theme Tune (Extended)	2020	https://i.scdn.co/image/ab67616d0000b273f5531714ab519d6f09ed4e82	2	2026-02-06 12:18:13.474351
64	5K79FLRUCSysQnVESLcTdb	\N	67	DeBÍ TiRAR MáS FOToS	2025	https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411	17	2026-02-06 12:25:31.95111
65	0hBRqPYPXhr1RkTDG3n4Mk	\N	68	The Secret of Us (Deluxe)	2024	https://i.scdn.co/image/ab67616d0000b2731dac3694b3289cd903cb3acf	20	2026-02-06 12:25:53.068408
66	743ewCXr40qFvqNdVYpAml	\N	69	I CANT HELP YOU	2026	https://i.scdn.co/image/ab67616d0000b273e99b9574b586607f6cad7493	1	2026-02-06 12:26:04.198606
67	02sEJTj1sye1JaqxqpcSCp	\N	70	Encore	2016	https://i.scdn.co/image/ab67616d0000b273212d776c31027c511f0ee3bc	14	2026-02-06 12:26:22.992009
68	25eRITKk6jXXJLAxA3M5b3	\N	71	(When You Gonna) Give It Up to Me [feat. Keyshia Cole]	2006	https://i.scdn.co/image/ab67616d0000b273c76fc6e0359bf63562676c5d	3	2026-02-06 12:27:54.297043
9	4a6NzYL1YHRUgx9e3YZI6I	\N	3	The Life of a Showgirl	2025	https://i.scdn.co/image/ab67616d0000b273d7812467811a7da6e6a44902	12	2026-02-06 12:28:10.216422
70	2ME0R7wx6jnHudplZAG2be	\N	73	FDO	2025	https://i.scdn.co/image/ab67616d0000b27322bc229c96dfc264c9f729ca	1	2026-02-06 12:31:32.457485
72	7iykGeMdxOdYtNRtYCNaMA	\N	75	Garh Tany	2003	https://i.scdn.co/image/ab67616d0000b2736f5efd372331919ebd9d0fc9	11	2026-02-06 12:32:56.074234
73	0FrC9lzgVhziJenigsrXdl	\N	76	Jack In The Box	2022	https://i.scdn.co/image/ab67616d0000b273ce5bba40b16f887e0461c6e2	10	2026-02-06 12:33:02.688015
74	4NvMwUFmY1dcDEgD8KoQjG	\N	77	With Heaven On Top	2026	https://i.scdn.co/image/ab67616d0000b2730c911eacdde2ea4186ad4a31	25	2026-02-06 12:35:22.609164
75	1CmTOKCeyz1aHH04OwvTPv	\N	77	Something in the Orange	2022	https://i.scdn.co/image/ab67616d0000b273b2b6670e3aca9bcd55fbabbb	4	2026-02-06 12:35:25.335035
76	6PbnGueEO6LGodPfvNldYf	\N	77	Zach Bryan	2023	https://i.scdn.co/image/ab67616d0000b273e5a25ed08d1e7e0fbb440cef	16	2026-02-06 12:35:36.945169
77	2ZUFSbIkmFkGag000RWOpA	\N	80	Nothing Was The Same (Deluxe)	2013	https://i.scdn.co/image/ab67616d0000b273adfb5909ec66db5fbb4d06c8	16	2026-02-06 12:43:08.231771
78	5ll74bqtkcXlKE7wwkMq4g	\N	81	Late Registration	2005	https://i.scdn.co/image/ab67616d0000b273428d2255141c2119409a31b2	21	2026-02-06 12:51:24.570038
79	5q631C9dZdZVIQudKC6J0y	\N	82	Tgv Kan Mhalwi	2024	https://i.scdn.co/image/ab67616d0000b2731c46dbeb670fadacc367ce06	1	2026-02-06 12:52:21.934239
80	05jbNkYoEQdjVDHEHtg1gY	\N	83	Don't Forget About Me, Demos	2018	https://i.scdn.co/image/ab67616d0000b2737b1b6f41c1645af9757d5616	8	2026-02-06 12:52:30.402759
81	3cf4iSSKd8ffTncbtKljXw	\N	80	Honestly, Nevermind	2022	https://i.scdn.co/image/ab67616d0000b2738dc0d801766a5aa6a33cbe37	14	2026-02-06 13:13:01.297652
82	1TP95xOGiWqdVOu4hGbuug	\N	85	Rebel	2025	https://i.scdn.co/image/ab67616d0000b2732940ac3a182dac2a5ec72249	11	2026-02-06 13:13:06.013461
83	78FGMj1ZqjV8J8AgKcej93	\N	86	Sabotage	2016	https://i.scdn.co/image/ab67616d0000b273fac7a564f376b3047b9b769b	11	2026-02-06 13:14:21.43656
\.


--
-- TOC entry 4436 (class 0 OID 22516)
-- Dependencies: 398
-- Data for Name: artists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."artists" ("artist_id", "spotify_id", "mbid", "name", "image_url", "followers", "genres", "last_fetched") FROM stdin;
1	\N	6a66c6ff-b34d-4c89-af1e-072eb64a626e	TEST ARTIST	https://placehold.co/300x300	\N	\N	2025-11-20 06:34:20.960616
4	4Z8W4fKeB5YxbusRsdQVPb	\N	Radiohead	https://i.scdn.co/image/ab6761610000e5eb3cdaefb725f0c60211472ed9	\N	{alternative,rock}	2025-11-20 08:07:46.784638
5	3WrFJ7ztbogyGnTHbHJFl2	\N	The Beatles	https://i.scdn.co/image/ab6761610000e5ebe94f02fa2c20f4c775b577aa	\N	{rock}	2025-11-20 08:07:46.784638
2	45Bl7N7STqp4aY6HFu5dnd	\N	Teddy Casey	https://i.scdn.co/image/ab6761610000e5eb6b89d41bc622d181c58ffdcb	25229	{}	2026-02-01 13:05:56.8419
10	13ubrt8QOOCPljQ2FL1Kca	\N	A$AP Rocky	https://i.scdn.co/image/ab6761610000e5ebad160b333f9a240f84aff7d7	18009571	{rap}	2026-02-01 13:10:49.6194
11	7mW7Tv7NvywKKXqafZo0Lc	\N	KPop Demon Hunters Cast	https://i.scdn.co/image/ab67616d0000b2736c1334650ced0e28f0b2e13f	2215665	{k-pop}	2026-02-01 13:11:10.093906
39	0fTSzq9jAh4c36UVb4V7CB	\N	Alex Warren	https://i.scdn.co/image/ab6761610000e5eb9175feab318f624eb4cc0bfe	3594778	{}	2026-02-06 12:32:49.491198
13	17BmVePNxhzlRGKc85xYsd	\N	Dan Bull	https://i.scdn.co/image/ab6761610000e5ebd7f2395b4ca87f32b4a034fd	407748	{}	2026-02-01 13:11:38.821403
14	68ndvsS9JZgky4ewhFgy5i	\N	Chicky Milky	https://i.scdn.co/image/ab67616d0000b2736956e26c6451af41485d74e4	29845	{"children's music"}	2026-02-02 04:35:10.066148
15	5p9HO3XC5P3BLxJs5Mtrhm	\N	Djo	https://i.scdn.co/image/ab6761610000e5eb4113d395582d3667b7978430	4094732	{}	2026-02-02 04:35:54.282501
16	3Myno9n2B87Jum5NnM8wnw	\N	CF98	https://i.scdn.co/image/ab6761610000e5eb16b606def227b94f0799f4ca	5508	{"skate punk","melodic hardcore",punk}	2026-02-02 04:37:09.961562
20	3eVa5w3URK5duf6eyVDbu9	\N	ROSÉ	https://i.scdn.co/image/ab6761610000e5ebcfb4350222919670128ff2dc	14199795	{k-pop}	2026-02-02 04:39:24.971844
36	00x1fYSGhdqScXBRpSj3DW	\N	Olivia Dean	https://i.scdn.co/image/ab6761610000e5eb5c7577ad44daeb7ce4b941a1	3000625	{"pop soul"}	2026-02-06 03:45:13.869305
35	0cGUm45nv7Z6M6qdXYQGTX	\N	Kehlani	https://i.scdn.co/image/ab6761610000e5eb57082fd22d755e80a648fac3	9048463	{}	2026-02-06 03:45:17.839836
27	4G9NDjRyZFDlJKMRL8hx3S	\N	sombr	https://i.scdn.co/image/ab6761610000e5eb78edaa6468cae153565c2c97	3669547	{}	2026-02-06 03:45:18.958685
43	2hlmm7s2ICUX0LVIhVFlZQ	\N	Gunna	https://i.scdn.co/image/ab6761610000e5eba998bc86f87b9fe7e2466110	11036928	{"melodic rap"}	2026-02-06 03:48:03.725487
44	4oUHIQIBe0LHzYfvXNW4QM	\N	Morgan Wallen	https://i.scdn.co/image/ab6761610000e5eb4245b1652fcc23f2b76ccd07	14779519	{country}	2026-02-06 03:48:04.643078
9	0du5cEVh5yTK9QJze8zA0C	\N	Bruno Mars	https://i.scdn.co/image/ab6761610000e5ebc7688aad1bf03986934d7e26	78659459	{}	2026-02-02 04:45:02.88573
28	0IqjJsWlAPR2IafHTtnjPQ	\N	Minnz Piano	https://i.scdn.co/image/ab6761610000e5eb4084723d3a5d604d446f5041	70747	{}	2026-02-02 05:04:35.466647
29	2yNNYQBChuox9A5Ka93BIn	\N	HUNTR/X	https://i.scdn.co/image/ab67616d0000b2736c1334650ced0e28f0b2e13f	5128330	{}	2026-02-02 05:13:52.504747
31	7n2Ycct7Beij7Dj7meI4X0	\N	TWICE	https://i.scdn.co/image/ab6761610000e5eb3d8820046fd455b38d644864	24193153	{k-pop}	2026-02-02 05:14:28.165537
32	3O96LSvlQrNeKpZ8FuZkEk	\N	BK	https://i.scdn.co/image/ab6761610000e5eb54e58b448ada8abcb74e5e4c	77146	{"punjabi hip hop","punjabi pop",bhangra}	2026-02-04 02:56:43.568993
33	3ppQEG71r7jVpI8RudzycF	\N	OHGEESY	https://i.scdn.co/image/ab6761610000e5eba49f73d3a15c13d140f9862e	516571	{}	2026-02-04 02:57:39.755175
34	1HY2Jd0NmPuamShAr6KMms	\N	Lady Gaga	https://i.scdn.co/image/ab6761610000e5ebaadc18cac8d48124357c38e6	44435827	{"art pop",pop}	2026-02-04 02:58:05.103578
37	5QdyldG4Fl4TPiOIeMNpBZ	\N	Big Thief	https://i.scdn.co/image/ab6761610000e5ebb2be573b9d9ca2bf7f113d92	1403766	{}	2026-02-06 03:45:02.375852
38	6BRxQ8cD3eqnrVj6WKDok8	\N	Ella Langley	https://i.scdn.co/image/ab6761610000e5ebc4670378a4188c3174ef2ca9	986792	{country}	2026-02-06 03:45:09.534012
45	1uNFoZAHBGtllmzznpCI3s	\N	Justin Bieber	https://i.scdn.co/image/ab6761610000e5ebaf20f7db5288bce9beede034	86850086	{}	2026-02-06 03:48:06.018726
46	4O15NlyKLIASxsJ0PrXPfz	\N	Lil Uzi Vert	https://i.scdn.co/image/ab6761610000e5eb62c272d76220f2e9dad56704	19823447	{"melodic rap"}	2026-02-06 03:48:07.241093
47	0nnBZ8FXWjG9wZgM2cpfeb	\N	Leon Thomas	https://i.scdn.co/image/ab6761610000e5ebc6c4f4aaf40ebee92b8a8228	902453	{}	2026-02-06 03:48:08.592006
48	78rUTD7y6Cy67W1RVzYs7t	\N	PinkPantheress	https://i.scdn.co/image/ab6761610000e5eb6bf10d74063b45938f5d8656	5129395	{"bedroom pop"}	2026-02-06 03:48:18.028785
49	5a2EaR3hamoenG9rDuVn8j	\N	Prince	https://i.scdn.co/image/ab6761610000e5ebb5393a6579d549f00d4fa987	8027852	{funk,"funk rock"}	2026-02-06 03:48:18.878595
50	6PXS4YHDkKvl1wkIl4V8DL	\N	Fetty Wap	https://i.scdn.co/image/ab6761610000e5eb8ffb1b02e4435c5176b28ed2	5268127	{}	2026-02-06 03:48:20.102617
51	58wXmynHaAWI5hwlPZP3qL	\N	Booba	https://i.scdn.co/image/ab6761610000e5eb96b3ab10e89bad078d125c3a	3827141	{"french rap","french r&b","pop urbaine"}	2026-02-06 10:15:41.593881
52	3t6bNYrd5aYZ4WQlqHvKx2	\N	Fjellson Weber	https://i.scdn.co/image/ab6761610000e5eb01bca660dfa0f7b673416eca	8683	{}	2026-02-06 10:15:55.537243
53	0vQk2DnpCtSLT8QeMbCE6L	\N	Federica Carta	https://i.scdn.co/image/ab6761610000e5eba8569699e122591d624b1f42	243647	{}	2026-02-06 11:04:15.261235
54	5qvrAlKjc0Sqrqz6v2wBGk	\N	JT Music	https://i.scdn.co/image/ab6761610000e5ebfbeeb8dfc82fe0da59cad419	1448762	{}	2026-02-06 11:21:51.850691
55	4uqsX0Q3aomKN5Q8D0Ffxu	\N	HBT	https://i.scdn.co/image/ab6761610000e5ebabbb1ebd5cc05226c158ddb9	10612	{"french rap"}	2026-02-06 11:38:33.879459
56	1ZA7X7hcCf695nBgF4iU4Y	\N	Ygb Hakim	https://i.scdn.co/image/ab6761610000e5eb10d1ea6aac0c686a39d2454a	5389	{}	2026-02-06 11:41:38.520053
57	0FwnPHExlRRxEZPLAi5tmG	\N	JC Reyes	https://i.scdn.co/image/ab6761610000e5eb7478dc640b54483093bf5bed	1707274	{}	2026-02-06 11:42:36.318017
58	2qoQgPAilErOKCwE2Y8wOG	\N	GloRilla	https://i.scdn.co/image/ab6761610000e5ebc33cf3ad025517202d8efbc0	2793894	{}	2026-02-06 11:43:48.86732
59	5VVN3xZw1i2qihfITZlvCZ	\N	G. V. Prakash	https://i.scdn.co/image/ab6761610000e5eb0a5c692089af5c0f9cf839f3	17738006	{"tamil pop",kollywood,"tamil dance","tamil hip hop",tollywood}	2026-02-06 11:46:13.41589
60	4fxd5Ee7UefO4CUXgwJ7IP	\N	GIVĒON	https://i.scdn.co/image/ab6761610000e5eb48769fa9ef3b5f24af90a09d	5597377	{r&b}	2026-02-06 11:46:21.02667
61	7ohlPA8dRBtCf92zaZCaaB	\N	Crowded House	https://i.scdn.co/image/ab6761610000e5eb44cb4815148bd49c0a600b89	1110368	{}	2026-02-06 11:51:48.32839
62	1Xyo4u8uXC1ZmMpatF05PJ	\N	The Weeknd	https://i.scdn.co/image/ab6761610000e5eb9e528993a2820267b97f6aae	118074111	{}	2026-02-06 11:58:54.285954
63	0yqupKw0GMDWXHpsxCPysY	\N	GBH	https://i.scdn.co/image/ab6761610000e5eb98a8c6f2e50aed6bc8509450	141097	{"hardcore punk",punk,"skate punk",hardcore,proto-punk}	2026-02-06 12:01:57.043526
64	2Hkut4rAAyrQxRdof7FVJq	\N	Rush	https://i.scdn.co/image/ab6761610000e5eb896c4b043fb3063178afd716	2607082	{"progressive rock","classic rock","hard rock",rock,aor}	2026-02-06 12:05:47.955212
65	7MOC0pjbDiqenFaIkNiD3f	\N	GBFLEX CAMARO	https://i.scdn.co/image/ab6761610000e5eb9c41554189408d90b403df18	1461	{"afro adura"}	2026-02-06 12:12:44.2794
66	6ca3AFdIIgaP4ZIW8J6zXu	\N	Bluey	https://i.scdn.co/image/ab6761610000e5eb2941a61784e32055153ca91c	370991	{"children's music"}	2026-02-06 12:18:13.474351
67	4q3ewBCX7sLwd24euuV69X	\N	Bad Bunny	https://i.scdn.co/image/ab6761610000e5eb81f47f44084e0a09b5f0fa13	108087836	{reggaeton,"trap latino",latin,"urbano latino"}	2026-02-06 12:25:31.95111
68	4tuJ0bMpJh08umKkEXKUI5	\N	Gracie Abrams	https://i.scdn.co/image/ab6761610000e5ebf6d51e6f5342d2d363220920	8519219	{}	2026-02-06 12:25:53.068408
69	14fRBYauL2n4Ls42ISvUbJ	\N	YGMEO	https://i.scdn.co/image/ab6761610000e5eb65d4a38c47931962742269ac	2437	{"rap québécois"}	2026-02-06 12:26:04.198606
70	540vIaP2JwjQb9dm3aArA4	\N	DJ Snake	https://i.scdn.co/image/ab6761610000e5eb7e57e2ed9b787ba5773b7cb9	9483008	{}	2026-02-06 12:26:22.992009
71	3Isy6kedDrgPYoTS1dazA9	\N	Sean Paul	https://i.scdn.co/image/ab6761610000e5eb60c3e9abe7327c0097738f22	5457799	{dancehall}	2026-02-06 12:27:54.297043
3	06HL4z0CvFAxyc27GXpf02	\N	Taylor Swift	https://i.scdn.co/image/ab6761610000e5ebe2e8e7ff002a4afda1c7147e	151207092	{}	2026-02-06 12:28:10.216422
73	5F1aAS1duwlzExnPs3l2Xe	\N	Pooh Shiesty	https://i.scdn.co/image/ab6761610000e5eb0e3da613c6b41441d2404b90	2294338	{}	2026-02-06 12:31:32.457485
75	2Wk167T0fY1fABsHM5qFcI	\N	Sherine	https://i.scdn.co/image/ab6761610000e5eb1fa228ebdfdbd596bfa1bd77	10281662	{"egyptian pop",sholawat,khaleeji}	2026-02-06 12:32:56.074234
76	0b1sIQumIAsNbqAoIClSpy	\N	j-hope	https://i.scdn.co/image/ab6761610000e5eb25c2401c3595f0ac35e19b98	19846275	{k-pop,k-rap}	2026-02-06 12:33:02.688015
77	40ZNYROS4zLfyyBSs2PGe2	\N	Zach Bryan	https://i.scdn.co/image/ab6761610000e5ebc742fbc057bdbc64834a6cdc	7748084	{country,"red dirt"}	2026-02-06 12:35:36.945169
81	5K4W6rqBFWDnAN6FQUkS6x	\N	Kanye West	https://i.scdn.co/image/ab6761610000e5eb6e835a500e791bf9c27a422a	32032442	{rap}	2026-02-06 12:51:24.570038
82	39O6tDnyxN5GNWhjHRkjNa	\N	Cheb Mirou	https://i.scdn.co/image/ab67616d0000b27374f715ab4a617885d2785769	389748	{raï,"moroccan chaabi","moroccan pop"}	2026-02-06 12:52:21.934239
83	6USv9qhCn6zfxlBQIYJ9qs	\N	Dominic Fike	https://i.scdn.co/image/ab6761610000e5ebf2903326ec44d5ecb37dcad9	2373438	{}	2026-02-06 12:52:30.402759
80	3TVXtAsR1Inumwj472S9r4	\N	Drake	https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9	106817264	{rap}	2026-02-06 13:13:01.297652
85	0EyhkwP3UnwGFBy6xwKjSy	\N	EsDeeKid	https://i.scdn.co/image/ab6761610000e5ebfe6d53e126b70d1c2594b434	1402776	{}	2026-02-06 13:13:06.013461
86	5deK5HnwbEKvge2svL0i0B	\N	Sabotage	https://i.scdn.co/image/ab6761610000e5eb81ae0bfd666267ed9d73c77d	1631203	{"brazilian hip hop","boom bap"}	2026-02-06 13:14:21.43656
\.


--
-- TOC entry 4431 (class 0 OID 22457)
-- Dependencies: 393
-- Data for Name: auth_local; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."auth_local" ("user_id", "password_hash") FROM stdin;
2	$2a$12$gmy0WQ143UAViP1kT3fvpOF0sltnC4lfnOXgjg6Ww8KgrqIJSfySa
1	$2a$12$p3vjakCswydMq7C4uFwOn.UoQvx87pWVMumbefidU3Whd0I7H3Jl6
3	$2a$12$gHx.9QCa157xk2gAMVsGBuJASU3KASCDVyJEYfk6VfpgDDuMvDwe6
4	$2a$12$apnyDs2e1tI92unKUyOmuueGaNADm93HSo2aRhXu4d.6l4ma/Yqx6
5	$2a$12$3JEo2hqe/vZLKU3FtYtHQeschaYFgRfTayMcvJgBDr8WPu/HjoBf2
6	$2a$12$.C.aynJtGslGo2qCVGnLo.3UJBKwyqcIslgOmd1RGazVtHs8hWRdC
7	$2a$12$J/I5LlKmkosEXk82cmsUlON9TSU.J.3U/mSC7xrTruX4hFfRCExOe
8	$2a$12$wZ.Q8TgytEYalicGw.HwKOqe/gcgmYJDP5qnY6eKWHW0DiFrnHpti
9	$2a$12$f1xfkE37UYclENHBHAEuEeXhpnv.eMj6zbyqM.n2s7z4Ob8zi7pIi
10	$2a$12$JvtJ6zVbDInOJI9gtPenBeWzOv4egcKrq3zQN1AFtqxQLhMOrubh2
11	$2a$12$5LVFKqwFpOsOJgV3YM0GtuScacjotPRD7vRWghH.TJix5r6aabx.W
12	$2a$12$xlsEASHfcsWkKKadiN/90eHa51m2lQaYmMX/uNBhc276yxiNweEa6
13	$2a$12$4FdofK1/ZUCEXiRagnGgOuXcSQxcSAzToWo5IIsoQ2aGM2L2yzeLi
\.


--
-- TOC entry 4449 (class 0 OID 22652)
-- Dependencies: 411
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."comments" ("comment_id", "review_id", "user_id", "content", "created_at") FROM stdin;
\.


--
-- TOC entry 4451 (class 0 OID 22688)
-- Dependencies: 413
-- Data for Name: diary_entries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."diary_entries" ("entry_id", "user_id", "song_id", "listened_at", "rating", "review_id", "notes") FROM stdin;
1	1	1	2025-11-20 06:34:20.960616	3.8	\N	Listened for TESTING
\.


--
-- TOC entry 4452 (class 0 OID 22712)
-- Dependencies: 414
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."favorites" ("user_id", "item_type", "item_id", "added_at") FROM stdin;
1	song	1	2025-11-20 06:34:20.960616
1	album	3	2025-11-20 08:07:46.784638
1	album	4	2025-11-20 08:07:46.784638
1	album	5	2025-11-20 08:07:46.784638
1	song	3	2025-11-20 08:07:46.784638
1	song	4	2025-11-20 08:07:46.784638
1	song	5	2025-11-20 08:07:46.784638
1	artist	3	2025-11-20 08:07:46.784638
1	artist	4	2025-11-20 08:07:46.784638
1	artist	5	2025-11-20 08:07:46.784638
3	album	29	2026-02-04 02:56:45.941062
3	song	15	2026-02-04 02:58:05.409562
12	album	6	2026-02-06 00:25:24.57533
3	album	7	2026-02-06 03:41:05.234297
3	album	33	2026-02-06 03:45:02.325081
3	album	34	2026-02-06 03:45:02.660268
3	album	32	2026-02-06 03:45:05.993014
3	album	35	2026-02-06 03:45:09.828456
3	song	16	2026-02-06 03:45:14.094838
3	song	12	2026-02-06 03:45:15.232053
3	song	2	2026-02-06 03:45:16.572175
3	song	17	2026-02-06 03:45:18.072823
3	song	18	2026-02-06 03:45:19.245191
3	album	8	2026-02-06 03:44:16.792823
3	album	6	2026-02-06 03:48:00.135388
3	album	40	2026-02-06 03:48:03.896337
3	album	41	2026-02-06 03:48:04.780114
3	album	42	2026-02-06 03:48:06.173749
3	album	43	2026-02-06 03:48:07.45082
3	album	44	2026-02-06 03:48:08.767114
3	album	24	2026-02-06 03:48:10.873089
3	album	45	2026-02-06 03:48:18.237635
3	album	46	2026-02-06 03:48:19.113057
3	album	47	2026-02-06 03:48:20.364962
13	album	24	2026-02-06 12:03:18.036942
13	song	33	2026-02-06 12:35:22.806751
13	song	34	2026-02-06 12:35:25.50355
13	song	35	2026-02-06 12:35:37.155394
13	album	74	2026-02-06 12:35:43.694745
\.


--
-- TOC entry 4433 (class 0 OID 22482)
-- Dependencies: 395
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."follows" ("follower_id", "following_id", "followed_at") FROM stdin;
\.


--
-- TOC entry 4454 (class 0 OID 22734)
-- Dependencies: 416
-- Data for Name: listen_later; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."listen_later" ("user_id", "song_id", "added_at") FROM stdin;
\.


--
-- TOC entry 4465 (class 0 OID 22855)
-- Dependencies: 427
-- Data for Name: message_reactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."message_reactions" ("message_id", "user_id", "reaction", "reacted_at") FROM stdin;
\.


--
-- TOC entry 4464 (class 0 OID 22835)
-- Dependencies: 426
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."messages" ("message_id", "thread_id", "sender_id", "content", "attachment_url", "created_at") FROM stdin;
\.


--
-- TOC entry 4456 (class 0 OID 22751)
-- Dependencies: 418
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."notifications" ("notification_id", "user_id", "type", "payload", "is_read", "created_at") FROM stdin;
\.


--
-- TOC entry 4444 (class 0 OID 22598)
-- Dependencies: 406
-- Data for Name: playlist_songs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."playlist_songs" ("playlist_id", "song_id", "position") FROM stdin;
1	1	1
\.


--
-- TOC entry 4443 (class 0 OID 22583)
-- Dependencies: 405
-- Data for Name: playlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."playlists" ("playlist_id", "user_id", "title", "description", "is_public", "created_at") FROM stdin;
1	1	TEST PLAYLIST	playlist for TESTING	t	2025-11-20 06:34:20.960616
\.


--
-- TOC entry 4447 (class 0 OID 22635)
-- Dependencies: 409
-- Data for Name: review_likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."review_likes" ("review_id", "user_id", "liked_at") FROM stdin;
\.


--
-- TOC entry 4446 (class 0 OID 22614)
-- Dependencies: 408
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."reviews" ("review_id", "user_id", "song_id", "rating", "content", "created_at", "updated_at", "album_id") FROM stdin;
1	1	1	4.5	TEST REVIEW CONTENT	2025-11-20 06:34:20.960616	2025-11-20 06:34:20.960616	\N
2	3	\N	5.0	Fjf	2026-02-06 10:50:31.812932	2026-02-06 10:50:31.812932	8
3	3	\N	5.0	Dnd	2026-02-06 10:50:51.696361	2026-02-06 10:50:51.696361	32
4	3	\N	4.5		2026-02-06 10:53:24.212941	2026-02-06 10:53:31.713589	43
5	3	\N	4.5	Dn	2026-02-06 11:04:29.23793	2026-02-06 11:52:01.634109	24
7	3	\N	5.0		2026-02-06 12:02:05.961894	2026-02-06 12:02:05.961894	60
8	3	30	4.5		2026-02-06 12:32:09.90876	2026-02-06 12:32:09.90876	\N
9	3	\N	5.0	Dhd	2026-02-06 12:32:27.611423	2026-02-06 12:32:27.611423	9
6	3	16	4.5	X	2026-02-06 11:52:18.249594	2026-02-06 12:32:44.191683	\N
10	3	\N	4.5	Dd	2026-02-06 12:33:12.997383	2026-02-06 12:33:12.997383	73
11	3	37	0.5	This song is GEEEEEEEEEEK	2026-02-06 12:51:55.151325	2026-02-06 12:51:55.151325	\N
12	13	\N	3.0	Test	2026-02-06 13:14:21.501034	2026-02-06 13:14:21.501034	6
13	3	41	5.0	Ss	2026-02-06 13:14:27.57742	2026-02-06 13:14:27.57742	\N
\.


--
-- TOC entry 4441 (class 0 OID 22567)
-- Dependencies: 403
-- Data for Name: song_artists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."song_artists" ("song_id", "artist_id") FROM stdin;
\.


--
-- TOC entry 4440 (class 0 OID 22549)
-- Dependencies: 402
-- Data for Name: songs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."songs" ("song_id", "spotify_id", "mbid", "album_id", "title", "duration", "track_number", "isrc", "popularity", "preview_url", "spotify_url", "last_fetched") FROM stdin;
1	\N	97648d76-f208-4ffb-9c80-f7cf85e6ab08	1	TEST SONG	180	1	\N	\N	https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228	https://open.spotify.com/track/TEST	2025-11-20 06:34:20.960616
32	136sse7QGfLGWJ4mbwTgLw	\N	72	Eh Eh	267	2	EGA090300402	54	\N	https://open.spotify.com/track/136sse7QGfLGWJ4mbwTgLw	2026-02-06 12:32:56.074234
4	4bHsxqR3GMrXTxEPLuK5ue	\N	4	Nude	260	3	GBAYE0701455	78	https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228	https://open.spotify.com/track/4bHsxqR3GMrXTxEPLuK5ue	2025-11-20 08:07:46.784638
33	0BUvxX1tTOSJcsn6Y24Bsp	\N	74	Say Why	144	5	USWB12600005	81	\N	https://open.spotify.com/track/0BUvxX1tTOSJcsn6Y24Bsp	2026-02-06 12:35:22.609164
3	3rWDp9tBPQR9z6U5YyRSK4	\N	3	Anti-Hero	200	3	USUG12204288	85	https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411	https://open.spotify.com/track/3rWDp9tBPQR9z6U5YyRSK4	2025-11-20 08:07:46.784638
5	6dGnYIeXmHdcikdzNNDMm2	\N	5	Come Together	260	1	GBAYE0601477	82	https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411	https://open.spotify.com/track/6dGnYIeXmHdcikdzNNDMm2	2025-11-20 08:07:46.784638
2	3qhlB30KknSejmIvZZLjOD	\N	12	End of Beginning	159	6	GBKPL2205058	100	\N	https://open.spotify.com/track/3qhlB30KknSejmIvZZLjOD	2026-02-02 04:35:54.282501
6	5vNRhkKd0yEAg8suGBpjeY	\N	17	APT.	170	1	USAT22409172	88	\N	https://open.spotify.com/track/5vNRhkKd0yEAg8suGBpjeY	2026-02-02 04:39:24.971844
7	12bYYQaLqHliSXvRIYlq8G	\N	6	I Just Might	213	1	USAT22509144	95	\N	https://open.spotify.com/track/12bYYQaLqHliSXvRIYlq8G	2026-02-02 04:39:51.568035
8	7lXOqE38eCr979gp27O5wr	\N	20	If I Knew	133	10	USAT21206913	75	\N	https://open.spotify.com/track/7lXOqE38eCr979gp27O5wr	2026-02-02 04:42:30.616591
9	0KKkJNfGyhkQ5aFogxQAPU	\N	21	That's What I Like	207	4	USAT21602948	92	\N	https://open.spotify.com/track/0KKkJNfGyhkQ5aFogxQAPU	2026-02-02 04:42:56.078692
10	6b8Be6ljOzmkOmFslEb23P	\N	21	24K Magic	226	1	USAT21602944	86	\N	https://open.spotify.com/track/6b8Be6ljOzmkOmFslEb23P	2026-02-02 04:43:12.053517
11	2tJulUYLDKOg9XrtVkMgcJ	\N	23	Grenade	222	1	USAT21001883	81	\N	https://open.spotify.com/track/2tJulUYLDKOg9XrtVkMgcJ	2026-02-02 04:45:02.88573
12	1CPZ5BxNNd0n0nF4Orb9JS	\N	8	Golden	195	4	QZ8BZ2513510	97	\N	https://open.spotify.com/track/1CPZ5BxNNd0n0nF4Orb9JS	2026-02-02 05:13:16.259173
13	3RXUgPNIbUgFxsDWuBQEt6	\N	8	How It’s Done	176	2	QZ8BZ2513508	88	\N	https://open.spotify.com/track/3RXUgPNIbUgFxsDWuBQEt6	2026-02-02 05:13:52.504747
14	6Q3lFQgpvhA9VApFKLFZtZ	\N	8	Strategy	169	5	US5TA2400303	79	\N	https://open.spotify.com/track/6Q3lFQgpvhA9VApFKLFZtZ	2026-02-02 05:14:28.165537
15	0QkWikH5Z3U0f79T9iuF6c	\N	31	Judas	249	4	USUM71104998	76	\N	https://open.spotify.com/track/0QkWikH5Z3U0f79T9iuF6c	2026-02-04 02:58:05.103578
16	1qbmS6ep2hbBRaEZFpn7BX	\N	33	Man I Need	184	1	GBUM72503089	97	\N	https://open.spotify.com/track/1qbmS6ep2hbBRaEZFpn7BX	2026-02-06 03:45:13.869305
17	0bxPRWprUVpQK0UFcddkrA	\N	32	Folded	238	1	USAT22504344	90	\N	https://open.spotify.com/track/0bxPRWprUVpQK0UFcddkrA	2026-02-06 03:45:17.839836
18	0FTmksd2dxiE5e3rWyJXs6	\N	24	back to friends	199	1	USWB12405502	91	\N	https://open.spotify.com/track/0FTmksd2dxiE5e3rWyJXs6	2026-02-06 03:45:18.958685
19	02Gl9tZhIu0BguKv3GTYgB	\N	50	ti prego non piangere	199	1	ITPLO2500005	0	\N	https://open.spotify.com/track/02Gl9tZhIu0BguKv3GTYgB	2026-02-06 11:04:15.261235
20	0Mh4zlDsN7s0YMbsas12et	\N	51	Join Us for a Bite	237	9	QZAPG1865496	74	\N	https://open.spotify.com/track/0Mh4zlDsN7s0YMbsas12et	2026-02-06 11:21:51.850691
21	0WNfQxDGaPTl0yogcMR5v1	\N	55	Tomorrow 2 (with Cardi B)	210	3	USUM72217666	70	\N	https://open.spotify.com/track/0WNfQxDGaPTl0yogcMR5v1	2026-02-06 11:43:48.86732
22	7G7tgVYORlDuVprcYHuFJh	\N	58	Don't Dream It's Over	237	4	USCA28600048	84	\N	https://open.spotify.com/track/7G7tgVYORlDuVprcYHuFJh	2026-02-06 11:51:48.32839
23	6WzRpISELf3YglGAh7TXcG	\N	59	Popular (with Playboi Carti & Madonna) - From The Idol Vol. 1 (Music from the HBO Original Series)	215	1	USUG12303876	83	\N	https://open.spotify.com/track/6WzRpISELf3YglGAh7TXcG	2026-02-06 11:58:54.285954
24	0DwdkyMRSGuqUTF5LspqY3	\N	61	Driven	267	2	CAA310300523	16	\N	https://open.spotify.com/track/0DwdkyMRSGuqUTF5LspqY3	2026-02-06 12:05:47.955212
25	3sK8wGT43QFpWrvNQsrQya	\N	64	DtMF	237	16	QMFMF2447070	93	\N	https://open.spotify.com/track/3sK8wGT43QFpWrvNQsrQya	2026-02-06 12:25:31.95111
26	7ne4VBA60CxGM75vw0EYad	\N	65	That’s So True	166	15	USUG12406903	91	\N	https://open.spotify.com/track/7ne4VBA60CxGM75vw0EYad	2026-02-06 12:25:53.068408
27	0lYBSQXN6rCTvUZvg9S0lU	\N	67	Let Me Love You	206	13	QMZSY1600015	91	\N	https://open.spotify.com/track/0lYBSQXN6rCTvUZvg9S0lU	2026-02-06 12:26:22.992009
28	5nEdwtSv0qqeE0l4o1lR4q	\N	68	(When You Gonna) Give It Up to Me (feat. Keyshia Cole) - Radio Version	244	1	USAT20615165	86	\N	https://open.spotify.com/track/5nEdwtSv0qqeE0l4o1lR4q	2026-02-06 12:27:54.297043
29	53iuhJlwXhSER5J2IYYv1W	\N	9	The Fate of Ophelia	226	1	USUG12506436	98	\N	https://open.spotify.com/track/53iuhJlwXhSER5J2IYYv1W	2026-02-06 12:28:10.216422
30	5YbDA37CN0YcgZXF6L2cBX	\N	70	FDO	319	1	USAT22509502	79	\N	https://open.spotify.com/track/5YbDA37CN0YcgZXF6L2cBX	2026-02-06 12:31:32.457485
31	6qqrTXSdwiJaq8SO0X2lSe	\N	36	Ordinary	187	1	USAT22500463	89	\N	https://open.spotify.com/track/6qqrTXSdwiJaq8SO0X2lSe	2026-02-06 12:32:49.491198
34	3WMj8moIAXJhHsyLaqIIHI	\N	75	Something in the Orange	228	1	USWB12201213	86	\N	https://open.spotify.com/track/3WMj8moIAXJhHsyLaqIIHI	2026-02-06 12:35:25.335035
35	4KULAymBBJcPRpk1yO4dOG	\N	76	I Remember Everything (feat. Kacey Musgraves)	227	11	USWB12304903	86	\N	https://open.spotify.com/track/4KULAymBBJcPRpk1yO4dOG	2026-02-06 12:35:36.945169
36	6jdOi5U5LBzQrc4c1VT983	\N	77	Hold On, We're Going Home	228	8	USCM51300762	80	\N	https://open.spotify.com/track/6jdOi5U5LBzQrc4c1VT983	2026-02-06 12:43:08.231771
37	2dxjKgT0li4qBI3QwuN9Ih	\N	78	Touch The Sky	237	3	USUM70502527	79	\N	https://open.spotify.com/track/2dxjKgT0li4qBI3QwuN9Ih	2026-02-06 12:51:24.570038
38	7yNf9YjeO5JXUE3JEBgnYc	\N	80	Babydoll	98	3	USQX91802457	86	\N	https://open.spotify.com/track/7yNf9YjeO5JXUE3JEBgnYc	2026-02-06 12:52:30.402759
39	4rmVZajAF7PkrCagGPHbqa	\N	81	Sticky	243	7	USUG12204888	71	\N	https://open.spotify.com/track/4rmVZajAF7PkrCagGPHbqa	2026-02-06 13:13:01.297652
40	554qQSs9lpRVq6TlaaiIKT	\N	82	4 Raws	147	1	US38Y2546738	91	\N	https://open.spotify.com/track/554qQSs9lpRVq6TlaaiIKT	2026-02-06 13:13:06.013461
41	0bqNG1CGfhfE7iy6Fk5wG8	\N	83	Canão Foi Tão Bom	331	3	BXTM81600002	63	\N	https://open.spotify.com/track/0bqNG1CGfhfE7iy6Fk5wG8	2026-02-06 13:14:21.43656
\.


--
-- TOC entry 4459 (class 0 OID 22781)
-- Dependencies: 421
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."stats" ("user_id", "total_reviews", "total_ratings", "avg_rating", "total_songs_listened", "total_artists", "last_updated") FROM stdin;
1	1	1	4.25	1	1	2025-11-20 07:52:46.848663
4	0	0	0.00	0	0	2026-01-29 02:42:30.652785
5	0	0	0.00	0	0	2026-01-29 02:50:53.017513
6	0	0	0.00	0	0	2026-01-29 02:51:01.174476
7	0	0	0.00	0	0	2026-02-01 08:41:24.740692
8	0	0	0.00	0	0	2026-02-01 08:41:44.296575
9	0	0	0.00	0	0	2026-02-01 08:41:56.762929
10	0	0	0.00	0	0	2026-02-01 08:42:10.223668
11	0	0	0.00	0	0	2026-02-01 12:18:38.117913
12	0	0	0.00	0	0	2026-02-06 00:25:01.629319
13	1	1	3.00	0	0	2026-02-06 13:14:21.633576
3	11	11	4.36	0	0	2026-02-06 13:14:27.867694
\.


--
-- TOC entry 4462 (class 0 OID 22818)
-- Dependencies: 424
-- Data for Name: thread_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."thread_members" ("thread_id", "user_id", "joined_at", "last_read_at") FROM stdin;
\.


--
-- TOC entry 4461 (class 0 OID 22798)
-- Dependencies: 423
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."threads" ("thread_id", "is_group", "name", "created_by", "created_at", "last_message_text", "last_message_sender", "last_message_at") FROM stdin;
\.


--
-- TOC entry 4434 (class 0 OID 22499)
-- Dependencies: 396
-- Data for Name: user_blocks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."user_blocks" ("blocker_id", "blocked_id", "blocked_at") FROM stdin;
\.


--
-- TOC entry 4453 (class 0 OID 22723)
-- Dependencies: 415
-- Data for Name: user_pins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."user_pins" ("user_id", "item_type", "item_id", "pinned_at") FROM stdin;
\.


--
-- TOC entry 4432 (class 0 OID 22469)
-- Dependencies: 394
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."user_profiles" ("user_id", "first_name", "last_name", "bio", "location", "website", "banner_url", "last_updated") FROM stdin;
1	TEST	TEST	This is a TEST bio. :D	TEST CITY	https://example.com/TEST	https://placehold.co/600x200	2025-11-21 01:53:47.295145
4	t	\N		Vancouver	\N	\N	2026-01-29 04:34:03.296253
2	Display	\N	\N	\N	\N	\N	2026-02-01 08:08:49.190498
3	Travis	\N	Hshdjxjxdjkd	\N	\N	\N	2026-02-06 11:13:47.130227
13	12	\N	\N	\N	\N	\N	2026-02-06 12:41:06.037591
\.


--
-- TOC entry 4430 (class 0 OID 22441)
-- Dependencies: 392
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users" ("user_id", "email", "username", "display_name", "avatar_url", "joined_at", "oauth_provider", "oauth_sub") FROM stdin;
5	Johnny	johhny	johhny	\N	2026-01-29 02:50:53.017513	\N	\N
6	geek	geek	geek	\N	2026-01-29 02:51:01.174476	\N	\N
4	t	t	t	\N	2026-01-29 02:42:30.652785	\N	\N
2	j@gmail.com	j	Display	\N	2025-11-20 06:36:54.50124	\N	\N
7	test1	test1	test1	\N	2026-02-01 08:41:24.740692	\N	\N
8	test2	test2	test2	\N	2026-02-01 08:41:44.296575	\N	\N
9	test3	test3	test3	\N	2026-02-01 08:41:56.762929	\N	\N
10	test4	test4	test4	\N	2026-02-01 08:42:10.223668	\N	\N
1	TEST@gmail.com	TEST	TESTER	https://placehold.co/200x200	2025-11-20 06:34:20.960616	\N	\N
11	traviscleaver@icloud.com	Travis	Travis	\N	2026-02-01 12:18:38.117913	\N	\N
12	myfitnesspalnb@gmail.com	yo	yo	\N	2026-02-06 00:25:01.629319	\N	\N
3	123	traviscleaver	Travis	\N	2026-01-29 01:44:35.154874	\N	\N
13	12	12	12	\N	2026-02-06 12:02:46.942104	\N	\N
\.


--
-- TOC entry 4420 (class 0 OID 17112)
-- Dependencies: 378
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."schema_migrations" ("version", "inserted_at") FROM stdin;
20211116024918	2025-11-14 05:14:28
20211116045059	2025-11-14 05:14:31
20211116050929	2025-11-14 05:14:32
20211116051442	2025-11-14 05:14:34
20211116212300	2025-11-14 05:14:36
20211116213355	2025-11-14 05:14:38
20211116213934	2025-11-14 05:14:39
20211116214523	2025-11-14 05:14:42
20211122062447	2025-11-14 05:14:43
20211124070109	2025-11-14 05:14:45
20211202204204	2025-11-14 05:14:47
20211202204605	2025-11-14 05:14:48
20211210212804	2025-11-14 05:14:54
20211228014915	2025-11-14 05:14:55
20220107221237	2025-11-14 05:14:57
20220228202821	2025-11-14 05:14:58
20220312004840	2025-11-14 05:15:00
20220603231003	2025-11-14 05:15:03
20220603232444	2025-11-14 05:15:04
20220615214548	2025-11-14 05:15:06
20220712093339	2025-11-14 05:15:08
20220908172859	2025-11-14 05:15:10
20220916233421	2025-11-14 05:15:12
20230119133233	2025-11-14 05:15:13
20230128025114	2025-11-14 05:15:16
20230128025212	2025-11-14 05:15:17
20230227211149	2025-11-14 05:15:19
20230228184745	2025-11-14 05:15:21
20230308225145	2025-11-14 05:15:23
20230328144023	2025-11-14 05:15:27
20231018144023	2025-11-14 05:15:29
20231204144023	2025-11-14 05:15:32
20231204144024	2025-11-14 05:15:34
20231204144025	2025-11-14 05:15:36
20240108234812	2025-11-14 05:15:37
20240109165339	2025-11-14 05:15:39
20240227174441	2025-11-14 05:15:42
20240311171622	2025-11-14 05:15:44
20240321100241	2025-11-14 05:15:48
20240401105812	2025-11-14 05:15:52
20240418121054	2025-11-14 05:15:55
20240523004032	2025-11-14 05:16:01
20240618124746	2025-11-14 05:16:02
20240801235015	2025-11-14 05:16:04
20240805133720	2025-11-14 05:16:05
20240827160934	2025-11-14 05:16:07
20240919163303	2025-11-14 05:16:09
20240919163305	2025-11-14 05:16:11
20241019105805	2025-11-14 05:16:13
20241030150047	2025-11-14 05:16:19
20241108114728	2025-11-14 05:16:21
20241121104152	2025-11-14 05:16:23
20241130184212	2025-11-14 05:16:25
20241220035512	2025-11-14 05:16:26
20241220123912	2025-11-14 05:16:28
20241224161212	2025-11-14 05:16:30
20250107150512	2025-11-14 05:16:31
20250110162412	2025-11-14 05:16:33
20250123174212	2025-11-14 05:16:35
20250128220012	2025-11-14 05:16:36
20250506224012	2025-11-14 05:16:38
20250523164012	2025-11-14 05:16:39
20250714121412	2025-11-14 05:16:41
20250905041441	2025-11-14 05:16:43
20251103001201	2025-11-14 05:16:44
20251120212548	2026-02-06 10:27:22
20251120215549	2026-02-06 10:27:22
\.


--
-- TOC entry 4426 (class 0 OID 17289)
-- Dependencies: 385
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."subscription" ("id", "subscription_id", "entity", "filters", "claims", "created_at", "action_filter") FROM stdin;
\.


--
-- TOC entry 4403 (class 0 OID 16546)
-- Dependencies: 358
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- TOC entry 4424 (class 0 OID 17246)
-- Dependencies: 382
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- TOC entry 4427 (class 0 OID 22127)
-- Dependencies: 389
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4405 (class 0 OID 16588)
-- Dependencies: 360
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."migrations" ("id", "name", "hash", "executed_at") FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-11-14 05:14:25.87209
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-11-14 05:14:25.881547
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-11-14 05:14:25.889599
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-11-14 05:14:25.919107
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-11-14 05:14:25.972045
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-11-14 05:14:25.976826
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-11-14 05:14:25.981549
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-11-14 05:14:25.985961
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-11-14 05:14:25.990066
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-11-14 05:14:25.994477
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-11-14 05:14:26.000478
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-11-14 05:14:26.00513
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-11-14 05:14:26.012435
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-11-14 05:14:26.01707
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-11-14 05:14:26.021549
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-11-14 05:14:26.048399
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-11-14 05:14:26.052847
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-11-14 05:14:26.057234
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-11-14 05:14:26.062932
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-11-14 05:14:26.069853
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-11-14 05:14:26.074381
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-11-14 05:14:26.080462
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-11-14 05:14:26.095582
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-11-14 05:14:26.107204
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-11-14 05:14:26.111773
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-11-14 05:14:26.116694
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-11-14 05:14:26.121808
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-11-14 05:14:26.136241
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-11-14 05:14:27.141273
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-11-14 05:14:27.146382
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-11-14 05:14:27.152763
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-11-14 05:14:27.159521
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-11-14 05:14:27.166844
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-11-14 05:14:27.173983
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-11-14 05:14:27.175784
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-11-14 05:14:27.181327
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-11-14 05:14:27.185906
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-11-14 05:14:27.192135
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-11-14 05:14:27.196818
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-11-14 05:14:27.205147
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-11-14 05:14:27.209996
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-11-14 05:14:27.217606
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-11-14 05:14:27.223056
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-11-14 05:14:27.229248
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-11-19 09:52:24.203438
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-11-19 09:52:24.219567
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-11-19 09:52:24.277065
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-11-19 09:52:24.282103
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2025-11-19 09:52:24.286241
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-01-29 01:18:18.749223
\.


--
-- TOC entry 4404 (class 0 OID 16561)
-- Dependencies: 359
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") FROM stdin;
\.


--
-- TOC entry 4423 (class 0 OID 17202)
-- Dependencies: 381
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4421 (class 0 OID 17149)
-- Dependencies: 379
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- TOC entry 4422 (class 0 OID 17163)
-- Dependencies: 380
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- TOC entry 4428 (class 0 OID 22137)
-- Dependencies: 390
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 3793 (class 0 OID 16658)
-- Dependencies: 361
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4523 (class 0 OID 0)
-- Dependencies: 353
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- TOC entry 4524 (class 0 OID 0)
-- Dependencies: 419
-- Name: activities_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."activities_activity_id_seq"', 13, true);


--
-- TOC entry 4525 (class 0 OID 0)
-- Dependencies: 399
-- Name: albums_album_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."albums_album_id_seq"', 83, true);


--
-- TOC entry 4526 (class 0 OID 0)
-- Dependencies: 397
-- Name: artists_artist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."artists_artist_id_seq"', 86, true);


--
-- TOC entry 4527 (class 0 OID 0)
-- Dependencies: 410
-- Name: comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."comments_comment_id_seq"', 1, false);


--
-- TOC entry 4528 (class 0 OID 0)
-- Dependencies: 412
-- Name: diary_entries_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."diary_entries_entry_id_seq"', 1, true);


--
-- TOC entry 4529 (class 0 OID 0)
-- Dependencies: 425
-- Name: messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."messages_message_id_seq"', 1, false);


--
-- TOC entry 4530 (class 0 OID 0)
-- Dependencies: 417
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."notifications_notification_id_seq"', 1, false);


--
-- TOC entry 4531 (class 0 OID 0)
-- Dependencies: 404
-- Name: playlists_playlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."playlists_playlist_id_seq"', 1, true);


--
-- TOC entry 4532 (class 0 OID 0)
-- Dependencies: 407
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."reviews_review_id_seq"', 13, true);


--
-- TOC entry 4533 (class 0 OID 0)
-- Dependencies: 401
-- Name: songs_song_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."songs_song_id_seq"', 41, true);


--
-- TOC entry 4534 (class 0 OID 0)
-- Dependencies: 422
-- Name: threads_thread_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."threads_thread_id_seq"', 1, false);


--
-- TOC entry 4535 (class 0 OID 0)
-- Dependencies: 391
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_user_id_seq"', 13, true);


--
-- TOC entry 4536 (class 0 OID 0)
-- Dependencies: 384
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('"realtime"."subscription_id_seq"', 1, false);


--
-- TOC entry 4003 (class 2606 OID 16829)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");


--
-- TOC entry 3957 (class 2606 OID 16531)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4026 (class 2606 OID 16935)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3981 (class 2606 OID 16953)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3983 (class 2606 OID 16963)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");


--
-- TOC entry 3955 (class 2606 OID 16524)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4005 (class 2606 OID 16822)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");


--
-- TOC entry 4001 (class 2606 OID 16810)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3993 (class 2606 OID 17003)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");


--
-- TOC entry 3995 (class 2606 OID 16797)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4039 (class 2606 OID 17062)
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_code_key" UNIQUE ("authorization_code");


--
-- TOC entry 4041 (class 2606 OID 17060)
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_id_key" UNIQUE ("authorization_id");


--
-- TOC entry 4043 (class 2606 OID 17058)
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4153 (class 2606 OID 32075)
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_client_states"
    ADD CONSTRAINT "oauth_client_states_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4036 (class 2606 OID 17022)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_clients"
    ADD CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4047 (class 2606 OID 17084)
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4049 (class 2606 OID 17086)
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_client_unique" UNIQUE ("user_id", "client_id");


--
-- TOC entry 4030 (class 2606 OID 16988)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3949 (class 2606 OID 16514)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3952 (class 2606 OID 16740)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");


--
-- TOC entry 4015 (class 2606 OID 16869)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");


--
-- TOC entry 4017 (class 2606 OID 16867)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4022 (class 2606 OID 16883)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3960 (class 2606 OID 16537)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- TOC entry 3988 (class 2606 OID 16761)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4012 (class 2606 OID 16850)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4007 (class 2606 OID 16841)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3942 (class 2606 OID 16923)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");


--
-- TOC entry 3944 (class 2606 OID 16501)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4139 (class 2606 OID 22775)
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_pkey" PRIMARY KEY ("activity_id");


--
-- TOC entry 4101 (class 2606 OID 22542)
-- Name: albums albums_mbid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."albums"
    ADD CONSTRAINT "albums_mbid_key" UNIQUE ("mbid");


--
-- TOC entry 4103 (class 2606 OID 22538)
-- Name: albums albums_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."albums"
    ADD CONSTRAINT "albums_pkey" PRIMARY KEY ("album_id");


--
-- TOC entry 4105 (class 2606 OID 22540)
-- Name: albums albums_spotify_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."albums"
    ADD CONSTRAINT "albums_spotify_id_key" UNIQUE ("spotify_id");


--
-- TOC entry 4095 (class 2606 OID 22528)
-- Name: artists artists_mbid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."artists"
    ADD CONSTRAINT "artists_mbid_key" UNIQUE ("mbid");


--
-- TOC entry 4097 (class 2606 OID 22524)
-- Name: artists artists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."artists"
    ADD CONSTRAINT "artists_pkey" PRIMARY KEY ("artist_id");


--
-- TOC entry 4099 (class 2606 OID 22526)
-- Name: artists artists_spotify_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."artists"
    ADD CONSTRAINT "artists_spotify_id_key" UNIQUE ("spotify_id");


--
-- TOC entry 4086 (class 2606 OID 22463)
-- Name: auth_local auth_local_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_local"
    ADD CONSTRAINT "auth_local_pkey" PRIMARY KEY ("user_id");


--
-- TOC entry 4127 (class 2606 OID 22660)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("comment_id");


--
-- TOC entry 4129 (class 2606 OID 22696)
-- Name: diary_entries diary_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."diary_entries"
    ADD CONSTRAINT "diary_entries_pkey" PRIMARY KEY ("entry_id");


--
-- TOC entry 4131 (class 2606 OID 22717)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("user_id", "item_type", "item_id");


--
-- TOC entry 4091 (class 2606 OID 22487)
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id", "following_id");


--
-- TOC entry 4135 (class 2606 OID 22739)
-- Name: listen_later listen_later_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."listen_later"
    ADD CONSTRAINT "listen_later_pkey" PRIMARY KEY ("user_id", "song_id");


--
-- TOC entry 4150 (class 2606 OID 22862)
-- Name: message_reactions message_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."message_reactions"
    ADD CONSTRAINT "message_reactions_pkey" PRIMARY KEY ("message_id", "user_id");


--
-- TOC entry 4147 (class 2606 OID 22843)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id");


--
-- TOC entry 4137 (class 2606 OID 22760)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id");


--
-- TOC entry 4117 (class 2606 OID 22602)
-- Name: playlist_songs playlist_songs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."playlist_songs"
    ADD CONSTRAINT "playlist_songs_pkey" PRIMARY KEY ("playlist_id", "song_id");


--
-- TOC entry 4115 (class 2606 OID 22592)
-- Name: playlists playlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."playlists"
    ADD CONSTRAINT "playlists_pkey" PRIMARY KEY ("playlist_id");


--
-- TOC entry 4125 (class 2606 OID 22640)
-- Name: review_likes review_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."review_likes"
    ADD CONSTRAINT "review_likes_pkey" PRIMARY KEY ("review_id", "user_id");


--
-- TOC entry 4120 (class 2606 OID 22624)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id");


--
-- TOC entry 4113 (class 2606 OID 22571)
-- Name: song_artists song_artists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."song_artists"
    ADD CONSTRAINT "song_artists_pkey" PRIMARY KEY ("song_id", "artist_id");


--
-- TOC entry 4107 (class 2606 OID 22561)
-- Name: songs songs_mbid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."songs"
    ADD CONSTRAINT "songs_mbid_key" UNIQUE ("mbid");


--
-- TOC entry 4109 (class 2606 OID 22557)
-- Name: songs songs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."songs"
    ADD CONSTRAINT "songs_pkey" PRIMARY KEY ("song_id");


--
-- TOC entry 4111 (class 2606 OID 22559)
-- Name: songs songs_spotify_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."songs"
    ADD CONSTRAINT "songs_spotify_id_key" UNIQUE ("spotify_id");


--
-- TOC entry 4141 (class 2606 OID 22791)
-- Name: stats stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."stats"
    ADD CONSTRAINT "stats_pkey" PRIMARY KEY ("user_id");


--
-- TOC entry 4145 (class 2606 OID 22823)
-- Name: thread_members thread_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."thread_members"
    ADD CONSTRAINT "thread_members_pkey" PRIMARY KEY ("thread_id", "user_id");


--
-- TOC entry 4143 (class 2606 OID 22807)
-- Name: threads threads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_pkey" PRIMARY KEY ("thread_id");


--
-- TOC entry 4093 (class 2606 OID 22504)
-- Name: user_blocks user_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_blocks"
    ADD CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("blocker_id", "blocked_id");


--
-- TOC entry 4133 (class 2606 OID 22728)
-- Name: user_pins user_pins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_pins"
    ADD CONSTRAINT "user_pins_pkey" PRIMARY KEY ("user_id", "item_type", "item_id");


--
-- TOC entry 4088 (class 2606 OID 22476)
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id");


--
-- TOC entry 4077 (class 2606 OID 22451)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");


--
-- TOC entry 4081 (class 2606 OID 22449)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");


--
-- TOC entry 4083 (class 2606 OID 22453)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");


--
-- TOC entry 4070 (class 2606 OID 17448)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4066 (class 2606 OID 17297)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."subscription"
    ADD CONSTRAINT "pk_subscription" PRIMARY KEY ("id");


--
-- TOC entry 4052 (class 2606 OID 17116)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- TOC entry 4062 (class 2606 OID 22160)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets_analytics"
    ADD CONSTRAINT "buckets_analytics_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3963 (class 2606 OID 16554)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4072 (class 2606 OID 22136)
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets_vectors"
    ADD CONSTRAINT "buckets_vectors_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3973 (class 2606 OID 16595)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");


--
-- TOC entry 3975 (class 2606 OID 16593)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3971 (class 2606 OID 16571)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4060 (class 2606 OID 17211)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_pkey" PRIMARY KEY ("bucket_id", "level", "name");


--
-- TOC entry 4057 (class 2606 OID 17172)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4055 (class 2606 OID 17157)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4075 (class 2606 OID 22146)
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3958 (class 1259 OID 16532)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");


--
-- TOC entry 3932 (class 1259 OID 16750)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 3933 (class 1259 OID 16752)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 3934 (class 1259 OID 16753)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 3991 (class 1259 OID 16831)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");


--
-- TOC entry 4024 (class 1259 OID 16939)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);


--
-- TOC entry 3979 (class 1259 OID 16919)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");


--
-- TOC entry 4537 (class 0 OID 0)
-- Dependencies: 3979
-- Name: INDEX "identities_email_idx"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 3984 (class 1259 OID 16747)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");


--
-- TOC entry 4027 (class 1259 OID 16936)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");


--
-- TOC entry 4151 (class 1259 OID 32076)
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_oauth_client_states_created_at" ON "auth"."oauth_client_states" USING "btree" ("created_at");


--
-- TOC entry 4028 (class 1259 OID 16937)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");


--
-- TOC entry 3999 (class 1259 OID 16942)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);


--
-- TOC entry 3996 (class 1259 OID 16803)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");


--
-- TOC entry 3997 (class 1259 OID 16948)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");


--
-- TOC entry 4037 (class 1259 OID 17073)
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations" USING "btree" ("expires_at") WHERE ("status" = 'pending'::"auth"."oauth_authorization_status");


--
-- TOC entry 4034 (class 1259 OID 17026)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients" USING "btree" ("deleted_at");


--
-- TOC entry 4044 (class 1259 OID 17099)
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents" USING "btree" ("client_id") WHERE ("revoked_at" IS NULL);


--
-- TOC entry 4045 (class 1259 OID 17097)
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "client_id") WHERE ("revoked_at" IS NULL);


--
-- TOC entry 4050 (class 1259 OID 17098)
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "granted_at" DESC);


--
-- TOC entry 4031 (class 1259 OID 16995)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");


--
-- TOC entry 4032 (class 1259 OID 16994)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");


--
-- TOC entry 4033 (class 1259 OID 16996)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");


--
-- TOC entry 3935 (class 1259 OID 16754)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 3936 (class 1259 OID 16751)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 3945 (class 1259 OID 16515)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");


--
-- TOC entry 3946 (class 1259 OID 16516)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");


--
-- TOC entry 3947 (class 1259 OID 16746)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");


--
-- TOC entry 3950 (class 1259 OID 16833)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");


--
-- TOC entry 3953 (class 1259 OID 16938)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);


--
-- TOC entry 4018 (class 1259 OID 16875)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");


--
-- TOC entry 4019 (class 1259 OID 16940)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);


--
-- TOC entry 4020 (class 1259 OID 16890)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");


--
-- TOC entry 4023 (class 1259 OID 16889)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");


--
-- TOC entry 3985 (class 1259 OID 16941)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);


--
-- TOC entry 3986 (class 1259 OID 17111)
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions" USING "btree" ("oauth_client_id");


--
-- TOC entry 3989 (class 1259 OID 16832)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");


--
-- TOC entry 4010 (class 1259 OID 16857)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));


--
-- TOC entry 4013 (class 1259 OID 16856)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");


--
-- TOC entry 4008 (class 1259 OID 16842)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));


--
-- TOC entry 4009 (class 1259 OID 17004)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers" USING "btree" ("resource_id" "text_pattern_ops");


--
-- TOC entry 3998 (class 1259 OID 17001)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");


--
-- TOC entry 3990 (class 1259 OID 16830)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");


--
-- TOC entry 3937 (class 1259 OID 16910)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);


--
-- TOC entry 4538 (class 0 OID 0)
-- Dependencies: 3937
-- Name: INDEX "users_email_partial_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 3938 (class 1259 OID 16748)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));


--
-- TOC entry 3939 (class 1259 OID 16505)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");


--
-- TOC entry 3940 (class 1259 OID 16965)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");


--
-- TOC entry 4089 (class 1259 OID 22498)
-- Name: follows_following_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "follows_following_idx" ON "public"."follows" USING "btree" ("following_id");


--
-- TOC entry 4148 (class 1259 OID 22854)
-- Name: messages_thread_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "messages_thread_idx" ON "public"."messages" USING "btree" ("thread_id", "created_at" DESC);


--
-- TOC entry 4118 (class 1259 OID 41224)
-- Name: reviews_album_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "reviews_album_idx" ON "public"."reviews" USING "btree" ("album_id");


--
-- TOC entry 4121 (class 1259 OID 41223)
-- Name: reviews_song_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "reviews_song_idx" ON "public"."reviews" USING "btree" ("song_id");


--
-- TOC entry 4122 (class 1259 OID 41269)
-- Name: reviews_user_album_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "reviews_user_album_unique" ON "public"."reviews" USING "btree" ("user_id", "album_id") WHERE ("album_id" IS NOT NULL);


--
-- TOC entry 4123 (class 1259 OID 41268)
-- Name: reviews_user_song_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "reviews_user_song_unique" ON "public"."reviews" USING "btree" ("user_id", "song_id") WHERE ("song_id" IS NOT NULL);


--
-- TOC entry 4078 (class 1259 OID 22454)
-- Name: users_email_lower_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "users_email_lower_idx" ON "public"."users" USING "btree" ("lower"(("email")::"text"));


--
-- TOC entry 4079 (class 1259 OID 22456)
-- Name: users_oauth_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "users_oauth_unique" ON "public"."users" USING "btree" ("oauth_provider", "oauth_sub") WHERE (("oauth_provider" IS NOT NULL) AND ("oauth_sub" IS NOT NULL));


--
-- TOC entry 4084 (class 1259 OID 22455)
-- Name: users_username_lower_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "users_username_lower_idx" ON "public"."users" USING "btree" ("lower"(("username")::"text"));


--
-- TOC entry 4064 (class 1259 OID 17449)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "ix_realtime_subscription_entity" ON "realtime"."subscription" USING "btree" ("entity");


--
-- TOC entry 4068 (class 1259 OID 17450)
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_inserted_at_topic_index" ON ONLY "realtime"."messages" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4067 (class 1259 OID 41277)
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX "subscription_subscription_id_entity_filters_action_filter_key" ON "realtime"."subscription" USING "btree" ("subscription_id", "entity", "filters", "action_filter");


--
-- TOC entry 3961 (class 1259 OID 16560)
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");


--
-- TOC entry 3964 (class 1259 OID 16582)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");


--
-- TOC entry 4063 (class 1259 OID 22161)
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "buckets_analytics_unique_name_idx" ON "storage"."buckets_analytics" USING "btree" ("name") WHERE ("deleted_at" IS NULL);


--
-- TOC entry 4053 (class 1259 OID 17183)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");


--
-- TOC entry 3965 (class 1259 OID 17229)
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "idx_name_bucket_level_unique" ON "storage"."objects" USING "btree" ("name" COLLATE "C", "bucket_id", "level");


--
-- TOC entry 3966 (class 1259 OID 17148)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");


--
-- TOC entry 3967 (class 1259 OID 17231)
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_lower_name" ON "storage"."objects" USING "btree" (("path_tokens"["level"]), "lower"("name") "text_pattern_ops", "bucket_id", "level");


--
-- TOC entry 4058 (class 1259 OID 17232)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_prefixes_lower_name" ON "storage"."prefixes" USING "btree" ("bucket_id", "level", (("string_to_array"("name", '/'::"text"))["level"]), "lower"("name") "text_pattern_ops");


--
-- TOC entry 3968 (class 1259 OID 16583)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");


--
-- TOC entry 3969 (class 1259 OID 17230)
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "objects_bucket_id_level_idx" ON "storage"."objects" USING "btree" ("bucket_id", "level", "name" COLLATE "C");


--
-- TOC entry 4073 (class 1259 OID 22152)
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "vector_indexes_name_bucket_id_idx" ON "storage"."vector_indexes" USING "btree" ("name", "bucket_id");


--
-- TOC entry 4221 (class 2620 OID 17302)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER "tr_check_filters" BEFORE INSERT OR UPDATE ON "realtime"."subscription" FOR EACH ROW EXECUTE FUNCTION "realtime"."subscription_check_filters"();


--
-- TOC entry 4214 (class 2620 OID 17239)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "enforce_bucket_name_length_trigger" BEFORE INSERT OR UPDATE OF "name" ON "storage"."buckets" FOR EACH ROW EXECUTE FUNCTION "storage"."enforce_bucket_name_length"();


--
-- TOC entry 4215 (class 2620 OID 17269)
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_delete_delete_prefix" AFTER DELETE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- TOC entry 4216 (class 2620 OID 17225)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_insert_create_prefix" BEFORE INSERT ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."objects_insert_prefix_trigger"();


--
-- TOC entry 4217 (class 2620 OID 17268)
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_update_create_prefix" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW WHEN ((("new"."name" <> "old"."name") OR ("new"."bucket_id" <> "old"."bucket_id"))) EXECUTE FUNCTION "storage"."objects_update_prefix_trigger"();


--
-- TOC entry 4219 (class 2620 OID 17235)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_create_hierarchy" BEFORE INSERT ON "storage"."prefixes" FOR EACH ROW WHEN (("pg_trigger_depth"() < 1)) EXECUTE FUNCTION "storage"."prefixes_insert_trigger"();


--
-- TOC entry 4220 (class 2620 OID 17270)
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_delete_hierarchy" AFTER DELETE ON "storage"."prefixes" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- TOC entry 4218 (class 2620 OID 17136)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- TOC entry 4156 (class 2606 OID 16734)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4161 (class 2606 OID 16823)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- TOC entry 4160 (class 2606 OID 16811)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;


--
-- TOC entry 4159 (class 2606 OID 16798)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4167 (class 2606 OID 17063)
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- TOC entry 4168 (class 2606 OID 17068)
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4169 (class 2606 OID 17092)
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- TOC entry 4170 (class 2606 OID 17087)
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4166 (class 2606 OID 16989)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4154 (class 2606 OID 16767)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- TOC entry 4163 (class 2606 OID 16870)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- TOC entry 4164 (class 2606 OID 16943)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;


--
-- TOC entry 4165 (class 2606 OID 16884)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- TOC entry 4157 (class 2606 OID 17106)
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- TOC entry 4158 (class 2606 OID 16762)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4162 (class 2606 OID 16851)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- TOC entry 4204 (class 2606 OID 22776)
-- Name: activities activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4182 (class 2606 OID 22543)
-- Name: albums albums_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."albums"
    ADD CONSTRAINT "albums_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("artist_id") ON DELETE CASCADE;


--
-- TOC entry 4176 (class 2606 OID 22464)
-- Name: auth_local auth_local_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_local"
    ADD CONSTRAINT "auth_local_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4194 (class 2606 OID 22661)
-- Name: comments comments_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("review_id") ON DELETE CASCADE;


--
-- TOC entry 4195 (class 2606 OID 22666)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4196 (class 2606 OID 22707)
-- Name: diary_entries diary_entries_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."diary_entries"
    ADD CONSTRAINT "diary_entries_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("review_id") ON DELETE SET NULL;


--
-- TOC entry 4197 (class 2606 OID 22702)
-- Name: diary_entries diary_entries_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."diary_entries"
    ADD CONSTRAINT "diary_entries_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("song_id") ON DELETE CASCADE;


--
-- TOC entry 4198 (class 2606 OID 22697)
-- Name: diary_entries diary_entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."diary_entries"
    ADD CONSTRAINT "diary_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4199 (class 2606 OID 22718)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4178 (class 2606 OID 22488)
-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4179 (class 2606 OID 22493)
-- Name: follows follows_following_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4201 (class 2606 OID 22745)
-- Name: listen_later listen_later_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."listen_later"
    ADD CONSTRAINT "listen_later_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("song_id") ON DELETE CASCADE;


--
-- TOC entry 4202 (class 2606 OID 22740)
-- Name: listen_later listen_later_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."listen_later"
    ADD CONSTRAINT "listen_later_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4212 (class 2606 OID 22863)
-- Name: message_reactions message_reactions_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."message_reactions"
    ADD CONSTRAINT "message_reactions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("message_id") ON DELETE CASCADE;


--
-- TOC entry 4213 (class 2606 OID 22868)
-- Name: message_reactions message_reactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."message_reactions"
    ADD CONSTRAINT "message_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4210 (class 2606 OID 22849)
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4211 (class 2606 OID 22844)
-- Name: messages messages_thread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE CASCADE;


--
-- TOC entry 4203 (class 2606 OID 22761)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4187 (class 2606 OID 22603)
-- Name: playlist_songs playlist_songs_playlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."playlist_songs"
    ADD CONSTRAINT "playlist_songs_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("playlist_id") ON DELETE CASCADE;


--
-- TOC entry 4188 (class 2606 OID 22608)
-- Name: playlist_songs playlist_songs_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."playlist_songs"
    ADD CONSTRAINT "playlist_songs_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("song_id") ON DELETE CASCADE;


--
-- TOC entry 4186 (class 2606 OID 22593)
-- Name: playlists playlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."playlists"
    ADD CONSTRAINT "playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4192 (class 2606 OID 22641)
-- Name: review_likes review_likes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."review_likes"
    ADD CONSTRAINT "review_likes_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("review_id") ON DELETE CASCADE;


--
-- TOC entry 4193 (class 2606 OID 22646)
-- Name: review_likes review_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."review_likes"
    ADD CONSTRAINT "review_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4189 (class 2606 OID 41261)
-- Name: reviews reviews_album_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_album_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("album_id") ON DELETE CASCADE;


--
-- TOC entry 4190 (class 2606 OID 22630)
-- Name: reviews reviews_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("song_id") ON DELETE CASCADE;


--
-- TOC entry 4191 (class 2606 OID 22625)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4184 (class 2606 OID 22577)
-- Name: song_artists song_artists_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."song_artists"
    ADD CONSTRAINT "song_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("artist_id") ON DELETE CASCADE;


--
-- TOC entry 4185 (class 2606 OID 22572)
-- Name: song_artists song_artists_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."song_artists"
    ADD CONSTRAINT "song_artists_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("song_id") ON DELETE CASCADE;


--
-- TOC entry 4183 (class 2606 OID 22562)
-- Name: songs songs_album_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."songs"
    ADD CONSTRAINT "songs_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("album_id") ON DELETE CASCADE;


--
-- TOC entry 4205 (class 2606 OID 22792)
-- Name: stats stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."stats"
    ADD CONSTRAINT "stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4208 (class 2606 OID 22824)
-- Name: thread_members thread_members_thread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."thread_members"
    ADD CONSTRAINT "thread_members_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE CASCADE;


--
-- TOC entry 4209 (class 2606 OID 22829)
-- Name: thread_members thread_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."thread_members"
    ADD CONSTRAINT "thread_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4206 (class 2606 OID 22808)
-- Name: threads threads_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_id");


--
-- TOC entry 4207 (class 2606 OID 22813)
-- Name: threads threads_last_message_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_last_message_sender_fkey" FOREIGN KEY ("last_message_sender") REFERENCES "public"."users"("user_id");


--
-- TOC entry 4180 (class 2606 OID 22510)
-- Name: user_blocks user_blocks_blocked_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_blocks"
    ADD CONSTRAINT "user_blocks_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4181 (class 2606 OID 22505)
-- Name: user_blocks user_blocks_blocker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_blocks"
    ADD CONSTRAINT "user_blocks_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4200 (class 2606 OID 22729)
-- Name: user_pins user_pins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_pins"
    ADD CONSTRAINT "user_pins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4177 (class 2606 OID 22477)
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- TOC entry 4155 (class 2606 OID 16572)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4174 (class 2606 OID 17212)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4171 (class 2606 OID 17158)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4172 (class 2606 OID 17178)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4173 (class 2606 OID 17173)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;


--
-- TOC entry 4175 (class 2606 OID 22147)
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets_vectors"("id");


--
-- TOC entry 4373 (class 0 OID 16525)
-- Dependencies: 356
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4387 (class 0 OID 16929)
-- Dependencies: 373
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4378 (class 0 OID 16727)
-- Dependencies: 364
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4372 (class 0 OID 16518)
-- Dependencies: 355
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4382 (class 0 OID 16816)
-- Dependencies: 368
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4381 (class 0 OID 16804)
-- Dependencies: 367
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4380 (class 0 OID 16791)
-- Dependencies: 366
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4388 (class 0 OID 16979)
-- Dependencies: 374
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4371 (class 0 OID 16507)
-- Dependencies: 354
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4385 (class 0 OID 16858)
-- Dependencies: 371
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4386 (class 0 OID 16876)
-- Dependencies: 372
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4374 (class 0 OID 16533)
-- Dependencies: 357
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4379 (class 0 OID 16757)
-- Dependencies: 365
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4384 (class 0 OID 16843)
-- Dependencies: 370
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4383 (class 0 OID 16834)
-- Dependencies: 369
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4370 (class 0 OID 16495)
-- Dependencies: 352
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4393 (class 0 OID 17434)
-- Dependencies: 388
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE "realtime"."messages" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4375 (class 0 OID 16546)
-- Dependencies: 358
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4392 (class 0 OID 17246)
-- Dependencies: 382
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets_analytics" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4394 (class 0 OID 22127)
-- Dependencies: 389
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets_vectors" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4377 (class 0 OID 16588)
-- Dependencies: 360
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4376 (class 0 OID 16561)
-- Dependencies: 359
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4391 (class 0 OID 17202)
-- Dependencies: 381
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."prefixes" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4389 (class 0 OID 17149)
-- Dependencies: 379
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4390 (class 0 OID 17163)
-- Dependencies: 380
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4395 (class 0 OID 22137)
-- Dependencies: 390
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."vector_indexes" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4396 (class 6104 OID 16426)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION "supabase_realtime" WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 3786 (class 3466 OID 16621)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_graphql_placeholder" ON "sql_drop"
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION "extensions"."set_graphql_placeholder"();


--
-- TOC entry 3791 (class 3466 OID 16700)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_cron_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_cron_access"();


--
-- TOC entry 3785 (class 3466 OID 16619)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_graphql_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION "extensions"."grant_pg_graphql_access"();


--
-- TOC entry 3792 (class 3466 OID 16703)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_net_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_net_access"();


--
-- TOC entry 3787 (class 3466 OID 16622)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_ddl_watch" ON "ddl_command_end"
   EXECUTE FUNCTION "extensions"."pgrst_ddl_watch"();


--
-- TOC entry 3788 (class 3466 OID 16623)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_drop_watch" ON "sql_drop"
   EXECUTE FUNCTION "extensions"."pgrst_drop_watch"();


-- Completed on 2026-02-06 23:03:57 PST

--
-- PostgreSQL database dump complete
--

