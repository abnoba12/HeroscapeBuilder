PGDMP                      |           postgres    15.6    16.4    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    5    postgres    DATABASE     t   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE postgres;
                postgres    false            �           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    4239            �           0    0    DATABASE postgres    ACL     2   GRANT ALL ON DATABASE postgres TO dashboard_user;
                   postgres    false    4239            �           0    0    postgres    DATABASE PROPERTIES     �   ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'JXapyTtNAJKJdQnm30Qrew2gWxjDDaQzsXy5lSpsk/LCZ1ZUQSd2DxURYB92G+MHuXnA1HYR/qLYh0Ylot1hKw==';
ALTER DATABASE postgres SET "app.settings.jwt_exp" TO '3600';
                     postgres    false                        2615    16488    auth    SCHEMA        CREATE SCHEMA auth;
    DROP SCHEMA auth;
                supabase_admin    false            �           0    0    SCHEMA auth    ACL        GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT ALL ON SCHEMA auth TO postgres;
                   supabase_admin    false    22                        2615    16387 
   extensions    SCHEMA        CREATE SCHEMA extensions;
    DROP SCHEMA extensions;
                postgres    false            �           0    0    SCHEMA extensions    ACL     �   GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;
                   postgres    false    20            !            2615    16618    graphql    SCHEMA        CREATE SCHEMA graphql;
    DROP SCHEMA graphql;
                supabase_admin    false                         2615    16607    graphql_public    SCHEMA        CREATE SCHEMA graphql_public;
    DROP SCHEMA graphql_public;
                supabase_admin    false                        2615    16385 	   pgbouncer    SCHEMA        CREATE SCHEMA pgbouncer;
    DROP SCHEMA pgbouncer;
             	   pgbouncer    false                        2615    16645    pgsodium    SCHEMA        CREATE SCHEMA pgsodium;
    DROP SCHEMA pgsodium;
                supabase_admin    false                        3079    16646    pgsodium 	   EXTENSION     >   CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;
    DROP EXTENSION pgsodium;
                   false    27            �           0    0    EXTENSION pgsodium    COMMENT     \   COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';
                        false    6            �           0    0    SCHEMA public    ACL     �   GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
                   pg_database_owner    false    15                        2615    16599    realtime    SCHEMA        CREATE SCHEMA realtime;
    DROP SCHEMA realtime;
                supabase_admin    false            �           0    0    SCHEMA realtime    ACL     �   GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;
                   supabase_admin    false    16                        2615    16536    storage    SCHEMA        CREATE SCHEMA storage;
    DROP SCHEMA storage;
                supabase_admin    false            �           0    0    SCHEMA storage    ACL       GRANT ALL ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;
                   supabase_admin    false    21                        2615    16949    vault    SCHEMA        CREATE SCHEMA vault;
    DROP SCHEMA vault;
                supabase_admin    false                        3079    16982 
   pg_graphql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;
    DROP EXTENSION pg_graphql;
                   false    33            �           0    0    EXTENSION pg_graphql    COMMENT     B   COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';
                        false    8                        3079    16388    pg_stat_statements 	   EXTENSION     J   CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;
 #   DROP EXTENSION pg_stat_statements;
                   false    20            �           0    0    EXTENSION pg_stat_statements    COMMENT     u   COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';
                        false    5                        3079    16434    pgcrypto 	   EXTENSION     @   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
    DROP EXTENSION pgcrypto;
                   false    20            �           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                        false    3                        3079    16471    pgjwt 	   EXTENSION     =   CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;
    DROP EXTENSION pgjwt;
                   false    3    20            �           0    0    EXTENSION pgjwt    COMMENT     C   COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';
                        false    2                        3079    16950    supabase_vault 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;
    DROP EXTENSION supabase_vault;
                   false    6    30            �           0    0    EXTENSION supabase_vault    COMMENT     C   COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';
                        false    7                        3079    16423 	   uuid-ossp 	   EXTENSION     C   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
    DROP EXTENSION "uuid-ossp";
                   false    20            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    4            &           1247    28668 	   aal_level    TYPE     K   CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);
    DROP TYPE auth.aal_level;
       auth          supabase_auth_admin    false    22            >           1247    28809    code_challenge_method    TYPE     L   CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);
 &   DROP TYPE auth.code_challenge_method;
       auth          supabase_auth_admin    false    22            #           1247    28662    factor_status    TYPE     M   CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);
    DROP TYPE auth.factor_status;
       auth          supabase_auth_admin    false    22                        1247    28656    factor_type    TYPE     R   CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);
    DROP TYPE auth.factor_type;
       auth          supabase_auth_admin    false    22            D           1247    28851    one_time_token_type    TYPE     �   CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);
 $   DROP TYPE auth.one_time_token_type;
       auth          supabase_auth_admin    false    22            \           1247    29022    action    TYPE     o   CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);
    DROP TYPE realtime.action;
       realtime          supabase_admin    false    16            S           1247    28983    equality_op    TYPE     v   CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);
     DROP TYPE realtime.equality_op;
       realtime          supabase_admin    false    16            V           1247    28997    user_defined_filter    TYPE     j   CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);
 (   DROP TYPE realtime.user_defined_filter;
       realtime          supabase_admin    false    16    1363            b           1247    29064 
   wal_column    TYPE     �   CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);
    DROP TYPE realtime.wal_column;
       realtime          supabase_admin    false    16            _           1247    29035    wal_rls    TYPE     s   CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);
    DROP TYPE realtime.wal_rls;
       realtime          supabase_admin    false    16            v           1255    16534    email()    FUNCTION       CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;
    DROP FUNCTION auth.email();
       auth          supabase_auth_admin    false    22            �           0    0    FUNCTION email()    COMMENT     X   COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';
          auth          supabase_auth_admin    false    374            �           0    0    FUNCTION email()    ACL     6   GRANT ALL ON FUNCTION auth.email() TO dashboard_user;
          auth          supabase_auth_admin    false    374            ?           1255    28638    jwt()    FUNCTION     �   CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;
    DROP FUNCTION auth.jwt();
       auth          supabase_auth_admin    false    22            �           0    0    FUNCTION jwt()    ACL     b   GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;
          auth          supabase_auth_admin    false    575            u           1255    16533    role()    FUNCTION        CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;
    DROP FUNCTION auth.role();
       auth          supabase_auth_admin    false    22            �           0    0    FUNCTION role()    COMMENT     V   COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';
          auth          supabase_auth_admin    false    373            �           0    0    FUNCTION role()    ACL     5   GRANT ALL ON FUNCTION auth.role() TO dashboard_user;
          auth          supabase_auth_admin    false    373            t           1255    16532    uid()    FUNCTION     �   CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;
    DROP FUNCTION auth.uid();
       auth          supabase_auth_admin    false    22            �           0    0    FUNCTION uid()    COMMENT     T   COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';
          auth          supabase_auth_admin    false    372            �           0    0    FUNCTION uid()    ACL     4   GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;
          auth          supabase_auth_admin    false    372            �           0    0 D   FUNCTION algorithm_sign(signables text, secret text, algorithm text)    ACL     Y  REVOKE ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;
       
   extensions          postgres    false    430            �           0    0    FUNCTION armor(bytea)    ACL     �   REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;
       
   extensions          postgres    false    424            �           0    0 %   FUNCTION armor(bytea, text[], text[])    ACL     �   REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;
       
   extensions          postgres    false    425            �           0    0    FUNCTION crypt(text, text)    ACL     �   REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;
       
   extensions          postgres    false    557            �           0    0    FUNCTION dearmor(text)    ACL     �   REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;
       
   extensions          postgres    false    426            �           0    0 $   FUNCTION decrypt(bytea, bytea, text)    ACL     �   REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;
       
   extensions          postgres    false    561            �           0    0 .   FUNCTION decrypt_iv(bytea, bytea, bytea, text)    ACL       REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
       
   extensions          postgres    false    563            �           0    0    FUNCTION digest(bytea, text)    ACL     �   REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;
       
   extensions          postgres    false    554            �           0    0    FUNCTION digest(text, text)    ACL     �   REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;
       
   extensions          postgres    false    553            �           0    0 $   FUNCTION encrypt(bytea, bytea, text)    ACL     �   REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;
       
   extensions          postgres    false    560            �           0    0 .   FUNCTION encrypt_iv(bytea, bytea, bytea, text)    ACL       REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
       
   extensions          postgres    false    562            �           0    0 "   FUNCTION gen_random_bytes(integer)    ACL     �   REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;
       
   extensions          postgres    false    564            �           0    0    FUNCTION gen_random_uuid()    ACL     �   REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;
       
   extensions          postgres    false    565            �           0    0    FUNCTION gen_salt(text)    ACL     �   REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;
       
   extensions          postgres    false    558            �           0    0     FUNCTION gen_salt(text, integer)    ACL     �   REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;
       
   extensions          postgres    false    559            >           1255    16591    grant_pg_cron_access()    FUNCTION     �  CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
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
 1   DROP FUNCTION extensions.grant_pg_cron_access();
    
   extensions          postgres    false    20            �           0    0    FUNCTION grant_pg_cron_access()    COMMENT     U   COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';
       
   extensions          postgres    false    574            �           0    0    FUNCTION grant_pg_cron_access()    ACL     �   REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;
       
   extensions          postgres    false    574            �           1255    16612    grant_pg_graphql_access()    FUNCTION     i	  CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
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
 4   DROP FUNCTION extensions.grant_pg_graphql_access();
    
   extensions          supabase_admin    false    20            �           0    0 "   FUNCTION grant_pg_graphql_access()    COMMENT     [   COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';
       
   extensions          supabase_admin    false    385            �           0    0 "   FUNCTION grant_pg_graphql_access()    ACL     Z   GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;
       
   extensions          supabase_admin    false    385            6           1255    16593    grant_pg_net_access()    FUNCTION     �  CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
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

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;
 0   DROP FUNCTION extensions.grant_pg_net_access();
    
   extensions          postgres    false    20            �           0    0    FUNCTION grant_pg_net_access()    COMMENT     S   COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';
       
   extensions          postgres    false    566            �           0    0    FUNCTION grant_pg_net_access()    ACL     �   REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;
       
   extensions          postgres    false    566            �           0    0 !   FUNCTION hmac(bytea, bytea, text)    ACL     �   REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;
       
   extensions          postgres    false    556            �           0    0    FUNCTION hmac(text, text, text)    ACL     �   REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;
       
   extensions          postgres    false    555            �           0    0 U  FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision)    ACL     �  REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO dashboard_user;
       
   extensions          postgres    false    368            �           0    0 ^   FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone)    ACL     �  REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;
       
   extensions          postgres    false    367            �           0    0 G   FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint)    ACL     b  REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;
       
   extensions          postgres    false    366            �           0    0 >   FUNCTION pgp_armor_headers(text, OUT key text, OUT value text)    ACL     G  REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;
       
   extensions          postgres    false    427            �           0    0    FUNCTION pgp_key_id(bytea)    ACL     �   REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;
       
   extensions          postgres    false    423            �           0    0 &   FUNCTION pgp_pub_decrypt(bytea, bytea)    ACL     �   REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;
       
   extensions          postgres    false    416            �           0    0 ,   FUNCTION pgp_pub_decrypt(bytea, bytea, text)    ACL       REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;
       
   extensions          postgres    false    418            �           0    0 2   FUNCTION pgp_pub_decrypt(bytea, bytea, text, text)    ACL     #  REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;
       
   extensions          postgres    false    421            �           0    0 ,   FUNCTION pgp_pub_decrypt_bytea(bytea, bytea)    ACL       REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;
       
   extensions          postgres    false    417            �           0    0 2   FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text)    ACL     #  REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;
       
   extensions          postgres    false    420            �           0    0 8   FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text)    ACL     5  REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;
       
   extensions          postgres    false    422            �           0    0 %   FUNCTION pgp_pub_encrypt(text, bytea)    ACL     �   REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;
       
   extensions          postgres    false    381            �           0    0 +   FUNCTION pgp_pub_encrypt(text, bytea, text)    ACL       REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;
       
   extensions          postgres    false    412            �           0    0 ,   FUNCTION pgp_pub_encrypt_bytea(bytea, bytea)    ACL       REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;
       
   extensions          postgres    false    411            �           0    0 2   FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text)    ACL     #  REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;
       
   extensions          postgres    false    415            �           0    0 %   FUNCTION pgp_sym_decrypt(bytea, text)    ACL     �   REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;
       
   extensions          postgres    false    546            �           0    0 +   FUNCTION pgp_sym_decrypt(bytea, text, text)    ACL       REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;
       
   extensions          postgres    false    542            �           0    0 +   FUNCTION pgp_sym_decrypt_bytea(bytea, text)    ACL       REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;
       
   extensions          postgres    false    547            �           0    0 1   FUNCTION pgp_sym_decrypt_bytea(bytea, text, text)    ACL        REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;
       
   extensions          postgres    false    543            �           0    0 $   FUNCTION pgp_sym_encrypt(text, text)    ACL     �   REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;
       
   extensions          postgres    false    410            �           0    0 *   FUNCTION pgp_sym_encrypt(text, text, text)    ACL       REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;
       
   extensions          postgres    false    544            �           0    0 +   FUNCTION pgp_sym_encrypt_bytea(bytea, text)    ACL       REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;
       
   extensions          postgres    false    380            �           0    0 1   FUNCTION pgp_sym_encrypt_bytea(bytea, text, text)    ACL        REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;
       
   extensions          postgres    false    545            ~           1255    16603    pgrst_ddl_watch()    FUNCTION     >  CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
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
 ,   DROP FUNCTION extensions.pgrst_ddl_watch();
    
   extensions          supabase_admin    false    20            �           0    0    FUNCTION pgrst_ddl_watch()    ACL     R   GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;
       
   extensions          supabase_admin    false    382                       1255    16604    pgrst_drop_watch()    FUNCTION       CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
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
 -   DROP FUNCTION extensions.pgrst_drop_watch();
    
   extensions          supabase_admin    false    20            �           0    0    FUNCTION pgrst_drop_watch()    ACL     S   GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;
       
   extensions          supabase_admin    false    383            7           1255    16614    set_graphql_placeholder()    FUNCTION     r  CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
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
 4   DROP FUNCTION extensions.set_graphql_placeholder();
    
   extensions          supabase_admin    false    20            �           0    0 "   FUNCTION set_graphql_placeholder()    COMMENT     |   COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';
       
   extensions          supabase_admin    false    567            �           0    0 "   FUNCTION set_graphql_placeholder()    ACL     Z   GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;
       
   extensions          supabase_admin    false    567            �           0    0 8   FUNCTION sign(payload json, secret text, algorithm text)    ACL     5  REVOKE ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;
       
   extensions          postgres    false    369            �           0    0 "   FUNCTION try_cast_double(inp text)    ACL     �   REVOKE ALL ON FUNCTION extensions.try_cast_double(inp text) FROM postgres;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;
       
   extensions          postgres    false    370            �           0    0    FUNCTION url_decode(data text)    ACL     �   REVOKE ALL ON FUNCTION extensions.url_decode(data text) FROM postgres;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;
       
   extensions          postgres    false    429            �           0    0    FUNCTION url_encode(data bytea)    ACL     �   REVOKE ALL ON FUNCTION extensions.url_encode(data bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;
       
   extensions          postgres    false    428            �           0    0    FUNCTION uuid_generate_v1()    ACL     �   REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;
       
   extensions          postgres    false    548            �           0    0    FUNCTION uuid_generate_v1mc()    ACL     �   REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;
       
   extensions          postgres    false    549            �           0    0 4   FUNCTION uuid_generate_v3(namespace uuid, name text)    ACL     )  REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;
       
   extensions          postgres    false    550            �           0    0    FUNCTION uuid_generate_v4()    ACL     �   REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;
       
   extensions          postgres    false    551            �           0    0 4   FUNCTION uuid_generate_v5(namespace uuid, name text)    ACL     )  REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;
       
   extensions          postgres    false    552            �           0    0    FUNCTION uuid_nil()    ACL     �   REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;
       
   extensions          postgres    false    375            �           0    0    FUNCTION uuid_ns_dns()    ACL     �   REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;
       
   extensions          postgres    false    376            �           0    0    FUNCTION uuid_ns_oid()    ACL     �   REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;
       
   extensions          postgres    false    378            �           0    0    FUNCTION uuid_ns_url()    ACL     �   REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;
       
   extensions          postgres    false    377            �           0    0    FUNCTION uuid_ns_x500()    ACL     �   REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;
       
   extensions          postgres    false    379            �           0    0 8   FUNCTION verify(token text, secret text, algorithm text)    ACL     5  REVOKE ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;
       
   extensions          postgres    false    371            �           0    0 )   FUNCTION comment_directive(comment_ text)    ACL     5  GRANT ALL ON FUNCTION graphql.comment_directive(comment_ text) TO postgres;
GRANT ALL ON FUNCTION graphql.comment_directive(comment_ text) TO anon;
GRANT ALL ON FUNCTION graphql.comment_directive(comment_ text) TO authenticated;
GRANT ALL ON FUNCTION graphql.comment_directive(comment_ text) TO service_role;
          graphql          supabase_admin    false    571            �           0    0     FUNCTION exception(message text)    ACL       GRANT ALL ON FUNCTION graphql.exception(message text) TO postgres;
GRANT ALL ON FUNCTION graphql.exception(message text) TO anon;
GRANT ALL ON FUNCTION graphql.exception(message text) TO authenticated;
GRANT ALL ON FUNCTION graphql.exception(message text) TO service_role;
          graphql          supabase_admin    false    570            �           0    0    FUNCTION get_schema_version()    ACL       GRANT ALL ON FUNCTION graphql.get_schema_version() TO postgres;
GRANT ALL ON FUNCTION graphql.get_schema_version() TO anon;
GRANT ALL ON FUNCTION graphql.get_schema_version() TO authenticated;
GRANT ALL ON FUNCTION graphql.get_schema_version() TO service_role;
          graphql          supabase_admin    false    573            �           0    0 #   FUNCTION increment_schema_version()    ACL       GRANT ALL ON FUNCTION graphql.increment_schema_version() TO postgres;
GRANT ALL ON FUNCTION graphql.increment_schema_version() TO anon;
GRANT ALL ON FUNCTION graphql.increment_schema_version() TO authenticated;
GRANT ALL ON FUNCTION graphql.increment_schema_version() TO service_role;
          graphql          supabase_admin    false    572            �           0    0 U   FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb)    ACL       GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;
          graphql_public          supabase_admin    false    431            �           0    0    FUNCTION lo_export(oid, text)    ACL     �   REVOKE ALL ON FUNCTION pg_catalog.lo_export(oid, text) FROM postgres;
GRANT ALL ON FUNCTION pg_catalog.lo_export(oid, text) TO supabase_admin;
       
   pg_catalog          supabase_admin    false    351            �           0    0    FUNCTION lo_import(text)    ACL     �   REVOKE ALL ON FUNCTION pg_catalog.lo_import(text) FROM postgres;
GRANT ALL ON FUNCTION pg_catalog.lo_import(text) TO supabase_admin;
       
   pg_catalog          supabase_admin    false    353            �           0    0    FUNCTION lo_import(text, oid)    ACL     �   REVOKE ALL ON FUNCTION pg_catalog.lo_import(text, oid) FROM postgres;
GRANT ALL ON FUNCTION pg_catalog.lo_import(text, oid) TO supabase_admin;
       
   pg_catalog          supabase_admin    false    354            `           1255    16386    get_auth(text)    FUNCTION     J  CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;
 2   DROP FUNCTION pgbouncer.get_auth(p_usename text);
    	   pgbouncer          postgres    false    14            �           0    0 !   FUNCTION get_auth(p_usename text)    ACL     �   REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
       	   pgbouncer          postgres    false    352            �           0    0 ]   FUNCTION crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea)    ACL     �   GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;
          pgsodium          pgsodium_keymaker    false    536            �           0    0 ]   FUNCTION crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea)    ACL     �   GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;
          pgsodium          pgsodium_keymaker    false    537            �           0    0 !   FUNCTION crypto_aead_det_keygen()    ACL     I   GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_keygen() TO service_role;
          pgsodium          supabase_admin    false    538            O           1255    29057    apply_rls(jsonb, integer)    FUNCTION     �(  CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
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
        subs.entity = entity_;

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
 G   DROP FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer);
       realtime          supabase_admin    false    1375    16            �           0    0 7   FUNCTION apply_rls(wal jsonb, max_record_bytes integer)    ACL     <  GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;
          realtime          supabase_admin    false    591            J           1255    29069 C   build_prepared_statement_sql(text, regclass, realtime.wal_column[])    FUNCTION     �  CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
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
 �   DROP FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
       realtime          supabase_admin    false    1378    16            �           0    0 s   FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[])    ACL     �  GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;
          realtime          supabase_admin    false    586            L           1255    29019    cast(text, regtype)    FUNCTION       CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;
 8   DROP FUNCTION realtime."cast"(val text, type_ regtype);
       realtime          supabase_admin    false    16            �           0    0 (   FUNCTION "cast"(val text, type_ regtype)    ACL     �  GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;
          realtime          supabase_admin    false    588            R           1255    29014 <   check_equality_op(realtime.equality_op, regtype, text, text)    FUNCTION     U  CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
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
 j   DROP FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
       realtime          supabase_admin    false    1363    16            �           0    0 Z   FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text)    ACL       GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;
          realtime          supabase_admin    false    594            N           1255    29065 Q   is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[])    FUNCTION     �  CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
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
 z   DROP FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
       realtime          supabase_admin    false    1366    1378    16            �           0    0 j   FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[])    ACL     n  GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;
          realtime          supabase_admin    false    590            Q           1255    29076 *   list_changes(name, name, integer, integer)    FUNCTION     �  CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
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
 v   DROP FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
       realtime          supabase_admin    false    16    1375            �           0    0 f   FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer)    ACL     V  GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;
          realtime          supabase_admin    false    593            K           1255    29013    quote_wal2json(regclass)    FUNCTION     �  CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
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
 8   DROP FUNCTION realtime.quote_wal2json(entity regclass);
       realtime          supabase_admin    false    16            �           0    0 (   FUNCTION quote_wal2json(entity regclass)    ACL     �  GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;
          realtime          supabase_admin    false    587            S           1255    29011    subscription_check_filters()    FUNCTION     <
  CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
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
 5   DROP FUNCTION realtime.subscription_check_filters();
       realtime          supabase_admin    false    16            �           0    0 %   FUNCTION subscription_check_filters()    ACL     �  GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;
          realtime          supabase_admin    false    595            M           1255    29046    to_regrole(text)    FUNCTION     �   CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;
 3   DROP FUNCTION realtime.to_regrole(role_name text);
       realtime          supabase_admin    false    16            �           0    0 #   FUNCTION to_regrole(role_name text)    ACL     �  GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;
          realtime          supabase_admin    false    589            P           1255    29128    topic()    FUNCTION     �   CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;
     DROP FUNCTION realtime.topic();
       realtime          supabase_realtime_admin    false    16            �           0    0    FUNCTION topic()    ACL     n   GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;
          realtime          supabase_realtime_admin    false    592            E           1255    28916 *   can_insert_object(text, text, uuid, jsonb)    FUNCTION     �  CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;
 _   DROP FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
       storage          supabase_storage_admin    false    21            B           1255    28890    extension(text)    FUNCTION     Z  CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;
 ,   DROP FUNCTION storage.extension(name text);
       storage          supabase_storage_admin    false    21            A           1255    28889    filename(text)    FUNCTION     �   CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;
 +   DROP FUNCTION storage.filename(name text);
       storage          supabase_storage_admin    false    21            @           1255    28888    foldername(text)    FUNCTION     �   CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;
 -   DROP FUNCTION storage.foldername(name text);
       storage          supabase_storage_admin    false    21            C           1255    28902    get_size_by_bucket()    FUNCTION        CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;
 ,   DROP FUNCTION storage.get_size_by_bucket();
       storage          supabase_storage_admin    false    21            G           1255    28955 L   list_multipart_uploads_with_delimiter(text, text, text, integer, text, text)    FUNCTION     9  CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
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
 �   DROP FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
       storage          supabase_storage_admin    false    21            F           1255    28918 B   list_objects_with_delimiter(text, text, text, integer, text, text)    FUNCTION     �  CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
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
 �   DROP FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text);
       storage          supabase_storage_admin    false    21            I           1255    28971    operation()    FUNCTION     �   CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;
 #   DROP FUNCTION storage.operation();
       storage          supabase_storage_admin    false    21            H           1255    28905 ?   search(text, text, integer, integer, integer, text, text, text)    FUNCTION       CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
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
 �   DROP FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
       storage          supabase_storage_admin    false    21            D           1255    28906    update_updated_at_column()    FUNCTION     �   CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;
 2   DROP FUNCTION storage.update_updated_at_column();
       storage          supabase_storage_admin    false    21                       1255    16974    secrets_encrypt_secret_secret()    FUNCTION     (  CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;
 5   DROP FUNCTION vault.secrets_encrypt_secret_secret();
       vault          supabase_admin    false    30            '           1259    16519    audit_log_entries    TABLE     �   CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);
 #   DROP TABLE auth.audit_log_entries;
       auth         heap    supabase_auth_admin    false    22            �           0    0    TABLE audit_log_entries    COMMENT     R   COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';
          auth          supabase_auth_admin    false    295            �           0    0    TABLE audit_log_entries    ACL     �   GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;
          auth          supabase_auth_admin    false    295            E           1259    28813 
   flow_state    TABLE     �  CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);
    DROP TABLE auth.flow_state;
       auth         heap    supabase_auth_admin    false    22    1342            �           0    0    TABLE flow_state    COMMENT     G   COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';
          auth          supabase_auth_admin    false    325                        0    0    TABLE flow_state    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;
          auth          supabase_auth_admin    false    325            <           1259    28610 
   identities    TABLE     �  CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
    DROP TABLE auth.identities;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE identities    COMMENT     U   COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';
          auth          supabase_auth_admin    false    316                       0    0    COLUMN identities.email    COMMENT     �   COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';
          auth          supabase_auth_admin    false    316                       0    0    TABLE identities    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;
          auth          supabase_auth_admin    false    316            &           1259    16512 	   instances    TABLE     �   CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
    DROP TABLE auth.instances;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE instances    COMMENT     Q   COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';
          auth          supabase_auth_admin    false    294                       0    0    TABLE instances    ACL     �   GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;
          auth          supabase_auth_admin    false    294            @           1259    28700    mfa_amr_claims    TABLE     �   CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);
     DROP TABLE auth.mfa_amr_claims;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE mfa_amr_claims    COMMENT     ~   COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';
          auth          supabase_auth_admin    false    320                       0    0    TABLE mfa_amr_claims    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;
          auth          supabase_auth_admin    false    320            ?           1259    28688    mfa_challenges    TABLE     �   CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text
);
     DROP TABLE auth.mfa_challenges;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE mfa_challenges    COMMENT     _   COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';
          auth          supabase_auth_admin    false    319            	           0    0    TABLE mfa_challenges    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;
          auth          supabase_auth_admin    false    319            >           1259    28675    mfa_factors    TABLE     t  CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone
);
    DROP TABLE auth.mfa_factors;
       auth         heap    supabase_auth_admin    false    1312    1315    22            
           0    0    TABLE mfa_factors    COMMENT     L   COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';
          auth          supabase_auth_admin    false    318                       0    0    TABLE mfa_factors    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;
          auth          supabase_auth_admin    false    318            F           1259    28863    one_time_tokens    TABLE     �  CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);
 !   DROP TABLE auth.one_time_tokens;
       auth         heap    supabase_auth_admin    false    1348    22                       0    0    TABLE one_time_tokens    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;
          auth          supabase_auth_admin    false    326            %           1259    16501    refresh_tokens    TABLE     8  CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);
     DROP TABLE auth.refresh_tokens;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE refresh_tokens    COMMENT     n   COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';
          auth          supabase_auth_admin    false    293                       0    0    TABLE refresh_tokens    ACL     �   GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;
          auth          supabase_auth_admin    false    293            $           1259    16500    refresh_tokens_id_seq    SEQUENCE     |   CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE auth.refresh_tokens_id_seq;
       auth          supabase_auth_admin    false    22    293                       0    0    refresh_tokens_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;
          auth          supabase_auth_admin    false    292                       0    0    SEQUENCE refresh_tokens_id_seq    ACL     �   GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;
          auth          supabase_auth_admin    false    292            C           1259    28742    saml_providers    TABLE     H  CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);
     DROP TABLE auth.saml_providers;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE saml_providers    COMMENT     ]   COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';
          auth          supabase_auth_admin    false    323                       0    0    TABLE saml_providers    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;
          auth          supabase_auth_admin    false    323            D           1259    28760    saml_relay_states    TABLE     `  CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);
 #   DROP TABLE auth.saml_relay_states;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE saml_relay_states    COMMENT     �   COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';
          auth          supabase_auth_admin    false    324                       0    0    TABLE saml_relay_states    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;
          auth          supabase_auth_admin    false    324            (           1259    16527    schema_migrations    TABLE     U   CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);
 #   DROP TABLE auth.schema_migrations;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE schema_migrations    COMMENT     X   COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';
          auth          supabase_auth_admin    false    296                       0    0    TABLE schema_migrations    ACL     �   GRANT ALL ON TABLE auth.schema_migrations TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO postgres;
GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;
          auth          supabase_auth_admin    false    296            =           1259    28640    sessions    TABLE     T  CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);
    DROP TABLE auth.sessions;
       auth         heap    supabase_auth_admin    false    22    1318                       0    0    TABLE sessions    COMMENT     U   COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';
          auth          supabase_auth_admin    false    317                       0    0    COLUMN sessions.not_after    COMMENT     �   COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';
          auth          supabase_auth_admin    false    317                       0    0    TABLE sessions    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;
          auth          supabase_auth_admin    false    317            B           1259    28727    sso_domains    TABLE       CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);
    DROP TABLE auth.sso_domains;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE sso_domains    COMMENT     t   COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';
          auth          supabase_auth_admin    false    322                       0    0    TABLE sso_domains    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;
          auth          supabase_auth_admin    false    322            A           1259    28718    sso_providers    TABLE       CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);
    DROP TABLE auth.sso_providers;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE sso_providers    COMMENT     x   COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';
          auth          supabase_auth_admin    false    321                       0    0     COLUMN sso_providers.resource_id    COMMENT     �   COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';
          auth          supabase_auth_admin    false    321                       0    0    TABLE sso_providers    ACL     �   GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;
          auth          supabase_auth_admin    false    321            #           1259    16489    users    TABLE     4  CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);
    DROP TABLE auth.users;
       auth         heap    supabase_auth_admin    false    22                       0    0    TABLE users    COMMENT     W   COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';
          auth          supabase_auth_admin    false    291                        0    0    COLUMN users.is_sso_user    COMMENT     �   COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';
          auth          supabase_auth_admin    false    291            !           0    0    TABLE users    ACL     �   GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;
          auth          supabase_auth_admin    false    291            "           0    0    TABLE pg_stat_statements    ACL     �   REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;
       
   extensions          postgres    false    290            #           0    0    TABLE pg_stat_statements_info    ACL     �   REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;
       
   extensions          postgres    false    289            $           0    0    SEQUENCE seq_schema_version    ACL     �   GRANT ALL ON SEQUENCE graphql.seq_schema_version TO postgres;
GRANT ALL ON SEQUENCE graphql.seq_schema_version TO anon;
GRANT ALL ON SEQUENCE graphql.seq_schema_version TO authenticated;
GRANT ALL ON SEQUENCE graphql.seq_schema_version TO service_role;
          graphql          supabase_admin    false    315            %           0    0    TABLE decrypted_key    ACL     A   GRANT ALL ON TABLE pgsodium.decrypted_key TO pgsodium_keyholder;
          pgsodium          supabase_admin    false    312            &           0    0    TABLE masking_rule    ACL     @   GRANT ALL ON TABLE pgsodium.masking_rule TO pgsodium_keyholder;
          pgsodium          supabase_admin    false    310            '           0    0    TABLE mask_columns    ACL     @   GRANT ALL ON TABLE pgsodium.mask_columns TO pgsodium_keyholder;
          pgsodium          supabase_admin    false    311            ]           1259    32251    creator    TABLE     �   CREATE TABLE public.creator (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "Creator" text NOT NULL
);
    DROP TABLE public.creator;
       public         heap    postgres    false            (           0    0    TABLE creator    ACL     �   GRANT ALL ON TABLE public.creator TO anon;
GRANT ALL ON TABLE public.creator TO authenticated;
GRANT ALL ON TABLE public.creator TO service_role;
GRANT SELECT ON TABLE public.creator TO readonly;
          public          postgres    false    349            ^           1259    32254    Creator_id_seq    SEQUENCE     �   ALTER TABLE public.creator ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Creator_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    349            )           0    0    SEQUENCE "Creator_id_seq"    ACL     �   GRANT ALL ON SEQUENCE public."Creator_id_seq" TO anon;
GRANT ALL ON SEQUENCE public."Creator_id_seq" TO authenticated;
GRANT ALL ON SEQUENCE public."Creator_id_seq" TO service_role;
          public          postgres    false    350            Q           1259    29147 	   army_card    TABLE     A  CREATE TABLE public.army_card (
    "Creator" text NOT NULL,
    "General" text,
    "Name" text,
    "Race" text,
    "Role" text,
    "Personality" text,
    "Rarity" text,
    "Type" text,
    "SizeCategory" text,
    "Size" bigint,
    "Life" bigint,
    "AdvMove" bigint,
    "AdvRange" bigint,
    "AdvAttack" bigint,
    "AdvDefense" bigint,
    "Points" bigint,
    "BasicMove" bigint,
    "BasicRange" bigint,
    "BasicAttack" bigint,
    "BasicDefense" bigint,
    "Planet" text,
    "UnitNumbers" text,
    id integer NOT NULL,
    "Set" bigint,
    "Note" text
);
    DROP TABLE public.army_card;
       public         heap    postgres    false            *           0    0    TABLE army_card    COMMENT     a   COMMENT ON TABLE public.army_card IS 'A list of stats and abilities for each unit in Heroscape';
          public          postgres    false    337            +           0    0    TABLE army_card    ACL     �   GRANT ALL ON TABLE public.army_card TO anon;
GRANT ALL ON TABLE public.army_card TO authenticated;
GRANT ALL ON TABLE public.army_card TO service_role;
GRANT SELECT ON TABLE public.army_card TO readonly;
          public          postgres    false    337            T           1259    29187    army_card_abilities    TABLE     �   CREATE TABLE public.army_card_abilities (
    id integer NOT NULL,
    army_card_id integer NOT NULL,
    abilityname text,
    ability text
);
 '   DROP TABLE public.army_card_abilities;
       public         heap    postgres    false            ,           0    0    TABLE army_card_abilities    ACL     �   GRANT ALL ON TABLE public.army_card_abilities TO anon;
GRANT ALL ON TABLE public.army_card_abilities TO authenticated;
GRANT ALL ON TABLE public.army_card_abilities TO service_role;
GRANT SELECT ON TABLE public.army_card_abilities TO readonly;
          public          postgres    false    340            S           1259    29186    army_card_abilites_id_seq    SEQUENCE     �   CREATE SEQUENCE public.army_card_abilites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.army_card_abilites_id_seq;
       public          postgres    false    340            -           0    0    army_card_abilites_id_seq    SEQUENCE OWNED BY     X   ALTER SEQUENCE public.army_card_abilites_id_seq OWNED BY public.army_card_abilities.id;
          public          postgres    false    339            .           0    0 "   SEQUENCE army_card_abilites_id_seq    ACL     �   GRANT ALL ON SEQUENCE public.army_card_abilites_id_seq TO anon;
GRANT ALL ON SEQUENCE public.army_card_abilites_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.army_card_abilites_id_seq TO service_role;
          public          postgres    false    339            U           1259    29544    army_card_files    TABLE     �   CREATE TABLE public.army_card_files (
    id bigint NOT NULL,
    army_card_id integer NOT NULL,
    file_purpose text NOT NULL,
    file_path text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    parent bigint
);
 #   DROP TABLE public.army_card_files;
       public         heap    postgres    false            /           0    0    TABLE army_card_files    ACL     �   GRANT ALL ON TABLE public.army_card_files TO anon;
GRANT ALL ON TABLE public.army_card_files TO authenticated;
GRANT ALL ON TABLE public.army_card_files TO service_role;
GRANT SELECT ON TABLE public.army_card_files TO readonly;
          public          postgres    false    341            V           1259    29547    army_card_files_id_seq    SEQUENCE     �   ALTER TABLE public.army_card_files ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.army_card_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    341            0           0    0    SEQUENCE army_card_files_id_seq    ACL     �   GRANT ALL ON SEQUENCE public.army_card_files_id_seq TO anon;
GRANT ALL ON SEQUENCE public.army_card_files_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.army_card_files_id_seq TO service_role;
          public          postgres    false    342            R           1259    29153    army_card_id_seq    SEQUENCE     �   CREATE SEQUENCE public.army_card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.army_card_id_seq;
       public          postgres    false    337            1           0    0    army_card_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.army_card_id_seq OWNED BY public.army_card.id;
          public          postgres    false    338            2           0    0    SEQUENCE army_card_id_seq    ACL     �   GRANT ALL ON SEQUENCE public.army_card_id_seq TO anon;
GRANT ALL ON SEQUENCE public.army_card_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.army_card_id_seq TO service_role;
          public          postgres    false    338            Y           1259    30786    set    TABLE       CREATE TABLE public.set (
    id bigint NOT NULL,
    creator text DEFAULT 'Heroscape'::text NOT NULL,
    name text NOT NULL,
    wave text,
    release_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    type text,
    units_in_set bigint
);
    DROP TABLE public.set;
       public         heap    postgres    false            3           0    0 	   TABLE set    ACL     �   GRANT ALL ON TABLE public.set TO anon;
GRANT ALL ON TABLE public.set TO authenticated;
GRANT ALL ON TABLE public.set TO service_role;
GRANT SELECT ON TABLE public.set TO readonly;
          public          postgres    false    345            Z           1259    30789 
   set_id_seq    SEQUENCE     �   ALTER TABLE public.set ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.set_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    345            4           0    0    SEQUENCE set_id_seq    ACL     �   GRANT ALL ON SEQUENCE public.set_id_seq TO anon;
GRANT ALL ON SEQUENCE public.set_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.set_id_seq TO service_role;
          public          postgres    false    346            [           1259    30853    set_terrain    TABLE     �   CREATE TABLE public.set_terrain (
    id bigint NOT NULL,
    set bigint NOT NULL,
    terrain bigint NOT NULL,
    quantity smallint NOT NULL
);
    DROP TABLE public.set_terrain;
       public         heap    postgres    false            5           0    0    TABLE set_terrain    ACL     �   GRANT ALL ON TABLE public.set_terrain TO anon;
GRANT ALL ON TABLE public.set_terrain TO authenticated;
GRANT ALL ON TABLE public.set_terrain TO service_role;
GRANT SELECT ON TABLE public.set_terrain TO readonly;
          public          postgres    false    347            \           1259    30856    set_terrain_id_seq    SEQUENCE     �   ALTER TABLE public.set_terrain ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.set_terrain_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    347            6           0    0    SEQUENCE set_terrain_id_seq    ACL     �   GRANT ALL ON SEQUENCE public.set_terrain_id_seq TO anon;
GRANT ALL ON SEQUENCE public.set_terrain_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.set_terrain_id_seq TO service_role;
          public          postgres    false    348            W           1259    30775    terrain    TABLE     d   CREATE TABLE public.terrain (
    id bigint NOT NULL,
    hexes smallint,
    type text NOT NULL
);
    DROP TABLE public.terrain;
       public         heap    postgres    false            7           0    0    TABLE terrain    ACL     �   GRANT ALL ON TABLE public.terrain TO anon;
GRANT ALL ON TABLE public.terrain TO authenticated;
GRANT ALL ON TABLE public.terrain TO service_role;
GRANT SELECT ON TABLE public.terrain TO readonly;
          public          postgres    false    343            X           1259    30778    terrain_id_seq    SEQUENCE     �   ALTER TABLE public.terrain ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.terrain_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    343            8           0    0    SEQUENCE terrain_id_seq    ACL     �   GRANT ALL ON SEQUENCE public.terrain_id_seq TO anon;
GRANT ALL ON SEQUENCE public.terrain_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.terrain_id_seq TO service_role;
          public          postgres    false    344            P           1259    29119    messages    TABLE     �   CREATE TABLE realtime.messages (
    id bigint NOT NULL,
    topic text NOT NULL,
    extension text NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);
    DROP TABLE realtime.messages;
       realtime         heap    supabase_realtime_admin    false    16            9           0    0    TABLE messages    ACL     8  GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;
          realtime          supabase_realtime_admin    false    336            O           1259    29118    messages_id_seq    SEQUENCE     z   CREATE SEQUENCE realtime.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE realtime.messages_id_seq;
       realtime          supabase_realtime_admin    false    336    16            :           0    0    messages_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE realtime.messages_id_seq OWNED BY realtime.messages.id;
          realtime          supabase_realtime_admin    false    335            ;           0    0    SEQUENCE messages_id_seq    ACL     =  GRANT ALL ON SEQUENCE realtime.messages_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.messages_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.messages_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.messages_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.messages_id_seq TO service_role;
          realtime          supabase_realtime_admin    false    335            I           1259    28977    schema_migrations    TABLE     y   CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);
 '   DROP TABLE realtime.schema_migrations;
       realtime         heap    supabase_admin    false    16            <           0    0    TABLE schema_migrations    ACL     �  GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;
          realtime          supabase_admin    false    329            L           1259    28999    subscription    TABLE     �  CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
 "   DROP TABLE realtime.subscription;
       realtime         heap    supabase_admin    false    1366    589    16    1366            =           0    0    TABLE subscription    ACL     g  GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;
          realtime          supabase_admin    false    332            K           1259    28998    subscription_id_seq    SEQUENCE     �   ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            realtime          supabase_admin    false    16    332            >           0    0    SEQUENCE subscription_id_seq    ACL     �  GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;
          realtime          supabase_admin    false    331            )           1259    16540    buckets    TABLE     k  CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);
    DROP TABLE storage.buckets;
       storage         heap    supabase_storage_admin    false    21            ?           0    0    COLUMN buckets.owner    COMMENT     X   COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';
          storage          supabase_storage_admin    false    297            @           0    0    TABLE buckets    ACL     �   GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres;
          storage          supabase_storage_admin    false    297            +           1259    16582 
   migrations    TABLE     �   CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE storage.migrations;
       storage         heap    supabase_storage_admin    false    21            A           0    0    TABLE migrations    ACL     �   GRANT ALL ON TABLE storage.migrations TO anon;
GRANT ALL ON TABLE storage.migrations TO authenticated;
GRANT ALL ON TABLE storage.migrations TO service_role;
GRANT ALL ON TABLE storage.migrations TO postgres;
          storage          supabase_storage_admin    false    299            *           1259    16555    objects    TABLE     �  CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);
    DROP TABLE storage.objects;
       storage         heap    supabase_storage_admin    false    21            B           0    0    COLUMN objects.owner    COMMENT     X   COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';
          storage          supabase_storage_admin    false    298            C           0    0    TABLE objects    ACL     �   GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres;
          storage          supabase_storage_admin    false    298            G           1259    28920    s3_multipart_uploads    TABLE     j  CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);
 )   DROP TABLE storage.s3_multipart_uploads;
       storage         heap    supabase_storage_admin    false    21            D           0    0    TABLE s3_multipart_uploads    ACL     �   GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;
          storage          supabase_storage_admin    false    327            H           1259    28934    s3_multipart_uploads_parts    TABLE     �  CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
 /   DROP TABLE storage.s3_multipart_uploads_parts;
       storage         heap    supabase_storage_admin    false    21            E           0    0     TABLE s3_multipart_uploads_parts    ACL     �   GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;
          storage          supabase_storage_admin    false    328            :           1259    16970    decrypted_secrets    VIEW     �  CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;
 #   DROP VIEW vault.decrypted_secrets;
       vault          supabase_admin    false    6    27    7    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    6    27    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    27    27    6    27    30    7    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    6    27    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    27    27    6    27    30    7    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    6    27    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    27    27    6    27    30    7    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    6    27    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    27    27    6    27    30    7    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    6    27    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    27    27    6    27    30    7    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    6    27    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    27    27    6    27    30    7    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    6    27    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    27    27    6    27    30    7    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    6    27    6    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    6    27    27    6    27    6    27    6    27    6    6    27    27    6    27    6    27    27    6    27    6    27    6    27    27    6    27    30    30            �           2604    16504    refresh_tokens id    DEFAULT     r   ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);
 >   ALTER TABLE auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
       auth          supabase_auth_admin    false    293    292    293            �           2604    29154    army_card id    DEFAULT     l   ALTER TABLE ONLY public.army_card ALTER COLUMN id SET DEFAULT nextval('public.army_card_id_seq'::regclass);
 ;   ALTER TABLE public.army_card ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    338    337            �           2604    29190    army_card_abilities id    DEFAULT        ALTER TABLE ONLY public.army_card_abilities ALTER COLUMN id SET DEFAULT nextval('public.army_card_abilites_id_seq'::regclass);
 E   ALTER TABLE public.army_card_abilities ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    340    339    340            �           2604    29122    messages id    DEFAULT     n   ALTER TABLE ONLY realtime.messages ALTER COLUMN id SET DEFAULT nextval('realtime.messages_id_seq'::regclass);
 <   ALTER TABLE realtime.messages ALTER COLUMN id DROP DEFAULT;
       realtime          supabase_realtime_admin    false    336    335    336            e          0    16519    audit_log_entries 
   TABLE DATA           [   COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
    auth          supabase_auth_admin    false    295   �      s          0    28813 
   flow_state 
   TABLE DATA           �   COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
    auth          supabase_auth_admin    false    325   ��      j          0    28610 
   identities 
   TABLE DATA           ~   COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
    auth          supabase_auth_admin    false    316   �      d          0    16512 	   instances 
   TABLE DATA           T   COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
    auth          supabase_auth_admin    false    294   ֕      n          0    28700    mfa_amr_claims 
   TABLE DATA           e   COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
    auth          supabase_auth_admin    false    320   �      m          0    28688    mfa_challenges 
   TABLE DATA           d   COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code) FROM stdin;
    auth          supabase_auth_admin    false    319   ��      l          0    28675    mfa_factors 
   TABLE DATA           �   COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at) FROM stdin;
    auth          supabase_auth_admin    false    318   ݗ      t          0    28863    one_time_tokens 
   TABLE DATA           p   COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
    auth          supabase_auth_admin    false    326   ��      c          0    16501    refresh_tokens 
   TABLE DATA           |   COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
    auth          supabase_auth_admin    false    293   �      q          0    28742    saml_providers 
   TABLE DATA           �   COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
    auth          supabase_auth_admin    false    323   &�      r          0    28760    saml_relay_states 
   TABLE DATA           �   COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
    auth          supabase_auth_admin    false    324   C�      f          0    16527    schema_migrations 
   TABLE DATA           2   COPY auth.schema_migrations (version) FROM stdin;
    auth          supabase_auth_admin    false    296   `�      k          0    28640    sessions 
   TABLE DATA           �   COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
    auth          supabase_auth_admin    false    317   ��      p          0    28727    sso_domains 
   TABLE DATA           X   COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
    auth          supabase_auth_admin    false    322   -�      o          0    28718    sso_providers 
   TABLE DATA           N   COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
    auth          supabase_auth_admin    false    321   J�      a          0    16489    users 
   TABLE DATA           O  COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
    auth          supabase_auth_admin    false    291   g�      �          0    16790    key 
   TABLE DATA           �   COPY pgsodium.key (id, status, created, expires, key_type, key_id, key_context, name, associated_data, raw_key, raw_key_nonce, parent_key, comment, user_data) FROM stdin;
    pgsodium          supabase_admin    false    307   u�      |          0    29147 	   army_card 
   TABLE DATA           4  COPY public.army_card ("Creator", "General", "Name", "Race", "Role", "Personality", "Rarity", "Type", "SizeCategory", "Size", "Life", "AdvMove", "AdvRange", "AdvAttack", "AdvDefense", "Points", "BasicMove", "BasicRange", "BasicAttack", "BasicDefense", "Planet", "UnitNumbers", id, "Set", "Note") FROM stdin;
    public          postgres    false    337   ��                0    29187    army_card_abilities 
   TABLE DATA           U   COPY public.army_card_abilities (id, army_card_id, abilityname, ability) FROM stdin;
    public          postgres    false    340   ��      �          0    29544    army_card_files 
   TABLE DATA           h   COPY public.army_card_files (id, army_card_id, file_purpose, file_path, created_at, parent) FROM stdin;
    public          postgres    false    341   �N      �          0    32251    creator 
   TABLE DATA           <   COPY public.creator (id, created_at, "Creator") FROM stdin;
    public          postgres    false    349   ��      �          0    30786    set 
   TABLE DATA           d   COPY public.set (id, creator, name, wave, release_date, created_at, type, units_in_set) FROM stdin;
    public          postgres    false    345   )�      �          0    30853    set_terrain 
   TABLE DATA           A   COPY public.set_terrain (id, set, terrain, quantity) FROM stdin;
    public          postgres    false    347   '�      �          0    30775    terrain 
   TABLE DATA           2   COPY public.terrain (id, hexes, type) FROM stdin;
    public          postgres    false    343   ,�      {          0    29119    messages 
   TABLE DATA           S   COPY realtime.messages (id, topic, extension, inserted_at, updated_at) FROM stdin;
    realtime          supabase_realtime_admin    false    336   $�      w          0    28977    schema_migrations 
   TABLE DATA           C   COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
    realtime          supabase_admin    false    329   A�      y          0    28999    subscription 
   TABLE DATA           b   COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
    realtime          supabase_admin    false    332   ��      g          0    16540    buckets 
   TABLE DATA           �   COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
    storage          supabase_storage_admin    false    297   ��      i          0    16582 
   migrations 
   TABLE DATA           B   COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
    storage          supabase_storage_admin    false    299   }�      h          0    16555    objects 
   TABLE DATA           �   COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
    storage          supabase_storage_admin    false    298   X�      u          0    28920    s3_multipart_uploads 
   TABLE DATA           �   COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
    storage          supabase_storage_admin    false    327   �9      v          0    28934    s3_multipart_uploads_parts 
   TABLE DATA           �   COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
    storage          supabase_storage_admin    false    328   �9      �          0    16951    secrets 
   TABLE DATA           f   COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
    vault          supabase_admin    false    313   �9      F           0    0    refresh_tokens_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 7, true);
          auth          supabase_auth_admin    false    292            G           0    0    key_key_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);
          pgsodium          supabase_admin    false    306            H           0    0    Creator_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Creator_id_seq"', 4, true);
          public          postgres    false    350            I           0    0    army_card_abilites_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.army_card_abilites_id_seq', 677, true);
          public          postgres    false    339            J           0    0    army_card_files_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.army_card_files_id_seq', 1824, true);
          public          postgres    false    342            K           0    0    army_card_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.army_card_id_seq', 302, true);
          public          postgres    false    338            L           0    0 
   set_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.set_id_seq', 47, true);
          public          postgres    false    346            M           0    0    set_terrain_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.set_terrain_id_seq', 54, true);
          public          postgres    false    348            N           0    0    terrain_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.terrain_id_seq', 71, true);
          public          postgres    false    344            O           0    0    messages_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('realtime.messages_id_seq', 1, false);
          realtime          supabase_realtime_admin    false    335            P           0    0    subscription_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);
          realtime          supabase_admin    false    331            P           2606    28713    mfa_amr_claims amr_id_pk 
   CONSTRAINT     T   ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);
 @   ALTER TABLE ONLY auth.mfa_amr_claims DROP CONSTRAINT amr_id_pk;
       auth            supabase_auth_admin    false    320                       2606    16525 (   audit_log_entries audit_log_entries_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY auth.audit_log_entries DROP CONSTRAINT audit_log_entries_pkey;
       auth            supabase_auth_admin    false    295            f           2606    28819    flow_state flow_state_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY auth.flow_state DROP CONSTRAINT flow_state_pkey;
       auth            supabase_auth_admin    false    325            ;           2606    28837    identities identities_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY auth.identities DROP CONSTRAINT identities_pkey;
       auth            supabase_auth_admin    false    316            =           2606    28847 1   identities identities_provider_id_provider_unique 
   CONSTRAINT     {   ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);
 Y   ALTER TABLE ONLY auth.identities DROP CONSTRAINT identities_provider_id_provider_unique;
       auth            supabase_auth_admin    false    316    316                       2606    16518    instances instances_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY auth.instances DROP CONSTRAINT instances_pkey;
       auth            supabase_auth_admin    false    294            R           2606    28706 C   mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);
 k   ALTER TABLE ONLY auth.mfa_amr_claims DROP CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey;
       auth            supabase_auth_admin    false    320    320            N           2606    28694 "   mfa_challenges mfa_challenges_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY auth.mfa_challenges DROP CONSTRAINT mfa_challenges_pkey;
       auth            supabase_auth_admin    false    319            F           2606    28887 .   mfa_factors mfa_factors_last_challenged_at_key 
   CONSTRAINT     u   ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);
 V   ALTER TABLE ONLY auth.mfa_factors DROP CONSTRAINT mfa_factors_last_challenged_at_key;
       auth            supabase_auth_admin    false    318            H           2606    28681    mfa_factors mfa_factors_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY auth.mfa_factors DROP CONSTRAINT mfa_factors_pkey;
       auth            supabase_auth_admin    false    318            j           2606    28872 $   one_time_tokens one_time_tokens_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY auth.one_time_tokens DROP CONSTRAINT one_time_tokens_pkey;
       auth            supabase_auth_admin    false    326                       2606    16508 "   refresh_tokens refresh_tokens_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY auth.refresh_tokens DROP CONSTRAINT refresh_tokens_pkey;
       auth            supabase_auth_admin    false    293                       2606    28623 *   refresh_tokens refresh_tokens_token_unique 
   CONSTRAINT     d   ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);
 R   ALTER TABLE ONLY auth.refresh_tokens DROP CONSTRAINT refresh_tokens_token_unique;
       auth            supabase_auth_admin    false    293            [           2606    28753 +   saml_providers saml_providers_entity_id_key 
   CONSTRAINT     i   ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);
 S   ALTER TABLE ONLY auth.saml_providers DROP CONSTRAINT saml_providers_entity_id_key;
       auth            supabase_auth_admin    false    323            ]           2606    28751 "   saml_providers saml_providers_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY auth.saml_providers DROP CONSTRAINT saml_providers_pkey;
       auth            supabase_auth_admin    false    323            b           2606    28767 (   saml_relay_states saml_relay_states_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY auth.saml_relay_states DROP CONSTRAINT saml_relay_states_pkey;
       auth            supabase_auth_admin    false    324            "           2606    16531 (   schema_migrations schema_migrations_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);
 P   ALTER TABLE ONLY auth.schema_migrations DROP CONSTRAINT schema_migrations_pkey;
       auth            supabase_auth_admin    false    296            A           2606    28644    sessions sessions_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY auth.sessions DROP CONSTRAINT sessions_pkey;
       auth            supabase_auth_admin    false    317            X           2606    28734    sso_domains sso_domains_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY auth.sso_domains DROP CONSTRAINT sso_domains_pkey;
       auth            supabase_auth_admin    false    322            T           2606    28725     sso_providers sso_providers_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY auth.sso_providers DROP CONSTRAINT sso_providers_pkey;
       auth            supabase_auth_admin    false    321                       2606    28807    users users_phone_key 
   CONSTRAINT     O   ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);
 =   ALTER TABLE ONLY auth.users DROP CONSTRAINT users_phone_key;
       auth            supabase_auth_admin    false    291                       2606    16495    users users_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY auth.users DROP CONSTRAINT users_pkey;
       auth            supabase_auth_admin    false    291            �           2606    32260    creator Creator_Creator_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.creator
    ADD CONSTRAINT "Creator_Creator_key" UNIQUE ("Creator");
 G   ALTER TABLE ONLY public.creator DROP CONSTRAINT "Creator_Creator_key";
       public            postgres    false    349            �           2606    32264    creator Creator_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.creator
    ADD CONSTRAINT "Creator_pkey" PRIMARY KEY (id, "Creator");
 @   ALTER TABLE ONLY public.creator DROP CONSTRAINT "Creator_pkey";
       public            postgres    false    349    349                       2606    29194 +   army_card_abilities army_card_abilites_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.army_card_abilities
    ADD CONSTRAINT army_card_abilites_pkey PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.army_card_abilities DROP CONSTRAINT army_card_abilites_pkey;
       public            postgres    false    340            �           2606    29555 $   army_card_files army_card_files_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.army_card_files
    ADD CONSTRAINT army_card_files_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.army_card_files DROP CONSTRAINT army_card_files_pkey;
       public            postgres    false    341            }           2606    29156    army_card army_card_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.army_card
    ADD CONSTRAINT army_card_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.army_card DROP CONSTRAINT army_card_pkey;
       public            postgres    false    337            �           2606    30798    set set_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.set
    ADD CONSTRAINT set_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.set DROP CONSTRAINT set_pkey;
       public            postgres    false    345            �           2606    30861    set_terrain set_terrain_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.set_terrain
    ADD CONSTRAINT set_terrain_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.set_terrain DROP CONSTRAINT set_terrain_pkey;
       public            postgres    false    347            �           2606    30785    terrain terrain_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.terrain
    ADD CONSTRAINT terrain_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.terrain DROP CONSTRAINT terrain_pkey;
       public            postgres    false    343            z           2606    29126    messages messages_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY realtime.messages DROP CONSTRAINT messages_pkey;
       realtime            supabase_realtime_admin    false    336            w           2606    29007    subscription pk_subscription 
   CONSTRAINT     \   ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);
 H   ALTER TABLE ONLY realtime.subscription DROP CONSTRAINT pk_subscription;
       realtime            supabase_admin    false    332            t           2606    28981 (   schema_migrations schema_migrations_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);
 T   ALTER TABLE ONLY realtime.schema_migrations DROP CONSTRAINT schema_migrations_pkey;
       realtime            supabase_admin    false    329            %           2606    16548    buckets buckets_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);
 ?   ALTER TABLE ONLY storage.buckets DROP CONSTRAINT buckets_pkey;
       storage            supabase_storage_admin    false    297            ,           2606    16589    migrations migrations_name_key 
   CONSTRAINT     Z   ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);
 I   ALTER TABLE ONLY storage.migrations DROP CONSTRAINT migrations_name_key;
       storage            supabase_storage_admin    false    299            .           2606    16587    migrations migrations_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
 E   ALTER TABLE ONLY storage.migrations DROP CONSTRAINT migrations_pkey;
       storage            supabase_storage_admin    false    299            *           2606    16565    objects objects_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);
 ?   ALTER TABLE ONLY storage.objects DROP CONSTRAINT objects_pkey;
       storage            supabase_storage_admin    false    298            r           2606    28943 :   s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);
 e   ALTER TABLE ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT s3_multipart_uploads_parts_pkey;
       storage            supabase_storage_admin    false    328            p           2606    28928 .   s3_multipart_uploads s3_multipart_uploads_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);
 Y   ALTER TABLE ONLY storage.s3_multipart_uploads DROP CONSTRAINT s3_multipart_uploads_pkey;
       storage            supabase_storage_admin    false    327                        1259    16526    audit_logs_instance_id_idx    INDEX     ]   CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);
 ,   DROP INDEX auth.audit_logs_instance_id_idx;
       auth            supabase_auth_admin    false    295                       1259    28633    confirmation_token_idx    INDEX     �   CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);
 (   DROP INDEX auth.confirmation_token_idx;
       auth            supabase_auth_admin    false    291    291                       1259    28635    email_change_token_current_idx    INDEX     �   CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);
 0   DROP INDEX auth.email_change_token_current_idx;
       auth            supabase_auth_admin    false    291    291                       1259    28636    email_change_token_new_idx    INDEX     �   CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);
 ,   DROP INDEX auth.email_change_token_new_idx;
       auth            supabase_auth_admin    false    291    291            D           1259    28715    factor_id_created_at_idx    INDEX     ]   CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);
 *   DROP INDEX auth.factor_id_created_at_idx;
       auth            supabase_auth_admin    false    318    318            d           1259    28823    flow_state_created_at_idx    INDEX     Y   CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);
 +   DROP INDEX auth.flow_state_created_at_idx;
       auth            supabase_auth_admin    false    325            9           1259    28803    identities_email_idx    INDEX     [   CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);
 &   DROP INDEX auth.identities_email_idx;
       auth            supabase_auth_admin    false    316            Q           0    0    INDEX identities_email_idx    COMMENT     c   COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';
          auth          supabase_auth_admin    false    3897            >           1259    28630    identities_user_id_idx    INDEX     N   CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);
 (   DROP INDEX auth.identities_user_id_idx;
       auth            supabase_auth_admin    false    316            g           1259    28820    idx_auth_code    INDEX     G   CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);
    DROP INDEX auth.idx_auth_code;
       auth            supabase_auth_admin    false    325            h           1259    28821    idx_user_id_auth_method    INDEX     f   CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);
 )   DROP INDEX auth.idx_user_id_auth_method;
       auth            supabase_auth_admin    false    325    325            L           1259    28826    mfa_challenge_created_at_idx    INDEX     `   CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);
 .   DROP INDEX auth.mfa_challenge_created_at_idx;
       auth            supabase_auth_admin    false    319            I           1259    28687 %   mfa_factors_user_friendly_name_unique    INDEX     �   CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);
 7   DROP INDEX auth.mfa_factors_user_friendly_name_unique;
       auth            supabase_auth_admin    false    318    318    318            J           1259    28832    mfa_factors_user_id_idx    INDEX     P   CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);
 )   DROP INDEX auth.mfa_factors_user_id_idx;
       auth            supabase_auth_admin    false    318            k           1259    28879 #   one_time_tokens_relates_to_hash_idx    INDEX     b   CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);
 5   DROP INDEX auth.one_time_tokens_relates_to_hash_idx;
       auth            supabase_auth_admin    false    326            l           1259    28878 #   one_time_tokens_token_hash_hash_idx    INDEX     b   CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);
 5   DROP INDEX auth.one_time_tokens_token_hash_hash_idx;
       auth            supabase_auth_admin    false    326            m           1259    28880 &   one_time_tokens_user_id_token_type_key    INDEX     v   CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);
 8   DROP INDEX auth.one_time_tokens_user_id_token_type_key;
       auth            supabase_auth_admin    false    326    326            	           1259    28637    reauthentication_token_idx    INDEX     �   CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);
 ,   DROP INDEX auth.reauthentication_token_idx;
       auth            supabase_auth_admin    false    291    291            
           1259    28634    recovery_token_idx    INDEX     �   CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);
 $   DROP INDEX auth.recovery_token_idx;
       auth            supabase_auth_admin    false    291    291                       1259    16509    refresh_tokens_instance_id_idx    INDEX     ^   CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);
 0   DROP INDEX auth.refresh_tokens_instance_id_idx;
       auth            supabase_auth_admin    false    293                       1259    16510 &   refresh_tokens_instance_id_user_id_idx    INDEX     o   CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);
 8   DROP INDEX auth.refresh_tokens_instance_id_user_id_idx;
       auth            supabase_auth_admin    false    293    293                       1259    28629    refresh_tokens_parent_idx    INDEX     T   CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);
 +   DROP INDEX auth.refresh_tokens_parent_idx;
       auth            supabase_auth_admin    false    293                       1259    28717 %   refresh_tokens_session_id_revoked_idx    INDEX     m   CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);
 7   DROP INDEX auth.refresh_tokens_session_id_revoked_idx;
       auth            supabase_auth_admin    false    293    293                       1259    28822    refresh_tokens_updated_at_idx    INDEX     a   CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);
 /   DROP INDEX auth.refresh_tokens_updated_at_idx;
       auth            supabase_auth_admin    false    293            ^           1259    28759 "   saml_providers_sso_provider_id_idx    INDEX     f   CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);
 4   DROP INDEX auth.saml_providers_sso_provider_id_idx;
       auth            supabase_auth_admin    false    323            _           1259    28824     saml_relay_states_created_at_idx    INDEX     g   CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);
 2   DROP INDEX auth.saml_relay_states_created_at_idx;
       auth            supabase_auth_admin    false    324            `           1259    28774    saml_relay_states_for_email_idx    INDEX     `   CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);
 1   DROP INDEX auth.saml_relay_states_for_email_idx;
       auth            supabase_auth_admin    false    324            c           1259    28773 %   saml_relay_states_sso_provider_id_idx    INDEX     l   CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);
 7   DROP INDEX auth.saml_relay_states_sso_provider_id_idx;
       auth            supabase_auth_admin    false    324            ?           1259    28825    sessions_not_after_idx    INDEX     S   CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);
 (   DROP INDEX auth.sessions_not_after_idx;
       auth            supabase_auth_admin    false    317            B           1259    28716    sessions_user_id_idx    INDEX     J   CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);
 &   DROP INDEX auth.sessions_user_id_idx;
       auth            supabase_auth_admin    false    317            V           1259    28741    sso_domains_domain_idx    INDEX     \   CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));
 (   DROP INDEX auth.sso_domains_domain_idx;
       auth            supabase_auth_admin    false    322    322            Y           1259    28740    sso_domains_sso_provider_id_idx    INDEX     `   CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);
 1   DROP INDEX auth.sso_domains_sso_provider_id_idx;
       auth            supabase_auth_admin    false    322            U           1259    28726    sso_providers_resource_id_idx    INDEX     j   CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));
 /   DROP INDEX auth.sso_providers_resource_id_idx;
       auth            supabase_auth_admin    false    321    321            K           1259    28885    unique_phone_factor_per_user    INDEX     c   CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);
 .   DROP INDEX auth.unique_phone_factor_per_user;
       auth            supabase_auth_admin    false    318    318            C           1259    28714    user_id_created_at_idx    INDEX     X   CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);
 (   DROP INDEX auth.user_id_created_at_idx;
       auth            supabase_auth_admin    false    317    317                       1259    28794    users_email_partial_key    INDEX     k   CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);
 )   DROP INDEX auth.users_email_partial_key;
       auth            supabase_auth_admin    false    291    291            R           0    0    INDEX users_email_partial_key    COMMENT     }   COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';
          auth          supabase_auth_admin    false    3851                       1259    28631    users_instance_id_email_idx    INDEX     h   CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));
 -   DROP INDEX auth.users_instance_id_email_idx;
       auth            supabase_auth_admin    false    291    291                       1259    16499    users_instance_id_idx    INDEX     L   CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);
 '   DROP INDEX auth.users_instance_id_idx;
       auth            supabase_auth_admin    false    291                       1259    28849    users_is_anonymous_idx    INDEX     N   CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);
 (   DROP INDEX auth.users_is_anonymous_idx;
       auth            supabase_auth_admin    false    291            u           1259    29010    ix_realtime_subscription_entity    INDEX     [   CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING hash (entity);
 5   DROP INDEX realtime.ix_realtime_subscription_entity;
       realtime            supabase_admin    false    332            {           1259    29127    messages_topic_index    INDEX     L   CREATE INDEX messages_topic_index ON realtime.messages USING btree (topic);
 *   DROP INDEX realtime.messages_topic_index;
       realtime            supabase_realtime_admin    false    336            x           1259    29056 /   subscription_subscription_id_entity_filters_key    INDEX     �   CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);
 E   DROP INDEX realtime.subscription_subscription_id_entity_filters_key;
       realtime            supabase_admin    false    332    332    332            #           1259    16554    bname    INDEX     A   CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);
    DROP INDEX storage.bname;
       storage            supabase_storage_admin    false    297            &           1259    16576    bucketid_objname    INDEX     W   CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);
 %   DROP INDEX storage.bucketid_objname;
       storage            supabase_storage_admin    false    298    298            n           1259    28954    idx_multipart_uploads_list    INDEX     r   CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);
 /   DROP INDEX storage.idx_multipart_uploads_list;
       storage            supabase_storage_admin    false    327    327    327            '           1259    28919    idx_objects_bucket_id_name    INDEX     f   CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");
 /   DROP INDEX storage.idx_objects_bucket_id_name;
       storage            supabase_storage_admin    false    298    298            (           1259    16577    name_prefix_search    INDEX     X   CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);
 '   DROP INDEX storage.name_prefix_search;
       storage            supabase_storage_admin    false    298            �           2620    29012    subscription tr_check_filters    TRIGGER     �   CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();
 8   DROP TRIGGER tr_check_filters ON realtime.subscription;
       realtime          supabase_admin    false    595    332            �           2620    28907 !   objects update_objects_updated_at    TRIGGER     �   CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();
 ;   DROP TRIGGER update_objects_updated_at ON storage.objects;
       storage          supabase_storage_admin    false    580    298            �           2606    28617 "   identities identities_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY auth.identities DROP CONSTRAINT identities_user_id_fkey;
       auth          supabase_auth_admin    false    316    3858    291            �           2606    28707 -   mfa_amr_claims mfa_amr_claims_session_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY auth.mfa_amr_claims DROP CONSTRAINT mfa_amr_claims_session_id_fkey;
       auth          supabase_auth_admin    false    320    317    3905            �           2606    28695 1   mfa_challenges mfa_challenges_auth_factor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY auth.mfa_challenges DROP CONSTRAINT mfa_challenges_auth_factor_id_fkey;
       auth          supabase_auth_admin    false    318    319    3912            �           2606    28682 $   mfa_factors mfa_factors_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY auth.mfa_factors DROP CONSTRAINT mfa_factors_user_id_fkey;
       auth          supabase_auth_admin    false    318    291    3858            �           2606    28873 ,   one_time_tokens one_time_tokens_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY auth.one_time_tokens DROP CONSTRAINT one_time_tokens_user_id_fkey;
       auth          supabase_auth_admin    false    291    326    3858            �           2606    28650 -   refresh_tokens refresh_tokens_session_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY auth.refresh_tokens DROP CONSTRAINT refresh_tokens_session_id_fkey;
       auth          supabase_auth_admin    false    293    3905    317            �           2606    28754 2   saml_providers saml_providers_sso_provider_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY auth.saml_providers DROP CONSTRAINT saml_providers_sso_provider_id_fkey;
       auth          supabase_auth_admin    false    3924    323    321            �           2606    28827 6   saml_relay_states saml_relay_states_flow_state_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY auth.saml_relay_states DROP CONSTRAINT saml_relay_states_flow_state_id_fkey;
       auth          supabase_auth_admin    false    325    3942    324            �           2606    28768 8   saml_relay_states saml_relay_states_sso_provider_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY auth.saml_relay_states DROP CONSTRAINT saml_relay_states_sso_provider_id_fkey;
       auth          supabase_auth_admin    false    321    3924    324            �           2606    28645    sessions sessions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY auth.sessions DROP CONSTRAINT sessions_user_id_fkey;
       auth          supabase_auth_admin    false    291    3858    317            �           2606    28735 ,   sso_domains sso_domains_sso_provider_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY auth.sso_domains DROP CONSTRAINT sso_domains_sso_provider_id_fkey;
       auth          supabase_auth_admin    false    321    322    3924            �           2606    32266     army_card army_card_Creator_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.army_card
    ADD CONSTRAINT "army_card_Creator_fkey" FOREIGN KEY ("Creator") REFERENCES public.creator("Creator");
 L   ALTER TABLE ONLY public.army_card DROP CONSTRAINT "army_card_Creator_fkey";
       public          postgres    false    349    3977    337            �           2606    30799    army_card army_card_Set_fkey    FK CONSTRAINT     y   ALTER TABLE ONLY public.army_card
    ADD CONSTRAINT "army_card_Set_fkey" FOREIGN KEY ("Set") REFERENCES public.set(id);
 H   ALTER TABLE ONLY public.army_card DROP CONSTRAINT "army_card_Set_fkey";
       public          postgres    false    345    3973    337            �           2606    31380 9   army_card_abilities army_card_abilities_army_card_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.army_card_abilities
    ADD CONSTRAINT army_card_abilities_army_card_id_fkey FOREIGN KEY (army_card_id) REFERENCES public.army_card(id) ON UPDATE CASCADE ON DELETE CASCADE;
 c   ALTER TABLE ONLY public.army_card_abilities DROP CONSTRAINT army_card_abilities_army_card_id_fkey;
       public          postgres    false    340    337    3965            �           2606    29556 1   army_card_files army_card_files_army_card_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.army_card_files
    ADD CONSTRAINT army_card_files_army_card_id_fkey FOREIGN KEY (army_card_id) REFERENCES public.army_card(id) ON UPDATE CASCADE ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.army_card_files DROP CONSTRAINT army_card_files_army_card_id_fkey;
       public          postgres    false    3965    337    341            �           2606    34464 +   army_card_files army_card_files_parent_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.army_card_files
    ADD CONSTRAINT army_card_files_parent_fkey FOREIGN KEY (parent) REFERENCES public.army_card_files(id);
 U   ALTER TABLE ONLY public.army_card_files DROP CONSTRAINT army_card_files_parent_fkey;
       public          postgres    false    341    3969    341            �           2606    32271    set set_creator_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.set
    ADD CONSTRAINT set_creator_fkey FOREIGN KEY (creator) REFERENCES public.creator("Creator");
 >   ALTER TABLE ONLY public.set DROP CONSTRAINT set_creator_fkey;
       public          postgres    false    3977    345    349            �           2606    30862     set_terrain set_terrain_set_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.set_terrain
    ADD CONSTRAINT set_terrain_set_fkey FOREIGN KEY (set) REFERENCES public.set(id) ON UPDATE CASCADE ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.set_terrain DROP CONSTRAINT set_terrain_set_fkey;
       public          postgres    false    345    347    3973            �           2606    30867 $   set_terrain set_terrain_terrain_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.set_terrain
    ADD CONSTRAINT set_terrain_terrain_fkey FOREIGN KEY (terrain) REFERENCES public.terrain(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.set_terrain DROP CONSTRAINT set_terrain_terrain_fkey;
       public          postgres    false    343    347    3971            �           2606    16566    objects objects_bucketId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);
 J   ALTER TABLE ONLY storage.objects DROP CONSTRAINT "objects_bucketId_fkey";
       storage          supabase_storage_admin    false    298    297    3877            �           2606    28929 8   s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);
 c   ALTER TABLE ONLY storage.s3_multipart_uploads DROP CONSTRAINT s3_multipart_uploads_bucket_id_fkey;
       storage          supabase_storage_admin    false    327    3877    297            �           2606    28949 D   s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);
 o   ALTER TABLE ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey;
       storage          supabase_storage_admin    false    297    3877    328            �           2606    28944 D   s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;
 o   ALTER TABLE ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey;
       storage          supabase_storage_admin    false    327    328    3952            =           0    16519    audit_log_entries    ROW SECURITY     =   ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    295            K           0    28813 
   flow_state    ROW SECURITY     6   ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    325            B           0    28610 
   identities    ROW SECURITY     6   ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    316            <           0    16512 	   instances    ROW SECURITY     5   ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    294            F           0    28700    mfa_amr_claims    ROW SECURITY     :   ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    320            E           0    28688    mfa_challenges    ROW SECURITY     :   ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    319            D           0    28675    mfa_factors    ROW SECURITY     7   ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    318            L           0    28863    one_time_tokens    ROW SECURITY     ;   ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    326            ;           0    16501    refresh_tokens    ROW SECURITY     :   ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    293            I           0    28742    saml_providers    ROW SECURITY     :   ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    323            J           0    28760    saml_relay_states    ROW SECURITY     =   ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    324            >           0    16527    schema_migrations    ROW SECURITY     =   ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    296            C           0    28640    sessions    ROW SECURITY     4   ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    317            H           0    28727    sso_domains    ROW SECURITY     7   ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    322            G           0    28718    sso_providers    ROW SECURITY     9   ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    321            :           0    16489    users    ROW SECURITY     1   ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    291            [           3256    31624 %   army_card_files ALL for authenticated    POLICY     �   CREATE POLICY "ALL for authenticated" ON public.army_card_files TO authenticated USING ((auth.role() = 'authenticated'::text));
 ?   DROP POLICY "ALL for authenticated" ON public.army_card_files;
       public          postgres    false    373    341            Z           3256    31556 *   army_card Enable read access for all users    POLICY     f   CREATE POLICY "Enable read access for all users" ON public.army_card FOR SELECT TO anon USING (true);
 D   DROP POLICY "Enable read access for all users" ON public.army_card;
       public          postgres    false    337            W           3256    29329 4   army_card_abilities Enable read access for all users    POLICY     p   CREATE POLICY "Enable read access for all users" ON public.army_card_abilities FOR SELECT TO anon USING (true);
 N   DROP POLICY "Enable read access for all users" ON public.army_card_abilities;
       public          postgres    false    340            Y           3256    30906 $   set Enable read access for all users    POLICY     `   CREATE POLICY "Enable read access for all users" ON public.set FOR SELECT TO anon USING (true);
 >   DROP POLICY "Enable read access for all users" ON public.set;
       public          postgres    false    345            P           0    29147 	   army_card    ROW SECURITY     7   ALTER TABLE public.army_card ENABLE ROW LEVEL SECURITY;          public          postgres    false    337            Q           0    29187    army_card_abilities    ROW SECURITY     A   ALTER TABLE public.army_card_abilities ENABLE ROW LEVEL SECURITY;          public          postgres    false    340            R           0    29544    army_card_files    ROW SECURITY     =   ALTER TABLE public.army_card_files ENABLE ROW LEVEL SECURITY;          public          postgres    false    341            V           0    32251    creator    ROW SECURITY     5   ALTER TABLE public.creator ENABLE ROW LEVEL SECURITY;          public          postgres    false    349            X           3256    29762    army_card_files read anon    POLICY     U   CREATE POLICY "read anon" ON public.army_card_files FOR SELECT TO anon USING (true);
 3   DROP POLICY "read anon" ON public.army_card_files;
       public          postgres    false    341            T           0    30786    set    ROW SECURITY     1   ALTER TABLE public.set ENABLE ROW LEVEL SECURITY;          public          postgres    false    345            U           0    30853    set_terrain    ROW SECURITY     9   ALTER TABLE public.set_terrain ENABLE ROW LEVEL SECURITY;          public          postgres    false    347            S           0    30775    terrain    ROW SECURITY     5   ALTER TABLE public.terrain ENABLE ROW LEVEL SECURITY;          public          postgres    false    343            O           0    29119    messages    ROW SECURITY     8   ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;          realtime          supabase_realtime_admin    false    336            ^           3256    37108 ;   objects Give users authenticated access to folder 15f3vjx_0    POLICY     	  CREATE POLICY "Give users authenticated access to folder 15f3vjx_0" ON storage.objects FOR SELECT TO authenticated, service_role USING (((bucket_id = 'Thumbs'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));
 V   DROP POLICY "Give users authenticated access to folder 15f3vjx_0" ON storage.objects;
       storage          supabase_storage_admin    false    373    298    298    576    298            ]           3256    37107 ;   objects Give users authenticated access to folder 15f3vjx_1    POLICY       CREATE POLICY "Give users authenticated access to folder 15f3vjx_1" ON storage.objects FOR INSERT TO authenticated, service_role WITH CHECK (((bucket_id = 'Thumbs'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));
 V   DROP POLICY "Give users authenticated access to folder 15f3vjx_1" ON storage.objects;
       storage          supabase_storage_admin    false    298    298    576    298    373            _           3256    37109 ;   objects Give users authenticated access to folder 15f3vjx_2    POLICY     	  CREATE POLICY "Give users authenticated access to folder 15f3vjx_2" ON storage.objects FOR UPDATE TO authenticated, service_role USING (((bucket_id = 'Thumbs'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));
 V   DROP POLICY "Give users authenticated access to folder 15f3vjx_2" ON storage.objects;
       storage          supabase_storage_admin    false    373    576    298    298    298            \           3256    37106 ;   objects Give users authenticated access to folder 15f3vjx_3    POLICY     	  CREATE POLICY "Give users authenticated access to folder 15f3vjx_3" ON storage.objects FOR DELETE TO authenticated, service_role USING (((bucket_id = 'Thumbs'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));
 V   DROP POLICY "Give users authenticated access to folder 15f3vjx_3" ON storage.objects;
       storage          supabase_storage_admin    false    373    576    298    298    298            ?           0    16540    buckets    ROW SECURITY     6   ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    297            A           0    16582 
   migrations    ROW SECURITY     9   ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    299            @           0    16555    objects    ROW SECURITY     6   ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    298            M           0    28920    s3_multipart_uploads    ROW SECURITY     C   ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    327            N           0    28934    s3_multipart_uploads_parts    ROW SECURITY     I   ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    328            `           6104    16419    supabase_realtime    PUBLICATION     Z   CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');
 $   DROP PUBLICATION supabase_realtime;
                postgres    false            
           826    16597     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     �   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;
          auth          supabase_auth_admin    false    22            
           826    16598     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     �   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;
          auth          supabase_auth_admin    false    22            
           826    16596    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     �   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;
          auth          supabase_auth_admin    false    22            ,
           826    16980     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     |   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;
       
   extensions          supabase_admin    false    20            +
           826    16979     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     |   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;
       
   extensions          supabase_admin    false    20            *
           826    16978    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     y   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;
       
   extensions          supabase_admin    false    20            /
           826    16624     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;
          graphql          supabase_admin    false    33            .
           826    16623     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;
          graphql          supabase_admin    false    33            -
           826    16622    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;
          graphql          supabase_admin    false    33            "
           826    16611     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;
          graphql_public          supabase_admin    false    32            $
           826    16610     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;
          graphql_public          supabase_admin    false    32            #
           826    16609    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;
          graphql_public          supabase_admin    false    32            )
           826    16839     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     r   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON SEQUENCES TO pgsodium_keyholder;
          pgsodium          supabase_admin    false    27            (
           826    16838    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     o   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON TABLES TO pgsodium_keyholder;
          pgsodium          supabase_admin    false    27            &
           826    16836     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     x   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON SEQUENCES TO pgsodium_keyiduser;
          pgsodium_masks          supabase_admin    false    6            '
           826    16837     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     x   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON FUNCTIONS TO pgsodium_keyiduser;
          pgsodium_masks          supabase_admin    false    6            %
           826    16835    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     u   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON TABLES TO pgsodium_keyiduser;
          pgsodium_masks          supabase_admin    false    6            
           826    16484     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
          public          postgres    false            
           826    16485     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
          public          supabase_admin    false            
           826    16483     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;
          public          postgres    false            
           826    16487     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;
          public          supabase_admin    false            0
           826    16482    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT ON TABLES TO readonly;
          public          postgres    false            
           826    16486    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;
          public          supabase_admin    false             
           826    16601     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     �   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;
          realtime          supabase_admin    false    16            !
           826    16602     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     �   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;
          realtime          supabase_admin    false    16            
           826    16600    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     �   ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;
          realtime          supabase_admin    false    16            
           826    16539     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;
          storage          postgres    false    21            
           826    16538     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     �  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;
          storage          postgres    false    21            
           826    16537    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     }  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;
          storage          postgres    false    21            �           3466    16615    issue_graphql_placeholder    EVENT TRIGGER     �   CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();
 .   DROP EVENT TRIGGER issue_graphql_placeholder;
                supabase_admin    false    567            �           3466    16993    issue_pg_cron_access    EVENT TRIGGER     �   CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();
 )   DROP EVENT TRIGGER issue_pg_cron_access;
                supabase_admin    false    574            �           3466    16613    issue_pg_graphql_access    EVENT TRIGGER     �   CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();
 ,   DROP EVENT TRIGGER issue_pg_graphql_access;
                supabase_admin    false    385            �           3466    16594    issue_pg_net_access    EVENT TRIGGER     �   CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();
 (   DROP EVENT TRIGGER issue_pg_net_access;
                postgres    false    566            �           3466    16616    pgrst_ddl_watch    EVENT TRIGGER     j   CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();
 $   DROP EVENT TRIGGER pgrst_ddl_watch;
                supabase_admin    false    382            �           3466    16617    pgrst_drop_watch    EVENT TRIGGER     e   CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();
 %   DROP EVENT TRIGGER pgrst_drop_watch;
                supabase_admin    false    383            e     x�ݕ�n�0����|��%J�|�P��@b9C�w�ܮŊXr]�R�����z]���m��&�H�TMH�OQ,�PR0��N�i��n���r��ǩ��{X���s���g,�L�+-��]�T6�y[���(��q�*�cy�����{�ğ��Z�� ���O�5���ۦJ��(�<.�4/�//EF���V��"Pt�YM	<s%b�L�-a�k�����V�@y@�݀vP�w�5��Fq}�����{V���.�Aj���)�_���8}d|e��I忤%��<�>���˘ˡɯ�?�1jP���{���)$)�`�c�l�O\,�e��.���P����z8&���h>�ف����b.�L�>���I�37����(Y <ٳc�8n�ԓ�7���c�B�����3L`�N��&�=��Oφ���9�aN�Z�r��Lj��`���U� р�X9en蜌�T����1@� ��h]����,V�5��c��_�� �
��      s      x������ � �      j   �   x���=�0��=E�\ũ�׉� �8M�R��
��iX����ftd���MF 6\�����J��'���ʢ��?�XW"C?,������~��q<�ywK�>�����)�p>�����5(�T�6�u+}m�|�WR~QM�~�D�GZ����"�
Ϋ�>�ۺ,�'��W�      d      x������ � �      n   �  x�����1��OA��rlǗ}�\[����/�iY�&�$�/36��Cz�VA����^{V��$����/ĳJU����Q���_�Ώ5�7�9{O�4	Yvp�<t��w_S�zqS�26���V\AwC�X�b^�pn��c��k��M��n��]��F�����̓�'%�`��l>33��m��b?�T�=���7��!E��զ eup}E�ض��z�#3�Y��- <Z4���T%���n�W�S������Ʊ�}`V$���/�L���;�]㈦�b)J]��*��!��P����4��x���o�Xݠ�%��XV��A���80Y��(O�#�{�Kބ3���\%�`t��7����\�|Q��-�Ҹjx���`$YV�[�E���\�:�9���CYw��3��e�9@Bك���[s���v�����      m      x������ � �      l      x������ � �      t      x������ � �      c   �  x����N[1���St_͑����q+M����%�H�ZHO_���4��xq6��9�f�J�9����t����/'u����⣙�}�tQ�b+D�(2���@��DNiG���Q�@	h|�y�j�To�:��������j��b �"� f�5)��f�q����n�W�����T/��q�|��#�H}�����A��Xr��YiUĵ*:UPK)����v�~�����nR��ї�0�^v�Qz2�=o����T��iU�T48ɭO�Te;u#s�Tn�^��Kw��K�!<����zd-mˎ�o��&�����1����� ��zx\G ӳ���O^�
����C�� ki���.� M�@^�� �DKb�����[��nnq�	/n��R��B4�o�#���XC�R�۪g��mH� �@�Ia�ߎ�ч�:����ǫ:;WK�v\uz{�zcD	mp����`�5�3��s�`�=aF{������`0���A�      q      x������ � �      r      x������ � �      f   G  x�U�ˑ!���R�$>�l�qlk {���3AK4t�������(�9�~8���71�h�M&�藙~!L�gD�$_t�rz.N�贳w�c��n$p;���=����>J�A`�v<�a�d���^��mץ�R�2�NO�l�A��Q��O��Z�c>vV�u����Jğ�Ce���^�L��Ո0e�X׬6*Ǚy
-�7����/��pF},:�6/��r�R�7�p�9�V�E���B��35�܅fu�4b7�4����M��M�u��^?jl�]-E:禂�ܳ��T(����{_3�AШ<8t�|���ſ�u]�;��      k   f  x���=ne!���U��Lll�}���W)F3)^��~x�\]i$$š��7���"�A����!�=i�U2�#M�<	������r�")K�E�h@�Bz0�!1��W����R~�s]������7|>_�obxsJ�|My�7�u�%�ɖ��2Q��R��qx܂��(GR����xA��;��L�#��l}�C�S�؂��$F�|?��Y���t��M�xA�YU��4��z$	��j�S�����P�8*�S����h�u4�=�-]ȜL.���lĮ�ivNm5�X�X�Y^g�;l���U�D�s���x�� GYEq�P�/&�M��?Rۂ??��*��~J7��~���1      p      x������ � �      o      x������ � �      a   �   x�m�KO�@���_A��t�gڕư &_P3ô��V�H��R-MTnrOrON���x@�VL:�BCS�*k-TR��I�%�@/�gWֹյ���LY��iV�|ڪ �F���]$'I���辿���9�|q��s�͌�WY���W�k����Q	��DD
b��"�<FQ(�X�p'C�m#��L���"I������#����|� �ǽ�|߹���������?�����(QK�k�-�$�<��|e�      �      x������ � �      |      x��]�v۸�^�>�,f6I��/-e˱ݱ�\�I����h�W�K�v�O3�y�Yͼ�T( $Aɹ='혢�.���~y�Ve�bϩ�+֬r���wV�]��QL���N+�ٳ�Y��:�O_Y����|)�6�s�ĹO�Y�w"��sb'p<o��:q�Xu�:~��#����R�f���*R�*�i�b�̲z�=�Y�����[k��:c��s�t-���\?��1|M�6�����Aڏ����ۥ�xs�.������Y�@Ꭽ��cZU��1+6�U|����
���V.lDO0q����G��MZ�KV�.3��<V�jw��~%�`sC�˥�a#68g��e�{�V���Ir�[�������|�#y��Z����MTnl�|�_�~+�v�Y�R6�"�a�yZ��e���S�N9�6��%n����7�������zc��#}I�����<�	���>T���,�KZ��Cs�7�&��K8�u^ (�a>�U��k?Qt����T���7V�e�v�f� !�i�~O�<�Ғˋ�������Gf��Q��r�r�q���}���@�WX�3o9{Z���A�L�Hp�����V�CY��y ��xmz׸lǪ,��>Wٞ�a�=�k��b�Q$#�+��`G��	;��͆�K��g�f�х�_`#�Bc��;�.<WG+�l����D�����W��bq;_8��U��AVYY�z�U����������e�$� �ēk�J��ܸ���Z9)��-�״����`��c.�R����(�zm
�CA��J}���0���M���H�/�w�nW��
��Ô���Ѭ�,W�Q��-��T��T�!ߴ��Hp(�>���wȉ�����WwgOk�Oz�Q�p��:/��C�-�Kz9�����e~��~{�б�S��������P���×�Շw�@��W+1�:S�M�i�E��A$?�>�u�2�����8R�n�(�f;8GWي�����F�����ʽ��ĺ��s�r?e�뜯���X)ڊ�H��ĐǱ�=�r��:��V-ת>��i�u���H> !�R�=&��@��Z"oM��d�L�=�]�5+V�{YV�5JC���6��[������	?�i��e.�i
"8ȃ/��!8��-՟�<ˢtg,���܄_�"+���@#GY�O�ё����S���/�/�j���5;��'�P,�����j�;賗\_�^ 	m�����&���P"Z��G#u-��O��r�Q�d�1��m�;[���}�,���^�D��|Q�8BI�鑻��sl�S�^l��M��I��G���:!c���1�����+	�!ys��>N����bw�]"��]@ªU#Й�Rwم�{����]�� P���Cp7�x��8}��f"���q[
<��5+V75��'г]����pY���P�x���
'61�ٺV��4����;k�H�Q��prN#xj֬�@��U�E�"�`R�#�@�E�}���#-F�n���|���><^-.�>?��]�g����������{e�?�:�h�.%��'�\yO/X
,#�����{�^n��BN�� tT μk~�!���q_����<��	\D��
��s�hzZ�ʲ�wsn�߫l�\T��`v|l� �H�5�������瞁�_aÊC�V�/��DĆ)�޹�����0n��"��&9���U�+���׮���V��P���$��C����W��IL?���>����@��*�q�v��} *�\0��/E�m�0�!�eY ����v�I�=V
ܓ��_�Ղ���$q���{�����L1��|) ��%��$q�C�QP�݇��z�*A���ޖ��`���a�I��r�ll�? �/ⱞ��g_�G ����Ec�H����� `@|����[>'Q��/��ܽx����+g�2����I�qGFhX/�~��}4j���!�|-˵F��ݸ*���Qm�}ɾ���)=J/t����(R�ّ���� ~ܶ���=�~ �
d�p$/C��M�ArKn��\Twt0�jL��B/�6�y;Vo��4��9��[�χ�:�Xc�1�gr��P��|�U��n-�+��B�)����N���L����D7�%-�"ݰu����C��x~Ksp��#Lue�U��y�ư��bt�?c�����8��3:���$� �P~�S+u_���]�5u���ץ.�L�{�TZ=^J{w6v+��#�u�I2�ثW�{V���O�c���fuD�1���n�VgeE'��nW!�u���mܥ.��c���ő���2�ʪTy��V� �")��aΉ�0xg��$����;�VN-��OP��$!"A,�ã���v?�i�]�	)�jI�ۯ8(ݱ��-җy6����4����?g�H�\T��L��P�A�	��N,^�%��=#���&M��8v �/�U�Ș��Hзi�p ������Lq \M8�J�I���?���u;�
;Ń,8/|���hA�������P�ģ��#d&C�Y����XF��p`�$���Ϗ����bv;}�#�nP���#ˇ��Pjј��>4X�?��B����F�"�	�GYJ���,H,�3mj(��6�<�_�/�������l]��+ }\j�=��H��5����W�_�~���%�z�I��e����{�9o~[:��U^>�`?�:�v�X�v c�xھDc������6��M�>/���옳��$��C�%<MX��U��B]ti��MS�nS�k���@�g������OU�G��?����S�����N�Of�>s�<R�=�S�0��\0�o��C�L�*�ݾ��K�m���G�G1u��L�A�?@~O��]�Vdy]���W���G��_6p��:lm�7k�MZ.���g��ӏ�Of��4���1.�Y�~+˟�4��Cصy��:*-K4]L�7�{=_��.nu0��]o&�=�iaI�,8�a'%u���^�XR_�0��ِ��,b7�Zt�������F��W�x���mr@�yە8:���U���ԪT}��Hd"'��oއmm��N?{?/2g��R�Y��V�bb��F��E)Kd.�������j��^�MA�?.n=�t+y��	�8�7*=���B�p0W�����9���R!�D�`��B��9h���4���OWv�����DD4 �a�.�����Uُ���T3�d��cZ*�a�n��~%���ê��?���˂���sjmD:�s��}�� ��a!��5[mA��{R?Ps.x&�V\K�Q^�H��A7�+��ƽa���x��-{0���y� �;d��Yܬ��F�����R�����.��$�vr}'���W���Y����!�����j[���!}e��µU�ﺬ�Ԛ�7���>�n(��7���
2ϡ��C��.�mvˍ��'t��	��ȟ���x�^��K,�;I��bԗ�"'"��5�([W�0Z��-^ʝ{Cy�Yi����i}k*�� �"�d����>���|�kP�&QW�޹ F E��B#�G4����>Lo��%J9�9uG���)�o)�
{ �#�Nl��@g�`� c��#�?VU@�*�!''���/��`;,���
V��l_���	�SG�Wh�d,���a�!��V�9��eZd?��1XH?�ӎ���v�t 6�U�Qީ,~Z<��y��@�uXGG ��q� ��N��;S����]'�/u���H\�����K,������mFw�y��"σ����4�(���	�Ȉ'3��U?G��� �v� B��He#Y�(���P�m���rJn2���~�aB2��΋��^��`Ѥ?�?��#�qSYS�::G~��cR[�8���DV��\�'W���(X�������2ŋ|
,1��,�q����`Vn6YAf�r���p&�����llwo�J���_�g�p\��J�V�[֝���G�5~g�/HuF2�G%Ţ�    �[� }�.!aeo�l���d��b��Oo)�ʝ��V���
�Rvi�������ߖ��6M�o��	xQJ��sa�D䘩f���>��v��Kyh����F�a�Ȏd�/V���W� �z{fV��'�߻�Wv~k�\#*��!⏠�v�'ڭS�EQU��f=����5�c+��6��6�I�=�GY����o�+_u<5��[���/Sۄ���	��.�Sڍ�a��H^O���>F� p�� �3 ���k0�M��1�ء����y,��WZ����6U�v�;W�����
J�,���pd/eR��YoT�W�'JC�c�E�6qDz��Te�����$��Ǣ��{���"�3�*�O`>��x�����-1:��kR�.J��#�I��Á�AUyd�B�&��ʰ>�YAV�����}��9/�A=p�xL2��˘�1���B���r�~����KzaL����� �Þ�"B�q[|��f��(:���J��8)�@U�G#yK��U��H=d��6�����S�ؗ^L,� �Uu �P�GҚ�lU��ރ���i�S�3��5	�6�S�>�<�=NecC���>=�h�o��4���&�sWX`����`)��&R��">�� ���Y�lm���6��٬���=�_��P���s�a���@��&mp���([b	��$T�O~zK�$��(R��%5�=�1Iߥ���eU���m �E�!U�\�\^̂�+�.��[�>k (2����}�%N�a-k��KAz���� �j�ð�oݗ��J�~��:b�^��SEf�P��|E��Ґ�{dU�Jǋ�k���M(��x�B+`B)��,�߂����h9��Հoz���&�Uo�.'�#Ŵ �ʓ�� ���t�c.Quu����?�lr������*,���
C�vv
�;B�J�7p4�K�o��b��ɝ�ۊ�*���H�xYvjҍ�R����\�7���ӍY�j���V%����;I��D���=8zYz
O��+d��W�%#u�BI$<�{������=<(�UAiFa�kKa�U�}��Ҳ�X����{�,y�S�&�3Krr�<&��'z�z���+���9�I�5q@Eز�:Ĳ}�^��m˻���>7 ����8\��X*lU��^N�+ɶĴJ_��ɽÅ�W���U	?��j';��������0JeC�VŊ6l�G[�@b���1�H�B�R6��[2�c���)6�-�q�|�dI�;i)�+���k�ۚ�ˊ�x��w��?����I*A5|�6Y�����OQw��ؙx�ܓ�����Ou����K'��FAtօ���f� �:=��û�Nv|��E
#��)S3��{2C����[WM�(��"5-4
���B"X1�{�D�M�+���q�d��O�4%du�B���]g�G��!��nx���v�[���P`���J�N�XYP�Zҳ��DƔ(*�9�"{#t��m/eqd�U��i���r�H5$Xn�]cX�דS	����8�~v��<҇k�Ykw@D���D��k�#�T�QT�xS�\?����Tt�N�.���hg�6�lP���n����qؖX�� =�Hz���� �x�榬��ⶨW �=-<��?Ǜ�HB�H�� �Iz��B�͊���\W��-�nS��Qv2��L8c#?'��:��%���[%'���2�&���0�1P��e�5�QH�o��|�`�8Ra���:��������;u���w��]N�,Tb�*����b�����}�:�ꍆ����a�ۂ���)��	��a�>+[;vS��*w�<7�6>(JV��8�F����t+�1��]�t��^VΫ���%�n����˥v[νѠ6C��*o�W̱ڷ�,�Q+��S�9�Ϥ�e,���K��6�F��?�	OU]�&��ز�Gɶ�D]{�re� ETw,�R���=�a�N|�&0������y	��U �^g9���OE0(��s˺�+��^�4�@�%�T���x�j�|"�b��[&K7����l6�!A�v7ERE2����	����BZ����m5df4r��'���:�l_��E��C��� ���`�P�Sq��8�iA�&6[
��ݹ]n��b�N���́U`q:�+��Tե�'1�=���Z*6c���W�jX+���E8�Z��� ��~B������&i$�[�	AgEh���"Dx���#�َ�`� H��|u�u���l۞r�͆)���v�0�xF��l�����x�^p�Í(�;[��|1v.F�,n���P���T?o�|'���tQV�z��r���M�5F`q�9��%ޣ��	خ~���	 ��*9ӋGsD8��C�fϠ���H�И���q�]��_}	���d�����He��\g����"��MhHU���=b?�%�60��`��ώ�l�Y���Bw��c��v�R�/6�3�������Mz�[>���]_�Qu�|B!�EZ�'�`2-8T�Z��-�j*����2%��8MVn� �M��z#n=���i)�s���0�����`��a4öC�B��	������?	�.ʒ������m��@�p6�S!���|�bQ������� ^�-�5a����:��X���En���������Ҭ'�[��S��7�r����w�^Np��*�9[�\����ʦ؜����K=��"�^��"A��Aҫ��G\s�����1TXis�a�dYP��#��oX���K�E��[B:�n�a�@b+"$s��� �ʂ�l��Z�z#弪	|^Џm�Ҏ��}5�3��j[`M�
�M�� ��
Qi%N5J8�����ۺ/sP$��>>��4�Pokk$��� <�� 6��L�g��<Rb�J�P{ɉ��b��c�lW�3�c4&��Z�=���#ndZ�pH��Pv8F�p���JĔ��`���?	}`;���wn��G[kT���BK�mj���J8��y��1��h#�x;m��^�r�a��"CHd��v@�T�a��n�r!�ı�a/������P-�Ag&e��F,^Ew�q'#6����Z}r\-n����d>��Ӂ�����l�����3�m�Z��>��h�h`DC��8�,0 ���}�)s���+o���mC3��u��������	��|�Φ$�R��;j��)O�~f�]�|�-��� GV4d����p���O�PS�U���v�J�W��N��O�����4��͸��"7�֪��O�s#ϨhӮǢ��f*T�yBx�7������k��Em�b	�	[��dc�x��ڲ����٥�b�jj"e�ŵ�j��}8hD�q?�+Ib��KV�4��)�oDI��� {�AF��7<*� ����Nzη������ݕ{���S�?tZl��)�c�J��v]���@�~~�U�~:Ք���N�$�M�g�#��ٯ����2i8��,�WA�w��c���"r(8�: ���2�XIM.����s��Ҽ��� >�wmaBvI�3*_uD0�V����dk݉ ?�kD�Mx'h2�����-�f����ޕn/ױv���*��O�uO�lP��"׷ԊF�)c\�>��ց�˙{�z,�؛���ܥ�ɴe}��q� ����i��7���r�U�,*��j	]R�s��>�	��"��j�[ZT�|��6��R�O	&= E�	z.�t���e
\�9Q�*,:����_��$�ιC��_uS��X�?�o�ʼ`{�j���Xm�����vH���D��O�
���!�}Ԭ�(��TPoHrK!%*��s~$��Q�G��d< $�c�\��t"�ߖ�@mD�:z�	�vym��>�v�����Ճ��vȡ�O���i�>�J�$V��=<D�㱬r�q��Z�@�����
^�=K�"
G겟"���5�n�F�W��xhdj�(�."щAl�� ��2e���ޯ ��<�e(š�2��ݪ�z	�)CbE�7i@��i�78����΄J��V�b��hRt/�<�z����[{7�G��'��Ƴ�A �  >�d�>�u\�������1t�@���i�]��O�
��ߤ���bEͻZ=��PJ�Q
�	���\^<a�]�F<�0��t_�ӂ�z)��	�6��4�z�IO��^W��"j7e�'EV2�x��E��Y��p�dAH�;�}	�)s��Vq
�Jf�TXqss�_��΋�VK���v��WYm���Uqo�����A��ɦ��,%�9�*�h�W�#�E	6x(�(��*|�
H�zk�m+���uC�7�� �~��N����-��+��S�R�N׮S0F�XU�����X�Z�>��*��F<�slt.c��Q��_���@���7�o=�����hL�i�>�/^����8s�6���٣ڷ|KD&���H^��y2�
��X! ��<ϩ��@�H�X(�I/Bo^��V�d�����b y�gܩW%r��|�Q0�z���X [��w���,;�sX�ߊ��b�r~;:#Tõ	θ���2�P�;Q���`����[>f�9@����wZo�ҩ-�J������G��9�au����|i��Ji�Ha����Hz�?����V}��y��&:tڳy��6�rVb]�;C''@7��«rR�b�/ϋeJ���y�1�x��,�U�3+���WX���z�Ƙ��d����,M�_����T�_�~�sѺdԥG{�kw�`fư>���A xᙆE�iN�����Ǫ�T���Δ�ߘ�
��� �#u���}�V��pM��o�I���	y������5B0=��
�s]+f���MM,�b���W�.����t�~s����Љe.%l��c����v���Y�.�z^�	�f���m�e���K�hGc��M�_���v���gX����\=q٪[1�lG�����H?Y�~�W���ZM�	��Hy)�� oa���7�U9�M��Z)I�n���;�/*P�̫8��<���k��
F
�}�i�~/���5tQkYJs����W��+�+WTt)&��z*H��"��Ϻ��B;�԰D�b�c�x3]���W���U�գg�'C/�Q�vɝ4G�hl<T�����F��Y�C2��O0H��1��qF��
pǂ.�S�����F�`�'�w������s6����h$�U�cidۯ��r}'�^L�7W
?	�YO�([�!ƺɁ?��/'�7ض!��]N��}J���zw�`�|)|/��N��3�C&-A)����Go�[֗;�U�'�U$�sW�J%�r~�R�!&@�h[a�%غ��+����ǸR�'�!����)�'�Fc�5����W�����u�͞�Ua��^,���¡w!�J��8��w[�0�_�5WuI�^�C��lz����4�=G,pse	(�j���43LnĿ�+�R�H^��C�c]V{����(�������e��*�ctw$��1qb��@tԘ�7A���m�i�'ەĢ�­t��0�g����K��ߕ/�����v�=Z��h�#�����"�w�>�YZ��<�D��?�t|:�"�^=�����{ol��5Q�h�C�4�A�6��Nv �	h�����k�7��W�A�V�8�=�Z�����b�йh��$\ٵ�b��v�C�ȡ������P�/�0Ҿ�����Z�/S����~M���$��V�W�z��?R{K��
"���]��J��#��ۦ�W.���)�۷0>`����T�^
L�l~<���������j��v�������Ԥ�ƱK~�y�L���I������)r            x���r#I�6x�x
��D�4����I�
�``03�/N�Ix��܁`0O�sm�/�s�[�I?ɨ���������n�H��LmS��ӺW�..'��7���v�I�/�������n���Ǖ���C��O���C���&�s�ɟ�>O�G�~�=�Z'Q��]�x���>t,�+�����[�2Z�8���hx�	C��f�����3;߆_Ä.��U���a�n��p-N>���w1^·��fx6���|>8��M��c�O�q|��'��:��_���Mq	`���Ɗ�@�3��1؄�g� ���!����`���$������a=,�dy�OC����� .���{z�O�!L��E��2�f�z��i�0X��A���	|=\G; �l�@y�W���_��)��|?�i��ڱ��!�8ؾ��V[�c�/V��Vt���S���!\�`�_�>��s���5_R�=��78-l�iI�N��G5����%�:���C���Q�4|�`�_O>�a��C�|:�������;?57��&�u��k�=��}	�C�w`�<��C 4�_����u�'�v�60="�u�v�F��@dx�í�&�k�כ>�v�M����w�Kв6Sn�΄��ݫ�>���<�B{��87���1v��w8����<¿�������������&_���/����� ��π]c�O����,S��8���#{:���v�0�%��ni��U�a�������;.�r�0�h�N>t��w{=f��s����W���;���&�������#8n�.N��n��>�r��׋x��'���q�1���/���{�l'`M���:kӨܦ�8��Y�f�F��z_�ܪ�5֢W��C�k{w�/C|>�WCs���%8��� �����	�3J<����<�ȸ�a;ͺ����3�Ow�U�%�8�~A���k�R���v���0B���|������!��k �>���()g���"���3ͻ�+��5���jI8�3?x�m������U����ku�[4|��=���'Fbo)�8�&^��9ŉ,�<�����(���E;`�0�u�$²­y�����Z�5 �zx1����ë�F
���߿��u�E��/�&���{otu5CǓk�Bλ�	DR9WrI����|���Y��Q~�X��{�FX�`Ű��,���dx=�ş�f �yw817u��C�.�_Cx�����bL*"����5<_G�d��v���f.#�8���D�ᷝ�rbW	lx�f��3/�+.R��%|��io�$�W�	��A�ۨ����p8\b2;�x��Ď��K	��ή��af3����S<p7�8�F��i��{�a��:��Ԑ���"|�����8	�c���2��M��O�_��.`�����N��T���w&\�_� '�_���1^Fv�p������3���)�B_\��>\���I�K�,d��=�dX��O�p�8��7&	b)^*hԂ�
s�����D��L�x�:�R �}G�������̿��~�߄?������u���5QB�|o�б�p��܇�<����
\:If���p���2��������xB�Գ�u3`$Ul5S��!=���u�x=�f2�M�qeg�s�t:���F�Ƅ�F�M�*�j�q�&\6�@	���k�7��~c_�V��;M�o����Hm�z	mGV[Auԟ�},%ˆ�W�yb�v�ۋv9��f��e�����z�՝������ʗ]\�*e��}�S�-'�ҭ��~k{^�;Lmi��oP<�)�=�o�I��v�D��f�FMg�ѽԭl8�Ňzh=O&�������W���.��ߎx{���u/�����S��(���o�8���B�D�w��Fe&��u�J>��5�����.�<�Ш��X�'���'J}�*�g����I����ex�=����&�30=v��/�g\�EAC�I� �X�î`Ejp.10#�2���+�$l��J,��mz ��Mn��@�l>}2f���R�P�M�H��u�$H��E`�
�#e�
��~{��O�=��h�
�����Bz˘��*H�b�w�?���o��?��\���rA�	$�4�H�G�sp}��!��������y��kJ�g���6\���T�`+���V��4R�����/'�}���|~;$�85��8�]��ס��4�n���ܾ�gM���3�nP�k�H�>P��A�_C��6�v�Ym�]�������Κw�6��8�4�	��,��x��wf�h�p�f�����r2vVM��0V�O�K��Z������ӥ��>�9ZƜ"�ԟ3��=Nv���{��b�}�j�=PhfgpxP% �%�~w��#e���a??*}
ಁ���O�Xy��ú7�ScH��Ă��~�YC��+l�&KF���YǾ�ƣ�S��c?\6��a���6����0I`�G&�8�e�Ǉ65J@4�s��;����c�9�=j	�7����*�')�@��=��9�x�ر�MZ�'3cS`�5�>����aM;��5L���7�?�AH�=�gd���/�v�֡��������+��-Ch�>'\��pEж��\����n�F��!sE[d'���rl��ݗ�ɋ�r#W(nٓ-u���j�K�*��%x��ʇf��q>��������zz�n�Vs9��a�f�2�g1��hG��3���{G"m�ÁL��tp3:�?��9OZW�hM�.�tr��L��h���Y����;y��;��dOq�ƓOOV��J{߇&�D=o���x2CKt�)�پ�Gv��y� d.
�����m<�+<����7�O� ���Иn����}hvq'��닡)'Ò����>N��}�,ͥ�f�9���e�'"�M�@`�{����.x���@� ����.|`Ȩ�b�̣AΌ$��}�>v{>�2���J�N��~�a93:�A@��y�U�@U?��nn��q1�m��h�P��daZ.n���?h�&g�5?����s � \�4�$.4ZM�~��8����@��i���4_to6�#5d�v��,N�kԽ�`
lw6\�v�Z�`���Y�1�!h+�&�69�v��ϳu�q�T���Ӄ)Z�����pz1����W�/��i�ӵki�FɌ�O�բ�ـk����D��X�&��^8�a�-��C�[g"�ܳ�lC84+���5��x�㗼����uM���h'4J4�܂��<RȂ����*e��5�Dk���$ڔi�+�fd�2P�v�f�ZH��`:M�g��n�i~=���nF�ќI1bx]�������g���/�r���`�f�Q�P�LUh1�a\��E2��^��] qˀ!Eë�)�9����QO�: ��k�c�kC(`��-���6H�i-a���s���Q�5Pk���M���B�Vp����Ŀ���P�:�'�x\a/��J���<1����UJH��a�;��B�-� ٣����=ɤ��;��'�z���%<�~�\��h��$����y�W٘�c�`���.1��`��L��������n�i�p_߾�h{�S�`��p�^La1�����y|V�������;���iX8��Մ[4p;ӂ�dOTu
��.	��t|vC�Ȉb1X���(�Cl����ˑD���6��Cq�]���ur�_L���F�#�t2��)�)�O{�xt��
�y��R�#�u�>ȵ�G�}hב���`<<��c�$|�u�W������]N�n�ȫA����"7�������.��!�b5gt�3���UN;����&�]Z�r���$�bK��s�>BĄ��>�,�d�޽�ɓ��IO�`Ob����.'��k�t<��sc��y�h�����!�%�o�j�}}�}��X8U��c(�؇6� }�n4>Gq4�Rg�߉�h��g���t=�Z��ے�̧�C���8��N�*�]�Զ���DiU#�q)�ʳ�"��b���(    �B�''c�z�0�5Ζ��Ղ?������EaND31?fv5'
nݎF���&��f��E��BI�ӡ����j3*#�3d�3�I�YI�m��f������!���[来�s�}g�(�K|�m��SP"@��ηmr��P�|Qp�v)���n5���ny�=|3B��ȕb��MJ-���N�'vY���-�(Y#]�{�^���@�炠�ztj^���.'ד��t<�a�χ���膯4�s?�c���A�<�`�`u���Q�4�Tk��s�1fbl��J�2�l���3���B �k���t���4d�̦(n-�]�k�#�`3��~��$t8��}N`F�r7�l˚��n
�M��܀�8�\�<B�AQ.�4�U��v8��k&/X��5��c{.�������<��X�U;���ax|�VQ�7Tw�#.t�إ��	i27���\�� z���}�`�[R�x�$N�H��3�k�,�\�DЕ�q�͈��D�>A�*¸��2&&Ȟ1Q��;5��2:�g�G׶y�����]�D�ni	��y |\�3Ed��H�9��f�;�
�
�v��^)�r��I>�9~|���Y��.u:4��N�����eq)�c�8��v�`O�Ą��@��_�4��|	�o�w*�-�p=q6���w\�3Wegl�z�N��Q�aOڂJ��!8CK���	v8��s|����L�����XۻC����`v����E�Lz�VE;��]�Fyw
�^�>�r>��G��y�Qʤ�.�rtq9� J��s~EV��+�/����:7�x���;�&f��JF���z$�]�Ʉn�E]�R�o�6�YP���lڴ
�[gH1&������6f+F#cX�:������?�\�`�����m�"��mJ��UW�!Jҝ�Dצ`C>tAD�zW�����п��qY��_��b�[�f:�����T�^�zI�x�%��0����e�h>s5��n鿛��tr�y�c �T�j�7~8��8�@C^�G��h�r�Q!�G@z]�I􅧄�˭���	t�b.�2�	�{x�|(�3��#�<�!��켚�UFg'*6_/dRM�`({�єm�r�Zfx���l2>��)Bh���k�$���F���p�nG�,�D��K, �-��k���ާBN@�lՀ!�Qd<�4,�w�0��[�:xL���,�N� �r��g&�fq���[���򩛔�}��@�c}L���DH�8z�Ә�>e櫕#��^3D�������b�e������� ���kb,���#���~�*���k=�P�K@-* u�W����^_�hx���~0% wp���Ҹ����$�野��.G�������p}`H��tq|��DmX@�X)�V,�I�n�M���QlV�R�s�{�]=a��&xTuy���2F�y����w��r�8Cb�a��BW��t�O���)���85?jj!�"�d�kL�R������BW�"�(��N�a����X�����p
��pIΧ��V�T��qKSnM��@ϳ�u �bmYR$1X��9JI�J�E[M߇�8,z-���X�Ɠ�3�D�Vq�JV-�L6>:AQ���r��?��4֔9 tɌF�:��9�p��k����7g�;�:�����(QX��j{>F��)r�����?�	��H܀0��\E��r��i�Ϥh�*n���&���4��U
 ��N_\��7�����#�L��uh�J�����P���	%hx�Ժ���hڨ����:<~���Ӡ���Q{��8aJ0�Y����]-��:L��M��>���(��O���8Z`[�,䴍��bd	F��,�<kdH�O`0��~A���H��|�א������/�+�O��U݁L��FgC<�S�Q������ɺ7G����s�b�gö��%����)�MgS���e,L��g�0IĻ2�>Hn��18��4��6N6�h�`��6z��;d ��'��A�@O��诀;|跼v͛"2�xpAHm��_YX3��aZ�A	xH'	�`��� ȥh�LJw�gt��N�[�l�W�]�¤���D֥��9W�#��m��9q���M��mi��>�Q7�m\]d[�pQ�!:k��MƢe ]G˃��V�ޞ[\1�K=�n[�0 �C�����ⴤ<l�0ᡂu�v�~��{��N�o	�5eY Ь��.��/0�_�6_�i(pyEz�����|<]�;�E�!F�Z����������;������<�k!����L~�Ixo�Z�k7����t|���`6܎�6c�h��x�.��}�D2�8j���Z�bY2��*n���\iBn���.��f~�~/;C�ZI���!�x~�^��]��|:��qX��aD��`Bx��2��.
�h�*�����X���: ����N����+>B�������xh���L����K��*	C/K^�i��5Zk~"fd`�ӛ{Ԋٹ��[`��甃)�8Y��GD2%��ߧW�*�S�D��a�̋�Ӈ7��	*�N(�@~�d��GX�m0r� �3<��ZG�]���s���
ρ��e+-^�X$��AZc.Ta�ӷh��	��68ćc�1?��D�Dr�5��K=�Ba�j4�\�&�c�˯�t���i��4�U������8`a�g�a390��<&ԕ`x����DȨuh
��Mg�q�׸�}\�R�ͺ.f�b]�F���G�߾��`��mv{uE��<��k�Er��JE�v��s�ï���p�����Q����!�gVe����8�R�Z�{��K�!Nk���|)�i���qiˎ'�����~�4��lx��7��LG�L�{�jʳ�݉��0�u�-�$�J��u�y���<��h�nW�/�|�����0��1e���B�-��L����N��w���j͒=����BY�N���zmT��`z�/�*���9�|��k1�A�9���E�~@�Z�=�Z���b�㠏�K�
��+t��)�9j\d|�#M�l���0�
��� �r.��hfz�E�\j��:� ��;��<V+FHω���9_�����,n�:k
�DK��,o�2Q��u����lx=��3ލ�n "T�DtP��o%v��nG�H�Keq%�MF���F,=�c���>�4������ -���3G�M�"��O.�Y�E��h�O��0�F�;�B{0������!�(�7���2>z���ꍚ�iz�����ڿƚ�`��h�#�[f`A�X�fp|�JIl�s������  �t(�1ђ��p:�-9Ɉ��t�CG���(�%�kK2��`q�7y��{e2~�\戈�	��bq3�ۛ��jp�+�AQٹ[��ns,ű_�ܻ�i�=� lK�0rG.��ǧ���u��p���~k~~�m�@%�l����z$��!�7�}���7��G�����A<�鐞6��#WFh��ɼ���%i��(&���\��6��U\�p�;Ng��g���L���{��ڮ )��5`��D�{
Z �H��]'�;��#�����

����!�e�]4(���w?U)�D��i��9}�� 6�U�0��,l�2�6kػ�X3��L-��ӛAkDy�5®焬�7��{ m^��2��f�P�EQ��"�<N�?�ׂ%KI$�Z�y=�Q�k[Yn�RK�����^R�|�g9��]ø��j���_T����0^��ޱpٕ��M-�ʂ	� n�ѦF	�
rN��b���5�R� uҟߢG�.�f��<צ3����+�����"8�T{��5��^�ٺ�sN���f��>�>���>���n]���n��$ !����=T+��lcן����~�Ի��胾�Ǌ��z�HU��.��L�Wx/c:�A�J���WfJ��'֛]��䁴W����l+���<�rje�~|�XyO�'���83 
�)3	 z����3B��-��d_ϭ$�ʐ�f�붼����V@��y�z.Wp�`�]Q3);�I�eY?�[5}>���,    �w���k3�w6/F��)��_8�8�VoՑ����v:����?g����X�l����n�&5�q8�l8<'s��T�e��aɢ�K���	�k�Y.Iog�1|>����)�K���ly�Eu���`����Ѯv*�~�� ��#�¡��@��jf���e�����=���?�8����ٓ%��%H�-}0�z(��/�������iZRP(�Oᾘ�a��NU�ˁE�����:!��l�EQFS�^�Hї��|p=�gL?	��T��K�,�$h�3������.��q�-��lF��~��=ƹp(P�I=d?��{�-�0��|HU꿌f�jv���״`慆��tA
ɩF�S�ۂ_V
�i���I�1��s��E	4�4����]~�=*A�)2 ��[\�/Q��ت Zо_b��3���5��8+Kso����s�br��p!�Wv=��;ְ需���g4os�#����^�"�r>��=��H~��-,W�2�b��U-�i���6����;G��\Z��[#`��X���-���f:�@���9í�&L-P�c���9�L�@�^��]�[N¬{��G��t��0����0�e��3�h(�N�K�_uC&'��L��MW��1Ӿ�K���+�l��8��6��P�v'����t4�'׳��+Ǖ�[j��氿Ӱ?.�5�H�Ԓf�H�o"μ�f>�jר"c2,�fl��Ve6��\'g(��p��';��w����s���E~�-� ��%��F�O���n{�FiN
ܽ sRx�#V�*�]�JF��:^��Q*�8�>�2�C��]?�K��C�Z������&P��A���T�5d9%�9y�ZJ����*ɓ���^���zM�]�����"r���{@ۏ���*��h�8��X�e���خ�������%����"��������<ة.�T����.q�p�~�����n�v�뵼�`<�uip�	�,�F^�(��"�ߌ�M���󛹣U	y��d�G�M�πX(N�W��uޅ�o����&Lσ5�p������h��H7��
X�wq��}�
w��;�ex=�B;�L	t�B�Gljj.b�W͔'$+�m)�"���v�P��N���ţ�Fr��u �����˫�î�!h1�N�뵽��h�MoJ_&��_�#Vu�{!������g��� � �wW�M� z�}l���.4I�[�Y�U�;�;��`��Z���_ً},�}y��$O�,�N>[G�{����Lw�Z� ��$*Y�;m�fr{}�JٔB�@����5�R�6���g�䗈����_�1���1������X����v`�-�7�2<����ۅ/��&�N���\��f�?����,~��Ď!,��~�-�`�@�È���Uߓ8 9B_�D/�?��C�"�F��	 ��O �?�O�h��hjj=�f�v�h�N����uzE���Ufz���D���k~,Q��Q���G`��mQ�s��3��;�~��c�����=o�
����_=�^�����٥����i��Ihmux��Ϧ��Gԩr���8{���e��TȠ�˧0a�3�[�1Fm�l�Rb:����m���a�C)�s���M��/�j|�Ps���տ|�O�%��s���Z�ȸ�8�i�Ly��d)�z[&�q�+�X�Nq�&�M��֭�Y��a9>���ǫ��0��ͱ������Ud�ż��V��-���@?�Z�#�%�$N j<̰3�("l���Nb�'����'�t1I�q&z�P�LWR�~����*��݇]�>���c��7d�Xi+0E�0Y�����*�8�Y)��_�L�2� #l��O�\�u9��,<2��7���~Fuv�`�j�붺���Z���h�ɂ�gkn�*���G"�6p�L���C�/`�4M�ȹ���9����x��G a�XiZ�H@� �M�_�_�t&�7[�������M4�/�i|#��A�{C�Ԡ8^W�"o����uov3:N�g�������f�bؖ�@�9�|Ҙf.����כG&4�Dv�`%PX&#�7��< �e%q��`�|/�������"���܀���ЪPq.4�3����g���O�q���Q�"e9EBJ-
E8�j2�� W�S��5�y���<@}��������ő�Va�vq��.`���t�2�vNu�nȨS�]����>k����~Û-pͭ�K̄��#"���
�>������^0�����h��J<���H.����^��Y^�*)r�"QUOo�h��D�� M��z�7�ޟ/���9i���OD5�VT�J�P���T+���z�L���B�Oa�B�Vd�z��gz��`���߅U��������!��dGL�<6߯)]lhqd�B=Q�!��J��k�j����5�k��4��>� ���
�"չ�U�"�`m���z6	Fʃ�9�W�I�L�k)��rh�˚���F�2�3%Z#�wBsa4/O�\0N��2ſ��qC�����6�Vh�z=t?@��w�SB��B���a���� �X5��5�S੃�A�\���пI�h�x5�n��d���ټ,6���JBc���7-�j��Zf���=��hN��M(����0��GPCp�a��8�X�8k��.;Z��<���v�Nؠx-�:g8� j��� ����=䏠v��\
�'��B��~��>�jWɈ�?d#me�X�J�����E��n��Hq�]��'x�H�,��,��j���p��JBU�_@�)s���i/m�=��9�*�Q�#q�ÿ����W�ч�1�"|�����8%��>$	\>(�|�}�������<8����E5�h�;z�4�1��#n�
�*�qѪ�A�?7c�Hx�@�F��!�&����z.&{�7�i��k>oINԊ�d��%�&ʬi�h���h�B��<�*��Qk}�Q��Rf��p䫘���F@�Q�LU���;a��F�I�M�EH�hf�.��XC����P�@���]!F�p���s8S	��I&�L&�C44dA�lL�c�T�!��Ƙ���\3�WC�5�Ki*'+�u��~4j=6�xs]��p�h�\i;i:3ӳZd�Dg*��|̅ ��Dٿ6���dp>��L�I�4F3%O��X2�s�`�:2�&�y}𕏞��楊� y��:��:��t��5���I�'�)��#0�^��juX�	"[����Q�rF��
.���Q�ʏect��f��T�T�ZNL������ �m{�h���o	��h���׺J��(���ؠ�+��E4UUHxCJ�*38�?U��4��RҨw<��-����������~.�%#�}�:>�]8Y�H���8�X��T����pSX����b����~���Bg��G�W�z�;����p�P�1ۯ��V'X�g�Qr|l��~���g#^��là�i��\n��jk��ly���4B������{�x#_P�|o֢���<�?��h����.� v�9J����s30�E��<�D�7T'�<ԑyqP2�{�̞aRy�҂qp٩���%��j���X�'@���_z"�P�F]Q!�XL���(S�\��$�6��p�dq����,��5����4�ɿo5������WЦ�Laހ�� ۣz��h7�5ho_L�%��Z&\FF'edCO�r��?'>��h�C��()��
�v����x���B��$��U��y�ױF���ml4������$�<Ο�!���S��㌭��Y�f%az/�ޡ��dE��R|o��
�P���!�K,}'�w�>(; ݋l�S�tXN3�r��ܒmXV� c�,����W�K���}z�B5��#��O~]^�JK �:hC��_#87|W���� ѭ78@2z�^�CG-o^K�n����g([���E�'��PR���Wɘ/�k����6�kC�^̺j�/mT�/��n4k����W�    P�یX�z���0���Mx�A�d�Ə~#��U7����}�~̀37����>�UF�¨�lq2�V\��]^�FuV��οڦs���44�m#]��Aq�M�#)��*�h)jv(����V��Qj[������l�6�����	�I�˜O�E�Dn	�DX'��¶�!�4�E�p2��͆��o|Ha��]V��h��4��xu��|8�/�R��h��l�<.:�&>�8�����d� H�G�x���p�J.���c}]�ˤ1j�g� ��F\ZC���ÁA�����ܤ�,K����3���Kɲp$̲����-^<�S�QK��래}$S�\�	_f!>�8�.>�'�[؊Y.L�jzb�=�cRR���RVΈS�8h���c�R+U��� �:^p�J����vd��R�CGHJ5{d��i��h�*�&gf�`��(�3��F�AGc|0�<�+��y|58��0<�]����=R&�W�`0z���H���h�xkt$b#���E	L"���s�
�fҁ�MXX��̏�bH�КF�FK5{	Cr��^�([!>yha��`լ3��.�B�~$�pS���N�R�k��PIG\�t���Eᣑ��i�8K�	r���_��Z�b�Zl��y}�6g�/�C�l�L�;�L4dCr0U�k��3����w�'���q
���"�B=z�c(E��b"�`-���Q���+y6Z����t�����f�mV�(S�Prs����?B`o�L!���Y~�tn6b>�
��0\2��8���1�R��@�C�\����-����dT��`
9�lB�D�pM~"B�� �Ĥ�VX�?�|c�-%��Pb}�$����
Qv&ӳ�:�rв�:�	U�9$�T�n�Y�"�P�3�:�Z�ay�@]9J�fa֊h4�dV9�
mS|bK���\(��!b���f.e��!���t��l�.N]�T>ӤZ�?�+1sDgQ�Ř�w5��Fc8`��tp���бW�?�Ln߽��9��d��4�)JS��A��V�~������dp2=����'S1}�>��}��bƀ.� }�ų�K�Hq������IEl�@�hԁ� ���<��y�x�tH���ױ]cC���q<�(�I�y�1u�XĢ�ω�_�/�Y���7`p�I�+�@�K�߿�*�z�����i�Z��F��nM�D 
�O��?>2��j��6(��F0����>������\��r
�=��k��Y5��&+t�����ƫ�,�6���eu�	�ٱi��uδ4��h��k��\r9�\��ً��a�[ˊ�84�ԚB������k+EY�('����v��rg3���p_�u�8�a �T���$��.œ$�GmѨ�{��t'�M~�>J p�yנ�6j[mF)�9\1�޸��^�l�Q
�*�ޜ0d�D��*�ʎ��bD@�sC�K}8�.Mk�y^E��z!��X��/R������v{��)"%OdF
���i&�メ��aqPP�x,�H��g�̂�DN]3-H�=��)KhBr�D�y�.�g�lX���
��	֘����D�	%z�
�F��/�]��|rΫQi�����a֓-(�e�&yQ0Tz��6MꛮbL�c�9�g����*oh��ɬ�u������<�%�I%��)�V�K�����|
�+D�_�G7���|2�1���P���ĉ#=5Z'Z$�U��;��^Xa��Wd�����4�����x���fU?~!a�������J�<�I�W:"C��3���ߠ���t0\[������Y�FXY�:��@�gt.V�	`�#�c�$B�5$����sO	��% '˫����%ťq�Z�uT[Ʊ M]�i�ki���*�@^B1E���h�yWV�=�}`�*�hFe�Uf��D��&�\�*�ʆX唪��9ot�kֽOa�mI���o� �ǦR�M(Fa�;�kwq@�zjtkD�b�;��W2+ ����W�p�	/8V���۞��yºgP��|l�j~㙟�v��αv	��ϛ(�r&;��6�O����6Y��A�8&���g��J{��5j-��D�e�014�+�m�"W�qw%:
�9x*G��n�fSU��G9\e��O����Q:��y��D�����hylz�p�v G�TWb�͌��|W;ɪ�A���L8��6VՎXW�ks�?��"�:4iu�E�A��u�g�w���m��C�j�x0=�?M� �1I9nO�>h���,��$�u�`r:kY���A��ox?̑����I'�f�/���z��(���r�v�w2�m� Y�C�V�g��!�$�RS�,zOSGI�U��~˾$�	�g�#�Q�=<w�ۧ��+�ɨ,�������̺����9|��i�i�R���E��`K�D_��'��]�~�&;X�t)�5D��?�L��2�+n��u�ھO��l���
%��n��O�'�5��Jȋ�غ�6]���b�^�ͳi�y�����#�ґG�������,��6�\���:������ޒ�B�q���=��z�Y�,��ԟ	����ee��
��s��ěA�l�C�y�N�,%8|`Įg���F���=�Iv�j� B-&{*��Q�E��҆�)��LF�z�J� �)=a\�G����YF�<JPk6������'��hxu���p�nD�G�b����_����d��<�LͨQ�G�8 ��:ӵz���J����AO7�f8�*º��8�7)�%�d�j5�z��>�4���'I�!9�T+�:�ʫ�����ʷ5��\[�s$Rk8��G��,�Y55����-�bW�8�-@�7Hqԋ��3�X<�����k�=�����R�j.�6����ţ?�N��F�A}�)ؒ^����5�}���Z2A�J�k��]�U�#�'��C�0e�E*�,�j_���t���)�[��9�Q/R,4��N�L/ru��+a�m�����-��Y��./.���!�^�V%���9�H\G��f�
!�:NМ��:L"4�lM�M	�8� &��_? {�G짷`:eX�f��ڠ�Rw�(R˙0tw���h.�u�!l�^JX؆g��֥M� ]g��2B�d{�'N �
�"����DX�V˛m�'�W��]] �̮��h��G��#(�8��r.�(�� ���:��4'�xX���JO�!@�J�SLM����ڔj�)+�^l�x�gv�H�¥��ʧ�e�?`inH�NJ����d6�&b�����P�P�5�o�UNY)<z�f3xS�2��<W��u�Hƚj0���������N�3i�EiѢ\�	%�ڂ(t\��o�8[,���{5��<]����������1	J��#�����6^��>� :�Ǩ�\�M脐W�ɛ��)�n�ft��h�<��D�������a&�)y��f쨞�
y,׉���W�cι9��L'B���"ٍ���
�=s��Vw%lsl��(>ct�q|�-+"~��ۆ�D��Vז��HhY���*i`�>y`MDz�j�I���Fi��\YYE�̶�̷��j��+�o��7m�t��
��¹�@��NT�fl%t�BGِ�� L��pZ)Y�d�(�)F�����B�ʰ�#��:�&M!��0h"$'\�YpOx| ��T��I2%���{�-i�T=�c4�L�@���gݿJ?��쇏���)��O�>����dg<qA=p	��磓;�ے�lƖ�t{��Z��6ɢ:XD�p�`���V��*�I��*CC/�T^k�)���K�u�4�UnyVw���?K���}�y�g�i�[���t4p���>�W�'����O1b�D�!��:�� a�m�ڝE�h"|'�w����k> �@i4$��#�.�G��Q��'���U��nUt��q���|��Ӥ��!ִ��~vs	�ܬGo���E��r�"a����R��¨���>ܽ��������~,�S��\2y�w���*FK�@���>��Y�� �� Gfe�ht����FW�cg�a˯8�	�ՔӀ��    �I���L��z[
$1T~�D[�&\8�[�7��K�*�d"tӨ�g8v���1�Z-"�9fu�Oa��(A�{�Z�7��k"�h���8�#E̦%��8>��mK�c?�p6�\�����u$�_c��XT�;�sM��Wr�
aI��U驼�,���w�/@R�H*}>-�
�'��5��n��Q�T��:�=E�v�n�5�b�n�!kN��@?��W�憣��qn�Y�e&�<���WK��
��2�*Z�]�y�� y�I��Yr�O��-�5���L�X��
�cMw�w֏��Q���quhq�܀\�n`�-�g�8���)�Z�[|�D�wu�z� -I��iHk����Q����Xr�tP�0Q�(Z���BY��=ICH�N�۩�_f�lJm�8U�1!�k�<:���p�m���6B'��s�io�d(��,Amd�$J�IG ��ě���s�M�O�<�%;Wr�{��k�&`�1v�o�&[�$���D�b���T �=�;-;���D��v����u��[���Dn.3}2����uh�	��`� O��<��[�Z�,^
�c"��D\@�Z.8��
�QD1��%�P�J+���\�HM�m�d,-l*�)CꠗE/����
���r����(�&B{��;��I�,S�Ә��*�
�V�`���J/e�?�ɷ]�@'�e��*K�(��F���`թ��b\G
e�D�ӓ
���n{7q�9g�x�����/C�)s�|U�R���"x��*2A30B��x	�����j�x[MʘG.�3&Zh��|9u�)Cќ�a`[�qa3�R�nqD��&SwM�&����.k~��`�F�ˊ�iǻ	�`��V� t�
�|����,��ǧ���ǳAu�ZW�r��"��"7$Dmw=&>µ��S���Gܕ��}�7��	X� �#�ÙĤ<��cl�-/����cu���=i��~��_�R�/� W��~O`�&����ϲ����FGV�HA�L�����BB����ms5)(�TQ_���E�V�]VE�+�|K�'��yC�&���{���1�ye�Ҽ?�p_*Z�S̟La���<U��&�)FI9�QR�;�Z*�&�7G���@�\����@� �p��
�b�V���//��0lCW���z�y����.� 9{�ф��e���X�ZХaQh�4M�i};k�����N�;U{�R	�
=��{��D��N�;����CJW���4�U���֨�8iG���tP�J	<�+o��}����zŵ��I�=��\*Q�d�c�ߛ�oj�U�9�I��d�5��F@�6��N��D��(A��$�6����e>�0H���G���od#QU�n� ;��2��;C�ܐ� l�-k	�m�dيܬ��}�D��f��D{;��W����X�������d��捫rP��.�.��]6��j٘&�4��dK`� Xb��UO.0�Gy	.�(x2k����&�e�_E��#�~�%�b� �s���Q�B�G������s�~e���p�xUv�e�(.2��k�:l_���ԅ�-ٮe�Z���>�HyWԮ&OvZ�h�P����}�`�銤	���� ����-$�~FL�V�>KW����/p�����b]m�"	�@|%�<����í��y5a�-0U���^�6�+��̕�Q�T0-59򗶄
�@�����Uԗa��p�B�8m��9jׄ�k�huBT�ǘ�rO�8x\�	O�nl�=3�x�{��䌋���s�ǰ�"\8�$pW���0�ϯp�ց��5K�G����]m�����y��ܓm��@��� �m�&�ن(IVj�*Հș.[���T��7iЫ܅+žb-<�<(n��,��L9()�T� (������͏�NF<�N�%��b.�~���s���)�U����]��`Ji2' B9*�T��y�
��e�΄�HHD�	�����L�l��m+G7k�[�.�'+�yF�Ay2�pI�\�����H��Dk(S�F�A '[*3����^
J��2P0�
J^��M�e���B�hIj�h&�_��~�
g� C�&�^D*n��J\����J���d �xP��9vg%S2�՟&f�b("v�%�T/���y\�;~�3��6?��J�&Bk�u�4�����ǆ�G@���'�ύ�D��	��>�׻�+�w�W-�=��`a۴�e�=-O�XO�Ti�Q�	�W($|W��&v��� OI�K�T��J���� 49zI��]���_��MA�6%B�?��� X�c��A�N����	��?�~�T+®��*B�j��!ީ�7 ��=�.|�eԦ�"�袯�]�E-�O�u���ݖ7E� \c��3���r5��7�Z�z�E�"ژG�����d�^Pu�1���Ƙ�kxf�?l��iU�pTT:�m�֟��KJ��1z�	��/���C"%&%��t�T�ȭ~���R�w=�K�(�Z�z.�
?�H���Z&�ɰ!y�g1�����9��;~�x�>�͂(�b1u%���E��dVh B��}�$+�*Tq':��a*c�9�=9��o�`�����2��p�P�ta�L5�����ľfuk��x��T��y�s�	"g��8��~�q���3��Z-ء�~�4��X�ݮ��l쾓��괲��B��DA,�����15�(J��c	�h�>�I�P���5�1tQ�H�W��l�K|=y8$|�tV��,�ƂO�G0۩O�F	�MAd��q���'@�:�=��{ձK�y��'�L!k�<��\�2��:�?S �Hɠ%�(���ݞ�%�F�ʧ��<{����._�[ۏ�;����b���[���pa��g�I��a.�C0Z��۵Laj����u;4�9PÊ6hTN�H��_q�Y�]�������t<�ءL��$L�"�N@�&B�Be��E祗T�S�� �}�LCګy�{��4[���������HNkd�����4����!�V��U*8���������`v��@���XI��ܯUAu&f�nW\+�;t���tXN�S�j�}pu��6�)z�ȟ�b���ppS���՞U��c�3�!'�m�:�k���u�����D<�����Z�XG�Z��7�u�ptr�f���I/�>�Z8��l��`���c���n|�Mp��j|&i��(b(���8����~+m�8���p�1gP&,�B�i!�b���]�6���μ�<���	�3��VC��	�^�<ݽ�7���=�����e�_b�T^��?M��0c-���'G4���_��ӈ��DB����p�,�`��hcُ�	�y����zD���;��
JncxU��(g�����g���AG���m�����%v��5x!,�� ���-��[��Ʋ,.S�Ri������)�X�� �o���KC\&���RA5�1l��]�C����2��0J�q�q�P[YD�~�s�fX@K�ѧZ)ζ`�2�2�/Wɋ�LU�32Y'>���2մhi�^I���wR��_x>�)Iɇ&b��0�-y@$d�i��z����`�#9�[1�I�8�Q|	�տ�ÛVrݛ�a���5�L��RxLu��d#�-� �恉�h*
b�jv��Y��(%�!�F����W*���v�&����GV�Pf�w�L��f���Ú>h��'�c)2�Q5��-ZŁXҌ�z�9%לSd�2�/���J4���2���^����婄gA�_xԆ_#X�װ<����i���=>��M�Q�5��@L�������9�3x-V��)��T��M�ֹ��Tsچ���:)��4�b5�\ݸ��g<G��S?��e�-g���n���%��AL���;�)�,1+K��Gr�ۃ�أΡ)�pQ��@�/������Y�2���ц�Ega��ˠ^`�ٔ�&*1p����	OB����� ��a�t*�w&�.L�F$��s�z����ʜ�ĝ-Ҫ�	��8~p��1F��c�H���LK	�c��V��2 b�?)    >�1͠��CQx(ۄ!��xX8.]�#��ҏ:�X+���jo(i�cEu�TȨZ߸�9�L�C+-_��q���6g2f�ȟG���\��ĬB^�nG[&������[J�9<��p���FM�X9����_�"
�7�!�oy�Y��Z�AbC]UvY��qB�s�A��ZH�2� :$j�&Sk���=Z@�	�(c�&�|�!S��T�s ����[r���=�l��g���᤾�rS�º0CQ��v��b3N. ��,w݆���e�h�D7��;���mZ{2��;Q�JG��� Y)���X��C�ٿ-�x-c
��#A֠�$�F�|S�,���6Z�f����%�TϞ��	�t��1��^c�� KJr�%����BX��zD�\���L�}�)D�d���d���-��^@-��`L	;�W�E������ޛQM`x�;�*.幅8��.]��9B��ܾw���̔�#��)Ԓo�����>�:���C�J�����B�W ��Z�dM>�F�j�}�����y��|�-w2!Uס�]AцKX��
�6�*���@�4Y��W��İTƪv8���?�G�� CY�<�=�+�B�ZЉ	u�y�{2�p�� #�x��N�k!,��L�+2]�M����6
�o!l�#���l��8Y��X/��虝=c�:4�^�-��z�WN�e��D���F���˔e�o�mބB���$#�,�M~��J�	-�J{-��{ѥ��a������:UR�e���3��+Q����Ζ��7��pU�]�]_$*}J���`^!Y�Ay��
�i�C��R�*ؑ{��>�=4�1=`��`�@� O����%S:fQ���r�A��� ���z�Jl�%z.^�R_b(��F�d��<���;��n5@ D�fa�2�֑��G��܋^`��]!'��V�8���5��kWR�FUz8{;��%����%�8K�U�zv�̀
Yk��?5�8�@Ԍ�2��������ݡ+e�*�xXe< �U�R�շ^|�E�^\�&-+<�U���K<fZ)C�2�OE0� [ ��{��8^
v�[��S��h�@R��n�U��b�B��9A���N?ΪM��bLL*��JI�>�<$��Ӵ�Q�y������T���	�c�i7+r
]�D@������z,y��OK2��T��,0ݖ���S�:��C-(mI�`�;�@"��0���TX���>D��K�{?��o�"�r�E�G3��#T?=���ݼ͈�0Zu#vއ���9�u�(�	�HA�����O�"��ЊɡUɏ�j6���7^��e��~�hB`@�^m#7@eIj�0�,@X'��W�8#����&G ���9PV�4���q�Tb�p��0�y���37��D72��c�G�_�3m�L�ާq��go�oz�E{���l�����R|� xf:��<Jm��〳h�8�?��!�P��$ߠ�8����j"�ly�L�C��B��s�� -RzX��y2���b�p%I�G�в]?n�TlS!Zs/ꔮY6�5R���͎D�w��X��A���!�wP��p`�Y���T��Ej�nli�D�+
����W�8<J����ř���Z6�s��+�nea���`�*�Щb�� ,���(��W�=� Dm���N�P��`��j��	}�)mc�����4"�W9ق"��h
*㿶���v�[=\�~�}�����pDu�n�h C[Ǔ��v���ߠ�[  [f/	�� D���d	q��B񪅷���>2��4R��z��(ĺV�I�#������U&D��_aT�w�9.��aAQu��J��Ŝ�c#�W�e<�X{�#�s?+4�K�&�+�6V�,����5��6�5���&q�lBD�� ���)��3�W�SK�G��T`�p�(�9b�3�H��!+C��*�\��q�5�	��ET0�
���> �u�#�Ź���1���[{���I2��������*����FƧ����S]�"I>�f�6sg���P[z�N�Aܽգsq	�P���aSX!��-��|�5�����J��XLW2��ė)(DM:����թ�绚j�Vځ����/�
=��w�^�F��������K}�e��m���0�7��z|��\$CV+�e����\��3�7��,o��~B_s�G�X�l�m�B#�u�q���a9�T�r�P�k��e���6�e�j��ԤZ�����j[m���uQ�F�/+�Z�_^��ҢcB�)lWU���]d�̥��\Q�P�q$�W��F��P��AE�ƑIS�Ȃ*�AK��ҍ�����-����L�
���d�+ov�xl�2I���J��V�.�B�ԗ�.�Ϗ��-I�EC]9=�}����*V^�� �-�Կ*��������*n���-f�D��������0��3đ��;m��䎑!`u�Z4��&�ϖ�v�0憠��J��3�������T�3*�!��Vd���-��g3��Ǎ����K��wm�)<��l�Y�s_F{^�y-x�X�s�IY��?rJw�6μ&iy���z?�1ⶪ�7���p�NCٸh2�y�]��n��C�`{=�)�s�*����kЮ٪�v�lz� }�0L�CH�(�r�1�>U����Q�u����<`f��a]	(l���t�g)�)�z�2�Kk�+�1�9+G�f[��$p�Wfw	�W�����Mgos��Ͷ!b��k�@��Q ��J.P�£j�_t���:�F�L�TbO"�="�<J��I��=��~8���d�H��;h�UF{8�8}++Q}��%N,Y%��������H8<�J�,��)!j���FRe�Ƕ���q�0�mUD�V�NĞ���ahљ!u(��7;$�1�7k	r�ۙ�V�C�*+bV��aY���1�d4c�������G���5���--��tdI�V�A�(���.�e&4�B�s��#CLU�����cw/+}�D����ɩRN������2ҭ>�}���#�+� S�}�כU�D��r�'�Q5ڂ��"�"u�L뵬2bZ�f�S�K���ϝBȏ� tW�]�9�z�ٙ`�S��v��7j�|p6����"93��'/a�D��O�a�q G=��]���!u��lr{=N��|:�<�_��PǶ���h�j�҇Gc�a��������;�pmC�Jw�;����8�!P 0m�H�;�'Q�����,����kU�x(u�^�������9
3�ZV5�
�Z�偨Hk�SzE�St��	v�1��ZEbB�QH�H�,�8[ �e�2\���R:�o��&���:_{�4��Չ�3�Akb���> a�s�+�[����8t�>:�Ķ�!�P�R�M�w/a�_����f ��p|־T���$R�/����@� ���տv	a
�E�ßW���<�X'z:��es��ת9��۶��WןzM"u� ����:N^5�9K���m� ^s���$2�$���P��>$�80{g=�%a4�Ed� �vk�< :�m�M=߮A��O�T��(x�%�+#t�]�^�i�������IRRf^O0=�ذ�h�ݩzHJB�E�Т�	�l�2w�F��q9	�
~���Ix�]���s~9�ܹ�|ڶ��ݶ<#�Z� T��)�>c(5#�td��}j*���6�cyV��m����4�&lf�`�HV�g�߫KyÏ�\�w�D��/,D����bµ�K�%:XD���O��������d�v���RF��)D�CXI���PmC�s�:���:|9�*�=ZQ�2RѪP��^U]�7�4z\͏e��j�E����JY��C17D2��.f���?�?�Gˤ�{ep��!C�r�o��>J��(�E�_��<Z�ʆ�hi��.ӌdԉ�K�P��W��Y�-��&}@V��%QNۀ�c_�/:Y�\P����"g�PXIX�e�.���~�P��Zߥ��VE�    V�f�b��`O)&�Vvv�&�:[� � I6���`v)��O���ȍO�V �K��`k�R�Q�ߡ�����X�`:8������������5���fI�K�~hkT�.����t<�����(���/�gë���T�r�i]5�:��D�o�[2E��C-���f�4Z6�/8�O�_p֯q�۵:�n���7�]>�l{������|� �p8h	ʃ����)�pF��;�ߋ��쏦���<˳]k�z�Ng�s�S`N@�z�hU�7�ToHG,�D�C��=�F��1����U���V(�ڮ!��
��� ��S�&8�7��@z:D�H����ެ�v�^כ킇*�&01$mxe>ŧ��� �J�!=(ݐ��d􈌡�j�bVofj��B���Փ�|��TX��LZ1+��5�#��y7I����	�t,S��swf.�霃m��(.,z�N��v�dP	e���ޡm���6�c�k�!�P�VH�>�C8�
�U�c{����2aC��H����8h�#�ΰ����8�	?o3�j�u�F�y�8�V�dg�f�f�b�5��v�Ծ7{�Z�/q���̻�����9�y����	SbB��8$N���WYP� fM1�ZG!1'��o�쑜+�{����x�Ƭh=W@��<o�E�i�r Y-�)��ʃ��L�i�<dm��kvpV�����<қ��mIYo
ED-��H�-�����>�c��լ;�2A��$Z<��8[�"����70���Z����,z��қ�tiM��=����c��#W�f��@~m-���U��a�
�lpC����l�1�p���_�C��$@�r�xu��3a_��s��6y7��D��4���ԋ��Y�P��f�pu����6�����\�''�&��e,��g�Q����9���Z���^��8#����s+y�s�N��P�ʙ��&��Xrф�m��$E�q-oA,�+Mݲ�D�-T5�W�ܫR�yY���h�*����;Y��\&�ߢ��wY#�bP�#�Ţ���X*���R�e�F��D�Y�|���K��>e��^h��S��1C}J@��i����04����+�l�
��(����r%��N*���w�W������W+@O�S�,/��*��n"L��U��a��4���Ũ���O�H�8���~���c}�/k�+�V/�d�P\�r���/.����ܺ��)����e����Dp��BkU�=��=���9���F&@on����N8>>��9	o�$�&���N�.�?�E�&�0ڧb;�%9��@G�@t�C�x�b��@�,ߢ��Z�QJ��1��= �
$��	��6������#`I/�X�-�_�}��q�c�k�C#�U(�F���3p��,{�&y`漣�0�VO���w�`�;�����t����Jz���n%8� �[3�)�8d���'�벌�����*�MC�2�]D��X�Cܗ���ħ����tTG�@�o�w��X��]�Z^}�
���ٰ_�B���Wm��5n�l!�4�㢵�J�x��f�dm�X%�q�O;�0�s���^>G�TRW�	.^�O-���pb���R�,��mD�kQ�(ғ�9U%��\��
K�S��bu��`}T�q�-N�KW̦�P�o������w�v�(	���ѬP�{������i횇�^)�\��3����d�U5�)��O�"QEe��T�w�pq%�P�%]a�>| ⚓V��Ry��X�:��9���W��q�9����3jc����*�#Z%�W:Z�a�#�n�V�v��9*[tPb;3���p�_I��sM�EIm�e6[IgY얚�ϴ�**���ԌlM)�jhk���uw�%�I�ITH�́��.�Z��\K 1�ضHĢI�1���4�o�[��H+T3E O��H��Ϫ��A��Nï� g��9>�ӡ�@ц�v�޲#�	/;�b~?��	����K�nxXA��l�u$U|�� xya�:��>J��CE����7�s���jT��ަ����(�(��O�N)</U�aVr�#X�;��uGkd�pqv@������F��vӛ�p7���_fR� �Ay��4��>h�^�+j��~��:�G -$�%J��S�">K���HV�e�)�a(��>IO�T e�79�H
RŎ���G<��%�.]?�O)h�D�~
��$�Mh�Br��q�7�A��K*�&�AqR|r�7U�޶����k$[�ǟ[Y'���$��"�ߧ1V��n���b�d9�g���E�ճ��
	�f�,�UTg���F�H\ƈ�����(�[�HQ��eT;M)�xy��8���V/�V��Ì笐Tʲ$�]�]�T��^�P�y�ϔ)8	�-R`9�v˛��h�2�KoR�x��;A)���o��)��<p���	��"	���������4�3�lx�m��B�f�%���/�%2��Я�2��A_��&ކ�����ۈ_[Xv��)�c�i���L#���*:m�U��D�0�~	�@u(e��l����h��%�ʚ&	C!��/�s����LIKDU3�V��NJ]�-s�/�<=Z��%�(;P��~�y�n�;�F��՛��X��[(�Ov S��H�(S|�j�9VA�GީN!��x��#���^���T o�`*M3��8��f�)�d ��S7U���_�~�Ϭ�?��wܫB����eN?��m��(0/��[�/;�UPg�J����J��t���tt58�\#�`>���̠����������+S�FǕ�n�h,�m֥��:����*Z�7<�{x�PG.��H?��������ŌtՕ'N����'g�����L,��)m��w2ńe���D+g2>�!���;U�Y�6�o�����`P�c�5�On/.��ƹ܋��G��y���]�b2�ǣ��|2�Ot�,�߂p_�
M�	m�f��}�������������8gM��t0���n=�k�1� �8P� ��A��/4��F�4E�xx8-dz���J��%f4Jێ��CR�^���]�k�t�a?�֥�Of�&��]����D�!�y�����˿Qp�Ҍ�XJ*�[�F\H
8��vm��[LaY�c�Q{/K�.U*�Lu�D��@���֯`g���x��9�Ҕ�/�Vą�\��7;J8��� *v1��ü0K��Y��P6r-
�d��OVl�i�?��Q=�pD�Ǝ]e������S�h�ьꓢE����³���@���n�����	�޾��k%��2J�[+�RF�Ŗ=L��1?����(���tN8�wS%C�$�����dc�q)Y��Vb1J��XN�*��6T&蹋A�W�U��	�â���CV�Tb��D�Í�M�YH���+�oڴ��Pv:/c�%�6ߓ�~ǫ���<܁����T"��N�Gp)j h�{���<܏�p�.�d��\��.ׇf�+��>�	�2I�+"џTV�։()��vڛh]u�Gߏ�<���W�v���G�*�P(?<ʁ�}���`~��Z�;����o��rA}B�	c[��C��|����ڔ��b`{�>45�ޮ{7)� ��G��
��"L�X�&������T\,�R��Ѥ���E��� ���yrA>ud<=�-S\ls�"BBW��Q�,�_��rq..%EQ�Ni2+.��);��ɇ\�z�%�P�%A��lK��ՠ�=��%�7�c��9��HD&ɯ�Lɗ�E:�c\�>jn:�I��(,*�/�6W�|�A���Ë>&T��]��w�����ܫ`b��E��55S��p~�Zϻ���ؖ}\ĜX�9K;�cs_LXai�=GpO����.�<~�^�`3�K$����2���� ����
��f��%�S����w*�r��R0n�B,�:�z��`zv9���'���t��gc���D��m 4��X\;�S��K��]QR�ùM��b�} YԌ�<9:s}�m����K*4D>�	oc���c�y����qSX    �a1�@t܉6�ħ�t�itq9�V�͛��^��a/�o-c�HFn-�Yj��'�(kУ}Q�A�ַ0e ������ҠO��]f��tx=8�"���{�ސL���:�p�U3�7����6�~�����+�nɲk�W�W��:�DRK��D�9@J�:��h�D�"t@2��U}B}CZ}I��bP�lw�S�L������{w~�=m��:=<��r��]�n]�~3��S�A� ��NPX����U
���Ԩ���A�9s�=9�꾛`V;̗j�ɯ~��{�w^@C�9pQ�p,;Îw���g�l��r:`xwi�ho��˧��^B��e��7�#�j�����{
��������Ұ���p4��"p�_���_)r
E��^cY��ҙ�b9�>��E���hbW�__�l�yA+=e[��)^����t3TA2��= =!?�ԏ0Jgp��6^�U��%!���"���k��9��\x��l6���d2�Rܤ�t���N-�3�Y����#��Y@����۞��}^|K�1���G|`8 gzyF���������8�$5�S=AA�\w��K���<
���=���<�/��+�r4P��x�� �jdN>ՋH7���@��d^P�@�C������	��f��k���.ӽV�w��v�Bؚ�1<�����{ �~x�(�*��M_�+��3P3�T��v�
�j����g��0A�>�Z�*�n�$Uu��\�5H��G�Z����j!-�M��@g��2��I}ğ�٭��h9�|`ѝ?rT1; ����%މ�8�[����	���Vp'[�0Iv߉0-�KT;�4��7|4�t�%HG�k^|W�n�|(��:(K�i�ZnG}Rq߭��c�5%\��V�c��
�����WC�e��9d���<��nG���� k2�U��:R�`T�o��Hizx�dUdO��.7��ɬ��5�#ڔuM�����c�(�.ɰ	[��f�l����l�!�eݱ�����H�u<ݲMLq*CA���W�g�m���"��|�((��� �����u�sz�HShJ�`�c���W��9�1~Td�����793�H�G1k�Iq8ӊfaA�t
���s�F
2X!5d��ي�#�˧�Q4Ū��$���_�����`REtt�#]�����ȋ�Sp�GӦi�2�
�j���lbpTΏ]���͕N'^qn��w�!#t�E%����Z|��Z"2���E*ʇ�Px�F�h�1YK�l��Ƙ��L#	&{%BTg��Ӣ�_�6&L�҇,�%�"��s����f��zd��j�q�s+ S��TgN$e��������ό/ٍ!��X�xu�;����eR>�M6 ��4�lѠ��`�,B�B�{�MBV��E�v:��K�D�)�Nu�K�J��I��I	�����P�t�c��On(�Q#���$��մ٣F5]�BK�<�(Ɏ]|���o�φ>YH��8&	���X��X�-��_{�;	�}�7�4�G��诨.<̢�p6M�G�_�r@x\�:��3���=��H^�ԁ��!+�L$c�L^\z��
���w���u�I�W�V�B6!��Tu����TY<��X!��أ0���0[�B"#�Y0��f`�͖c��qcS�m��wa�q�Zg�rI�Ez��y�'�!�[�[����|�8�Mp�:�S�bW�=��1��+,q�T�g�Hݷ~N��L��M��w&w��)ǰ,��t>���LB[x2*������n:OZ�� ���I5xZ��;0|��^r�`fb��������E����u��Z���(�ҹEh�E���W�4��uCwM��X[���΅����^�͊r=
\�d���c��j������\���F;��Vb�>��i۬���J��!ر�D|Z_^0����`�._N�2�$�`;*���K������p��-��+�| ���"��C��T;����.�o�זT�����7���q�$yI���9t��4=T0/=ޞ (ub��*F��BO��vν(�;s'���I)$��b�YEQc>�������o"��S�n��f΍A�[�Y��@��1n���b�~�	%i�@0�Q4~M~��r��*��ia"WP��\�0���k$�����T惮�Gjg���w?�L�ᇒ�^#X��[�tݎ18I�^�����`�h���/HC__y�1*�G���j�w��5�hz:���V��oI�Fw.�0�a�`��=�a���u���>ώo����<����P�(��	`��� ��q ܶ&ڴ< r�p=ǪP�Ꞁ6��u���(�����Ga09��%��:e����I�k0?��r`V�Tm�$���s��Ȍ ���&ј�D4\j�U)�򧒔�1�ѓ�硍,v�k/�B+h��y���u&�?�<�O"π�ޔ^�[�-_�Ė�F9�r~aٍ �|�V`lԍH��(v�܉�I&���)ul��8ɠ��f�JX^�%:�R�/�y
�`_����Э�%��?htr6���LD�θ"v���r(�*CR�����n���,����Ыʕ��KF� `��"��&���8Ƅ��Mꉥ�+���m�����U���GR;Α�-#��j����XCB�g����;��Zj���.���]8��E����y���Qf>;~o���r{����R���O �#�ef��Sl���|���LQ��߰�R�8O����H�r�Ɣ�H�5��%m��G��ٲ�j��@ *�o��s�^@���x&f�������?���i�h��� xJ�B�u��x�����]'����a�}�
M+¥���gqW����|�Y�P0 l�6]�E� ���FKp���~�oP�8��Z����m
�|B���Z�S�VI����dO�2���\���OC\�����Q6�mgÝ��� ��6rC	`3-����D�2��������9wP}S8��3�X +~�I�jt&)�\B�X�0�@'6(�S�bv�����E!�lWJ0����_�~�dvk7]��L�n���:�d�Mt�[�t_m<�^cA���ӿ�^�3���#{ml\�'�^W���pq�����D�$L�X���ߣ�c����)U��.Hi	+�����W��Q��^�ݾIF�{#uA҈b7����i#u$F�y�l����X�6��J	U�d{�%l����Q�'�H5ߒR����]������a� &��&�ne�]�r�Hv	bP�\cr'�p�H��;�8i���N7
 D��*�z�M�a�@4��6�)?2B�&�^�s/xyAcЕ$����CYrR!����P����8 vI�a��U�Iն��o���:���n��w�Z�H��ȫ{������H��E���rw�g.�����2n�bu����\��mw�C�o�~�S��l�p�;��Ȏٽ������� ��O���r�u���¦�v8`��]өQI�<Y�`@9�p�\��*wy���U"��r�dr:0�t�\��ؕnY'0�G�|D�iuՈ�%�n��£ȥ�K�əb�.�-Y����zA�K�1���8��V^�q���x�N��6yr�����̩Y@��ůZA7�\;�x��o��F��� �+�q��Q����y���ӽ�e�??l6�n�dɗ<Q���t& kyGs��tb�ί�䳥W�!�k�9U�r?LM�������~T�&��#2O���o��-��ݭ�u���K�?��1F��g�"��L��.�����w�S�>U�'�T˸�hp���M��IM�������`3ƭ{���0he��G�o���R��m�{�1�L~<�a�"�^�<�җ���ڔ�CqaǠg��R8r��v�SGz�~�zAz�.zۣ�.4@�PSi���Zeg&����h���?�,Y�'fOW:�Tg8�6��������8��_�g�6�coM�@��Q�RO3^0[.�cI�Pg��e��^J�F~�nۋ���hD~���-�%m�Ѹ�����;�W��@��q%�a���ez�*�J��c�MS+w� 	  e�+,��raX_"�&m�h�@��6��r����o��l�;�\2���0qM��0�b�a��&���NFU��1l�Muԡ���4�Q��*��awh�Ao��/,�^��w�$Wf��;�>>��|�5uh��m��3'!��E����Q1���"�Y�����]���<~=��'���#�{��P.�\��^)ևr��ui�������t�R%�6�#v��"ˤ���B��G7�ԑ�a��|Ko%�0+T��^o9�'��YJ-"Œ0M��_�9�FJVl:��0�F�mN��ų�.Wؑ2�Toe�{�甞~���t!Y=��q9�M�f�	�*��X,ԃ�ү�B��I��QN�0�H_�yz�H�ڽ�f�9���(^��\7���7��/(������ǉ�h�(�F�q�H��z0v	f��[�d�]�D��2݇���ǒ�Dszkz2Cf�=�����f�ҷlV���X�K��������T� Gm�9��}���'o>��_���#����~(R��v:g�χ���H�7����'L����۷M�R֙��L[?�JC�ڂ����?xF���_)m֝u%sp x��hJ �M��7������3��b��G 4/F�Ѥ�b�ƭݿ{S����M[[���5gt��%�[�H�{������(x��۩��zl�宺N���`�N�s�|�� ���߯�-_��!䴽9��eo,��ԳG"�Ie�f7�ץ�ƣ[8]Q0�o���Q�5˖����ĕ��PIiR����,ج�{��G%�X��Z�}0B�rn#���F;��ސ�n�_s���$گs<�q�� ��-�h#��ͅ7_Fsس�0��.����\s���#vr��~�`�ڙ��|�1�BU�I-ܖ�ؗu��X�,񙫑��9���v��!��)�����,��T1��Up��DBT�nn̙���C]ґ�U��x�KI������n5|$��^IV^�'����#��σ�"f�l����J\/6667Jp�p��&�/k0V�x3�#{DHZ�N֠��#��kc
X�ȍᨓTV�$�i
J�?U9�4����j�t�i��}J�V	m�w��l����AE�����>�o�ק="�_���K2�v`G��#��|SE	6��'Bn[�9� �P�c��Փ1w���/����|�Đ��	ׯK�7@ð7�� m�|I��i����S���p��C�7�{���8GS_���O�$s�����!���͔�3�i{��d�A00W���?���c�-�Fn��
�y����bg���yp�����oB*e[���k��9M�v��v6[��Ӱ�[��QWa:1Ώ�0���Ve�ßЊm��(�M�Up�0�2g�1�_]wK]�v��{x�r�O�X��wjgF���ʔk��ai��6m�X�7��`p���(��i?�)�J���ů��^$��F�x璻�v��	������ �v�[�?��h4�:qz��M���L6(��8�:G�o��*�K
���bwN�� �Τ� �|�4�6�,j�������k�B6���K��n�7
�~�I�7]o�ϖ[8���h���T�@~�_qF:���m�e�M��M.A��o���B"Q����%���&�&�T���f�D��W�X�1L?��aCh�F)o&rO4��S�Tv�rC����/�8$4�a�O��	�������,�c��ɚ}��r�Xk���
�����aDu�x{��wh4c�`�&;�A�p-1���jٔ)�_8�RJ�7�2��+����|HS�4�����nBb�8��|+���|�.?}�/v��?����v�I���^r��H��][#��(� �"���X�p1`�b!���<�+�"���\b��,|i�T�k�&+}��	w���ca$:�ˀ@�6l�٘$((wb��UAH�����h��/��̴<l�%T�	9�-^e��z��%�����?^R���N/����/9�����VL}��տ�K�U��l�'��v���j� MgW!7�@*c�e@J���ʬ*�%*�E�\�X&A�9�=��0^D�>���D�`-U���e��,�1��0܅��wh^������X8��j��:�Ag�e�/�DB��[f|<Rh�J�\Y�_�P?S��SE�_��ÿ��3���O\��t��5���L�s��:����^6�s"�*5Ϭ{/1-S��;��c[3�f�N���??��(�p��0���(��x�u�k�B!JY})۳w��4�5�M�`�A���/���?t|�      �      x�ͽ_s۸��}��)t�ϩwKC� �Ύ'��d��5�g�T�`��8��,J��|�I�lRrsθ�]��Y�C��?@����<ďxr\.'�Ly�V��ˣ_~�����ji~<^?�U��n�ƌ��wsm����e�*J3M�g���7�_�W�����N?,�?��O�m�c?���oG�o��_��0�C&LE�(�G	�a��a�����X0
��i����X0p���.�<���g�'��nn�+���ss��wX�8$xyu��|�ߧK,�
$	�}Z��J1	��2��JEB��*��?�j�yQbm�5f���4?�Er$4PUn��󀑘�w3S襲���ƾ+�k&�f������wVf�p0s{����1����&Fbj-�jV��5��Fbi��S�p*`$��=8��
�˧Fbzw�t�$`$�w�/��Ea�H��i��V��YeЎ+�'1��M����2]X�o�X�(�$v���vZfg���|
d�=+��/�Q:�i~��^����<+��S$Nb�?dy����1$a�79��7�Mz;����|2^�������o��t��e�cqY� ����� dG<9b�(�a��($e^@7Y��ei���{>EC��x��6�[dH޼ ����:�C3���|�'f�ݬy�fL��9����������������S���HF#�4ovS��[��?f���ǫ@��/'sGN��j�|
(LE�H��wR7|Q��֓W�7S��zQ�X�H&F�0��{~O��D)�<��(R�]���b�Ȩ�KB늤�m}Z��_Y�tR��f6Ł��a��OW6��(RG���0ֱl�����Ŀy�/���=]�W�"F�jp�{Y��?�y����3�+�ɔ���S�|�Yt��#�Fa����)CO���Y;�z�km�V��t<��_(/k��,����y��f�����5����kkU	լ14��;�v�)F*a<�}�6�R��=7�bb������2&Ə�:b|'	y��˸w�N��yպY������8�xҽ�a2��LX��l�\C�8�۶�)�Dج�M����>��}�5]dc.w�P�oq�D?��.������t��|*�<�Y�d��G�>�v	��Y�H9H��w/!0��~�S�z	��I)��%��d!�y񳺳N�,��dO7�Ŵ�|x$��Q#!;�Q���)���IQdc8R���Cn��W�|����X ����p�V�1��>	�l}%7�\ɝ�	E��r�����^y1����j49-��0����v8�ru�q"��K��I]�^1��Rt�6��Y������Y�byl������57�|h��;�XI�݉b�0�Q�K7�͆�����ކ`�/̟E9���XYnwvD�/LyS-'���&[T�����;�:)m�Q��i>�l�eu��� �G�W�ϰ��v��t��@p:���=�,DDG6^e���B��NB��mn��t:��.[�vݰXI b
������������H������{���ā��C1\f�iW}E',�&����fi��r�&]��ȳ���'�<��߲:
$���Rv�uB�@����ҹ��	��g��[ae I\ĥI�Y��t�G����/����q I��^X,�
$��Lm�Tf�`J�@���bar�Knf=�pHC���g:͊��eg�la��:_V9ֽ%,�$�yl����+���+�$�f<�P�J1�Q�<��C養��Ă��ቹ~Fn*�I��q��+�T:`$��I��.�F�f��a7"MYd��I<��)�M1֠_��,�I�u����z�(�AL��fE��
l�@E['l�$��(���mJ�P�d�Z2t��2P$A��i^�ؗ��r�0��n�I�mp��a�p�@�8ӯf���y;�t�H���l~�P���"76��%�"q5�4s�/���U$>��ÍP�b�/c�"q��jV�f��V��`��� ,�������������|wT�N�k��g�ȶw�X�$�$���<�yD��V�E���݈$����bU���O#ix>7颰���5 �(H:@�M�*�brj�����5I�y�/��Of=MP1�X(�H�<�Ks?�0S�ng����I#�yYuݜt2Y�E�
6�3�.�:�l�Cbv7�	�+��u:�΋�.0�� q ���ͽ�d�z'$�{u���;�8ܫ��W�d��^��mϽz'��{u2���t����z�9ý:��{�ΎD�Ru�8�~Ձ1���5w��<Z$t7N�O�Al����'�6x�4HX7��S��|:�*�Z�A���?��m�80��"9��#]�@���`�\m�Nr{|H�,H�b_T�ꄳ9	�˪X�x6� �{I�.	Ha��buQ�`���u�*V'H\_V����a۫��	$�q{U�:�DJT{U�:�$DIT�T�zV��"$�êX�h
�#�C�X�l#*��X�p	�bQ�V���ВLͷG����*1�U�N>�X|/�bu5=����G�3��o �2,N�2^V��|��AB��(w��.c��`}A��Z�)��]y#����NM�N���	��_�wa�!\�`�t��	���� ns�_������p�O�}��	�E?����N2�$d/\�w�I�觠;t��I�E?ٞ��N(�Pۋ��ދ�N>�$|���L	\�0!.�;[8C��'��{���Du�I��Yq}_�Y����MlM!��m�\�߫���Ͳt�D��I}7�	)����N��7)��T�wB)�^ID���fwU�����dnn�����v�jKJ�T��:V��T��B�)y��y�epRAθ>�@"J8��A\W6�H�R/"�����Q�p�S�A}J�G�pNA��>���%p,A��$�`N%�Y�_�I�l�$���u� z!�]�/�m��/�H8S�0n*�d�T������V/B
8� !\X6���q�5ˀJ5�Y��b8���4��O�*A�ͱ�`}l���h8� A�K��Z<�&pzA��p~�c�ψȉ��`���������8�d�pm�2��q��`a�D���_�t�P�Y%\�vi,���@-��Ҁ�U����
��6<��F2D�>6�H<��x�̀��	�3�m;Я����@H��¸C"'�im�[zH�Hj�@仍�6���C���}�1d���/��w6�h\$Y����d#�xX���5�E
��z�]\q�\��N>�|{�;�8�-@m����d��b'ar������1��n��NVj�Y���)8�-v�� �H���b'��E2��;	5�-Rv�-v2% �H��#���6Lm 14{�;�"�Z��ڧ��I%@k����b'��E�=Z��T�嗂�o0�h-R���Z��Ҡ�H����ط�]%��H��_k��K���H��h-��	̚��"�!��N2R�4d�x]G �H@���b'� �E����>��N@�̀{Yj�K���(D���`�;x�ъ���	8	��ݜ���s�{$p�+��������L�� 	�o��}��<����u��V^~����G���W��p ����<����q�A�J��`�l3hN��<`���GxJ�4�U����1#S/#w;
��)��
#w�iF��; ��	��02�a�ɗo.�ڧ��E�� FDA��Q]	"����s��&��Q�8WQ=�7����9���Ep�E��ZC�W,��s:@8�<��W!���b�7���C)>�"��r�ys��RÙ)dw�v'\G;tp�g�>�鱆0рbnw�`;W�+�J�UZ6-}H9D�����h�	*��FXz@]Ǘ}HĘH��fV	�&�&���q�N��C�I�@� )�]�6~�V�ŏW�[��m+��ؕJr~��Kƕ�¸���0�A��f��'s퀵��3���q�����~�ׇs�x4Qw�>���d����d� �q��G �� �é����\ M׽���i���%u���ù    ~?4�t�9�u����l����^�ׇk���|Q��G�x��Gu�Zi��d��� ��x����{}�M��6G�C�����!��B<��{�^�_	�+���(�jG�f֑9�g-~xHV���<��������g��><YT���N��>,�����������8�0h��q=�b��P҆S������7鳜v�P��gSֳ)�pF��fLE@P�Tn&V�����fx�`3��hPI��X��S�=�v��Mף�h����>���H �c�z J'�oZYdV�+#A�Zփ��S˨(w�s��zp�vLG����:Ν�	}Pe��I��{�Ƶ,&9j�Uշb4����B����#����0���=�DR��J��#뱎0����lfy��x}MF¶W=��rF��	�s����D�!]ߣ�!��M	�3EM<g\_��p������6"�U�k�����&�+7,\R_��=��į"�G��=��[HV��Ѭ&\�����-�3�M,fT_�a�����H�Z�=^��o�P72�}�����1�������˪��:*����>/=�o��H�ʜ=0uX_�b�-�1��՗x����<$c6��D���&��<9�D�"&�OW#�4s�������u�&p�O�D����9������t�M�y�>x�J"g�����pna�G"<bJ���`A]rD&��߾ws3���_-����vQ #�	 Yh)/�igW���(�4 ;�P�d!���E��U�~Q��d4��M17eW�wUl�HF��w����:��:�l��LU;���!�6�l�MMH�.
���t��Y%vd�}�$���s387e�����`��l�2�fͰ���nѩ��E+$���O�P�l�D4�������ꜞ�9PТ�l��,���|4����S�s+p
�4��(�!qR�D�:�Ӈ��Ea-��hu��5�����!�h�V�xm�.Q���jI�W�ܨA��D���ld ���V�xu�AO$\\�?��5#~�T����h����)"���{�C&����C>z�ڬL�����[�	�"�)ϥ���Vv c�E�Q���ڔ��Vsxu�'B=a�.��k�ﳓ�Ǘ�������O"lxx$�Q�F	y�j>�QrҪ����M'�<ewŀ�HC�N´���r�k����5\<�q"e�a�� 9m>-@��E�T�Yj�W_����<�ǃ�	�%�Xƺ�"�!��$����<ur��;��?EC�EG<9��(	c6' �!��
����٪,
�.���L���У��XF'o8���kn P7|���)�Q1�3j8_�X>_�=�)�H�8֪��d�ٳU��*k@nw;��f9�@׹Y��eUOW106=����"�2r���)���t|�B�Wkƃ7����<7�;F(�ߧ�d|�-��ٵ��0�Μ}#'*������mO���7��qßMg�ɧ2�wG}�q�;1�F��x��6�d�|���?�;���ϧ�� ����5E�9׳A�$�S�{Q�=���}�d�Ƿ��4���_���Z�p���b&�l YI����.u�I�5�"���;R���+vxJj��`���i���r�"�G;bl�D�I�n�#��x7������P;;G"	�yd3D% ��2�ԣ0RB6Ʉ�׎�^`KF1�aҔ0i����Y�%KB�^�$r��w�?{��!����F��a�D4�$_⡜�����G�P�A��k�ָs���8j��8�M��������)�]��h�Ws(<�����M�Kum��H<k�9Ʌ������>��Mqt<t�B4t�i��un-9'IrN\��cs,�{�U���Z?CS�yRڿd����qV�+l�	�^�����>��$�h�8' �d���A1���:x������r`k=$X��TGY�["ējz��rp�J����0N�ٽ3+���-�[�E�>��D���`�B�#�K��A".�>�z2}	C���Y�]`
J��� 5P#�N�E�@y5�e]M!1�q���)/(��=�oFY,�$��;�}e2��-�2�Ana�xFYY�
�l��U���.��eQ ve����F�U`�$�Q@�����a���;��2e�5e�h���ww��~��i��ٓ8�S�2͝5$�i��]�L@J�����C6��Y=�uv�.�u!��,]"�I�~�پk��������	���872�����\!���"�D@ce�$"�d@c���""�b�C$��x<�D*���x�?HB��4���X.��3G�'H&�7�?���S3�HBdX.�Y�,36g�Y@�?Q�D�����V9�f!�>�Y�Rl� EM����R�(:	J�tk	M�Z<k�B���"��M�.�����G�V^��I"��󕙙9��>�Y����"+��B���{�.���F*J�|\��P��mFv�u���C·\e�{V��-�X�{���1���{�GU�"H�և4||�E��M_�!-�|pUؤPA�	�V&�/�es�����ʴ��U�MN��|(��j}� VbGi�H�_?<��L��0'�]�<&񮛓l|��(&�@[k���V+|��]~�f>m3�<����q}$�%�w��#�IP��B'$;b�9���M�+�lC�Am��G,:�k(�(ⱔ�j�T.ӌi�W��\q:%��Mm�^_�,����5X4�b�v������V�:�
6����MSD��_��ѣ+s[�+�L���-��9��������7V;��D��Q��Y�t"٠F*I�w�����DEj��4�k�}w��%�<�w����$�R�����a�FL$a�t��Q���n���D��&M�� �v��V�֦J���A��M�.�5M���Njk���F;�qC�����J�[h9bI(D�s�	��K�)n��X7$wٸ�cC%��J����E!ї�"d<J�RMo4�3��{f��3���8hDC�D�CӑsD!t��B��]�4��n?�����8U�K(�Oh���lx_�N=�@m���(��5DM,;AK��h�~X�g�z1v�h$�͔v�}�0��C7�{��BJ�ON�#�N�]����.Vq5/Y�iC�����t�sP���id����m-d�~H��Y���jG9H��k��޴r�E���7�-A@R�����:G��캲�7�j�hi�[#�咑M�-�h�L`zI3�Ye�t�H��q���L�d�B�^�
�MST�P	���#� JG;
R�e�4���G���}�B��#�I�h��z%~�T�(�I5��'��B	�W����F,�:Gy�<���D��G��t�t|$I�.�3��5�5��%�N��8:�}��[��G,ڑ�����2O��1o����W���QQ8�Z��C�݈i>�g|�+X�O���e��Dc-#�<ZS.Ga��e�&�Q<��5�1����"IJs֞��=��4@��49�����̠��&NH
t���IJ��]-����L�B������N'�:ʀF>f3�Iew�&�!geq7��Q��������������;�r��2X�2͆_rdO�}�p@ �Ѭ̢X�+S"��&��
���?�رF��Hвr��:��
!(�`$��`|W���r�)NֻB-	"�W�88��$-ﰅ����č}�o��6���c5G���z�ā}*�|pVX��$�V+��.�wF�u��=|Z�h	e��"�'����7��t��g��� �� =�h'~5�t9����G,�t���_�rvk��P�D�9-VJ4
��&]X�q��,�g�t:�$h6.��1? 4��i:�(�c�J����o���e��ɟϊe�HWn�̩)���b,����M_����o���;ϡ t�9=]c�����ۈdj�0�?d2�f;/+�
&cpK3#���;��cp K��W%�@�i���%R�18�%�N��U:7���G�v��W��f:Ǐ:P��ͤ�r:Hv    ą��(�J�\I@3y�Ő���[ 1�k��a
K�,I\waʛ�g�Ÿu$���-��M�����=f��$���,o�ݵ��[4�Iд��l�eu��A�WN��g�[A3 g�W9~�
هl��)� ��I�f��ݣɒ@P�<K6^e���Ea@� �����#�/$��_�F.�c�ׅ��L��+�	ϲj��F�u4uf��*�3cOz"W#��/ҟ?�[we�B�G�]b����&�MY���~�l~���d�b>�;��� ��	`$xwf�����?6���z�-J�<�h��/`Pއ�y��emdV��ì<̬��)ٿWS�}�6da4�wa-�r���b����f2�E1�@��0��̮�qT	
GW�Wi�X4�Dh�_%��,���#��g1���r������(��_C*W��Sjr5����9�_웜���_s�͇M-�x�����.����&��_��]2�P��*͔���э��dЙr�=K�L���/W�w<ĺ�>�l=���� 4È|�M�M�6J6��_>��l��H���txV��n(�'q7����Y�!kX �a4G_��T׮�l�/��h�;_�e:���f��':� m�L�g��t
���s
b��ǟ�����C1]�b�>���Y��YN�|�� �|.J�]擯�\��?�q���L��������y�BV��9�'���]-���X>keh*L~+�U
���j>GgU1XK���,��f���G6�hN.M
�}�Z��p���p�2�9�9�;�ru�ŵqM��ez3K׵1'��-U�M���K�F#�d���B9�A�e��L���=�u&4U���bjʁM��E�������S��ba��sV<���X��3�fEn��}������ʱ��7Ӵ���#N:�S0;�$��Ye��k\�14H#���o�:/�����A��?T,c�}���#NW��;.��E��4*{P{2��K3�c<3D^E~�5���K3��ҕ�&|�Y-P1I�=��[x��e��4�U0y�e�f�yX�,E��@/���8�`\���^�wiƯ�3��y�ݠ�g0��u���^a��B�=��hg��:-�%3��K36�>����ܰt<�)Q�;��1�,8��طc�$0�ip�/�[1:]��X:�h��ren�Y-t�Ҍ6[����vAJ���|\O���36X��ݐƋV���e���q�ga���0�hc��c�qR4���{8�D�I�hƪ]��y0ۮ�~:0:��L2{����K���e���i�<�!K�6�+S�۹W���94�ӌ�2)�źHw)0���Z��f8�U��>7����[z���ᡠ[@�73y�~�I@3�����2������*s�.]�"����al��>��������Y��!���4����ćz0(����jf����DVn3G����Wst��m�M3nϒa��<C#`�Вq0֌f�ߕ}��_�_�
h&��{>��t����h���n�S�HnΒ�F.��4/nz�F��:�0o�f���,���8���<����k���X�(���d� ����m��k���6V�X�x9Î��1Y4�E_�kO�U��E���5-Ӈb�m���U4J�_g �ۯ2t�i1�ñ����$���Z���u!��-�J{<
�ί��)��fX�hu������E<����#]���DQ@#�h�V}��av�b���:[� ���ňھUA9��y�}�ߊ�GQ4�7qۡD4��v��~�N>�����j��2 ���nt��lt�� ��^�MA}U (�+|Y�Јo4w�PTȐ���%�����[:w���l>�ُt��&J��n�㯞W���ml�)�7@�)���ʿ	ɷU�}#�7�c�^�A�$�'�}8%�Ss�ֆ����>���M<HJ56�s�hu��a�PSL��Q�;|և~�7��bϼ��bob��)��x�d1l¦M�l��KH����ٮkD�G�d���*"����yphq���>���&"c�_7U�!pv��t�k�m<]�Ͳ�c�)EXg��^��X�\�>��,�`�N$^�%��9�	�Z���6Y���:Ux}�m�����,�`�vS<��*��� ϩ�܀��&x��N>�uN���n$&�$M0��cu�Oɷ1��<)�#}R��g������u���tP�m;�κ��΃T0-�折�غ
�{lE�T���L<���L2�uy&�.	b2�d���QdNd]�gcP9GĶ[=�'�P�DDتj�cFP�D����	)E�L�S��(n���ذO)E�RjJ��i���E�[jȭ:S�̯��_�Y���5��P�=)��2FЋM�xک�w���K�2�h�B������0��re!�QZ�@E@f�����u�`?L�Y�c(�z�٨���D���k��~V�+�]W��u@fOJ���0�I@h��U�@v��M���Udx>����{73e�����̅�+��?��fs2�q������ ��
���Y���>t��yGh}���"L��BTa��`d4��E�F�(�d1�]����u�_�3ۣ�O	5�I,X�of�'�=�Qm�f�gq3Rof�'1sg�ic���i�3����H��m,�߃�c�`��i��d��`���e�ۍ��2Z�Z�Qh��I�v��P|��I�n\��d��`��m/�KQ����:~&��	������� �I���3�6��!Fa?�!>8���HJV���O�븚����.�N�S:��jQ��o�t4���)d��"pJ�ޔ�ٮ
Ҧ*������ޑp*����<+�M�ҩ|���Ș�u�M-'��MN�`Ίk�nۤo�v1"8��9��!4n"�`��-�~V���|D!�S:�_�Y�?Ƴb5��������(�����bUa�DQ��sCёl2�(��9�O�ng��;���ҩܥ�pQ�|*�H�J1�H4D�~�4��3m檢(� ��'�e���&�aQ:��q�A��JD�����Y��1d�"yQ��^������q\��ZNӛla�<3�9��N�@P:h����fZV��I)A�R��8�eu;M����A�Qֈ���	�A�Rր�����u�1!cO˘��4��$��xqX7�འ�����c"��HHb^�#���QtQݏLB��%I)�~d�}cu)�K[�����$�A�Z�-�^��(h]w,�@�
G�UM�e���z:
�N�u�2��=u�Bdu�2!�Ӂ�(N^�,�p���(���Y���I!qE��L��GŨW�M��p�S�ug3�>�4U76Ӡm&���t��L��LQC�%u_3�6��`|0���ф"eu[3i=rE��f"�������l����ٙ���wF�hQw;S��-�ng���BP�q��LB�1����ng"�'�C취�~g�g-�Hʤ�w��\�<� ���w��ܶ<cd��g�Mӳ}���oθ_?.�;>�u4�F���PZΓ���?����?��>3K|���(>�ji�TR��Ė����.���'��g	C4��(���I�q�PjG� ��i�8Ŧ0?6��ogC��FB��������,���YY=�����]ˑ	S5�1j���n^���d�I�ȰYAe �ޅ�}�;p	�jN��G)~j��d5K''��n���J�0�{�Aȏ��(���X�9qȎ��^O \�'���u�eԬ�˻Úh���[S��oa��]�T�+�рٍͭ-�RG������C��XZk��%�ko�dz�8�aC&CGF���\����K$Bk�p�f�h���]6u$��<��n���l����t2��(`tڢ��*�3�ֺ	蠍�}�Z';�U4|4��%D1�6��A���՗��QFl.vp�u�ٷ�E�t�[�,͖=�z6�z$�$Iv�O;D�m{h��-���zT�eA&W�9��4�I���/����Q擯    Y~��uco��2�M@��A&���K�����u5̬a~���7�bȢ拍��%��a�}�[�DH�|Q��D��,��������Պ�c&0	�x+u"���`}SD�޿���,gY�AP.��GĢ�� MMІq�� �ۜ�T�ko��l֚ơ��y��^oȞ}wk26
Y"w��f�hf��_9	�H	��d*t�����Y4
��eCf�'7��31'����Asڽ{��0¦�6j��X�;�6��x�P7�FE�ko��eݷ�6���;�l���l}�kʘ.v޽l֓hf��k8�������w�:J�^G�z��	�?cL�C�P�V�dԮL
"8.r_�mj���GQ&Up��+�Չ��C,G�~�|�sM�׶U}a�Q�j�I���\@}��֨jY�*�|�XHy��gq���%�m|�d��;b��gqר:N8�Y�(H�F7�\��ãP�p$#�vn#��ᨪq�|%,Jv´��^}��u۷l��C�sگc �����z���T�N�\�z�hv񾗩��:��]�Nņݷdfx�8�;�"\���äղ{wr�f*Ys�͓���)� �=tb���4�C���ޟ�۷pr�-Uc�@�^�l�͊��6��G�)ٜ�$Q�`$t���#���d�VH��#ء����H�0�;�&A��.�}?\�xs�x�$8� ���Y�;D�/�N�Fz֥�2�;Y�5����p?��Ț&M������́5޷�b�Z6�.
Æ�d��Zb��$E�PEI��䧸�������?�'|t$CkTE�v�[8xq���r��hԸ֧k���ZG�q��r�s��̡x�~��֣HD�Αk�8V�ߋ,���V��x����Ȇ=\dK��?:��:c��L�h�2
㆏H��!v�1��*ָ�(Tޫ�lo��1>�B����iGQX�F{�3ܠFp���g�4�HSg��5K���"��{f��(2鱔kԄs�QG�9T��GM��@ʑ�m<ݼu��n��1w7�b��0?�}w&���a��"l ���5��h_�5+�o�Ɖ⨹���tx6���o(� _|�8����c��Z���7kIb����(�Y{��*GH`�z.��M��v`K`���>�/�*�E��3��#�����<[�J�
YB�W�(�
E�5�$����Ch�0���	���!|m[���[��5_#��>H��㵍ś:���!q껟Նv�$6o�N��?F��]��8��,O�D���v�\�as��đx�~�6K�Mq��M�q�GE�X�<�y�����8��| ��򩰱J�pds���V]f�Y��O�Db'K������ɑPIܸE=��{��� �Y��κŎ�$���Ӝ�Tٍ��������R��J�;VG;:����j^Ĳ�b���ȋܿ�	��E2�YQ����$qo��v[G�*Ñ]S���aV�_���㽴��h�p�H�� ��2�r�GB�[���;	" $t�{��*%3$DC�ڦ�������K���ǹ>YS�M��C@:N����j4ql�F�����AՈ�w#�ä�M��l���ū��e�s�+���V4A����Q���8����YS'��f�і�Mb�k�Nεpb�H����H�$���m���>�}��p�XZLkP��@�ڎP������r5����9�_,�u�ۿ�_s�͇�0�~���r��I��}�������_�Ù��S$��u~�X�æ""���d��CW��X':N�9x�s�"QW}�s|(���fn&������%���fo�=�^����0����3�s��`2���ϟ�-L�����1E�[�n�A�{���) ;�(�;������WȨ�����?�d�Cι]p\�<�"��9���w`ۀ�z�Pi����Z��)�څ���Ŵ��PIv]�=����	�C���	���a����|Y��
��"��M������ ΂��@:�gJ�{ic��.3��}Y��2[����D��"�<��G�\���G����C����|C��z<�c<���:�*�:�$c����,��fV-��j9�g���	��{u�,����4�c���b�X{�W�u鏯�E��U�ٜΈ���������r���-.ȍ
��{}0�3���`���WGy������{��d����.���E���;[!lm~7�5�+c�z3��ej�u5~C���L�m����\:F(tm"Wי��p1�O1��d)��FR���"�<@|� .h}{���o,n&��	{O Z;�e��]*����*���k9lh:5e5�h��T�ug��
T�P0|��̨f�е�5«<�����ff�J9�d�leP�5���42��l��d/��u?��PEK�����N�?��dk�2��r57S��� ,�ߨ������=�p�-p[cϽ:��i���ra?�)".Т�^7�žM�>�C�
ܫ�<q���,0Ǜ�!�V��<���������߳�?��li���Y��0��C���k�e����(3�^��~ե�a04D[�����Bs��Ix?�<�qT�	f9��D^��#�c�0W}� x�o��geSwr�~�| ��G^������^�������E�
g����jf���-�s)�Y���M�*�brj2ԕH9��Ȏ��N� `��y_��ҹ�
>f���,����@/`�g��,�}�1K���x;�p����]{��
{k�>t�
�A���H|�fDz���
�F����ܞ=��
�9$�'��������l��H���c8#��`^Z�]�|rU3f��=�mfɼ���-30xO���Y�C���T�W�"�1��t/�����(��L�#�s���ߪ�w������e�?��v �&H�0�>��~��ڽ�\D���d0U�s�m������+���ޙ����d���b�f�q!�I�^�_���?ϳ�l��7���'p��p]��J������
��%�K��:�\&�Nȫw��S`��0Dp���"`^c�]n��/�e�7���Np���@X�olu������u���+K�5g8-n��trZ3x n=P�5_������c���O���i��V��Y��Qb�7�����r+8PL
�Z����*E���\@�ǫ�xoJ��(ʌ!1��1����t[��{v��S؎��z��#(�~���t�%��.m��A�ZP�5M{?_���#�ac�� "z��/��,P�8E���_|/��rr����:�C�_�2�794����(p��8��&�Uvo07
"���~��=\�ݘ���=&�P�A2)���?�����-j��=
n�%�Ӈ�4��UY`�s���Y��5Ǩ�1
�7&^C�Y����(lژ�o�]_�©�E�i&R� Elٽ�"�rn������(��џx�D676�b@nRh��un�)�U�j�58I���)-fy�8ϊմ'?�[�����)������Y笙�^
d/	��h!�3��ZO>�)���qw�-�����qW٠��xfן�ɑ���}����F�g��!�t�;�a�!4������gej�=�|����5�������ҧ������+b��C��!^��Y�-Pռ�C
�^M�YY�M.�a���0�6���������;��`��@G��r{iϪ2͆_rDq���4B�ׯ��Y�E�*&W�DThjp� ����Ss����I�A��Aj�a��4+�K��1\�y�����v2�����Į5�aCE��Ov���brb�^Z�a}�����ګg��ߔ�mvm}��j�Q# ��<M{��@�鬰�|cl}����&+K�1*����?-͢BЂ;T�����e�=�����`��g��&c�ХA8�\�����y�Y���EU~�=b�)*(y��-�٭y@��gQ2���k��P��K��=��8�����kn������F���
��<�5�~���txQ�(����p~���M� ���z��gŲZ�+�g�    ����G�Bp3�����T�~M�OA�p66�f��c��gu��}$�)a��C祹����L�J
r1�8�m\=/+�H�O	���د*����0������b�5�;�J8#KX��fKD�'*��ˌ��~��*�����#ƈ���6_�۩�O3����	�~E�6�=Ϋ��K���/��E9�W�Ϙ������!*���WϲF��07v���g_��ꑜ3��u�^C�����7���yf�s��h�|�ט�◷P�UT�-�|d~�s�؟ʹ��Q��p�����iv�� c $��Jn��"Gɤ�r�H���$������.i��p���{�d�U_#�Wv�Hɐ³�����0m��K���(L|�0b0d�d(`��`�
t���|-0�$���I^���IU�g8�_�ڑ9���Mn��;����d.ǯUɦ�|Wb��j�A2L,�_�ݙɻ"ϋ
�M�p�d�8�zQ�OA-H2fWٯo��s�N>�E�i3dPY)AG���˟�;m��j�R���J	�*~kB/
h�[L>�4��N���$��ǯB�E1�@�2i�2�ƄY $��?~�]�U�Ä03�ۿ���E�;|� 	z*����H4�$Ӏ�����V=�@+H2��y�.>�ó�J�H�� ��8�������Ўtb)^}��eU��rr�,��0\���Ηi�N~�`|B��^@�F�ԋ��@n3��P��@��"��V>��}�������2~(��m��!���=7�����䋓��|.J�@e�&&*m)�cH~|>�oN8��K�l�y�>���y�B�ĳ�-����+�d�[/�3�0a���[Y�R��Y'�9*i Y� �����Ҭnf�
wH+�R���/M
ݞ����pr���w�s@`���~��c�����F�b�����,]�)��[T+�Hk'��b��m�b^댘߶a@�1�Wd~�<�,o��`����rVLM�������s�@~EF:�{*~Y,L��O��"m���"bM��t���%�ZdX� �=��U�ɚA�E����Oh��T,dc��N�Ye��_^d�+R��W7��w��W���xe f"A?��=\���;�L���n�LF�k�Q� ��g6��NCۻ��:�/o��`ؚ�A��W�,E��@ϻ� ���no��V�7���wis�W�~��(*����i�� ������^a�@0�y� U�W��ϲ�uZb�O��]�J�_�v��hV3(d�`C�jU����"�cF��1���̯���}��gˠ�]Ʈ��+�wS��*o��q	
~�ׂoCT�8��qi�����jxb1)4�K������6]�x�����_i�q�ga0g��,.A��o��㺉C����@�3���5v|�x��P�2S�`�=���:㬡����c�!OM���W�7��rr^��yvȥ�p��e���WHsh%� ��W��ʤ�{�n�{6�s�u�����GH�禴���9BB�C����W3�c&�qh{�J~��9��N�,�݌��;������wE���G�d�Wy�}������{Zf�X�C/�Tq��٢��ЛC�T6)������3,8sfF~���rx^�Q�8��x����L�E��z᥆�iQ���f�_�+�-@rv����k����|�����8-h����~��f>ōo���.��������z��x��+�v��m؇���/u�UQj�φ�w�U�W5ٮ.4akc���i�U��� ������m�����]&0��/:tN�����;.��W<�kZ�����ȝn����_g�Î/}�{<��J�_����0����[W�W��k1�O��|�Dh�r�<nc���_�S��>wM�6��+��G:/3�g���m��W/��tenJT"�z�m��W���t�p��$�_m�?��u��~Ш���iydS�x-b���vc:橹�N��EX0���6^=��ä8� �n�Cn��F|�,�3��t=9Y�M��B��Do�9P�C��[��&-��g`nH���+��ͬX��{2^=���~v#�QO��S��)�F]����jV����<}p3�Q2!�E����}^8�}�7��|
��E�V�br���6䌙p�â��|�o���/>�(�G��Lɍ���4}�~|Ρ�!f
��s;ME	�ۘiP�{��_��2s�so����\�"�����68��)н�2tm����ۀ?PjцC�#���W=�M��Z���o�C$mn�4���ܠ�p���pX���,0�6�1�x���*ml�\o ����AW/���}�bm|�\ҿo���R���'���QK��i>_��F=8�(�O�	��C<����ߨg_��}��gA=��(��e���B�r��W$�{�m�����~ pd��f�����B��T���y�����/}��N��6�o���{������z_#Tڙ�Z]�C�wis�i��w�?�W0.�(��l��Ю۔[�����P��n�ؿ�D�	<��xb�v������66p�p���g]�b�������M�c�^�`r���+��foyo��M���L�z�6:�R�t+�Q����%��r�rO4%�ҕ������M��C�Z�o��t�Tw��x��0�,���wŬ����w<�p��]��ّ,P�CJ��j��E�����#�u$��X�Ʒ	`���"诊e(�!OM��)��C�Ulw�����_�Y���o����
�_?.Q���؀Y��^,�k�C�#U�ߓg%�C���l��i�����}n�+���7�EnL&��y�W��լ+�Q�`:�0�o9���w�sNb�r���`(Q'	�r%�N�?�Ϫt {;���`�(�oOJ�à��l�"����R
&�� Z�?���v���ކ��/�����+r��Gh?� f�����6}L'��5�mrp� c�����ҕW��d��9t���wXv�
�����C��0DU���M�{�]|�ć�1����I��	<*H��wO�բZ��ֹ�<���ޛ�fz}N��w�d���������sn.�e��F��e�L���yVܣ�a	NK�|տ�����_��������8�:����e�$��י����1L�5�+z����Zd��Z�0 (�,���կ�,�'��XM+(�����i¼�X���Z��
��J[����tQ�����)A���ѿ�=7�����d��/�mT��˞��� x8�Tm-��z^L�]�����K����}�yi�'fz`jg\����x^V�Z�kk����Iu�'� ��G�N�թ n4�c��g�5T	��f������$�(�����������x���%�{�M~��TJ����mj��
e`��'&yg?7����J�qgN�)N$�z�?�]d��O��:d������	���7�gE��`wU�B�9)�8Q�X���oq����މ�&���˲x�_�{M8�����G6Ok��q�5 ��b�x�t�������|(���fn&�kA���NK����;������L��٪s�V�9M�i8�G��4���.�q���e���7�{ZlU�O���,5�p?�0G>17�G��+��]Qw8M�2`o��]�Ó���ӗ�T��h�}3�|��_�j�~8aP!���_VEnp'#�e1*�Nc�7�3��}:c��P��!�~��L�ZT�I�yY����?��h��l-�曺��X�Q\�b����(}t��O��
ĉ�DG���X����Xǳ@�Ǥ����,=4����;�+��O�
� ��9�ď��s���wѨ�x<J����d�S��q��/�$?g�!
.���#j�[��E �ӿX��b�Ђ�@�g�_�܂{�� ���&��L�
��k�[�=rh���k��3�(œ y��j�[�`�#�׽C�InACP1�I�ݣ&��<��dߏ�BMr�� �  gAM� ?X��B�	�I~�j�[��;#	5�o�����>x�(��䷄��&���4RP������$����Fj���T��J5��F	�$�fG�$���]	� �~�&Q�z�X�AI��'y�$��>Kp(I��^�$��W �K�5|?����S�}]����B���nt��}���n}.�sEuվ�_��n���
�}�oꪷeՇ��[O~W���׽U�ϙ��Y�\�����U�-pؤpk�?Px���q�q����^��<��*�����o-��P�|_5x������`��[�H�����[Ȑu�E�Ǐ�o�C �,���j�68+�����wj7���f����T�?t_+м����TZ��!LSy􇦩��!�LSy�������������C�TZ��R�����>���U,`��w���TZ��Sc	�T|S����gC��wnD�R+u��`�o��,��
ح�A�a��G90
���A��(�ؘQ0���]�F�x��'`�bv�:���Rv��^~����
��b0����o'�h�z�8��� ;C`P�lZ�ю�`��[}�c@ܣD ��=��*3e�KO��_)	cx�s�4���.X�0��m��4��� )cx�?��1<-d���1<��w���߯<���x��Sx�C�dV�C���z��4x�`
�w�CSxZ�`�5�)<���M�iA�9�L���+q]RZ�������k	Sx|cc��,��a
��G80���\+���{g
�_(C�Q�Jk���Q�i�C:�����9��bLB����!<-tp�	�!<��QCxZ��R���%��=��$��/���_Z��a�_����/-zp����/o����?x�$��/����~yi�K�A��&
F�x�G�<��!�
�~��qBb�U7�Z-A�����XjU�B����������+Y�t}�7�T�Z��euȝʒ�G��,�v�"�N���.譲Ԯ�V�4���~�~2E�]����g2�y6��&��4�T]0��*vjW��_T�j�C-���>����a��j�_K�y�?,����p�-q�\����s�>(L�,t�\ޱ�s����1�Ĺ|���j=\�jƝ8��g9$���-�"'��+��z8��L8q.��K���$�mg	�\�d�8W�md(�O��IQ'�̕�h����o�~�b�GI�Q����(�$Ş?�m�Y�$�|?IOI�ֳ�&��nl��g�#)�z�ל9I1��GR�� P�i�k�؟��/g��'�3�L"yS�(n/bcS�Z��;�Z3w���I��LG�����1꓇�2)mZcs����������r��h�x��op��֧��!��"��;����d�$��&��1|~@{`8���?(U���?�����g'      �   n   x�eʱ�0��{
v��z�K{]]�L4ar!ra����_�T�� ��"T�uE�"�]�Lz>	�%�v���mY���*�K6��&����r8����DE���LO&� 5 �      �   �  x��W�r�8]�_��,�p�a�	����$]�&�S٨m\�����������!��c�"UJb��ν����wit���DOe.�J��jQI�F	���������Ґ��#�D	�1#0FO�Q*��<�ۥXoJ��P���R�w�,t�HN���5�Xd�;�d�US�c����u�c �Yԍ��1��������I@w�K�~��l�o%�l�ZEI�Gm'A��-���BZ@]#b���͏8C
 �(�"�2���{�4�c��t0@k\��%���Rb/�\��x�Y���\��wۿ����N�:�;i(n5�W�M�G#��M!M��w�M��:�XN�(�F_u�d� v*:�Ut v~��Y��7[�m�N]�I(�Ei)�0�oK��-YU��f���3}�}���{��5��`Jyn~<|��]%���(	��֖���Ҫ�K��[�~̂��E���OqB��ԏ���6V��T����3*�� �*�m2+ş��]����,��S �����z�.���m5H8��Z:b4�R̯}K�\�u2�.@�&���k �$�F楨���꽮�
y%�����	Gx�ڀ�%�%<t"<���k�S���q%��5�x@��^?p�=�ѽ�i>����(��f��՞����6�89�pWB�F ��A�U�:X��_���=LƲ(�뛥����Ћ+�#�N�ga����g#��[Y_�ߛ5��ִ�e��Uu��CJ�/������Mpːu�V���_�bW�q0/]g�� ,P�Þ�7>�hJ����o��֣���,AS��B�4��J�˲�%<���wp�>�M�!�`�[D�h͢p�4"_YP�ve�S��S��>{eiO�Y)�-������~���rMp�[�6\:�^L��m�O�(���h�����G=e�!&#��0�_�i��LYo�)�`�`)��Q��Y٤&C�aS�cw]l�0S�B�����-��d=-��W�J�U��U��=�ڭ��֢7�1�`�?�i6pW�\�m��Y8ЩX@�s�W� ��*X�XU޾�M�lw��^>���!βԿ��C��iY�� ς.��N�:
1�n���*��^���#�>f�w��v�+����,�];��>ir)�}��H�÷�,��xSAr����RB�d�ӯS���r#���!|qԿص\��;M�z����mM�0��~T�Y�D�Np�	9�A�*���      �   �   x�5��m�0�b1�(�{I�ud�@>�XZs��U+���j@K@�V�ZP{���V�����7��N�*����^1�r�9�[�n>�X"u��2�=��Ѕj舤+;�;	�%ԢfY;Ի$�|����K�vK�A`х[`�E�����i+v�j�~�����>��3v˘�kn��3Ǧ��c����t�����stԼ����W��'u��?�k|W�[�� ��1�?[�M�      �   �  x�mSˎ�0<�_�haI���E�v{X�e/�-8�:r +�T?�\��P)θ`��<��w��3|E�D�Q��q�"vx��t9��Þ��UK�����6�x\�%�xp�
���G睙�젽��X�Cm2O����	��G�_z�W��gۦ����7�q��|�=�5߰�w���5B�'m[�˘St�>� 
\�#^��C���2覧i*&�`�*����s s�qz�@rT!AA��	GJ���1 �������u:��&8B�%���{3� ��� g�c2��8xc3��H��SK#*�J(�� з��/�PԼCQ�"B;|WD{����Ur��뵷��\�~?d/���gP��D}�n
�VkۂR�-��ETa��h�o�h��A}����A��A��A�A��տ:�ţ�%=9�`�C�e����h�KoP�2=����`��rWQ�O}P4��h�i����m3��&W�}��{6      {      x������ � �      w   I  x���Qn�0���)�09NB��,��9�N���2�
�Bb�%h�0��깣�h/���w���D�5�|B,�K�F��'dx< ��$O�����B���OD��i�@L+���>�l,�P�6Nyˉ�ݵtZ��F����D8݀R����DB,�Gq�i�e�{i�>�[c���(�Q�0
��"�f�D"j�l3XQ�;�n=Z�N;��e��J� �Qp��Ժ�"e���vz�Z����\�!������P�͚����!�eQE�r�nH]��,u	�<
��j�U��Ft.���0�T��=-D��;T�n|Y�A����m�7ֆ.�      y      x������ � �      g   �   x����
�0E��Wt/3�����eAZ(V+&���Thڂ0�\�p�Ķm��X��r�$H���2@����Y�i#�t�~��z�uS=��!=8ON8�5��1o�n�	�_)������P���U�8|>�3��� �ƥ��6q쯟G�p�d��y��@Ad�J�Ke�-����l�      i   �  x�uVY�#7��:E.P���Y4(�ꮌ��]�%��I��\������.��-�����z>]�M��&��k�P[7Ҧ��qGIkUB�}L����ϡ<��R�Ȍ�zZ�U?�'�%&$UJ��W3R�8B,Cj���wa)&A�i�n狾�rmov�)�,��%�f
��D14�� �����w�޶�';-�|�O�� �̕��
*u`�:̺q���a3��g����ٽ�Sn��0�S�ى��Bl��Y�(~�Xv�9
e�����-�vj�)�AAE�w��RCVfE;W��y��H!˜���''����G[���j�c�4$8�:�H	��Ѳ�5@�͙&@���R�2��靋e;/��>�v�����@F`��J��o��)f�]�D9����Vk�{�䛪A��8ĥR{���"Wx���p�Y��~]�������)(� L��A E�#�%d�j�
�]��<#L?`׃]�3#�ސQW�0�6M�D����l$۟�B�nF|P�]��W�ܹћ������o�E���L����:ꘃ-����	���{S�ݙ!2�H���AG�[��:�n�=��Nń)%s��8jRn1`�Z���]W����,e�������< ��a=����L|ɑ1t�uQ2�5���\��6��<ݮ��o�og�/�Q�~�Ac���UF�F �L��ܵ�~��W���fnzr�]��-���S�K �V�T[(vǌ�m�=+[$v�����L���?�1=�|����S�:��˃3�6Z�ܔ$q�.ߊDX�!�9�y���r�rrI9/����O�m�j�R�ǰ��?|�g)�
`w��#��Ì3�<�_���!̗n�k�֏'�=/�E<���*�A��J�|����(ɐ}2�a�;tz;l�g=������' :"�%��-���q^\�\�x/@ċ�#��a�n?Q��ۛ|����z��7�X�P��E�t����{J�{��̄�5,G����.�����:�k�;��och��7P��� ����ܡ�K±i{�뫫�}&9��(�NA�ܛ�_�Ԓ���j>��}�8g�)L���	�Z�wJϖ�[w�k��c�ÖJϊ��5�v�}r�;�}t�/d�4�ܜq���k�Q5�����S�'e�xY�����=u���g�N����//0�N�Ѽ�m�{��Fd��� >G~xb����i�� �G�a      h      x�Ľks$Gr%���+`��^�ň�x�l?p^���HW����d�g7.� �8C�������ʌ�*�Z�!9�3�<��FIA'M��¨�EjQ��n�4=~�/����/�?��������p����/��O_h���Ahy��W���aGC0����G���7���7_]�����7��b �d0ݺP�M��d�-;��K���W�y���v�{�����w�����I?�t{S����ݗ�?�~I�m�������-�ʻ�7�޴�FNJ>�M����7��U>�p�w�R��������{�{��vv����?}��������'���"ب�nM(�0�y�����ؽl�u]�;��?�O��T��&FaZj"�q�)���R?ˉ�f��ǻ��v������]�q ,��������ә����+����}�R�L�YML��XX.o��j呬wX�.�|�Nx�0:Et&*�h�J��Q)�4G	U$DU��F'ȵJ^[�d;R������M�����v��v3R.���;��vE"g�Ε���l���Y�lO���K���cy)��P�W��Jˡ�>\b 1��-*�jJ�8#r�]8|��v��Eb)Q��:RU�H�-V�E
=��+>�YS�?���]��]]���Ǜ�7W�{�����?ַ���I�5��ә��6�U����`?��V+cL�Ҷ���ΆK�[��t�u��dzwTDi��%�D0��F���Z{�^�x[+}�sދ,����YR[�޷0��݋����Er�5.Vr��L\|+�h��-����>��j�N�cq�M���p�uq�
�{"-�� ��,�s$((㋸��ƚ�E�ճ'��>�B&H��U]�w�����/��������̎��J���ӹ�E�(f`�b]12w�~
+逗�5��	�"3c��.2��&+A��Me�S�
�� 
�&�I�`��]�!2�s�RcE��߄����������_��w�?��Owo�$�W6|e�.�-Dp��L@�L�!y(Q�>�#m�}jxͱNݼ�w�%.�(�����hO_M���4(���rA�7�_�*�q�6�	�
�B@�`elʦ�W�h�N�>����1�^?��<�ߒO��!7����3����wEg &�\ٖ�Z"��h��<+���sx��|�l�&U�-�]�Qd�00��VM�^)M!��R@&I5k�����a�\�=�w&�5����΄�YmZ�o�I��U��5f�BXl�g���ׅCR*=@z��h�� �pA�h+$��p��@#]��T9�s$Qu��'K�>�k��1���C��G_���s2U���2���x� G�xe]m�,-8�1���e{y��p`�(\��qBst�7��YVr�N4*Ԣ ��?�W�(ƫA��f��>�@s6#���u���娀W
V�Z@o��Mo2�&��X0��A������ɺ)G$|��01�I/E��Slݼ&;+{�*��IL^&O�ɩ��̳%K�G����3٨pٔ��7�e�������q�]@l�lJsx���TH&� ���G���!cJQ>����T�o)b�M5�s�5QT��*?�Y�|s{��˖l@���G����s���Sa�k�́�����%��,������3�}x��t"������ �vN��MR�cs]N8:��`��>2�d �-�� R|�o�ݛ �oX[x�����L:���^"�=�1���W���n��J�s.��>�"��H'�VX(��
��R U��>��D�Z�+2ıX����x;WJ�A*>�Mm�ݕm�x�F?��O<��5�ϡ�Zs/�8��U�Z���t`�?�t^�>�9Iy-��|�đl-R�m��
:�@&�c���P��@]����m�t,�#�ԟ�$�z�I�D��	��ә���g
\ <(��V��SSZ�i���~.}x�������Ig�cl��*Te'��k���
��	F��N�VD�=��"at����=�������X@q���HKN?�S���{�T��:@h�!W�a�ƭ`���u?v#�6=}*��N��Z+,�(�}������d�Z�ҵ� i x��#��\L9��,�7��=��-� ��E���ӹ���M���PСl�A/�
p3/1���1�8�}x� ��"�t͊#l�C0m��/@=d�/�q���0���*����7�	�Q�#L�����ӆ��9���Σ��W[*�8�Km����ʔ/ʶ`<�k3��9<}�j����Xr��-APǮ���L�Wp�{�V��N��C����b�tK�Sq���3�@��Og�qҤ�����	��;���([xӥp���������V��x�*Au@EEְm�A����0S��zP�֔��Kn�x�t��R� ��tt(K;�(N8�t�o���W�����M��5c�qr��,�q����u��b# q��/09�Bz�{��N��Ho�'��l*��*����y��b��k����������T~�Y� ڬ�<���9~�E�k��:�l������'�]Y �WI�nm�ú�\o��@`4�-�g�PN��
�-MQ���>����D$�eh>T����[������?ܶw�Æ����{�!�O�*'d�jH��U�t`�ZP6�Xfހ�_Bfn,���~�K��@�:�5�d|
+$ٌ%�!�x˘���9�|1�4Z�ٻ�����������J`���E	���$�e 8�Ўdn6��;EP����Y����'�+��t�Q�!��(<�=՚����v2�M�T{�?��1I����M)H���~��\�.=<��d�iN���ә��_,�	�$�A��KɅ�^T�A�ֿ�=�_y$���*�@��lߌ� M��D.���\u�1�ZOB���?��E�fQ^-.���~��D�Ҡ���yO��+�\�oS�_��u����-�����?s]�t��t�QL�x �c��(�:��?�2�@�>��8_��ӕ�q�^W���K������[�y����t{��Q_"w�<�H8���+�B��jnA�f�!s4_:<���jK�~^��0]���A���C(�FP�l�aF�$:x�+|��	����2R�1�cs��p�׫o�G��|�n��8�t���&]�-I#�J��P~*�-Hp��<�5���p�>,-��g
</`9@=�͛��rZƹ)�Wu�=�.�R��Jk}�����mY����U�̅W�(7.�:�tn��ZU�Z��T�O�jDa��V��Rm ���g��v�t
�J0w!>��F�撓�����_Y��h���i���H�OM|s���~�q}N��#g����9y�c�K'+Ly,Q5H����WD�,�/!-;�bLwX������X`�Z���M ������O@ ������_mN�ѕ�
�P�U�W�"���]�����q�(���[���O�NK+W�Sڔ�`�uĭxs�!Ң2�ra�%�2�S�;��)Y�99��� J��5�6N)]�fJI 2�����%J"g�����R4�;��ooޤ�����FEǰ�j��h����ӹ۪S��2V|�^�S�M,!/0���W�Ca�0��O�� g2�������C�e"\�r��J�|%+�mq|@��b�����_~���	q������y* Y�
��q%�B��
�/� �"�6
��;���V5$X�a���ސ+׊K볊�OE,% {ۅ����)rjE�P5��h��k��s��/���i���@�j=�t��<���k�ݵ�
y8Z�_{�6Ñ-L!9u� �QcS8�aP��/:��t���%T�u��#Y�d
#�vX�p���Ad�����y�Q��3��܋��O�jN3�J�^�}g�ΓX��s�\
��T $%v[llp�C�l/�}aƨ�p���*�T�´R*)
�aIjR�X���diz ����tpx��g�R�Gboo��߶Y���0�x�����z>kҐF��Qw� v���i��R.z-.    ��:<}@����M\B���J$	�G��T�m*Y�R�ʉZ2G|��7]����5x�|܊���է���}��{��]�'��e�@�S�km���L��ҡ�E�)���o��l�=�a��c�x߲p2�����6�@$s꺨�xS�.�d,�{	��ݕ��4��&�ts��tai���z����9��MۤJPM��5���7Y��,`�V�ʕ.�J���Gn��dr_���1�.����F��TM2�4g� ��H�+R4�e�ʯ7K���1t���Z�u�s��LH�{� �h�0v_%w�;��\X	�=�K���|���n���l/r���n@�ЯԔ��INС�md���Z�h^	�J�b|�}Q`��������M�oʗ�f���o�� ��v�W�J9�`�@�Z͓���tN|S �@�U.�����~�"�G�ʼN�����̇ǏWN�Mx�bV�9_+zoؼ��'hN9�\D�Gj�/ec�u�1��䰦Y�d%�{������]��qn剃�b�Q&���yyY��g'P��F^ԞK��8��%L�*����8O|�è>3�@�}�s�)�ɧڡO�s�5��z"�ՑQAfa+�y��L����..7�&�on�m�;�3֭�A�qz4D`�A�B�Wb���h��ta�7��ۭ�t�A�z�x~G����K#G6*�n�,u��b*Yr�L��$3�E�1O	��b�X����қ���������y���rX5ʒ]d�Z)x:<���͙��><��'F�sX��,Ii3i�ҧʽ�V&�\_(ápF%�ܮ�%ĺ�f���ӳ)d8�#��I�W��4HY<�o>�t�}#a�SUԭ�)*[t&_��!^����]��}�q�t�A��qN�
M���!����*���� 3�t�X ���!![���`-� �V��f|��8�|��Λ=:ir�oȢ\���lBV�H
��?o|�p�A��qQ�!a�B0k	�~� MJs�g���jAQ�~F� �A]dݹz�s����b����v�1��m;50n������N�����6�)��X$�����L�HPi#`{�� `�]#)j�P�7J
����ɔ�"��
� B�]5t�۪hMV)i�#��?_�������^A��ڸ�I����l4<�t��&� ��=d`3�e������}�=�Ѿ~��<V��DUI-fb�kJ���Z� V�|��f�&�f-j�54��H˙��Ǭ�_�����v�7��W�ܤ��-�Ũ)���:=��§JK2j��V�6��y~ӱ܌�H�o��p�Ap#�=l�Ce"4�0F���]��%]2�#���ǒ8��g�wa2��� ��������d�v!����B�٥�F�k������+�b��E<�ۓ�g΍�0�����9z[�gg��Ĝd�2�h9�ڽV@��/p�	��bs�\ζ&��qGS�c(2+�u�����ә�b5~�|u�������s��R�e�6�λ�;�c��0���0d#J�1b���Z'���'��IdMu�<��噘�3��$�\�Z�(���D������ݼ��$�Kc�8��}/5�x������.E������>��5w����;/�l����e*l����^�$*~�F�݅w��U�ٯ	���ݔ���������M�F��O�э̍��+�x�~����$k�a�a��7�0�B;�a��y4��d��hrdf�y���ZJ<D7 ��@��V�+�-�f`�imkh�N ����=�"zQ#x���x�|���6J���$@R��[R2D�ǈl�
�<}ച.rӁ��;ٲ|�
6H��)���e!��	c���@��!S�#]�=�v�.ߴ�W������p<"Xɝ���|�ɇsI)�.�uK��V����-'��ZYA���3�U�{�� u�t.�+��Ӂ�UF�,h����]5�tmvS=�@���(��Y�ڥ���p����ځ esZ'��3^2U"ǃ�T�&������ʍы��*^��g#99�a0hd_�ڋ� ��t�SK��j����� !�3�G~W�r�0@L
��j���jP����9�u�0 � �I����8=rS�J�SN�
I��� B�%�#}4o$���p�!���GEh�6F	���q��s�V�ԁ	�a�6@��N6᥋<X.�i����=m��h}�cz����ъ���R�:�5���K�q�D��%�_��c�b�p������JF/��>C�̟JE�����|?��u�0z +�EL`[�*��͘���������(� +�q:���0��\�n�[�H0xd�X�^�|��	�a臧��
�R� ��
��MWP�9t��xA���\%cxگ�"xJ�j��V�5�����B�n��������(|��<2�����L�Y�J��[�����U�.2�~��x�� �N)��c�t��r��mu�����C�O�Ep�17�Kn۷"������j�q/���v*�Bs;�ܟ�.��O砢'�2��>F�>���;u[���ͣKt�m�p�A�S]w3O�$\P�1����\jfV�� ��7N$�� P;k�Eݻ�r�Y-�7���o�T��y��sS�]k��l�*��e�������tW.1m*u�獢���%df���������fӓ���g�r�2�� Y�U��]�����߸��8��ޫ�O� �d϶'��.��UJޠ@��r���@O�Hnm�Ow��w���&�\���Qܷ1҄�3N֨��X�[/lNܴ�,<߱j=��:����}���?��z:�.ct,-y�9; ��+��h��zі����7;}wXB/%���)��VpG��3ۚ��';�V!J.%#��*wXE�D�m�ʤf���ԙi�ϫ<>��zn9��ʵڋ�N�r��2y���2�n�+�@˹����_�~fk���AwT�R	k*�=`,�p�QL�`�N!Ai�wjV7�^D��Ⱦr��(�z���V�~�E�����s��|�LHI�q��$ۋ�<�:X� |@��G�q+�?�a4���}9|��x F�>�`���J�}"\!�7�f�`�d9)�c�CK)֪�j;ݿ��Gh��7O0�=Z��ƅQk����ϠL�>E��Λa�Q�'�j�˭T��)���C�0ȓ�PJa�"&b�s�Ԅk&�^�M<��n*Gl�����OuQ���𱬦��2��/��?����z����3N�Z�y�IT�ࣀ�`��\S"��e5����K�jMw�����#��N�.���z�u�C�j���w�^���W�4IzMd�qg�k��e]&���iw������J<]��W��U��a#]�.����t���o�4�D��Ĭ�`���ּ5C���1�/���5�Y1�G�Q�+%�(?��('�@����}:ndx-G�$��4��[i��>ǲ\���᳥�O�sq#H���σ�"���<���VT<(�֚#����h��WP�l���^Ұ�d�:%���$�x��[�}8o��*sQ5ONv^ڔZ���� V�l3�4�u�����?�Cu�5V.��yಊ�9��]���j?K%���<;� 0h\;hM�h�O�鮍7LX�?���>�G��6�wrtJ7P��r��V�U��I�x��.��m5l�<}P?�}���[{�T�S�/�L`%@��H���LͲh`�+����ٕ7�����y��w���7�ms�������⩧��p�Uk'���Dp) ��M�Q�Җ�L<�3^�Zme�;"��g���aZ����<��Y���C�]��Y���3J'8��E����i�#Ϩ�j���eD~4���y���XK�&���k�� ���.�Á%���Y�;:tՊ@���a1�ep�n`)E�
Vc�VF�fw�d��Q�x)�]����` W7��Q�CK?o&L|�2��$g�·yf)��� �2W�gi@&��C�rE�S..�!/{��0ڎh��������X�p�=慒�EU����BI�W �"(	��w�7    0J��z=ަ7i_G}J;�>ڇ�W�O=��+�|�R
��\�e�"Zo�r�[p>�קW�3��;a������~%b�#�[���U��^k���t�&�Y��-W[�]�e�6�w�w�_�usf��A-@�٧G�4pO�2v�s��,�W
,��Q�E�W�f��a�W��*�y�����g-�:��#M�!�bL"�w`��U4�1̍5�������ϧ ְ���:�0nЧ�����ӹ�:O��`~)�ջ�Ie����B�<�H,~<w���Pt�u�%)��[Eؾ�lR�VL��Z1��`��qU�7<�ִաv�><����l�Ax���y�{h$9�ݳ����Z�*��r�I�t�Yv�x�� n���3�S�E�<�D��5 �
Z9��B&�V�)�+�����"�Sm5�����޼�@?���[�&V]�Y��ԉ�`�QZ )���Y��s .Y�᧗��Ʀ���8aP�K�a�\�B���_�,m9�oH�x*�����l��À�+�nu^��O�|�hj�h�gFN:�WA9�k�w �@	�;�J�hۖm��%���&�F�
�f���4�	O$�	]xo5P�b��d�G�1G{�PdUi��~��*���$�7�$��Ѩ�T�3N��&�%�B�#���F_�UL�e��.���m7�a���(���]܈&j�UNmj/�9F�+�T,�[����j�%�ԡ��ɩKL��VJ����uz�����:�f����<xL�)-�����̌�w��nc�@乄��ƣ���x#	��K7AŤU����9蘡=IN�(�~�:�U��;�m��qy�UP�+e�8����H[�q^���=�I&��i��#��T�D�چ�w�0brͳ���Q��8���\f�����T��	�x,U��R�D����T���>Lr����rC�vj�N<�c%S5 �2J ��m!0|��oƷEu(�|{�.��:�a�KȊ��q$�$)�DH�W�v�:ԥ�y�*�}�:Ϗ$��� �BM�v����y�ӟo~��{s�����O��c��y�G�Ƨ���*�k8�Tcʼ���*��v*���ETy��1�>�a`Ꮼ�5[���D�9��%!vS*0�ad�1MGˣ�x;t��_�b�]v�l�h��M�NN�,2�g�E~E�<�a�jCR��wr�%��
�cA��%'OhU�Ъ�8��la�b�M��a,��LCi�K�M�B˵�<bȴБ	�x�x�Q���a�Cǋ��7��qz�c���}#C�gb����2m�Z���v/OP+�A�ͻ��U�����ؠy���\� �(�WxX[E��=@�-�Z��H�SU��3¿�tm
-n�Ζ��)q��$b����5Y|�����Q��FBط]��1��P�(<��zo��\S��uZ��\�y5�1�������q��_�����#C���8�ˀXxΚ�j@��5+x���˦Usr��q���A5*��,���Z�x�zWBW�7g4:4��ɧ,��<\�*�0`��%Hg\:����ӆ�;��g��q�uMq���e$���u֦��Y��� ��$�C��F��:<��1x����<$�8f�4���6�]��k�5�'K]@u��q��l�=��Ǻ�,w�	�(mu��̓�ӱ�8�\<�����/(�ZXd��n�s/�8�aP���n��\���ߓ3M��%ݲ��`�]�΋.4 <h
��r�D�Аuw=���~���yH�#�:d��9�5`xւ�h�0�mmo��JBK��.��lk���F��kM�r��+�S��=ݴ�(~o ��E��VA����J�e,,�2~��~nW��g[c#��6��G�uz��h\7���F�F|�7��`��Ҹ��橑�;fn�q�h5X��C\��e�xW+���IT5PU<�N����.-	�,�f�>�����on�=gH����'�/��7�Y끤3N���̊�Ǥڝ1DR�Gct`F����Q�r����%�p0�&Nie�&��!%�k��4,5����}�W �"|v-)�f^iܥ�o�W��PV�*&��O�+�;N���
(�2^zC!�q��P[2*p����BuG&�A�W�>�F@p��`��Ƌ�%
%2��pc�Ɠ��i��N��*�<I#�
[�³\�g��λLZ����'a����Ƭ��=�t�8�K&J8����5fM�$h��Q.�(Ʌ'��n��=\b u-TR�e�#e"E'jϲ;�{h�I��Upqֱ��_��+cu<I�EXWca����n=�j:�t�ZF�����������"��Df����x�_�XM�Ǒ���.�� Ȍ�� ���S��L���F�lk	Mpx 6�G%�^�-�}PE)��<�S�sk�z��s��|d������>����]+�{���J��d 7"��!�k1���˵�zʓs�5@ڥL��,+���Y�Ò�Bk� EK�~u�K��z�]�!��m=�~��1�ȝ�=.�)��ܫ������/Q�1B�p���HI�ݩpG�`*�3�y.Ǔ:�	n �l���l+��������vv�h=�6a�}he��hځ����կ8��v+��{�;7�@��Cu�,���#���߷�d#`���Rk�{B`�� �z.��<[����:�x*�sϫ�D��T�H� ��(���s���~�g���M��#�����������zz?�t��9=��d1ܰ���~�nV��E�$ H�K@�����L�؉�;7�4H%z<�'�%��m�|����A�<��G��CW��6�~�[{.[��T��󧉃Qwg���R��	� T���</���ɔ�\f##�?}^��0@"M6Ù|��7�fn��vF��<��6U<<�"��H�oS�wW|$���fɇt�1���]������#�,��<;��D!Ӱ=1��VjBA�>_���������_�S�\�3��AJӘ�	"� �HNyY.qG�n���]H٭�����nT_m8�`��~�0�쉊�����ߝS�.y�L�J.���+�'p��|������-�u�à�P�� �	�=�9�R��|�DH�u5I�5^���!]0�^	T��w��4���NC����>����Ao�rlŉC���|P�Wk'�u������̻���W���-�xdQ����>��m;��MY�1����DN\Z������K�ަ��O��nu�Y�s�'��QNN�&�*C�\2�S�0�f���ʻ��z߀��;�M���&<O�4�|s';��sMN%���k�\�3�z�Fc�a���L�8,���z��Ⱥ������Y���j��>8�+0a#�i�B%�Ș(`����&�.1șd�%������x�L�2ҩ���-!Q�짽;.u�*�b5�D�=�v�����c�σg��#5�L�Z?�t΄�U�A�dT�Z`E1�G|���0�<�K����|��@�T ��Z��b��	x��>K�/c�¹����`��Ϊ���@y�dL��yMb���gN8����ģ�el��}��^8a�oS�p^���;m��Ĉ����t�:w�)�^Pr��Dv,�-�XEŨÌB��ޡ��91��g�zߊ�D<�e����}���k�Cw���pB�=_�[f�.6�"˜�����8S ��u/��<�a�{	�v%|��L!�'����Q�8q�\)���<-�C����3)6&I�q�4�y�H�N�S�ŷ���dɼ�ޗ ��v������% �"��!����P7<��	��:'�s`$�GwS������uU�����V�$��J.�-�޼����_�>�^��f����g��	�O\�!m��s<�KK��wͲ3�g&/���^��0.�Z�`�=ׯ�Z@&
K��R��Y&�V��"��F&��R��d�VB[�"��ͻx��鑊��v�~:������x9b�Q��\���Gja��&��%������	�������\�L.�G@�,��$��z���</q���8��iu��!�{    �ɽڇr��C��H�i��8�7Gz��\T�r)r}h���{Ҭ���G�)���{�!�ӄL�u�����u���S�Z*�%���h���*�&�{,�UZŉ�?�ߦş6�X�LH�3>�t�G�\����<��HM$yTTw X�-*B]0�"��6�iw�<�/Z��~���XB>6���?=,R��DR �@�t�"�
��4�W�\����������W_���}l��O�As���;pl�4U�ϝU�%T�ݬ��E*ْ��"�ͬ������e��VR�|�"�t�ᰣ:֤�'J7<�+Lڏ�q8GŲ�J�D`��w�a���Gv3��%f��-$�n��$�/�/�O|��f�� �FB1J.7d&3����Y�zo�?�XV]�9Q��-�߇�5��ٶɢ�M?�?�)�3Z�29�t^(�c"r��Ed��������(3��)�� �]~�A�y����b\���`&s�ī#u,���0��Aت�pxi߮R"Q���#���=��)��ᢙSO�4Ř�#�ު`aZr�P)d�����q��:��S�����J�v�p�W�x�x�M���o�̠o�Z�:,�NKJ�e] ��v9I�o��4Ni���	ӵ�:=��ȇ���|��R��"/H��^z1L-�������w�FyS���3&����J�z�o�D�d&N����V���&���9[k����k�odO?=Z�7(�^|R6;s�'����^L�N�ϛ?9�a��z�(���8�y��w�E�dv�*�Ã=����3p-v�]�B1]�����ĩ�����ں�O��'4Bs����������~���z�è���F@B��iO���$�+�9�0�v�-�VF�x�.qv���_6�^��ۧw���`׏���(��x�nnź��2{��W�37��<�ӯ8��2��mzN��̫fI�mǍ��q����{��Ѧ��/�ܨ)|y���&��\���[-��P-X��������_��z��P�I��(�`xωq���|9�`�-w�?�w���n�O���v�#���n�sw��\R��޽�E��c��[���`vw�:�`x��%c&�;� �z�"Ӿ��)Ew	`�����JZ�&�jqu���m�x��v�_�2�s)h�Mw?�����x���M_�_O�/o�����]�_��^C���+�w�(�=�cy@E���D!A˺��^��PFU��$��z3���5mz� ��lUIa��x�L���<��Gi��'iz,�ò`J� �C�2� �%@H��4��M���:.�:��h,y�	�C��!9j�Bk�=��3�hop+���ه���K�Z���%�U��$�k����/#�$��Al���5)ъ/�T��W�������ܖ>�c%��/J��;��(�V��$ �*%�}iTo��A��G�|6I�>ȫ�}����N��j�Oϑ�֭�s��d/����Rv�i�ȅ��ZcR[Ō�t�������^o���O��7?oMm;�D	�8���� ���s���dD�̦��hd�q�x!�E�96��;�L+	J���"�Ae�R�6F5��GF�Vr`���/w|�8�b]O�u}w�n���OB}��]��@�&�C�W��9Z� �[�1��$g}��ڮ|�r!1O��^����+�m�àF�48���O�-�������& ҫ�i�̦M�r���{x+��,���ʷ����xN��olXF�m�Ù����� �r�.>YK)e�5�9A!ku�¢Q�yp� ֛y_�0`i:T8d�j(([>(\w�h��s�S ����H��Ӏ���p����-o��T~���_��,�~	O?��ƫ�T����,�X�;�`٥1���� �<�����a���݈:As:T�Y�c��%�D�`JbJ��j�6ڵ��_&# 
o�A��g������mS`�V/FB�y8/&5<=I�sISa`�S����q�����kp���><~`��~x��x�5/�\�	AW��abrH�8�Y�y�hh\ ,�kC9AZ0�[�R�:�П{:�Q,x#m�9q�͂E�@����ח%���>����h�������HP��u"�Н�&F?��P�]:gD1\~�R�^h� "�����Z��󖰠4���lz�ɹ�%��Tt>)�OrA�/���b�����1�p�B�H�n7q"��c�}1�QD���Uy�41�$B�p�t��O����JL+n�ta�A�qz�`v�#�*�o�A�u�f��>n4��c^�}m��O�T(�2^5Q*Wߨ^�(	��2���S?'��@M� 'g0J��ۚKPN�.��OB�dvNG4�W�E����ԙ�9`���wՉ�_-�a0A/��k�z�aŗ;��z��'/�0�=6�G���[�M'k�
ƒ���K�[x��
�*�LǾ�no�
�%3D�z��<��z��#������z��j�Vj9l#�N�Wէ�P�����J���o\s���Ig��2T(�p4��\�]y��&Ux��ġM���Q/�j����<�#���g�mg�T9�Z�/�R ��5\{*�/Q�����0�� ��?NK�!n-ʼw��zSU��Ȇ��p%��)���4ْ��`>I�C)�ǭ`W������E
t}��u��;�ो��E
�/ښ$��z����堰<Ѽ>=f۲~�wL�ki8�]6P0)�?+�Q!�	�G��58!�B���|((�O����������.=|��+?��ǖ0���u[w���P��)�!)Z{��R)�y\�r.��`�l��?�Z/cȴ���
m恻6�U2q��׳����1�v��>V+������ֱ�^ ��F}y��Σ���v�C�]29Y��B�!:��2��~�ټ�u�2��v�
U�1�R���,����t��*(g^�Q� 6Qµ$+�u��)��č:0��! ��t.�J����i��'�=�2ﵵGuJʰ(ϹH���ɣL�2�5���������HY_*xl��O�q�����g����9ʙq�����3S����4Z�sfe��٧�@o3���ul���t���i~�g� �+'�6�|x���ɚYX�uى,�� {m��nfx�
�bX���.�t� �N��T��i���|zws�}z����3{uؑ�A�ɇ�]PZ�=����4̞�Ղ��%Bt��%�gln�|�� �K^2O�֔�Wň,%jUĽ��B����;/G�w����;�Al��!�\gz�?no:�݃�ߎ5+��>�"y����.�3���:/T&��P]6	~�-j����^Y�6�?�1g�r��$���T~"E�$�Ϋ���j��<F%'����,y�Wc:0�v! �OV�b��٧�D^��yOO�K����KO��r��5�x����C��S�	fM7vU{���:����IO�6�@V��gԾ�9r܉[�{H)��{ZL�jW�������r_�Ɲ�Z�SO�=)���)���{�.��R�}��"��M��o�ܬd;�aТ�*$���p�P�88XkAr��=��c����j2o	�E$k�H��ِ6 ����׿x�oF�R�=�As��z����yHä���WP O����>�����[�.�r~���
��*U$�-�5)�ްQ��N�k�<r�
������>b��Dݽ�c���[��7l���K}%i�Y�Hg΁:����T���Ma��޻�b�..�D�Zx��+A\v�����!`�Q���(<9
�$Ѕor�JNV��7!;6��B���*s-^6���>�8�G�;�;��8���Y��U��2�`�L#p1����34N����}�a������,�2���լA�g�=��dkLonB�pW���~���"��jR[�A/-���[���y���F3�����"�K6:� �H�_R4RX���G�^�nM�S[\[Q`W	��qC���K.��B��Շ-C1t����x��1	�]�P����{We�[N�?>���~9�ç,a���    ��g�Γ[^[Y���� �WYk�]��h�Ɛ8����9����Ab��9�$3��ꪉXx�Pv���;L������ڹ�Yd.MT�G�(����qxI��7�H����jN{��\�t+pZ��� �*��f�Roj���>�WOD>_y���0���I4��U$��D�x��i�"8�ڂ�-s����'�K������i�'/p���9˯8���*Q��5)�W�W694M�gxe�u���ߝ�0F/�=wX2��w���Orv6��UL�6 �����N� ���=7=e����>|����:�=�t^�d3L7q��j*r&���VV̶� �}��֬������A�2�<O��2]|�~(�^E<s��*�CX�Boػ�ȝ���<��j�T��Es8xW�߽�����p?�����g�����b�Y���qEZ0ܸ��ѱ���Y�l���Gë���/�;n9	�ЏГ�`�a%���
0s��F�}�
׳�FLd>�R��� �?]�Cz������A�{�T�Yx���C���A�����6��9Z�A_.��d�	o�Èa���~��}�n%'A�{��u�z�C�0:���@�I�6�b����o�����������9w���:�O?�s,�4G6ml5�f"����C��<�X�]b�f��p��Ȋm=w��Ո�I�������)Ω�P/��5��
2�=�`���#+x���?�RA����m&g�Σ��%x�Z�Z
�	o`z� �pjQ���􋽻g#8t}x� ��b������W��i�m,�<%�\L�[$��Mr�P.�f�NP���eè
c;��׏~��?�t�1�qI�f�fa��,�N�o���C/9������A?ks%�&H��/?(S����0��i������fx\���P����4�l�������k2�ǧx�66q��	�����΃�V&�}J���ro�t8/�3�Ń��e��m����
��`Ap�8p�������][��S�m�/��@����q1�ͪ�pFG�j���Sz��+���("s����y<�W��C���0?�.7f�ԙ!W*��~\���>K�Ψ��[j�'��[˞GsO�ÂK*Z4+Ɂ�p����Ǌ�\���,>	ݳp%��#�mVL#�`��il�֬���q:��v�\���d���©������I�f�k���֘��������L<&�Y�Ks�����t�k�8��,�W���^���b[��z5�p*��q:�
�I�IRQ��*���Rc�\��x������0��S`X�%�I�F�/t��Hؼ;��=�֋�Ț�)�T�g��@30�V���ĝ��Z�8=��� 舰��t�+�K��z��e(C��n���.��̀�V����9�NA^o��������Ղ��{I���r�d	R��9��ۏY�iO��|�ۧ�X������ӣ��5^)�]���N�J(�l������m�+��n�-���A�X�=�:N舉l�`Rمڠ2j
�w_����l����Ao �\H�\!nH��m��/AW��}:'�5�����s+Эr���''.���V)���ׇǏ�Eu�������+M���`���zCɮ�ǳ�J�P�r�������O�k������x]"��έa*��p� _Fq���2HP9���x琶$_�.͌A�����@P(�1�'N��b�;�INm���� ��o� 3�Xb��
1��]5�����˷7���oc!(qe��<���9$��I��r������bB0F�z_Dߵ#��uuj�O��l��	�A��Ҕ��sD)���9�n���Z��޳4~+��q+�,��7[���.,=�}:wP��|k�Zq	�+��S��������Eݧ����líyfOے��	�ʇn���u;���`�]΢S��S��7x	�(�5!U���v������^�t��f
�� -*��>��t�S�!��w�*y��֩.{TU$�_9�� ���ѰB���9���]z���>�f4��a�x������Y��lu\���d��8=��㻍'\|�	/ҨO��ӹ|�-������o��QYt�C]ĘH�b�ש�0�T�su_��x6uč"P�90{�F��%���&C�:����)�(�W��9H����FR�Q+ȩ��:�;�N6�'��f�����um��Ҟ���;�d�Q�������8!���"U��	+���9���D1[�Av�!��q�E�!�/�}5}�a����㫗p��d�Q����A�VМ~z�M�s����Me8�d�g�2���Hw1����0h�)5�f�p�����U#��۷�P�l�����%<r#M�m��5���hU��hZ���G0&�&N�G��"p�]6]��e���i�9s������Ň���Ļ�x�q�Ҳp_>5m����7-�	�7�]'�)�0	Rg�z�D�}�`ǋ��T��7O�Aiϩn���}��q��,)%ܬע�❦)UcB񀶋���t�N�����F��	/���.���X)���e�.1ˠ[6��B������fZ��Kë��Xc���M��^�]�}g��%y����m������[��V�Je1g�2�׎n��<<~�X%]i^��ł^�lAY��@z+�ˤXN�x��
\<mxgu	.9�M-W3�?�?�o�n7�<�]�A���g����C�=A>�f	6	4_`���st��\c��;�VH\�I�;&]��#R�'�5��dJtX���>$Te�����Z{x]�����?5c��	����m=g���5�+D�A/���Zɦl�f�Lg��Z��<Mw�/���(Y8�/� t����L�#}S��$�`L��C�}��F�F���RkZ�t��C�Ĩ���N=�g��γ��I��b��r.݁W[����E����l\�q�� �+���xF83l]	�P��g*ܗ�&�Ȼz��-qO�O�n��\�l9�y��/�����	
_9/.Yg��+i�$�c�^<h|��;}׋|1ܠy���!���AA��nM�M�iMR$JA�o*��<$�\\�+�Tl��xUB��*�9���q��=l��\4ѯ�u:W)K�[̀�M��Vr!i��N6-+>Mx��h.���9�aP�!��^�{�x���g4��t���&�e`<$�W�G�z�/�T��R/#��dO�2;\�,jp�>�OK�(�4� W��(���,����׌o�=u�Ǐ��s��{kĻ����)�jr����5��JE@��K!yI���b�|ַP�������&��K�^|{��5���H"�\�ܐ5�VۋZTSî�EIӫ��q�p�Q��TXp+��?`�"��"ᎩKq���J���g�ݖ�8�$����ȷ�Y˱���X�f�ts��H���]���@���}U#၊p7G�XJ	��p�4�s��TYr�î��"�ZJ#S����z�0�Ef� Sn�_�z꨺�A���H�"C�>ɪ$;y��WF����qR;�O��̒�{�J�A�wf��;�E�A㮄��,�k���E��8Ld�u�S�^:~�#�x�$���1j5���i�1��Z-��Rt7ˤ��f`_�*����$�����BϹ$O��"^WMH\+��L�-Y�R������5Qw-h5�uhu�k�?<���Nq��)�{�@G�+|��������e��S��9�QW��$Y�0'�RV��sH�Е���BGש$��3�d��9�(W{�
O=C9ȭ��<ݧ��]����}~wW���n�%��N���R7��N��)O�ïX=-t��:Uܪ��v(��)�Z���qniVA�os��ww�Ct|�lR��u.�ϫ�@�J�. �E����8��C@�\����2��9�4��Ȧ4�ݛ���P�a|� �NhV/X=�K���j�*k���}�AHC�a�,6��"{��Ӻ�a���n���7�r�8ZFN���D����(�X��A� z���ŝ��3�����.?�MG�    �)o�&����w�=H�`H2L��#�lÐ:�چ������q(snx�*^ JB<�-fP�k	��D0�s��ވ��f+57�c��ϩ��`��櫿a;w�4�fx��`a�-=�,_�t-��i������@�����d�I]E�pOL|��l��*���������Ny�t�[D�28��,k#@&��!�w���Ksڔ��.?޿�׻ 3n>��Δ4��������U�r�A=�A�
?bH�����)�/��_�0��gߪbZ�1�!��ʴ��V��~#�W�EK��T�	�@��Mܤ����7�燇�ꛇ��X_��c`\E������j�Д1����׵�T�zi����T��_6���É5L��i��D:pδҬ��Sr)�3��D�������$rw�f�q�<>K��=������Oo���i�8��&9�篞���D��ӡ&a�1�:`& ����&�`�2n�'���a�u���@�jec.���eSA!V�+	#q�lg�u:�00��ڤU�5�l�f7��LS���;N��������H��Ї��*�ބx��jT_��R��nmG��Y_l��M��.%.Zn��B82D�ǺI	A;=��"�1�Z��BtC��"W,�z�{����5�-�:#I�(�2�7��[ϸ�����R �-�W\��	A���,t6Ѽ�r$�fG�d��ĕ隍�Zh2��ha�X[.e��Q.W,����&�+3��M�G�#>[o�kNoYE�X͇&���e�n�B�L|�s���U���cs:��\���GY�,�G�Q]ş��R�=L��=�����9��!���x�(��/5�qG U��@��������ZDذur��Ǟ���6y�f�������h�m�b9Y�ZҦ�ƦW�>���K�El��k��Ds!�d
~�s�8�!z�b��S��%6��v���z�+�AZ%5�~ѳ���Nl�}KkE��W�z廢D�S_ �m��V��I���r�N��hв�	 	=�U(��{1c��H�$0" �N@.�@)F��I�
^��������]{�������>����ū��#�Q�cc*y3B5��W����W�\�:�aK��l�
���J�h�t>J]��X�=�k�m�������,nv�ޭ��&����W�3�+`�6��,����J���`�lu-8J�����D���Ș�Y��]� v���Z�:���"�'Q2í�i��֎���L��6Ho�R�w%Fˮ��]Y�h��;x�z���u~�f'��̭�{O���%�T����ϛ��K0��EV�����{�k�-�y��q���,#�&4K 	�"������qc:RƤ#�'�q��뵊��3/+
!�I����
=Yf�U�g���ۑ������x�L)�nLJ+������R5���'�_ߪ5�p&�j�]���`�K:�R0HiX�(r�;bj��u];vO��j'cǟ�rF�ݦ̽h�����i�z-ݺ��ck�)EW�F#�zᖵ��N�d�۳��ض�$�I��U�T����9/ͅf��j�ѱ�"�Zҿ� ��$���߾���~�{k�_�D����gZ�.*\/�y(���� ��>��V6.1p��e��f=A7ĺ"u���Db��Ǧ������F���V	�	f^W�9=����83�B��YɋWO�W�%��؀�;��k}	q�Z<R�?��������ۇ��ɦ"L`^��b�a�L+�ް�vE��g�����|	)�d��H��͙������8�W�������V�w���S�����a�t�0���e��r^�pt�wÖ=L�E�J#f$��8L�[Ry���r,�� md�����M�W�:��(s�J.�Q�-��|�����z:� [ԭStEx\e-�����Fo�	/�4�6;m�����~DWLO8���4�I�c
i�%i�q��w��J#�J�l�E3J
@���������ø��.߿�����aW�]R0�[���jJ�C6�ؔ�n>��M�Rd[aw�u|�۵�%��a���JcJ��j�J;Á"���U���^Z*�~Ϫe^�TȹA��0��uv�v��|�UvSe��S�U�Gp����\�!��l�����k�kd|IF��h�,��U�0��XKeϓ�)�Ch�{��..7�җuG);Jit�3y5b�gl�R���_��ݷW�W��s?L�v�����Sr�U���TK�����������2z��/ۅs��$���Fb��̭�VM��ӱdz�J~"J�1R}���4�j�ݴ�͕u�b�l�:=�y����h���aV:�A���"�Y��������Ɔ���;YA�Nר%W[�6���!�$Ë����M�I�@�)�J��3�#���_n���WO�#�y��aF����	����}M�fِ��ǵ���<}2Z�!�}a�Z�����CL���ௗT�����P�6*����q����m蛦���_���M�l��S{c6����Ӯ�n�ѹ�����S���d�y�*eC��*�~�*u�Ì����)�թ���e�p$C�jj'����jT>����<��#d���HR�Ǎ�/���i~��j'�D#����y������bt%$r�#� �|i�W�#���^�j�O��������"Y�S��E6�`k�ǀ��A�-b�X��i�������+�7���}��̭U�����>w��<��U9��j�Ke䀘�o�?�?^��kw����IbE��%�=qJ�A����8˶�N�!�P�����C�c���	`�宷�߿����޿~��Ç��o^�eܐ���˻�. �{&7!��`�<�HB��J)dx�Ir�R��L7v݆�P4}�6�e��ܲ'WT#��Q����f	%{_�~��Aa1+ǋl�k9�9�Q[L!���6T�6h�=�u������[���`<��a�+�\���C�3���'9�֜�w,2R�,��'��(x�?Y2� @����֖lH�!�y�\�~����l��S����Ӭ��}��<ְ�oA��V$d4+"�X�%[�L���&em*�g(�_��@gYS5�7��r$��5t���+G��>tX�NO�i��3�4cŋNE���z:Xis�Eb\��c�#�dsM��\�;/Kf�c��O��3|U�%����)�Å29+&��QU�)&8ha ٵ���$;������l���m����{��|������W��K���ed��9T*�%'�VU{�k��W#`��+�k�-{�����ˌ/�s�D��	ܸbU��>f�MС��c%�w��$��3��Tw�;��~�t�~����˥oI��W�x�ŗ\��O���1�s �.x�[�|�x+n���\;��>i0�GŭĎ��	k��*�[���s�I7楀")��๙�җ�/P�9���H�7W�1*}������ΰI�Ǝ�� {�F]�[^u�m�`�E���N���'���X�ft ߮��D,,Z����\�!������
����6$׆�i^���b����ޯ��������άj%���w��
�=��g ��K!`7L�iUT�R;��9��,ͧ�OrO�r��DF �T40Ā	d��9Σ$�}���0�������S��"�@�rO�o��.I^t�c,�b�������Ŋ/~�H�)����,��n�鸇I}�#����"��]e�Xf-1rC�e|/�H�	��#}	D(�m�#�>���P_�B������R8�[�^%�.^=���D�nܯ��؀�]��6��*^�ew���	.��q�$>9��lH=�	�����k� $����VT-���ٳ$����7��[Bk7��y��D��o��x�*c�"!U��y�F���q�gN�n�Ey!�p��t�����b�0���`Y�)�z���ÉtP��1
�f��_���}���{��d2����3� ��3���A	���*�9��<q��_�m��r����r.Y^l	��, {    	�ߒ�!�X�b�fB9�̄o��)q�2�9Y3���V�qQ�䁞�zZ4�]<�Kjk��i���h��WwKK�_������M�U�@pF�6���DM6���]v$�=E&y�aw�O9B�&�l1�ܽ}��fJ`�/̹xZ�p�����j@P�b���sL���֮��H�B�Ou��w�|z��#��� S��1$�(�[Uښj���P�-a �O1%8��
 ��6K'/�Y���������N���"�=�VO�bs�Wm����p��l7����=�VIs���^<��a�O�	����>�p���q�B�cMZi4�F�y��l�wl�����7s>����魧�� �2��z��Y����8ZK.j�`������5�s�!\��k�^:�ab���{�0}<�}&��^s����jW�z@u/r������A㊑|<6	@�u��������ݫ�{�iNB�������>���b�Gj���e�L�w��J_�Mc>�z�ä��X��N Q:c���O�d�JjK�v2� ���dD�0�F����8�pzb�U����N���V�vٮVt�0��e`xp5�,�*,�^�+ܲ��e��إ�[Lb�,^JY�&R�>���r�
�)p�_��-xk�����"����S����d����t��i���lƀ��&%���w���8������B�{��3h����,�̜f��ʪr�v!��w՝�e��bgTmF��e�ˌl���/��yF��8��Fi�������uJ���S. ��CV�T5ٯ�M"�����у:�a6��ݤL��YqR�uIv�`M�7}TWÉ®�����pϺ@�eͩ�N5O������ݺ�uz5�z��)Ψ�T�cKY�6�V
%g]��59MD���]�O��*�|UW�4����[8�(��Ȱq�u��J������(�Q �~Vŕ�)|�(�b�>��L�V��xj��u���'t�, V)��
s�Vn�FMF�/uJ�?�24���i,@ЋbZW��r��K�G�d�)�/�%� �0&1f��8�&I�.���U9�3�Z<gS����z�u���J����� ]K��=�4�c�#T!�h�\`o��s"�|����Ð�*�O,�������La�"�II���<�?��x�[���${��l�uRIyZ����6/VN�@��03`��S<���;�x�2����w��C�{|�(�a�Ò�G�$N�$Vo���?��(�|��p�`!IԆJL�YܷG}V���>�}�q}듔��ƋWO�(a�L�:�F ;U��t��|m�8a�"T��m�<9q|��	i�H�{����3NT =�s�٪�<R�w��#���M�0U�m�j�t@zӾ�{{��z"}�{��G��]:���Jn���S7E��O2��ȢH��Ss�%��k�;�X�G��f�f�bD�I�9RRl�SL�.��0�ho���ϒ�u�#�.+��Ԫ������T֛77���~~j���J��J�sW�������C�0�2UG@�ܥ'��9J�^�k(����=L���#�l��H=��l~�&口Y�Wx�,Ec^��
�Ԏ����l���s:�y���Ϛ�~���IU��b�Ԁ�� ˹!��2'+��d�YsQ����Y<��g���U%��#ۗH�k3�`da�~�i��`hh[,"��s
��^���k�{r��M�9�FF.Z==�PF����eYt)����*�u�4�K
�n��ؽ��?�L���H���ɟw'����@�d.������N&�	Δ���V�{����n���������W߾~x����W�~x�����
F����WO[mv��:��A�'��U6�w�[�����e�F'D�Q�lN�1��id�>8
�����iK�d-o����"i��y��e��3��wI����L��/X=őh>;�s��e�ε+k\k����Ge�y�����O�'���6�I��1���PZGHv��j ��>�Fadr�f��L��<�:!~�ޒ���\f�4��zzVp�X�Uf>��ëN��`��@d��ռ1����IU����*�z�(�M��Yz�g����q�f����w�E�ָ�y��R'����X����zg��._�z�\%���$�~D��&v;��
��WR�����&�w���m邡��#�b9؊����%�ւ0���\,>�T�O:<�֭����?���)����/X=m 4>�4B2�����^Yo�R�8=Vǅ3����vfW����+vu�D!��Tw��jd�E3��nGwE!��hF<*�P,&�R�z������r��o����O}������k��8��zj�^�&�L�9#���Q�uU���R[���|w|��a�``¬�N��v�B㆜[dK3A��
)Gվ{-�
�sW]H�+B7���ׇU_�Ǉ�C�a[����r��V`v�[l�[C ��A��U�C���������C��&â��U�TTB倳5.��RmVT�+^>K.I�%�jZ�O㴘��`B�w��=�;�XVm#�VOs��%/�����)�*\[����ǪMxI���n�����I����bÝ��?d�Ej
�5>9}]T�6�7�Zc�@b��f�#��r���s&S}hyx�j������N��PJ����%Iɮ]�*��e
�a�h��8?�O��?��Z%PC�F�\ܛV���=-�v!Ek�N ��b)vЌ ���B����?�7?��W���s�^Nh=/X=�K0~D�%Ӄ��|K_�[d�?�<U2�ɫ�����{��
"���2��i�MM�z��X��N���Exbf�A�˯,�p�����	l��`��3=w��Ȳ�aTǖ�r!l��Ҩ@
o��iU$�zٚ�f����x��#H��t�"jJ����oK����)�,I�� DQ�Ãk��wX����؇������8ʽ�M4�I��W�
`��5�W�l��"n���Ԗ��W�%ܽa�61	�t �e�T(~'����h��#�^�?+��U��s����U�̍��cƫ�9�jj��&x���g]��c� ��R�2j*�w��V2&��U/�6v������0���5<�Qu�s�r-�Vû3?�X�o�J#OM,8�6���������M�{�.����\�E������f�I׎�#[g�=��� 1�Ztƺ+t��׻�=L�]���@�j�sG1�48W��
�[�a-���j�к.E:`~UضC3�\�,�nq�r��i���N*����$H�m;|�c�Q�ZhWj��S��s�?A�!���#%A��|US�����R�4Ɇl,�:5%aF�oRTc+pq�l�<U �|��\�Щ[nSO�9��z������:~��{0 QE���W9�$y����H.{�T�a&Cu@w��*RD��1g�ް�8u��f�+�I*Wbs��:��/tA��_��?��5/"�hԞ�[�b��G�9�/6ɖ�^�ԃP)�����9JR��KT��O��64�}p_Tt8�*%IĻ�ƑI=����2r�%�d4M��&p2�YB�ƨ�7f��G_?� ���x���B>��_�zʆa�BҸ[=�;Xw'��*�XӊKW9� ^&��Q���&6��V�NI�2M�[>4�2��b=�Dá��9Y <${7lZwϜ��&~VTPTE��E��z�� � ��]]�&1F��
+p-l��$W�׮�,{����I�*tID�UWH�0�5����td0��De6xC�le�C�W�aO�&+2�g��I`=vo`��VϠ��Q���P�甧�:aZ��ӜWt/
=v���OgLbH�
WY�ً8�=$���kTK��u�5r�5)�������"�v1�ֿ͉��w��nO�1�i2���)��%(X�в���3�.F�s3u�v��w���0!�L%8�j�h�	]׋h8�?�2�L�ZXF1J$_��\�l�7) ���ܰ]bBu�4�m��VO�F��u>{u`w����C��ԫ�)B���~������M�mgF�O�    \�J�C-���u��+��&�& K����57Y��X���W�uwV���6�j���Q0��
I@ߨ�����b�+ؑB�י�ۻe�0�c��:�h �e-��N$ve蜳�Kwv���Ȓ�	V�H���r�
��L,��?����*�{c'����������Rf���w[8�R�W�]V5�CV�e�2vR�?�DV.g-����G��,�q�z���Xn�S2W��E]��[�$�Սn��c���w�$Y�W_�z�V���p�'�C�����uZ�|�d uQ��������Rb.I)�
|Q�lŧrq�AF�FUfA�PFi��*�����oq1|�S��"�C�۔�h����+�C�������S���F
��]���H�p簎��ܨ$[n`����آ�=[����A�ңW��i<gY9�\�i��:���$/�n|�p���0I�Z �m��VO�a���QWRR���m++�2�*+�<�o�$)wR���5!%�����q�-:Uj$�S������H:Y��,9O����c���"fx�{�72N�i�R�T���z& 
��P=k��	I'gIz�/���=Lɛ����Y�0��n�1�>8�Э9�����iH�Ғ��>S�F��D���Q��XH˩G3����c���7����ﱳ]Ff%�\�����K|u�1L�����玻U�x��,ƺ�,��>�a2��F� ��������jՓ����T�E���p|td]$9�p!��Bi0���!�gR�)�)�sWO��8�z�JYS5�Q?\�K��=�F����Ԟ�9<>}��-^8)�G��|��b�H^�ҵ��I����@u�`�v�3~�0�ٌ���|�о�)�@pg�T9����Ô�8�Ɯ��#������!{�:���U.�S��=L­
�WxS����l1��A�1�O�N/��������&v1Rp���7�����8��?pW)�]ڢ��h���	�Ȑ*!���X�[�5�����1u�]��O��$�*@���5aX�P���P� ��b uA�L�x�?赜���9���9Pv��Ӕ�3WO�`R��X��ʐ���8_l��?Z�)��]C�p/!��a�  � ���)��%nVW�L�a�<��P
��b#�Q�)R�}�01�ڼ"j���?�A�$�����u��ן�׭�fu5��ޕN��e��-�r1�V{�����չ��>ns��8>ye���p8���,���0��Dʌ���� I�*��>�����9z�j�C���w�P�U	Q��f���g�9ʯ����WF\�QI�EN�Y�����&��̙�����l�N��H�D[�VG�\*���� �I*-!�5Re�Uٴx'������sj�x�u���y��i���R&߬IK;m�7��$�km��3�JIr�`򴇉�b.������pw�v��d��F��Wε����>J4ӆ���j���ˏ���gjɚMB�*��nw��WCP��-�7	;)c�u*i-���4W���w{l̎�L#�!� 5(�eD�˦+ ����읊�k�t��7ԧ�͊�u�V]�����?}x#���GN%��y<k��˖��q���d�m!d]�R���x�s2��%�=��f���p�U�3*V���H/���������ؤ�5u�d�
�܈�af�p)[���>��wͦ��E�g��ч''\Q�ă�'톑��$Yc�f����Q-{�e�����Lg�_�D2��Ș��[B}��v���R�A��YA�ӱ���r�w�/d��KGl�6sL��޵� $��&5(b����z�4d�v�B/�1�)f?���&����l���r�.zSE�2��p�bG2�}v�����|���8�h���f3�������w %o?<滽D/�
:�篞z2�
4�&M�M7M�B�{��
���x���v��$ի�o~Hэ��h8�>�gjc4�C_@H�v:/��>4
\X�ґ�v%S�9]{eey����FދWO�Q�61v6���B�2���muլ����T�n[ԧ��4����⫌d��Rh�Y���$�b'�ת� 7�_�ļ�a�g*VR<�6����t5�����S��Y��Y�B
oK�k�!М7f*�^�����O��09)��/'[IO-�dt �EG|�v�"�M��]�H�j�9�^m,p�r֬�;At.��ŭ1�O���t���m�-��FS��A�V��'JZ�7���?I��J5
�jO=i�����v���|���'�g8,��P�����/ڟ�N�|�����<<�?�ۤ��8TX���qON�N�[v�oʜ�����j�YU�����U`(CZ����R�^T?yV���r��j˃'g��n��h�@yv0eLF��L��s���
�f�@��"J�R�f���ћV���_�O5O>(i��	���zj���ن�aB2�{#�*o�ܨ��먉�#�=L�O�K^�OB���ߡ��sѲ��x�/0�8N��E�=WG�%LV'�Q7Y��n>#�uP,I:�;�.�<�4�;&G&�4�l�Ț\E�G���@��o�WIl�P>mb�P.�/	O�P��:�f%cr-Z"�>N���t���n!`T�����72���%����}�x���w���.ſD�4'���icT�Uk��Ӑ��ʖ�w��Qk�W}�۶SKY�0cEI�<�	ᰃY������R�D.���*�9�G�dj����ʒ�*���6�}}��8����.�m��VO�j�d;{&�#�]N���9k�WI�.q↽Y��&&i�K'�8��f�(�U8+�Y�\ݒ�O����K�6칎X��2��M��ψ�2�N>�mB�VO��F]���4������V�ծ�^���U�Z�2��f���א(NJ(����%��h,y�Ko�vk�bnx�������{
�T�ν��}��7�_��Ce�f��Þn�U�ūgJ�$�*z8�f��Xv�g}��������U;qײ�I&Q
�L�u��,!���vɪ��K��#�ZxǱ�%<^b�V�1�����St��ި�;	Dno�k���~��i�6N�#.ɶ���%�+���p��_2~������}�������e�� �"�%��]H��p�r��#���iE�G� F�9X'
�<�6�Ʒ??|��wm��A�ې�y��+VO㭡K�.�n#[zcֶ�^��r�[���y�¹�e�e����K�����6$D,�	3���j"/{bz��'��ɮ���M�M���>��a����뽊
�:�_��\�z*����Xm����R��W'9}�܆4@�_�P�q\HjZ��]�(O8���HO�5|��-v�t]�éUˑ�S��e@��9F�d�:����տ��8��:��RZnB��VOK`2��S� ��{UE�0f�m���f%)���C��'�i�z%鰚Ob��k�V���Ղ����p�����V�/���}V-'jEM.�����Oo�[l,��f�o=��ٹ<�,n��*msK�R�ˏ�ߋ��*�2���8�y�|�ì  #���<|��N�";��Qqo��9{@xj��EqUc#6R!;״9�R����<ioS�v�˽`�4K�4%�7����Y�����*3�D-_x�u�;>=~*��!��
�R��a&��	��Bs���v(�.`a���J��T(����}����;Z^�֓�{^�|��i���~�� �<��Y]�լ:��t1�$��ar\�	�LɅD�W_�#��"-C��`�DQ!4�$+�5��!�^"���=�6�Z�'�A��g�i�`�L4D�݆��y�l���VUu>N�(�/{����O���Ve��`���&�L�����pKܥa4�-C��쎯�(2���3<C��m��|^~-�f�����S�a�%�b\e9yhS�C
�p4X���������ӣgr�l|6�ர��r���C���]:�~'�uC��Y��!��V^�߿{�����}��Ç��o�!��U���� �    �MV�e�ū���KK�P�th�Ħ�023q�N�+����ML�ٲ��w%�4rY��\�z������znf�*E	�1"v��H�9'\�k|��,ሌR�zB���-0�Q�a���3��>Q�V�3,�z�f�sᎏ�`�4p%S~$ω/x��-��:��/x�~a)¹��W	�x�k�Aea�6�M��#��C�������9�9I�?��(�t�0AV���ӌʤ��'��F��Y��^[>y�ä�����b8�S�O�S��]�v�i��Vễ��h
��!Y�Xs̶���Y�O<6Bn_�篞��t
�[�csA!Ns-��4	�1_��cGu���I=��U&��u6��g��N����G	�n	4 @T/�Z*����H@:���fj������F���c�e�1�־��z
H�Eiv�Pp�m*"�T8��@�n0W*�4�Ͳ�	�(|r�:f�8j	����x9JlK'���{���T�[E�y�7t���A��"����ü���K��h�ů箞^0f�e˽;J�Vb��ơ�׎5������u��&&PD:`�`���[xq�p?K�*�Ŗ�#��p��==�`љm��R��3(�G�����WoK|�z�h�T٢z�d�������4��)���Iל���;OҬ�\;�aV�T֕�����*WO6R�#�(�r�*�N���x�|Y�%"�v��Z��o2�~��8'�xJ�ì��X�sW�4��˭��=���RI�y���ĉA'��k�ܲ�ab[��'�Cfgɛ �(�*,���`��,j�d��	��0��NFV��G����'���q0l�o]�zZ�T޺^��°��\#,��)��V�
�8��O���L��J��(l�I;� �.�oZ��Z%O��U�%,��]8�Z���}{��u�u�E�?r��<��xzV/P�E��j��^3�e���m0}Ie�ufT��j�Ĥ�M�®�5��:�|�z��#A{]2���6��(��g�ˆX��t-8�Mt����=s �)�W��l?"�mp�N�7.X=E���q��d ���Z�+;p!�,G2W��K�,���(" �ں
���^*9Jؾ�r��Z2o�l�j�'�<x�	C ����7�����W��-]~���篞�K��^���f�-�[�*��ѽBT�����C�90}�s6V䜁�{�.W퀩�<H���+�4�=l�@�����#�pj�Hž}�M~����]����?��vO�������q(����f �N-�J��n,��
d�;�e�2�.���� ����R�\�{Vq�!��X{a8p���#�İ�1�>dr�#�ǻ����{�:�6��Sy��id���<;)%��/����#��xN�t�p5���I�����A�(R��*���Q��1�v&�D�_?`mI��[���;{77R�����|�cϏo�}��ܼq)�T.^=�Щ`��mr�����1�9��a��*2#�5ྚ��{�Te��RU��u��AāP�X2��Gr��zL�f>��4��So &Uᗲ��Ώ,��!��|�&���~����RON之g�+�6�j!_���˾㺙4��Z���U���'�{��9��IRx�?� ��Lu-�['-��^7'qc,^��;�H�cS�ckZ쫿x�?����^IcO!�X=�[��G��_J�)��L���"��n9v�H��kO�)-�tX�ʁ�P�9���� �CLO���K6� T�,��c2Ej�P��Ԝ�eKM���x��ފ]J�h�ۍs�h�t��*S�S�O��b�M���G����C���2��稩?�~��Qk��No����J�$��A�!�����*"5c�Q�j��0���m|��y7|xx;�{Z�┷��3�N){c�0
�g(����T���9��v���eۇ�B4?e��Wi�G(�H�
�K��r�Nj�f�Kd��W��ɐ=�IN�L[��>�ao���������f)����	H�`���[��u�`zǮC25�r���5����`��=��&ުQNC��F�d �����JJ�K�xp�>S���ۑ��"��p#A����p6�:+q}k96�E����Cr��l8���xD[��N{~�|/3�~tV;����'9�*ŦI�Hj�jEҞh\V��j�����Q�SJ��<B,8��O%u|��eY�nן����߽�������]���jcl�x��1�V��Ra�Ʃ��\��E�py���tW�e����&&=�c�l�w<���:�%�"|rjK�sq�;���U*��s�N�6e��:��])�ޛsY�_�zZJa�[�S��)��JFR�F��*�D��R�SZ>����# ��Z�Z,[�I�	o��
j��3B@	 2�H�����*�Ϯ�?���?��v�T4x�&��VO�0i!��Rם�5�!��Z��X9�hC^#_�w��&�E����=)��`t(ֳ��/ᔩp[�=�,4�ZD�-"�O���\�.�7�����e�h�Z�[���}q��z��e$RK,��T$���AiWm=�_�S����OE&@ s�á�����9y�Qy�8���?ܲ娹��V8]�U�l��\.��7?�rh��Û�K�������/[�
�M�]�zzl�X�֔X�P8������/��U��งIB���CQR����Jl�m1�\
�
13l��ޜ��,��0�Ý]�/?���7���l���nSg����Ifgȕ�Ṻ�,�0@�F��e�k��Vs�M����	~9U�yDC�,����%K��/�qd_C��Ĕt�t@,l���m���e�����Q��w����S�^b�g�s ���]3�j�k�AȌ�F����X�0�jΉ,F���ɤ8��Д�T@�Kq��g7J!5��G$?��Z�����?<�;���a�VK#�[h.X=��;Pv�O�s�,�/[r7�G��5���:�<�:�a�Ɔ/@�@��tkQT�CE�ЦL:���Z�Ȧ���H��"��1�����k~x��ͷ��-oh����au0�6�����<�4�^��9�����l�,�P���u+��h�Y�_������	-}��"m�D�E����!�F�{�өQ���>�X��K'b��VR#$=OA)����_��w������Ì�詢H��I���W�I�Sw� �Bl<��%`t�d��/Z *����&�Q��s�pu�3��E �fr��N�3@�pp4�t��v�zv*RP�q "�:�8�h�F~�P����|��ؑ=��\x��	^�z�94�P	<�#�}В�R�S��]ӛ�Z^�vw�踇I>�t\\���Q���!�꒵<68��6j�p�Bg3�T�+i��>�s+͛ǻ��!�[����лh�t.E֢t0�R�=����f�{�oʕ�y�{�x0�]p��� 筕Z�"�p2��G }�O�)Q�&� Ё�lRi�@��d�TTجBR�`�	/��V���ճ�k�95�m��D�(q�F
��"��߲�<|��DbJ��<Qܠ �&ː�nH�]YH��լ�ln��;������*]��I���_�������:I �t����Ӷ/�Vر�b�c��.���[Wrk�����Nb��$�wص�?6��Q��d�M9��l�X�Uŷh)�L���l}�I�<TǏ���~���s~�C�!���y�ĉ�����.Ӑ��?�&)5lC<\~��F׵��Dz��i�
?�:�VB:AapT���(*�*�R]�0Ti��Z��a,Y�L�$��"����x���e�=唞$۟�x�8�&Y�(.K�f��-�����_/3�+�<|ҏ��v6(��-SN���.����A���,a�6 ���(~�Y�P�
����F#�_����x���N#��Ub�VC�E���T["5��
�6�:�_�N�J���2J�U
�z�����)�RvT��?�2`Y���>��j2�4���KIJ�^�[�.�ӭk�ʏ��>O;���6�d).X=e�T#��a�¿�a�m��
 ��r�Q    j���܉��=�p���8)F�sUF�@��(U��v�B6{oB�� ��(����!�U�����aG�P�M~ҿy��kC�C��ػ#~�r�^Z�a���Bt>�k��Ӳ��^C�E#��͐��R�x�Gr�ױ���h����I�F�5����m�����Q��P)yR������ņ�'Z^��2EY�P�k!y�<"lP�o(��d�2��ML��'2�|�&0��s޺���e*;ܚ�����+Y��t�8g�ʰ�[�Ǉ���֌?>�d����-:�O��{�!j�)���p+w���Ȱ���R�ʫ�ÝLӲ�Izкj�P)�Մ����+�������Zs`��k���D
d�w��j��;?������N91��_=S��.Z�@�,�A�qZ%���ẇx�ޝ������<���$�c�9�4��2g�T��I�B�쟩��q�V!Js]%�����|�?���o?ܿ{��^��7P�O�$/X=�;LaDXnҏu5z�@�?k@TfCS/�x�D��M[�0qh���'=��<�(��ޯZ�c�eIv��
oZ+���jS"U�?��V%Ij�����x�����9.���n�sO�&�&��1� ��Jf���A˺>T�k��&D&;�l#�$�������8`V��_*�uTe<��ʺ	qbv2��">�U��~�Ç�����ؾRQ�I������Q�O�V!�|�*�J ���[V���µOk�ä`bL s��P�TRU�W��l;U����o>��D:#k'�b�G�mr��uh|���㛝�5R�y��tr��)�P�{���)\�b�/%g�+��(���w���lbһk�U/� m) ���0�����XC��P��*80�B�z��?�QRk����}U���^v��j���筞Bg�}�Y�r�.,@3�-���u{��k�+#�{�8�Ѻ=$8:���{�Q�N��4-T\v	��w橺�o*��%���>��,F�|������ݻ��>�
�X�ًgǥRbf:7c��pcV��}�OӪ�P��R�J�ML*(V����Y���5�	�H)#���C]罼ȃ���s����s.�ڷ��:i�����M�w�??|s��{s]�;����.Z= G�\et�!��Q��;���n�*���%�N�7�&�[��O��']�*��@���ﳈ��JT�j�H��pĩ+!y6ja�[P�3�>�u��ŧ�!a� :��p����C*��k[u���3文3:�j<Lc���P. �z��U�tz�=�e�d=0�; @��B1�Mj����:].�P����	L)�Rnt�5m7�`�7��v����8�$�������C#y�M)��b�I�n�Ê�0���5�L-{�t��!7�����0YNJUd����S��͡����b�^ϊQL���r�����+�g�T
6��4���b*5Kf�Ʌ���0�R�����P�U�v�븇I�>\ʈd"�N
��ɧ>�dg�Y!W�p���0� V�Y��R5�W�V�2}�_#$%͆[�h��i�bl^&6�0����I��V��`��b#���'.+��yg\;�(q	E�c�`���(��^�!J�B���OW-�o���q!W>=��wDO[A��(��WOsI*ؒ�k
�'9p�F.^�E�Ώ�ɗ;���1e$|UM	�-�B�ǀ��%d|�0��:!x*��ŧ+~S�Z����T����]�W71
Np�|��Y�."��3�؇�6�X뜁��3^�k�UZwJ^�=̌�s�2�ЂEǑ~`�^���M�s��8�Z���5T,A��*yݽ�7���o7�b�J#��sWO��d��`pD�ɳ�R�Vů�N	�(\��ز�	7(���������Ýt����yA�2t�
O��z�5x'�'�)IǱ�>*�����l��W�������2kmq��?Ϟ�^��������oW�\�d�_�Lٰ�|%.*�C��9KTG�I[�I5��g/`�A��+�p�y�������|���i��@������WO�d�huI�ƈ!K9���iX�����*ɲ�I(�]�XO�CK�L��?����hX��̵z�*�p�V:��+I�Дn����~"����m���5>�	��i?ug[nRݥ�^C�!��=�d8O���"��q-{�W�Ya֒eQ���eM�B�kr6�t�|L	��E��	`j#*[��#bT����Oywq�7��+���Ow���\�/�c�*�Y���WO)F��*I�KiN;Ev�e�D���-�\�;~7	�ä�Ez�bɥKY5K[7�|5�V�u�EA�RZ	���x
�	+F0���UXq�}����SFpwD��D�ً��B뚺��Ȗ�B�E#2,I����F���F���|��=L�I�`d"���,B
�e����Zj�߳��x�(:"�-PK
g����e��wo��r�M��c�u��p-��x��i���g�*��V��0�b�ʚl�H�y��������IHW�+@D+$gp,6r8��@[�2�#���o�(B3D0G�A��peݞW#�ۻ����`����^;M��"Zw��FI��́;����dI@̼b7��H�q�bq�iҍwE� �(�X�:�ǇX>��j��D'��-����^y'K(���_Շ7�q~�$���o'c/X=��%)=������^���j��u���{C��&c�y��q��9%��ʛfLU����!'CЯ蚁XYd�ȹ��c@tP�V���7�"֟�޼�9t���y�W��"��j� �f��R��)g�~Na]�/f����>��EDOd��T�en�������+��O�0���Eg�`0����h�hj�m��|Ґ��\F^��ڧ�ᰪM"�`6V��)�P2�:,�(z�M឵�tFTl�y��+z��HE�/�G���ɓȀm0$�4
.'Ⲕ�|f�F>���������r��6H
�GV`�Z��7�`.�j �=���bo�������X�.��C%m����z�}赂|D�q��j����a�j0��NQrz_��p7�}2l�F�O*M��_D�L15)cr�X&�w�Ui�^��M��/X=M�Z���|j��d-���"%<�-7����뎛�x��Ua�}X3��K ���RK�IM�,A����X�0�¯�QrТE����u�[F����oy��K��;�5�u���n쾎�6hr�!G	7�z�[����Rz���u����*6�ɉr��U=:�j����J�
�K'-�[H�\2W� ��e�;�{�ӛ����C�����0:�[uP��e=s�,-�{�`��K��ڳ+<�5d�pW�ڛZ�0�Yydɹ}���㪐X�56C�,G]�`։��F��h�R�+	S�$D����ݛ��u~��2mo��Op^�z��i����Lͫ�u�[Z9T�k���Y�X_���=LX���U8�$I�����>���BI�"��=l����7d�Urq����ݻ�u�i��}���$I���SUk@V��P�Vٶ5'K�k��x�qTQ9�܇@	�m+�u	W���ɑ�/q	��Oo��.%�[�h%U�n�G��j��g7��e~�s�ճI�ֲ���6�f\�u	!�ra�Z8�����wێ#��D�g�?�8~�̛4RK�j�z�5�Y��WC�IU��5�~̒��2#=��j&�$U��L����L7�<|MIRՓ'��x��UZ$X��e�=v�~6 ��!.5IQ`�G�R͊�����}~����e���N��W���� d��]尽�!}����k���Uj�[�?/{�$iCZ�E� ����:G�_�ц�Z2�| �h8)|M�#õ�m=H��L��[Ns�	�|���Oݶ��+9V�UozS��HhUf��*=�eƗ=L�!X�"�T��fh�G��+2�T����Z�a�,��̤`�y��h���as���s��KWOҀ��$c2�)H�X��me�7�3jZ�:�b�    �v��dB��h3��fp�r��BD�T�րe���J�3 ��M6'(�+t��;���=���o̥b�. �L�������g�bc�����z����v���)g��`�a������2���`���́E�#�@�"k�����X�r@!�wA�>�[�m:��?0_@���Iz��|����rVP�w[�j[к"�9YΌ9zi����_�0���e v��Qk�o�;��9�d
]$U8�X4N��WC��:�]��*B���F|��|r磨W��l�.r�VI?H�9-�{��x������J�벇I,L�@&���Uh�7U	9B����֣͌�>�P�Ǒ�$"���O���]~`����OwyÃ�Kw��y�����&]n8�cJ�(�[��g�dPڬ�I�U�_n�a�B��WN�Ⱦ��q+�?�dbd�Dx����-+�D���S"e ?�h��xnz�a�ej����%5S��KW��|.
����;�@rӹ��}M�$�������/���UlLFpb�'���IW����J��2K�I�:��������ؔ��lg8�z܋�lM^�(�?�X=�+	wI� ���� '���4p��*Î[���&&4��n7�eH"��,`��ja��J�<�����������~dl�L����*���ۇ}��v�X��Q�p�8�.�v%��jrIR'�փ^�4(=cV-2��K;<~��N-��h^�J�S���*�NW�e�BO�5MQV�=�oXs�F&ճ%����_~��姍q}u9�sV����w�d��հ�Zci�#<3�HA��[�:�aGֲ�,F��R�=чK� ���a��-�
aut}`M߉�����j=[�������Eu���қ��C=��ńp�^µ�G��
6ٖ%L����|���|����	Ll�ۚ���p.9QB��"���KZУ���?Rlp*�L�����=�&�����>>��ͺ�Q[�=��1�j���"�͖a�5b���CS��*��M�MLzm��`��nv��&�K����,�g5��� �U���偘�Y�'����-N��<n4��П͒������g�$G	X_���EJn��r���Q�k��=L�2�X!!�EHeK!�38;vwW�[|X���x��a4�-3�r޻�FV;����1?��k�� �ط`�e/��Z�+��>�֖�J�َ8)��_z���B�k�!�oɥ���F����0���7����)��ԣ��%+�h!4<i��K�-����~Y�i-�C�!?<����m*8E��t����c{�|�!�3ft|"��Ԩ-�����5b������I=E�FE�CeE�(5l��6��ٺ��������"Uʇ�4�(����X1�b����l*��H�1m��p��W�gKɽID��\:2�O��^՚�ӧ��$^�P�<|B�;����<�p�@
���p�#�\ }�78�"a�����1�!e�)�� ��i�����^�)�
��X=&LӪ��sm�}��Hx.�`.d�n�N�@�=����IuٴQU ��{*jr��k	]��Y��rh#6�����a��0F�Ήd��v����#�����x�c�=nIϧ�_�z\�TY���+.W���*&�\�f�g�ӫ�l -{��8��q�����%��)z��.4���j-%)�n��f����cm%�~���}���o	�s�oP��I\�z�-�5\26� ,�^��l�Og����
Ц���f��M5v�x�([:�|
k�!��̢��Wf@F�'�eI�$�1����i��w�ݼ��|��¯�ܼ���<fz(��7Ӎ!�m*"�4����_8���R���8��f���
�Հ�l�Ad�����,���\-�W5� ��i$�d�����͡�xJD����u�}�3��ړ5�N*\���+R�a3�$=>V��7���b�3Nxy��-[�0i�g�@�BEY��E�U�[m�29���bs�
o�,�/H$����ۖ�Q��ֿ��Ӈ]������s�h�7�������W��_ Zm$g<A��~U�Ǡ9�J@E��U
)[���a���6�S�����4�ͤebC �]l�/]�g<I�j��73�7�/�����}�{��?���;T����o��rR:y��I׍2=4́3I#k���#�'�\Q��a_��6��=Lj����!᪌�YX�(V���P�_�MJv�P��+�(��gr����טr=W����}�>�_�<>����1�x���뒗�G�U[����,6�Pa>��J��.ׅfi��%�Q�<�a&���~�����l"�nɃ�a������-�D�;�)���W��YH�t��a��i�2��)�=���c��3o�F&gT����J9�z���*X���V�0�L�L# �5�ؖᲇI�T�+���SXq���:ㅴ)w}�l����=ɜF�W�+�'ؙsY��I3��}?���?��B&�n�$kx��	eޮ���k�X��A�lj�]��~����Z7
���O2T=g\�,�t�y�T�6<��u�-9����M�O&r� �M��d�y�����aܽ{��EV�n�g&Y��W����w�3{+��h3'k]C����{�I.{���@]�Q���V�`8�H��zQu�i���6A�NH �ֽ�hbƯe�����υt�~���o+���!��.���j�$Y�c���di 	c�:v�ܧ��1'Wl��+b.O�`�^��k't#sWӈ���+`�G��*�@���άX����Fc�j���h���t�S�mt�ۤ�u���KW�O�u
6�(��������:��S�[�d��$<j� O$ω
'yH�43O!�xVA 6��B͹fCUI�-�
[���g�~x~��%0�m�V�1��{-J��*Я�
A��ZK����Pƾ��{�O����X���Z
N��_ �$�q��\M��V�e�$k�F��mH��Hrp� �����튊Wl~��L.]=�
0�|\#�fd��'�-VE|�朱{�c�p�<}"*��Ґ�4y
����lIChl^�� �����e5�⛃�$�Ө��겺S����~�ٳhl%�M�i"������|����0�� ��d(kv.	0uӷUIY�0Ip �h`�k4����)��J�U��Xto���I_�f ]�@#�X���>>�9G���~Z$�h�_�5ٲ��f�P��W�1lg�
��F۲�M���}2�2�6��=�ǆ���K��acpa��L�V��C�e�.�����>�]ow�����~��-���d*^�zU�@��` �Ke�ktTŗ��EH�{gx{�(�ԐG��c��*\���Z��zӮ�%�[��gIt�>����:E���D�F��ֵf/�ۍ1z�Q�l�����N��'f��W�32C�솲qU�L�*�U��F�d��$I�W2�Z�E\����S��uS��u1}�QZ >m e�����)�"G�Μ�����w7o���]��a���ѓT��'�ݐ!� �:di�ǐkBDaU^S	%޺_�0i0�i�?+����DF|(�̠*f�˥R�$`�"t`�DS�� n��,Kmզ������������݇�Ǎ��}*]&u�����7���$	��T��9UP��㹊2�����y���	L#T�6�x�"1$G��T}H&(�����!�@%�ZD�O�P�0�xU=��ͣx������l�x��W�!FkōZ��$'��ޓ�~ڧ�I)�`:��*9?�/��\0��8&��8�� �(@{~
�/�
�G�'TL`@�(�5�}J�wj\��տ<�x�����ǧw�f����iˉ��W:N�^�z̯�pS3���ג4��o�M������WI]l^��=L�@a�d�U`CG�՘�������]ԕ- �q1�eX%��y�����ǧ��C�$�ޟKWOt�p�ZSC��2��ɪ(]�Ү���U��ʑ�&��VZ	�����7O�;-#k�~�#,U��͝ǌ�~+���̊U%��i    ��/���-��}�|D�0�.�����/��%�B%�	4�i�w�^E�s�2-{� B]�x�<�c�MjI�*d�ð@ʒb�JYe�g��)�=�W��� lyR��������ۤ���ѽb����f�`瀺RSG["�F[=3k��J;�Vo����Z�"d�lkv�n�.�çT�C<��!Z�l�"�@Ő)�����bMNɽ��x#n����7ۥGDAM������ꪚ�-ۑr$�_l�!Y�2�3�Cz�e��Wf(��O̡����Y�͔��d�"K�OȹD�Ьو��3�����>�����i��fOY��o~�{n��xԸ�U���b��]�86P��U�7��ؖ�]�,��U��$=�=L��&�=p %:-��)� ��zs	�-�\fKl�v��XZr�{Dl>KiBp+�7wwws�h�-v���D�+V�a`�;�<�a�F�b�v�$W�VQ��_㜶���M�X�r���~����H`sP��(�0q��ٌpa4�El �!"0)6�/����WX�if�$��g3 Oir�牡y8Z�푳J��9c��WY�>q^>�0 ��{�I4����&à�z�/�!�N�@*P�"2\*����ދ�f���w���yMغ[ZMz;_�zl�4u��hΎ�Z1Y�Iђ��Fs��kdq�f_�0�F��h*��l�=��`���G�ni�.��R(_0�I�M�"��$�M�&���}�}���<���C�����LB����4,x������ꉂ�C�5�'Yc�p\���`r�e�{?��o���_�l���aⱊ���*Z�5u_F��$)��T��;�%xu>6�*i�.�Y
뗲֖%�!�1����|��H�Wt��m��*bVe�\#�zX��(pS�ny���0�R��B�LwE��0.f�$���+|���@�+;�<pEf�$������xΟ�S}��glj����[o����W�ߪ6B��{s)�ѥ�%�}#���_Q����x�� 7ǁ�=�R���v"��� �p@8�
�d��?* �pl�����S����>w�~��&����`ޝ#�y��qhթ����&�^������5����֔����O::��jv�=� �i�_0�������$��:N�h�f#~"�\x
g��Z���/���V�	%_�z��
O*GK
�e+�2�6�lE��"S��*�jn�U-{����))�c�KL1����,�}X�` ���-a���߆p�=�_9y�'����-��������?��`�yz~t�6��d�+V��qU*@���0��w���-�5��\��6
&�ML�%��{�N�8(� i`Fk*���T���U�2�P��%�����pp�E�C~xz|x�2���F�4�7{���9eN
��]u�7� ιךjTu�Cc��ߒ=cO�7;�����#	غ�*Za{!%!;l=���{.�6a	e�%��෤��>h!�>5�o��¥z��-�.�JE�z��\�z�=Xl���\�R���:i*�rF>��$1��)���&�bX����@�e2 w��C��z�W�֩G�ENT��S��,��97pO�M����܍��ߊ���T��V��A4�m&�SBđz#�}
ѡ�g������ٺX�=L2z4c,�Z���	��W!59`V�<�k����D&�r�3��}�K��$O��f��ǻ����īVOI�`�־��֍&���r�k��䵼B��-ϠƲ���H�IK��+a���{A�FY���B��Dc&�z�n�!�F�PFЧ%����y����������0�|�[kBPjt
y����U�!!�Zga��w.����n)N������S������-�������V+��t��b�}T`e������Æ�{��.��ے�լ^�zZ�Bt�-�Xe�"���Pn��������-�#7�|���"c��k�g�®TR>�5)Z�r��I��ň��p�Ek:y;R(�qZ4~�x�a��&�F\�I#����I�a Շ�cQ�� �Zy"iW̓<�2�1���a��Uo��9�2���f��#9ف_Z��y_iѕT����I� ���5��ٔ����]m����)._=>�^u6�*��&� �˪����x}^ Y>K��`_��P��NUC�A�ܡ6l4+��2�!��"k���z����sm����ʰv����W�#
[c�Y�q,�(`v`��L^���`�ʯ�LW��0Aj���<9��zV^h���x��N]q\�S�ӱc��"�Gj�A# >m�~s�������?����X�MƩI�����4ϗ-��r���#е����3LAɛk�Ooԇ{�d+TlA2}���* �P� �����S����ڰL��g��Ef���d���,!�r����Ehn�@�����WO�������7r�Lnf��0�Z���gu����'W*4g�١��ޣHפs��Q�����"�Ґ�z$ؽ0��-讀��*Y�����'R}�ϧwy����6�'c�X=��V��di���*��M=�3E��
c�F����I���2_�C�!H7 r�4^B\�RZ�ە+C'��-�يH����� XLg:�޾{:��e��цfn�V�fP/^;9����1um���&ck:p"hUx���1��m��>��,>w��}"p��&�O�W�B?�j���±R�P_( ���SM䨭�<w|z��yw�aO����\?� �=��sm�5������|���˰cP�$�+Ӓ*��Æ���`QVG�M��Fzp��dV��P�s�$� R�,IJ8�X�_� �6��M��6�4�(��8�2v��˳>l��n;ݎ�j��p��184�J�MJ)����R+C-x�
4���ʷ�>�#q{��=��` �E�����$��0P��C@xa3)k.�X�����&��$�=�>v����������/]=:�����⌭����X�+ap��;a�����FA���ILl��fDl���F�w�~�(��®��%;�Y���@��������1�6������������i����b����^|aN��}��kw�_r&pɪ�w��l�����E뢪��E�Y�F6є�#e�bڼt�b����ܖ��ɳ~��G�R�Q�Y�`��$�~ٳ߿h�����_U�8ʢEK�7�����J��fi�i7�ۻ��o���|�Q��֩�y�W�EXtYl��M&$Rh�X*f��F^��p����aVq��:
6M�ZH�JWv�<F\*�T0�࢓��JܶX;�Y��&��J��s�g����M��ٞ;�W�FK�H�ei�{h���3�kF��&��e�Sz��d|ߏ��q��vL��D9�eH!.��N=��(�:�(���$t�f��Lr�U�/ :��9�����c��ȉc��W�:��J�;�����c	8U����f��I�]�N�lD��X6TG�#B#��#q)>�
�E��K�)��
���N��P���O��i�eGeϳ��j���Zn�6�<&�X� ��00o�+��lǛe��&���P�#���0$�4yx���>��eS�CQ����^N�b�Kʮ�#���ͯ~����M~:�z���\�vڥη0(�qV�W��$���R)����m ��&&E�:�`wO#M8�%E.�SS�.8�C�=�f5�#�0��r/�7�5��9�7�?�n�G�*ey��(.]<>�#E�n�CǄ/[tC��]�D.߷�u��$��	F1a�,��x�
o	�|����b�hͷ��@���9S����$M��|.���qw�5�hou��W��s��öڄR�0�zSu�@���Y�
�����du/O�1 ��ª5ў�"+�B(�OY�����:x��N�G�� �i�A��ҫ��ˀ��Owm��ݪ[G3�Ix��iZ��M--j��Ք�&���a�Y��JZi�-{��Fb����G`=���(�@/�r�LӁ������Q�*z�m������ͪ��%W�=�7�t�����!^    ��5k[��R0��v���U��s�zfn~���OJ����"�Ab���ȭA�Z"2U�>�/�(&ϐ�Q;���J�:��M�o�W�ݭٓ���}�|�D�"HkI�bۜ��r�=���ɱn4ӈ�20��Ӿ�a�"j�0^"��-`�E$�m,�.K����h���;��t���Pzt���%gi/�+��� �m��x�Y<n�#�� ��2'�%U��r� �o�T����ɓ��h�� ��%�0�(�䵗=J|��T�,�S@-R;�H�8���2kɫ1�]�\ ��}�l�|��㻛���7��j='������;�l��T�O�e�p'��kb��8��}���=L�e�8	��ȴ����7ȹVic�P&qF��k���	�M��n# K��g�a4����z��]�����u�^9��Ye������4I����K3.Fۚ��e�FZ�}������'�
:j�YJ��(Q�(J�{�G^��U
�N�:� �ƽ7��Ȭ����@�mѰ�x�������|�t`�U7YJ�8�Ked�B� ����G^� h�y�äYZ�>[a�C�j�*��h���H��D_�ci&�FNc[m@��0�T��xzH������J2N�:8�4G�t����Ƀ����,�� ߠ�4i묓��*��[��e�}��.���GS)��`,��
���Ձ	]�t��
Dx���X���	?t|��}ͯߵ;|�A�����b��C|�JR�����8$�Ț�)g*�J����~`/{�4>��ڣ�]�T��v@2��Ce|�erH�9���okR"��!�॓5�sY{̱�­t�����WO�#��G���QG�b���51���
6�fV��=�\%ay�$Lv��St\%8[(��x�)@��x�4Qפ�$
�K�#ͤ0�:�jjq����y��[֦'���Ǎ�����(AsCʔaM��e�x]����p�1�y��e�7bi�H�X���,/�.F�=� [����Y �~s&ru=�.}��zZc����_~�{ܠ����P���t�%;���**�8�ch�t��:����JS��i61}��/�$��\;��Z��"~d���	;F�T�D\),�L���B{�;�Q۪��-�r������_�?��ow���q��m�D�|�����4G�6��b�N~H��e@��a�*�L0�*rL����&&�����r��Z�=d��c���"֥\"\��a��E�����E�A��sK�d�}��Ŀm�#^���/]=�ɝ?�SK9��2�B`������xɿoE��&&\NA�JJ�^�����Q�ڀ4\������bj�Z"2{ʣ�P�,��H��*�%��������F���������KW��ƦIś�;޼�c%̍�K����70\�;�̱ƗML�t�L�\P�P)7����<5�jgN"���U����G���i�G{v^�W��{��D�W$�4����W�=Z������G���^M�լ����}c6������;����
�`� a˸	�@�k:Y\H�U;78`�a�L� gN��v���7�]���n��D�LVO��X=��H�ZG��i�D*B@)b���#5=�w�"�0I& �R��nߤ��H�=�ۥZ��E�َfe���Q�#�=�f��$AV�R�w"���;Źo��!6�%^�4�j���Z�:�H-��]�|�ä���.H!92g{�_��0�rphU/g{���a?���(��8�"9�t6�,���klv>�s
t�Z=a�K���ViFy+-�#I|��T�*�!�7�Zݨ��<|u16�0��[i
:���I�8(�����d`��q�,�5�������?;����.��Ֆa���s�s�Z=��N0�O��e�^3촋$dѫ�����2O�q�
{���H���KA���o�����ù&�͈�~?�l���J��;zj�ﱙz��*a�G)N2闯��#��1��/i�3��:�f�f���U��{�n�ä��#�%aLa��Ί�c���Ӝ�^�UKU�FfK�n*�T�}��}� g'}��_)Y �I����㳪�bb�`\wN�����D+�Y���~�>��'��]�.G� �����P��➌�!{a��'������\���D�N3��n�o���[�.6���V�d�y�W���c�w4�Zj�N�0BL��rM���w���F�갇I��|1�6 ����$�R�Z�J�'ջ�qo�����9I�0@^�U��ޓ����K4�͸
K;�z\�z<-�*��#؊P��Z\��t��Z��#�����2����ɴH欣."���F98Wѓ�*�S�p�d	BV&-�U�D7�)f$��x��{�߮�(t6�<�|��bQ&�#�ܙ�����*|�r]��[�������g�2���D-T[�w�M�>�P&(?ɬd�5�=��Eq2����u e�x��.�^��?���a�Y���z�J����H
�M�f��2�֌�8�X�5��s�G�&\]�0S�	�/��9����%ڋ[�W���i�����p��!�IAg���3�Os����织�?�ݷ�ۨ��'�uR��|�8u�)�ۦ
U��#�Э!�K��U��k�[l$�{��أ#�`�d���$7#9>��C�v�����$��Bh���MDQB�x��0�ۻ�!��Bx6sE����*Ov� k(Uk9B5�k��k" )��5ָ�a���q�� ����*�g��Q��R�?�sw	�C�!EDY�&i��Te:=��u~�f o�se�W�C����#ڪ�ذȀ)��(��5�Pl�����&i���W�Ey�� \���\�)�� �c�;<T'U�b�~�g�`e�ͧ����.���N}9O99��WO���Q�gV���+�sYl���Gp���4wS�=LZ-Fj��u�)lݧ�gY�m���/d�'G�&����@�Z�(s�)��Z���KO����̣%������ǔ���W��@�C��`\��X|�o�q�=��a��ZJ�2�Q�L@�%{m��y��Q1*�/�a���Ȱ��$����ggHz~z�C���w����������'���ql�#�7�<�pZ1)� ��ҩ��w�<<}��Hd��T��9s�$��’��eĻ������YI�[J�4k�UŤ����<��f�JZ�畨W�G~� �C1�(�4L|�-6��Ip�[���p"�y�갇I�ml�����,hXcD�R
�K��b��K�E�GE�'we� �	]]�o��ܵ����+R>x��9)o\�z��p�k|<Ն&�j���[u��q��)u�:��]���3Z�F�)B�d\UL� ���⑱$*R�e�FF&5�&hܙ������M;��p����)�g�M��L��Փү��!�Cx� _6�V[��j]��/S߹�x���J9; ?��Dz���8� ��3CK���ԁ[>!P��5D�њ\��񛻺{����~�Toͭ�wn��O�X=.�v%����:J BD���	R�Z*0Y�ҫdm7�V�&�]ƊO ����5����	*��_ʢ��-_кg��FR(G5����F�.�����t���No����\�z��0��-i�Ȁ���jP�f��l7ɼjR�?���<|R���${J�J%��qo�VI�U�>�v���HŲ-�M�����Y墁<��ŗ~��'�}���tVW�U��l��P��)�;I��n5�o�A�u��,ڷ,Zm��<~՛�$šm��u>�5 �Q��Q#-�O[�Ț�0lS��ܥ��i!{U�>�Z}|�	|�y�p�����x��oݴ0u��ɭR-`�z��$�f�gc���y���⚫��՗ML�z�@wp<t]8�")(�Svl�Du��ya#p}�@�~/����5�#��]���,(����s��(c@<0a)�t�8�BpY[�e$�UI�����!B>3�`�7�[s�/O�C_k4!��)��e��$:�ApI+���`�:��,^�P��s�|��    ��=~x�Y�g�)N0�ekǡ`�v�{%u�h��l�+��m����ՊV��'h�w�W��:�� �*Gѐf3P�SK0TӺ�F8��V��O�֕��Ѫr����,|��2c�j�8�$stoR�x�Jϥ��Sk�Ȫ�J���(��ӕ�=LN�y�ޝ0�_}�`�~fo�	~.��"�+M�Y:y�%i��3���pR����p�7�S�V5�U��I�7��_Hྪ�\]�����L�O)m�JV�ʥ�/��M(��pI��\i21Q�1g�:�����X��U�Z��Lξ���)$;g�8�e��mR�:��'��.5�����
�����(99q&�s���c�Y���'dJ��G	Wy/L&e���T��Ӳ�~����ʌ��!RC��3��pSA��ϜV}���G�v�n�[�*�f�KWOiG�MYF�U1����I�)�}&�.��/7�U:�a��B�/� ������in���栃Y�k�]{�uFU#"��:����Ö���n�t���������Cy�	����q�CW@M��k1t���GJm��P�'s�ԍ���&fѕ�e��q��� ���Ff���`��U��k</i���*YT(*�'����Qai�@��qJ�z���J���
�p��R aoTc;GN�rP[�/{�IW�Ծ�U�ά�$��0u0�堳$3<�"�;֕(C!`��,I�����Ϗ���_7�6��;�����m��>�-(M"}U`-�M���<C��\]\�0�벶��i{<D��ݙ:���聙��ܒ3���g�y�k8p���:;�2~�wO�{�?b[y�+����q�Qv��		���:N�����P#����F����~M�}�l���	tL;��Y��E��
�QsR�zK~�Hb�RĜ(/2k(�+���+�_���y3���2�m/_=a�p�M
�a(#�,"+@�e+V�2�^9���a�g*�%5��TUl���k�T2I��J�\�~ϓ[��t.�|S�:�(l�L�샬m"U�?ۜ˜�j���J�q7�lik��݄1X�^�*���jk�M���'�i��*�{��̭�B�g�;~�,���ݳ��Bb�G�bi� a<;���	(p3W+o�e���l��'� ��I���\k5�E�N! .g��ѹ�xo{��*��ө[[�~u��}:����]��c����A���	��\�����z��%i�j�2�S'�����rp�9�Zs+M�Ϧ�-��4D��rQ���Z�0'�q�T�����*�lP��K�e��2�b�RF' ��Ւ����|���gǬ߽{����ԓ�������A�({m���%Y�i�)�WK�U�����g�ݲ8�(�}�1!�-��9E�[ː�r����с*�D<H��EH�5��_�l���<�,����m;hn�'Sٗ��,����Uk�bǉ�P�H�N����j-�ѷ�E���a2g��\'�y�����C�F���X��T�?'q^�'xi�N_sJ�baz��T��<���W�t�\�x�G��n�L%�fy�)�3m��0�p�7�X�=̆l��D������&G'�P��L��
E�5��̮\D�)�HM�seŻ�;`��:	�΂�W���$Һ��]R����*L""�j�]0.��)�V�Z>I'�']H������"b�7f:5M��v֨�bakLU-j�Nی�Ōs0��������o>���j��Hߛ��;��c>�=�r�eM<�<0}K��e��q����dH����a3YC�b�@�!d�K���`������tە�pnBQJJV\Qn����7���o�R:�-z��q�����B<�֣p�%k�/���t�
���X�a��zE.�}�w?/���M#�5�"�#��X=\�p�BG�G�#���0-����G�Jۥ��w������ՓQ`ʉr�k��x��-��ڈg��؟��JW��'�e���FP#@�aal�1MG���!�
ݱ}�2�{&ۜ������`9:-�7����������G����'�A����g�����7��7�3�..dx(�F|9�i�/�U��?�&�e��|y����o�aO�/���w�|�AYS��.�����lP-���L#'��3��[��Sp����n�A�ͺ�Ur�fz��	��֭��B�4d�d��ɔQ�~�����
�ܦ���&i��`ލ�Q�ұE�)8KR
�s�c��Z5X#C����ֺ胹D�r���ņ�S��:�W�I{��1��$���l2�jN�H�ό�d̷͝�y�wy�$��Qd:����E*��R�ju��X�@
ep�$e'B��Ո���rX����m�F���y��Im��Ȧ���-��aT,[��uS:k4Ww�"X�0ɞ�\Z�zM,Hi���(ѻTk�-y>�y(^(G%z0�B����M���7�
�uZ����W�a6�}-�!���XZ3>�C9��4�*ڕ�ĵk��&�!��³��qz�M���T��1� leq��2CA~9+a�R�E�\�<�yV��w������->������x�g����۾�U�u��i�	����9��W}J�A߸uv�5}y�,Շ����;v�9�9&�?����vh��V��܆����K�Y���Ŕs���s~nZw�t���B�^U��7NQ�4ꦇ��wlV��#~S/�]�:<~R�op�2[���Mq]����
>�#�8�&5�`�8��9�؝��O��ܭ�N�N�?�#*�w���E_�N":_ֽ|�8-+�s���X��l���K�,���5b�-��e�lR��(�ߏ�f6��,E�I� ���A���U��)0�+E��5��Og�(�ť��u� '�����YÛ��X��|���o�ʏ�ǚ�L�Ew�P�z���'���im$��Pi�b�Ǩ �T���h�3�>J&ݩ�%�Xr���駗������&Cm�@ �Bᥫ�)%�{�J"r�%�Ԋ��D�@$�iE���;W}{��Rs&J�&�5�\�*����[=ȝ����3E��ȡ �~�B@�"�{s��n��>��w7o�!��#~�)�Hf������>�� X�Q�D��zG��nZ�2g���L�e���ɩ�
�3�eg���k�>&�a��ZuR��e��2f`x�^l�b�Ɩc�i�s��tn{b�$oӤq��Փc3��#JN=ٻg "G�w�bX������铆h�YPO8	�`k��
]��Ii��E�*�ne <�E�mxF�F�/��媨�����w?����+�E���8�x�|�$'�d7����9	\{I���Qe�5��U��J��f�p���r�bYޚ,R��F(>(�a^,#�իf��^x��#����&�����Y���ç�ɱn~�����1���#��wu��q�T7ri�s�����X�\�=1��x�#��.{��ž���Z-����D�,�5x�%k��4�"�0b�l\�UtJ-�Lz��=1o�=ݒ��C�7o����e�L�!g��KW�'F^D��隍Y-�ެ�C�!�+qƫUI��Oz%LJ%ehُ��?@w�e2��]�d���1pC�kF4d��.�SJ������������Gv��Me�X=�6�x����"�`�-�
,_����Rr��Ƶˏ�&t����/�iN��6n�QN-�C�2�h��V��R��s:3Y%}H��?������r�}��sQ�� ���i����rg?|����@��lYMp;����7��ML�eD���R=<X��p���{3դJ�I���_@"[��"a1���U2>�rOd�,�^����=vΨ���W��>��2��S��c.6�I�v�܅ a���:k��&C�����N�TkX4���7�4S��_�9y�(��̒�E����!u�î4 ��G�|�<>|ظg$;00k��t���ums��x��s�j&�Zm>Vo�j�QIF�%$w�Ĥ���ձ;T#'L�����S�R�{�2��R��BrY��|��.���(�ۻ    �����O�)ǳYJֈ�&r��2�6�12G@���TT�=�0�g�V�*�I[��e�������]f����'�O�;7~�GД"½��R�,�d|�'\��>������ws$��됔��$\�z����S>�mٽ�u�阽�� t<#*��u�����&�C5�M��C�6���eA�0t����ò��%�B�;P	�^�O�1�ڪWd�e�%�L��%a���g�KWOdks�2C���TIE���s	/�
k0y�R��N ��N\�H���zcfmb/�/x[���ҥ�~$��ٟ���d��UںR��N\j�}-�Pv�lv���Qɐ�jh���Al�$��ڗWO���_u^o���3ŸnzNrږ�H:F�>��$�4�J�T�8�GPq��W'e6Z�\a�7���n��k���k?A��=�Z=��/��RC�����8��G7Ŏ~F	Z�$�a�6j]_6191���&Q�6�$r4I�:��e�K�P�:��Œ�s*R��1`V�}�~��<��z���epg�_�z�3jNFY���j�iDm���g���~Ū������+��|�h\a�;@y2o J =���\�7J�Q�)�R�
R��Zw��}�����YɸW��tT'�.����1\K��G���n}Ք
�Qi�>i�ư�W�i�N-u�hݗ��Q���z!�'˽�&iTCk�y5���{�0>�H����燍쮁�Q���|��1���JXkq<��ʁ؞5���_%�C��
-Q��Y�=Lj(�5��������9�xṜ]: ���0����Đ?��7�:|�j�������Ǜzܽ���Ǐ[�e�6��gsX���T�p�\�]p��).�.CWj z^��!ο�,�Fe��d�>9)��ܳ?�D10>�8q�ZM�*&��L�nL�����Z������6�ʰ�	��t�����S�!��T	#�es)�ˮ;U^�K���eᗇO���
�n�������"��6�B��������UQ1�D���
s��J�?��>���r��jB}��q;�O,�&�o�8�eC {ßa�
�'g���Ī�=LJ]�3��"B`D�C��pdSݡ�솔��U�����Mt�0� �WVu�ܙ&\�×���$��p��Y�W�/�� �0!�I�
�>�΄4��J:��\'ͻQJY�0ar)��a	�*1�p�+a��t�� ?:n_�1p����U#$$�V�Gf4`��=>�ʏ�YS�!L��+VO�ܓ
H��=�x��t1d��5��������a`���4��(�^҈�`s2�P���d���X���!FR�֠\W�ٹ�����M����Y��W�'�euNU�*R��ʸ��Tc�p���06�۫�{n��ML�}U^Ղ��7&pmp�YT+G�ʎ��D*�2�Uꭧ�,D� �˽���i���\w���:o4�a���������rb3Cb۲E|\��-�A�Ԉe��a��a61�k�����jǅ���ĐV��(�4\�K�e�!��UHE�\�Ց���1��~���������~�*�)k���]�z�Q�iD�Fk� ��������J^5�Zg�U𽛧;{�to��g��'��#����(]�b8h}#vVY��3����(�K��_5������� 8������۷[5 %c&f�����r���w��F]�ap`�+�f�X+*D-�
�t_a<^61#�T�%��e*ٲcN	��I���胑{�b�������WM��� �׼{�����9����ct?�3�X�eYՖ��k���*VFy��-�ܗ=L�^e3a�h�S`ơH��}��t�B9�葔P�&�'��`�,�W��^E��GNe�~��������C�X�T�~�=8�3 �|��g��Z=I-S^��s��e��4�����
�����͛t��=Lΐ�+�Z����BOŔ��nkI}�lE7���W{��6W�$�ȭX���pV��C�������+�1JaOT._=F�,� Keݼ+����;m�ۋ]SꐾM�����GbV/ضF��
�Oڮ�`S��j��VG�	]XK��
;�.G�9��|���m�W��o�O������1�CJj:�w����VR�V�oe��e��U���3�@J��9&��O�c):{	ӨHE���!�4Y�m��:����$5� Vֹ̫y��k�B�����z��]����O$]��B�����'FuQ6�*�Lz�&��8��˚^7ZoV���:Z�0i�o��=Y��{�F�;˴�W��7��%�a������S�i�z-b�����n�6���淟����n����~vn�j���:+|1b4��x_e�H�62ʛ�$�7Nk���:��[�0y�֑�+"6=[�z��;��G�=oY�.rg�A��o������n�	�����	/^Qʷ�C#ڨK,2 �w��i�^Q�_O��ᓆ��⬃msQ~V*ď�H�̺��6������t�����#��9��������We!�m6M*��.Ga��۩�X;���ԥwCQ�m��V��W.��0i� H�E��@ ����9[d|W��v��Sn�yD׊9~G���PTib��'�Ψ셜��;c�TH����4}�v�č���a|K�
Ck���!~sU�y=ly�$P�mX2�j�asg����Ůz��ٯlew�V��bBJv�z҅��ebE��V>ݵ��p�;�al���g���W����%px�; QsI#n�yU�dW�z���e3J���:�&(�@Y��Z�K�׶�)\2x��s�t�E鴃��"����^�(��#��y�7��-�n&�֗�C@�� �����:��"Z�/���,9}��x� v��,??X-F����Fi�(��(� ��XR�+�PN
Uń����N�d���\�j����������Ǐ���6�g����dF���*G	���i	�b0k��<��׮~-{�����+�m�_K�3�#��nT�Y��tO��(���=d)FN��ʅS|�6����n~�l��,V�ͤhr����7�#�)��K��ė����Y��)��dz���/{�X1���Ȏ_�.d���Qu���� ��)'&;�Q೙���m���:���qa'w�~o�e����(�ur(��Y�A7�0�a���|� ���Y��F���ƙm$����%R�!��,Y�r-Z�D7�SkK���,�p�B��;f;�(n�P�6�qq�k��_�ףbj@:e��l�j�8E���7Kt9�g� {D\9[L`�&ri��{�a��=̴Xe�<�`OO^	nL�XRvI*����\E�O�_"SPcxϦӾ��z�ߏ���t��ؼj�d�!�}m����d��Z Ҫ:�u����&;\�0i@l=)�/�}���d�Z�rD��u�Ѐ ��C��q� �DN��h5�VB�m������g���=<��O4/_=n��)�P���nIJ�x3<�F�l���o�䰇	&��r'�͞v��#t�c϶��D]�['�Ӈ�伀��B�h(��|*������o�S:X�j�Z=�T�Z�V��aD2G�L}���}��
���Ny�ì���6��ϴ�P]Z�I�"+��C�a/�'"�2�X�H$�M}4�(�;�J��J~-!h��0g\�z|����j˵�KԄ�I���z�{�٦�%���?!Xn�k��?u�$�q]�>�|E���k�~�(R��҈�����+���.Y�$5v����U������A��&�A�.�H�{�}Y[�Pxt��e����ҝ��LiJa�A��� ��}�z6b�T�����>�ה5��&Z�g�@ݴ��W:�3Y���:՜���F5v,�7)���2$��3L·R���.B� �V�\-�ЕC:���[��t�=�w�u���=��R�ɗssyZ���,~����4�Aׯ^hB���<4�s�o��=�"P~����9-�a�q�%`�p�fW��Jed�kʭ�f�=���EW�mԫL�׆yar lO��Y?�(+�����EgoZ]�    )���@� �(����˰|n술��엛hr�~V^�Ǩ����u��ڄ�q˰�'�[t8�\�iBn�����"0{����;%���_�<q�9:�-�ru��J98�RUK!�r�v��t�vH �������#��䫫U��/�����E�P�%��mˍ2N��#�`.�C�O�ٹ��������?�����T�>���ܰx���}
�����eXg�\��d�m
���̆ާ��T6�B L8F� ��8�f]o�+-��� 7�S�����:��u�m_W�4q�x��1Z��B�V׈/UYp��.L?̓U!x�J�o�6g%ͦw�g��p�S����P��B��m���v�@N��D.b�8uR�U��?p�࠘�r^��wHK�?�~_���)��z.9;9��Wע���L�F�f��R�6k���o����m�W?�郈���(��Ѡ%�=뢳��8�g�X�
L���Eu�����r|W��T��QԮ����{������,1���Nn?�{�ꅌkV��.U1	��w \� �hln�S��7+|p`�泖q��� w:I����鰜s���W��-����W�AQ5
t����jO��������o?�}��O�翌7�R���~8B��ƀ�x��WׅLÂZ�$O�x{�m���O5���β������U_T4�V����K�C���2�?������V3��E�b��5�z�Y_�؟>|�A�0�a�=8I��{�nX]��UV�3_C0��vt�Z�5���6����+�|T��>�ײ���\N�t0�~�թ�8�@�t��^�����.
H�ho�M��mvR,dz��f���ǐq�߰��n��%�}�� ���m�~W/ض��i�)���N���l�{-B%�0��N�B2.ZR�<�β��"�OJ���F�xTE�/����\�����8>��dT�q�V�uM�J,I0x��M��tj�j�ʚ��`l�o��ё���v6��*rf��:uo�$X�$=N$��h�I���h�ȪQG����%L�����'�ԃSʹ{7�^�6%W����n�1�(��3R��,T�9���Cw ��Ob��dƠ�iҘz�$Y�ڇ]1`*�`���a˰�쳋#iњ��;7�ɛ�_�ק�S7?�|j������K��oX]w�F�,~�	�,��pR�|Y	ph������͇2�w��d�w��D��I�y��&�1���%��t%)�HTR��1Y��y��&����
5�V�{�'vj�����λ�O�8e���S�vq�-��HQ���W�A��P�z���)�?�X�_8���CLnZ�V����i����Ycq���utG+���&2�8P��f�JY�������+�<��ؙ������F�`��y���X�e�ئ�8j ���\燗�0��|��Dȅ#�܀�s���=��	�����jI�s���Հ�q!C�6��Rw����'�L�O��2��0��t��/�J�s7e�4ΰ���mM�z�XJ�e�I���� ~bQ��(شv!M���4DY����.r8̀-��� ����:6u��70�|�����d�Et��.��q��2lg�i���x�/��7ם?���pm���ҞZ���K���dJ�D�^p������V�AR�����e�����?�'�y
5��^��M��RF�`8����X��R�jD��'����Vd�?Ä7SP]�~�x�%��x���"r&7�Xb5���q�5���=`y#8���zIk�P��߾zzz��{��qްoT��J�2�Jf���ֳ�X
hr���eYb�y�-�c~7����4%��y���ߜ?�d�����_�G��i�x1J����������TMy���qbc� ��'�wY��L�i�~��ӧ㚌�v��oZ]��X�,�w��
�{o�ߋ�Ǡ��E4���|�I���@�5�J�g�2|Ŀ��<	�u�=(��7�8݋�*]�Ҳ{��O����J
9�0W'�jq1�(U� ×��YJ����T�T����y��Ah�e�I�tU ������9���yu�jW�,㪬1�ET��J�X��B�u�u�׺&^�l��QT�.�G���V�p�X��-�����Jm����]1���ާ
�=��N����.�E'4ǄF6$а�Zi��rǊw�'���$H��Т��U�r�L{�����V��,
��u{���V�HH�p]���@���i�q�G�\�W�i;|�K�|�~6�w�"&-�Ѯj���V7]k�,����/T�"�vݲ�A3�os1)�Uk\�3�C��_t����u,
�5�4%\-u4c�}�j�J�˸��u�źg	[/[O���� �� /�9�ʛ6p���|�,�R{W9Mo)xVTI��/�]�a?����>|8��ʇ ��sY7�^���N�KԤ��[�r����� �Z�u�a���gZ�>:�۩4:�.E��t���犍ѢќR^"365�h	8E3�6���O^	�2֙�݇7��N)�,;���8��� P	���jF�F��k�Ţ����(���r9�Jh�Ő|�g�[1�w�$	L�c�b���*���:���zimsJ��>>~x|�����=��F?	�_����I���ެ����Bx�Z̍[6l�=p�����ER�-µ8J˔�f���\��N-��&+=�h�c���A�JT�VSڞ����O@�{����,>�X|P�'3�Cׯ�c�����@ݭ?E?Kj��j<��Mށ���f��λO�jT� �e4�I�y��Z%���F���l��?E.jH�<��[Ozsb���_;/�`fr��]\��t��y锇a����u.���Qku��îǗ�'׫sR`��3�Ld�Z��hih�b�j5�R9��m�Y�9� Tq���:����ˀ-m��E�7�^H7E$g�x��I�?�̨��dmJEn�4�Տ�r-�O⁙���^�����aa): Fw�	�j4�A�8�Z�� ��b�ُ�	ě����TϳZsw��M��8�.�;d���͒K��?�Fb���e�>�Y��g�Nr���)���,@[�K)�.K�+� xm�d�5�*<jb��w����Չ��t���H�4�L]����ex[�2`�(��K�碂�*��mF.��1���e�	��9$|t�(�<E�CO8}��,U[�(xS��Mp��$I{��}�6���܈�{~�\mo�~|�޽��5mA�vu]6&a��Ü��AU�ޯ^���;���}�l=�� 5?e�LX�ܺ�E�[Wr�9�
_�oUյ�S��
,I�syt�c	ڴ�����W"�^���nZ]� �
��Н�����Y)�;�RW���/��u�}��[n������T��9�Y�h�x�S� #$M^�)Ψa�<xh�s�v��fH�����[���UD��^��BZ�J���3�mu}R�'#��0 }�낷
n�(8�M	u0&l��~�{u
.�#�0��3L��@�,�/�U3,�PI���9)���#��0�:��	�1�q�ν�&?}X����+�A�)�O�nX]}��{���tղ���Z۶h��Ep�[��v�}b9�*�S!�� ;`�.dME�N���p�(���`節 "�v�XS��1�4.���ß~��g�����_���O��!w�F�_I{�8������յ���N�YI�"�F(ւ^e`�M�.!�;i�o>��i}�~ҽ
b_�XÞ�%��($�Y�<��je�8}��z���dՂCjG-Һ�韗}A���C:�
��E5���v�bF���$�Ob��6�
NI�M^ĥp�꣮���g%�|��E�!~�E$��5�(�F ���+��T-�� e*��T�qjSy����w���W���_}���G��b5o��q`�1`@����OX�����{�Y<�����룿�Y&:�n�ĸ*-b�9��:o=�Y�l�{˒�fШ�]e;����h�yI�xN�-,�6	P#�L�    O)t�a�����]}nU���*����̙}�w����R�Ujp*��޴��!M`��&3�t���:���>9)	�^�
���) =����U�p�j\\"޶�G���O17d���� �{z�2���ȼ����~��:
�Sr䤙Ȟc+s)x��m(#Ec��|d��#�)�\�#˦{(�9�+(?�"7ce��60~fs��;�蜊��-��#���������U�GhoX]�w^	��a!2.���:�R�������:���Oj�]5f�*���Yf01`� 4����\���dpr�Κw�g��^@H�RO���9��U|�����?��W�w
�G�rv�(���K9$WKR~kC�w�P}4�s�}uR���Q��rqp^�b{I���/�Z�S���3�,�f{B1��o�B���^���(shap�eJ�����UHWG��7S5��C�n��u�uScn,e�Z���[ϚV���bP<g�E�ml�� �KŅi�Wz�]��:���e�r�Tv㕱m�zA��+G�Ϲ��oX]�
�Z�2ʶ<R�ɪ ���;�>�e��:�[���X��Z�`@���W"S(M��dE�ө1�
PA3�g->S��REmᶷ~���o�׺�`���oE�au��W�,
<JJ0*�\kd�@Ln��	�b�}c���T�*�0��>���]�$pm�vA�Y�Z�r�ԍ,DA 
kC����X�t���9�T����s��:�����~u���Y�>F)^�X�0 �'Q�TN��!����Z��M��Ù���m�B���b��öZLNg,�u�P��(8p�^F�M��������}~z�����~6�󔐳��nO����u��!�n쀩Je6Hk=�V�橣��Zpj�~鮺�3L���iJ�s�P�]9ʆ7����2�]Iga4���%ԇ����k�
���}����凿Ã}���G>�8��C~�^|��?�)�\6�F�_��x'�VV't��Z��z�ލ�+3��*�\��!�u��Owd�o^>�A�����,pG�q����b�bT�C{�؈���i �'6Yj��.:|}��鱦�����u����a���
�dN�����l�(�s���:)cy����M�Vm��/��\>�D"��tpVLVQ�$r�H+�Ě5�\pbKrK'���i������l��4�G�<~��ӡ!ss���4��W/f&(�k�, �Q�D*��,�����B|��YI�e�I���Ԣ8˝#T�g�L�"vP�h�Qr���h��CG�L0����l�S��a���=�{��E�����(�΀F���fkש���i�)m�f~A9�'�X�0���d١`��X6�|�;K9F�|ܞYԉ+�lA	jm�ߓT�r:���O�5���t=7/��i��^A5;GM�W��<G��_���Np����+2Y)��`[�q"��TL#�G5��D�9�);l�V�s��SY�"M��y◾���0L�s�a�V/b���"�ܢ���dÄ�-�u����9�/���2g�:�:k*dgB�T�הC�Uz�=r�#�����8|�@O�G�v[^t���zy��U�ߵQ��Xܰ��QE�4��<��e���`����.G�䍂�=�/���Οa��=�&B���]���6U�w��D���v�b=���g�Ǎą,��eJ�f����!?շ���)d��woX]�K70a|�
�S�د� ���@��m���Ajx�|bk(�g�y3�nY-D������,���h]F�  )�*A/�h6�]�uwsÞ���EJA*}Q��V�
��[���j�
�^I��"m3#�D��?s�Q���1A��Ss0���ؓ���}U�f����Cf�K<55t�t�.�5C�AL�#����[@��bG�a��%'�$|����U���0��2G�y �<�̦�pm�����->j �}�C�ki:AO&,�S���t's����#�A����@%��C�l����y��P�k<����G�/t��s��Eq���l��Tɀ3�xj_����":��B�G���'M$�����+J�ӽ9�=x�6\��d.��$��1�lY�ER��S�7�����'~��QY6��z�]]G��x�,��H/U�2� �w��n��_,�y�I�#`����+y��d�.#-����}�95mz$�Qr ��3���T.̫��9����O���9_�� �_]�Ql9�[�a��%��{=(4�A	t�Η�`Ӳ�,�_B� ��=[
���~`���eX ai����}kZ��$����]p��!�!?��f�s���Sy�{���I4��u?1XMs�0~�R%�֒�r�BU6�0y*	�������B��BQ�8��$�EPB�b��˝2�G�0&�=�>̋`�& U�෩�K�~�Gg��؟s���
r�@gSѾ#�ʪ{� �e;F�'}���av��$�+An��l,��6?ˁK��K�5XS�Tm�8/\<Q���ㅕ��Z�t^�cz����{|�����r����kha�+���V�:�G�B�i{�N��Ŏ���ҝc�	פ�P��R����K��NK(���}��-��K��+W����a�t�����o�g�|�C~��x%�����G߰z��i�����c�zLu����U����~���/�Ods]ƽQT9N�1��F�6�!C7z)s���.��������?�\$���L�����ݛ?r���X-��c~�]]#�Ԝ����t���`܈�]vFK�f��n��ϻO�Fα�"5V�s�`��m�ұSu�������-wg��:j>�v�j}��?O��*&�ߍz��f�'\�c4@�5S0����a��&�a<ח
�.�O��Y"Ŗ�*�} ����6+А%�B�8QSָE��*(��m���'����:�yl������]���͜N˲�PDD�ݰɲ:ms�B�w�^�Ѳ���&P��|��HY�{�¸XSifI^e�bo�fNS��P:7/Z�t�/�RnA9��b����	���pJf8]��-��J�˜e�]� �v;N���X6�$Is��IZq0tm�*��j)��F���K�E���u��Ƭq�)·��*TN��(�Z��i��x�����W�d�G2�����6l8۶c%}�fǣv���'�[kP�m�N g"p�h5c$�`\l�
�m����,2��T	@�N�L�G�����o�OB�a�j�j���ل����b]���������C���T"C.�PW`t<]O��U�RF�n��^[5��GC:��gҝcx2%�����NW[��k&�ܫ���`Q�;��Ώ��y��LG0�I���O�8O�x̏Rj2���u�X�����ʯT���6#�M)�RR�;ÊÞ�e�	��J��*�U�ڤ3X0s��[U�G�r��Q
�(g�,��(	���U8�IN����>��,��J�H�nR�~���#�).4�z��b(ԁҋ��D-(��XN���S�;��k���e�I���<�e*�d���[c�I��Ø�z��~�����xʏ���F�nZ� ����/'k�`�5d
��NO��A�Y�s�~r� ��#`�9�3�w���kk�/Ibo�l�Ĭ9�Y�☲��Lu�h���I���ϧL�Ȧ��!Ӥ���u�8v�S�U7|\��F��=�r�=1�7�;��E����25�Z�E�%
K�����$�j�Y��-�jL��J�i��.�`�18�m�������q��*oaP�E1���C�)ZK��f
�Ȕ��4�, ��E��r����J�k��sΏ���lA����z�޲\�'S��À�ґUC�!;��6�������&�;Y������_�+�)>��$7IP]��V�kl��I �6��IINM�X���6��̇�w�e�S7�T((�K�\$זC�Z��\"ӓ>�VD������8J��U&o�!L_=���ӧ�]5w��S-�kW/�I
�)���<���Ʌ��	��pg�    #�H�7T�Ԛ��'�u�Yzf���qZq�"��i�q�.��G�)��}U7Md��B]�7��洞��j?&�wc�7��[�bg�Ey�jJ�)�ƪݏ(��"hP��ʴh?�w� ��`n��4~�{�C7Mk�����!�l�é��if����r}ԍzt;?"pפ��lԛVה���T�����x���
����M�xKi�{FG]r��ç�=G|���lL�sR^���hqpJ�B�p�4E� ���lE�51�y�#K�9�K�7?���c؟d{����N#��NF $@ /�L4Zgm�=��������y����.��Ik�Ј��_I*v��@�=�aTi2�6��Pާ"�����
�y�Ed<��1�V�ݴ�ָ��@:�eW5\֊���w��c�wuS��!��3�3�K�j�"ŝM:�\Ii��'���RbM,�ϑ�Y�>)�k2c7`�������� �&�/7r��:�*�B���L��O������WDo:���l>i<u=����M����v�ttm��aW�b��e��A#�Q�4*���� ���0����}����=?auM����Q��ɳ��؊��(�_�]�[y߽�H-;o=I~��Tv�uE���g��[������K�v#G���T3�0�@���M���0���|���F�ME�[\�*e�'�*�d��24��ʽ|Q�{g}��e�I����z��ԉ�1"� X�1N#�ˢ�Pu�?f孌��H��a��S�����Qy�=��ao��#�I��=�m�bDV��v*c.���߽h�w>���:�F��Clrv���U���G����8��-;O�P�'�k����4��'a:L��-:����d��9��s�p�E�p���
g�u������蒵>L��_]s��}�9��t�J�b���&`�����t��~�t��>9( �2����L A����>.r�/���'Iu,�ْ�8A�Xl6��;�"�Cr ӓ�������|��'�X!�$
��h��	����y�Im�Qذ?���)�cl,������0o�����:�����-���o�Sx5hn�B'5-W/^�Hzʹ�����<��`�&�9,���	λO�J)#\��so[�
� u�k��=��\�h�H�l��e\ˠ��J�R����ޏ�����8]���e�	�k��%�A�[V�U��J�(a9��~e/sX�l| �O���8� �$��V���r ���+lj�F����8����ݷ�Cv+���_�[2�X=w��:��c�h���5<8�7�K����6S����r��,���s:4|�8qj�H|��X�c�6�������1�0I:a5xnb��w�	SJ��r�^�K|�_zy��E6
0H?<s����j�F0�y�r��$�ໆ���\-�OR�e N���(�𺌒:�Y�a�Pg����C�[�du��Ԇh�ʰ�H-�W��>��nZ]'�z�7��=�k�i�֦&����1/�{��'-�O��|y���qY����-�B�������F��V�(.b����6��S�����;|�7������<��l�/��;��=:;X��a�A3����m8R�{��.���O.S	#*DA��#2g�����>b��Rhv�Б�����F'|�Y=���>|*��<T}.�#������2�]]۽^���T R�	�E`?��f������|��8�>)�`�3[-�+9ުq����|���_������f6��<��a��G�ۣZW�U|H&^��	�k��;Ыv(N�"��KJ��F��M.^YX����/��8o?SVұ�q;<-�q��� ~��Y�Z�R7�-�zcTpR4,���G�9��6��a)� ��m�^\G)�����b�[��b-sT�R�ʍL����I��'M�����Fp��Ȧ������K��u��D<i��,� ���e�X���Ի��Q��v���7_�K~�nX]���|�Cx �Z��&�6YÎo�[IM�y�c:�^���Kb5,;�_M���	�h����O���s8�eD�W��h�i�4�7���������N�ME�X���m�iu]�GNU������r��uL� �R���!�ì���'1%���+�����D)E��s�H��ꫩ�f�K}� ,�+Fr{�}ٍ����J�B���V��v���3��*���e<pЎV�7�%S��/�O�R�Pٟ�)��)�(���R�d�[�\3�82P95b��0�5tQ�����U�h�>~x�?��Ix$�53�]��F��5DJ�~����16o��nlb07ѫ�O��e�Il}(�?�p���-2���&(j�ơ�����A<9%9���Y�b�վ���	<V��� 4v��au}D0��Qe�d��K��5�9����Ha�b�'>o?�=(���v�u @�	��.%cJ�tm�Ҩ((q�ie ���ܽ���3����秏oY�� ��r2���Ջ����R��FXu��d@��ae˰�v��RV��ZgOהY�h�v�[���4R)Pk�*�ѲM�����DG%��@Ǫ� /~�B
�:2�#�hNV#8��Y���������JN���=���l�Ѐ���,� ����ݞ�(c��'�.H�8-�	[d6eJnU�����h=@�I��%0�8�)�x�漫��g�'�i寔H��nO��u�"��0��^V	f�s��j�t����)J�م6��JȖ�0qU��azA�E�
o�.T�r�=.�ES30:.Q�*1_��̓2��-H�{�F�_�P�W�=�iN��<)��;�w̓��g8���hl lRu��~2��`�m7���Lb�j�>�S��u���"kia<�N��<��� Sl�P)���������K��^��s5�~0�ǋ�����<���=j|��X6�d3>������l�	J��b�U��c����$�j`�[�ڎc[���k��Uـ��~>��*����uQ�'zN�6�p��q�@��7o������]_�������8I^��dEi�*��y�[
�E��g��V]�{g�����w��
��e�28���"�M�M��܍e�xBaR��jc��U1�k����{�ɯ����|ԓ��W�%��Ԛ��C�o����:R�_��8���b�t�}�U)E���T��,� )��ٕ�S:�M5J�;��h1J��I�5����f|���_߼̗x��������?���׆1�Y:�������Q�t���d�4�[�t[zٙ�ҽ���D���'�0);�Ak)�ò�FF���3&[u��&�jT�Ɏ�Sl�%zE���N��i��yn�kI��L��%ݰz1�
�a��D����ݚ�YAlg;�25��{`Go�� "{�)��=��-�x�����z)��D�H%��o��5�aSq�Z�?~��j����5�\��F�f�&���#y�ޮZ�Ul_�dCpr�)ݞ��+*�w����c)��Vt� �pOL,��pVX��ev0 ���F����-�8Gm�OJ?D�n��M��{iK� #%Y�p5\0u�M봑���/��?�>	U�,,[8��J��MÀ�V��	��h8<'�8�X/�`4���A�\��#y�y�������	
�|ڪ]�M��T�9�V׮��E�Z���s����2�T��M��tw��=�۟w�D f��ցhg�g\c�-�V�Y��ƌW�(�|@�F" �8 `����V
�GY{�w�h�^���P��ix���q� �:G8��KuAo;�L����Ì�y�I"���G0������  ŕ�D�!xݴ\���)��Qނ�y��Y������������}�g�JƊ���$�kW�L�fFV�~X�a��� 1&�����)3�w���TN�b,ϩ�c�W�{����\Xp����B�ʱqČ����z7��G�?~d�ҩ���C��8k��vu}�d,��p�J�2=�'��_�6�{`6��ܖ��g��W�;�Z?)�y�    ��p�B�:.���0�ki9�ʉ�.j0����jڝ��R�y H Ѽ۷n7��۲oT<��[B����m]�R�D���_��u��\��N�r�/Н����'���N�W� �<���~ޔR��.@��y�g=8�3IG]���[4ʳEc��|��EI��Y�&����)���Rr��']eP����"�X�wԣ��rbYS�E�|��~*E�Lg���_�M��ߎ�>N-J��<yx��s'*�e���k��
0��c;D��<� ��y�I���S�F�R�:��F�2��'p%��4yxV'�R�&�8�
ep� qW[ŗ��ЯM�W�L�Gׯ�cE�Ԫ�.F["�"գ�8n��;b���*�+��O�
Ȉ�5"P���L��Fg6�5� �έ C�v��k�8� �OdY�`NB����j�m��K��Ӈ�I����m����~u}� �;�4U×�5R�PS�=(���� ,��{�4��>��@IC9%�龀)��r0yCv�)e��=+_M�Bf��B7)��q�X��2����0�+z����qޛV�U1�GU�<pX��8�{v��m���c�!�e��P��я��p�`#�QQ���eZ��p�m�J*?�;�L?�WUQa�9�σ�\]vM_s�6^����m�k`Xm�>���];M���.HeڀϚ�{N�[r�z5Οa���x�Hs)m͢�&r�F� �[�I<j9/�Ayѓ7���pxi��U��l��_���_�a���0ͼ~�����&aǠ2B��=��b=�-9����_*-r�}��4r���bYf�+5�C*�X7|Lz��L:�2���"�xkPaȭ�<Q�5�F�2�v\��F�y�\`�B-�@O���	�*i�6��œ�,�w�Ը�>��f)J���ъ�a#���%���2�ጋ��q{�?k��(~��F��l3��F��S:�w�se ��ܖ���$�.��ε�k��	�`� ��`�%�<��6��1���Y.�`������U\��RNQ8���8� .��A���l�G�6$.��B7�[4�c�����Ϳ��ӻ�]�{|n&�����^�zQ��Fkݵ�|u�*�';��tc�(�y�Ձ�Ų�$����~�(p��>G\�l+��^���Y� F��w- T�i6w��d�m��4�ꫧzh��a�цI���$;�e6,2�nd3��%���8�]%.��L�@/4����3"�>D�uH_s*y)Ǩ�S�L�V��VX������B��yL��z�8�|����4R�C���<�x��z�D��j*Y����6U�਍Ed#�]��g"��'|�EXD/�ֽ��*zp=�Z8;�3�r\,Ւ}�� ЫR�V{��o~�|�w����q2{�f�nuM��1b�4\� ]�� ը9x_����
��Ke!?o?A&��]a�"�5
oR"�����>.�f���q<���h(��mDm1U�@�JٜӋ
�a8N���_�����01�TejUU�~��+��m%�읣�G9�e��UrYe_*�]�f�3xq/�e��l�YZ��O}��QM0�IٳҶ�����<#�W�������W���X]v��ꋕЂ�^U����v���}(C�&o��C�3:;��E����|O-��h�R�Q�@)������CFe83~����<Lrig�����]]�:z�S��^�(d��/��G,�چ�J��8Nr�l?I�8�Y�5c�5Yp+�_�ǔrp��mk��*�ػ��e�q!E�J�dT�����v��é��Yj��� �i���"�`�L�ꌋ�ce�%���΃w��8_6���ZHwșݲ�n�7;r�G�S��+�uq:*B�����0t��/u���2��h�_�J���	��ҧ
>� :Fi>�RʣgS39]6?�~�Ϋ:T_v���T58Q�5*�I־W���{e@(U}�YHndX%to�i^��H�XUh�휍$;��$�@�f?dq��:�2L}�ʏ/�Q�-�%�etr+��*��*�$;o?���t A%�::�$�"�����|U��s<(�Ч!<���Q���#Wֲ�l���ɮ�	�?������4�u�꺱�Vxl߅C�#�I�.9�ޕ��&��9��bG�e�I8>��Y&M��>aUu8�.���a����Ӂ���:�hD�nT|)�a��������x��8x5�Cׯ��*�^�:��ʭ|�aH��}�:�$�]�����{�}R��8 N�xU�,J
_C� /��� 7���b���؃�~*Vp�z+2�"������7o���Ʈo_p���W}Ѫ�V��lp��q�xr�����Grx�	��R�x�ϥiм�<)��G�,$T�{�#xr����,���g���Z�"��TM L��s8G��c%��Z�d��$�����9��LJnxX��C��������p�w������S����
 R�6�O�.��,2Sepb'{�)7���d��m��wO�5�<!��޴�F�x��ƀ����h���7��m醳wϧT�-�O��$�ɋ-�8eV
�0<8�.�H$�s�c$�����١��𩀋kN��v]��:�8F����_]WE�au0r��+lp���V0��8/��,9�P��'�C�uEf�c��Z&��O�@��|�Z��	��_	���������h�'���f$����׮�	�֠-�:���2Z����nYq���j�(�M��ϻO�2���6u��6P068xbr>U�R �QpX�tJ*SD4}�.���O�a6��6?=�.S^�8��vu}����h��D����-jx�!�p��Pml���έ���g�cdj"HJ^�a�)FH/2�U��.��G�u�U�Ć�R%⎅1phYvw!�tJ��{*�O�����������4of�q��:8�
+4"��u���wZ ��p��4w�j��2(��'U��j��O��4b�&���ᢉ���B���tdx��.��W����JX�fP�W�I�&��o�+�vu�����{��~�Tpf2�.c}�gU@�s�ݜs�w�H� g�^�p����T�d�iYL�K�!S|!�S��P���0���rW�nmߤ��H�St�� ��k��p�p�k'�F%JC���v��t Uw=����y�	�r���Xa:�/�����i���k��×��8�(�<U�u�o�(��e���6�������	�����\��Va��du㣻Σ����~� ۜ��G�s���/�O�U�[���`���T-1�G�P�	/�`�:��i�Gx *�R��\��;��G���:�q�������4jUQ5�6!צs�A�[�9/�ԍ�~֞;u4!�ۮ�8��I����Ta�缑��[)��Tn�����x��bvo����H�ù���}Y�V׆/)g�\�93TΖ��@�~�!�ؗ�,�QG������-G�N$�[���
�2`)�:��|�w��O�XNS?k�z9Ƥ��
�,x�4�(f�
ݰ�����a�
TRm��4���x6�׭���^�/�4Y�����%��uV���iX�j�f.5���h���g9i��F��egX^��<�0�p�^=+�]�.,�g.=X|���8?a�B!#�M8й���Z 	5�W}�����\����zڑ���CL|lC"�P٦�Lg�й&J�.��K��ƒh���$[���{�E��Ld��ᰝ5>XͶ�Y���uA��s�v�4�x�7�O.࠭���oOЁP�y���S0�U�������Q�)�^u/V�^ȕL�D@�\.T�@� 2a�e2>�IR��ӫs�I0����v���Dg�dKm>��]��`]�z3"�q8��+�u��z�~��R3���7m`h]�"�I#(�R�K̶�,�C�>�>͊O݁k
l-�^Z������||����z�k{��e�V��	��<v#�z����YEA��ɢ%^�H;{�E��S:�{��c�(~������_���?��W��T��
�7x��E>{����nި�����Ԛ2��)X��H�$!    Y-
����+~����͋Z�k�8��Z��V�W�g�����u���>s�j�.�m���7�|��9���L�*wDÜUB����I8�d4[� S�E��u�&��)�$zh0˪[ڜ�J)�&Vw�����^��&Y�'���9����hd�[��A������y�y�	�(ރ�2�e�f�	^�K�	��rK�x��Q�u�E'R1�  ���x���7���^&k6"Ʒ���� ƣ��� �6�L�v>U���]Y@O�Uf���A,&�\�-shg��%�u	f��M
�����{�0d3]��W/�eX n��GlTˎ�@�8���Fl��U��R���#t��N1�laM��6���&���X:i
Q��@��v��ѴϮtXН��zr�k	|��uN�U�_]��wk ���6@%m������ͦ~P;а/&�z�}�(��|��)��ೀ���69�>�����]8 w�W VCQ�����v�����q�7oP�~�l�p�Iz��յ9g!�V�h���Bζtl�m�Y� *�yF�a������ k�m�p&P�/ÃY�:0H��r�U'�D�l��Ԑ�r]+�dwŘ�����������P��y��Nz�Ɩ�F�'���XJA�n��0O��3õK,�䋃�Ni��6߼|N7?��֓0$���َ�%a�d��$g��ڷ��,`I�$-,g�L]��
_Iښ�����o?�}��O�翌S��W�?���jH�L2���5��vd�
|1Z�Ղ8'y���̓�x�X�Ų�$�1Th��X�t"-f����$��,���y �Kxn5�n"�<x2���};���O�>�?6E��+nZ]��Ke�pͨr2�7�;;�7�KZ��_L����3@��PR�ToɊĆ.mt7ڇ��3�S�JF�2VC*cXp�`T̨T���Q:���*g�_]�/�^֤�[���0�����mR�@f>ܻ�� �t�~�6�l)�J�OB�&��2���4�iZFF�2|�|�5,V�V�Jnm�����O߿{�u���S~U�F�v��޴�Nl1y���8�FS���8zކ3����!���D$������!�Ɓ�$̖B�:�a�9��T�������|hwMIf\R_n(|p��Y��pƠSA�;���irpp{ U�%����B�{��%&�j�e��م�*<���`��@��=N��n�k� ;��D��T_�,�����^Mo����s'�̜y#�|�/���5�	ߛ�B4׮��}I #T�Fe�������dN}S�	�"ݝ��<�r�}V�[��0����B4Y<8�֖���[���a�����|�UR�y/85�z���;�5q**;�^׮�+x�Q'W�p2z	��Q(!Z�m~�����	]����@��s�����
��Eu�#y���0��#2��lt`�G*�b^z�J��A_��G޷W0>>~��M�3�_]H�� �g�Y�V����`�M��~�H8�� ����O�(��1��9c���p�8qL��i�j�`-5jO�$��J�.�Q���w�_� �6�t���V/�O���ٻ����2��L&S�V���/�D��ʨ�3L̢	݂#�R���C�t�W��]y<ou�/� ��H�|�H�hb"���~������"('���݀���?����i�N�
��W/��SݖRm���O6�^�V�ui1j#�34Ϸ�w�P5����w,�*F���*�=�d��7��s�����N� �ٍ���6��7���Ĺ#��i�Ծ��~��LzХRM��+�� O8��i���ޟE�l<���!��hհg���
��\����1�r8
�+c)��H1�^�����m��ez~��C���7���.9%X�TL�	�c,��n$�A�}�O�'u��u�֖�'�Q�<8�`gS��i ~@�]�j$Ɗ�(m�pf`��v#E��ZF���Z��Y��Ӈ�1B�A�gJjׯ^�!s�A�!�	Q��*]ʲG߶�0��\���j��|NJp>\RiT�w�D	��jZ���d?��Dj��ş���#`1�Z�P�m�����a�| Eߛfr�꺆���Q��wa��u�>�6�ؔ�����7�xș_v��B��+�K�0CF*-�yo"@<���I�R�J�ݐ;	�A��161���?=~�t��ࣂ�����Ʀ�.��� �hU-�'�-�v�E�G��g*x��B=qà|��n)Y�Am��#de^Aߩ��U�{��t\/)w�L>||����7��o��U�g�q��:�%�L��\�|��F�LUW�wZM4蹿or����O�^!��y2�Ԛ"��~������M��5�l�Y�&u�gda����k<�?������_�6@q��U�tfu߰z1;�b�>�Fo�y��XU 2
�J��ܹ'�`t�y��ʓ�� dM�`R�Z�l��X��p|�* ����aYG�U��^����l�ަ��#��w��i�ɼ����B&����u�Z��uX��٬����ଧ͕
����Gs���O�J9�4l->n����~���Q�ie�	H�r ���S�D9ջ810jv���)9Mq��9\�zQρ���'(6\�_U*g2&��6�de�w�?V	����;���cD*'G�	R�򡰪Kfu���S�ʱ��r0fa[$.b-���Sz��ӻ�d"�H)��2��V���
d�h`q�WH�PP-����嶹���{����hI�����U���Cԑp�4�u�h�V�� ���sݓ�Vž�s,Qd�� R�v ���gQ��ٿ{���(�"гI�r*~���^���"�vo�v5�ӕ���j�a���ewf������Q� AMrZ+?S�NFt?
�V-b����!K���4D֬m�%�b+y<�iy���D���aZ�%����a�^\3\=���N=T��+=��bl1�m�/V2�_{i�ao�ˇ�X@ #P ���[q�l���QG�q-�I	�S6OHr���๱k�J�b7W�o5Z_�������kT1j�%�T�#E8/<C�Ai���*�������y�	��ZXuQc�ԏ��w" V��4�-�(�:y`@�QI�S�;���QY^��珏����7'��(��_� �g�:,�VלXZE)'F�T��8v0��/J����h\�M߼|̹M<�<�X�G	�C85:�:=n�B�ꚪC.9~����h�p*C�`�" ��릛��N�Z�˧C� t���+W/��w�|�y���� �˼�y(oS�sD�Hs��l�1����5|��v�C��=8\�%^ᙺk��2�v`��B���s+��2�G�iI�K��kWש�<d�;+U��u�� �`�5�m���*dw�=o?)M�RW�)�5nS�83���]gDf��T���
���`�"��M�gyK��˄�y��<���I)ŵ��(�K����^Y@7WU�-��^������{�w�x/��+�g'+�^QL��Kc�;.efX�
P�3Y�N]�<l���r�|��és���\p}��p�2���7�^���qa�&ki�e|v�7��ģn�vYe�Ţ쟷�d�\���~Ŋ%�X���IRv,���9Rg1s�n��J����Q���v��"�y���\�?�^��.���B�ᅬ���z�%;<j���Ȑ���#����nVh7�xG�O5XB����0+���u9ݳO�\H�>�C9���Ps�#�T���a����}����fw�o�1B�(�_��{��kW0��9��[�41��.��p~_�P.O�b���34u�rȀ�ʹ¼�)��K�$ܠ��lٓ�h@">�0F�����D������w���߿? �������V��OE�*�g�aک��U�b_ʝ������롸R��!'�S���N2��9�����K�b�q�T�*l��>�V��@�N`��wG�c��śnX]�:l�ᄠ|�6�N!������}[q�`�}5������g��(e4^    ��u�pbp��u�����H�A��)�"�4�WѲȲm�Õzz|�O��~�������øvu9��s��e�Cre��̽[�Ǖ-���7�ъ��o�Dk<�$���}^�ŕ�C�!7ix~�ת�,tVV$�`��9< ��fdUd��m-������R��L���uU'#�~��U�샄�SV�9��4~7v�do`$SRt��[�&�L�d&|%n�*[2����94����7�~����惊fҩt��zb!W�l��j#<���@
N�b�}2 ���\�����|�k�#j�����'O+������ ���;.����JUT4��c��x�Z�&�n�@�6-�\�zBQ��Tۺ$�(�!H0�%�Qim�1�j��$w����K�v[Z)�U���p����Ⱥ8��C�Y:��`�#���7vƏ�Y���������v!��9\�zB��|L(]�Ԇ�Xu�+���m�_������$/}b�PI�'��l��J(����b� � 6�d�6��bP��]��?�-��~���o^}�p����
���*�^\�p���N��L�Z"8V)KD^1mi	��ϳ�]�����&��ֈ��u:�H��T%4U[�^-��R�j�u D�Y��#�O�zӋ<��td�������i*�;J��e��ju����xs@�q�%`a���U�5n� ���z�u���O:2L�����2>�iy���7p�k���+n]H��<}Ҟ���7��EO@�)��)dw�'[W��P1?�T�:�>uGa]%S1�l�e�r��x���O\��c��))��|�/�P��x�rX*���Ĝ=	����nY��CG�b�R���_�n�O\�;����s��v�آ��[U���k�Y��M>�mo�`��8p/#�~��w�2dZ%��S��x�"_�����+�!��)�T�9���5}�����g2/����x�'��o�2_�+�*�c��Kε��r��m���eɋt��w�� �����?���<Y�{b"k�ƪ؄q
���$E8��+=l�
W3�{)�<��,�{��z"K���ª @�1��k�J�qۤ�T�������ܰ�a/���`�A�K�I�Ԥ�Z�#܈�q�Nv�B
	�j��Z�N��+n������S��w��6��F���ӄ!�CE|��J��,�d��X��|ɫ���|�y4T��N�?r�G� ��#�n�:�k�u�iV�<��g[<�+[G�9���r���g'`�������{
N���i��\�PI9v
�7_.Ax�}"6cq�rQ��+O��G��]Y��X�(����nL�-$os~��-�������v����~W��3Ջ�W׉�@��IJ�;T��5�vijwica���-��9������wR�3�X��3F��g���X_gQ�d�Z2A$�\��wSJ�0z[�����	�=��bu]�%��SFԣf�ȸ%�B�o`�wTP�R!�q�I�_z GQZt����P��L;�/.j�4~�9�IR��!��	�ޖض4!2�;:��~��s��I��e���g�����/No�[tH7n���q�ٴ~eكe`���x�w���EeS��.g[[`��\� B �WTC���S�?N��or���������,��U�k�e\�ץ��f I`�8�m�~��P	���e���O�}��<]�~�5@x�i����r�V��)�-��5$��1�P�f��gNN���O⻼ף�4���$.[<�%�1L-�
�5�6u��,~�-�'G�n=b�sJ��'�+ّ"���J�P�3��r�ڍpTs�9g�t+����l���5��hEn!�w?��{�;ܱ���7���UX��b������]���R0�Mj��6I�y EY����6#w���x�Y����q�a�<H�۞����n����U2����6��I�fi�_x�3 e�5�Os'_?�w3��.��L��W����;�%U�G(�q��FD��(}�_WG��mݗޑu:n?�*J�.vNی��J��UWGoe�4鮓�&	G��zF)drA_u�g��fDhＢ�n�9x��mtg��ct��kT\5U=0�{�	>sۼ��y��3��C$a(~tcB��G�θ��\�˶T�������0�F|҇V�{�������q�p�#(�SJW��`y�9�%*�t'���F��Nr#�������U�e�I!2%'{��c��1V����D��|g���e��D�\8t���p��G�:�vE���y7�K&L�'�._]pE �c�3�)A�D��L8� JWJ�~6
��'��F��|��aS?C��ގ.�B�����>!TP��9�H�`�D(���Y��W��ǯ��;	DE�S�1�OX=�g5�2���~A�nFU�Y��v3�7����;���#����&9'ӳ	��]e�){6�7'ZB@ik��.��PU��ĺ)Z���c<Ȉ�Į{�6c�dC�!_�K�Ϊ]��Ɓ�����rK��fl�)T���]I{S�����q�	|�M�$�x� �kHkWG@�I^M\��;�,L&R�O-p��6بm�=�J�����
�������Ͳ�� s�p��\��f2Q���]���|�gE 2�,��*��Ͳ{\�jO��9�`�ڄc��ă�"
%)��ߖ�V�S���$`D!�����A6��7U��W�?�^���������۽#� ��ʥ���X�V���}���V�/�.�3���N��M�l�Ewy���n
F�zU�9�`�p�!�/6:�\02��4�>�)jAA���䬃;�����ë?�ߗ_�^^E�Cr��W׭O�j�W��зF�۴s�׆P��3]��o�M�sZ��'Ϋ�b]E����&"�Zs-ʚz�����bj�,'�~�K$���7��rL4ؓ+���pv����]<#�X=�����q���L�(�ط��iz���T*�&�j�>s|�Y�{���.�Br�J�ps'�
��R1)��by쬙 f��0M$�Ak�c-�nՁ
��\{g]�iRÿ|uub���X1x \�7jTY��Tk��ᗫn-�OZ1�%c��$�bn��w<t��@8���n^�JrB�<KD���FC��rr�����\���7?��U��>���յ��L]H��8��Z�xp	(a�������{5�6>>�8�@~�h�K���y01Xݐ�d��b��ϛ���m�$�K��9Ydi��O��̵Q�z%^�����uz|OʝV�W����!���zvM�D�j��ä�mE`��C��8���1q`=���z F���f��8/Y3E����:r�+�CJ�l���89�s��c�rvx��q����\�x5��"`!��Jzx���-��:v3��s����vdN��0�x���QM�B2�ࣈ:Har-�t��/���]u�4����C�����M�p��N����?�����w�����/\]��na��l#�c�+D�	']4�7�{sc�����e�I����%�]goa͢8��Y�q5�N�g�ة��h�q�v��{�m����]��w��������}��3jz�;����&N�+f"�璵��m;#~��/���aR:������Q=8�A�`�V��g�c�e�-�!֪d��f0{�o$�U
'焯.�#h={TO�h> �9��V��kN��V\;,�m��y۰˻�
��?���`,1)���P��5�	R�I1����ws�f��C蕍P���BJ��+g�phF��PǷ������������Yv�y���OX=���ɂ�PW=px����H�KgZ�ܦ��&G���Z�a�ΠJ�0��^�ƒ�&���N��J�-x-���3�7+�bj��s;9��x���C����9�;�Y�:�����H������OQzL�s�H"r�g,a �?�v���&��R���Z��	�=(9q��_.��md�Ǌ���71��ΚQ,~g�3��/���Z�!BR���+V��{&��)�q�ԑ<�w�I��Ӎ>��X1>g����TArS���    O*�a�ᵔD�\D!���:�Ȏ�h�$
�v��O3���Y�cԾĖ�ku���{�-��5�`I��ȉӆ#G�6�O�ګ��?�����3y;���[�9Qe�i�?fT]b���}�Jz�C��o�>����Y�>^������ދo�O�O;W�H:L.��k�C�sd���*R���Z��4���!Dw����R8n?	�T1*�$$BEayò��m���ݺv�#L���Q�ǚ49k��L����[�1����7?��s{��c�Ǜ3�����_i���a�u��'��%{y(渣rT�V�`�+�w�S"]��r�����������+;dO�Us �"�3�gQ&�\-�z��u7�,>��%����q�=&�͉-Y�Woǫ���q点�h���%�bu}Pٙ�-痒�������ܴU�V��n��!�z����1��Lni1~�,�z��"���B6����F�j6ߨ�I#���J���׳뫉����'pd+=���(b�"� �Vʭ�?��)��������{gu�~rV�bIYT�t+ac�R��6z�TF�R�>��D��LHd�(�t�5��7������c~|��7�c�w�Da�t��E��jdX�Yuo���d������ƽ�zO�i�~ص�U+���9�M�cq`���7�\��G
vl��W�lAF

q�
��k �.��K�:��4%��tu}ռ#�eu� ��L��;��7��R_7u���"�w�Ի���+����E	�<���H,<{�����|U���J�=�fx��j��3W������W߾�?���]3��×��U�+V�����d�5�����X<���$o�m�Aͼ���d��uiT��͜��s��k�Y�.!�[*�R�͔5ܫ@�  I�冨�O��3�u�b�9#�$g'%�י&�bt:�$->U�>dJ������]@�m�ٙa]v�U�:>%bT�`ΦD��K �P.���PW�k�8�\=��:�2�vR�1,��4T?�JnkgB{��Ύ���5ckO:#�r%�4�t��KWl�m��t�7.���q��i��}�g�I+�����K�X�-����
11>�&�?�b1f[*͎P��>T�^sy�m%O���c�t����|o)�ȕ�C�@QtU�|mӴ��c���m�v���ώPhoа�8(��iWV�[dzv[5������= ��?_�Xd�������������.���"�WZ}eۥ%l�[V5��WJ���HoNW����fŒ�/��L�ձ�A��ɄҦ`��u*\�����)v�$�[Ϙ	�(�(�U�8�.Ef�*F�gL8F��X�$��m�"�r���2�LGR�b��x��M~���5B9�7i�Ⅴ���'\��>4&?Lw����d�1��m>�+{����wky�y��y�	$�/��r���o9"����J�e ��;4Z
[��KP����BC��V�k�������O>3,t��Fz�����vu�ܕ#�AȎ���������]m�̛���l��u�y�d�
���Qs�5����j�_ϲ�%�[�cׅ��B�ǥނ�8\��b����������eo����v����0����!q~Ѝ��	�)��}OF��b�����`�BTBEKպA
���\��q�m��5rC��3X%J- '�T�b���Λ|���M��������H�e�'�3qD�VK�_��.��$�K�l[:Iיּ������IV�	,�:LэFՅN��"�})���/ر�KG�q��5ǿ����w�]������~u�ں�0�	�d���_5|ֶ ���)��ܐ�i�>�y�ò��P�r�R�/�j��d$��u<[�P �
�˓��R=7Evq�n�V8������߈?�9qT�(��.^\�r�X#q.���w�qp�b��:C�N���j����u�~�t�E��~��\�Ւ=���Fu�7�V1s�Tx�gbD��ጮ�	Q�n�� ���|�X]W�F����@}�M�b%��Tm[�d|-o|X;�������W�{��G��x���L5w6�ą��}����$&�(rפ�T�C`��;�h���}a��?߾�����w��s���X]#u��αUSn�g���x��"���+���k�9x�}FD]ցo���:�p��^5 S����Jbc���ď�b�#���^2��S�d@����߿�㩢u ��t�J#0�Z���vu��s�l�F8�d+�����8�q�3<A^�ە��vO�x�~"�+[��h�D����[�+��7��]2�����Eɪ~�<,����#��W���Z�<;o�"�$�w��IL��s��"�W���Z
� �ɭ05ۢ��l���'=��R��s@V2��Elڈ*M'oK��x������� 컀YT ���p3�5����'5������6��������?�`�Ʉ�'��][� �TW����<؜OImH_D������ �`���.
6/�j�]�	��3J�7cR�ӛ��,;�����	1d�ܹ��fẆ[��p���KWבr%�N�[+ #.Z��7ʝV\�3w/��wo�P.�O�պ����=�Opf	����
��j[�~�A5���P�������E4^Fr��3���
��`��D�aՄð��n�	��W���&��R%�FF�� �������~�ݨ�b/'�l=S�ȝ�/B&MFF��c�ѐ�,�a�F�K o5N�2_��\N ##'����������y���J.]]�g:��4���j�?{���gȥl�g����*)�;O�g�n������+!������$�9�3�l��Y�O	�L��Cʭ���{���?�>��oi�"�;������'h� �^tO�LI�#��%�ҷ4]�K�s��a�I�_��BV"vC��D������$;���8\�.Qj�P�J*	g�����tU��c�� F�iC_�&o���ǫc�[�&$P�����Y�;�Ys���Gl4�{]7l�Nݰ{��=�<A#��MTf�l$Ÿ	���dH���0�mHŷ�عMJ A=����q�ߚ������w��oޞ���w���F����5>��";|-#S�E'S�j�ˆ�w;�������:����ɩ�2XuP��0��_�y��|��bAS�l���z��f�B�@`�k��s�-�C~�����q�3�^)��ƣ�t'z5����p�Ͱ39GDߊ�,Z�T���?��	��g?����ǜf��w����|�]��4�
y-�RNhP]e)��\C���j
�k��UT����ٶ�ɔ|}�X�>>�������LI �	�	yB�o𐬶[*�ڍ���7��+��>��8�c]H�)����hoA�g��{�k�z�z������wϐr�u�t(��\,#bKvDU)��O_�.&�U�t�[&�}� ��~}3P�nZ�tu�";�~�M�����K1��g�F�\Y�ҍ�W���O�[��HJ��v�BeyXz�����^s[Z�}MQ��V��f-�Ԡy�K_�1!5����J�Vt�:٥�'�����qęs9Uפ�1}x�6����ve��v���&خq�tk����^#�2�ڂIy�n%���,0	���=zt�r[G˰�O���*:T�T���_��&PZ��>*:^�z�pkR%�hNnYp�{�ņŎ�ϊ4�;���8Q�;KZS�WF��\j��5p�B��E�ݤ@ �dȣ�7����)����Mw���s�S]����b�i���a=�dlo�
��n�4�[u;y��i���d6��%7|�!�H��]���(ճ˚4J!�7��j&yv�Ū�j�l�9�	�I�����?�U�"Y@'��W��X����|RɪR��zȊx�4�a�oܛ�3�r�~�`�� ܐ1��-\��;{�K�ĥ4㒣�P��y�J���Y户7J�u��a��&ٹK���e�+VO�~�ģvg%��s�97��c�ז�&��toZD����������rP����v�SG14'��\��2�ƮD
�ҕ�2�"��F�9`j����    ���;�����͢\���d�GR�l/U�3̐9U��l�۶����m����g��g���Iz���gR+"q��p?(�:���[L�3�	�#��3��M��gU���=�Ϊ�f�jW���aqT�ҳ��^��r��Z(g(�-^��T'?o�e�~�<0��R��\MQ��L�	�#�E������X�=��b�����P%Vo7F�d�kj����r;�r���2�b|�-��W�[��\}#�\lnW�~z�9��q��g���3�dY���1,l�˩/SE����RK+ᙔ���U\�"�Z��_τ�_�ItL^����k�.�s�e娺�Ȕ8�'a�i�0���P�u�ӗ�'L����!�M�Ҁz�0"���� \���¼}�	���
ˢl�3�2��q��r��vINC��ny����S��RFm�x�pcF��q��%s�_x�D�l�g����y���Z�IR�T��#0Hj�� �j?��ikj-�f��>��X]K��� vW��K 4\W�m cl&�<9�nj	w(_��OB^+���w]%�aK��a�:��#Fo��xKS��^@8o�p���܆�O"��O�ȯ�B�*�;㋮[=����Z�
Ḋy���L���D����%zzڽ,Ҳ�$�ۭRfػjȵ��Q�O��g�9�\���.��[�%J���U1�B��e)׈�?� w�^�D��G�tu]q&�a�q�Fٮu�-��0��LWj�R�|���'f0&Շto�٢����Ԡl�2x3뱡nPX�B����M�$5�ѱ�:_5�?�>��oj+��2,�?�`��յ���p��`jkN�=z�ꤪ��*ʟ�ܖ�'튆t��Ѣ�nmfu$����,�O���h�7��8�x�uqc8mLn����l��WJNl+V��q��:���,c�T��K�����i�][��!�g������Q9$���$qI�/;�U&�X�{��s�,��e����h�l11]B:C�vN��|^㊤јL?\����q֤��Y��MԪ�S]+;6#b�Ew�و"������!F�����%� q���j�_0H�%kr^�r��,���3�Um�v�����
���^�Mx�._=�)U\�b��p^ �o�8pl0�#�F��O��A�ր+\,K�k D� ̔���%^�l��E�U5_YD�Z�����[�~�����(.9Cx^��/�ix|�O�4T�EoS��'�+�Oz���d6�#s�$C�TjTx�F����K[�O:�s�EtL������N�f�]����W)G�}�A��7��ԁqG�QI�xgl��a���9�����`h%5%�b�)j/�e3<P�pG]�l�g�qp��Q���_K����غ�zjJ{�ܔ�K��N�/]<)�(��h�=�.+9d�8A�줍��+��,`����k���p��w�"���dj��㯸���B7�Ӥ��EH-���)��On+�ٻF�:�H�;�W���kW��խ�v��[����s�	�J�'��T�y)�{�8� �ި��-�	�p&r�,��q��$c���֋�c��o������]RfVºt���!��M�Gc�D�K!�)�+����?k���L;T��*�~��V�EࡄD��S@O�Q�"U��B*��JS�n�۬Q��a3�t�H�z�eR�vu![��D������,aH��h�lh`'ovv���e_�w�Dʝ/_�#}�w"�� .r�C��q]�"BT\�"��F5�;���r]����w���L��:�㔐��C��>�����N������D� ��c�d��	:+�<�rֹ���p0ډ���'t�94ꗑ���i%�vyxi��k��ܒ�*�N��\a*�#�����&G������r6�l4{�Q��\��VO�#$p���-���w8r��SIa�U��+�ޝ�<n?Ik�FN�1O��0`�b:5:�;������;����	I���`W�5=��=����|��U�KW��w�C�W
ؘ#�\�ƻZ��{Z��r]4����-��L�>�(J�Z�b�H?,$*?j������6n��)�Z]u=m/סF���yx�L�Cd!����V�@�����lb.Nr2!��\��/�61�2�ֻe������U��0xҮ�SF���I���4���@
�1q�(d�h8�:#H5�U���?LN�Pք�g����uX��8��B��w�])F���Q2Pj��c��5>l?���i6	&�X �M�{��nG����x��k�h�F\=�|`礥~%���۟�������:�[攚�.[\g�;�a	��mNy\�#b��n��`Sn��g�w� ��VZ��Ѥ0pO&1Қg#(�� a��J����4�����ל��^���^2�&Ô������9�L�p�]J�����-x9�v��%��_�n���$�CB��E'[��]ʂ#j�!�4	������'��U�L��*�԰mXUz�~�1��ӿ�e0�2X,̉�Z$����߈�����yEـ/3��n��3��[��`Ƣ�����>�ԓ-[��9 ���8���j�Į'� �o�pZG��9tq�R9�e�H	ྔ�\�#�nK`�W��m��[��S��KW�	�$^72�$/3��oI<�Z�~��k��:Ӹ�����a0���#��%�B����k^.}R��w`�h9��%NX�*Zo���$���?�����t��RV�@�Bׅ��H�*x�Q9�	�J.a��jul�J{y��^l�}Ƹ�rV�T�$Tn(� ��c��(x�u��%.���?H8U�A%��)�]S_^r�:i�ۺv�_���<��֗s�0A	(ɡ�WF8��{�BHGt�Ul.�μ"��� ��k�T)�9�s��%�h�4�]��n����;�}J�� R�%>A�2�:��ݸּ'R�l?m�#Q����µI[��"���T[�Q��ͼ��$>�$*�l����N�;�n��nQ����y6����
�Y\Ϙ��Rg�qI����V`(D:&����2��.�8�aǝg}7�v��2��1���ǋe)˜+����}#� ��	���8�E�.N��L�?�͝B�pnd���	��i?u¼WM�=f��l�t�b)�M�.;�Խ�!h��0�׭ �����w>tg�:7P�V���)Mj�VO,����,CkR��=��H:E��%[��?�1&�xc;�S�>n?	���jd/�҇�%c/UE��G�S�m�N;J*��8�5�#�Ʃ@	'x�sC{��G~�S|�|���//Y;��S#4�j���Fvꐐ�=����hr�߶��������;V:pX�����I$i���lpt}qi����aKar١�Q�a0]-��6��c<�5�oZ:�]]�Pюaj�;�KM�%�gA$����&C6�秝��.�O�U�Ì�5���T� ��RG��c����v�1��� ��^��dN��MO��<�{;��D��	?D��[sr8��zB��YK�}f��OClU�9D6}}�q���9�Ο�H��8>�䞱��R߲�ALb&�F�69�=��XjC����� �FQHO���v�[���?̅�%�_�&�${�fy��:���ej�1s�Te��tijwi�K�K���c��r�}���k�Y��Q�Q3�g�u�몟��pF�]���l;md#�x���1+�����������Z���C�ǁ%`}���������/�H?mu���#��6g�â���f��Pr����x��G������<�4O�I bTdٓ��	�R��A�ݕ�3 V�޼ �9G�gm،�u����1A�tx��O�� Qֹu�OX=�nix�ٳ���I�D�e���i�]����v�8ǌ�g���ʵ�0Y�Q���+��4�V{�������T��/�:'�h�q{�d	�y�������$�/
*ʤ`6T�׮�s�v"(�>�:��]���«���(˦o��v����Ɠ$�V�=�fN K    �+ֈf(�Ҵtv!�I����bG��^r9����o����|��_^��w���_v u4��K�� E����:PLc*��ZT�TLL�+��g��-;O<^W����P�h�xaJ����q�kxS;<<"3���A͠uB�AE�C�}\�����w���c��c���=8�ӛ�浫�Э��bG`�Ϡ��I������Sgg��-/�%[v��l���WUHY��c[*"8���H1,���>t��p��pM8_"����f�j������xvt�(b3Iq\��n8^@�J��)�	0Ww���V�#�*S�Y収�OZNeg[e�/ٛ5;�J�A7������6{>�'Y�Ʒ!�N"n�A��7t�?��ۇ�x��pw�gl_������h^�&-�u-z�i͞ˀ�mx�O�?Z��5��8�])�B�*���7-�t�Fu�*	����F��ëתk�u���po[r支�VO"�苵64RU�Z�A�F�b�/۳R���4=>��˲�������g+�=|@Ԯ
�S �m�S	x�(*���ѳ!8�.�Z9Y��s�w�?L�۞CL�un���5�Qgi��6bv��+�.�YR�n�3�b��Np������'��Vp��Q�nz)Jg*;v���%��D�)
CR*kd'�G��4�����L'<�>�	]f��KWO�rH�݃��@�6�T��^��m��e��m�֮Ҳ�dV�\7�Di$Q��
�^�Za �y��dj�'z�@���a�@�z$&X��O�/KUs����$�!�r��j��n\��Z���L9k�auP�ծ�	C�M��`�H-~��y���0���PI��c!��xU`�X��I��� _�ƙ
M"��Of�б�Ce��9��Y�>��nۭ}���"* &�u)l+-��V1㽫�w�XD��,�G	���O8��%�4e���k0��}�?{u�c���C{�	�N�"p�
���E�p�������}���у9Ŕ��Ӹ|u�
k����|�Xu/S��\�Ç�k�8��/�� �R�_�A�HƎ/�u\la}x碐){S�aUu�W���rO���_^���������7o���swdv܊�^��E���Ӯ���s�آ�v.����4�o�6��nw���ZĕT�P��E�(�Ц8��6/�}�����;Ù�FN�H}.s
�1jg�I�h:*�K�R8W?�ju��d�֚�
�oV�R%޷�~��W2�v�C�H/��� %�q9!F�m�7�=���� �D$N��x��*������1͜�	�ئ痖��x�e��.R���/[i�#d��>铞��[�ҕ�z�g�V�p��}�$:��U���i��y���g�6��E*������I�9�N3��1�6f|�U�C�Fth��1�h��xJ�[?<濿�c�!�:0ž��d�4�\7��'�9'+-��	�Y�ƭ�cgcG�rC���[����$���2����jt|��c�r�n8 ���`:����P�1LB� iH�>��}��?�"���
VS��KW�)ً�n���A��d���(r��8X>�<��ΓT�� ���,�IW�D��9M�&o�����5�#)&��R0����(+`�m/�s#��`�A��)�4�)��'���J=?�'J������%ō!�[��<��t�j?�%F�hK�'�z�Y�I�L �>,����~���}Ǳ������*_>��J'��W/���GT<��S�=��w�Y�I*�� 8��:�����3�ǝ'��B�rR����v���t�D���E
�Br�GNqlD��x�C�[�ΐ�����@�C���o?N��a�r�	}��k�� δ���Xqe���`l������_���l?ӽq��S�Ae+�PEH�*�y6�-]�+٤6BJ�͝��4�n��N��?��8����/�m��4?�KW��`�<�c[u���d�R�Z�qfN�G��^��'�KUa0�k#��p��4\=�\7K�/>q�0��+��l�*dN���|�)D���셚WJN�ɠ��� I)�Ɗs2�x?�Q�g{�)ն��"�s	�-�l�������75��0��1 fԴ��VL'����<G��IZ��������W��9�w�.��'dW��A�4EZ_9�Vb�ڭ�&_�z�
�N޲��;e���'T�Nyؾ!�/*�
�⊎�)�KK�Û\J�8:�d:���"��%��/<��N�?�)�͉�������֤�l9wҪjl��jZ=#�c�׍]��������K)ikĕ�d�8P��j�α�����y�A�S���F�a�1�6�݅u�i�����/.ϧ�n�#��S�L&fOۍ�N�)���f�6'�N��?����)&Y aٺ��)��%['��A���Ǳ���p$���A�Lx2�J����ҙ+����c��cP�R��x𼳲䥫�ć-Hy�� �~��$�e;��Y�.��Ѣ�q�I�o`(�.�Ḩ����
A�rZ��UMp�,ZZ���±�c�E"۶�9A3����5xҹA��V��	����D�f׊2��,��}-��a�Z'Do]��V>,�^�R��O>����Spi�j�'�Ý+���ɟ�
�bu��RmH_Umh
�d_��>�O��0� �]%�U����,emq�'z0m�M�)8���T?� 7D��gaJ��2\�R	��[�4�*�J��ë?�ߗ��
wF�N&�._]��dHbTX��a9t����1oL����=�>pv���5��I��EF�%�P2�x�?ǫ�,�;p6,�PM6�&z���
��iJ_jo�2�9�ͤ���u��r�&�z�J�X��#��N5�������|�}Ҵ��ZŰ�,Pr<E����T�>rY:�*i���(��G�DK�fr�.{K����M������`�UF�Z]'sc6	!oi�ݺ�^ء*|���ߴ�<휍c��/�4$p���,�W� �&�o����e�w	�W�Z,�X����=�+R����#��7N��.]]g0���/ �H�%]L{*��"HsZ9��9��G���W�d5B���R:eP�-��
�oÒ���a�"'��9
�Ry�t��C���5�'ϔS�P���@���s�.P����嫧�n5gs.�Z���d	�$��F�އ����$�w���Rn�8!�&��biQ4��ogNN-a���ltIIN>{ZS�9&`�e1Z��m�㩐e)5�忆�������0��h��ᜭi����|�'̉�n@ݪf�0Ǉ�'YCV�S��	�,Q�\�(BE�2`2�[�`C�j��BiⓃ:�#r0���������?�ݻ\�av}.]=I���#�����J��7��.�tlH*k���|�y�>�
g�!̤�}�0�fD5�Û-�a!�,�_٥�Q10����P���ש�g"���z}���xI�]d�ޟ^!����;M��t����ݓ�o�Ώ".Z�m���Z-#ȮN.6>?�����3�ۤ��gMR�b	E @QL�@\9�H%�-�}X�IMN�sޗ���æh��"衕�@�Rmǻ~�;}�n��$c�t���Փ�q-T��9/��l��d�r�M$9�|3�󏕻>l?Ik$�'6�O��(W��@�\zT��x��pkV�J�l��0pU��0��۰�ܸ�թ^��<'�^��O[]W��4Z�9A_��Р���lLvySQF8�r�D��X^�a��Q��A{��zR+�I� ��8�m8��8FR����Ȩ�K�1oǈ�{/��?�?M���O��sM�W��=�41�bQ@�sm�Y_+>�m�m�BtᶙC��ks�~F�=�d2#�d8+Fψ�r(���xL�[�E��v�(��n�P�����(�c�롿��Gd�j�:u����)d�	W�(%,_�m�S���q�kg����"o��H����q��
�;OjzXz�+��d�H��G��0�������Lܜ��_����ݏ����=���8��|]~�eǓ�;�"9e��l�Dg$����    zF��j��8	�tڪ��h��(�.`�|�~�_����*��/r�N������]s)�劕�>h��)�d�0���B��5��ǜV�У}���:�TF�Qkۅ}��:{%k/I!2*�R�o�{0�U��O8�I���s
s��w�y2���ƿUSc�VV�F-��� �K�(��3��-#�Ğ_Ռ�ZWN��S���������p�nq��7�z��C�Ul���\'kC��6�#H~�����$�C�o� ������d�:v7p>?�9���(�	FDk�Vv�y��4l�%�AJxZ;�t��o _��:�~ԀG�8�k1|�&�U�7����o��3��e(��b��>pB�| $���!�tG�L�`�U1�b#�4'��`��}1��0�o]������5r�n<l������/�6��2<�� {����36J3�Nq�A��w����������p�babywD$[
P?��l�������}�~�=;��kW��r3=6���#�Z�55\��]�*�}�S:n?�~��a4���e�0n9'/|G ��hn��|eٶ�G�lr�m������7��������P�7��Sb����8	�>a�J�N�\]��-��6���^��z=�"q��W�^���sΫ����i�[���8�.ެk_5�n�qI��s��	'5%��TvZh N���E�+'Spj��������z6`V�a�TLЌ
̪��y{ؐ[ϑ�0k��erKi`�J�X;��:#F,=�8r>R�*�`���@6ƣ�N�j�͡K��s��Յ��q�;��V��E��w<!�;��'��\Pn��&�m(q�mʅ(��� �I��#����;OFȻtJY�R�ebM��D&.6���\,S%)xW���G./ z��݀k��~����ǟ^O�^�DYmO�����rĒ!�����im�v�G�aGɧ�^�@��K�v��5TI� �'�Qj]��E�2����劀��٪Rݏ��fU�i�om���D[{%.��Lr]���p����u�X*B�1��\	�4[E0{��gT�;<^�����mX�#��8��Ú��N���U�*l���D��1|MB�5N.���ߚ���-B������������#v�K�7,�׮�htx�d�>�:�6|sڻ"�q��iC���:�\�yǝg��-t��AR�X`)I�ā�Z��jm@&T� <A��]j¤�t�^��>���]�?������qB��|���d6&���u{/ a.&x�f2����(���=��W��U�A�q�	�k7YuW��D1^�ߩ�����J��p"8�)>���)��� !��jKC���]|u�Igy͏T��r���K����P�����L�T�]��m?R�8N�I�w���J��	v�u�c�"DU0�8ߕ�K �I�Kf=���C)F�J�YcG�۸sQ���_���凝�&�dT~�
�pu9	h���s������Ɩ'
���l��D��'��WS��������g�t�B�#X+"Yykʠ�|?�,Z_#*{��z=�:	}���a��}�����O��N�8�2��kVn��SFe��&������'5K	�IWw��$;�h���a3��VQ�Q��p��\I)�߃k���\���7�����]/S���\�z�N�}B$f��3�]�8� �=�#.n����0�_.��l?#I����qNlm���>�Jl���w�[M���Q�4��f��h-��\&h<�7�����W������^}��͛����L"^X�Y����u�~�#.�hD"#le�6*%c��ܴ�9!�.���'�YI9İ:���ƀ.kf�}?��5ڱ�N�<wy�����Ԥ)�ܹ��f۟}�T�y��+V׵/|����KQŀ�Tu��6��l��7�T���$�;�-����b�E�)(HJ��Mq�0�n�G9��J�J�J�*sI��g�_g��g�_�N�Z�.q-�_��*){^�h��'��:ԵV�� M�dtL,�oM����Uނ�k4�a��4�IT�r��g�B�BY�`T,%��iXɖk�oN�Q�;�T����2(@�g��&?����������͛�����O�����+)Ԁ�.�[�:�OXݴ����M��)1�����bN�1c�(�|�{���Ӛ��a���3X��c�;�9 8��d�#��}֏��U��k/(݄��
��uwt<L���/��������a����}KΗ	:�|u}��!�Q
���֟rw=G�q%7���~���e`O;Op��T\�&�K��9�!�,2Q���3v�U��n%�o����&q��6�.�����������ß���{r��W*����e�bq]u�љ�c��VR�m���(}pr�L��VU�墩y��a��eT�����2D�^������H�T`b����@K�E.QB�3'6�5�+�?.Y�ݑ1o���]�z2��KA�i���hʘ� �,�|8K֘��w��7����� K � &P[��M�*K�~��X��` �$�}LZde�LpW���ʶ�g�g���ß�g� z�9s��Z]��Mf�� �h54'��@���''�&oe4ܵ���j�b7����u`P��A 2���<�*�۲d�d���3r��VF��| �V]}�nB���<,�����M��'d����z �V9�:e����vR���������SW�ٱ���'7���#g�=�]-"琨��_�b����� S��]i�Ȝ� .[�_����Ϗ��J�;$g��U�kym��#Jv�Z4�������k3�ַ�ʞ��S�x�~�8
��N@���=VضQ��5��S�ǛeL�6�Q�v� b�x;]�p�X�ׇ����`���>zd��i6V���H��Ӧ;�tt�l���#cF�D�kk��7[��9JY�����i5��>�����O�a:�1znD!s�܉�\fg9��$r�"�$VE$�)�	ʁ0͞�'=U�;	�z���pk�O���u�l�K�-���J%[�-D�&��s�����3�>��==�cy�I�E�o��G`{f�5�"��� �l4?R
��-'�4�H�Ԉ���G�sd* |�?Ҧ��"�������
f2j�2c5��r��C���O}�Zه�'���#�HEXN�e���^�H1�.�*[Sj����8ph��|2��YW���������<%���^&5�{��ާ�U�ٯ����Y�ʅ��(x��W �����hu����D��	>�\��.;��~	��.4`'�CZ�{��Qu)>#D��ƒ�&�+��.��rm�D�E;��a��mZ�EM2����\��n� AP5)�fE����Fl/�*�Eu�p��g.���&(F�fX8��".	��uh�>�E	��s�je)e��fh�KBL��D��Μ���fIR��L }Z�u�'���eY���U��Lɔ)v!m�ܻ>��Sx�?{����0;,{�;O&��iUDSZ��C�)'��*�!.y�`���E(�	��� �0 ����(��n��+�̇0��s���Y����u���]lO֙���1�0�m҅�9>ke���D�I�8�U3� �@��=K��>��i2����`E�iXrŚ��B�l˙���w��[�ˏ���`���xʥ�'%������8�g�4�ڔn�3"o=c�W�\����e�̡�6G�()J��l������+-)V$�bU�T�U�̵��å>^`��_�"Ib�約r���rO�H��!��5F �:r�� ��&����]��9,����`��0�R����x�8�kj#H�tP(�&���Պ��y����f��հC��U��|��11$�!P;�!�K����^! ٌIhc`�nc/H��~�*�-���;Hu�2餻�1H�~[؜�I`�����,�W!ɮ��"�|X�~@�y��G*��G����'3bq��xInp�V���H��Q�m�7r��;����'wˇ�y    Mr�T����}��и`˄l����5t$z���␢�D��KлY���:d�C�Ҟ;��V�Y�\S��x��g�)51�����ϑ�/�����$ѫZ���P��JJ�Z�����1����|�8H�E0��j�$��w��q��A���D��E�9�O2P����p��ac�
_��@�XKx5D�cC&c�a��._��Γ��1n�bpb1ְE�	W�`��=N��k"�c&ȗD갣
������nEe���y�fr����2B,IB�l����oj@̶_I���寝�ʇ�'�S�I%�pVL P Q:Q��Iw?b^曃������mD � ܘa�V��-�8�Gz8:��s1I7�M����IGvdXK�Y�ǋ���8SҸo-u�W���wמw���6[Bfw�AP���l��q
�.�3P��=D�� CD�]�A��m�D#�ٖL����ۇ������R&�t:��	�����cr#K6{; �l���ݜwpn�K޲�여��5�H2�3���1�nM�G�ػ~žIz�V�/x�\pr��G�d2k��L/��3�r�Ω�,LfUfU��8ڥA�tGey��q�sTT�=�>�%U]�^��jV*� 8����jl^f����<�:��Z���x���@�t,g�V%GlU�~<�� �[�����߶_I�-L������Jd@���
Pa� )6�V`��v�Hȩ�MK Ca�F]p��e2���r�)��TO�l���z�C��)7���=	4�,�o�M�?oc��2s�����+Eac�U@��jv�S��kX�h�
p1��l����3VC~Sc+��!@�W�����w�>_��tq�`�f2�5�d���T�<@}ܧ(�L�>_�����\��Ȥ�w����g��G�Xm�F��{�PAC IAŘ(7�<<��R�yF=ptmI�����j���Z��{IN)��y)�����*6�،�K�?h ɦX�G������D�������>ŊkԤ4+.&B��X���X��o��3%�!��#1�����Ii$=&���'����t���y���h
������D�
��rp]y�ѕ�$��u���ְ��xM[��r���^O*�ѣ���3j�x*f]/g���H	�-0�(�-ˆmU�Yp���ԥ5^T�> B�q������4��3���N5�E%�|����\Z8��Z�-3v^����te�b���E2W��]�Z��9ٱ��.38N6�[�-*�cU+ϟą+=y�iYb���'\�U�����
 KG����>�:�,�z�y���ߓ��>�Wz��s��J�s:�H1o,{A���I5+cJtu^w��Ws ��I=��]c�!wM�N"��׋��q����Յ�ZO6���7)-��v@_Vˣ�[��[od�ֳ巐�LV�i�kԜ��&��<��l�n!F;gvG6"�`���޽uy�k��?"b�'�H�ƭ(�_�:���H�|�1�r�́2׽[�<&��_$��o�҂E���) W5Ǔ���,��\B��M�.�{���Be�KK�����l���������I�s���C#��G����#HF��[������"C0�\n��������q䦝W`
ܻ�į��X�JRe��p
X�c�{�uUM��V,��m��<L�k�����,������ݟ��u2�N�ڳ���%���'�.f�J��GK��Km�*�K����G�R�6,r��ç]U�8l����a�����2�
$���;�ԕ���^��pK��@d��>���|W��V��W1SW]�:�����c4�C�xCc�%e�R�ʨx��u�jKRx����2�#b��{i��QI��||E��A��#�yk�������"4��"�P#{��՝�A��r/�Ӵ
D�7�P�n&��b�ǰ��Rښ�LpN/Ժ��;�\�Մ�X�F��M�X( �U���l&+�|Hh��8�rb�#���k8G��������o�O^��"��!c	.�#(q�ꢷ'�W�L�Yr������E�%џ��6�q�s�an�y%)ˊ��|CJ��Y��M����[2NլR�w�9E���ęc���Z"�Unp��쩽<�|��K�[&c3�
����{ik��`�ࢱ)�Rl̈�l^m��m�8�w^�U�dFt�����C�J�Ȟ�"�t�mJw�f�N��9]ͦw�d��WkϚ�͇�|��6m����ָpu>�� ����V�������:���U�׍�}>[�w^��W[��pQXi�HH�I�����ٱ:b��?��`�������bRիR��a��i�T���G�׮.�;�-�����-%���b\�J��v�ڨ�O;������יZ9��9��%��P���	�'T��]o�!$��,L~MSϞ���G
i����.����瓤��5��6+3엯.x��s-tXR����m>���J��Rs"�/rE3m�bI�I �`I斊�f���KY��ӄ;�7�/�T��[�O���e�j���_���O[���c�R�]!��Ώ!�/vl����b
��Kd�@�b���峙n��
�Ǐ�F~FU�rE�S]91���&ӵ-�M��6	K�Ğ�o������
��G|=�xx|���!?��2`H��U��KW�ug]��*[�)�hoLw%"J.�n�.��6�6f�K��x@��).������5�:"Vw��1��?*d�x�8��%,��)�v>�����E|��q�dl�TB��B�}��1��,MO�#�	��������Zv�H�ny��� �6�[5��	�U<�R�m����=�2=����L��o��עm�a��ꚋ������v���*W:W/_�#���]���r(�)^b�p���|�0��w^1�j�4U��<�ɉQ�)�Q�V��Z��S�2{�k:Y�|!Hѥ��%�t>+�@����Y�2Հ�S!y�kW��Z%���d�cm)����f�.rY?6�����F���+w�~�h����fw�h� �u��N���av�-ARd|9�7�+0n)���v�����ty�]�ɋ�+Vgv4��sa��SF��J�C�֖�A'�v��[��Ϋ�]�!Cj#�w�"F�(([O2�1]s�5	��0�so�����>�>��^��H>���� [N��L5X�W.h._�w'��{1�;( @~�]t��SG�Os��v�oCWf�y���LRR y�t��6�#i�0������%zi��J���)�$�$S=�����.�?��)2+S:
f׮.��bs0�:ˑjN�( ���h���ܪ3O;�ܴyD)ry���V�y��2.�b�蓧,EٔK#1�����P#gE3�)�����c���y�\��/�ݿ�Y��������l+�~ɝ��Ov��Z��켗�u�ᣤ,�s��$�"<$�Knpr�|�����!6�q��W�rJ�z���8�������7N��d5Y�m�X�}���-� �C��M	��%����uKu�"o[�ѥ��}�ȍt��>d�Y!T��W۴��Q��]������+�r���"��Qt$i��n`'�{=�h�VU�KR�c���R2�vs��̛_������6���7v�:y��9"^����Gp}�Y�u��d��G�������J�Ri4���Vk
J+Qj�"�<�2�'+45�w�@؍ٰC�z(��Λw��%��痷�Ϗ�aeqz���mV"���RWW-�i��B�=����7�U\�Gi@⛈l]`�םWF�KI��"jev%���t���(��n*e� �R4�l��:�et��9\P��bدϏ���WH�_���U2�_�:���(-St��G�/���V�V%i8�����b���Vd���0���,���y��U;�Hb�eo��A,�&R ��Qs�ث��4D����oNl$�\)_]�:P��1��Y3yI�� �8Ҍ�qY�d;��*�7^��r܉���V�F�����:5#��r���a�-%� Ɩ���L�x�/� �%���\?l��k �Z,�t    u>o��X*@ce�E�%�m�Z��.Vk����Ҝ���e/�5g�v9������	�&����Z�y	8N��%��$��hTq���\�~��__6{�mP�^�:g���]I��FQLLǡ(�Xk?�]���\��7^�NH!;:1�~2$g���=�����G9��B*��%��� �+e2R<��pU�uƆY��?��6��a},���y���[�[�G=S�4+dn|N�������?�6���-�1��23�!`�`�3W%�t�S�SY�Jv��V RO#�)ʥ]�V"�ik�[񄗯�K�AM�\32o��n
^2Y��RCRR��]ݨ�[ӊTS�څI)X�M �8(��}��M�Gѷ���jI��VWd'C�=EX7�'������y�M�y'���+V�H$Q��^p��ɍWHziY�����l��y�Ȝ,ܼ#�45A%Sd�^U�X�T�M'0bڮ#�
�|"Zi��ڒ?�<T������OS����cwx(=�;�̒�VºA`:zDc�L������g��������n
�k��췭W�k�X�r����E�3��'�٨�!��G����c7��w#�B�k:�=]��Y���_�����Ç��<?o��e�Wz:��buɬ�ͅH�*'�F~=T��4յ%�W��ۈX�-�O;�qj5�}�$���E@F�b�j@�����-:3��=	�iD-��"�`���XN1w��*��G�"����q�xmn�"K8Y�q*L�lt���wUK�Kk��ϭm�W��J+=��*l�AM�T�y�p�.]�#q��GR�5�C4�q.éze�pr<?����#>_}̿n�� g�~)v��Hܪ�[�������1 B5�wD����̘v^	e�P:�
�e@|
<4��O��{OY�Is�5�s]hM�jْ(�������Oz�����>?������������1��w��}��{��5����`��!"jg$<G��:~!��w>m�Ϟ$P{�L�� D�br�x.D��Od4���g��&�dq�	#G52�l�yJ-
��Ky:]��t��t\�vu�O�Lr���NUC�kp�8�U�eIä�3�)��5ش���<N��p�uD�wU_�`P�C4z�+�2w�4K��W1�V�"�1�G:z�x����iy,���tun���A�<-t%e �6���G�a�n3v}�fz��
_]7���:5���`+RDJ�e����L�fz#C�,�j�4�"�vD�Xc�T�߼�Ϗ���??�u�x���C8n�vu�JQ��)�\�,9}�̭�D5�|4��)�/r�9��ҮC�����o�ь!���X��0M�S1U8Wwm�N�Q#��-d	�s�7/��><��r��x�7�^��|uq��d��0�(� �L�����h6�~�����+�fDʹf�O� �egkO�$�C�1���8v��8c��6�&/���b���r��VF/_�_r&d��{��~*�]$/#]�R��%��/����P�~�f�j���u��BEJ�zd���bB׶�4��Q=��3�WRL�o���08�p�K�����6��x����+wc��.dLJ�
��5+M�^5���Ř`�`#ݗ�9�o�&I`D87�����M豌	�w��6�`�]����$��iJw7[�i��!wF��H�wy�S}�R�k���r��><p�Ln�#��V�R�K6����M��\�M�8�BA�)�n1H�����O�h�Nl"�f	iw`��{|� )�N&�Z�)����?䗇��O�r����չ�%T�to'��cK.�$�I�v�Ӛ��}��n�RI>��p-H6y�'���mdJ��^rC�WQq*���!2�(��.^�kTv����`ޘ�!�KW����f��)�7$ItJV���������ܠ�7^��I������joq�4 �K��!�D0.�^xٶӍ7�l�"6�Z�v�U�̑~������I����Oj����Յ�nL�)���R��3!w�]���}���"sk��W�doQ�@������U�Zd���!��
�4��s억�h�2ph��:�k�05]���]�?}�:wa���G��S�-��6=��|���cp���٣��d����Ѕ]G���W�h�8|�^�?,�	ʫ8�D8%�e�x��(��R���	ێC�wՀ�uV�F�z?��2��J�ȉv0G�i׮.�{��>K���q@Wݧb���{���m�.7	�~�z�OD2�"Ƕ��d� ޵H^ʧqp� ^�Ϣ�N��	���⤗�y���������޷��>�3a�0�b�v�h��.z�J�����jX܃?1�d�8y41���v���3��W<&WsѢ&J�:Rh���j4$8�����H�@����!9�.H#B��u�*�z������#�$��M�وq:�buɌ�2�ta�4��n��uY2z���f<����;�����6��(<>(_�ډ=��6��.i�Tv�����)�+!�.ϧ��d��*аJnv��B��@�!����ݷ���%]�i˾�[k��l��wu��W��N���� Q �|G7�r�g*�se[���[@��y�}�	����x�6d�ݮcj��u���2?M���Vz��R0є���,�E��e�Ϧ�W&������Fb��مe��VS���X�J���{V�\q��ˎRk�?�@8���E��_�o�Ӏ�֊Q._����J��G�P�l]KQu'��I��Z2��k�[&��rj]o�6߾� �e�/F)Z�6O /f %7�F�c�̎�)f���e��ٹ*���&�5c�h�V�!˅�p�Es8Fg�Z)u�� �\RvZ���n��qe�oۯ���[Ԡy��$Մ$��lRg??Qv�@�T�LR�ʐ��t�ŢKT��[z�|���P����O�/}��;ϙ���E���$9��Lo�L�5PHQe�C����I`���~����c�aɝ����RȚcU��IF�����2FZ/�J�UjԘ��H�3rm7Χկ�!���ҟ�Qm(2����%2��r�OX�W�T�=��2t�2�A��U�����Ј������?�?�F����1��V�>V��8)b��q���ҲS� �k�xf��Ae8D�|��O�d;�����o��6��,��5&��W�Lk�*�p�t��w!ۢ����͛[^doQ�w^A���,�,�=�RFk�,ΎdiJN�=^�*ѡe�+�*r�L[��l1�_���[��ߞ�==����ͻ��o?<�><>>��7��̝G�=�z�vu^��2����H��>Z,���@�� c-���"����k�3�\��$òI�H�^:"�`T<@��]��-0'�[,zE��k������������JBN�j�W�����/�vr�Qf��f��4�Bƛ�>���~�N j~�.�1TU�@�y�J*��j�dƐkO�֝���N$���yV�x�p��~�PX�����/�!��&I�~��<�ƣ��L���\c`�kJ/����o�K/�����υ�= �"k��]9"͉.���;eF�#t�:uG;�,)�Kp2�5��k<�K�p�W�h.\�7rij
�AN#]�-�"s��Y--.9?��M���5���bV&	�a����%|qC��`���ɐv"��&��!r:��ftʳ�7�8۵� Z����F=w���:�s�y�U�Z7���C�.��N�E��)��%���\��a�5���Y���e$Q�w��_G�����N�rEH7�O#u��y�)Mu���gt��g��%�}~��o�aQ�Jڧ���W�yr>�̑�dG�ck|����RG3QI���J�ڸ+EDF�ݚ0l5 ү�"4��i*�|�镺���b�I$h����"6��/p�W�Y��Z{������FW�$=��VS�2u�{s��[�^ܕ�`�3̏�J����+���0�n�L���+�E�x����u0u������L`p9�74��&�[cQ��Y'Ǣ^�U�\hg|����6�Dԇ9�=���S�<�$	����R��^��;��0,|Y��(�6ᐨ#w�ˇ���    zg,����:PhoP�~��u�>���+m�B�&��g3�Z����y�r�^7�{��):��V����쥲���}���+�Q�����̙ȡlN������N��Q���BB)R��$ג�Y�T�R\�>���lRv�)ŵ��W�:&��M!u�gO���!�K�X��[�4l���w^�#s��o��5�zN��� ��K8ت�@�\ �v<9 VˊU]6@�x�����:O.����ו���W�0�{ ��(��P�%�ڮq�h�7\w��*���W*�}�x�Y�@vRCYq�h���+���S��t���d�K5��y��7YB>_��s~|Kj�ͪdPҭJ�\�:��l@�QB�K����F�]MD���R�'���B����y����ЯGAw��L;���2��D'�����z���ݐ��.O����b]�:�_��Q�
��5{�U�F��#e�|�H:�g�6,7��2=\��*L#�D�5���T&A1���]�����ӄӘ��li�:����!�݈`Q��J��|uьe�4p���"����IQfW��������W��������Z�WQL <�	����t�p��"8oC�l�U<�p-ftѭ�WUzv>~$S�Q�X�Կ�rE��d��G�׮ίF=���[I�<���`UK��l�{m�xRF��:��y�4��V� J�\�ڱ���D��B.����긿�6�xE���88�33�4�`s�{H�/9�ͪ��������w��?����+����ެ��Y�˸tu~1��i(�G�zAVg�k�_G��Z�R|h�$N;�if�8���ԫ$;u6�����c�'����Z�	����V�-�\s��^���N{y���^��tuyi㩺лū�ծ�Cؐ�����k�ȭ�a�7�Rn�Jw� � �ܽ9�I�N`r�I_GJ" �?��R-��)�ڣ���f��R�_����ޟ�KN���O���]�:O�k�MZXV)9d�Hk
�j!d��R��t�]`��сW �� ��f��AHF�0-�\���0��T�Ir�&��nQ��8����;��m��y�w��^�8�����K`�:r�H9�?*iqn�f��L'���r��IŪ�o,";2��?��]��Nͭ����I�|���"����i�k�+b!���?}
b��Nj�����V��hl���x��It�b�ޙP�����x���Eo�	>�J�	qd�C$Ӝ:L"vº+��d�Y*�r^h��X�=Q�B�0_�5u�W�駧����t�C�ۇǟ7;�;;��ȗ-�MhF+!����&�&���9{�ձRy�S��R��y��\I���V��4,�ٙ�MIØ^Zˇ WbŻ*�e�+�*�q�)���X��ݩ����n�m����dt:1u��B���:JL�����E�t����Cꠏ��-��Y?r�ϰRLi��KY��ډ<\>YgZQť��9�@އ�&"�j��K]4��#����/}���-g#�����?�����d�;�]���5��w7p�E�Q8[��,1���Xγ|���i絹n��U����%3�\QJ7�^m��k�#Zj�D#RJ��h�`6��Y#�ں�Qic׿_�:�4G�9�����YQ0H_�`2Q��H�M�[�1om���l���I�Ł�N�z���h*7�$�=�"s�h�)n���'y%�0��nƸ@]�{���7�a�MyMDo�vp��>�Z�:��R��5$�#i���L"�/s���yM&
)�4i��N����of�z
H�婉���%t$i�A6�exM`J�ڤ�52;�!���0�Fc	�Ҵ�t@��.F����T]�(�#E��!��e����)oS;9o���+����@e����c�"�>�2�}���0[A��,��EP �$�+T�����#��yl�����}_ �s�z5���l畭)� R�)�#�5���#bI�nCB~��|��
��M6�t@��A_�D���D�,�9�]*�Xi1�[uf��(ё c�B^ ��\��@�0�a���.��W�Υk޽������1f���)ۛn@W�
�Qq�6$y��g�H�b���+�-4r�U���*�-�5��y*8��ax�};��X @
�q��3=d�����wh��oW��._]xE�(����=E&���J���ܡ�w^�& 6'����E�ɐ�����v4����� U2VJ�V8�H�d�!�pD�}�|x���M>11���2��X����U�rH6fy�N�켍����e��b��.*'���-ˎ*��>3�ߝ��SlH��^�#U��Bw��3�ݐ����Ss�R*��#F+���#�/ �e�o�S�7x���u��ck�J�v��IA�c:tiR���&�4����Ic��>���J��Z�0!��0"���굨�G�zB�)7��*�`��do��&(����5�Myxl�>?�D���7��]��X����9w<'����Y.�������~U�f�%����;��F��#�0��߼���g�S7�^Q?U����6�
���T�Q�s�5[|�KX-�>?�<?���x�fS��p|~����y�]Elǋ�����G�~X����T�r�Mi���Zo���;�	.�@�`��F� �H�e/c�3|W�%�fP���uwYc�J�=H��_ּ�Կ{���?�"ٞ�ܫ�0��.�$��.�cΒՙ��#���>�$�m���4��2oX,_ ��i�p�vA��*���a D�K��$#��2 �ER(���x�������P6'6��z����<�!2��j&�����,ԋ���\r�io�~x���y�˚=�����9Zlو�f��tҜ���?���i#?W4HLsY��ܽ]� ���e�˻�N+�ᗯ.BY���c#{w*�S${���ا���4N;�uU��VYnY��3)4O�K�>�~z�eYe�+G,�b��>�#Rz�켱��cwk�o�l���0���F<u'�zt:p]�:/�]�zQ19�\��U���1���7Q���~vS�F;[erF��hE�lOf#x�d��N]*�(�b�D�ׇ�f��o�m�?�~��6P�r|b�F�u���z-FU$b12l��dG�S��giY$�37���0״�o��PIa4��V�	fgMF�\�`.�#�4arga_�H�P�����q�>�������䖹\rn�z���y)�"4�����-xc�
h��9�t�Ut_�;�w^���Z*S"t1��e�SCQ{���u�����m�'VMH]�vȾeR��{Nx�-�E�Bٚi.]�OmX���N�� ��0��Řm�KbS�!٪�O;��}�c����R1i��P����0US����`'��u�D�kM��V���UfUxy*t��o������YN.WOKB�JG�zD���R9OÉ~�{���+םT?U��3;���J�BPڒ ��Z��S�F��e��>��� �4�/ C~��:{���!ךQ.]���E'c�U�֔����Ե:�l��@F��/#�2��R�j^A�����ԫ���k�t���A�)\�;��#@��OU���nW�Q�����ĵs��������V�W/�նa8x�����FK�4���1��=�1M\�c���v^+�20a��.�bD j*�szA4P���b��$-�i�R�»��ݲ��!���݇�M�sgL�+���Ź�F#g�ˮɑ�4&k�D$��p�jo�-o޶ĭl�I="�CJ��T)�	gBTx ���f����F��� (WH=�,#s�v���_p���=�����J�+7˗�.�E-���Fĩd�C��(�{�G�P�L�_4���y��]QZT��Y�q�\,��󮺬������Gn� ��obl��� �^��px��>�6�g��΅8O|?au�s%�fđ|*�Z&���%�EU��q����I<�o�~�~�� �rI��G�T��]�&����mt³�g' ��*{=�=�.#e^sV�|q1��n8�H�dv�0:�-�/:u-8TU�0�    �WV�2�#XM<�7�N�FP��5�~�o��kN�J�~D�4$N���3���`��p�@�%�~�}�H;�� �(�*��1��?���QMTw:$�6�y��KPe�0m����ˤJ�{�Z��'��b��z��:�+�;�}�O�RF���Աˬi��
�@�CPJ��8�RuB۝� c��o���K�-����M��.���(kX��B]ƦT���kGy�q���ʻ�;��,O �1�+r�z�Ժ����:��K���I��V9M�O E�H+�&Κ�ZB3��Rx8Oa��v��V��C��"��u���f�t[:H���rנϏ��7�����VO*�la��p��uM��4y�T�嫌$��,L��8�GD�p�������C�����C8Y׮��s��L�nt>]+
��E�̝B�7�[M���WI8O��;�D�Q	Wb	."OLf�D�.��8LЂ�BjYd6��w���ۇ���ͼ̇�W�H/]���VC�r)5݇����m��Ǧ���sT�K�f�;��<�c����EńL�']:"v�c��̺?�,�`q��7k��h���������O׍Op�V�5}��W�M�C���{�Vvm�ɡͷ�1�߰~����w^��'`L1��p|��X9v��Ĝ��l�]�dCF6 ��A٨0�W-U��{ʿ|�(t��>����D�~�}9�n�c��87�nu) [�WF�����
BNӄ^�Ų�����.g���"���^���8�N�Hr
8�\F�����:��h��4xU���\YM���е%I�|�	��M���<|���"9��i._�w�ܑ��h���.�Ԩ���+�pla�����m�ncB����iˀ������2��㔋�p�E��?��	�Њ�FK��6�<k�rf�?<�/��u�r�0��s�/����]�q���i�}���(���:�q�P��HvȌ�j�fYв^��?k��>��v^9n8Op���,��r�V����@��2�P� o68ֈ�
$�k�*����|������i�k���M�S2׭)s9Vuا��?��h�g^���qF���4P�sn�T�^����\�T�����0H�)����i�@�T�Ma{�8���*�qz�$w�)^f'#��!蓖�bu^v�g�H2���W�g|!oW����LR���>���̨�[��d�e�T )x���8+j��2���t�p�	ܑ�[�Q�H�Zk���#�v�d|����,O�a���>�xq����sh�R����zq�5��8�I5I��D���h*=l�Ƙ${��t��%�F�	�(�]e���߂�U/�e+�$�b*��䋢��	����?�!J������t���%����2�b�H|�Ƿ`��:�Q�r.Цb ������ZW����L�E�_���97@�a�lQ��#GQ����[+�,k�L���@�h�E���1ҷ �%�p�ذ�y?N�mZ�hOd%��;��v��.׭ΫN�n��c��kx)-	+�Kc9�"��1�M|��k<|��N���2�!Aᕾ�(���YP��W����K�M��d1B@�����ű=X�
��+�F�<��?����&��͏��u�+��9ʘ�]�3��5��`�S�I��*�R�:�p���a#1Sp1����\ش��Y��9�Hv��i�P��KP�������T{������!�<luU���Vn[.]�3Hz�@�f�.�/9��e����&|+o�h�ل��y�V>Ƣ�|ˁ	��Vꕌ��%*����Zj��&��eҁw����X�;�V��������U���G*P��^l7�z���q���|�#_	1��2����6kk<b���o3"x�"�o��o���[ N�T�5G�;�vy��~Ts�֦�s��t.������?=��??��A��S+=���.��9;��G3�c=.�b�&)m����-��V��W,��\|k"��ǃ�R˜/�3�ԧ��»�]#���q�@�ΐH}C.�/~�WB�����V}8HVn8/]�3��rr/^�Iqx )�����o���U�２
u ����7Ę}T����eNNOS��r����Qf7Er� �JET��ȋ��V����ռ��	��᪝��s��6�fR�o��G�`�wvT���dik.��V�B�I&N� L�X1�n��l����1V�w�����X���2^�Q�`����l���w8!� q�nu~AS��F;9�����(��a��Gg0(u%��l��h_;���k4��
��	��M��P.��326=]�v�i�8%�9Oj��c���Ɯ�)�ы�X����9i�+V��T�MmS�i=|.�f�D�5�{4�v3Kne���k:�����<Y������)]5]�EkC��WxS�r:��rƴ����d����N"u8uڮX�#N���~J��
z�\�?��$���q����<���+'1Ec,{IH�c}D��=� $��S4�
I�+J�L��C��)�ux}��̪b��\}U� � �w��~�ý���:R�?��9䌞��xa��Y3��3��-�,��S���������+�$��T��5ϛ5���2�\
�u�|'M2[_�&S�U���&階����Z����[����Q��|���Ɛ�^����g�ǋc��H�$��B� c�����e�������[�q��ʜnW�"��Ǝ)����s���*�t�Z 2�,{V�8���eO��������:w{� {g�w�����{5: � /QBx��ȩ��#�����팴q�[�����TD��	k��9�0�z<J�O�	8+��F���X�@d
+bGV:wwc�W6�kIu\�v����W��,.g��j�5;"���Stȝ].�J	[�)�nú�"{���1p�ۊ��7��6N�\r���Y�4�6���H`����?;ϫ]+x��p�t���.�H�L����a��fz��&d�z���|?��ޑs?�Z�_��+��ԕ*5R�B���`͆�-�j�)�j>6��͌�]��H��]^D_�8o�)�%ݓt�4kc��U��+/�eR2GZ���Z������gX+���h��)�sL"K�jȤ��g�R8��Ek�i-�!��	!8�U.U�a&��xyx���x|^�����Ȝb�ju>�۪s䆍�m+^�P�+���|<"�B
nn�B��17JX��k�ֈ2��w5I�F�Eή�>l�r:t�D]�����$z$�`�]�A�yM!䛗���GR_�)
ͫV��m^C�(�5�xb��t�.q;\�:�Vۀ��+�� w�N5��,+����cp� R({�2�"��Z�"#��,u&�:�*�f�+�
wv>�&�ju1:c`�B$oF�Ӆ|�q���+O��/c��Ϋx~��Њ�~� R�I�W]Oc���ȼ�.ԘD�l�"qr^�`���q�g���f�;)�|��<SH�sA:Cv����E��r<���L�����;���`%���&� Ţ�nC�2���Sg?�+�sgv��H�-R2I�F��9���kY��Cy�O���7[�36ʵ�u����e���Fi����+�C�Z����zΛ[Mj��u��w^)����w�~���Y����x��f�٧�+i�%{I�] ��"$Rl6�4S�Q�꿼<���>�_��#?���tl'�O�I,���i�ԉ�zu4�.MM���]ե���9�z��������s��x�z�M�P�Q"����aD�ڻ2:���K���R&d�B a�i�C*����5^���M��:%�f��[�?au^Z4�u�����uKz�R��p��!�!D�ȳ��ת�*�C!#Eb(ڪ������v�>R	@�}�8R��$]ծO�H�������z�s�Z}%�k�O��vn��j�]u1�u��x�� 
�c�Q��3���!֓���k�v�8�15�
G'G�Rh�����{�!�#x��$'zLV�\G��TI䄱N�ZL    ߸�wN�Z��,#z��';��Od�9GΟy�kl@��pf�W�h��7cn�P~�ֺO<�b-�����؝/���pA�ⁱ��}	:e��J��B3�p�GWp������C�a��/w�f�D"��,��㻓�V��n��i�S�#a+N[,gD�%��^��u}��]���m�ҵ����l4�sY�3���7R�W��}yD����_Я]t�sn�H�k�4�҇��W����S;C[�g8WѬ�{_�:��O���A^���q��j�V��P$��z�x�q�;��GF�3��S`M���Y&��T$�����Xƨ�m����<�e�XL(<z��!u�5#�m7����3��ϙ�קX7�Z]��{|�k��m�mT�Ӯ![]Nd��fLۦ�v^����4���VY���D"N�6�re~c��2�6����0�HT1���u.��'��͔�?���m��h`�S�tW�.P�R�S�Iʁx ��2�K��my�惋�C��f��r���UC�*L�dT�z4�T�˩y��u�#G%P��qQ���QFS׸ҽ��G�����߷l靲r��]�:���:�am*��%�cP�p�Z:�(��el��y%��5j���HyBr��d
'���3���[� ��_(UO=��z�-��kly0���)��5b���%2؞.�\�:��¡롏�PK�7�+���
�͆�D���+���]aL��1�YE)�UD��ԁָS�� ��LG~na���]ڣk�M���w����K�OX��ɞ`�D�-�������:E���x��F*�ΰ%�{�y�"���8�:|b��,n9��`�0���d�R� 5���dZ�D�<S��Fo>�ͥ�-w�|uGR�W���HkS�� ��<!�W�r����Iw��>�Z�=��b'#�mTT��@(K�&/K
Q�0!U4�E�g5e�-�Pƌ`t�T�kWB�S凗��s�����%\��R�tq\���ʀU�� [�2���MS�����ڍ�i�5�aeљ�s���$X��(�[��@��I��D�fP&ԊaoՌv�דL�T���Eウ�3f7v�\�c��O[�O]Ț�y�[,+�I��@m��L̽����s�.��y�SN�a��+��a"{ )EAz& ��&�=^�}r�kvn�,��;z�L�;-�l��Q�u��~;������F�&�<�KO���X��U�|��&-��aV�r[�qҵ�zl�M;�@��~8@`�n�Z�0�0 !%X�²WCY�D��Hv�����e9Z�!_��}׻��Y�y���9�jW����S +e�H�z�d��FMv3y;��s�qK,��8��pr
)V��,����,I6���J(;%�V�к"�����%��a:�k��K���!�&�O��ie�+V�nR�wB��)��V�J�uT��P�;���̇��M-�םWl嬋�*Yq��bd޳y$YӁ��!)M$�1,l&D�����i������őy5��q���f��CT�d��bu~5P��C"kdox9)��=2�4�_��2�p�μ)�٭	��C�Ѡ��M�I���+i(��By��~�x+����(j�'y���|r��������ӡ_����|���C��b�]�CH�!w�UI����C���W�|9�H��e�)wy#�>�ʵ�N�d�j9��E.�!w+X���O7���J�"ZJ���E��	W}�8q0���.%߿����������_��߯;K}��3a�^�:/(��e��^�6""w���iu���9�-��9`�A�����B\2��� �NӍ�s.�K�wjk
6"��5|��|w�d��r:��i�_IsG�>w��t��kRz�ya�C�pQU�u��%��%=��J��j����-6��gX1Y���<؅Ev)�L�3K��;�G&ZS��ڒ�<����4q�kG�����o���3l�����	3w�u~E�չH�M���]�e�D�5��o�X8�r�L���P[D���Wx��j�Qh�H�w���M)}�+��W�"�B8A��:�ъD��,{�\���O����i�H>��1W��O�`/ H�	�w�HMR�&�@�v� oHg�i���k�[�9R�W�|[qMM4?8}���i��氶�j��:��=>^ӡeǯ����}�O�߲$�߯�%�<N'�O���������w����-a�Q��I3�+���6��W.G�0��$tgky�!� a��+��ˤ/iu��R!��]���h��X��~>���y'��+"�W��a(f��ZH���E�F��Nr�%�>����f����k��Pw�O�H��#����5��Aw��K1��\��^;jڰ� x�_"\j���w��{������uv&��5���꼱շ��ʸ��=��[ʜ�L��|J'o�7'�^w^�<���(R0#g�Z�3Lh *��*K:�3�D6.�u',�`&�b���个}������oB}�9}��Ε���W8R�PPG�O��Wn<Z
�ţ���v�oNn����^Z�g20V� ��6u�e�X����֥b2�;�S��V��R��o����[���0z��ݒ��.($Ɋ����]+Q��]zy���ݒ��a�7mK#�j��R� 9�4��@�x��&'�E^Y�R*��ˠN[s�v�`_ӷ���^��?�����Fy�s�����U�s؏h Ĩ� Z������t�I&�L���;��j���W�4YUp�
]8"�x��j����貞�����EI*nS"��\1$�ҍ�����IH^��a.̒�OX�wI9Bsmde��^�T�Anx%\�QAP��q��U�?|��"2��NF��1�Q��(f'�Ժ�c*@��iQ��jJ�4
���(Z�x��ڡ��OO}���!�S9�U��ꤍ��h�|���V[G*7�2{��>އ2]Ԥ��y���Nߙ(W�8g;^�Ȩ�k*�����2R6娞WD.t���nS��ۓw ��� �9p�1sݧ�.j#*ӝ�%r��pf��1����Q��t��y���Zl;|��h�{�q�誐��Q�Hɼr�-
I��nޝM��V�̶����W �C�kƥ�{���ך4"�J�����͖�$U�U�M"3��PfQ�˥�w��ע��i�an�pV�#:|y?�m�u�f�P�S��[��(��ulu�(�J=u�β]D<�\�����V�7�9USZ�:�`Ũ���Z�@�c��K
(�Gl�ȫGl�+m�&ːM#W����H���r�ʯ�^8b�4��W!�yq�: e@ƍo���j�:_ )�?=<�~=�Vw��Χ�s�X]t��(�D����b��T���çeہ��fal�vf�y�Ϯ%Z 
��y�7�c���2�\���R����P�Q�m'��Z^�v����hw��qDkv��<z)��8!g��_p��-tťRN\Ys��p���\��C�T���F��yNJ�v|+򯶨��zb�ҋ�$���$�A:5\
9���u���T�2���U��n��z+H+a9`����n�-����R�����ָ��?�����6�G��:��5�\� !%�\�s{�fQK$�,jl00��r�5]�,���;Y������������~�e��_�;r���ӿju!�Vc��>}v��Lk�?��w�˓��Ŗ7�h�;�xF�l1����]��s�^���Q��F���0��g�3m��T�����)Q��Ο�Mʟ�݊��5�7/���!H��W�cs)v�r�v	�٨�/Q�1�ft1�5�i�[iode�x�0X�<�M��x\�:t�W�%�c���F$؉W8m(�R	�+��痗��߽|ho7ne���Պ߻|u^&�]����@�:����>j�CNtC�-.���k���"6}GV��k����@$z� M8zUw��8���Li_5R.�^.�3�]����/?�hϿn]�I���1�|u�)y�mӣ6*���]�6�>O��/d2��׫��)X:Y�hFP��*��VȰ�@&�_@�
 ?�g�Ds1{����q��u���뀒#�M�s_Wӎ/�'V?;/    0��s��h�ND-OT,{)E�eWA��~~��ᦴI9��b��&�Mŝ��R�$�=/�F�ea4�P�����i�G"�	'�̟`� ���/%�W&�9 ;����zuN�[B'A�rq��L��u�YEm����v�]�;|�u.��gX�6/�pl��)si�	�]�l'6n��P�Goq��%k
'9N`���bl��*��s���<ܻua���'�l��ju�@� G��Q�<To])�W�
7��h�:��?�v��~畢"b�vQ�S<�]�ؘ���Rm aS��/��D�� �k.����~�������7��[cj��֮�G_��S발R� R�h����%���֋���ݡm��M;��4���*T�l	Yp<�4��j�i8�;���c�� (D�|=4U��:���|bl~�6F� ��|����,���X�P�u�wd�p27��G�u����]���I/�%�����18ʾ���1�g$��-V
Y�`�4U�쬵�Sg�֊W������G���]�:�29W@1��Z40�@�doeY��V���lq��ʍho��X��0	��p �}���A*ە���nM����_�۾l����7��%�-�����WLt�3��_���]Y�ʪ�ʂui` �'*�3���p?.��-(1�c�� �(����p��<���������Ӈ�?�|���4�c�m�����<���v���'��똀���o0^������˚��cq��q9:＂i��fX�3R�\��:�Q�K�h��n�Z/�툚��j�7"�?_���H�z]ɔ�Pe�r#ݥX�~�G޴z��`�$kA�l��*��l�@�e
EGsϢ��6���+�0ʌ@(j !`�S%ծ}�4,��q�	��ڔ "ad��h^�Na}����#�w�_�����Z��[ݾ�W�b������Z��u_��7=� �}��w6�ٻ5�^�Nv^i_�Y+=�����-����)J$��<�j����4zȲw�^�jwڰ�溹����C�߸e��Ɓ�V
����
�� ��{��(�٣t�t�Ù?�>�;6�n�����O̕q�Jb�GD����>�7�|�Y�z�^����T�m~�*JZȞM�2��>���??����_?�c�b8�ڭ��������qQ(��f)��@���E��g��J�y��F.%Z6����I,���Gb�9l�I*#Lz�-2�/�8��j�:�Ck���7y��cx��R�{WOE�* 6���bѣk�G�R7u:SC6�ޡ�u��a�k6�r] ���j�j�Z2�m�����OGVa�5F�p��oP�.A��������V�p!�����^�J���}�)q��f�b��ն掍�[����+���©��Q�|"&;DpSk|�[��*Bw!�D( �V��IۍG|e�Y^��~}�������|yX����lبz��!D|b��i��0U��c���klv^��bs��/�P� ����YjEI��l�̬e
Y��۵��H1zA��dN�۰G��o�_�WnjLɬ���_=U���d1�Q �����0ۜU�cyum�����;�Ta٨� ,�	��W�V�h%4�Ü���x;q�Te�Iv�E�>qT�����u�M9����ܟ�ޗ�t��K2���\y�_=�-�����j4���q�޶q>�������kC�MY�4r�l��r�:�xe�;zCPOa:��j�&@�q�w7�n*��͚��{�ӄ����D�=�IԤ���w���SX0�LYyG���n���+%YV���u���`o� ҭ=S'f��-� 96\Kl &;�ǐU?�-�7�����O}<~�9o����Kw�xx���]�oM��mC��$����j-�*���w�S۸+�w^�+eeY��]$𑾈�kSZk��9�9�"~4�f��*�Y��T�Aeo���|�1�twL�����I�VO�Ŗ���L���4Jp�aF�_�K�H�Qw<y[�n��W�z��
�9~���KY��������Ƞ�AsT �GԼ��$;6s��pSiu����ڼ\��wq1�a�9��Fu>+cB��fS�i�鎕��9���3>4-�ې�RDNZ?8y���iNO9�c��"�b4�8���*~Hő�o9]�ͯ�><��c�rO��u-����r|��.���k�6� ��-ZWΜc`3�W��w^�f� &*��9�OC!���W�����M�������Y}��sD
�W���&�����3_Jru����Sߨ��ٰ#r��w����|e]�`�K��k��b>�ά�7Y��YZ�#����,�7 5��!���3�����MW��Z8��j�vPH�lͭ��w֮�kA� ҢJ�
le�(�h?>�}�"��gX��#���}0vX/"�����xC�����]��pb1��0s��ΨXj�7����?=]l�( `-��|�����\&JY�-�I�R�lY%F�޴� ������[���j�:X��,O�P$K7fus��E����A��,��B�~�"���[��n���_Hv����T�n#Ȕ��R���E�� Wy&Z��{�.����7����+�3%訓ư�_S�0�4�"��6q��f6`�f��Am\5�pv���Mj��r=~����f��S\��ٻzzom8��"���N5���P5�T}Jgܪ�)i]��6��Fƫ�����an���ɣ�4�nr����j
�K�[�MJ7Mbb��ʟח�,��6\�߿z�T�q)F�����>h]bK���s���~�_DT:���ާ�����w3д6K��%x��~р����.g<{(��4߬��������cE�myEް����qV%�%��Ҏ>n��.J��K�~%�v^��l��@,#&O�%&!���#r�$��W� Cp��	�$�Z����wbnC��X��U��p�7o����ՅDS�kY���	�u���h��R�	�DsGᘍR�y�5;�8�]�Yq��9(�]T��nN5�$[*���O�@59gf��� ���F���^{�[��񷯯�Ӛ��T��h�������Xg�]��8n�.kp�g��&�3��?S�5�2�!��ES쮟�~T��`��G�z��3/��ml LQThe;��Q�z�^��2 �V���IY��ܻ�`w!�$�Y�e6ERrç��J����p�b�+m���WJ �f?���%�O�D�'���U���>8C}�yk�"��� ��Z���p�D��p-�"վa��Z�U|0,�B���J�K�!�x7�/���Ј�?�J�L~4�戀bsn�ҨǗ;��[�D|Ď��m)N�� ��1QKc�Z�q1�m2�fN�MeZZ������uuau񻧖�2]cG�I�>9*�b���~YG��V�=Z틼��>n��(q6���h���K�]nn���;��s�2�\�x#�L�����Y_UTR;Y���]|���$e�~�f%��uܿ�P�W���TvL��
(9ի�y��uw�ػ��;�ĮPMn���G�'��R��:Riv��i#��-x�����{1 � 8w�vI~�?�k0��pI����Rc��Ù�T�n���|�U]�Cc<��~跤���a���nL0[gY���.;f� �N�(��H�Y#��E�e�W��U���xM��_^���y=���z�s������F������MUN�կ·��
`�zt�yE\`�ޝ�Lz�cr��6k��{��L�5��c�# vԯ�г�jL\W��l�c��`���*����N��j$�b.�L��g$]�_����a�8�W7��I^Pw/r�8�$���y��*�u�I� f�����E����+�������r!^�ͽi�4�o�r�m��8~D��\��5%�߿���e�cnܾ�;�Tߕ4`;�'�I^��`�^Y�ݱ�߶�E��h 9"e��� �H��-�f�q��Z��@�.�<�iu��U���ќ�}޵;��@��    :����}�i��\/�:�r34b�vՓJk#�d��H�$�j:N�)0�`Zҗ�pduE�R��xю�l���)x�otx�{��=��/X]ho�<$02BBv-�#V�((C8��}���'>�=�B�Pg�TT����`s�9��	/h�$ex^�Q(iRD�~Pl�-����?}z����m^� �zs�w��k�6���fDc9���:��Ȍ�L�(2|��a�{U���C�ê�*Q6��k�p0�l��B 3��%Z�݋�r0�n�l�{գB����O�}�F >4���VeDC��jY9�` O�T:h`tid{6]ٻ��]�iy�y�v���ČlE�Û ��w��չ��Z<� I�pR#��g�,��D¿|xy���駩��ߟ~|z�����O]
�"�Ln�a��Ҡ%Y��)�*�Y[�I�ꨢò[�k}G��y;��6$u�\��R��	�L�#����0�!u��BH��j�i���+��q����?=���l˺ ۋ��iu1�I�r��x�[����&˪�d�u��/���!^���%�ڀ���b��nF_)��<���oxd/�.�^��i�D�8���&�u��	n�����Վ�H+MT�WO]�1�9�+�ڽsQv�;��pǒ��O�[#��v^�;GγԚ��j� }yplJ��?�,�L&؁��,[�d��\j���@6��;�?���_�� �_����F0]���H�2Bj��)Uw`����C�R�ndդ��[��Yn��Sos���(�*Z�z��ǁ���:U��Z�#���FK�M*�A	e��08#,ڌ ���
����J���aǥ����Sz]]!�� v����`칝_��{v���w>iC��yxC��Z����|QX��LA  Z�#�v'������\�*�$��?��/���� ֙+���V��\]�s��°�7/ȸcu)k��()�s>����y�y��V�B�1�Z8Q��L��I���OMMu�$�L ����IN�����v�����@�A�]��{��i'�鱞����, S2ߔ��byxO���;��J�����7���VxE �*�t��s6�5i��*\eG�#m�='P�N�L�t	�v�:%��jz�/Z#%�
8��c��V�Ķ6 C@}�f
VO�T����sz��3������/Ǐ�z4���aY�J�k�n��bKfߎ�1j*w}�D<�7�c6L���8Z�y��/HIo�U�1]��i�4=
h@��I�s���v��
�;��
�����Dٓ��w^�G�^=�����t��OLa�#V�X��{���A��L�������L��Ro������oc�������ްzz��5�(�T��#|~��Hʏ3��b�L��f0�bG&���8Xr8S^x/�U�u �9]UO�f�:�y�>%K߄�/�{���yS��-��S\i��a�4{b{o��QTmc���Z�ͭ|��9��:v��9m\�ٺZ�O��*0�	��ހ:[�e��i���>P���1�"V��Jݸ�#�F��x"��A+���6���9|�>x�TJ�ducә J�R���n�1;�D��Ӕ���p��[ސGr�D�>�֓)�����q��l ~��i]�R����)�>m)�*�=c/J�ܴz�2k��#V�R��XrxsLC���-:^�;V:o���+E���aYç)}�)�- ��)75mg��q��
�li�m�[P�)��P�ý���})0	���N�wuq��iK�Y&�&�FV����v��J���Od{s
�a��vT��v�)���������Y��Rz37)��LzD�*��P�������C�Z/ca� ��������xsKMv%}*�"�l���:�1��Tٶ7ＦʆNf' �Y��B�b[s���<ti�E9DѪ�� ��.d��-��v_��4H�yZ[����m��N3%�Zr�r\6��39� �'���vZ{e��fs���\/�;3���J�f�_ oxD"��z�q�+\��@	�@d ��Z¼���9t��W�[�/�ŝ[�~c�7FR*j��ͭ��l]��n�ᜃ�8�1u=z"X^X.�S��;~�5��;�ܷ:��e(�h�&0��@_� ��?D"fG@N��LO��6�5I���������x�	�nm���E�tZ��ۻz�!��5�4H����ԥ)Њ�����߻�}���a�f�Rn�
!dfU:�cK�g�*7��g�"K7R���ٳ��I�s�j�`���������㷯uc������ʥ��Յ�F��D�A��B�w-KA��@���#׌���R=N��W_%'	;<t��Нm޷9��P%aD���*�v��pZ�,|��m�p�@������7+��f=Y�w����".K ���H`��)3F���Y*a�d+�r�y�z�ڐ��E���E.!�}���|��e�sf�]�"f��bR/5�O֓.�h}��������寗Y���q��t�2��W�`u�Av��68Oz��S~D���˼e��3��_�>疕�[�з�u���XS�q8�c��5p�2�nF>�/R��O!E"a��RT��9���'����H ^_�_��߻������v�z��!N�08i��[՛p��ݛ�;l��v��9�YNC��#PU/!��s>d �-p�@��6�yֱW��`V8q7X����l{;iu��>ߴz�HX|!�ݛ ��ӭ��I����[�{k����[�m=`_#�4,Jg9U����(�i��aʀg��@L�5�+@d�\h�\�G�Uɧ W	��auA��ZB���B�i`�a�I����$+xK䆥�[��ǖm����ZD'�[��=h/�8DG��<�g�6<Q�Y��Ļ�d{뛧��/j5�������X��(�V������P�����%���m2I�|�e�Wz�d��v��h�y��U^�x��d�-J���I�Z;�����9��
�����t����\���a����>���<(����w�]]\�c�-Z�K�ك�8W[
�(��G6@0_g�Ǽ�T���j���A	"�
���Ȉ�͜���2BV&_�ɂ�bi+��|*�F�.}�r6ꗈ0>(��*�V�?x���e4���.�:ߧ��(śX����Z�����t)���T8$��z���J�d���y0Yt��������qJ#U�d�bdJ��D� ���bqҍw��?�O���W0Z���e���/��J����Ӕ���g벋:�z�7���3�p6{�ػUy]+��U^���S+"D�Ib@���QxS�qC*w�z�`|�����2R,SW6��$�ϙ�p�~|��(v���y��/X=��1#v8:ӍvJ�5�����7�"sXW�w.H�����ZǝW$�0w]�7��(�+�"�4�Ԉf�
��=���N2�C�j��Ү߮}����㟟�f��>��^�\7��jve�nZ�Q�#�2���	�k�����_�R����\��9G
*��Zd 1�
�%�<�����E��#����D�F@�x�����o8���u1ҍM�8LYK(��#�﮵�ay�	�n������F��q�|G�1�:D6��ыd ���őU�����h�;+�Jf@`^����%_*���(�|���7 ��;VLp�ꩁ���ܳV�"�5[[QI�`�hZC��gz�b�7[9����3���"�P��ҥ`��h���;�s5��s�G���Ղ$K#�̦g�?��70��d���g\����SD�
��4� )�Ae�a,|B=OK��n���l�����x�	d�2w�wֳ�Ѹ��|I؋S��9{�jG����#G%���^��o������qZ�p�$�oxSP1]��_���1S&j%]L!;:E���+���v9;@�w���d�֯��WR�R�Ί�#���Mc��qj�{�c�j���K@�������4���V׎��tl|�ә�n]=���7��rZ��(x���,�d��;������-Gx�y�����LF�    �N� ��.��i �*��-��TQ&F������<�������%�Ɓ)�4�n]==^΅�U��w���OX������)��e��%�fC�n�k�P�!q�Fd�0p�z�Y�n���t�6�Q��j`Mg3~�ʌ)��)�M��~�)??���|Xz�]P6��V�9�]=�`�ם欶��r�������!��:j���EL�'�,��T�q����%�xs���c�i�[�D�N �夕�O�����̷�Z�{�D�y����`�X[7��&,�O�7��R�3X�k���ܘv��*p+�Ml`zd�ZW�,�H�xۜ83�f%B&�����)�k�,����?3�B��-	��*\r!�sSܶz�4d�M�hÍb{њ�i|sd��s|��YP����[�Pm��ϰ�04]���[��މ�[t%���ﭴ��:��;��pRo�@h��09|)�������tv���y���Q ��,AT�Mc8׀�r�76&/l��lCb���
�<��j1�j�N8�8�`T��͢����4ʍ���N�SV��\=xy��".٨�rI��ے���	zN �x@�l%���.(�ěw6q�Hw��+�և�Wj����{�˻���H�4�S�y��8�s���YG�8f^Iӌ�)���l�2�O?=?�ח��.�/��i�_)�޿��m%�$�s��>�|0t���*��eM����8�j�;�(N"8����X7�H�Q��e4�˱�����F�0�D�D@� �<J�1�I���ק���[f�x���7�.tyg�4�e�`AQU�����y�p6��ڻw�2���JKw�R
'O!�M�dS��RmU��n�+�p�^�`y��ٙf9K���"��X���7��n�P�]=��lF��jb��m��%�>�������;v�nξy�y���;�!��jvZO���G���
$9�jX����cd"�k���8oy�Է�n*>}�5��f���fe2�����x��7����%�����'!wZn�y�'ێ�[(rVz�d�/�^�l9�o�V��YF�E�z�#�ywH�Q����V�P��wO���f�GrrM�i��br0�\�T�I`�J��B���9��-ǔ|�[���+���9�YPn8]���Ѻ\��Q��v���Z5`OSQ�2\�3���0��u���~�?<~�׫W�J_Tٽv�9�d���P<p�n��,��D��Y����&\w�\��W2$�4�T�y8I�#} �)/R�@��J�l����Fd��^�)�]Wp���G����
�Nu���;WOቌ-֔���gU-��݌p��=+�6&��;��𡺮�Lrt�tŋ��A�҅#�ssQ\p,�p'@21q�)X�������:���'0�o���c��a��E����6/��wf�X^������D�`Cgcod�cg�F�k�yNR[�W%�T�j�Ď�&�T^ä9��8�H
�ב-&Pr׺̾uծ������!?=��>|�*����l�����Mw6x6ļ*�}`lC,g�B]���{N+�0ۼ�J!�w`1��8��W ń�5�U���q���,g����G��y�4�z���ZW���v���퟾]����쎑�c/\�ܴz��*Q���S���5ѳ�n@��Y�+E|7w����m�a͟am���2kğE��lXjtB#�[
9�^=×,��ʫ�G,�A�al^e|=7��_}̭_^�8A�_V��a�JV�5[*&�\uȣ�I�S�S�dI���Z
ׇ�WLh���Y�V#���r,��GI�y$A�"o����Zɱ��L��c:��d�u�՞���M��s�E�F���a�6�^�g�g��z��}2~�^?R���"�4e=�$���,��h=�|��#/�%��Z���xr�u�7rêxKw��k�q���c������/?��FnN35�t�Z{WO~2��;M�@j���yS�[�ե%I���~��,
z�y�����U�����a��L+;�t��ˆ�@�AVM�$�@��L
Lރ֎�HX�-cv]�j����|ղ�����0Z�o��H�h�$���)�~v��v�ʏ�5-Gmݰ"�i�@��*�8�o(ђ/�i������q�W&R�!Z���@��k�Zu��J�!��������E����I�� +�Bf1aH�^�
'�ş���G�YG��ϰB���[%dWF�l,��M  z���*�Hk���V�T�d%웂��P��9?�>�>}���%Ǒ�\��{�Օ�G�)rr���ĩ�,Q.@eKb��=�/��;�3b9�� �LAV� fq�J3M�T������@��j���-Z�N���	��7//?mY+D��U��]]LT�ʴ�%�Iʶ�n�uQeɛ���l�ym�����/���t���r^��4w]�he�]�f�k��3�7m�[�m;�)~�?}��m9|�+�.{��^;�2��X�F=3m�h�O	�����:�2X�����]�qb��& !K�)�:�����
�lE�&R���;ꂶ�\/V������O��ym���<��r-{��T�3��UK)�P�MM�$��`Y�p��7!��hm���J.R����))��ID�<1t���R��>ú5c(��x�V�m���5�۪��d�{y}����?��,{�Hr�P���J���i�ڥLU��X' .�F:S\��L;�(y��]���kZ/M)�\ᣝ�z�|�$��uq��vĆ��:�g� �e�F���Y��&���V�ݯ�=��Ö�\�r�<�]<%d�8㪆+1 �n��|NҚhφ(�xϼ�VB��J���(!M>�>x/4 ���y��j��.�Q7�PDn�����:���y��?�5�}�u���S+zW�WO�W(MǌP��t�E���&�µ�6��;��ʗmo"F�JV-e� +�mxU�s�Xw�K���`�,��YkË�CjG���`�V}y���D(�I������!�3�{�/��2���j�n�l~�Q������@�y�z�����DDNR�N�&Sи�w,�F��`0O�%X�c�b�X[}.׋G(������^>?�ND�%|�ƯĪ���iz�h'�&��Ƚ��/���i�
����R�F�c�yeNPa�IF&	~�XL$�ql�챔�\٪<? ��?�+��^|f�y�_����c���sٴX��r)�M����[mҐ���.��-(L�o�YU+/;�>��v^�x�']< �D4�t�) ��58MWm<&�Un����ĎW��@C�obX(i�t�Ŗ��ĢK��3�|���^g�'u+�$� ���6<�fZT��˹�m�[^�}#׋#�W�g�-ʱ�1�B<�߫'QCd�Ŕ#tL6�c�Іee�N
jǇTB�y+:�^�eI�:m������9�eQ}x0k7��R�aA��٥(B������K��3�`]����,��ъ�k���~xe���aL�Ɉ��K�H�PEk��� �ẳܾ�^4���Z�b�E{ݰz�`+���������F<c�P�������/,��65�r�p6co�m2���
!������Q���6%Q���"��q.���Ec�`�I��۟?�n�B�JK���OY�Sރ�����T���tVƟ�n���w��YV���J��WA���%��;9��Q�����z@�5y^�UV��녚�0�uU"E�n����t����Jˁ��^��ݻ���@]KU�QJ�S#�N%�8�gk��_g�м�J�b0�2�ԍC��,���) ����ABjj��IV�`D����p����L�/{ʔ�2q�֧��\]@��s��Έ��q=rJ���?�`�ב�w^)�Q,DA�řml��Fh�6Z�h�,,0�p#Q�5L
��`�!�ʎqm���m���ɼ3ڮ�n�_=m�2ct�U���ۜ�C2������w^��}n���B��^[V�<�P�!\���]��v��<B4?��a�,�CVN�]NU_OZ��l7�,k�D�K�i��xV���5G�UąV�c|9��Ҝ�X���e�    ��a畫�n\p�
�"9�&���$�y#��q艱͑
�%+�8}�� l�CL�^���K!����O�6��CHp��J�;WO�v�4��T�M��Û�R�C:=�ـ6��=�ooJ���IQq8D.����V�t�����n�D�(���p�� T��+�
h�u:���{����ޞ�G���zߚ3�vj����iþ�XK�գ�U����آ�J�2#���g�����W�V�"VQqhzJd��Cuj�f��'G
���Ā,��0��ʉ�8�׋-Ym�sc�)?o�.0��j�����^��.���x]�$�Vz�[8I=	�}�K���k���ps>� E�4��e�hk�'
h��NM��Y�Y���/vTO���k~�������i��=X�.h�iuY%��pƲ̐I�cuԧ��'�t���E���+�-�f �؊H���Z��ĳ7���0�����
NRf��@-��G�:e��f�����?�������[���W���ֿi���Ъ&�/��m��!ʙ�H��.�B��N�1�m6w���Ұ�2�q�|�D�ȁ^��2|Ȩ&��J�Wp���G�("U��е(VnԎ��?�R��h�Xq���F��G�B�\�OػzJ�Ե*y-c�x�@x/��:@�����.��Fik��}k:]�VQ��xCU�L�*uU�4�~�"�)�A�jfS���:�x��Ͽ|x����~���gĻ�����?o��)�~�su)b*��4i'ٌg�HU�����k�lA�*A9�bC�|`3Z���-��K	N�����t3�T��H�='��$>8��*ٓ�����&�`85 ݃��_�����S���ZdG�7�d� ��^�3����i8?��}�q����F�@���AЯD�J�D�,H#�Y&cLT��`�^��T���`��wz�Y\��O=h�T\�iu1��9�9�X9���X� �k�*/����TXB��/.�>򚕎�a�J���4Q��A�= JlA4j%������uҭ䝁�A���ǔa8�����綕i>��\�����,�4�A@H[���"�I%C�˛Oz�پ[�A�����	�d�o�G�"��g�ڡ��q �k�J��UTRFD�DvKo��	0�1Q��	��RzW�����V�7��[eU�Ń��Z�1��~�)�r������Wr\���2D #�b��i/8˥zݕ;Nd��C4@� <ٟ*q҆�'�eZ�[�N���i�N�2���ӤIc7���P
#�E�	��˹��Q_I4��ژ�<|f<*�PF���Be��hpn�d��>~@�M�:��'J��[�ۍC����3gFg�@{WO�����%;W���I�m��!Ve��̀����V��a畃bi�ᶕ���]��-+�F�M�9�<:)'�d�e:Q*��r,V��/�~���)?=?~�SE�ߺ��f��c��"�i/�H�*s��.��t��3���un;�ކ'ɠ6%-�	�RĂ����7���jU���+p>��H�Z���ͮw)�g�S��fZY��A({WO/�bg�e��[Uj�iu�-T�ڙ����u�;�\���d�5���L"�A#B*���cjR:7,�X帡	��!)�쀥������������//��{|Ч�٢����R���Ӳn�H���v�ZL�(	��.g�+�\�#���Pv^��2j�n�u=�t@#��
����z6���d�LG5z��GP;j�-�~�i����g����������'=��#����-Y�`[*�����Z=�op����4(�+��W�cEX.p�J�,Ƀ(U5^�Jf��|P��$����oR�T�������{�S���Q6��`��I--�,.�oX=���oP�y�C����������N߳Cg�����Zql�Y�&��%|��1T��(9h�<s�ѷj��"�f�d &'֞^������>�z hW������Wm��r�,Hq���直�z���VL2�P�i���4�|2^�&WHq�B�[g���Z��N8T��N,\�~�C����_�����e-/�.��V�*�J-��$]OA�9��E�_��"���]joYk�y�����8%��d/�(��ǜ X�?y;���B{��I�إr\s�&�6������� �?�R=}�x��]5���S��b��w=�Ո�S��-Y�v����R=��R���S3UC��M����й�G,W��ej8����4c"rဣ�ΰ��{���.&oZ]�.R�=Z��\�H�T�,{�Z��iNs�:;�b1Y��c�Q�U),Y9�@W0�8	aN��p��p��o1O��O���������qF+m�?X�ŁE7�.�˫�*�8Z�M������ݫK^�5Me���?5�	��6���+��L���I"Vw"���46�#�	a���pH9�4��~A���qS"��������r����ժ��2�8 7�7Տ�r�g�A�������jk|"�.+ �`�-��ڣ�j�{�PV����~exM����yol6�M� ����i$�����o\ %�v���魧�KU���M2*�0X�T���YGФ^�μ�t|�u�v�+��xh�pЬ�	�Lq���%�<]�q����ZI���$��3[��	~O��|Юj�ݒ���%�q��bJ��읒#�C�p�d5�	�8cj�˯��?��	0z�6 QF����GG@�R������(U��uzS�y�a��{��Z�N�i�_ȯ/��~�"^��T�����'�-�O����8QҦfU0;�$�@�ױ�a�,�I����v��Lݺ�eުZݱ��[���l>��؊�.�����4/��i�^
��̩O˵�
µ=�N�ז��1�^�Y*K��Z��������WTzR�5X9��1w/�)|X1QJ�`����L.kCݒV��uX&srU�~��/���f��Y�\�?۷�PX ���b�G9S*�n���QF�uZ��Wj�}l�kC�H}����E���n��rh�@����O��"&H;|-���v;��i�{����@ʗO?|~~��3N���Z���N)�2���E��i�fr4%�r�3�kx��R��+羒0�a�K 𨹐���2Gڻa�A	@�3%�CIt�&�X�*��:�*�h��
�Rs�fjg����;�oX]d�eҕh��r~�Ҫ�_0]\Ǡ�{_�|A���WT]��K������´I/���e���˜ A	�~*�T��4���Uc%2T�d�)�]�̑���ڟ���H�P� \ƹSz�VO1��k�ē�Hl������@'��Y�����sn�;��F�)kS9<��BE���ΰ�	2����$S�]��Q�2E�;��]�p�e��\����o�ؔ���E�Y�>ܻ��d�Qҏ,�G <������LU͂�}�:���+����5�Uv����+ ǐ>��G��Nr28d���P��Z���i���0��f�ϟ����s���3+BA�W�E��[���M�g�H`��3Ùx�f�+%	���T]- �π�l���Lj@�2d���旭q`:?Z���̄E�(u�!Gf��+��ӧ��_;��yH�i����
w��N�eo��f���T��_��>��*�3����&��\��3��ǆb�a�#���H�������J/U��P��0�Ar����
e�!*�����OS�]z��)�l(`�Zǳs�����2�#�*�_��i6E���q6��G5�͎߷�WR�	HB�f8�jQ�EZ�TH�k<�EO]KK��p������[�v=�u}X���� һ*��w�4x�P�Z�V����'`G�W�4��=;�6j{�W�������"]e�|���[��R�?N*վ��)��!�e[Uu+ ���=�����O}��l�cEo��l����i~/�"���i��p:{�g*��w�q�dik����\hS1X2��� '1�oV���|S�+��(�jA�v�<Hh�E���������2�k��    �i��VOq�,��;��K��ś�4�bD�]�_����?���W�����~����WF8T;���Y��rt�q��T1锈,,�j-�K�E{�7/�O?M�W�?�������������5S[g/����DH�>�q<�O��&��4̌,!����Jx3#>�F���
 	H��n^6�n����z�Grfm k��c��U�"�Z\SS�f��˫���⏛W6�;���ڿzZ�<ܫ��\�x-�JJ��0�2�R6�����^�u?z�y�d�,G���橲"��������V� ;�;u*�ZPl��/E� "]��r�ޟ_�v��!7��23}��rG�Տ��T-�!�w��|>��W ����� $�3��I�pc��i%��6���$�E�ȩo�m���kIb�P�W�L㖹`8u�yM��M5�Z�W��w����A�-�}
ɴ/����Mz6�wlCܲ�a�KR����)FxA'2ز�Sm@��zY��G`tD����%lJ���V�C�w�O��A���J�����|��jP�7��b6 �Q���9��Lb��5�Yo��	��M@у���5,"��Ѫ�Y�y�jp�X}И�E��⬝Z�Z��$��'��5^u})�q��iM�μ����V
,`D�l-��p���{��3�q�<w^my�d�� {h�n�p�z���{��p"�2%+�5�U�]�����J)ד!��V{k��h6�ŨN��VO����c(x�Q}�5Tpi\ﵚ��ߨvl���\O�w^I�"�̉�����3��zY��@�(���,��˷`x ���u�х�s����Sݙf��%�/\�L���Z�_^N3~����Ђ�0�m*�G�鏶V7�Y{> ��D�/�[r"��+cƃ*�"��� N�t��{^Z��<p�5�C.V�
��P���%*=,H����(������7I��ڄ����=i�|�X�C1�RE8̔��Z�/+��~�K�y�¹*��n4��(�읕��Y3���wr������h��Υ��V�_�b���h����G�a��⃨�x�*�#��ې�3o�C6�@%��?J���?�S��>s\}PT��Q�G��)�f�\�ZB����Ij�g0�JelR�z���k~nO??~��?>|~�Wo4o����-��Vq�@B�)p{Y�4�=W��1��<m%�;��'�����/��(ߔ���T���͹v8�"���zSbMix!G�(����6�]�nURk	���������š�0#h�T%��Mix����L�+5Rv^+6՘R�*�]� �����l��"���Uꈡ�tI��ӈ"{ߣ�8f����O�lUu�i�M��c��u��4��k9��ؖ�'�ӿs���'����y������B��T枊��ʀ9ژ�Ny.<�^޴�`�Z�,�&��57T��[�����:�_^�?�Ϗ��<fo_��Ƃ��ރ$�4ɭ��z�#�S����R1���E-��O����>�z�q�l=��h���\� 8�!�?4:��r�Ι}j�M��9s�����߾�t-E8]�î��ڿz�|
�.��#�0��J�5Kͫ �׹ʜw^��7�N=�<,f@� �X�#�r#�t,砖#+�~�4��1&��[�ڻ�0��L��ֆ� T)�S��VOq�-@úȌ��eh|E�żV��Bgr���Ǜ�Ns�y%�TSS8XR�*d+�x�UMs�Y1�Ȫ��+��1@��wH�p6ܔ�n)�����c�.�J�KJ�7���x�H0Q�w"U���ֲ8}�?��G����Z*��l�
<�ࠥ=�lpa���h]��sf����b�l�pc�LI1��8��<B\��7oT"�Z�w�wu1�o�j�Z���}� :��Te�g�a����n[�W��W/��`(%T��J�0>Ќ�B��� W�)L��MK@i)�l1�Sc��.��/���^��p�veV���Ez*8��h2�Z����=�f�9���j�[5���W�q*3=�8Ν?eX�&���m�L[-шbyH�x?W�-;��e�ܮ�^{�~����87F{�$ݴz���r��ob<�����YS���V����:^+�����:jγ��9s���A;G��X�+G���:���}�5(�K�3���.��"����E==(�Z�����+� ��8��VːU�!K#D������8�u&��;��(K�Z9�r8�2V����eyf����L�s�E�q��v�"p�����o�,��������us��>��R����\m�+�%{

d��P�0�\�_-ye7�W@M)%���O����"zc��Ǟ�4"v��;+�%�GD��`'x�`���.��|y����s�o�`Pn� �_]���U�g�֛��Z�u-��	�+gN�j�[-.~SP�PYJ�)�h{)���4'`(�B/}�a�΍��-��C�(��9S^��=����؞�`i��6iv|��jX�	޿z����=��6��S�3�m,9�������8�w^�"x��3�H�3+�-b F��J������C��x���H~DP�B9��ʎF��!����?��[:sV+c/�G�a����D�t �9e��m-�3/;��R!T�s�����
iS|��c�_KX&#��QCέ{�S��09��۲*d ؁{+A�@����u���.�{�Q|�!6'B��^>U7��f�]K�J߭Up2:�$UZ �Jp��%���ȗ�;���ȉ��隬�p��hJ���[�e{QG@��	��\oC�������C_7�1x��4���SN�����H�$y4˨�k^��4P���M����+�Q�R�1���76-J���eT��"G��� DH�e��4pZd���sp��xw�N�x�OS��W/?��b�H�ӊ�ۿz�F2��q��-���U���Z�;yƮ�G�l����٤w��!�rpq�k�U�o����sH�3��x 	�wQ� F�6�e�׽����ߟ��.���m5���voZ=-�7R7���ø�B՗�:�݈�,'b�����W0��k�	���r"h�����)�����nT���v��6�~�"���=�K�ȟϯcK�Q?$��z������`�T��0I��u4�����*�o��17fKnM�U��l�Ћ�� jM9a�bKV��Ͱ��@���U��W�7)*�XQl�;d8��7��1bp΄o�rn��Eo`@F�5�4�SN�99��YM�a�W�ּ�
�(��э��_��-�"x�R���s��L�ހ�"�Y�s��lA8�� u��4��ܰ4�����i���S�L���W�s&SS- �YY�J�M���������k��B�8wB���,VJDh�|q����f��Fu6Y`q�E�f�)rpjT��8+�m�N�bTY�$ku��)�����5�8��<��6%+���.���;�g�j4;�R��|� �R�Z�g���,\�H�Zs�Hģ�փ�Us��4�)���)����T��˒���z1&��.�}�҃��x�j����\H�=�`�,#S���>��5��ˊ�$���z�1io��G^�͟?�J�J�>���2�KM��J��2�v\�� �(}�2x@��&�	��(|v���f�-����[l6�.���i��f��&�Mڪԭfշj��6�3]+��˶�;�(��{C�r�<,p�A7Y(� �R�-s�w�S�@��f�zq�
�'ϩDvmߤ��������7����˚���E�x��)s� I0P�C�%������iY���W)>�w^���$#Fv8IJ%�����n�kzģ�D�S#Y�W+�V�ʌH��ʏ�������П�tB�*�pq>�M����R]��l� �K3C���t6pK�����[4r�y%�����b�1l礻`�l���c�n�5��&[=k�h;�Kt�i�o���?]��Q_�-�iuQY|�ǵMzk O�M�����v��B�T_�h��W[Ʌ#<E��|M��r���~$�)�+�Lf!G�"�[��    亩4v��|�ᇵ�o�:�y��g��<+�^�F�: N�l���m���g�q�(
�U�s�y��� �tE�ԒKtN�**�h�:���1@R5
Pdu�z��A����:'�I��������3>�2pB�лy��ifdҞ����#��5UCR����q��'��5ӗ�g�W�ǝW"�p�vJ��J`�[�U'S�f��[��nX������8?������J귯�/�&���fm���Յ3�i��x�u&9��,%���29�=����#��W	j�:�(
�k���q2�T�����:p��G�Q�)}P���3
h~��NN�E~槻/ �x��ݴ���NV�-�s���f��e��--�Y�_wc=���t��3�����j��V�D�ٔ(\�,��%б�L|)�Jp���$�ȶ���������Ǿ!%w�N�U�Ž���bK��m	8_p�xbkl6�͒ᄻ�r���J��g���ϙ�J8<]ʽGs�դ�i�A�%z�\�7�2	^�K��P�o^�������������CDO�Ѵ��7�<��]���{���\e���:S<�W�	��L�T�;�.~ο�b+�8o�]ş����<�1I���*B�Q˪�J՝��tְ>��0%�Be�B������O�7:�� >� k�o{WO��d�nx���t��D�)�ι��F��M��R�x�yM@S�n)	l'���@�9&Xzr��܏*�����#SXA�5�T�6c��%]�����k�x��ٖfdvf�4{WOs0Z�,�
���V���
.П��${Ǣ�ͱ���W�4;K�h8�Y�	đ���Ϲ��<_��lK��~p��`t�f��O��������������j+�ׁ6����mY���|����H��oT�T5]�VO�S+3X\E�@@�T��~�ʓ;�}�L�ɢF��bg���<ܗ���W�G-xt�r^A���K��rkQ/����i�p)�c'�2���T�� �5�,�\">->�7�R�q�1��wc�RS�6������{�C	����8�V���j�-e���̒)�2�\Q�T�9k�`\v�k��"XN�ejE:)Z�J�-M������w�×DVR	�|Do��ny�,��?���[~�g��9�Pߙ����BeBUK�&F�p$���t
p��U*�q�*qm�y'�&��*WP刕܉��5GǢv�1)�4���=q�q�V�*L�[�>���o��o��~	#5"�.�}�;W�m0�fŁ���`�f��g�o���J5��HhX���&���2R6�m��H��C�j�:"$R��t��j�����h1�۷�_O���{^�AD��u^'��N�|��D��/���:���rl�ybD;����#����+����7vlR+)�H<��T5K=D)p�� �攳�~���nKf�9o	ɝ(b�W���Bl�����M��R<nX��+�| �kY�e���;礕 �e�>�bT5xi�p�Sn*��5A��ZT�!X�&�⇲�oW~���w?�#��Np�j����y�7����^���p��9�}32n���)<����_v޹�&�ߦ����gG%�HCzu�� `5k��D�!L`��9|6��#�?6?��?�O��+םR�{����yn�{�U�s�J�V��N��d�^��ϔa?(ϙv�)?�Nݟ��	��<�#�=�j���9���9�S��'�!�/9��Q����Μb����s���}��St��wZ��_]tRȡeQ��!K��S@���a!>�{��]v�՘�J%��Yv�H�ط��"�x5��RT�}��� _sŜ2�F5=%i��*�߿�����}�[g�珟��V�<�ƿ�οݶ�{W�-�&�&�U#Jӆ��Tj�A��{�p������;IG �8t>gƇ$���Y�����z��8lL��Q�6'�:����͓��4������:���nOཫ�3WTKe|��r�юc˭Օ��G����<�1�cxJ�~��5��^l/�f;�J*)�>�FlD��Z��]�
<莎�o��>��o�_���J���o>��b�Զ]�_�Ƿ�	-�Ni��*�9�G�Zi�~D|�ՎZ/;��k[}�#�^5�_$l�n�"W��R��2{jk��VKq3}��i�d�vBUoC�K�I�tJZ���_��`��p*0i�#^�3t�'P8�K����[m�yO�Ǻ�cf�Y(c�@�i��7�'�X��7�e����� ]���H�M���?������=�TkyRƹ�<����&5��'�k�R���ie���r8D�����j�M�p]']���9ݠ��*"�l5������"p&_�mf1dɥgt��}�?���{}��������2J����k����y����4p�xa3z+t�����Y��>������.4Nr�`�CF��Yu_<�SS!�\�4��p�!�W��rQ��Ig��p3�y���Ƿ��ǟ>�+�^,�8+~�j1����ycN�i�h��{֥.�*�)S�k�E�Rz������)��>�;�˲�^m�Q2ko���ҊZ��.��/�h��vʠ)[\9f$�G���c��[��w��F��m��W���Q
���f���5�L��2%�z���h�"��N�R4&��y.\�����8G#�h-�Ƅ4����m)�n���x1rU����VڨG�gMW�3��~xq�%�Gu(�W��XKW�z$T�]��g�R���@u��^TR��
S8�,����v�\N{�[�:���@�S:{�"V 
��%���H#�˧�3H����U�aـ�3�3�]��z��ᘽ��lQ vWy)��#a5��7)�i��,�����+Gpj�3�E�t��Ny)#��Ͱ��uS���e/x���mM�=(�Ͽٯ�ҧ��i}nXw�O�3�N��g�cE6��c�"��y\�xV�Ǖ�����j�.�:*ȹ�S%���o3�cv:G��[x�,}�zۏ�	Br�)س�;&Ʈd�#��������y����=Q*K�߻:/x�����~�D$Ʊ�j�#��@��晚GG*��wj��h�q��%S��S��=zLo�d2�i)	Fl�A	��.<�u��v������{���?��'�|߿��Ѩ{J��%�Vp5���h;Ne*2��ljf5��H����w�x����O�z�0'[|�"��D��L�)a�*�[Jw� o�c˭��%��͆v�|��z�^����c��W��^��� )M/s�m�l!7����UG����;�*6�=�D
,&�����T�W���[�eSK��^S#J��흒���
{��/:�U؇�����X�O��*�K�:')k�c��i}j��
{�[݃=��>���{���bU�8E�{�`0~�;`	�7u@߫V��qq����B���)�4�H�=�G&�bP�k7��VC���ރ�E+�,Q���&��p���ړ����Oc\w��a;p�w6"�1��|�aA�k#mj5��P�������`�KNg��޾�ܱ��'<�6ۧ��9�R��Hѭ�[��m
~��J���2��݁n�u�s/g�mBU��D�mg�� �c�W@��W؀x��T�ET�	��-�����J:b�h�L'�	�6������p1�]�ƔփU5E�T�V�E�^K��WNz\�vN���i睪�V�44-PHL�K(�j�ZZ��]� ���MK)r�c9pe��N�n��o����.z��y$�^�vb=�:��)x�����U����˲
�_i#����CE���;�@˪s(BR�̂[�2�f�$�7ᚳ^ß� (�+���i�%�{�6�]}����~,y�!�߸S�)/}`u13K��T��b0w?J�x�j�k�|�G�*֚v��h��87��������v�W)��z��TJ�ðU���(:� �j k�'ҽD�󻟏E4}���oq�vt�kzj*��l���j��,ռ�'x��u�^v�K+
Z���DV
�,    zk p�d������NGq@�X�P���Jf`����9�U�Ի�'�R��������B�t�g�ݥ���+�e}�H�QK�9/�X	���i�9k������wҌ���:i��$���h�N��%��b���jx�Fk;kYs�:{T�_'�o_���f�ܺ8ylu~�&Vc`5��a��w��7 3zI+b퓮�.��O�^v�qz! � ڹ�\jp�.L�������9j�<y�M�8�d�Ub��k߼���3#}͟�_�#�Kwfxhu�ݳ�U^�E4����%d�s}ɟY��@�����`�^�a�6QP_��BLx�5���w��'Յ?��S�h��`��W ESzT���v�Ʈ<�W�A\�3����yN��3M��F�1�L�[[��9=ڕ���j�큩�n,
���ϊ�q[j�K�z��^��}k��l��1w�(��D�]�Y�r����O��h�������W^����Da���I���,kк��n�bU�힠y��.;��,�@=����NS+t�M����� @n�p�A�g�� ��jU�/����߽�t��$wJ�=_���w����"8b���?Z	0�K3*⿔ZD��ݲّjU6��؛C?<.#�=g��2B���J--+ޘ��8�![㬩���7~*�����磙.G�7ĻŅw��)�c�I���w�w� ����5��O<gG�P���|b"�l|�m&U�m� ��嬤7�!ޤ:cO�WEYf@
+���w��o��?}>��w�>�>�;��Q��.$�Lia���]˔U�'m�&W��	O�YG�ϗ�w��1f�M�)���JT
��:S"�л�=+Ѷ�E���p�8��nV��ݧ����_~:R�֧f�3����E���dwx���BC��%�ѯ ��?�u�u�y�[*'��l	p*X�)٦�AM�����:r$��ъ�d�e�K�~OU�����?�w�ܨ����K�����m݇V�_IY��|����xlxݮ�_�j���}8��e��5뇪-rxmViŐ��RRLn��nйXJSS�)++/uIR�z�������̞]��1�u�U�4 gU��Su����L�e�Ot��c�y�3+�#	���N�#�cT��b�t��s���m'b^��)�s�W��ۉ��`�>�,|�ʆ����.�"P�xKJ:$�����W�L!���}����wrd�N8ŴE2���$h <���f�=L��G��C	T�U���fa��?|��7y���~>�5>����9���
�ycr5`"����b�Wf� �8!��d��w�MT�!>tO�(�L��a�(z.�F��b����R,���n;���?��ӑ�\��1�[����NU�J]�Ή	I�u����wp�dx�?4�e����4FlC,�w���F��׻�.����F:�@4V۷�D5> "�� x��d`��S�����{{6�oq^�7nZ�a �<fV��[/9�Ie|B>��M;�Pf|�Z�20�D]E����,������=+Sx��h/���o���;u��)��U����b�GvN0�Z9�R��n$����bcx�K�kݯ:�i\��S��8-V��K�B�f�Sp}�;cM�ݫ�V3_D�&]cW���wƿ9Ƨ�p��O��b���y��e]6ܶoJw�G)��<��J,��'4�ܕ���S5�&t���Ep��{0fp����)M	C��yi�b�J�R�	9�M��{nPTb�_���չ|JϝSXJB��&w_��Ģ�b�\�`	V��˟r�r0�ez����q�X����jMc�"U�[��%�sj�SY�E���- �Y�ĳ�n�Y�����Tz���7���R�vp�{ż���;�x����&��&Y�LM��A����+�)�}P�6��C�
X.� ��8�=d-^LD���:풩T9��y�, Eb�%/9'�o��������~���S>��vQ���Ͻu!�,[Qq4YXk�d�*	/\��+F�gf�Lv�yGc�];kE%'<�nEQN��[�C��vYk�L�Em���$D�b��|Uo�D�6���=�*��8lGL��չ�Z�O �*�������`2��&�Z���L<��w���r__��Ա`X�W�.���,>!xZ�k�0cA��T�˦Z3����9������ϘNVI�wlr�ꢈ�6_�h ����7�X�kYI�j��U��k�;�@_uM��X<��$bSY� ��LS�J�Cٴ�AU6��fau\M�>�.}�\�K��J��ݫ�;W�9�^|�&��b�xO�����j�I�֧L?Sc��"��N��u��7�a��W]	�Q�u��8�8|4eT�
��Z�QDd����5����ӧw?���w?���8�������Vs�Ui�)�B�RZ1�.A`.3�:�I����=*���)VZ�p�������k/���r	mL0dxӌwM�L�aU�J�I�z�vr�|�����8h�e��޿������=���W繏T��%I]��M��H����K��D�������;%�aD�=8�H�"�Ѐ�ؤ�v@��9�6Ãr�p��j��1o��*~��w���<ݝ0����;W�8�R*����g�Ճc����8�MQ�=A��9З�wZ���j��ϴ�s���"��8Z�t�]^���������o	���o�����z�_�������c��Rڙ�~�ꂤq���C��Z�����K���~L���x�e�L#���KM��F�%�6���4��,,aZPQ޶(V2��_8'X����?~��s�ǿ}����)|s�Leo˴=������l�d����(,��]W�J9��`�=_v�m�4�Y���%�:A�{5(%�k���Ϋ���˴�'��;��3��m�e*&�fi�����j?�:��ƙ�q�"���e�j��T���jX�{��a&�����#���7�87eRk'+,�?OW/�S�5G��s�7gVN�v,V���!�'����t�y�B�����W���L�aTuҎ�o��Y为1F�J7f��w̖r��x8D��Z8���R�5�u]j͢m�j��U�>�	�Roi�B�B�������ʁ���n%ǽ�A�k���٤fZ|n��3�t��}�9��V��;�1�� uŠn���W��_��,�v�N�o�XgH�RP0|��,�7å�輌��������VR߅@R�#�����*X�N8����R��|xo��c��w���U�32�n_;��;mF�Ůz�b�>9�>^�t�ԩy�� h�F�`)�>�KV�b�����޾��j<����*sx�E�/�s��܄޳� pJ�ِ��d���L�+j�4�D�u�i��%'�YH��o��;� "s��T0n�V���9�� ���;�f��s�Χ�>� =O�q������5���{�)��j&�ݧ�Bă�U��P���I_v�����$Y��_��<s̢�c#&�(��lЄ�^��_��f�y���]�D�w����|)���;�u�9Ψ�M��Eg�x1����U[�}�f���{��h	�h���(�c��M�(�J�&��F�� PZ�^FPv6e_��c<����qU�a�b�q��1,��_�`���y�l�n�A�}cAA���rp��X��_[ʈ����1�U��w�M��#��4g�X�2M�!`x��c�Ұl��� ��PN���3@��
�����6�#>�O?�ψg��݁v �
�N��I�wu�C����]�Zkll�y͞*����9��p�G8��mU�+�"� *f�\���X�檌�Z���� m` �0��*z����.	�������Ld�'����^a޻:WU��ɏ �̓xѧ���loQv=KG>S3��X��w��mMK�{>!j+r|p*;��Ջ65�P����=�ڊ�x!����t�w������݇�߾?���p2^�Ol����yr�xاw]���|g�D�>    H�\U����W��s�yo�)e����!+ #��Q;�ӝ���Hi:e�~1��΃"y6��$�"�s/e�����o�q����?~��|�����a,/aɿ1�U'�挸Z���k�k�^f���cP�	_��c7u������KL�>�����;�lk�5����a�(6ZQ}���x-g��/Z������S��MS��,���q`�-����7��+��4��
�`�L�c�g��5�QXGkr9�Gq8���,��2\����g�v�8*ܹ�W�/M�C�l�A~���(BbBDU�OM����x�+Gw;��}�� ;l���^��Çwlqy��w�1!p�ٝ;��W�(�Y@-B Rk��*5[��4�EV�Ϳv��5��w��u�
Y,}��&���d�I�[���R6�V{���d�V-�����a��n���/�(�1��R�8d���.�\O�@(���%hYZ�i�b��{�������]b�s����lt�T)�O���&_�1uup]�|23�(�i�݁�cH���ٷ?�-�����_��îMγ�;���W����.�����c�p�C��R�������<��V���Ǵ�q:9�����(p��LH�S3p���Uuֳ�nU�
�crn����7����N����~�ӧ�>�饶�K08�v�v�_�_�U�C̽�RιF���e"c���F�U2�?�1&���	(A�6��>�Ȝ��Z�.���s�Δs����Q�6�L�L�^y`�b���w?����zx����n����չX_�6'5��F�Qzc�!0[62�¯tg}�yG�-��|��q�bȠ| ?v�N&3%K���50�8�V*X��� �!nu]���x'�9{�[�ӷ�Ԙ.��¶��8!#KehV�x'e����<�rׇع	�Rf_�pm���M��R>��;��}w�x�r��.��H��]�EGK�����;G#]� �]P�k��;�^�����D���$@��*ǱG�9���s�e��)�H^[H��>��1�׭w�[_)#̟��t%4؈	�Ѝ��:��C�x3l�y�y�&gU�j����N��,��y��N�C�cc���еF��C�`V��Ӂ�,����]~=j�h��u��c#��k��HQMŤ
s�T0v��JE�֚��
n�R�1�'	clV&xξz@�����ȓ�6�mc=�:����مb�l���:�\�z����\��xO�4��i睒�T�#��)�3��� ���'b��*��,������D���p�Mof������۳�|����� �ݽ�v/NҼ��t ��p��Ϋ�K�Z6����y>��i[/�V�.�_��^����w�g�I\���F���96\��X��Ӛ��4�Xg\����ZJ�D0eu��#�v��琪o����NV�t��΋�S@϶�:,R�3lҶ��-����򵵡�����as�y���FMZ?x�$S�+�&���Tm=�B��R0TW:p����}mA7�8wo���7GO�-����<����)h �]�57P;
"D%Wj�����O>x�g���t��hb<�䤁OUqT�m&��s��X�@hY�/�-1)|6�Ս�>��W�{^NFx�Bx�]e�]�W�;�kax'5�|ۦBA��!�V=P�����X�<�A��u��-���MTn�(�3m�P�2�ᴞ��u1I%08|�z�%- ���j]��� �-D�n0��g{tu���!X�R�EU(�\eՠ�*����":��a��Q�Ӵ�� L�FV�6��XH�"�G�_|�R\�4lh��M/¨��.Z-�S�r}K ���֬:��
��|��D{lqn�o�G��"�bz���S^�� �JP���藺�ϰ��<�Xx'�`JD��E��vOe��/�8�k0dj]!2yJ��E�e�RE�\CRm�DnZ���:x�i�V��b�m�`-��o922? <o��V���񇞉'c��q��3��T�3�sʼ=^��jet�2N����R��8Q2S�/g	x
|zd�r�^o܋N�ڹ}q`���KҖE���i���v~_��Hp tL���d�p��KrZ�-�����|�M�T��MN]�s�'��H��Y%DDp
yj��Z�/ʱ���㗒�:�JK�D���q��y�Wa<�:R�}����r�?T�z���9�_%�^�(��L��!�Dj$���QᏅs�
]�ۧj�t�J���N"��:b��x,x;���0n� ��[�o��'��n��չ?ħ�#�j� � `)T0������
����;�=q�y�^PD���f#�Pˢ�ыSY׫�
�pe�2�R�O��-�>e��t���a�I��������9�F��P|��E�K�8a�Y��Yr�;��[L-.H�,*F'�P�dJ�^摼���72�L�Jo���V�wc��J�� �x�L��Kv���e�4ȥzf�c��i睻�L�4Ig��u��x��]b��ڃ�(jU�����E��I�;kt��7��}3S����߶R�M��1F���>���}�9��B�Һ{<�p��^�E<�!�U��+�,�Gޅ�3�M����
 Dћ��v1(�S�c\˔�-g#%�H��zHqpBk:�`�.��u�t�a���C��+��\�$��M:%�W�ö�[Q1��ܐ�Κ9��8���q�"qyו�\g Y8��P���1EL�wҀy�ʑ!�E��-K�6�d�p�WgM��������_�睺�٭����r<���NP��-�j,���0Q��k�<�>E�6�s�����I��}�F}�C��U�v��J��I���l
j�^:�x\�M�H��˝��̶9�_�.F���Z2"v�Ͱ"��:��`ˑ3`�g������>���+9Ӫ$ù�LT|�9)'����}a5?"��^,��u���h��Xf+�q`��8�J×���zhu~=9�Ԉ�:e��|�#�������QT�Ϥe/֋G���3�� WĤp;5-�7R�'ߟ���X��`��5_�(D�(�|�������;@!�cq8�։zhu��S������bja�ZM![���DI���TR�3ߗ�ع:�^$FQa8K˖&�E��J&�)��K�	�_ r���"�9�#�>��i�M���YQ��1nm�����7+�����X�`�'g&�3b[4x��a��� #�j����l3>�ü��$�U�s,me/�UT�@֎�����n8�p����p�. k�޾�M������^����}���G��c�)�/|[�7���`�%�u<�>w��H���+�}zn�s�W]��ݱ�����U���8=p�^1u����[�8�Ne�e;����_{��7n���%vR��,�d���F���չ�t��և��� g�N0����yU���Oidzy�N}�z�lySd�*�I�~j� K�k�d�z+�������*�-)���J�ފ��@�`{�{~{�
Ga#A�"�<܅ѫn���Λ<�,g�L��!�lZ��.�*`��4w5X<ڹ�'j���rg9ު��C�U]	N^��8�.*a��	ѓU�����l�	?v�6����I�Uaƣ�s�\��p�v�M8k��f$24���*S�u��Sr ��L�g�S����g���4NY�_B�@XW���L��`��<l&3�Em�b����������zx��Q���|�\�ux"���,O�F��<B� 1I����G�v޹�4�܋E�茈D�����eH���\�bD�>L$p8zP)3WF��0��u�6���6�o��m���*N=�:'����V�\P�P��C����:b�x��ԯ|k������g��W]b��m�%��+m����a*I�n�pޙ��a~�3�4�*%G�L_*��6�GFs�I�:���c���‟�)%�H��6��/ע"sYϭ����-��[���_�a�Lzx�"rq�;+���>"8[�zMs+L�����D�Q�    ��#@J�YËޞ��cõ����o�;q��n<�:����8�j -F7���1�,���[�UTO�J{y�}�]w�)sNא��g���I䬊N�ƨ=]��Ue��l�B�2�N�*}�!|�
��I�#^R���k��_���XQ8�͇�:����TїN�e�Q�u~ra����b��{�ݠ����,�d���>�"F�j4��(�U����)QV?�b@+MY���͂���������3?��������õ��F�g۴W�$��T��X�I�5��U�®k���+>tmU��-�X��$�� ^st�݃�����\� ć!3O��[�դF{��8�6όsw\�^�aRF�S�P�Q��>�EW�U*��8ga+��3G��H�6q�1���Ӹ��y��4>laɇV�s��F�Cϵ�=����A�b�[��]���
x�Hk���mgU�^Ѵ� ��A�.��ԧ4�	q�s�D�������Hx
�)yȆVs �YWw?�:�v�4e�N�G�&z𠳪bإTq��9W�/�yP�3��SV�cj����DJQ�4���>є�UaZ%��َKA��L�[��*U����g��e���V���#�s��np�?*�]���̀�Y�?P��"�S�n��ϰ7�X�JX&A2<�K,.�N�؁�5_S��HS��sd�����
�Sn%Z�֭��˝Í�M���O��4h���D9%�j7@�c���
y�d���K��1 ��m]Ț���44>�Ae�y���J}��(R-Zt�?���BP�\�8;�� @sq"Fk��U�/0�?i���m�ܿ:��1 �E	��R#}dmr�T[�*�vOi�}y�����{�I���$H>V�H�#���ЙZ��m��G�K������2Ӷnvm�s%���gv��Y����L�}�g����Z-]���൜ u�qy��y�	���!ڴ�A6F�lqxx�|;3'�-в��֓�k�v�)��<H9����ƶ�+����E�>�mn���V�����u��.�f�s#;�I�s���@�lRwy�����gر�=��=)�E�^���v�*�^3�zGYĿ�9hC},X��k���j�ǭ��):�����չ��R��No�C�6��6$��U�(.�g��L�s��q�gة�T�}�@���ť��7��rz`	��nj��!��ۮ�(�4��H��(�N�t�d���4�y��	�n��[�Ƿʞ���3��
l��p���u{�iu����3T�ޯT�b'yټ��!-�`��,���5��t��>~*�AE�Z�P?�l42��;�u�����'��e��/X]�۔!UPEj����a"�������~N_����:0��wh�P�&���?�Q8��4�ҫ|&�,�e�;S�G�ZYGj�w�]3v�nU7�����6\�u��Z酃�b�x�YD8�7�5g��e����=h�k�r�2��w�<��û*X�˼�H�\��E0�S5W�Ǯv֙����px
�����9����I)������Γ�.��'9�ʕbeP�op�aX�Π�J����J)��w��R*'X�Z��?+�U1�0����)���r���P�R��Ҝ�n�P�܏�����A�2Y�qw���6�jCɶ�6\��TF��S�~yy��s�2�<�>ٻ�������8]�υ J,���Q��Zu�vT�y�j�s��PNO�c��vI�f=칎+��Q��������͡���l�Ꚃ?����C[�!�\��3�/���b��F���;���K�GΠ�����	Y�VZ%�re�`��@1�[���
GVF�I�%u�S���sL�q.�G�s�gtC�Jn��y�s�P-k�A��l�䀠6��GG�Y��3?�<O/m<���~w�(5|��{z���s6��ĩjR�,��Q⫑��/��j�J�S�ě(�tq#�F)�0��=�}��T>>;6-/�q��*����\K���6�(��3�e��{P�R���F��u�k8��c�c���{�=���DY�N8Lm4F3Ag9���3�b�=�V�yD��샢��䴕��q6땯� �2���^9X�)`��Z�=&_����c]� P:��˛�s亮[���\�tp{�:e6����&���]s��K�U���Olގ`�%�Ä����P�-���|y|�N�I-�\�TAT̳.����.��Y*�%>@HEx		n�{���y��B�O�!�|��4m�S̥ZTQu��%g�s0�uµ>Zo��6�"��os�S+��͠D|8SC�b���N��Al����o��&w�
,��m��s�gb&���΀�	�18sAVi���2>�D�Kb�AǴ��`8f��P�*YϺ�#�$M�m:_�x�'�s��a�FMU��Y��L~	O�_��F�Ջ�V�_�:G~�	Nf��YђtY�6�U��.3X6����
_y�R�g�A&Uŉ\��np~8L��7d�le�2#�w%:���TV�C�Lㆠ��f���R ʹ��k����R&�w�dk�`�vY���I��ʟl4�������gع�;/��R��e,���BJ0Dqj�����yZ�(��
�1�V��#�F�r��;���*W���<��\��%��U��i�ڹ��'�ҧP�eZMz����<�N�
�c��q�V�*��b��R9��L�|�<XV��g�v�����}���R�#��G�=�eB�f�?�:7a��%�/����^U���2�kq��ޮ.�^o��\w�)f-��h1Xf�E2PB
����~è|S�E��F��{�V���8>�AxΥ��8�I�B�8���B���\��	G1�Z��S��+�����N�8�a��w�ZsoV����w�Ԋ�j�58dhW��fF4��}��FxJ�E ��6���g@� ��e=�ës��c�p.�(0�V���OrD� �AI��f��c��;C�*�XN����y�
>��h�L���F+U� �VtAP�4����an�YA���xr֦-����K������;<��`6�@�23H9��Y�LJ�v���j�����:x����FM���N9]x�h��B�^�q����U��5h��������Ӻ���Յd]��6��b�~���q���Sn-/�y�8��
���<���7�TghC�� ��0]����zJ�Rݑ��j ��Ѡ�V��i����q/Ӥ#��������W����-�����p�x�=�L�Y�>�G�$��xă�;o���#r���L�S�2gD������d��Ad�&��$��cHz���>{y&}�$%���~�FrpJ4�������K��p���x/��R1K��Sm��Ō: �'H^����p�~/�`u=@�|� *��FQT�,����ҍ1Ֆ��V��� _�#@:����⣯P��6ۆ�c��
�w�����L�W�-�+�chl	j�0^ƻ�����c��n\w�� ��s��H�f���R,�?���my��׍#��0�r<�ja�����f���:[�ר7ҟ�p�:6��şe.�l=�����jI�c�p�ͪ����?��<򮥦gرT��'�#�!����ܗ��nͩ�M;B+�z�hՒp#J��<���I!=��5��줖~�	�տS}$>�AԱ>|](J�`.�t�f�')�X�	�7_��C4��!�3�_��|I,δ�-�K�~|�e���@r��ί����6J��h�q�0�t��M���j��3N��4��!���cȪR�^fj����5����3�+�[��r8w� ����I.�?�>v���T�5[1��9��]ꑇ�^!uM�ZW�|Z�[G��b�����&P\w޹.�j|��6wĶ�C%B�@����CT�Tf��V��	g�*E�Nf�H�߆��-�0�U °�����iٌ9��{\6��J`/R"�2*�4%��Ja�t�N6@KJ�s�ܤjN(���*�z0���s�u�~#	���<�ϣ�(�    &�f\O�y4��+�o��������������u���,��H}Xab��&p����"�h�`75�')[H�IJov��C9������}y39�6���W�/J��{R���D�4�t3>��m�O<|G5k��w:�)�U��ػ�3'��*���T2��$��˨`�"4��'��� g���=�>|�{+�`L�F�������V�s�-ń���*E_�h����ny�Ba��?�/��c��i�4}5ގ!��)^��L��#�A&V�b��&ts�߃(T;�����s���������7������aT
r�"���y^�Gb��辫�@��^�����BB��'�L߰״��-��� qp��R�e��4ԭwuR*`"���QR�<eGdiݧ���[���%l�9C~��x_��g/�"6~v�4qZ��(�M�b>��E6�Q,k���ԳCR'��w��%��u��e���f�"P��PwqE��uB�FH�Q��- -[%�LN��î�I��·�%P��,���|Z��0]F�nZ	+p��E�.�|���a�R�S�)Q:�:�w���~H�Z�_�x܈p��Ͱ��J���p�L	��샩���qv@�L�Qظe~lun�1��%%���f|���w���W��s.��3��1���NK���`��{��`���.��/Sy�߁˱B���~���%��{F������x�b����׽��f��;4���X�.2���e�A�y�[�C튕*�!�㽧�y WX��ۃ�E��E�p���x�������Xb霎��+�
����9��r8�G�|��Aִ���5��[1�3y�ùM# �E�f�ܜ�Pf@��#8�@;)J�a7/���V?����V����7Zk7�w[����DZ��d�`���T�jo�㸗R��+����{e�&UC�@��g���bT�Vq*��]�&�P�Ơ�#�(�գ�k������w�s�������'6G a.N�Ës9
�L�y:���Y��K�|Yj�-*U�F�����u>םw�A�ܮ*b����]\��6'5�N)]U�E�J	�.Y�^���i�v���Sw�>�''(�!'x����Ѝ�vx���Q)JT�Ia��:	��@��\�4BR� (����@��1��J�=�{������d #.�����~��9�������g9PtT)8��yY@�� ��	b�$6���?��a��̖�v�c(���p2��3Z���T�1���$m�c�Bor�^�@z�!�c�8����aG�Bώ@�C�	���;&��Zd[�q���ci��uKy�~�0X�� �Ѡg��J�ց�������<^kσ`u���
��N~����Ĵ��x��wy̽����;hSEY����O(4�V��lѭ!��+H	��7M6��
wF���--ͺ�^�}�m~]�<1�`��bXĪt�݂͟�g6h���X@u�-e���׆]����z���a����M�̹�Z�N��Z��)됛�ѹT�Y=�Oܙ�=Ԫ �sv��­�E�S���G���<[�����_]��E�c�Il��1�d��e�ע0�����k�MF;�
��7u���Q��$6�B�ֲ2��a��l"�t#'��%SgP�*E>�ݨv=8i͜Rtq�N=Yũ��F��1\��<'�_B���.��ύ��k0�JK���m��E�;�A������*/����%�ދ
*NW�=K9z�B__J`���b��{��(+:���i��~1�;�w�D�a��V��(� ��S*�TB2�W!�[Oհ��xb���x�����;��q�/H0��XZ�*�K�86��܆���<h�+�;9�-3��":�m�5�����7̹�398�d��-���꜖#<��+�`��Ҵ��͵ey9���	=/&�G�ם�r(]��,t�g�L0bW�'��'�U&���3@	H�� ���p%�����[��Gan�n9L��&��i8�s ���7>�@r)���VҐ6����g�����3�Pr|��*P��#��*�N�ײ������Ƶ���ehQ�Qz;rߺ���<�q�n��y�S�:z��ԦB��t��ltY����|���d����3�ύ&��($�8O;ドN��
 ��@u϶�!EO,<�T���	�s�Hv�;��>g���;W���:#�`��J��@�,�ߪ�6&��g�I�'�MϰӶzk
.б}����5K24�(�P��!	*Q8?�bU�r�=����\��y܌��*R�j�N�C�s�,
ꕎ訽�,α�"���<|��͔˓"``��~6����k�̈́���{
�h�����.Mٰ�G�����Z'e��@�S���#����6��uo���V���0_�N��R�m�J��2z٘�3S'K͙�v�)G�2�4�B�̛�(��j�ja*��m���Y��2m4A�7�B�Ęm�}A����@My��V��&磩֚�],"������f�t��z���4.L;���p��󬃷q8��)uն�z��E↧(���q"��F�a�p��Z����~���l��N #-��ë�K/�!,Q� �*'Ͱdݵ���Q^�����yyNu��z�z��6K�������AS�K�`����@����XO�A�5B�
��d�I����@�����S�Iv���������8��,���G3���=@��V>#�ry��dʗ��.d��vf���記܀���!�P��r [8?D*	�����8I*� 9�z�[���F����Y �΄e��N��)�$�m����[�gx�j�X
�8U{u�f�8�n)H�Ff��!��H.;�$)��-WD�A!����%Q	�v9L�S��2K�);#�p�ֿ�҄��p^W�7�N�OnND]-�W������8oT���b��r��ZG��3 ��9�c�[�W�b�za�n8<�C�r������e�d�I�xR#Ĭ��������[��m 18�Y������&w�Ә�Bd����؜�ž�.�YJ?A�������;ڐ��H����3sv ��*j��z����P�%��e�E�[�2Rn_��/��V.��iD}�wy}�꜉9iA?�=�U�7T8� <t�K���|}�x���u��%٤[�p��2|s":S�H��*����E��(p���n5�(Ufn+��7ܷ����xǻ2"*q ]i�[z�GW�cT��]�9&ﳭ���Z�!5�-0�W��͈|y佋��vN^Y����K�@��Qq�W���uj�*9����a��� :�GO�4�y*�Q�fV�cW`��չ|d����o�kk$��2��5PJ��o>s�I��;�W~UV+�c��5ȞS�Z-��Z�؏w�8�U�B^v��%��P�l�5�.�=0��$���ı����W���(��!�֣�\��zS#�a�pc���������1����;��ʊsVF�M΍ǈf	�N4���t������y��I��En#�ߤ�d����<���~�����������t�#F���`m��4�ea�ë����q�>�����)B� �B���)�fX�>|�)��G�u�gع�6��j+`J��nC��'�&]��:�9�˚jZf�A��@��a������f���ל�\������a���Ye�E6w-��ë	���vY�F�ܰ��ъ�շ[����� �k��cT%L;� �SR1	-��;�L,�b�W!#�M���f��8�846�����ˢT
���3�gl!�����{�"��V��?ʂ'v��Q��p�����`�Ց��'��u�]�]O;�T$�xx:��#m��^	t�Y��9yAP�T�E�SR�d�����v����dmf�./�9��%��γ�<3����q
*�ճ��D��sh��3"��9�8���N����7�ǢE��R�e?N׀S��i ,���U6[��ui[e��)9����b��<��G8�IP6,W��n9cW��������"g6�=��dR&ji^�ls��"��S! z  ��p0W����]�iH�D*Գ�.d��d8����s��%��N�f^X|b��"���I�����W��o����J~o�����o�����,��e#�/X]ԅdY}9�~�'�L#�,ghz��\	�+��O��g>(�>�N"�k7�c��	ѫ�\���d�� ��i5pH���|8�� p�HnZ�ԇ��<�����ڲ��sM"?�Np�$�c���4r9A-��?�R���}Sםw
t��.��և�3����� �]�r���{�+5����k���ES1������������\�Wٵ>j�Q�G��/���zn�e^9��>˛Fή=*'���T�r���[���X�(y0K"3��[��5Sw���i�@M�9Yk2���v'��t�w�΄Sd��X])�R����lm�~�j���ג��O3����u��7�4Y�Ԩ��y[�xoV\I��v������Xӑ�`D�)����|�B�Cs�B�NOl�75��+���#���y����-��Q%��S�B��fu��Phz9��#��S���h��g"&s��v0�\�%Z����d��֌���QxJv�Z������`&�.Fr8�֑zhu~���B���E؂��0�n�[e���X	"��_� Yr �8Z�*�����(� ��K�DdӥNP&�) I8�*G�9�r"K��U��#l����x���Oy��O�$%D�	z�	�U'6ָc-vQB�Sk�uY�sc<���"#��ˉ�<��) ��S����{��n��"[���J	�>�R5�\��1�ç����[���7�Z#���*�U>�*�ӨU�������4�/+W7~v��7E2�������M�-����^�b�S8�˧8����;>D:�"�H�=BS`i]�V��+&B�h[�Y��Q���o�nUvp�@x�x2�ڢ�4�ѧpBW�럝WWeiC�y����������b��l�3\�f��)(םw�c�)�iQ�b�uo�]�G8E���ɒ�Y:�kˁ)lM�I�(��G�J�\-���I0'-�Z^g^>m�I�ŏ�yc��cԦ=�n2�a���S�X�!�{���o��;ե��o �P�;���
�*�a�T���������\�      u      x������ � �      v      x������ � �      �      x������ � �     