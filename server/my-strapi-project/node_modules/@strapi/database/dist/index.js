"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const semver = require("semver");
const path = require("path");
const fse = require("fs-extra");
const createDebug = require("debug");
const _ = require("lodash/fp");
const crypto = require("crypto");
const utils = require("@strapi/utils");
const dateFns = require("date-fns");
const KnexBuilder = require("knex/lib/query/querybuilder");
const KnexRaw = require("knex/lib/raw");
const stream = require("stream");
const node_async_hooks = require("node:async_hooks");
const _$1 = require("lodash");
const path$1 = require("node:path");
const umzug = require("umzug");
const assert = require("assert");
const knex = require("knex");
const SqliteClient = require("knex/lib/dialects/sqlite3/index");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const semver__default = /* @__PURE__ */ _interopDefault(semver);
const path__default = /* @__PURE__ */ _interopDefault(path);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const createDebug__default = /* @__PURE__ */ _interopDefault(createDebug);
const ___default = /* @__PURE__ */ _interopDefault(_);
const crypto__default = /* @__PURE__ */ _interopDefault(crypto);
const dateFns__namespace = /* @__PURE__ */ _interopNamespace(dateFns);
const KnexBuilder__default = /* @__PURE__ */ _interopDefault(KnexBuilder);
const KnexRaw__default = /* @__PURE__ */ _interopDefault(KnexRaw);
const ___default$1 = /* @__PURE__ */ _interopDefault(_$1);
const path__default$1 = /* @__PURE__ */ _interopDefault(path$1);
const knex__default = /* @__PURE__ */ _interopDefault(knex);
const SqliteClient__default = /* @__PURE__ */ _interopDefault(SqliteClient);
class Dialect {
  db;
  schemaInspector = {};
  client;
  constructor(db, client) {
    this.db = db;
    this.client = client;
  }
  configure() {
  }
  initialize() {
  }
  getSqlType(type) {
    return type;
  }
  canAlterConstraints() {
    return true;
  }
  usesForeignKeys() {
    return false;
  }
  useReturning() {
    return false;
  }
  supportsUnsigned() {
    return false;
  }
  supportsWindowFunctions() {
    return true;
  }
  supportsOperator() {
    return true;
  }
  async startSchemaUpdate() {
  }
  async endSchemaUpdate() {
  }
  transformErrors(error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.message);
  }
  canAddIncrements() {
    return true;
  }
}
class DatabaseError extends Error {
  details;
  constructor(message = "A database error occured", details = {}) {
    super();
    this.name = "DatabaseError";
    this.message = message;
    this.details = details;
  }
}
class NotNullError extends DatabaseError {
  constructor({ column = "" } = {}) {
    super(`Not null constraint violation${column ? ` on column ${column}` : ""}.`);
    this.name = "NotNullError";
    this.details = { column };
    this.stack = "";
  }
}
class InvalidTimeError extends DatabaseError {
  constructor(message = "Invalid time format, expected HH:mm:ss.SSS") {
    super(message);
    this.name = "InvalidTimeFormat";
  }
}
class InvalidDateError extends DatabaseError {
  constructor(message = "Invalid date format, expected YYYY-MM-DD") {
    super(message);
    this.name = "InvalidDateFormat";
  }
}
class InvalidDateTimeError extends DatabaseError {
  constructor(message = "Invalid relation format") {
    super(message);
    this.name = "InvalidDatetimeFormat";
  }
}
class InvalidRelationError extends DatabaseError {
  constructor(message = "Invalid relation format") {
    super(message);
    this.name = "InvalidRelationFormat";
  }
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DatabaseError,
  InvalidDateError,
  InvalidDateTimeError,
  InvalidRelationError,
  InvalidTimeError,
  NotNullError
}, Symbol.toStringTag, { value: "Module" }));
const SQL_QUERIES$3 = {
  TABLE_LIST: (
    /* sql */
    `
    SELECT *
    FROM information_schema.tables
    WHERE
      table_schema = ?
      AND table_type = 'BASE TABLE'
      AND table_name != 'geometry_columns'
      AND table_name != 'spatial_ref_sys';
  `
  ),
  LIST_COLUMNS: (
    /* sql */
    `
    SELECT data_type, column_name, character_maximum_length, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_schema = ? AND table_name = ?;
  `
  ),
  INDEX_LIST: (
    /* sql */
    `
    SELECT
      ix.indexrelid,
      i.relname as index_name,
      a.attname as column_name,
      ix.indisunique as is_unique,
      ix.indisprimary as is_primary
    FROM
      pg_class t,
      pg_namespace s,
      pg_class i,
      pg_index ix,
      pg_attribute a
    WHERE
      t.oid = ix.indrelid
      AND i.oid = ix.indexrelid
      AND a.attrelid = t.oid
      AND a.attnum = ANY(ix.indkey)
      AND t.relkind = 'r'
      AND t.relnamespace = s.oid
      AND s.nspname = ?
      AND t.relname = ?;
  `
  ),
  FOREIGN_KEY_LIST: (
    /* sql */
    `
    SELECT
      tco."constraint_name" as constraint_name
    FROM information_schema.table_constraints tco
    WHERE
      tco.constraint_type = 'FOREIGN KEY'
      AND tco.constraint_schema = ?
      AND tco.table_name = ?
  `
  ),
  FOREIGN_KEY_REFERENCES: (
    /* sql */
    `
    SELECT
      kcu."constraint_name" as constraint_name,
      kcu."column_name" as column_name

    FROM information_schema.key_column_usage kcu
    WHERE kcu.constraint_name=ANY(?)
    AND kcu.table_schema = ?
    AND kcu.table_name = ?;
  `
  ),
  FOREIGN_KEY_REFERENCES_CONSTRAIN: (
    /* sql */
    `
  SELECT
  rco.update_rule as on_update,
  rco.delete_rule as on_delete,
  rco."unique_constraint_name" as unique_constraint_name
  FROM information_schema.referential_constraints rco
  WHERE rco.constraint_name=ANY(?)
  AND rco.constraint_schema = ?
`
  ),
  FOREIGN_KEY_REFERENCES_CONSTRAIN_RFERENCE: (
    /* sql */
    `
  SELECT
  rel_kcu."table_name" as foreign_table,
  rel_kcu."column_name" as fk_column_name
    FROM information_schema.key_column_usage rel_kcu
    WHERE rel_kcu.constraint_name=?
    AND rel_kcu.table_schema = ?
`
  )
};
const toStrapiType$2 = (column) => {
  const rootType = column.data_type.toLowerCase().match(/[^(), ]+/)?.[0];
  switch (rootType) {
    case "integer": {
      return { type: "integer" };
    }
    case "text": {
      return { type: "text", args: ["longtext"] };
    }
    case "boolean": {
      return { type: "boolean" };
    }
    case "character": {
      return { type: "string", args: [column.character_maximum_length] };
    }
    case "timestamp": {
      return { type: "datetime", args: [{ useTz: false, precision: 6 }] };
    }
    case "date": {
      return { type: "date" };
    }
    case "time": {
      return { type: "time", args: [{ precision: 3 }] };
    }
    case "numeric": {
      return { type: "decimal", args: [10, 2] };
    }
    case "real":
    case "double": {
      return { type: "double" };
    }
    case "bigint": {
      return { type: "bigInteger" };
    }
    case "jsonb": {
      return { type: "jsonb" };
    }
    default: {
      return { type: "specificType", args: [column.data_type] };
    }
  }
};
const getIndexType = (index2) => {
  if (index2.is_primary) {
    return "primary";
  }
  if (index2.is_unique) {
    return "unique";
  }
};
class PostgresqlSchemaInspector {
  db;
  constructor(db) {
    this.db = db;
  }
  async getSchema() {
    const schema = { tables: [] };
    const tables = await this.getTables();
    schema.tables = await Promise.all(
      tables.map(async (tableName) => {
        const columns = await this.getColumns(tableName);
        const indexes = await this.getIndexes(tableName);
        const foreignKeys = await this.getForeignKeys(tableName);
        return {
          name: tableName,
          columns,
          indexes,
          foreignKeys
        };
      })
    );
    return schema;
  }
  getDatabaseSchema() {
    return this.db.getSchemaName() || "public";
  }
  async getTables() {
    const { rows } = await this.db.connection.raw(SQL_QUERIES$3.TABLE_LIST, [
      this.getDatabaseSchema()
    ]);
    return rows.map((row) => row.table_name);
  }
  async getColumns(tableName) {
    const { rows } = await this.db.connection.raw(SQL_QUERIES$3.LIST_COLUMNS, [
      this.getDatabaseSchema(),
      tableName
    ]);
    return rows.map((row) => {
      const { type, args = [], ...rest } = toStrapiType$2(row);
      const defaultTo = row.column_default && row.column_default.includes("nextval(") ? null : row.column_default;
      return {
        type,
        args,
        defaultTo,
        name: row.column_name,
        notNullable: row.is_nullable === "NO",
        unsigned: false,
        ...rest
      };
    });
  }
  async getIndexes(tableName) {
    const { rows } = await this.db.connection.raw(SQL_QUERIES$3.INDEX_LIST, [
      this.getDatabaseSchema(),
      tableName
    ]);
    const ret = {};
    for (const index2 of rows) {
      if (index2.column_name === "id") {
        continue;
      }
      if (!ret[index2.indexrelid]) {
        ret[index2.indexrelid] = {
          columns: [index2.column_name],
          name: index2.index_name,
          type: getIndexType(index2)
        };
      } else {
        ret[index2.indexrelid].columns.push(index2.column_name);
      }
    }
    return Object.values(ret);
  }
  async getForeignKeys(tableName) {
    const { rows } = await this.db.connection.raw(
      SQL_QUERIES$3.FOREIGN_KEY_LIST,
      [this.getDatabaseSchema(), tableName]
    );
    const ret = {};
    for (const fk of rows) {
      ret[fk.constraint_name] = {
        name: fk.constraint_name,
        columns: [],
        referencedColumns: [],
        referencedTable: null,
        onUpdate: null,
        onDelete: null
      };
    }
    const constraintNames = Object.keys(ret);
    const dbSchema = this.getDatabaseSchema();
    if (constraintNames.length > 0) {
      const { rows: fkReferences } = await this.db.connection.raw(
        SQL_QUERIES$3.FOREIGN_KEY_REFERENCES,
        [[constraintNames], dbSchema, tableName]
      );
      for (const fkReference of fkReferences) {
        ret[fkReference.constraint_name].columns.push(fkReference.column_name);
        const { rows: fkReferencesConstraint } = await this.db.connection.raw(
          SQL_QUERIES$3.FOREIGN_KEY_REFERENCES_CONSTRAIN,
          [[fkReference.constraint_name], dbSchema]
        );
        for (const fkReferenceC of fkReferencesConstraint) {
          const { rows: fkReferencesConstraintReferece } = await this.db.connection.raw(
            SQL_QUERIES$3.FOREIGN_KEY_REFERENCES_CONSTRAIN_RFERENCE,
            [fkReferenceC.unique_constraint_name, dbSchema]
          );
          for (const fkReferenceConst of fkReferencesConstraintReferece) {
            ret[fkReference.constraint_name].referencedTable = fkReferenceConst.foreign_table;
            ret[fkReference.constraint_name].referencedColumns.push(
              fkReferenceConst.fk_column_name
            );
          }
          ret[fkReference.constraint_name].onUpdate = fkReferenceC.on_update.toUpperCase();
          ret[fkReference.constraint_name].onDelete = fkReferenceC.on_delete.toUpperCase();
        }
      }
    }
    return Object.values(ret);
  }
}
class PostgresDialect extends Dialect {
  schemaInspector;
  constructor(db) {
    super(db, "postgres");
    this.schemaInspector = new PostgresqlSchemaInspector(db);
  }
  useReturning() {
    return true;
  }
  async initialize() {
    this.db.connection.client.driver.types.setTypeParser(
      this.db.connection.client.driver.types.builtins.DATE,
      "text",
      (v) => v
    );
    this.db.connection.client.driver.types.setTypeParser(
      this.db.connection.client.driver.types.builtins.JSONB,
      "text",
      (v) => v
    );
    this.db.connection.client.driver.types.setTypeParser(
      this.db.connection.client.driver.types.builtins.NUMERIC,
      "text",
      parseFloat
    );
  }
  usesForeignKeys() {
    return true;
  }
  getSqlType(type) {
    switch (type) {
      case "timestamp": {
        return "datetime";
      }
      default: {
        return type;
      }
    }
  }
  transformErrors(error) {
    switch (error.code) {
      case "23502": {
        throw new NotNullError({
          column: "column" in error ? `${error.column}` : void 0
        });
      }
      default: {
        super.transformErrors(error);
      }
    }
  }
}
const SQL_QUERIES$2 = {
  TABLE_LIST: (
    /* sql */
    `
    SELECT
      t.table_name as table_name
    FROM information_schema.tables t
    WHERE table_type = 'BASE TABLE'
    AND table_schema = schema();
  `
  ),
  LIST_COLUMNS: (
    /* sql */
    `
    SELECT
      c.data_type as data_type,
      c.column_name as column_name,
      c.character_maximum_length as character_maximum_length,
      c.column_default as column_default,
      c.is_nullable as is_nullable,
      c.column_type as column_type,
      c.column_key as column_key
    FROM information_schema.columns c
    WHERE table_schema = database()
    AND table_name = ?;
  `
  ),
  INDEX_LIST: (
    /* sql */
    `
    show index from ??;
  `
  ),
  FOREIGN_KEY_LIST: (
    /* sql */
    `
    SELECT
      tc.constraint_name as constraint_name
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = database()
    AND tc.table_name = ?;
  `
  ),
  FOREIGN_KEY_REFERENCES: (
    /* sql */
    `
    SELECT
      kcu.constraint_name as constraint_name,
      kcu.column_name as column_name,
      kcu.referenced_table_name as referenced_table_name,
      kcu.referenced_column_name as referenced_column_name
    FROM information_schema.key_column_usage kcu
    WHERE kcu.constraint_name in (?)
    AND kcu.table_schema = database()
    AND kcu.table_name = ?;
  `
  ),
  FOREIGN_KEY_REFERENTIALS_CONSTRAINTS: (
    /* sql */
    `
    SELECT
      rc.constraint_name as constraint_name,
      rc.update_rule as on_update,
      rc.delete_rule as on_delete
    FROM information_schema.referential_constraints AS rc
    WHERE rc.constraint_name in (?)
    AND rc.constraint_schema = database()
    AND rc.table_name = ?;
  `
  )
};
const toStrapiType$1 = (column) => {
  const rootType = column.data_type.toLowerCase().match(/[^(), ]+/)?.[0];
  switch (rootType) {
    case "int": {
      if (column.column_key === "PRI") {
        return { type: "increments", args: [{ primary: true, primaryKey: true }], unsigned: false };
      }
      return { type: "integer" };
    }
    case "decimal": {
      return { type: "decimal", args: [10, 2] };
    }
    case "double": {
      return { type: "double" };
    }
    case "bigint": {
      return { type: "bigInteger" };
    }
    case "enum": {
      return { type: "string" };
    }
    case "tinyint": {
      return { type: "boolean" };
    }
    case "longtext": {
      return { type: "text", args: ["longtext"] };
    }
    case "varchar": {
      return { type: "string", args: [column.character_maximum_length] };
    }
    case "datetime": {
      return { type: "datetime", args: [{ useTz: false, precision: 6 }] };
    }
    case "date": {
      return { type: "date" };
    }
    case "time": {
      return { type: "time", args: [{ precision: 3 }] };
    }
    case "timestamp": {
      return { type: "timestamp", args: [{ useTz: false, precision: 6 }] };
    }
    case "json": {
      return { type: "jsonb" };
    }
    default: {
      return { type: "specificType", args: [column.data_type] };
    }
  }
};
class MysqlSchemaInspector {
  db;
  constructor(db) {
    this.db = db;
  }
  async getSchema() {
    const schema = { tables: [] };
    const tables = await this.getTables();
    schema.tables = await Promise.all(
      tables.map(async (tableName) => {
        const columns = await this.getColumns(tableName);
        const indexes = await this.getIndexes(tableName);
        const foreignKeys = await this.getForeignKeys(tableName);
        return {
          name: tableName,
          columns,
          indexes,
          foreignKeys
        };
      })
    );
    return schema;
  }
  async getTables() {
    const [rows] = await this.db.connection.raw(SQL_QUERIES$2.TABLE_LIST);
    return rows.map((row) => row.table_name);
  }
  async getColumns(tableName) {
    const [rows] = await this.db.connection.raw(SQL_QUERIES$2.LIST_COLUMNS, [
      tableName
    ]);
    return rows.map((row) => {
      const { type, args = [], ...rest } = toStrapiType$1(row);
      return {
        type,
        args,
        defaultTo: row.column_default,
        name: row.column_name,
        notNullable: row.is_nullable === "NO",
        unsigned: row.column_type.endsWith(" unsigned"),
        ...rest
      };
    });
  }
  async getIndexes(tableName) {
    const [rows] = await this.db.connection.raw(SQL_QUERIES$2.INDEX_LIST, [tableName]);
    const ret = {};
    for (const index2 of rows) {
      if (index2.Column_name === "id") {
        continue;
      }
      if (!ret[index2.Key_name]) {
        const indexInfo = {
          columns: [index2.Column_name],
          name: index2.Key_name
        };
        if (!index2.Non_unique) {
          indexInfo.type = "unique";
        }
        ret[index2.Key_name] = indexInfo;
      } else {
        ret[index2.Key_name].columns.push(index2.Column_name);
      }
    }
    return Object.values(ret);
  }
  async getForeignKeys(tableName) {
    const [rows] = await this.db.connection.raw(SQL_QUERIES$2.FOREIGN_KEY_LIST, [
      tableName
    ]);
    const ret = {};
    for (const fk of rows) {
      ret[fk.constraint_name] = {
        name: fk.constraint_name,
        columns: [],
        referencedColumns: [],
        referencedTable: null,
        onUpdate: null,
        onDelete: null
      };
    }
    const contraintNames = Object.keys(ret);
    if (contraintNames.length > 0) {
      const [fkReferences] = await this.db.connection.raw(SQL_QUERIES$2.FOREIGN_KEY_REFERENCES, [
        contraintNames,
        tableName
      ]);
      for (const fkReference of fkReferences) {
        ret[fkReference.constraint_name].referencedTable = fkReference.referenced_table_name;
        ret[fkReference.constraint_name].columns.push(fkReference.column_name);
        ret[fkReference.constraint_name].referencedColumns.push(fkReference.referenced_column_name);
      }
      const [fkReferentialConstraints] = await this.db.connection.raw(
        SQL_QUERIES$2.FOREIGN_KEY_REFERENTIALS_CONSTRAINTS,
        [contraintNames, tableName]
      );
      for (const fkReferentialConstraint of fkReferentialConstraints) {
        ret[fkReferentialConstraint.constraint_name].onUpdate = fkReferentialConstraint.on_update.toUpperCase();
        ret[fkReferentialConstraint.constraint_name].onDelete = fkReferentialConstraint.on_delete.toUpperCase();
      }
    }
    return Object.values(ret);
  }
}
const MYSQL = "MYSQL";
const MARIADB = "MARIADB";
const SQL_QUERIES$1 = {
  VERSION: `SELECT version() as version`
};
class MysqlDatabaseInspector {
  db;
  constructor(db) {
    this.db = db;
  }
  async getInformation() {
    let database;
    let versionNumber;
    try {
      const [results] = await this.db.connection.raw(SQL_QUERIES$1.VERSION);
      const versionSplit = results[0].version.split("-");
      const databaseName = versionSplit[1];
      versionNumber = versionSplit[0];
      database = databaseName && databaseName.toLowerCase() === "mariadb" ? MARIADB : MYSQL;
    } catch (e) {
      return {
        database: null,
        version: null
      };
    }
    return {
      database,
      version: versionNumber
    };
  }
}
class MysqlDialect extends Dialect {
  schemaInspector;
  databaseInspector;
  info = null;
  constructor(db) {
    super(db, "mysql");
    this.schemaInspector = new MysqlSchemaInspector(db);
    this.databaseInspector = new MysqlDatabaseInspector(db);
  }
  configure() {
    const connection = this.db.config.connection.connection;
    connection.supportBigNumbers = true;
    if (connection.bigNumberStrings === void 0) {
      connection.bigNumberStrings = true;
    }
    connection.typeCast = (field, next) => {
      if (field.type === "DECIMAL" || field.type === "NEWDECIMAL") {
        const value = field.string();
        return value === null ? null : Number(value);
      }
      if (field.type === "TINY" && field.length === 1) {
        const value = field.string();
        return value ? value === "1" : null;
      }
      if (field.type === "DATE") {
        return field.string();
      }
      return next();
    };
  }
  async initialize() {
    try {
      await this.db.connection.raw(`set session sql_require_primary_key = 0;`);
    } catch (err) {
    }
    this.info = await this.databaseInspector.getInformation();
  }
  async startSchemaUpdate() {
    try {
      await this.db.connection.raw(`set foreign_key_checks = 0;`);
      await this.db.connection.raw(`set session sql_require_primary_key = 0;`);
    } catch (err) {
    }
  }
  async endSchemaUpdate() {
    await this.db.connection.raw(`set foreign_key_checks = 1;`);
  }
  supportsUnsigned() {
    return true;
  }
  supportsWindowFunctions() {
    const isMysqlDB = !this.info?.database || this.info.database === MYSQL;
    const isBeforeV8 = !semver__default.default.valid(this.info?.version) || semver__default.default.lt(this.info?.version ?? "", "8.0.0");
    if (isMysqlDB && isBeforeV8) {
      return false;
    }
    return true;
  }
  usesForeignKeys() {
    return true;
  }
  transformErrors(error) {
    super.transformErrors(error);
  }
}
const SQL_QUERIES = {
  TABLE_LIST: `select name from sqlite_master where type = 'table' and name NOT LIKE 'sqlite%'`,
  TABLE_INFO: `pragma table_info(??)`,
  INDEX_LIST: "pragma index_list(??)",
  INDEX_INFO: "pragma index_info(??)",
  FOREIGN_KEY_LIST: "pragma foreign_key_list(??)"
};
const toStrapiType = (column) => {
  const { type } = column;
  const rootType = type.toLowerCase().match(/[^(), ]+/)?.[0];
  switch (rootType) {
    case "integer": {
      if (column.pk) {
        return { type: "increments", args: [{ primary: true, primaryKey: true }] };
      }
      return { type: "integer" };
    }
    case "float": {
      return { type: "float", args: [10, 2] };
    }
    case "bigint": {
      return { type: "bigInteger" };
    }
    case "varchar": {
      const length = type.slice(8, type.length - 1);
      return { type: "string", args: [Number(length)] };
    }
    case "text": {
      return { type: "text", args: ["longtext"] };
    }
    case "json": {
      return { type: "jsonb" };
    }
    case "boolean": {
      return { type: "boolean" };
    }
    case "datetime": {
      return { type: "datetime", args: [{ useTz: false, precision: 6 }] };
    }
    case "date": {
      return { type: "date" };
    }
    case "time": {
      return { type: "time", args: [{ precision: 3 }] };
    }
    default: {
      return { type: "specificType", args: [column.data_type] };
    }
  }
};
class SqliteSchemaInspector {
  db;
  constructor(db) {
    this.db = db;
  }
  async getSchema() {
    const schema = { tables: [] };
    const tables = await this.getTables();
    for (const tableName of tables) {
      const columns = await this.getColumns(tableName);
      const indexes = await this.getIndexes(tableName);
      const foreignKeys = await this.getForeignKeys(tableName);
      schema.tables.push({
        name: tableName,
        columns,
        indexes,
        foreignKeys
      });
    }
    return schema;
  }
  async getTables() {
    const rows = await this.db.connection.raw(SQL_QUERIES.TABLE_LIST);
    return rows.map((row) => row.name);
  }
  async getColumns(tableName) {
    const rows = await this.db.connection.raw(SQL_QUERIES.TABLE_INFO, [tableName]);
    return rows.map((row) => {
      const { type, args = [], ...rest } = toStrapiType(row);
      return {
        type,
        args,
        name: row.name,
        defaultTo: row.dflt_value,
        notNullable: row.notnull !== null ? Boolean(row.notnull) : null,
        unsigned: false,
        ...rest
      };
    });
  }
  async getIndexes(tableName) {
    const indexes = await this.db.connection.raw(SQL_QUERIES.INDEX_LIST, [tableName]);
    const ret = [];
    for (const index2 of indexes.filter((index22) => !index22.name.startsWith("sqlite_"))) {
      const res = await this.db.connection.raw(SQL_QUERIES.INDEX_INFO, [
        index2.name
      ]);
      const indexInfo = {
        columns: res.map((row) => row.name),
        name: index2.name
      };
      if (index2.unique) {
        indexInfo.type = "unique";
      }
      ret.push(indexInfo);
    }
    return ret;
  }
  async getForeignKeys(tableName) {
    const fks = await this.db.connection.raw(SQL_QUERIES.FOREIGN_KEY_LIST, [
      tableName
    ]);
    const ret = {};
    for (const fk of fks) {
      if (!ret[fk.id]) {
        ret[fk.id] = {
          // TODO: name, //  find name
          name: "",
          columns: [fk.from],
          referencedColumns: [fk.to],
          referencedTable: fk.table,
          onUpdate: fk.on_update.toUpperCase(),
          onDelete: fk.on_delete.toUpperCase()
        };
      } else {
        ret[fk.id].columns.push(fk.from);
        ret[fk.id].referencedColumns.push(fk.to);
      }
    }
    return Object.values(ret);
  }
}
const UNSUPPORTED_OPERATORS = ["$jsonSupersetOf"];
class SqliteDialect extends Dialect {
  schemaInspector;
  constructor(db) {
    super(db, "sqlite");
    this.schemaInspector = new SqliteSchemaInspector(db);
  }
  configure() {
    const connection = this.db.config.connection.connection;
    if (typeof connection !== "string") {
      connection.filename = path__default.default.resolve(connection.filename);
    }
    const dbDir = path__default.default.dirname(connection.filename);
    fse__default.default.ensureDirSync(dbDir);
  }
  useReturning() {
    return true;
  }
  async initialize() {
    await this.db.connection.raw("pragma foreign_keys = on");
  }
  canAlterConstraints() {
    return false;
  }
  getSqlType(type) {
    switch (type) {
      case "enum": {
        return "text";
      }
      case "double":
      case "decimal": {
        return "float";
      }
      case "timestamp": {
        return "datetime";
      }
      default: {
        return type;
      }
    }
  }
  supportsOperator(operator) {
    return !UNSUPPORTED_OPERATORS.includes(operator);
  }
  async startSchemaUpdate() {
    await this.db.connection.raw(`pragma foreign_keys = off`);
  }
  async endSchemaUpdate() {
    await this.db.connection.raw(`pragma foreign_keys = on`);
  }
  transformErrors(error) {
    switch (error.errno) {
      case 19: {
        throw new NotNullError();
      }
      default: {
        super.transformErrors(error);
      }
    }
  }
  canAddIncrements() {
    return false;
  }
}
const getDialectClass = (client) => {
  switch (client) {
    case "postgres":
      return PostgresDialect;
    case "mysql":
      return MysqlDialect;
    case "sqlite":
      return SqliteDialect;
    default:
      throw new Error(`Unknown dialect ${client}`);
  }
};
const getDialectName = (client) => {
  switch (client) {
    case "postgres":
      return "postgres";
    case "mysql":
    case "mysql2":
      return "mysql";
    case "sqlite":
    case "sqlite-legacy":
      return "sqlite";
    default:
      throw new Error(`Unknown dialect ${client}`);
  }
};
const getDialect = (db) => {
  const { client } = db.config.connection;
  const dialectName = getDialectName(client);
  const constructor = getDialectClass(dialectName);
  const dialect = new constructor(db, dialectName);
  return dialect;
};
const debug$1 = createDebug__default.default("strapi::database");
const createSchemaBuilder = (db) => {
  const helpers2 = createHelpers(db);
  return {
    /**
     * Returns a knex schema builder instance
     * @param {string} table - table name
     */
    getSchemaBuilder(trx) {
      return db.getSchemaConnection(trx);
    },
    /**
     * Creates schema in DB
     */
    async createSchema(schema) {
      await db.connection.transaction(async (trx) => {
        await this.createTables(schema.tables, trx);
      });
    },
    /**
     * Creates a list of tables in a schema
     * @param {KnexInstance} trx
     * @param {Table[]} tables
     */
    async createTables(tables, trx) {
      for (const table of tables) {
        debug$1(`Creating table: ${table.name}`);
        const schemaBuilder = this.getSchemaBuilder(trx);
        await helpers2.createTable(schemaBuilder, table);
      }
      for (const table of tables) {
        debug$1(`Creating table foreign keys: ${table.name}`);
        const schemaBuilder = this.getSchemaBuilder(trx);
        await helpers2.createTableForeignKeys(schemaBuilder, table);
      }
    },
    /**
     * Drops schema from DB
     */
    async dropSchema(schema, { dropDatabase = false } = {}) {
      if (dropDatabase) {
        return;
      }
      await db.connection.transaction(async (trx) => {
        for (const table of schema.tables.reverse()) {
          const schemaBuilder = this.getSchemaBuilder(trx);
          await helpers2.dropTable(schemaBuilder, table);
        }
      });
    },
    /**
     * Applies a schema diff update in the DB
     * @param {*} schemaDiff
     */
    // TODO: implement force option to disable removal in DB
    async updateSchema(schemaDiff) {
      const forceMigration = db.config.settings?.forceMigration;
      await db.dialect.startSchemaUpdate();
      await db.connection.transaction(async (trx) => {
        await this.createTables(schemaDiff.tables.added, trx);
        if (forceMigration) {
          for (const table of schemaDiff.tables.removed) {
            debug$1(`Removing table foreign keys: ${table.name}`);
            const schemaBuilder = this.getSchemaBuilder(trx);
            await helpers2.dropTableForeignKeys(schemaBuilder, table);
          }
          for (const table of schemaDiff.tables.removed) {
            debug$1(`Removing table: ${table.name}`);
            const schemaBuilder = this.getSchemaBuilder(trx);
            await helpers2.dropTable(schemaBuilder, table);
          }
        }
        for (const table of schemaDiff.tables.updated) {
          debug$1(`Updating table: ${table.name}`);
          const schemaBuilder = this.getSchemaBuilder(trx);
          await helpers2.alterTable(schemaBuilder, table);
        }
      });
      await db.dialect.endSchemaUpdate();
    }
  };
};
const createHelpers = (db) => {
  const createForeignKey = (tableBuilder, foreignKey) => {
    const { name, columns, referencedColumns, referencedTable, onDelete, onUpdate } = foreignKey;
    const constraint = tableBuilder.foreign(columns, name).references(referencedColumns).inTable(db.getSchemaName() ? `${db.getSchemaName()}.${referencedTable}` : referencedTable);
    if (onDelete) {
      constraint.onDelete(onDelete);
    }
    if (onUpdate) {
      constraint.onUpdate(onUpdate);
    }
  };
  const dropForeignKey = (tableBuilder, foreignKey) => {
    const { name, columns } = foreignKey;
    tableBuilder.dropForeign(columns, name);
  };
  const createIndex = (tableBuilder, index2) => {
    const { type, columns, name } = index2;
    switch (type) {
      case "primary": {
        return tableBuilder.primary(columns, name);
      }
      case "unique": {
        return tableBuilder.unique(columns, name);
      }
      default: {
        return tableBuilder.index(columns, name, type);
      }
    }
  };
  const dropIndex = (tableBuilder, index2) => {
    if (!db.config.settings?.forceMigration) {
      return;
    }
    const { type, columns, name } = index2;
    switch (type) {
      case "primary": {
        return tableBuilder.dropPrimary(name);
      }
      case "unique": {
        return tableBuilder.dropUnique(columns, name);
      }
      default: {
        return tableBuilder.dropIndex(columns, name);
      }
    }
  };
  const createColumn2 = (tableBuilder, column) => {
    const { type, name, args = [], defaultTo, unsigned, notNullable } = column;
    const col = tableBuilder[type](name, ...args);
    if (unsigned === true) {
      col.unsigned();
    }
    if (!_.isNil(defaultTo)) {
      const [value, opts] = _.castArray(defaultTo);
      if (_.prop("isRaw", opts)) {
        col.defaultTo(db.connection.raw(value), _.omit("isRaw", opts));
      } else {
        col.defaultTo(value, opts);
      }
    }
    if (notNullable === true) {
      col.notNullable();
    } else {
      col.nullable();
    }
    return col;
  };
  const dropColumn = (tableBuilder, column) => {
    if (!db.config.settings?.forceMigration) {
      return;
    }
    return tableBuilder.dropColumn(column.name);
  };
  const createTable2 = async (schemaBuilder, table) => {
    await schemaBuilder.createTable(table.name, (tableBuilder) => {
      (table.columns || []).forEach((column) => createColumn2(tableBuilder, column));
      (table.indexes || []).forEach((index2) => createIndex(tableBuilder, index2));
      if (!db.dialect.canAlterConstraints()) {
        (table.foreignKeys || []).forEach(
          (foreignKey) => createForeignKey(tableBuilder, foreignKey)
        );
      }
    });
  };
  const alterTable = async (schemaBuilder, table) => {
    await schemaBuilder.alterTable(table.name, (tableBuilder) => {
      for (const removedIndex of table.indexes.removed) {
        debug$1(`Dropping index ${removedIndex.name}`);
        dropIndex(tableBuilder, removedIndex);
      }
      for (const updateddIndex of table.indexes.updated) {
        debug$1(`Dropping updated index ${updateddIndex.name}`);
        dropIndex(tableBuilder, updateddIndex.object);
      }
      for (const removedForeignKey of table.foreignKeys.removed) {
        debug$1(`Dropping foreign key ${removedForeignKey.name}`);
        dropForeignKey(tableBuilder, removedForeignKey);
      }
      for (const updatedForeignKey of table.foreignKeys.updated) {
        debug$1(`Dropping updated foreign key ${updatedForeignKey.name}`);
        dropForeignKey(tableBuilder, updatedForeignKey.object);
      }
      for (const removedColumn of table.columns.removed) {
        debug$1(`Dropping column ${removedColumn.name}`);
        dropColumn(tableBuilder, removedColumn);
      }
      for (const updatedColumn of table.columns.updated) {
        debug$1(`Updating column ${updatedColumn.name}`);
        const { object } = updatedColumn;
        if (object.type === "increments") {
          createColumn2(tableBuilder, { ...object, type: "integer" }).alter();
        } else {
          createColumn2(tableBuilder, object).alter();
        }
      }
      for (const updatedForeignKey of table.foreignKeys.updated) {
        debug$1(`Recreating updated foreign key ${updatedForeignKey.name}`);
        createForeignKey(tableBuilder, updatedForeignKey.object);
      }
      for (const updatedIndex of table.indexes.updated) {
        debug$1(`Recreating updated index ${updatedIndex.name}`);
        createIndex(tableBuilder, updatedIndex.object);
      }
      for (const addedColumn of table.columns.added) {
        debug$1(`Creating column ${addedColumn.name}`);
        if (addedColumn.type === "increments" && !db.dialect.canAddIncrements()) {
          tableBuilder.integer(addedColumn.name).unsigned();
          tableBuilder.primary([addedColumn.name]);
        } else {
          createColumn2(tableBuilder, addedColumn);
        }
      }
      for (const addedForeignKey of table.foreignKeys.added) {
        debug$1(`Creating foreign keys ${addedForeignKey.name}`);
        createForeignKey(tableBuilder, addedForeignKey);
      }
      for (const addedIndex of table.indexes.added) {
        debug$1(`Creating index ${addedIndex.name}`);
        createIndex(tableBuilder, addedIndex);
      }
    });
  };
  const dropTable = (schemaBuilder, table) => {
    if (!db.config.settings.forceMigration) {
      return;
    }
    return schemaBuilder.dropTableIfExists(table.name);
  };
  const createTableForeignKeys = async (schemaBuilder, table) => {
    await schemaBuilder.table(table.name, (tableBuilder) => {
      (table.foreignKeys || []).forEach((foreignKey) => createForeignKey(tableBuilder, foreignKey));
    });
  };
  const dropTableForeignKeys = async (schemaBuilder, table) => {
    if (!db.config.settings.forceMigration) {
      return;
    }
    await schemaBuilder.table(table.name, (tableBuilder) => {
      (table.foreignKeys || []).forEach((foreignKey) => dropForeignKey(tableBuilder, foreignKey));
    });
  };
  return {
    createTable: createTable2,
    alterTable,
    dropTable,
    createTableForeignKeys,
    dropTableForeignKeys
  };
};
const RESERVED_TABLE_NAMES = ["strapi_migrations", "strapi_database_schema"];
const statuses = {
  CHANGED: "CHANGED",
  UNCHANGED: "UNCHANGED"
};
const helpers = {
  hasTable(schema, tableName) {
    return schema.tables.findIndex((table) => table.name === tableName) !== -1;
  },
  findTable(schema, tableName) {
    return schema.tables.find((table) => table.name === tableName);
  },
  hasColumn(table, columnName) {
    return table.columns.findIndex((column) => column.name === columnName) !== -1;
  },
  findColumn(table, columnName) {
    return table.columns.find((column) => column.name === columnName);
  },
  hasIndex(table, columnName) {
    return table.indexes.findIndex((column) => column.name === columnName) !== -1;
  },
  findIndex(table, columnName) {
    return table.indexes.find((column) => column.name === columnName);
  },
  hasForeignKey(table, columnName) {
    return table.foreignKeys.findIndex((column) => column.name === columnName) !== -1;
  },
  findForeignKey(table, columnName) {
    return table.foreignKeys.find((column) => column.name === columnName);
  }
};
const createSchemaDiff = (db) => {
  const hasChangedStatus = (diff) => diff.status === statuses.CHANGED;
  const diffIndexes = (oldIndex, index2) => {
    const changes = [];
    if (!___default.default.isEqual(oldIndex.columns, index2.columns)) {
      changes.push("columns");
    }
    if (oldIndex.type && index2.type && ___default.default.toLower(oldIndex.type) !== ___default.default.toLower(index2.type)) {
      changes.push("type");
    }
    return {
      status: changes.length > 0 ? statuses.CHANGED : statuses.UNCHANGED,
      diff: {
        name: index2.name,
        object: index2
      }
    };
  };
  const diffForeignKeys = (oldForeignKey, foreignKey) => {
    const changes = [];
    if (___default.default.difference(oldForeignKey.columns, foreignKey.columns).length > 0) {
      changes.push("columns");
    }
    if (___default.default.difference(oldForeignKey.referencedColumns, foreignKey.referencedColumns).length > 0) {
      changes.push("referencedColumns");
    }
    if (oldForeignKey.referencedTable !== foreignKey.referencedTable) {
      changes.push("referencedTable");
    }
    if (___default.default.isNil(oldForeignKey.onDelete) || ___default.default.toUpper(oldForeignKey.onDelete) === "NO ACTION") {
      if (!___default.default.isNil(foreignKey.onDelete) && ___default.default.toUpper(oldForeignKey.onDelete ?? "") !== "NO ACTION") {
        changes.push("onDelete");
      }
    } else if (___default.default.toUpper(oldForeignKey.onDelete) !== ___default.default.toUpper(foreignKey.onDelete ?? "")) {
      changes.push("onDelete");
    }
    if (___default.default.isNil(oldForeignKey.onUpdate) || ___default.default.toUpper(oldForeignKey.onUpdate) === "NO ACTION") {
      if (!___default.default.isNil(foreignKey.onUpdate) && ___default.default.toUpper(oldForeignKey.onUpdate ?? "") !== "NO ACTION") {
        changes.push("onUpdate");
      }
    } else if (___default.default.toUpper(oldForeignKey.onUpdate) !== ___default.default.toUpper(foreignKey.onUpdate ?? "")) {
      changes.push("onUpdate");
    }
    return {
      status: changes.length > 0 ? statuses.CHANGED : statuses.UNCHANGED,
      diff: {
        name: foreignKey.name,
        object: foreignKey
      }
    };
  };
  const diffDefault = (oldColumn, column) => {
    const oldDefaultTo = oldColumn.defaultTo;
    const { defaultTo } = column;
    if (oldDefaultTo === null || ___default.default.toLower(oldDefaultTo) === "null") {
      return ___default.default.isNil(defaultTo) || ___default.default.toLower(defaultTo) === "null";
    }
    return ___default.default.toLower(oldDefaultTo) === ___default.default.toLower(column.defaultTo) || ___default.default.toLower(oldDefaultTo) === ___default.default.toLower(`'${column.defaultTo}'`);
  };
  const diffColumns = (oldColumn, column) => {
    const changes = [];
    const isIgnoredType = ["increments"].includes(column.type);
    const oldType = oldColumn.type;
    const type = db.dialect.getSqlType(column.type);
    if (oldType !== type && !isIgnoredType) {
      changes.push("type");
    }
    if (oldColumn.notNullable !== column.notNullable) {
      changes.push("notNullable");
    }
    const hasSameDefault = diffDefault(oldColumn, column);
    if (!hasSameDefault) {
      changes.push("defaultTo");
    }
    if (oldColumn.unsigned !== column.unsigned && db.dialect.supportsUnsigned()) {
      changes.push("unsigned");
    }
    return {
      status: changes.length > 0 ? statuses.CHANGED : statuses.UNCHANGED,
      diff: {
        name: column.name,
        object: column
      }
    };
  };
  const diffTableColumns = (srcTable, destTable) => {
    const addedColumns = [];
    const updatedColumns = [];
    const unchangedColumns = [];
    const removedColumns = [];
    for (const destColumn of destTable.columns) {
      const srcColumn = helpers.findColumn(srcTable, destColumn.name);
      if (srcColumn) {
        const { status, diff } = diffColumns(srcColumn, destColumn);
        if (status === statuses.CHANGED) {
          updatedColumns.push(diff);
        } else {
          unchangedColumns.push(srcColumn);
        }
      } else {
        addedColumns.push(destColumn);
      }
    }
    for (const srcColumn of srcTable.columns) {
      if (!helpers.hasColumn(destTable, srcColumn.name)) {
        removedColumns.push(srcColumn);
      }
    }
    const hasChanged = [addedColumns, updatedColumns, removedColumns].some((arr) => arr.length > 0);
    return {
      status: hasChanged ? statuses.CHANGED : statuses.UNCHANGED,
      diff: {
        added: addedColumns,
        updated: updatedColumns,
        unchanged: unchangedColumns,
        removed: removedColumns
      }
    };
  };
  const diffTableIndexes = (srcTable, destTable) => {
    const addedIndexes = [];
    const updatedIndexes = [];
    const unchangedIndexes = [];
    const removedIndexes = [];
    for (const destIndex of destTable.indexes) {
      const srcIndex = helpers.findIndex(srcTable, destIndex.name);
      if (srcIndex) {
        const { status, diff } = diffIndexes(srcIndex, destIndex);
        if (status === statuses.CHANGED) {
          updatedIndexes.push(diff);
        } else {
          unchangedIndexes.push(srcIndex);
        }
      } else {
        addedIndexes.push(destIndex);
      }
    }
    for (const srcIndex of srcTable.indexes) {
      if (!helpers.hasIndex(destTable, srcIndex.name)) {
        removedIndexes.push(srcIndex);
      }
    }
    const hasChanged = [addedIndexes, updatedIndexes, removedIndexes].some((arr) => arr.length > 0);
    return {
      status: hasChanged ? statuses.CHANGED : statuses.UNCHANGED,
      diff: {
        added: addedIndexes,
        updated: updatedIndexes,
        unchanged: unchangedIndexes,
        removed: removedIndexes
      }
    };
  };
  const diffTableForeignKeys = (srcTable, destTable) => {
    const addedForeignKeys = [];
    const updatedForeignKeys = [];
    const unchangedForeignKeys = [];
    const removedForeignKeys = [];
    if (!db.dialect.usesForeignKeys()) {
      return {
        status: statuses.UNCHANGED,
        diff: {
          added: addedForeignKeys,
          updated: updatedForeignKeys,
          unchanged: unchangedForeignKeys,
          removed: removedForeignKeys
        }
      };
    }
    for (const destForeignKey of destTable.foreignKeys) {
      const srcForeignKey = helpers.findForeignKey(srcTable, destForeignKey.name);
      if (srcForeignKey) {
        const { status, diff } = diffForeignKeys(srcForeignKey, destForeignKey);
        if (status === statuses.CHANGED) {
          updatedForeignKeys.push(diff);
        } else {
          unchangedForeignKeys.push(srcForeignKey);
        }
      } else {
        addedForeignKeys.push(destForeignKey);
      }
    }
    for (const srcForeignKey of srcTable.foreignKeys) {
      if (!helpers.hasForeignKey(destTable, srcForeignKey.name)) {
        removedForeignKeys.push(srcForeignKey);
      }
    }
    const hasChanged = [addedForeignKeys, updatedForeignKeys, removedForeignKeys].some(
      (arr) => arr.length > 0
    );
    return {
      status: hasChanged ? statuses.CHANGED : statuses.UNCHANGED,
      diff: {
        added: addedForeignKeys,
        updated: updatedForeignKeys,
        unchanged: unchangedForeignKeys,
        removed: removedForeignKeys
      }
    };
  };
  const diffTables = (srcTable, destTable) => {
    const columnsDiff = diffTableColumns(srcTable, destTable);
    const indexesDiff = diffTableIndexes(srcTable, destTable);
    const foreignKeysDiff = diffTableForeignKeys(srcTable, destTable);
    const hasChanged = [columnsDiff, indexesDiff, foreignKeysDiff].some(hasChangedStatus);
    return {
      status: hasChanged ? statuses.CHANGED : statuses.UNCHANGED,
      diff: {
        name: srcTable.name,
        indexes: indexesDiff.diff,
        foreignKeys: foreignKeysDiff.diff,
        columns: columnsDiff.diff
      }
    };
  };
  const diffSchemas = async (srcSchema, destSchema) => {
    const addedTables = [];
    const updatedTables = [];
    const unchangedTables = [];
    const removedTables = [];
    for (const destTable of destSchema.tables) {
      const srcTable = helpers.findTable(srcSchema, destTable.name);
      if (srcTable) {
        const { status, diff } = diffTables(srcTable, destTable);
        if (status === statuses.CHANGED) {
          updatedTables.push(diff);
        } else {
          unchangedTables.push(srcTable);
        }
      } else {
        addedTables.push(destTable);
      }
    }
    const parsePersistedTable = (persistedTable) => {
      if (typeof persistedTable === "string") {
        return persistedTable;
      }
      return persistedTable.name;
    };
    const persistedTables = helpers.hasTable(srcSchema, "strapi_core_store_settings") ? await strapi.store.get({
      type: "core",
      key: "persisted_tables"
    }) ?? [] : [];
    const reservedTables = [...RESERVED_TABLE_NAMES, ...persistedTables.map(parsePersistedTable)];
    for (const srcTable of srcSchema.tables) {
      if (!helpers.hasTable(destSchema, srcTable.name) && !reservedTables.includes(srcTable.name)) {
        const dependencies = persistedTables.filter((table) => {
          const dependsOn = table?.dependsOn;
          if (!___default.default.isArray(dependsOn)) {
            return;
          }
          return dependsOn.some((table2) => table2.name === srcTable.name);
        }).map((dependsOnTable) => {
          return srcSchema.tables.find((srcTable2) => srcTable2.name === dependsOnTable.name);
        }).filter((table) => !___default.default.isNil(table));
        removedTables.push(srcTable, ...dependencies);
      }
    }
    const hasChanged = [addedTables, updatedTables, removedTables].some((arr) => arr.length > 0);
    return {
      status: hasChanged ? statuses.CHANGED : statuses.UNCHANGED,
      diff: {
        tables: {
          added: addedTables,
          updated: updatedTables,
          unchanged: unchangedTables,
          removed: removedTables
        }
      }
    };
  };
  return {
    diff: diffSchemas
  };
};
const TABLE_NAME = "strapi_database_schema";
const createSchemaStorage = (db) => {
  const hasSchemaTable = () => db.getSchemaConnection().hasTable(TABLE_NAME);
  const createSchemaTable = () => {
    return db.getSchemaConnection().createTable(TABLE_NAME, (t) => {
      t.increments("id");
      t.json("schema");
      t.datetime("time", { useTz: false });
      t.string("hash");
    });
  };
  const checkTableExists = async () => {
    if (!await hasSchemaTable()) {
      await createSchemaTable();
    }
  };
  return {
    async read() {
      await checkTableExists();
      const res = await db.getConnection().select("*").from(TABLE_NAME).orderBy("time", "DESC").first();
      if (!res) {
        return null;
      }
      const parsedSchema = typeof res.schema === "object" ? res.schema : JSON.parse(res.schema);
      return {
        ...res,
        schema: parsedSchema
      };
    },
    hashSchema(schema) {
      return crypto__default.default.createHash("md5").update(JSON.stringify(schema)).digest("hex");
    },
    async add(schema) {
      await checkTableExists();
      await db.getConnection(TABLE_NAME).delete();
      const time = /* @__PURE__ */ new Date();
      await db.getConnection().insert({
        schema: JSON.stringify(schema),
        hash: this.hashSchema(schema),
        time
      }).into(TABLE_NAME);
    },
    async clear() {
      await checkTableExists();
      await db.getConnection(TABLE_NAME).truncate();
    }
  };
};
const SCALAR_TYPES = [
  "increments",
  "password",
  "email",
  "string",
  "uid",
  "richtext",
  "text",
  "json",
  "enumeration",
  "integer",
  "biginteger",
  "float",
  "decimal",
  "date",
  "time",
  "datetime",
  "timestamp",
  "boolean",
  "blocks"
];
const STRING_TYPES = ["string", "text", "uid", "email", "enumeration", "richtext"];
const NUMBER_TYPES = ["biginteger", "integer", "decimal", "float"];
const isString = (type) => STRING_TYPES.includes(type);
const isNumber = (type) => NUMBER_TYPES.includes(type);
const isScalar = (type) => SCALAR_TYPES.includes(type);
const isComponent = (type) => type === "component";
const isDynamicZone = (type) => type === "dynamiczone";
const isRelation = (type) => type === "relation";
const isScalarAttribute = (attribute) => isScalar(attribute.type);
const isRelationalAttribute = (attribute) => isRelation(attribute.type);
const createColumn = (name, attribute) => {
  const { type, args = [], ...opts } = getColumnType(attribute);
  return {
    name,
    type,
    args,
    defaultTo: null,
    notNullable: false,
    unsigned: false,
    ...opts,
    ..."column" in attribute ? attribute.column ?? {} : {}
  };
};
const createTable = (meta) => {
  const table = {
    name: meta.tableName,
    indexes: meta.indexes || [],
    foreignKeys: meta.foreignKeys || [],
    columns: []
  };
  for (const key of Object.keys(meta.attributes)) {
    const attribute = meta.attributes[key];
    if (attribute.type === "relation") {
      if ("morphColumn" in attribute && attribute.morphColumn && attribute.owner) {
        const { idColumn, typeColumn } = attribute.morphColumn;
        table.columns.push(
          createColumn(idColumn.name, {
            type: "integer",
            column: {
              unsigned: true
            }
          })
        );
        table.columns.push(createColumn(typeColumn.name, { type: "string" }));
      } else if ("joinColumn" in attribute && attribute.joinColumn && attribute.owner && attribute.joinColumn.referencedTable) {
        const { name: columnName, referencedColumn, referencedTable } = attribute.joinColumn;
        const column = createColumn(columnName, {
          type: "integer",
          column: {
            unsigned: true
          }
        });
        table.columns.push(column);
        table.foreignKeys.push({
          name: `${table.name}_${columnName}_fk`,
          columns: [columnName],
          referencedTable,
          referencedColumns: [referencedColumn],
          // NOTE: could allow configuration
          onDelete: "SET NULL"
        });
        table.indexes.push({
          name: `${table.name}_${columnName}_fk`,
          columns: [columnName]
        });
      }
    } else if (isScalarAttribute(attribute)) {
      const column = createColumn(attribute.columnName || key, attribute);
      if (column.unique) {
        table.indexes.push({
          type: "unique",
          name: `${table.name}_${column.name}_unique`,
          columns: [column.name]
        });
      }
      if (column.primary) {
        table.indexes.push({
          type: "primary",
          name: `${table.name}_${column.name}_primary`,
          columns: [column.name]
        });
      }
      table.columns.push(column);
    }
  }
  return table;
};
const getColumnType = (attribute) => {
  if ("columnType" in attribute && attribute.columnType) {
    return attribute.columnType;
  }
  switch (attribute.type) {
    case "increments": {
      return {
        type: "increments",
        args: [{ primary: true, primaryKey: true }],
        notNullable: true
      };
    }
    case "password":
    case "email":
    case "string":
    case "enumeration": {
      return { type: "string" };
    }
    case "uid": {
      return {
        type: "string",
        unique: true
      };
    }
    case "richtext":
    case "text": {
      return {
        type: "text",
        args: ["longtext"]
      };
    }
    case "blocks":
    case "json": {
      return { type: "jsonb" };
    }
    case "integer": {
      return { type: "integer" };
    }
    case "biginteger": {
      return { type: "bigInteger" };
    }
    case "float": {
      return { type: "double" };
    }
    case "decimal": {
      return { type: "decimal", args: [10, 2] };
    }
    case "date": {
      return { type: "date" };
    }
    case "time": {
      return { type: "time", args: [{ precision: 3 }] };
    }
    case "datetime": {
      return {
        type: "datetime",
        args: [
          {
            useTz: false,
            precision: 6
          }
        ]
      };
    }
    case "timestamp": {
      return {
        type: "timestamp",
        args: [
          {
            useTz: false,
            precision: 6
          }
        ]
      };
    }
    case "boolean": {
      return { type: "boolean" };
    }
    default: {
      throw new Error(`Unknown type ${attribute.type}`);
    }
  }
};
const metadataToSchema = (metadata) => {
  const schema = {
    tables: []
  };
  metadata.forEach((metadata2) => {
    schema.tables.push(createTable(metadata2));
  });
  return schema;
};
const debug = createDebug__default.default("strapi::database");
const createSchemaProvider = (db) => {
  const schema = metadataToSchema(db.metadata);
  return {
    builder: createSchemaBuilder(db),
    schemaDiff: createSchemaDiff(db),
    schemaStorage: createSchemaStorage(db),
    /**
     * Drops the database schema
     */
    async drop() {
      debug("Dropping database schema");
      const DBSchema = await db.dialect.schemaInspector.getSchema();
      await this.builder.dropSchema(DBSchema);
    },
    /**
     * Creates the database schema
     */
    async create() {
      debug("Created database schema");
      await this.builder.createSchema(schema);
    },
    /**
     * Resets the database schema
     */
    async reset() {
      debug("Resetting database schema");
      await this.drop();
      await this.create();
    },
    async syncSchema() {
      debug("Synchronizing database schema");
      const DBSchema = await db.dialect.schemaInspector.getSchema();
      const { status, diff } = await this.schemaDiff.diff(DBSchema, schema);
      if (status === "CHANGED") {
        await this.builder.updateSchema(diff);
      }
      await this.schemaStorage.add(schema);
    },
    // TODO: support options to migrate softly or forcefully
    // TODO: support option to disable auto migration & run a CLI command instead to avoid doing it at startup
    // TODO: Allow keeping extra indexes / extra tables / extra columns (globally or on a per table basis)
    async sync() {
      if (await db.migrations.shouldRun()) {
        debug("Found migrations to run");
        await db.migrations.up();
        return this.syncSchema();
      }
      const oldSchema = await this.schemaStorage.read();
      if (!oldSchema) {
        debug("Schema not persisted yet");
        return this.syncSchema();
      }
      const { hash: oldHash } = oldSchema;
      const hash = await this.schemaStorage.hashSchema(schema);
      if (oldHash !== hash) {
        debug("Schema changed");
        return this.syncSchema();
      }
      debug("Schema unchanged");
    }
  };
};
const hasInversedBy = (attr) => "inversedBy" in attr;
const hasMappedBy = (attr) => "mappedBy" in attr;
const isPolymorphic = (attribute) => ["morphOne", "morphMany", "morphToOne", "morphToMany"].includes(attribute.relation);
const isOneToAny = (attribute) => ["oneToOne", "oneToMany"].includes(attribute.relation);
const isManyToAny = (attribute) => ["manyToMany", "manyToOne"].includes(attribute.relation);
const isAnyToOne = (attribute) => ["oneToOne", "manyToOne"].includes(attribute.relation);
const isAnyToMany = (attribute) => ["oneToMany", "manyToMany"].includes(attribute.relation);
const isBidirectional = (attribute) => hasInversedBy(attribute) || hasMappedBy(attribute);
const isOwner = (attribute) => !isBidirectional(attribute) || hasInversedBy(attribute);
const shouldUseJoinTable = (attribute) => !("useJoinTable" in attribute) || attribute.useJoinTable !== false;
const getJoinTableName = (tableName, attributeName) => ___default.default.snakeCase(`${tableName}_${attributeName}_links`);
const hasOrderColumn = (attribute) => isAnyToMany(attribute);
const hasInverseOrderColumn = (attribute) => isBidirectional(attribute) && isManyToAny(attribute);
const createOneToOne = (attributeName, attribute, meta, metadata) => {
  if (isOwner(attribute)) {
    if (shouldUseJoinTable(attribute)) {
      createJoinTable(metadata, {
        attribute,
        attributeName,
        meta
      });
    } else {
      createJoinColum(metadata, {
        attribute,
        attributeName,
        meta
      });
    }
  }
};
const createOneToMany = (attributeName, attribute, meta, metadata) => {
  if (!isBidirectional(attribute)) {
    createJoinTable(metadata, {
      attribute,
      attributeName,
      meta
    });
  } else if (isOwner(attribute)) {
    throw new Error("one side of a oneToMany cannot be the owner side in a bidirectional relation");
  }
};
const createManyToOne = (attributeName, attribute, meta, metadata) => {
  if (isBidirectional(attribute) && !isOwner(attribute)) {
    throw new Error("The many side of a manyToOne must be the owning side");
  }
  if (shouldUseJoinTable(attribute)) {
    createJoinTable(metadata, {
      attribute,
      attributeName,
      meta
    });
  } else {
    createJoinColum(metadata, {
      attribute,
      attributeName,
      meta
    });
  }
};
const createManyToMany = (attributeName, attribute, meta, metadata) => {
  if (!isBidirectional(attribute) || isOwner(attribute)) {
    createJoinTable(metadata, {
      attribute,
      attributeName,
      meta
    });
  }
};
const createMorphToOne = (attributeName, attribute) => {
  const idColumnName = `target_id`;
  const typeColumnName = `target_type`;
  Object.assign(attribute, {
    owner: true,
    morphColumn: attribute.morphColumn ?? {
      typeColumn: {
        name: typeColumnName
      },
      idColumn: {
        name: idColumnName,
        referencedColumn: "id"
      }
    }
  });
};
const createMorphToMany = (attributeName, attribute, meta, metadata) => {
  const joinTableName = ___default.default.snakeCase(`${meta.tableName}_${attributeName}_morphs`);
  const joinColumnName = ___default.default.snakeCase(`${meta.singularName}_id`);
  const morphColumnName = ___default.default.snakeCase(`${attributeName}`);
  const idColumnName = `${morphColumnName}_id`;
  const typeColumnName = `${morphColumnName}_type`;
  metadata.add({
    singularName: joinTableName,
    uid: joinTableName,
    tableName: joinTableName,
    attributes: {
      id: {
        type: "increments"
      },
      [joinColumnName]: {
        type: "integer",
        column: {
          unsigned: true
        }
      },
      [idColumnName]: {
        type: "integer",
        column: {
          unsigned: true
        }
      },
      [typeColumnName]: {
        type: "string"
      },
      field: {
        type: "string"
      },
      order: {
        type: "float",
        column: {
          unsigned: true
        }
      }
    },
    indexes: [
      {
        name: `${joinTableName}_fk`,
        columns: [joinColumnName]
      },
      {
        name: `${joinTableName}_order_index`,
        columns: ["order"]
      },
      {
        name: `${joinTableName}_id_column_index`,
        columns: [idColumnName]
      }
    ],
    foreignKeys: [
      {
        name: `${joinTableName}_fk`,
        columns: [joinColumnName],
        referencedColumns: ["id"],
        referencedTable: meta.tableName,
        onDelete: "CASCADE"
      }
    ],
    lifecycles: {},
    columnToAttribute: {}
  });
  const joinTable = {
    name: joinTableName,
    joinColumn: {
      name: joinColumnName,
      referencedColumn: "id"
    },
    morphColumn: {
      typeColumn: {
        name: typeColumnName
      },
      idColumn: {
        name: idColumnName,
        referencedColumn: "id"
      }
    },
    orderBy: {
      order: "asc"
    },
    pivotColumns: [joinColumnName, typeColumnName, idColumnName]
  };
  attribute.joinTable = joinTable;
};
const createMorphOne = (attributeName, attribute, meta, metadata) => {
  const targetMeta = metadata.get(attribute.target);
  if (!targetMeta) {
    throw new Error(`Morph target not found. Looking for ${attribute.target}`);
  }
  if (attribute.morphBy && !___default.default.has(attribute.morphBy, targetMeta.attributes)) {
    throw new Error(`Morph target attribute not found. Looking for ${attribute.morphBy}`);
  }
};
const createMorphMany = (attributeName, attribute, meta, metadata) => {
  const targetMeta = metadata.get(attribute.target);
  if (!targetMeta) {
    throw new Error(`Morph target not found. Looking for ${attribute.target}`);
  }
  if (attribute.morphBy && !___default.default.has(attribute.morphBy, targetMeta.attributes)) {
    throw new Error(`Morph target attribute not found. Looking for ${attribute.morphBy}`);
  }
};
const createJoinColum = (metadata, { attribute, attributeName }) => {
  const targetMeta = metadata.get(attribute.target);
  if (!targetMeta) {
    throw new Error(`Unknown target ${attribute.target}`);
  }
  const joinColumnName = ___default.default.snakeCase(`${attributeName}_id`);
  const joinColumn = {
    name: joinColumnName,
    referencedColumn: "id",
    referencedTable: targetMeta.tableName
  };
  Object.assign(attribute, { owner: true, joinColumn });
  if (isBidirectional(attribute)) {
    const inverseAttribute = targetMeta.attributes[attribute.inversedBy];
    Object.assign(inverseAttribute, {
      joinColumn: {
        name: joinColumn.referencedColumn,
        referencedColumn: joinColumn.name
      }
    });
  }
};
const createJoinTable = (metadata, { attributeName, attribute, meta }) => {
  const targetMeta = metadata.get(attribute.target);
  if (!targetMeta) {
    throw new Error(`Unknown target ${attribute.target}`);
  }
  const joinTableName = getJoinTableName(meta.tableName, attributeName);
  const joinColumnName = ___default.default.snakeCase(`${meta.singularName}_id`);
  let inverseJoinColumnName = ___default.default.snakeCase(`${targetMeta.singularName}_id`);
  if (joinColumnName === inverseJoinColumnName) {
    inverseJoinColumnName = `inv_${inverseJoinColumnName}`;
  }
  const orderColumnName = ___default.default.snakeCase(`${targetMeta.singularName}_order`);
  let inverseOrderColumnName = ___default.default.snakeCase(`${meta.singularName}_order`);
  if (attribute.relation === "manyToMany" && orderColumnName === inverseOrderColumnName) {
    inverseOrderColumnName = `inv_${inverseOrderColumnName}`;
  }
  const metadataSchema = {
    singularName: joinTableName,
    uid: joinTableName,
    tableName: joinTableName,
    attributes: {
      id: {
        type: "increments"
      },
      [joinColumnName]: {
        type: "integer",
        column: {
          unsigned: true
        }
      },
      [inverseJoinColumnName]: {
        type: "integer",
        column: {
          unsigned: true
        }
      }
      // TODO: add extra pivot attributes -> user should use an intermediate entity
    },
    indexes: [
      {
        name: `${joinTableName}_fk`,
        columns: [joinColumnName]
      },
      {
        name: `${joinTableName}_inv_fk`,
        columns: [inverseJoinColumnName]
      },
      {
        name: `${joinTableName}_unique`,
        columns: [joinColumnName, inverseJoinColumnName],
        type: "unique"
      }
    ],
    foreignKeys: [
      {
        name: `${joinTableName}_fk`,
        columns: [joinColumnName],
        referencedColumns: ["id"],
        referencedTable: meta.tableName,
        onDelete: "CASCADE"
      },
      {
        name: `${joinTableName}_inv_fk`,
        columns: [inverseJoinColumnName],
        referencedColumns: ["id"],
        referencedTable: targetMeta.tableName,
        onDelete: "CASCADE"
      }
    ],
    lifecycles: {},
    columnToAttribute: {}
  };
  const joinTable = {
    name: joinTableName,
    joinColumn: {
      name: joinColumnName,
      referencedColumn: "id"
    },
    inverseJoinColumn: {
      name: inverseJoinColumnName,
      referencedColumn: "id"
    },
    pivotColumns: [joinColumnName, inverseJoinColumnName]
  };
  if (isAnyToMany(attribute)) {
    metadataSchema.attributes[orderColumnName] = {
      type: "float",
      column: {
        unsigned: true,
        defaultTo: null
      }
    };
    metadataSchema.indexes.push({
      name: `${joinTableName}_order_fk`,
      columns: [orderColumnName]
    });
    joinTable.orderColumnName = orderColumnName;
    joinTable.orderBy = { [orderColumnName]: "asc" };
  }
  if (isBidirectional(attribute) && isManyToAny(attribute)) {
    metadataSchema.attributes[inverseOrderColumnName] = {
      type: "float",
      column: {
        unsigned: true,
        defaultTo: null
      }
    };
    metadataSchema.indexes.push({
      name: `${joinTableName}_order_inv_fk`,
      columns: [inverseOrderColumnName]
    });
    joinTable.inverseOrderColumnName = inverseOrderColumnName;
  }
  metadata.add(metadataSchema);
  attribute.joinTable = joinTable;
  if (isBidirectional(attribute)) {
    const inverseAttribute = attribute.inversedBy ? targetMeta.attributes[attribute.inversedBy] : null;
    if (!inverseAttribute) {
      throw new Error(
        `inversedBy attribute ${attribute.inversedBy} not found target ${targetMeta.uid}`
      );
    }
    if (inverseAttribute.type !== "relation") {
      throw new Error(
        `inversedBy attribute ${attribute.inversedBy} targets non relational attribute in ${targetMeta.uid}`
      );
    }
    inverseAttribute.joinTable = {
      name: joinTableName,
      joinColumn: joinTable.inverseJoinColumn,
      inverseJoinColumn: joinTable.joinColumn,
      pivotColumns: joinTable.pivotColumns
    };
    if (isManyToAny(attribute)) {
      inverseAttribute.joinTable.orderColumnName = inverseOrderColumnName;
      inverseAttribute.joinTable.orderBy = { [inverseOrderColumnName]: "asc" };
    }
    if (isAnyToMany(attribute)) {
      inverseAttribute.joinTable.inverseOrderColumnName = orderColumnName;
    }
  }
};
const createRelation = (attributeName, attribute, meta, metadata) => {
  switch (attribute.relation) {
    case "oneToOne":
      return createOneToOne(attributeName, attribute, meta, metadata);
    case "oneToMany":
      return createOneToMany(attributeName, attribute, meta, metadata);
    case "manyToOne":
      return createManyToOne(attributeName, attribute, meta, metadata);
    case "manyToMany":
      return createManyToMany(attributeName, attribute, meta, metadata);
    case "morphToOne":
      return createMorphToOne(attributeName, attribute);
    case "morphToMany":
      return createMorphToMany(attributeName, attribute, meta, metadata);
    case "morphOne":
      return createMorphOne(attributeName, attribute, meta, metadata);
    case "morphMany":
      return createMorphMany(attributeName, attribute, meta, metadata);
    default: {
      throw new Error(`Unknown relation`);
    }
  }
};
class Metadata extends Map {
  get(key) {
    if (!super.has(key)) {
      throw new Error(`Metadata for "${key}" not found`);
    }
    return super.get(key);
  }
  add(meta) {
    return this.set(meta.uid, meta);
  }
  /**
   * Validate the DB metadata, throwing an error if a duplicate DB table name is detected
   */
  validate() {
    const seenTables = /* @__PURE__ */ new Map();
    for (const meta of this.values()) {
      if (seenTables.get(meta.tableName)) {
        throw new Error(
          `DB table "${meta.tableName}" already exists. Change the collectionName of the related content type.`
        );
      }
      seenTables.set(meta.tableName, true);
    }
  }
}
const createMetadata = (models = []) => {
  const metadata = new Metadata();
  for (const model of ___default.default.cloneDeep(models)) {
    if ("id" in model.attributes) {
      throw new Error('The attribute "id" is reserved and cannot be used in a model');
    }
    metadata.add({
      ...model,
      attributes: {
        id: {
          type: "increments"
        },
        ...model.attributes
      },
      lifecycles: model.lifecycles ?? {},
      indexes: model.indexes || [],
      foreignKeys: model.foreignKeys || [],
      columnToAttribute: {}
    });
  }
  for (const meta of metadata.values()) {
    if (hasComponentsOrDz(meta)) {
      const compoLinkModelMeta = createCompoLinkModelMeta(meta);
      meta.componentLink = compoLinkModelMeta;
      metadata.add(compoLinkModelMeta);
    }
    for (const [attributeName, attribute] of Object.entries(meta.attributes)) {
      try {
        if (isComponent(attribute.type) && hasComponentsOrDz(meta)) {
          createComponent(attributeName, attribute, meta);
          continue;
        }
        if (isDynamicZone(attribute.type) && hasComponentsOrDz(meta)) {
          createDynamicZone(attributeName, attribute, meta);
          continue;
        }
        if (isRelationalAttribute(attribute)) {
          createRelation(attributeName, attribute, meta, metadata);
          continue;
        }
        createAttribute(attributeName, attribute);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          throw new Error(
            `Error on attribute ${attributeName} in model ${meta.singularName}(${meta.uid}): ${error.message}`
          );
        }
      }
    }
  }
  for (const meta of metadata.values()) {
    const columnToAttribute = Object.keys(meta.attributes).reduce((acc, key) => {
      const attribute = meta.attributes[key];
      if ("columnName" in attribute) {
        return Object.assign(acc, { [attribute.columnName || key]: key });
      }
      return Object.assign(acc, { [key]: key });
    }, {});
    meta.columnToAttribute = columnToAttribute;
  }
  metadata.validate();
  return metadata;
};
const hasComponentsOrDz = (model) => {
  return Object.values(model.attributes).some(
    ({ type }) => isComponent(type) || isDynamicZone(type)
  );
};
const createCompoLinkModelMeta = (baseModelMeta) => {
  const name = `${baseModelMeta.tableName}_components`;
  return {
    // TODO: make sure there can't be any conflicts with a prefix
    singularName: name,
    uid: name,
    tableName: name,
    attributes: {
      id: {
        type: "increments"
      },
      entity_id: {
        type: "integer",
        column: {
          unsigned: true
        }
      },
      component_id: {
        type: "integer",
        column: {
          unsigned: true
        }
      },
      component_type: {
        type: "string"
      },
      field: {
        type: "string"
      },
      order: {
        type: "float",
        column: {
          unsigned: true,
          defaultTo: null
        }
      }
    },
    indexes: [
      {
        name: `${baseModelMeta.tableName}_field_index`,
        columns: ["field"]
      },
      {
        name: `${baseModelMeta.tableName}_component_type_index`,
        columns: ["component_type"]
      },
      {
        name: `${baseModelMeta.tableName}_entity_fk`,
        columns: ["entity_id"]
      },
      {
        name: `${baseModelMeta.tableName}_unique`,
        columns: ["entity_id", "component_id", "field", "component_type"],
        type: "unique"
      }
    ],
    foreignKeys: [
      {
        name: `${baseModelMeta.tableName}_entity_fk`,
        columns: ["entity_id"],
        referencedColumns: ["id"],
        referencedTable: baseModelMeta.tableName,
        onDelete: "CASCADE"
      }
    ],
    lifecycles: {},
    columnToAttribute: {}
  };
};
const createDynamicZone = (attributeName, attribute, meta) => {
  Object.assign(attribute, {
    type: "relation",
    relation: "morphToMany",
    // TODO: handle restrictions at some point
    // target: attribute.components,
    joinTable: {
      name: meta.componentLink.tableName,
      joinColumn: {
        name: "entity_id",
        referencedColumn: "id"
      },
      morphColumn: {
        idColumn: {
          name: "component_id",
          referencedColumn: "id"
        },
        typeColumn: {
          name: "component_type"
        },
        typeField: "__component"
      },
      on: {
        field: attributeName
      },
      orderBy: {
        order: "asc"
      },
      pivotColumns: ["entity_id", "component_id", "field", "component_type"]
    }
  });
};
const createComponent = (attributeName, attribute, meta) => {
  Object.assign(attribute, {
    type: "relation",
    relation: "repeatable" in attribute && attribute.repeatable === true ? "oneToMany" : "oneToOne",
    target: "component" in attribute && attribute.component,
    joinTable: {
      name: meta.componentLink.tableName,
      joinColumn: {
        name: "entity_id",
        referencedColumn: "id"
      },
      inverseJoinColumn: {
        name: "component_id",
        referencedColumn: "id"
      },
      on: {
        field: attributeName
      },
      orderColumnName: "order",
      orderBy: {
        order: "asc"
      },
      pivotColumns: ["entity_id", "component_id", "field", "component_type"]
    }
  });
};
const createAttribute = (attributeName, attribute) => {
  const columnName = ___default.default.snakeCase(attributeName);
  Object.assign(attribute, { columnName });
};
class Field {
  config;
  constructor(config) {
    this.config = config;
  }
  toDB(value) {
    return value;
  }
  fromDB(value) {
    return value;
  }
}
class StringField extends Field {
  toDB(value) {
    return _.toString(value);
  }
  fromDB(value) {
    return _.toString(value);
  }
}
class JSONField extends Field {
  toDB(value) {
    return JSON.stringify(value);
  }
  fromDB(value) {
    try {
      if (typeof value === "string") {
        return JSON.parse(value);
      }
    } catch (error) {
      return value;
    }
    return value;
  }
}
class BigIntegerField extends StringField {
}
class NumberField extends Field {
  toDB(value) {
    const numberValue = _.toNumber(value);
    if (Number.isNaN(numberValue)) {
      throw new Error(`Expected a valid Number, got ${value}`);
    }
    return numberValue;
  }
  fromDB(value) {
    return _.toNumber(value);
  }
}
const isDate = (value) => {
  return dateFns__namespace.isDate(value);
};
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
const PARTIAL_DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/g;
const TIME_REGEX = /^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]{1,3})?$/;
const parseDateTimeOrTimestamp = (value) => {
  if (isDate(value)) {
    return value;
  }
  try {
    const date = dateFns__namespace.parseISO(_.toString(value));
    if (dateFns__namespace.isValid(date)) {
      return date;
    }
    const milliUnixDate = dateFns__namespace.parse(_.toString(value), "T", /* @__PURE__ */ new Date());
    if (dateFns__namespace.isValid(milliUnixDate)) {
      return milliUnixDate;
    }
    throw new InvalidDateTimeError(`Invalid format, expected a timestamp or an ISO date`);
  } catch (error) {
    throw new InvalidDateTimeError(`Invalid format, expected a timestamp or an ISO date`);
  }
};
const parseDate = (value) => {
  if (isDate(value)) {
    return dateFns__namespace.format(value, "yyyy-MM-dd");
  }
  const found = _.isString(value) ? value.match(PARTIAL_DATE_REGEX) || [] : [];
  const extractedValue = found[0];
  if (extractedValue && !DATE_REGEX.test(_.toString(value))) {
    process.emitWarning(
      `[deprecated] Using a date format other than YYYY-MM-DD will be removed in future versions. Date received: ${value}. Date stored: ${extractedValue}.`
    );
  }
  if (!extractedValue) {
    throw new InvalidDateError(`Invalid format, expected yyyy-MM-dd`);
  }
  const date = dateFns__namespace.parseISO(extractedValue);
  if (!dateFns__namespace.isValid(date)) {
    throw new InvalidDateError(`Invalid date`);
  }
  return extractedValue;
};
const parseTime = (value) => {
  if (isDate(value)) {
    return dateFns__namespace.format(value, "HH:mm:ss.SSS");
  }
  if (typeof value !== "string") {
    throw new InvalidTimeError(`Expected a string, got a ${typeof value}`);
  }
  const result = value.match(TIME_REGEX);
  if (result === null) {
    throw new InvalidTimeError("Invalid time format, expected HH:mm:ss.SSS");
  }
  const [, hours, minutes, seconds, fraction = ".000"] = result;
  const fractionPart = _.padCharsEnd("0", 3, fraction.slice(1));
  return `${hours}:${minutes}:${seconds}.${fractionPart}`;
};
class DateField extends Field {
  toDB(value) {
    return parseDate(value);
  }
  fromDB(value) {
    return value;
  }
}
class TimeField extends Field {
  toDB(value) {
    return parseTime(value);
  }
  fromDB(value) {
    return value;
  }
}
class DatetimeField extends Field {
  toDB(value) {
    return parseDateTimeOrTimestamp(value);
  }
  fromDB(value) {
    const cast = new Date(value);
    return dateFns__namespace.isValid(cast) ? cast.toISOString() : null;
  }
}
class TimestampField extends Field {
  toDB(value) {
    return parseDateTimeOrTimestamp(value);
  }
  fromDB(value) {
    const cast = new Date(value);
    return dateFns__namespace.isValid(cast) ? dateFns__namespace.format(cast, "T") : null;
  }
}
function isStringOrNumber(value) {
  return typeof value === "string" || typeof value === "number";
}
class BooleanField extends Field {
  toDB(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (isStringOrNumber(value) && ["true", "t", "1", 1].includes(value)) {
      return true;
    }
    if (isStringOrNumber(value) && ["false", "f", "0", 0].includes(value)) {
      return false;
    }
    return Boolean(value);
  }
  fromDB(value) {
    if (typeof value === "boolean") {
      return value;
    }
    const strVal = _.toString(value);
    if (strVal === "1") {
      return true;
    }
    if (strVal === "0") {
      return false;
    }
    return null;
  }
}
const typeToFieldMap = {
  increments: Field,
  password: StringField,
  email: StringField,
  string: StringField,
  uid: StringField,
  richtext: StringField,
  text: StringField,
  enumeration: StringField,
  json: JSONField,
  biginteger: BigIntegerField,
  integer: NumberField,
  float: NumberField,
  decimal: NumberField,
  date: DateField,
  time: TimeField,
  datetime: DatetimeField,
  timestamp: TimestampField,
  boolean: BooleanField,
  blocks: JSONField
};
const createField = (attribute) => {
  const { type } = attribute;
  if (___default.default.has(type, typeToFieldMap)) {
    return new typeToFieldMap[type]({});
  }
  throw new Error(`Undefined field for type ${type}`);
};
const fromSingleRow = (meta, row) => {
  const { attributes } = meta;
  if (___default.default.isNil(row)) {
    return null;
  }
  const obj = {};
  for (const column in row) {
    if (!___default.default.has(column, meta.columnToAttribute)) {
      continue;
    }
    const attributeName = meta.columnToAttribute[column];
    const attribute = attributes[attributeName];
    if (isScalar(attribute.type)) {
      const field = createField(attribute);
      const val = row[column] === null ? null : field.fromDB(row[column]);
      obj[attributeName] = val;
    }
    if (isRelation(attribute.type)) {
      obj[attributeName] = row[column];
    }
  }
  return obj;
};
const fromRow = (meta, row) => {
  if (___default.default.isNil(row)) {
    return null;
  }
  if (Array.isArray(row)) {
    return row.map((singleRow) => fromSingleRow(meta, singleRow));
  }
  return fromSingleRow(meta, row);
};
const toSingleRow = (meta, data = {}) => {
  if (___default.default.isNil(data)) {
    return data;
  }
  const { attributes } = meta;
  for (const key of Object.keys(data)) {
    const attribute = attributes[key];
    if (!attribute || !("columnName" in attribute) || !attribute.columnName || attribute.columnName === key) {
      continue;
    }
    data[attribute.columnName] = data[key];
    delete data[key];
  }
  return data;
};
function toRow(meta, data) {
  if (___default.default.isNil(data)) {
    return data;
  }
  if (___default.default.isArray(data)) {
    return data.map((datum) => toSingleRow(meta, datum));
  }
  return toSingleRow(meta, data);
}
const toColumnName = (meta, name) => {
  if (!name) {
    throw new Error("Name cannot be null");
  }
  const attribute = meta.attributes[name];
  if (!attribute) {
    return name;
  }
  return "columnName" in attribute && attribute.columnName || name;
};
const applySearch = (knex2, query, ctx) => {
  const { qb, uid, db } = ctx;
  const meta = db.metadata.get(uid);
  const { attributes } = meta;
  const searchColumns = ["id"];
  const stringColumns = Object.keys(attributes).filter((attributeName) => {
    const attribute = attributes[attributeName];
    return isScalarAttribute(attribute) && isString(attribute.type) && attribute.searchable !== false;
  });
  searchColumns.push(...stringColumns);
  if (!___default.default.isNaN(___default.default.toNumber(query))) {
    const numberColumns = Object.keys(attributes).filter((attributeName) => {
      const attribute = attributes[attributeName];
      return isScalarAttribute(attribute) && isNumber(attribute.type) && attribute.searchable !== false;
    });
    searchColumns.push(...numberColumns);
  }
  switch (db.dialect.client) {
    case "postgres": {
      searchColumns.forEach((attr) => {
        const columnName = toColumnName(meta, attr);
        return knex2.orWhereRaw(`??::text ILIKE ?`, [
          qb.aliasColumn(columnName),
          `%${escapeQuery(query, "*%\\")}%`
        ]);
      });
      break;
    }
    case "sqlite": {
      searchColumns.forEach((attr) => {
        const columnName = toColumnName(meta, attr);
        return knex2.orWhereRaw(`?? LIKE ? ESCAPE '\\'`, [
          qb.aliasColumn(columnName),
          `%${escapeQuery(query, "*%\\")}%`
        ]);
      });
      break;
    }
    case "mysql": {
      searchColumns.forEach((attr) => {
        const columnName = toColumnName(meta, attr);
        return knex2.orWhereRaw(`?? LIKE ?`, [
          qb.aliasColumn(columnName),
          `%${escapeQuery(query, "*%\\")}%`
        ]);
      });
      break;
    }
  }
};
const escapeQuery = (query, charsToEscape, escapeChar = "\\") => {
  return query.split("").reduce(
    (escapedQuery, char) => charsToEscape.includes(char) ? `${escapedQuery}${escapeChar}${char}` : `${escapedQuery}${char}`,
    ""
  );
};
const createPivotJoin = (ctx, { alias, refAlias, joinTable, targetMeta }) => {
  const { qb } = ctx;
  const joinAlias = qb.getAlias();
  qb.join({
    alias: joinAlias,
    referencedTable: joinTable.name,
    referencedColumn: joinTable.joinColumn.name,
    rootColumn: joinTable.joinColumn.referencedColumn,
    rootTable: alias,
    on: joinTable.on
  });
  const subAlias = refAlias || qb.getAlias();
  qb.join({
    alias: subAlias,
    referencedTable: targetMeta.tableName,
    referencedColumn: joinTable.inverseJoinColumn.referencedColumn,
    rootColumn: joinTable.inverseJoinColumn.name,
    rootTable: joinAlias
  });
  return subAlias;
};
const createJoin = (ctx, { alias, refAlias, attributeName, attribute }) => {
  const { db, qb, uid } = ctx;
  if (attribute.type !== "relation") {
    throw new Error(`Cannot join on non relational field ${attributeName}`);
  }
  const targetMeta = db.metadata.get(attribute.target);
  if (["morphOne", "morphMany"].includes(attribute.relation)) {
    const targetAttribute = targetMeta.attributes[attribute.morphBy];
    const { joinTable: joinTable2, morphColumn } = targetAttribute;
    if (morphColumn) {
      const subAlias = refAlias || qb.getAlias();
      qb.join({
        alias: subAlias,
        referencedTable: targetMeta.tableName,
        referencedColumn: morphColumn.idColumn.name,
        rootColumn: morphColumn.idColumn.referencedColumn,
        rootTable: alias,
        on: {
          [morphColumn.typeColumn.name]: uid,
          ...morphColumn.on
        }
      });
      return subAlias;
    }
    if (joinTable2) {
      const joinAlias = qb.getAlias();
      qb.join({
        alias: joinAlias,
        referencedTable: joinTable2.name,
        referencedColumn: joinTable2.morphColumn.idColumn.name,
        rootColumn: joinTable2.morphColumn.idColumn.referencedColumn,
        rootTable: alias,
        on: {
          [joinTable2.morphColumn.typeColumn.name]: uid,
          field: attributeName
        }
      });
      const subAlias = refAlias || qb.getAlias();
      qb.join({
        alias: subAlias,
        referencedTable: targetMeta.tableName,
        referencedColumn: joinTable2.joinColumn.referencedColumn,
        rootColumn: joinTable2.joinColumn.name,
        rootTable: joinAlias
      });
      return subAlias;
    }
    return alias;
  }
  const { joinColumn } = attribute;
  if (joinColumn) {
    const subAlias = refAlias || qb.getAlias();
    qb.join({
      alias: subAlias,
      referencedTable: targetMeta.tableName,
      referencedColumn: joinColumn.referencedColumn,
      rootColumn: joinColumn.name,
      rootTable: alias
    });
    return subAlias;
  }
  const { joinTable } = attribute;
  if (joinTable) {
    return createPivotJoin(ctx, { alias, refAlias, joinTable, targetMeta });
  }
  return alias;
};
const applyJoin = (qb, join) => {
  const {
    method = "leftJoin",
    alias,
    referencedTable,
    referencedColumn,
    rootColumn,
    // FIXME: qb.alias can't exist here
    rootTable,
    // = qb.alias
    on,
    orderBy
  } = join;
  qb[method](`${referencedTable} as ${alias}`, (inner) => {
    inner.on(`${rootTable}.${rootColumn}`, `${alias}.${referencedColumn}`);
    if (on) {
      for (const key of Object.keys(on)) {
        inner.onVal(`${alias}.${key}`, on[key]);
      }
    }
  });
  if (orderBy) {
    Object.keys(orderBy).forEach((column) => {
      const direction = orderBy[column];
      qb.orderBy(`${alias}.${column}`, direction);
    });
  }
};
const applyJoins = (qb, joins) => {
  return joins.forEach((join) => applyJoin(qb, join));
};
const processOrderBy = (orderBy, ctx) => {
  const { db, uid, qb, alias } = ctx;
  const meta = db.metadata.get(uid);
  const { attributes } = meta;
  if (typeof orderBy === "string") {
    const attribute = attributes[orderBy];
    if (!attribute) {
      throw new Error(`Attribute ${orderBy} not found on model ${uid}`);
    }
    const columnName = toColumnName(meta, orderBy);
    return [{ column: qb.aliasColumn(columnName, alias) }];
  }
  if (Array.isArray(orderBy)) {
    return orderBy.flatMap((value) => processOrderBy(value, ctx));
  }
  if (___default.default.isPlainObject(orderBy)) {
    return Object.entries(orderBy).flatMap(([key, direction]) => {
      const value = orderBy[key];
      const attribute = attributes[key];
      if (!attribute) {
        throw new Error(`Attribute ${key} not found on model ${uid}`);
      }
      if (isScalar(attribute.type)) {
        const columnName = toColumnName(meta, key);
        return { column: qb.aliasColumn(columnName, alias), order: direction };
      }
      if (attribute.type === "relation" && "target" in attribute) {
        const subAlias = createJoin(ctx, {
          alias: alias || qb.alias,
          attributeName: key,
          attribute
        });
        return processOrderBy(value, {
          db,
          qb,
          alias: subAlias,
          uid: attribute.target
        });
      }
      throw new Error(`You cannot order on ${attribute.type} types`);
    });
  }
  throw new Error("Invalid orderBy syntax");
};
const joinColPrefix = "__strapi";
const XtoOne = async (input, ctx) => {
  const { attribute, attributeName, results, populateValue, targetMeta, isCount } = input;
  const { db, qb } = ctx;
  const fromTargetRow = (rowOrRows) => fromRow(targetMeta, rowOrRows);
  if ("joinColumn" in attribute && attribute.joinColumn) {
    const { name: joinColumnName, referencedColumn: referencedColumnName } = attribute.joinColumn;
    const referencedValues = ___default.default.uniq(
      results.map((r) => r[joinColumnName]).filter((value) => !___default.default.isNil(value))
    );
    if (___default.default.isEmpty(referencedValues)) {
      results.forEach((result) => {
        result[attributeName] = null;
      });
      return;
    }
    const rows = await db.entityManager.createQueryBuilder(targetMeta.uid).init(populateValue).addSelect(`${qb.alias}.${referencedColumnName}`).where({ [referencedColumnName]: referencedValues }).execute({ mapResults: false });
    const map = ___default.default.groupBy(referencedColumnName)(rows);
    results.forEach((result) => {
      result[attributeName] = fromTargetRow(___default.default.first(map[result[joinColumnName]]));
    });
    return;
  }
  if ("joinTable" in attribute && attribute.joinTable) {
    const { joinTable } = attribute;
    const qb2 = db.entityManager.createQueryBuilder(targetMeta.uid);
    const { name: joinColumnName, referencedColumn: referencedColumnName } = joinTable.joinColumn;
    const alias = qb2.getAlias();
    const joinColAlias = `${alias}.${joinColumnName}`;
    const joinColRenameAs = `${joinColPrefix}${joinColumnName}`;
    const joinColSelect = `${joinColAlias} as ${joinColRenameAs}`;
    const referencedValues = ___default.default.uniq(
      results.map((r) => r[referencedColumnName]).filter((value) => !___default.default.isNil(value))
    );
    if (isCount) {
      if (___default.default.isEmpty(referencedValues)) {
        results.forEach((result) => {
          result[attributeName] = { count: 0 };
        });
        return;
      }
      const rows2 = await qb2.init(populateValue).join({
        alias,
        referencedTable: joinTable.name,
        referencedColumn: joinTable.inverseJoinColumn.name,
        rootColumn: joinTable.inverseJoinColumn.referencedColumn,
        rootTable: qb2.alias,
        on: joinTable.on
      }).select([joinColAlias, qb2.raw("count(*) AS count")]).where({ [joinColAlias]: referencedValues }).groupBy(joinColAlias).execute({ mapResults: false });
      const map2 = rows2.reduce((map3, row) => {
        map3[row[joinColumnName]] = { count: Number(row.count) };
        return map3;
      }, {});
      results.forEach((result) => {
        result[attributeName] = map2[result[referencedColumnName]] || { count: 0 };
      });
      return;
    }
    if (___default.default.isEmpty(referencedValues)) {
      results.forEach((result) => {
        result[attributeName] = null;
      });
      return;
    }
    const rows = await qb2.init(populateValue).join({
      alias,
      referencedTable: joinTable.name,
      referencedColumn: joinTable.inverseJoinColumn.name,
      rootColumn: joinTable.inverseJoinColumn.referencedColumn,
      rootTable: qb2.alias,
      on: joinTable.on,
      orderBy: joinTable.orderBy
    }).addSelect(joinColSelect).where({ [joinColAlias]: referencedValues }).execute({ mapResults: false });
    const map = ___default.default.groupBy(joinColRenameAs)(rows);
    results.forEach((result) => {
      result[attributeName] = fromTargetRow(___default.default.first(map[result[referencedColumnName]]));
    });
  }
};
const oneToMany = async (input, ctx) => {
  const { attribute, attributeName, results, populateValue, targetMeta, isCount } = input;
  const { db, qb } = ctx;
  const fromTargetRow = (rowOrRows) => fromRow(targetMeta, rowOrRows);
  if ("joinColumn" in attribute && attribute.joinColumn) {
    const { name: joinColumnName, referencedColumn: referencedColumnName } = attribute.joinColumn;
    const referencedValues = ___default.default.uniq(
      results.map((r) => r[joinColumnName]).filter((value) => !___default.default.isNil(value))
    );
    if (___default.default.isEmpty(referencedValues)) {
      results.forEach((result) => {
        result[attributeName] = null;
      });
      return;
    }
    const rows = await db.entityManager.createQueryBuilder(targetMeta.uid).init(populateValue).addSelect(`${qb.alias}.${referencedColumnName}`).where({ [referencedColumnName]: referencedValues }).execute({ mapResults: false });
    const map = ___default.default.groupBy(referencedColumnName)(rows);
    results.forEach((result) => {
      result[attributeName] = fromTargetRow(map[result[joinColumnName]] || []);
    });
    return;
  }
  if ("joinTable" in attribute && attribute.joinTable) {
    const { joinTable } = attribute;
    const qb2 = db.entityManager.createQueryBuilder(targetMeta.uid);
    const { name: joinColumnName, referencedColumn: referencedColumnName } = joinTable.joinColumn;
    const alias = qb2.getAlias();
    const joinColAlias = `${alias}.${joinColumnName}`;
    const joinColRenameAs = `${joinColPrefix}${joinColumnName}`;
    const joinColSelect = `${joinColAlias} as ${joinColRenameAs}`;
    const referencedValues = ___default.default.uniq(
      results.map((r) => r[referencedColumnName]).filter((value) => !___default.default.isNil(value))
    );
    if (isCount) {
      if (___default.default.isEmpty(referencedValues)) {
        results.forEach((result) => {
          result[attributeName] = { count: 0 };
        });
        return;
      }
      const rows2 = await qb2.init(populateValue).join({
        alias,
        referencedTable: joinTable.name,
        referencedColumn: joinTable.inverseJoinColumn.name,
        rootColumn: joinTable.inverseJoinColumn.referencedColumn,
        rootTable: qb2.alias,
        on: joinTable.on
      }).select([joinColSelect, qb2.raw("count(*) AS count")]).where({ [joinColAlias]: referencedValues }).groupBy(joinColAlias).execute({ mapResults: false });
      const map2 = rows2.reduce((map3, row) => {
        map3[row[joinColRenameAs]] = { count: Number(row.count) };
        return map3;
      }, {});
      results.forEach((result) => {
        result[attributeName] = map2[result[referencedColumnName]] || { count: 0 };
      });
      return;
    }
    if (___default.default.isEmpty(referencedValues)) {
      results.forEach((result) => {
        result[attributeName] = [];
      });
      return;
    }
    const rows = await qb2.init(populateValue).join({
      alias,
      referencedTable: joinTable.name,
      referencedColumn: joinTable.inverseJoinColumn.name,
      rootColumn: joinTable.inverseJoinColumn.referencedColumn,
      rootTable: qb2.alias,
      on: joinTable.on,
      orderBy: ___default.default.mapValues((v) => populateValue.ordering || v, joinTable.orderBy)
    }).addSelect(joinColSelect).where({ [joinColAlias]: referencedValues }).execute({ mapResults: false });
    const map = ___default.default.groupBy(joinColRenameAs)(rows);
    results.forEach((r) => {
      r[attributeName] = fromTargetRow(map[r[referencedColumnName]] || []);
    });
  }
};
const manyToMany = async (input, ctx) => {
  const { attribute, attributeName, results, populateValue, targetMeta, isCount } = input;
  const { db } = ctx;
  const fromTargetRow = (rowOrRows) => fromRow(targetMeta, rowOrRows);
  const { joinTable } = attribute;
  const populateQb = db.entityManager.createQueryBuilder(targetMeta.uid);
  const { name: joinColumnName, referencedColumn: referencedColumnName } = joinTable.joinColumn;
  const alias = populateQb.getAlias();
  const joinColAlias = `${alias}.${joinColumnName}`;
  const joinColRenameAs = `${joinColPrefix}${joinColumnName}`;
  const joinColSelect = `${joinColAlias} as ${joinColRenameAs}`;
  const referencedValues = ___default.default.uniq(
    results.map((r) => r[referencedColumnName]).filter((value) => !___default.default.isNil(value))
  );
  if (isCount) {
    if (___default.default.isEmpty(referencedValues)) {
      results.forEach((result) => {
        result[attributeName] = { count: 0 };
      });
      return;
    }
    const rows2 = await populateQb.init(populateValue).join({
      alias,
      referencedTable: joinTable.name,
      referencedColumn: joinTable.inverseJoinColumn.name,
      rootColumn: joinTable.inverseJoinColumn.referencedColumn,
      rootTable: populateQb.alias,
      on: joinTable.on
    }).select([joinColAlias, populateQb.raw("count(*) AS count")]).where({ [joinColAlias]: referencedValues }).groupBy(joinColAlias).execute({ mapResults: false });
    const map2 = rows2.reduce((map3, row) => {
      map3[row[joinColumnName]] = { count: Number(row.count) };
      return map3;
    }, {});
    results.forEach((result) => {
      result[attributeName] = map2[result[referencedColumnName]] || { count: 0 };
    });
    return;
  }
  if (___default.default.isEmpty(referencedValues)) {
    results.forEach((result) => {
      result[attributeName] = [];
    });
    return;
  }
  const rows = await populateQb.init(populateValue).join({
    alias,
    referencedTable: joinTable.name,
    referencedColumn: joinTable.inverseJoinColumn.name,
    rootColumn: joinTable.inverseJoinColumn.referencedColumn,
    rootTable: populateQb.alias,
    on: joinTable.on,
    orderBy: ___default.default.mapValues((v) => populateValue.ordering || v, joinTable.orderBy)
  }).addSelect(joinColSelect).where({ [joinColAlias]: referencedValues }).execute({ mapResults: false });
  const map = ___default.default.groupBy(joinColRenameAs)(rows);
  results.forEach((result) => {
    result[attributeName] = fromTargetRow(map[result[referencedColumnName]] || []);
  });
};
const morphX = async (input, ctx) => {
  const { attribute, attributeName, results, populateValue, targetMeta } = input;
  const { db, uid } = ctx;
  const fromTargetRow = (rowOrRows) => fromRow(targetMeta, rowOrRows);
  const { target, morphBy } = attribute;
  const targetAttribute = db.metadata.get(target).attributes[morphBy];
  if (targetAttribute.type === "relation" && targetAttribute.relation === "morphToOne") {
    const { idColumn, typeColumn } = targetAttribute.morphColumn;
    const referencedValues = ___default.default.uniq(
      results.map((r) => r[idColumn.referencedColumn]).filter((value) => !___default.default.isNil(value))
    );
    if (___default.default.isEmpty(referencedValues)) {
      results.forEach((result) => {
        result[attributeName] = null;
      });
      return;
    }
    const rows = await db.entityManager.createQueryBuilder(target).init(populateValue).where({ [idColumn.name]: referencedValues, [typeColumn.name]: uid }).execute({ mapResults: false });
    const map = ___default.default.groupBy(idColumn.name)(rows);
    results.forEach((result) => {
      const matchingRows = map[result[idColumn.referencedColumn]];
      const matchingValue = attribute.relation === "morphOne" ? ___default.default.first(matchingRows) : matchingRows;
      result[attributeName] = fromTargetRow(matchingValue);
    });
  } else if (targetAttribute.type === "relation" && targetAttribute.relation === "morphToMany") {
    const { joinTable } = targetAttribute;
    const { joinColumn, morphColumn } = joinTable;
    const { idColumn, typeColumn } = morphColumn;
    const referencedValues = ___default.default.uniq(
      results.map((r) => r[idColumn.referencedColumn]).filter((value) => !___default.default.isNil(value))
    );
    if (___default.default.isEmpty(referencedValues)) {
      results.forEach((result) => {
        result[attributeName] = attribute.relation === "morphOne" ? null : [];
      });
      return;
    }
    const qb = db.entityManager.createQueryBuilder(target);
    const alias = qb.getAlias();
    const rows = await qb.init(populateValue).join({
      alias,
      referencedTable: joinTable.name,
      referencedColumn: joinColumn.name,
      rootColumn: joinColumn.referencedColumn,
      rootTable: qb.alias,
      on: {
        ...joinTable.on || {},
        field: attributeName
      },
      orderBy: ___default.default.mapValues((v) => populateValue.ordering || v, joinTable.orderBy)
    }).addSelect([`${alias}.${idColumn.name}`, `${alias}.${typeColumn.name}`]).where({
      [`${alias}.${idColumn.name}`]: referencedValues,
      [`${alias}.${typeColumn.name}`]: uid
    }).execute({ mapResults: false });
    const map = ___default.default.groupBy(idColumn.name)(rows);
    results.forEach((result) => {
      const matchingRows = map[result[idColumn.referencedColumn]];
      const matchingValue = attribute.relation === "morphOne" ? ___default.default.first(matchingRows) : matchingRows;
      result[attributeName] = fromTargetRow(matchingValue);
    });
  }
};
const morphToMany = async (input, ctx) => {
  const { attribute, attributeName, results, populateValue } = input;
  const { db } = ctx;
  const { joinTable } = attribute;
  const { joinColumn, morphColumn } = joinTable;
  const { idColumn, typeColumn, typeField = "__type" } = morphColumn;
  const referencedValues = ___default.default.uniq(
    results.map((r) => r[joinColumn.referencedColumn]).filter((value) => !___default.default.isNil(value))
  );
  const qb = db.entityManager.createQueryBuilder(joinTable.name);
  const joinRows = await qb.where({
    [joinColumn.name]: referencedValues,
    ...joinTable.on || {},
    // If the populateValue contains an "on" property,
    // only populate the types defined in it
    ..."on" in populateValue ? { [morphColumn.typeColumn.name]: Object.keys(populateValue.on ?? {}) } : {}
  }).orderBy([joinColumn.name, "order"]).execute({ mapResults: false });
  const joinMap = ___default.default.groupBy(joinColumn.name, joinRows);
  const idsByType = joinRows.reduce((acc, result) => {
    const idValue = result[morphColumn.idColumn.name];
    const typeValue = result[morphColumn.typeColumn.name];
    if (!idValue || !typeValue) {
      return acc;
    }
    if (!___default.default.has(typeValue, acc)) {
      acc[typeValue] = [];
    }
    acc[typeValue].push(idValue);
    return acc;
  }, {});
  const map = {};
  const { on, ...typePopulate } = populateValue;
  for (const type of Object.keys(idsByType)) {
    const ids = idsByType[type];
    if (!db.metadata.get(type)) {
      map[type] = {};
      continue;
    }
    const qb2 = db.entityManager.createQueryBuilder(type);
    const rows = await qb2.init(on?.[type] ?? typePopulate).addSelect(`${qb2.alias}.${idColumn.referencedColumn}`).where({ [idColumn.referencedColumn]: ids }).execute({ mapResults: false });
    map[type] = ___default.default.groupBy(idColumn.referencedColumn)(rows);
  }
  results.forEach((result) => {
    const joinResults = joinMap[result[joinColumn.referencedColumn]] || [];
    const matchingRows = joinResults.flatMap((joinResult) => {
      const id = joinResult[idColumn.name];
      const type = joinResult[typeColumn.name];
      const targetMeta = db.metadata.get(type);
      const fromTargetRow = (rowOrRows) => fromRow(targetMeta, rowOrRows);
      return (map[type][id] || []).map((row) => {
        return {
          [typeField]: type,
          ...fromTargetRow(row)
        };
      });
    });
    result[attributeName] = matchingRows;
  });
};
const morphToOne = async (input, ctx) => {
  const { attribute, attributeName, results, populateValue } = input;
  const { db } = ctx;
  const { morphColumn } = attribute;
  const { idColumn, typeColumn } = morphColumn;
  const idsByType = results.reduce((acc, result) => {
    const idValue = result[morphColumn.idColumn.name];
    const typeValue = result[morphColumn.typeColumn.name];
    if (!idValue || !typeValue) {
      return acc;
    }
    if (!(typeValue in acc)) {
      acc[typeValue] = [];
    }
    acc[typeValue].push(idValue);
    return acc;
  }, {});
  const map = {};
  const { on, ...typePopulate } = populateValue;
  for (const type of Object.keys(idsByType)) {
    const ids = idsByType[type];
    if (!db.metadata.get(type)) {
      map[type] = {};
      return;
    }
    const qb = db.entityManager.createQueryBuilder(type);
    const rows = await qb.init(on?.[type] ?? typePopulate).addSelect(`${qb.alias}.${idColumn.referencedColumn}`).where({ [idColumn.referencedColumn]: ids }).execute({ mapResults: false });
    map[type] = ___default.default.groupBy(idColumn.referencedColumn)(rows);
  }
  results.forEach((result) => {
    const id = result[idColumn.name];
    const type = result[typeColumn.name];
    if (!type || !id) {
      result[attributeName] = null;
      return;
    }
    const matchingRows = map[type][id];
    const fromTargetRow = (rowOrRows) => fromRow(db.metadata.get(type), rowOrRows);
    result[attributeName] = fromTargetRow(___default.default.first(matchingRows));
  });
};
const pickPopulateParams = (populate) => {
  const fieldsToPick = [
    "select",
    "count",
    "where",
    "populate",
    "orderBy",
    "filters",
    "ordering",
    "on"
  ];
  if (populate.count !== true) {
    fieldsToPick.push("limit", "offset");
  }
  return ___default.default.pick(fieldsToPick, populate);
};
const applyPopulate = async (results, populate, ctx) => {
  const { db, uid, qb } = ctx;
  const meta = db.metadata.get(uid);
  if (___default.default.isEmpty(results)) {
    return results;
  }
  for (const attributeName of Object.keys(populate)) {
    const attribute = meta.attributes[attributeName];
    if (attribute.type !== "relation") {
      throw new Error(`Invalid populate attribute ${attributeName}`);
    }
    const populateValue = {
      filters: qb.state.filters,
      ...pickPopulateParams(populate[attributeName])
    };
    const isCount = "count" in populateValue && populateValue.count === true;
    switch (attribute.relation) {
      case "oneToOne":
      case "manyToOne": {
        const targetMeta = db.metadata.get(attribute.target);
        const input = { attribute, attributeName, results, populateValue, targetMeta, isCount };
        await XtoOne(input, ctx);
        break;
      }
      case "oneToMany": {
        const targetMeta = db.metadata.get(attribute.target);
        const input = { attribute, attributeName, results, populateValue, targetMeta, isCount };
        await oneToMany(input, ctx);
        break;
      }
      case "manyToMany": {
        const targetMeta = db.metadata.get(attribute.target);
        const input = { attribute, attributeName, results, populateValue, targetMeta, isCount };
        await manyToMany(input, ctx);
        break;
      }
      case "morphOne":
      case "morphMany": {
        const targetMeta = db.metadata.get(attribute.target);
        const input = { attribute, attributeName, results, populateValue, targetMeta, isCount };
        await morphX(input, ctx);
        break;
      }
      case "morphToMany": {
        const input = { attribute, attributeName, results, populateValue, isCount };
        await morphToMany(input, ctx);
        break;
      }
      case "morphToOne": {
        const input = { attribute, attributeName, results, populateValue, isCount };
        await morphToOne(input, ctx);
        break;
      }
    }
  }
};
const getRootLevelPopulate = (meta) => {
  const populate = {};
  for (const attributeName of Object.keys(meta.attributes)) {
    const attribute = meta.attributes[attributeName];
    if (attribute.type === "relation") {
      populate[attributeName] = true;
    }
  }
  return populate;
};
const processPopulate = (populate, ctx) => {
  const { qb, db, uid } = ctx;
  const meta = db.metadata.get(uid);
  let populateMap = {};
  if (populate === false || ___default.default.isNil(populate)) {
    return null;
  }
  if (populate === true) {
    populateMap = getRootLevelPopulate(meta);
  } else if (Array.isArray(populate)) {
    for (const key of populate) {
      const [root, ...rest] = key.split(".");
      if (rest.length > 0) {
        const subPopulate = rest.join(".");
        if (populateMap[root]) {
          const populateValue = populateMap[root];
          if (populateValue === true) {
            populateMap[root] = {
              populate: [subPopulate]
            };
          } else {
            populateValue.populate = [subPopulate].concat(populateValue.populate ?? []);
          }
        } else {
          populateMap[root] = {
            populate: [subPopulate]
          };
        }
      } else {
        populateMap[root] = populateMap[root] ? populateMap[root] : true;
      }
    }
  } else {
    populateMap = populate;
  }
  if (!___default.default.isPlainObject(populateMap)) {
    throw new Error("Populate must be an object");
  }
  const finalPopulate = {};
  for (const key of Object.keys(populateMap)) {
    const attribute = meta.attributes[key];
    if (!attribute) {
      continue;
    }
    if (!isRelation(attribute.type)) {
      continue;
    }
    if ("joinColumn" in attribute && attribute.joinColumn) {
      qb.addSelect(attribute.joinColumn.name);
    }
    if (___default.default.has("id", meta.attributes)) {
      qb.addSelect("id");
    }
    finalPopulate[key] = populateMap[key];
  }
  return finalPopulate;
};
function isKnexQuery(value) {
  return value instanceof KnexBuilder__default.default || value instanceof KnexRaw__default.default;
}
const addSchema = (db, tableName) => {
  const schemaName = db.getSchemaName();
  return schemaName ? `${schemaName}.${tableName}` : tableName;
};
const isRecord$1 = (value) => _.isPlainObject(value);
const castValue = (value, attribute) => {
  if (!attribute) {
    return value;
  }
  if (isScalar(attribute.type) && !isKnexQuery(value)) {
    const field = createField(attribute);
    return value === null ? null : field.toDB(value);
  }
  return value;
};
const processSingleAttributeWhere = (attribute, where, operator = "$eq") => {
  if (!isRecord$1(where)) {
    if (utils.isOperatorOfType("cast", operator)) {
      return castValue(where, attribute);
    }
    return where;
  }
  const filters = {};
  for (const key of Object.keys(where)) {
    const value = where[key];
    if (!utils.isOperatorOfType("where", key)) {
      throw new Error(`Undefined attribute level operator ${key}`);
    }
    filters[key] = processAttributeWhere(attribute, value, key);
  }
  return filters;
};
const processAttributeWhere = (attribute, where, operator = "$eq") => {
  if (_.isArray(where)) {
    return where.map((sub) => processSingleAttributeWhere(attribute, sub, operator));
  }
  return processSingleAttributeWhere(attribute, where, operator);
};
const processNested = (where, ctx) => {
  if (!isRecord$1(where)) {
    return where;
  }
  return processWhere(where, ctx);
};
const processRelationWhere = (where, ctx) => {
  const { qb, alias } = ctx;
  const idAlias = qb.aliasColumn("id", alias);
  if (!isRecord$1(where)) {
    return { [idAlias]: where };
  }
  const keys = Object.keys(where);
  const operatorKeys = keys.filter((key) => utils.isOperator(key));
  if (operatorKeys.length > 0 && operatorKeys.length !== keys.length) {
    throw new Error(`Operator and non-operator keys cannot be mixed in a relation where clause`);
  }
  if (operatorKeys.length > 1) {
    throw new Error(
      `Only one operator key is allowed in a relation where clause, but found: ${operatorKeys}`
    );
  }
  if (operatorKeys.length === 1) {
    const operator = operatorKeys[0];
    if (utils.isOperatorOfType("group", operator)) {
      return processWhere(where, ctx);
    }
    return { [idAlias]: { [operator]: processNested(where[operator], ctx) } };
  }
  return processWhere(where, ctx);
};
function processWhere(where, ctx) {
  if (!_.isArray(where) && !isRecord$1(where)) {
    throw new Error("Where must be an array or an object");
  }
  if (_.isArray(where)) {
    return where.map((sub) => processWhere(sub, ctx));
  }
  const { db, uid, qb, alias } = ctx;
  const meta = db.metadata.get(uid);
  const filters = {};
  for (const key of Object.keys(where)) {
    const value = where[key];
    if (utils.isOperatorOfType("group", key)) {
      if (!Array.isArray(value)) {
        throw new Error(`Operator ${key} must be an array`);
      }
      filters[key] = value.map((sub) => processNested(sub, ctx));
      continue;
    }
    if (key === "$not") {
      filters[key] = processNested(value, ctx);
      continue;
    }
    if (utils.isOperatorOfType("where", key)) {
      throw new Error(
        `Only $and, $or and $not can only be used as root level operators. Found ${key}.`
      );
    }
    const attribute = meta.attributes[key];
    if (!attribute) {
      filters[qb.aliasColumn(key, alias)] = processAttributeWhere(null, value);
      continue;
    }
    if (isRelation(attribute.type) && "target" in attribute) {
      const subAlias = createJoin(ctx, {
        alias: alias || qb.alias,
        attributeName: key,
        attribute
      });
      const nestedWhere = processRelationWhere(value, {
        db,
        qb,
        alias: subAlias,
        uid: attribute.target
      });
      Object.assign(filters, nestedWhere);
      continue;
    }
    if (isScalar(attribute.type)) {
      const columnName = toColumnName(meta, key);
      const aliasedColumnName = qb.aliasColumn(columnName, alias);
      filters[aliasedColumnName] = processAttributeWhere(attribute, value);
      continue;
    }
    throw new Error(`You cannot filter on ${attribute.type} types`);
  }
  return filters;
}
const applyOperator = (qb, column, operator, value) => {
  if (Array.isArray(value) && !utils.isOperatorOfType("array", operator)) {
    return qb.where((subQB) => {
      value.forEach(
        (subValue) => subQB.orWhere((innerQB) => {
          applyOperator(innerQB, column, operator, subValue);
        })
      );
    });
  }
  switch (operator) {
    case "$not": {
      qb.whereNot((qb2) => applyWhereToColumn(qb2, column, value));
      break;
    }
    case "$in": {
      qb.whereIn(column, isKnexQuery(value) ? value : _.castArray(value));
      break;
    }
    case "$notIn": {
      qb.whereNotIn(column, isKnexQuery(value) ? value : _.castArray(value));
      break;
    }
    case "$eq": {
      if (value === null) {
        qb.whereNull(column);
        break;
      }
      qb.where(column, value);
      break;
    }
    case "$eqi": {
      if (value === null) {
        qb.whereNull(column);
        break;
      }
      qb.whereRaw(`${fieldLowerFn(qb)} LIKE LOWER(?)`, [column, `${value}`]);
      break;
    }
    case "$ne": {
      if (value === null) {
        qb.whereNotNull(column);
        break;
      }
      qb.where(column, "<>", value);
      break;
    }
    case "$nei": {
      if (value === null) {
        qb.whereNotNull(column);
        break;
      }
      qb.whereRaw(`${fieldLowerFn(qb)} NOT LIKE LOWER(?)`, [column, `${value}`]);
      break;
    }
    case "$gt": {
      qb.where(column, ">", value);
      break;
    }
    case "$gte": {
      qb.where(column, ">=", value);
      break;
    }
    case "$lt": {
      qb.where(column, "<", value);
      break;
    }
    case "$lte": {
      qb.where(column, "<=", value);
      break;
    }
    case "$null": {
      if (value) {
        qb.whereNull(column);
      } else {
        qb.whereNotNull(column);
      }
      break;
    }
    case "$notNull": {
      if (value) {
        qb.whereNotNull(column);
      } else {
        qb.whereNull(column);
      }
      break;
    }
    case "$between": {
      qb.whereBetween(column, value);
      break;
    }
    case "$startsWith": {
      qb.where(column, "like", `${value}%`);
      break;
    }
    case "$startsWithi": {
      qb.whereRaw(`${fieldLowerFn(qb)} LIKE LOWER(?)`, [column, `${value}%`]);
      break;
    }
    case "$endsWith": {
      qb.where(column, "like", `%${value}`);
      break;
    }
    case "$endsWithi": {
      qb.whereRaw(`${fieldLowerFn(qb)} LIKE LOWER(?)`, [column, `%${value}`]);
      break;
    }
    case "$contains": {
      qb.where(column, "like", `%${value}%`);
      break;
    }
    case "$notContains": {
      qb.whereNot(column, "like", `%${value}%`);
      break;
    }
    case "$containsi": {
      qb.whereRaw(`${fieldLowerFn(qb)} LIKE LOWER(?)`, [column, `%${value}%`]);
      break;
    }
    case "$notContainsi": {
      qb.whereRaw(`${fieldLowerFn(qb)} NOT LIKE LOWER(?)`, [column, `%${value}%`]);
      break;
    }
    case "$jsonSupersetOf": {
      qb.whereJsonSupersetOf(column, value);
      break;
    }
    default: {
      throw new Error(`Undefined attribute level operator ${operator}`);
    }
  }
};
const applyWhereToColumn = (qb, column, columnWhere) => {
  if (!isRecord$1(columnWhere)) {
    if (Array.isArray(columnWhere)) {
      return qb.whereIn(column, columnWhere);
    }
    return qb.where(column, columnWhere);
  }
  const keys = Object.keys(columnWhere);
  keys.forEach((operator) => {
    const value = columnWhere[operator];
    applyOperator(qb, column, operator, value);
  });
};
const applyWhere = (qb, where) => {
  if (!_.isArray(where) && !isRecord$1(where)) {
    throw new Error("Where must be an array or an object");
  }
  if (_.isArray(where)) {
    return qb.where(
      (subQB) => where.forEach((subWhere) => applyWhere(subQB, subWhere))
    );
  }
  Object.keys(where).forEach((key) => {
    if (key === "$and") {
      const value = where[key] ?? [];
      return qb.where((subQB) => {
        value.forEach((v) => applyWhere(subQB, v));
      });
    }
    if (key === "$or") {
      const value = where[key] ?? [];
      return qb.where((subQB) => {
        value.forEach((v) => subQB.orWhere((inner) => applyWhere(inner, v)));
      });
    }
    if (key === "$not") {
      const value = where[key] ?? {};
      return qb.whereNot((qb2) => applyWhere(qb2, value));
    }
    applyWhereToColumn(qb, key, where[key]);
  });
};
const fieldLowerFn = (qb) => {
  if (qb.client.config.client === "postgres") {
    return "LOWER(CAST(?? AS VARCHAR))";
  }
  return "LOWER(??)";
};
const knexQueryDone = Symbol("knexQueryDone");
const knexPerformingQuery = Symbol("knexPerformingQuery");
class ReadableStrapiQuery extends stream.Readable {
  _offset;
  _limit;
  _fetched;
  _query;
  _qb;
  _db;
  _uid;
  _meta;
  _batchSize;
  _mapResults;
  [knexPerformingQuery];
  constructor({ qb, db, uid, mapResults = true, batchSize = 500 }) {
    super({ objectMode: true, highWaterMark: batchSize });
    const { offset, limit } = qb.state;
    this._offset = _.isFinite(offset) ? Number(offset) : 0;
    this._limit = _.isFinite(limit) ? Number(limit) : null;
    this._fetched = 0;
    this._query = qb.getKnexQuery();
    this._qb = qb;
    this._db = db;
    this._uid = uid;
    this._meta = db.metadata.get(uid);
    this._batchSize = batchSize;
    this._mapResults = mapResults;
    this[knexPerformingQuery] = false;
  }
  _destroy(err, cb) {
    if (this[knexPerformingQuery]) {
      this.once(knexQueryDone, (er) => cb(err || er));
    } else {
      cb(err);
    }
  }
  /**
   * Custom ._read() implementation
   *
   *  NOTE: Here "size" means the number of entities to be read from the database.
   *  Not the actual byte size, as it would means that we need to return partial entities.
   *
   */
  async _read(size) {
    const query = this._query;
    query.clear("limit").clear("offset");
    const maxReadSize = (
      // if no limit is defined in the query, use the given size,
      // otherwise, use the smallest value between the two
      this._limit === null ? size : Math.min(size, this._limit)
    );
    const limit = (
      // If a limit is defined
      this._limit !== null && // And reading `maxReadSize` would fetch too many entities (> _limit)
      this._fetched + maxReadSize > this._limit ? (
        // Then adjust the limit so that it only get the remaining entities
        this._limit - this._fetched
      ) : (
        // Else, use the max read size
        maxReadSize
      )
    );
    if (limit <= 0) {
      this.push(null);
      return;
    }
    const offset = this._offset + this._fetched;
    query.offset(offset).limit(limit);
    this[knexPerformingQuery] = true;
    let results;
    let count;
    let err;
    try {
      results = await query;
      const { populate } = this._qb.state;
      if (populate) {
        await applyPopulate(results, populate, { qb: this._qb, uid: this._uid, db: this._db });
      }
      if (this._mapResults) {
        results = fromRow(this._meta, results);
      }
      count = results.length;
    } catch (e) {
      err = e;
    }
    this[knexPerformingQuery] = false;
    if (this.destroyed) {
      this.emit(knexQueryDone);
      return;
    }
    if (err) {
      this.destroy(err);
      return;
    }
    this._fetched += count;
    for (const result of results) {
      this.push(result);
    }
    if (this._fetched === this._limit || count < this._batchSize) {
      this.push(null);
    }
  }
}
const storage = new node_async_hooks.AsyncLocalStorage();
const transactionCtx = {
  async run(trx, cb) {
    const store = storage.getStore();
    return storage.run(
      {
        trx,
        // Fill with existing callbacks if nesting transactions
        commitCallbacks: store?.commitCallbacks || [],
        rollbackCallbacks: store?.rollbackCallbacks || []
      },
      cb
    );
  },
  get() {
    const store = storage.getStore();
    return store?.trx;
  },
  async commit(trx) {
    const store = storage.getStore();
    if (store?.trx) {
      store.trx = null;
    }
    await trx.commit();
    if (!store?.commitCallbacks.length) {
      return;
    }
    store.commitCallbacks.forEach((cb) => cb());
    store.commitCallbacks = [];
  },
  async rollback(trx) {
    const store = storage.getStore();
    if (store?.trx) {
      store.trx = null;
    }
    await trx.rollback();
    if (!store?.rollbackCallbacks.length) {
      return;
    }
    store.rollbackCallbacks.forEach((cb) => cb());
    store.rollbackCallbacks = [];
  },
  onCommit(cb) {
    const store = storage.getStore();
    if (store?.commitCallbacks) {
      store.commitCallbacks.push(cb);
    }
  },
  onRollback(cb) {
    const store = storage.getStore();
    if (store?.rollbackCallbacks) {
      store.rollbackCallbacks.push(cb);
    }
  }
};
const createQueryBuilder = (uid, db, initialState = {}) => {
  const meta = db.metadata.get(uid);
  const { tableName } = meta;
  const state = ___default.default.defaults(
    {
      type: "select",
      select: [],
      count: null,
      max: null,
      first: false,
      data: null,
      where: [],
      joins: [],
      populate: null,
      limit: null,
      offset: null,
      transaction: null,
      forUpdate: false,
      onConflict: null,
      merge: null,
      ignore: false,
      orderBy: [],
      groupBy: [],
      increments: [],
      decrements: [],
      aliasCounter: 0,
      filters: null,
      search: null
    },
    initialState
  );
  const getAlias = () => {
    const alias = `t${state.aliasCounter}`;
    state.aliasCounter += 1;
    return alias;
  };
  return {
    alias: getAlias(),
    getAlias,
    state,
    clone() {
      return createQueryBuilder(uid, db, state);
    },
    select(args) {
      state.type = "select";
      state.select = ___default.default.uniq(___default.default.castArray(args));
      return this;
    },
    addSelect(args) {
      state.select = ___default.default.uniq([...state.select, ...___default.default.castArray(args)]);
      return this;
    },
    insert(data) {
      state.type = "insert";
      state.data = data;
      return this;
    },
    onConflict(args) {
      state.onConflict = args;
      return this;
    },
    merge(args) {
      state.merge = args;
      return this;
    },
    ignore() {
      state.ignore = true;
      return this;
    },
    delete() {
      state.type = "delete";
      return this;
    },
    ref(name) {
      return db.connection.ref(toColumnName(meta, name));
    },
    update(data) {
      state.type = "update";
      state.data = data;
      return this;
    },
    increment(column, amount = 1) {
      state.type = "update";
      state.increments.push({ column, amount });
      return this;
    },
    decrement(column, amount = 1) {
      state.type = "update";
      state.decrements.push({ column, amount });
      return this;
    },
    count(count = "id") {
      state.type = "count";
      state.count = count;
      return this;
    },
    max(column) {
      state.type = "max";
      state.max = column;
      return this;
    },
    where(where = {}) {
      if (!___default.default.isPlainObject(where)) {
        throw new Error("Where must be an object");
      }
      state.where.push(where);
      return this;
    },
    limit(limit) {
      state.limit = limit;
      return this;
    },
    offset(offset) {
      state.offset = offset;
      return this;
    },
    orderBy(orderBy) {
      state.orderBy = orderBy;
      return this;
    },
    groupBy(groupBy) {
      state.groupBy = groupBy;
      return this;
    },
    populate(populate) {
      state.populate = populate;
      return this;
    },
    search(query) {
      state.search = query;
      return this;
    },
    transacting(transaction) {
      state.transaction = transaction;
      return this;
    },
    forUpdate() {
      state.forUpdate = true;
      return this;
    },
    init(params = {}) {
      const { _q, filters, where, select, limit, offset, orderBy, groupBy, populate } = params;
      if (!___default.default.isNil(where)) {
        this.where(where);
      }
      if (!___default.default.isNil(_q)) {
        this.search(_q);
      }
      if (!___default.default.isNil(select)) {
        this.select(select);
      } else {
        this.select("*");
      }
      if (!___default.default.isNil(limit)) {
        this.limit(limit);
      }
      if (!___default.default.isNil(offset)) {
        this.offset(offset);
      }
      if (!___default.default.isNil(orderBy)) {
        this.orderBy(orderBy);
      }
      if (!___default.default.isNil(groupBy)) {
        this.groupBy(groupBy);
      }
      if (!___default.default.isNil(populate)) {
        this.populate(populate);
      }
      if (!___default.default.isNil(filters)) {
        this.filters(filters);
      }
      return this;
    },
    filters(filters) {
      state.filters = filters;
    },
    first() {
      state.first = true;
      return this;
    },
    join(join) {
      if (!join.targetField) {
        state.joins.push(join);
        return this;
      }
      const model = db.metadata.get(uid);
      const attribute = model.attributes[join.targetField];
      createJoin(
        { db, qb: this, uid },
        {
          alias: this.alias,
          refAlias: join.alias,
          attributeName: join.targetField,
          attribute
        }
      );
      return this;
    },
    mustUseAlias() {
      return ["select", "count"].includes(state.type);
    },
    aliasColumn(key, alias) {
      if (typeof key !== "string") {
        return key;
      }
      if (key.indexOf(".") >= 0) {
        return key;
      }
      if (!___default.default.isNil(alias)) {
        return `${alias}.${key}`;
      }
      return this.mustUseAlias() ? `${this.alias}.${key}` : key;
    },
    raw: db.connection.raw.bind(db.connection),
    shouldUseSubQuery() {
      return ["delete", "update"].includes(state.type) && state.joins.length > 0;
    },
    runSubQuery() {
      this.select("id");
      const subQB = this.getKnexQuery();
      const nestedSubQuery = db.getConnection().select("id").from(subQB.as("subQuery"));
      const connection = db.getConnection(tableName);
      return connection[state.type]().whereIn("id", nestedSubQuery);
    },
    processState() {
      state.orderBy = processOrderBy(state.orderBy, { qb: this, uid, db });
      if (!___default.default.isNil(state.filters)) {
        if (___default.default.isFunction(state.filters)) {
          const filters = state.filters({ qb: this, uid, meta, db });
          if (!___default.default.isNil(filters)) {
            state.where.push(filters);
          }
        } else {
          state.where.push(state.filters);
        }
      }
      state.where = processWhere(state.where, { qb: this, uid, db });
      state.populate = processPopulate(state.populate, { qb: this, uid, db });
      state.data = toRow(meta, state.data);
      this.processSelect();
    },
    shouldUseDistinct() {
      return state.joins.length > 0 && ___default.default.isEmpty(state.groupBy);
    },
    processSelect() {
      state.select = state.select.map((field) => {
        if (isKnexQuery(field)) {
          return field;
        }
        return toColumnName(meta, field);
      });
      if (this.shouldUseDistinct()) {
        const joinsOrderByColumns = state.joins.flatMap((join) => {
          return ___default.default.keys(join.orderBy).map((key) => this.aliasColumn(key, join.alias));
        });
        const orderByColumns = state.orderBy.map(({ column }) => column);
        state.select = ___default.default.uniq([...joinsOrderByColumns, ...orderByColumns, ...state.select]);
      }
    },
    getKnexQuery() {
      if (!state.type) {
        this.select("*");
      }
      const aliasedTableName = this.mustUseAlias() ? `${tableName} as ${this.alias}` : tableName;
      const qb = db.getConnection(aliasedTableName);
      if (this.shouldUseSubQuery()) {
        return this.runSubQuery();
      }
      this.processState();
      switch (state.type) {
        case "select": {
          qb.select(state.select.map((column) => this.aliasColumn(column)));
          if (this.shouldUseDistinct()) {
            qb.distinct();
          }
          break;
        }
        case "count": {
          const dbColumnName = this.aliasColumn(toColumnName(meta, state.count));
          if (this.shouldUseDistinct()) {
            qb.countDistinct({ count: dbColumnName });
          } else {
            qb.count({ count: dbColumnName });
          }
          break;
        }
        case "max": {
          const dbColumnName = this.aliasColumn(toColumnName(meta, state.max));
          qb.max({ max: dbColumnName });
          break;
        }
        case "insert": {
          qb.insert(state.data);
          if (db.dialect.useReturning() && ___default.default.has("id", meta.attributes)) {
            qb.returning("id");
          }
          break;
        }
        case "update": {
          if (state.data) {
            qb.update(state.data);
          }
          break;
        }
        case "delete": {
          qb.delete();
          break;
        }
        case "truncate": {
          qb.truncate();
          break;
        }
        default: {
          throw new Error("Unknown query type");
        }
      }
      if (state.transaction) {
        qb.transacting(state.transaction);
      }
      if (state.forUpdate) {
        qb.forUpdate();
      }
      if (!___default.default.isEmpty(state.increments)) {
        state.increments.forEach((incr) => qb.increment(incr.column, incr.amount));
      }
      if (!___default.default.isEmpty(state.decrements)) {
        state.decrements.forEach((decr) => qb.decrement(decr.column, decr.amount));
      }
      if (state.onConflict) {
        if (state.merge) {
          qb.onConflict(state.onConflict).merge(state.merge);
        } else if (state.ignore) {
          qb.onConflict(state.onConflict).ignore();
        }
      }
      if (state.limit) {
        qb.limit(state.limit);
      }
      if (state.offset) {
        qb.offset(state.offset);
      }
      if (state.orderBy.length > 0) {
        qb.orderBy(state.orderBy);
      }
      if (state.first) {
        qb.first();
      }
      if (state.groupBy.length > 0) {
        qb.groupBy(state.groupBy);
      }
      if (state.where) {
        applyWhere(qb, state.where);
      }
      if (state.search) {
        qb.where((subQb) => {
          applySearch(subQb, state.search, { qb: this, db, uid });
        });
      }
      if (state.joins.length > 0) {
        applyJoins(qb, state.joins);
      }
      return qb;
    },
    async execute({ mapResults = true } = {}) {
      try {
        const qb = this.getKnexQuery();
        const transaction = transactionCtx.get();
        if (transaction) {
          qb.transacting(transaction);
        }
        const rows = await qb;
        if (state.populate && !___default.default.isNil(rows)) {
          await applyPopulate(___default.default.castArray(rows), state.populate, {
            qb: this,
            uid,
            db
          });
        }
        let results = rows;
        if (mapResults && state.type === "select") {
          results = fromRow(meta, rows);
        }
        return results;
      } catch (error) {
        if (error instanceof Error) {
          db.dialect.transformErrors(error);
        } else {
          throw error;
        }
      }
    },
    stream({ mapResults = true } = {}) {
      if (state.type === "select") {
        return new ReadableStrapiQuery({ qb: this, db, uid, mapResults });
      }
      throw new DatabaseError(
        `query-builder.stream() has been called with an unsupported query type: "${state.type}"`
      );
    }
  };
};
const withDefaultPagination = (params) => {
  const { page = 1, pageSize = 10, ...rest } = params;
  return {
    page: Number(page),
    pageSize: Number(pageSize),
    ...rest
  };
};
const withOffsetLimit = (params) => {
  const { page, pageSize, ...rest } = withDefaultPagination(params);
  const offset = Math.max(page - 1, 0) * pageSize;
  const limit = pageSize;
  const query = {
    ...rest,
    limit,
    offset
  };
  return [query, { page, pageSize }];
};
const createRepository = (uid, db) => {
  return {
    findOne(params = {}) {
      return db.entityManager.findOne(uid, params);
    },
    findMany(params = {}) {
      return db.entityManager.findMany(uid, params);
    },
    findWithCount(params = {}) {
      return Promise.all([
        db.entityManager.findMany(uid, params),
        db.entityManager.count(uid, params)
      ]);
    },
    async findPage(params) {
      const [query, { page, pageSize }] = withOffsetLimit(params);
      const [results, total] = await Promise.all([
        db.entityManager.findMany(uid, query),
        db.entityManager.count(uid, query)
      ]);
      return {
        results,
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total
        }
      };
    },
    create(params) {
      return db.entityManager.create(uid, params);
    },
    createMany(params) {
      return db.entityManager.createMany(uid, params);
    },
    update(params) {
      return db.entityManager.update(uid, params);
    },
    updateMany(params) {
      return db.entityManager.updateMany(uid, params);
    },
    clone(id, params) {
      return db.entityManager.clone(uid, id, params);
    },
    delete(params) {
      return db.entityManager.delete(uid, params);
    },
    deleteMany(params = {}) {
      return db.entityManager.deleteMany(uid, params);
    },
    count(params) {
      return db.entityManager.count(uid, params);
    },
    attachRelations(id, data) {
      return db.entityManager.attachRelations(uid, id, data);
    },
    async updateRelations(id, data) {
      const trx = await db.transaction();
      try {
        await db.entityManager.updateRelations(uid, id, data, { transaction: trx.get() });
        return await trx.commit();
      } catch (e) {
        await trx.rollback();
        throw e;
      }
    },
    deleteRelations(id) {
      return db.entityManager.deleteRelations(uid, id);
    },
    cloneRelations(targetId, sourceId, params) {
      return db.entityManager.cloneRelations(uid, targetId, sourceId, params);
    },
    populate(entity, populate) {
      return db.entityManager.populate(uid, entity, populate);
    },
    load(entity, fields, params) {
      return db.entityManager.load(uid, entity, fields, params);
    },
    async loadPages(entity, field, params) {
      if (!_.isString(field)) {
        throw new Error(`Invalid load. Expected ${field} to be a string`);
      }
      const { attributes } = db.metadata.get(uid);
      const attribute = attributes[field];
      if (!attribute || attribute.type !== "relation" || !attribute.relation || !["oneToMany", "manyToMany"].includes(attribute.relation)) {
        throw new Error(`Invalid load. Expected ${field} to be an anyToMany relational attribute`);
      }
      const [query, { page, pageSize }] = withOffsetLimit(params);
      const [results, { count: total }] = await Promise.all([
        db.entityManager.load(uid, entity, field, query),
        db.entityManager.load(uid, entity, field, { ...query, count: true })
      ]);
      return {
        results,
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total
        }
      };
    }
  };
};
const getMorphToManyRowsLinkedToMorphOne = (rows, {
  uid,
  attributeName,
  typeColumn,
  db
}) => rows.filter((row) => {
  const relatedType = row[typeColumn.name];
  const field = row.field;
  const targetAttribute = db.metadata.get(relatedType).attributes[field];
  return targetAttribute?.target === uid && targetAttribute?.morphBy === attributeName && targetAttribute?.relation === "morphOne";
});
const deleteRelatedMorphOneRelationsAfterMorphToManyUpdate = async (rows, {
  uid,
  attributeName,
  joinTable,
  db,
  transaction: trx
}) => {
  const { morphColumn } = joinTable;
  const { idColumn, typeColumn } = morphColumn;
  const morphOneRows = getMorphToManyRowsLinkedToMorphOne(rows, {
    uid,
    attributeName,
    typeColumn,
    db
  });
  const groupByType = _.groupBy(typeColumn.name);
  const groupByField = _.groupBy("field");
  const typeAndFieldIdsGrouped = _.pipe(groupByType, _.mapValues(groupByField))(morphOneRows);
  const orWhere = [];
  for (const [type, v] of Object.entries(typeAndFieldIdsGrouped)) {
    for (const [field, arr] of Object.entries(v)) {
      orWhere.push({
        [typeColumn.name]: type,
        field,
        [idColumn.name]: { $in: _.map(idColumn.name, arr) }
      });
    }
  }
  if (!_.isEmpty(orWhere)) {
    await createQueryBuilder(joinTable.name, db).delete().where({ $or: orWhere }).transacting(trx).execute();
  }
};
const deletePreviousOneToAnyRelations = async ({
  id,
  attribute,
  relIdsToadd,
  db,
  transaction: trx
}) => {
  if (!(isBidirectional(attribute) && isOneToAny(attribute))) {
    throw new Error(
      "deletePreviousOneToAnyRelations can only be called for bidirectional oneToAny relations"
    );
  }
  const { joinTable } = attribute;
  const { joinColumn, inverseJoinColumn } = joinTable;
  await createQueryBuilder(joinTable.name, db).delete().where({
    [inverseJoinColumn.name]: relIdsToadd,
    [joinColumn.name]: { $ne: id }
  }).where(joinTable.on || {}).transacting(trx).execute();
  await cleanOrderColumns({ attribute, db, inverseRelIds: relIdsToadd, transaction: trx });
};
const deletePreviousAnyToOneRelations = async ({
  id,
  attribute,
  relIdToadd,
  db,
  transaction: trx
}) => {
  const { joinTable } = attribute;
  const { joinColumn, inverseJoinColumn } = joinTable;
  if (!isAnyToOne(attribute)) {
    throw new Error("deletePreviousAnyToOneRelations can only be called for anyToOne relations");
  }
  if (isManyToAny(attribute)) {
    const relsToDelete = await createQueryBuilder(joinTable.name, db).select(inverseJoinColumn.name).where({
      [joinColumn.name]: id,
      [inverseJoinColumn.name]: { $ne: relIdToadd }
    }).where(joinTable.on || {}).transacting(trx).execute();
    const relIdsToDelete = _.map(inverseJoinColumn.name, relsToDelete);
    await createQueryBuilder(joinTable.name, db).delete().where({
      [joinColumn.name]: id,
      [inverseJoinColumn.name]: { $in: relIdsToDelete }
    }).where(joinTable.on || {}).transacting(trx).execute();
    await cleanOrderColumns({ attribute, db, inverseRelIds: relIdsToDelete, transaction: trx });
  } else {
    await createQueryBuilder(joinTable.name, db).delete().where({
      [joinColumn.name]: id,
      [inverseJoinColumn.name]: { $ne: relIdToadd }
    }).where(joinTable.on || {}).transacting(trx).execute();
  }
};
const deleteRelations = async ({
  id,
  attribute,
  db,
  relIdsToNotDelete = [],
  relIdsToDelete = [],
  transaction: trx
}) => {
  const { joinTable } = attribute;
  const { joinColumn, inverseJoinColumn } = joinTable;
  const all = relIdsToDelete === "all";
  if (hasOrderColumn(attribute) || hasInverseOrderColumn(attribute)) {
    let lastId = 0;
    let done = false;
    const batchSize = 100;
    while (!done) {
      const batchToDelete = await createQueryBuilder(joinTable.name, db).select(inverseJoinColumn.name).where({
        [joinColumn.name]: id,
        id: { $gt: lastId },
        [inverseJoinColumn.name]: { $notIn: relIdsToNotDelete },
        ...all ? {} : { [inverseJoinColumn.name]: { $in: relIdsToDelete } }
      }).where(joinTable.on || {}).orderBy("id").limit(batchSize).transacting(trx).execute();
      done = batchToDelete.length < batchSize;
      lastId = batchToDelete[batchToDelete.length - 1]?.id || 0;
      const batchIds = _.map(inverseJoinColumn.name, batchToDelete);
      await createQueryBuilder(joinTable.name, db).delete().where({
        [joinColumn.name]: id,
        [inverseJoinColumn.name]: { $in: batchIds }
      }).where(joinTable.on || {}).transacting(trx).execute();
      await cleanOrderColumns({ attribute, db, id, inverseRelIds: batchIds, transaction: trx });
    }
  } else {
    await createQueryBuilder(joinTable.name, db).delete().where({
      [joinColumn.name]: id,
      [inverseJoinColumn.name]: { $notIn: relIdsToNotDelete },
      ...all ? {} : { [inverseJoinColumn.name]: { $in: relIdsToDelete } }
    }).where(joinTable.on || {}).transacting(trx).execute();
  }
};
const cleanOrderColumns = async ({
  id,
  attribute,
  db,
  inverseRelIds = [],
  transaction: trx
}) => {
  if (!(hasOrderColumn(attribute) && id) && !(hasInverseOrderColumn(attribute) && !_.isEmpty(inverseRelIds))) {
    return;
  }
  if (!strapi.db.dialect.supportsWindowFunctions()) {
    await cleanOrderColumnsForOldDatabases({ id, attribute, db, inverseRelIds, transaction: trx });
    return;
  }
  const { joinTable } = attribute;
  const { joinColumn, inverseJoinColumn, orderColumnName, inverseOrderColumnName } = joinTable;
  const updateOrderColumn = async () => {
    if (!hasOrderColumn(attribute) || !id) {
      return;
    }
    const selectRowsToOrder = (joinTableName) => db.connection(joinTableName).select("id").rowNumber("src_order", orderColumnName, joinColumn.name).where(joinColumn.name, id).toSQL();
    switch (strapi.db.dialect.client) {
      case "mysql": {
        const select = selectRowsToOrder(joinTable.name);
        await db.getConnection().raw(
          `UPDATE ?? as a, ( ${select.sql} ) AS b
            SET ?? = b.src_order
            WHERE b.id = a.id`,
          [joinTable.name, ...select.bindings, orderColumnName]
        ).transacting(trx);
        break;
      }
      default: {
        const joinTableName = addSchema(db, joinTable.name);
        const select = selectRowsToOrder(joinTableName);
        await db.connection.raw(
          `UPDATE ?? as a
            SET ?? = b.src_order
            FROM ( ${select.sql} ) AS b
            WHERE b.id = a.id`,
          [joinTableName, orderColumnName, ...select.bindings]
        ).transacting(trx);
      }
    }
  };
  const updateInverseOrderColumn = async () => {
    if (!hasInverseOrderColumn(attribute) || _.isEmpty(inverseRelIds))
      return;
    const selectRowsToOrder = (joinTableName) => db.connection(joinTableName).select("id").rowNumber("inv_order", inverseOrderColumnName, inverseJoinColumn.name).where(inverseJoinColumn.name, "in", inverseRelIds).toSQL();
    switch (strapi.db.dialect.client) {
      case "mysql": {
        const select = selectRowsToOrder(joinTable.name);
        await db.getConnection().raw(
          `UPDATE ?? as a, ( ${select.sql} ) AS b
            SET ?? = b.inv_order
            WHERE b.id = a.id`,
          [joinTable.name, ...select.bindings, inverseOrderColumnName]
        ).transacting(trx);
        break;
      }
      default: {
        const joinTableName = addSchema(db, joinTable.name);
        const select = selectRowsToOrder(joinTableName);
        await db.connection.raw(
          `UPDATE ?? as a
            SET ?? = b.inv_order
            FROM ( ${select.sql} ) AS b
            WHERE b.id = a.id`,
          [joinTableName, inverseOrderColumnName, ...select.bindings]
        ).transacting(trx);
      }
    }
  };
  return Promise.all([updateOrderColumn(), updateInverseOrderColumn()]);
};
const cleanOrderColumnsForOldDatabases = async ({
  id,
  attribute,
  db,
  inverseRelIds,
  transaction: trx
}) => {
  const { joinTable } = attribute;
  const { joinColumn, inverseJoinColumn, orderColumnName, inverseOrderColumnName } = joinTable;
  const randomSuffix = `${(/* @__PURE__ */ new Date()).valueOf()}_${crypto.randomBytes(16).toString("hex")}`;
  if (hasOrderColumn(attribute) && id) {
    const orderVar = `order_${randomSuffix}`;
    await db.connection.raw(`SET @${orderVar} = 0;`).transacting(trx);
    await db.connection.raw(
      `UPDATE :joinTableName: as a, (
          SELECT id, (@${orderVar}:=@${orderVar} + 1) AS src_order
          FROM :joinTableName:
	        WHERE :joinColumnName: = :id
	        ORDER BY :orderColumnName:
        ) AS b
        SET :orderColumnName: = b.src_order
        WHERE a.id = b.id
        AND a.:joinColumnName: = :id`,
      {
        joinTableName: joinTable.name,
        orderColumnName,
        joinColumnName: joinColumn.name,
        id
      }
    ).transacting(trx);
  }
  if (hasInverseOrderColumn(attribute) && !_.isEmpty(inverseRelIds)) {
    const orderVar = `order_${randomSuffix}`;
    const columnVar = `col_${randomSuffix}`;
    await db.connection.raw(`SET @${orderVar} = 0;`).transacting(trx);
    await db.connection.raw(
      `UPDATE ?? as a, (
          SELECT
          	id,
            @${orderVar}:=CASE WHEN @${columnVar} = ?? THEN @${orderVar} + 1 ELSE 1 END AS inv_order,
        	  @${columnVar}:=?? ??
        	FROM ?? a
        	WHERE ?? IN(${inverseRelIds.map(() => "?").join(", ")})
        	ORDER BY ??, ??
        ) AS b
        SET ?? = b.inv_order
        WHERE a.id = b.id
        AND a.?? IN(${inverseRelIds.map(() => "?").join(", ")})`,
      [
        joinTable.name,
        inverseJoinColumn.name,
        inverseJoinColumn.name,
        inverseJoinColumn.name,
        joinTable.name,
        inverseJoinColumn.name,
        ...inverseRelIds,
        inverseJoinColumn.name,
        joinColumn.name,
        inverseOrderColumnName,
        inverseJoinColumn.name,
        ...inverseRelIds
      ]
    ).transacting(trx);
  }
};
const cleanInverseOrderColumn = async ({
  id,
  attribute,
  trx
}) => {
  const con = strapi.db.connection;
  const { joinTable } = attribute;
  const { joinColumn, inverseJoinColumn, inverseOrderColumnName } = joinTable;
  switch (strapi.db.dialect.client) {
    case "mysql": {
      const subQuery = con(joinTable.name).select(inverseJoinColumn.name).max(inverseOrderColumnName, { as: "max_inv_order" }).groupBy(inverseJoinColumn.name).as("t2");
      await con(`${joinTable.name} as t1`).join(subQuery, `t1.${inverseJoinColumn.name}`, "=", `t2.${inverseJoinColumn.name}`).where(joinColumn.name, id).update({
        [inverseOrderColumnName]: con.raw("t2.max_inv_order + 1")
      }).transacting(trx);
      break;
    }
    default: {
      const joinTableName = addSchema(strapi.db, joinTable.name);
      const selectMaxInverseOrder = con.raw(`max(${inverseOrderColumnName}) + 1`);
      const subQuery = con(`${joinTableName} as t2`).select(selectMaxInverseOrder).whereRaw(`t2.${inverseJoinColumn.name} = t1.${inverseJoinColumn.name}`);
      await con(`${joinTableName} as t1`).where(`t1.${joinColumn.name}`, id).update({ [inverseOrderColumnName]: subQuery }).transacting(trx);
    }
  }
};
const sortConnectArray = (connectArr, initialArr = [], strictSort = true) => {
  const sortedConnect = [];
  let needsSorting = false;
  const relationInInitialArray = initialArr.reduce(
    (acc, rel) => ({ ...acc, [rel.id]: true }),
    {}
  );
  const mappedRelations = connectArr.reduce((mapper, relation) => {
    const adjacentRelId = relation.position?.before || relation.position?.after;
    if (!adjacentRelId || !relationInInitialArray[adjacentRelId] && !mapper[adjacentRelId]) {
      needsSorting = true;
    }
    if (mapper[relation.id]) {
      throw new InvalidRelationError(
        `The relation with id ${relation.id} is already connected. You cannot connect the same relation twice.`
      );
    }
    return {
      [relation.id]: { ...relation, computed: false },
      ...mapper
    };
  }, {});
  if (!needsSorting)
    return connectArr;
  const computeRelation = (relation, relationsSeenInBranch) => {
    const adjacentRelId = relation.position?.before || relation.position?.after;
    const adjacentRelation = mappedRelations[adjacentRelId];
    if (adjacentRelId && relationsSeenInBranch[adjacentRelId]) {
      throw new InvalidRelationError(
        "A circular reference was found in the connect array. One relation is trying to connect before/after another one that is trying to connect before/after it"
      );
    }
    if (mappedRelations[relation.id]?.computed) {
      return;
    }
    mappedRelations[relation.id].computed = true;
    if (!adjacentRelId || relationInInitialArray[adjacentRelId]) {
      sortedConnect.push(relation);
      return;
    }
    if (mappedRelations[adjacentRelId]) {
      computeRelation(adjacentRelation, { ...relationsSeenInBranch, [relation.id]: true });
      sortedConnect.push(relation);
    } else if (strictSort) {
      throw new InvalidRelationError(
        `There was a problem connecting relation with id ${relation.id} at position ${JSON.stringify(
          relation.position
        )}. The relation with id ${adjacentRelId} needs to be connected first.`
      );
    } else {
      sortedConnect.push({ id: relation.id, position: { end: true } });
    }
  };
  connectArr.forEach((relation) => computeRelation(relation, {}));
  return sortedConnect;
};
const relationsOrderer = (initArr, idColumn, orderColumn, strict) => {
  const computedRelations = _.castArray(initArr ?? []).map((r) => ({
    init: true,
    id: r[idColumn],
    order: Number(r[orderColumn]) || 1
  }));
  const maxOrder = _.maxBy("order", computedRelations)?.order || 0;
  const findRelation = (id) => {
    const idx = computedRelations.findIndex((r) => r.id === id);
    return { idx, relation: computedRelations[idx] };
  };
  const removeRelation = (r) => {
    const { idx } = findRelation(r.id);
    if (idx >= 0) {
      computedRelations.splice(idx, 1);
    }
  };
  const insertRelation = (r) => {
    let idx;
    if (r.position?.before) {
      const { idx: _idx, relation } = findRelation(r.position.before);
      if (relation.init) {
        r.order = relation.order - 0.5;
      } else {
        r.order = relation.order;
      }
      idx = _idx;
    } else if (r.position?.after) {
      const { idx: _idx, relation } = findRelation(r.position.after);
      if (relation.init) {
        r.order = relation.order + 0.5;
      } else {
        r.order = relation.order;
      }
      idx = _idx + 1;
    } else if (r.position?.start) {
      r.order = 0.5;
      idx = 0;
    } else {
      r.order = maxOrder + 0.5;
      idx = computedRelations.length;
    }
    computedRelations.splice(idx, 0, r);
  };
  return {
    disconnect(relations) {
      _.castArray(relations).forEach((relation) => {
        removeRelation(relation);
      });
      return this;
    },
    connect(relations) {
      sortConnectArray(_.castArray(relations), computedRelations, strict).forEach((relation) => {
        this.disconnect(relation);
        try {
          insertRelation(relation);
        } catch (err) {
          throw new Error(
            `There was a problem connecting relation with id ${relation.id} at position ${JSON.stringify(
              relation.position
            )}. The list of connect relations is not valid`
          );
        }
      });
      return this;
    },
    get() {
      return computedRelations;
    },
    /**
     * Get a map between the relation id and its order
     */
    getOrderMap() {
      return ___default$1.default(computedRelations).groupBy("order").reduce((acc, relations) => {
        if (relations[0]?.init)
          return acc;
        relations.forEach((relation, idx) => {
          acc[relation.id] = Math.floor(relation.order) + (idx + 1) / (relations.length + 1);
        });
        return acc;
      }, {});
    }
  };
};
const replaceRegularRelations = async ({
  targetId,
  sourceId,
  attribute,
  omitIds,
  transaction: trx
}) => {
  const { joinTable } = attribute;
  const { joinColumn, inverseJoinColumn } = joinTable;
  await strapi.db.entityManager.createQueryBuilder(joinTable.name).update({ [joinColumn.name]: targetId }).where({ [joinColumn.name]: sourceId }).where({ $not: { [inverseJoinColumn.name]: omitIds } }).onConflict([joinColumn.name, inverseJoinColumn.name]).ignore().transacting(trx).execute();
};
const cloneRegularRelations = async ({
  targetId,
  sourceId,
  attribute,
  transaction: trx
}) => {
  const { joinTable } = attribute;
  const { joinColumn, inverseJoinColumn, orderColumnName, inverseOrderColumnName } = joinTable;
  const connection = strapi.db.getConnection();
  const columns = [joinColumn.name, inverseJoinColumn.name];
  if (orderColumnName) {
    columns.push(orderColumnName);
  }
  if (inverseOrderColumnName) {
    columns.push(inverseOrderColumnName);
  }
  if (joinTable.on) {
    columns.push(...Object.keys(joinTable.on));
  }
  const selectStatement = connection.select(
    // Override joinColumn with the new id
    { [joinColumn.name]: targetId },
    ...columns.slice(1)
  ).where(joinColumn.name, sourceId).from(joinTable.name).toSQL();
  await strapi.db.entityManager.createQueryBuilder(joinTable.name).insert(
    strapi.db.connection.raw(
      `(${columns.join(",")})  ${selectStatement.sql}`,
      selectStatement.bindings
    )
  ).onConflict([joinColumn.name, inverseJoinColumn.name]).ignore().transacting(trx).execute();
  if (inverseOrderColumnName) {
    await cleanInverseOrderColumn({
      id: targetId,
      attribute,
      trx
    });
  }
};
const isRecord = (value) => _.isObject(value) && !_.isNil(value);
const toId = (value) => {
  if (isRecord(value) && "id" in value && isValidId(value.id)) {
    return value.id;
  }
  if (isValidId(value)) {
    return value;
  }
  throw new Error(`Invalid id, expected a string or integer, got ${value}`);
};
const toIds = (value) => _.castArray(value || []).map(toId);
const isValidId = (value) => _.isString(value) || _.isInteger(value);
const isValidObjectId = (value) => isRecord(value) && "id" in value && isValidId(value.id);
const toIdArray = (data) => {
  const array = _.castArray(data).filter((datum) => !_.isNil(datum)).map((datum) => {
    if (isValidId(datum)) {
      return { id: datum, __pivot: {} };
    }
    if (!isValidObjectId(datum)) {
      throw new Error(`Invalid id, expected a string or integer, got ${datum}`);
    }
    return datum;
  });
  return _.uniqWith(_.isEqual, array);
};
const toAssocs = (data) => {
  if (_.isArray(data) || _.isString(data) || _.isNumber(data) || _.isNull(data) || isRecord(data) && "id" in data) {
    return {
      set: _.isNull(data) ? data : toIdArray(data)
    };
  }
  if (data?.set) {
    return {
      set: _.isNull(data.set) ? data.set : toIdArray(data.set)
    };
  }
  return {
    options: {
      strict: data?.options?.strict
    },
    connect: toIdArray(data?.connect).map((elm) => ({
      id: elm.id,
      position: elm.position ? elm.position : { end: true },
      __pivot: elm.__pivot ?? {}
    })),
    disconnect: toIdArray(data?.disconnect)
  };
};
const processData = (metadata, data = {}, { withDefaults = false } = {}) => {
  const { attributes } = metadata;
  const obj = {};
  for (const attributeName of Object.keys(attributes)) {
    const attribute = attributes[attributeName];
    if (isScalarAttribute(attribute)) {
      const field = createField(attribute);
      if (_.isUndefined(data[attributeName])) {
        if (!_.isUndefined(attribute.default) && withDefaults) {
          if (typeof attribute.default === "function") {
            obj[attributeName] = attribute.default();
          } else {
            obj[attributeName] = attribute.default;
          }
        }
        continue;
      }
      if ("validate" in field && typeof field.validate === "function" && data[attributeName] !== null) {
        field.validate(data[attributeName]);
      }
      const val = data[attributeName] === null ? null : field.toDB(data[attributeName]);
      obj[attributeName] = val;
    }
    if (isRelationalAttribute(attribute)) {
      if ("joinColumn" in attribute && attribute.joinColumn && attribute.owner) {
        const joinColumnName = attribute.joinColumn.name;
        const attrValue = !_.isUndefined(data[attributeName]) ? data[attributeName] : data[joinColumnName];
        if (!_.isUndefined(attrValue)) {
          obj[joinColumnName] = attrValue;
        }
        continue;
      }
      if ("morphColumn" in attribute && attribute.morphColumn && attribute.owner) {
        const { idColumn, typeColumn, typeField = "__type" } = attribute.morphColumn;
        const value = data[attributeName];
        if (value === null) {
          Object.assign(obj, {
            [idColumn.name]: null,
            [typeColumn.name]: null
          });
          continue;
        }
        if (!_.isUndefined(value)) {
          if (!_.has("id", value) || !_.has(typeField, value)) {
            throw new Error(`Expects properties ${typeField} an id to make a morph association`);
          }
          Object.assign(obj, {
            [idColumn.name]: value.id,
            [typeColumn.name]: value[typeField]
          });
        }
      }
    }
  }
  return obj;
};
const createEntityManager = (db) => {
  const repoMap = {};
  return {
    async findOne(uid, params) {
      const states = await db.lifecycles.run("beforeFindOne", uid, { params });
      const result = await this.createQueryBuilder(uid).init(params).first().execute();
      await db.lifecycles.run("afterFindOne", uid, { params, result }, states);
      return result;
    },
    // should we name it findOne because people are used to it ?
    async findMany(uid, params) {
      const states = await db.lifecycles.run("beforeFindMany", uid, { params });
      const result = await this.createQueryBuilder(uid).init(params).execute();
      await db.lifecycles.run("afterFindMany", uid, { params, result }, states);
      return result;
    },
    async count(uid, params = {}) {
      const states = await db.lifecycles.run("beforeCount", uid, { params });
      const res = await this.createQueryBuilder(uid).init(_.pick(["_q", "where", "filters"], params)).count().first().execute();
      const result = Number(res.count);
      await db.lifecycles.run("afterCount", uid, { params, result }, states);
      return result;
    },
    async create(uid, params = {}) {
      const states = await db.lifecycles.run("beforeCreate", uid, { params });
      const metadata = db.metadata.get(uid);
      const { data } = params;
      if (!_.isPlainObject(data)) {
        throw new Error("Create expects a data object");
      }
      const dataToInsert = processData(metadata, data, { withDefaults: true });
      const res = await this.createQueryBuilder(uid).insert(dataToInsert).execute();
      const id = isRecord(res[0]) ? res[0].id : res[0];
      const trx = await strapi.db.transaction();
      try {
        await this.attachRelations(uid, id, data, { transaction: trx.get() });
        await trx.commit();
      } catch (e) {
        await trx.rollback();
        await this.createQueryBuilder(uid).where({ id }).delete().execute();
        throw e;
      }
      const result = await this.findOne(uid, {
        where: { id },
        select: params.select,
        populate: params.populate
      });
      await db.lifecycles.run("afterCreate", uid, { params, result }, states);
      return result;
    },
    // TODO: where do we handle relation processing for many queries ?
    async createMany(uid, params = {}) {
      const states = await db.lifecycles.run("beforeCreateMany", uid, { params });
      const metadata = db.metadata.get(uid);
      const { data } = params;
      if (!_.isArray(data)) {
        throw new Error("CreateMany expects data to be an array");
      }
      const dataToInsert = data.map(
        (datum) => processData(metadata, datum, { withDefaults: true })
      );
      if (_.isEmpty(dataToInsert)) {
        throw new Error("Nothing to insert");
      }
      const createdEntries = await this.createQueryBuilder(uid).insert(dataToInsert).execute();
      const result = {
        count: data.length,
        ids: createdEntries.map((entry) => typeof entry === "object" ? entry?.id : entry)
      };
      await db.lifecycles.run("afterCreateMany", uid, { params, result }, states);
      return result;
    },
    async update(uid, params = {}) {
      const states = await db.lifecycles.run("beforeUpdate", uid, { params });
      const metadata = db.metadata.get(uid);
      const { where, data } = params;
      if (!_.isPlainObject(data)) {
        throw new Error("Update requires a data object");
      }
      if (_.isEmpty(where)) {
        throw new Error("Update requires a where parameter");
      }
      const entity = await this.createQueryBuilder(uid).select("*").where(where).first().execute({ mapResults: false });
      if (!entity) {
        return null;
      }
      const { id } = entity;
      const dataToUpdate = processData(metadata, data);
      if (!_.isEmpty(dataToUpdate)) {
        await this.createQueryBuilder(uid).where({ id }).update(dataToUpdate).execute();
      }
      const trx = await strapi.db.transaction();
      try {
        await this.updateRelations(uid, id, data, { transaction: trx.get() });
        await trx.commit();
      } catch (e) {
        await trx.rollback();
        await this.createQueryBuilder(uid).where({ id }).update(entity).execute();
        throw e;
      }
      const result = await this.findOne(uid, {
        where: { id },
        select: params.select,
        populate: params.populate
      });
      await db.lifecycles.run("afterUpdate", uid, { params, result }, states);
      return result;
    },
    // TODO: where do we handle relation processing for many queries ?
    async updateMany(uid, params = {}) {
      const states = await db.lifecycles.run("beforeUpdateMany", uid, { params });
      const metadata = db.metadata.get(uid);
      const { where, data } = params;
      const dataToUpdate = processData(metadata, data);
      if (_.isEmpty(dataToUpdate)) {
        throw new Error("Update requires data");
      }
      const updatedRows = await this.createQueryBuilder(uid).where(where).update(dataToUpdate).execute();
      const result = { count: updatedRows };
      await db.lifecycles.run("afterUpdateMany", uid, { params, result }, states);
      return result;
    },
    async clone(uid, cloneId, params = {}) {
      const states = await db.lifecycles.run("beforeCreate", uid, { params });
      const metadata = db.metadata.get(uid);
      const { data } = params;
      if (!_.isNil(data) && !_.isPlainObject(data)) {
        throw new Error("Create expects a data object");
      }
      const entity = await this.findOne(uid, { where: { id: cloneId } });
      const dataToInsert = _.flow(
        // Omit unwanted properties
        _.omit(["id", "created_at", "updated_at"]),
        // Merge with provided data, set attribute to null if data attribute is null
        _.mergeWith(
          data || {},
          (original, override) => override === null ? override : original
        ),
        // Process data with metadata
        (entity2) => processData(metadata, entity2, { withDefaults: true })
      )(entity);
      const res = await this.createQueryBuilder(uid).insert(dataToInsert).execute();
      const id = isRecord(res[0]) ? res[0].id : res[0];
      const trx = await strapi.db.transaction();
      try {
        const cloneAttrs = Object.entries(metadata.attributes).reduce((acc, [attrName, attr]) => {
          if (isRelationalAttribute(attr) && "joinTable" in attr && attr.joinTable && !("component" in attr)) {
            acc.push(attrName);
          }
          return acc;
        }, []);
        await this.cloneRelations(uid, id, cloneId, data, { cloneAttrs, transaction: trx.get() });
        await trx.commit();
      } catch (e) {
        await trx.rollback();
        await this.createQueryBuilder(uid).where({ id }).delete().execute();
        throw e;
      }
      const result = await this.findOne(uid, {
        where: { id },
        select: params.select,
        populate: params.populate
      });
      await db.lifecycles.run("afterCreate", uid, { params, result }, states);
      return result;
    },
    async delete(uid, params = {}) {
      const states = await db.lifecycles.run("beforeDelete", uid, { params });
      const { where, select, populate } = params;
      if (_.isEmpty(where)) {
        throw new Error("Delete requires a where parameter");
      }
      const entity = await this.findOne(uid, {
        select: select && ["id"].concat(select),
        where,
        populate
      });
      if (!entity) {
        return null;
      }
      const { id } = entity;
      await this.createQueryBuilder(uid).where({ id }).delete().execute();
      const trx = await strapi.db.transaction();
      try {
        await this.deleteRelations(uid, id, { transaction: trx.get() });
        await trx.commit();
      } catch (e) {
        await trx.rollback();
        throw e;
      }
      await db.lifecycles.run("afterDelete", uid, { params, result: entity }, states);
      return entity;
    },
    // TODO: where do we handle relation processing for many queries ?
    async deleteMany(uid, params = {}) {
      const states = await db.lifecycles.run("beforeDeleteMany", uid, { params });
      const { where } = params;
      const deletedRows = await this.createQueryBuilder(uid).where(where).delete().execute();
      const result = { count: deletedRows };
      await db.lifecycles.run("afterDeleteMany", uid, { params, result }, states);
      return result;
    },
    /**
     * Attach relations to a new entity
     */
    async attachRelations(uid, id, data, options) {
      const { attributes } = db.metadata.get(uid);
      const { transaction: trx } = options ?? {};
      for (const attributeName of Object.keys(attributes)) {
        const attribute = attributes[attributeName];
        const isValidLink = _.has(attributeName, data) && !_.isNil(data[attributeName]);
        if (attribute.type !== "relation" || !isValidLink) {
          continue;
        }
        const cleanRelationData = toAssocs(data[attributeName]);
        if (attribute.relation === "morphOne" || attribute.relation === "morphMany") {
          const { target, morphBy } = attribute;
          const targetAttribute = db.metadata.get(target).attributes[morphBy];
          if (targetAttribute.type !== "relation") {
            throw new Error(
              `Expected target attribute ${target}.${morphBy} to be a relation attribute`
            );
          }
          if (targetAttribute.relation === "morphToOne") {
            const { idColumn, typeColumn } = targetAttribute.morphColumn;
            const relId = toId(cleanRelationData.set?.[0]);
            await this.createQueryBuilder(target).update({ [idColumn.name]: id, [typeColumn.name]: uid }).where({ id: relId }).transacting(trx).execute();
          } else if (targetAttribute.relation === "morphToMany") {
            const { joinTable } = targetAttribute;
            const { joinColumn, morphColumn } = joinTable;
            const { idColumn, typeColumn } = morphColumn;
            if (_.isEmpty(cleanRelationData.set)) {
              continue;
            }
            const rows = cleanRelationData.set?.map((data2, idx) => {
              return {
                [joinColumn.name]: data2.id,
                [idColumn.name]: id,
                [typeColumn.name]: uid,
                ..."on" in joinTable && joinTable.on || {},
                ...data2.__pivot || {},
                order: idx + 1,
                field: attributeName
              };
            }) ?? [];
            await this.createQueryBuilder(joinTable.name).insert(rows).transacting(trx).execute();
          }
          continue;
        } else if (attribute.relation === "morphToOne") {
          continue;
        } else if (attribute.relation === "morphToMany") {
          const { joinTable } = attribute;
          const { joinColumn, morphColumn } = joinTable;
          const { idColumn, typeColumn, typeField = "__type" } = morphColumn;
          if (_.isEmpty(cleanRelationData.set)) {
            continue;
          }
          const rows = cleanRelationData.set?.map((data2, idx) => ({
            [joinColumn.name]: id,
            [idColumn.name]: data2.id,
            [typeColumn.name]: data2[typeField],
            ..."on" in joinTable && joinTable.on || {},
            ...data2.__pivot || {},
            order: idx + 1
          })) ?? [];
          await deleteRelatedMorphOneRelationsAfterMorphToManyUpdate(rows, {
            uid,
            attributeName,
            joinTable,
            db,
            transaction: trx
          });
          await this.createQueryBuilder(joinTable.name).insert(rows).transacting(trx).execute();
          continue;
        }
        if ("joinColumn" in attribute && attribute.joinColumn && attribute.owner) {
          const relIdsToAdd = toIds(cleanRelationData.set);
          if (attribute.relation === "oneToOne" && isBidirectional(attribute) && relIdsToAdd.length) {
            await this.createQueryBuilder(uid).where({ [attribute.joinColumn.name]: relIdsToAdd, id: { $ne: id } }).update({ [attribute.joinColumn.name]: null }).transacting(trx).execute();
          }
          continue;
        }
        if ("joinColumn" in attribute && attribute.joinColumn && !attribute.owner) {
          const { target } = attribute;
          const relIdsToAdd = toIds(cleanRelationData.set);
          await this.createQueryBuilder(target).where({ [attribute.joinColumn.referencedColumn]: id }).update({ [attribute.joinColumn.referencedColumn]: null }).transacting(trx).execute();
          await this.createQueryBuilder(target).update({ [attribute.joinColumn.referencedColumn]: id }).where({ id: relIdsToAdd }).transacting(trx).execute();
        }
        if ("joinTable" in attribute && attribute.joinTable) {
          const { joinTable } = attribute;
          const { joinColumn, inverseJoinColumn, orderColumnName, inverseOrderColumnName } = joinTable;
          const relsToAdd = (cleanRelationData.set || cleanRelationData.connect) ?? [];
          const relIdsToadd = toIds(relsToAdd);
          if (isBidirectional(attribute) && isOneToAny(attribute)) {
            await deletePreviousOneToAnyRelations({
              id,
              attribute,
              relIdsToadd,
              db,
              transaction: trx
            });
          }
          const insert = _.uniqBy("id", relsToAdd).map((data2) => {
            return {
              [joinColumn.name]: id,
              [inverseJoinColumn.name]: data2.id,
              ..."on" in joinTable && joinTable.on || {},
              ...data2.__pivot || {}
            };
          });
          if (cleanRelationData.set && hasOrderColumn(attribute)) {
            insert.forEach((data2, idx) => {
              data2[orderColumnName] = idx + 1;
            });
          } else if (cleanRelationData.connect && hasOrderColumn(attribute)) {
            const orderMap = relationsOrderer(
              [],
              inverseJoinColumn.name,
              joinTable.orderColumnName,
              true
              // Always make an strict connect when inserting
            ).connect(relsToAdd).get().reduce((acc, rel, idx) => ({ ...acc, [rel.id]: idx }), {});
            insert.forEach((row) => {
              row[orderColumnName] = orderMap[row[inverseJoinColumn.name]];
            });
          }
          if (hasInverseOrderColumn(attribute)) {
            const maxResults = await db.getConnection().select(inverseJoinColumn.name).max(inverseOrderColumnName, { as: "max" }).whereIn(inverseJoinColumn.name, relIdsToadd).where(joinTable.on || {}).groupBy(inverseJoinColumn.name).from(joinTable.name).transacting(trx);
            const maxMap = maxResults.reduce(
              (acc, res) => Object.assign(acc, { [res[inverseJoinColumn.name]]: res.max }),
              {}
            );
            insert.forEach((rel) => {
              rel[inverseOrderColumnName] = (maxMap[rel[inverseJoinColumn.name]] || 0) + 1;
            });
          }
          if (insert.length === 0) {
            continue;
          }
          await this.createQueryBuilder(joinTable.name).insert(insert).transacting(trx).execute();
        }
      }
    },
    /**
     * Updates relations of an existing entity
     */
    // TODO: check relation exists (handled by FKs except for polymorphics)
    async updateRelations(uid, id, data, options) {
      const { attributes } = db.metadata.get(uid);
      const { transaction: trx } = options ?? {};
      for (const attributeName of Object.keys(attributes)) {
        const attribute = attributes[attributeName];
        if (attribute.type !== "relation" || !_.has(attributeName, data)) {
          continue;
        }
        const cleanRelationData = toAssocs(data[attributeName]);
        if (attribute.relation === "morphOne" || attribute.relation === "morphMany") {
          const { target, morphBy } = attribute;
          const targetAttribute = db.metadata.get(target).attributes[morphBy];
          if (targetAttribute.type === "relation" && targetAttribute.relation === "morphToOne") {
            const { idColumn, typeColumn } = targetAttribute.morphColumn;
            await this.createQueryBuilder(target).update({ [idColumn.name]: null, [typeColumn.name]: null }).where({ [idColumn.name]: id, [typeColumn.name]: uid }).transacting(trx).execute();
            if (!_.isNull(cleanRelationData.set)) {
              const relId = toIds(cleanRelationData.set?.[0]);
              await this.createQueryBuilder(target).update({ [idColumn.name]: id, [typeColumn.name]: uid }).where({ id: relId }).transacting(trx).execute();
            }
          } else if (targetAttribute.type === "relation" && targetAttribute.relation === "morphToMany") {
            const { joinTable } = targetAttribute;
            const { joinColumn, morphColumn } = joinTable;
            const { idColumn, typeColumn } = morphColumn;
            await this.createQueryBuilder(joinTable.name).delete().where({
              [idColumn.name]: id,
              [typeColumn.name]: uid,
              ...joinTable.on || {},
              field: attributeName
            }).transacting(trx).execute();
            if (_.isEmpty(cleanRelationData.set)) {
              continue;
            }
            const rows = cleanRelationData.set?.map((data2, idx) => ({
              [joinColumn.name]: data2.id,
              [idColumn.name]: id,
              [typeColumn.name]: uid,
              ...joinTable.on || {},
              ...data2.__pivot || {},
              order: idx + 1,
              field: attributeName
            }));
            await this.createQueryBuilder(joinTable.name).insert(rows).transacting(trx).execute();
          }
          continue;
        }
        if (attribute.relation === "morphToOne") {
          continue;
        }
        if (attribute.relation === "morphToMany") {
          const { joinTable } = attribute;
          const { joinColumn, morphColumn } = joinTable;
          const { idColumn, typeColumn, typeField = "__type" } = morphColumn;
          await this.createQueryBuilder(joinTable.name).delete().where({
            [joinColumn.name]: id,
            ...joinTable.on || {}
          }).transacting(trx).execute();
          if (_.isEmpty(cleanRelationData.set)) {
            continue;
          }
          const rows = (cleanRelationData.set ?? []).map((data2, idx) => ({
            [joinColumn.name]: id,
            [idColumn.name]: data2.id,
            [typeColumn.name]: data2[typeField],
            ...joinTable.on || {},
            ...data2.__pivot || {},
            order: idx + 1
          }));
          await deleteRelatedMorphOneRelationsAfterMorphToManyUpdate(rows, {
            uid,
            attributeName,
            joinTable,
            db,
            transaction: trx
          });
          await this.createQueryBuilder(joinTable.name).insert(rows).transacting(trx).execute();
          continue;
        }
        if ("joinColumn" in attribute && attribute.joinColumn && attribute.owner) {
          continue;
        }
        if ("joinColumn" in attribute && attribute.joinColumn && !attribute.owner) {
          const { target } = attribute;
          await this.createQueryBuilder(target).where({ [attribute.joinColumn.referencedColumn]: id }).update({ [attribute.joinColumn.referencedColumn]: null }).transacting(trx).execute();
          if (!_.isNull(cleanRelationData.set)) {
            const relIdsToAdd = toIds(cleanRelationData.set);
            await this.createQueryBuilder(target).where({ id: relIdsToAdd }).update({ [attribute.joinColumn.referencedColumn]: id }).transacting(trx).execute();
          }
        }
        if (attribute.joinTable) {
          const { joinTable } = attribute;
          const { joinColumn, inverseJoinColumn, orderColumnName, inverseOrderColumnName } = joinTable;
          const select = [joinColumn.name, inverseJoinColumn.name];
          if (hasOrderColumn(attribute)) {
            select.push(orderColumnName);
          }
          if (hasInverseOrderColumn(attribute)) {
            select.push(inverseOrderColumnName);
          }
          if (_.isNull(cleanRelationData.set)) {
            await deleteRelations({ id, attribute, db, relIdsToDelete: "all", transaction: trx });
          } else {
            const isPartialUpdate = !_.has("set", cleanRelationData);
            let relIdsToaddOrMove;
            if (isPartialUpdate) {
              if (isAnyToOne(attribute)) {
                cleanRelationData.connect = cleanRelationData.connect?.slice(-1);
              }
              relIdsToaddOrMove = toIds(cleanRelationData.connect);
              const relIdsToDelete = toIds(
                _.differenceWith(
                  _.isEqual,
                  cleanRelationData.disconnect,
                  cleanRelationData.connect ?? []
                )
              );
              if (!_.isEmpty(relIdsToDelete)) {
                await deleteRelations({ id, attribute, db, relIdsToDelete, transaction: trx });
              }
              if (_.isEmpty(cleanRelationData.connect)) {
                continue;
              }
              let currentMovingRels = [];
              if (hasOrderColumn(attribute) || hasInverseOrderColumn(attribute)) {
                currentMovingRels = await this.createQueryBuilder(joinTable.name).select(select).where({
                  [joinColumn.name]: id,
                  [inverseJoinColumn.name]: { $in: relIdsToaddOrMove }
                }).where(joinTable.on || {}).transacting(trx).execute();
              }
              const insert = _.uniqBy("id", cleanRelationData.connect).map((relToAdd) => ({
                [joinColumn.name]: id,
                [inverseJoinColumn.name]: relToAdd.id,
                ...joinTable.on || {},
                ...relToAdd.__pivot || {}
              }));
              if (hasOrderColumn(attribute)) {
                const adjacentRelations = await this.createQueryBuilder(joinTable.name).where({
                  $or: [
                    {
                      [joinColumn.name]: id,
                      [inverseJoinColumn.name]: {
                        $in: _.compact(
                          cleanRelationData.connect?.map(
                            (r) => r.position?.after || r.position?.before
                          )
                        )
                      }
                    },
                    {
                      [joinColumn.name]: id,
                      [orderColumnName]: this.createQueryBuilder(joinTable.name).max(orderColumnName).where({ [joinColumn.name]: id }).where(joinTable.on || {}).transacting(trx).getKnexQuery()
                    }
                  ]
                }).where(joinTable.on || {}).transacting(trx).execute();
                const orderMap = relationsOrderer(
                  adjacentRelations,
                  inverseJoinColumn.name,
                  joinTable.orderColumnName,
                  cleanRelationData.options?.strict
                ).connect(cleanRelationData.connect ?? []).getOrderMap();
                insert.forEach((row) => {
                  row[orderColumnName] = orderMap[row[inverseJoinColumn.name]];
                });
              }
              if (hasInverseOrderColumn(attribute)) {
                const nonExistingRelsIds = _.difference(
                  relIdsToaddOrMove,
                  _.map(inverseJoinColumn.name, currentMovingRels)
                );
                const maxResults = await db.getConnection().select(inverseJoinColumn.name).max(inverseOrderColumnName, { as: "max" }).whereIn(inverseJoinColumn.name, nonExistingRelsIds).where(joinTable.on || {}).groupBy(inverseJoinColumn.name).from(joinTable.name).transacting(trx);
                const maxMap = maxResults.reduce(
                  (acc, res) => Object.assign(acc, { [res[inverseJoinColumn.name]]: res.max }),
                  {}
                );
                insert.forEach((row) => {
                  row[inverseOrderColumnName] = (maxMap[row[inverseJoinColumn.name]] || 0) + 1;
                });
              }
              const query = this.createQueryBuilder(joinTable.name).insert(insert).onConflict(joinTable.pivotColumns).transacting(trx);
              if (hasOrderColumn(attribute)) {
                query.merge([orderColumnName]);
              } else {
                query.ignore();
              }
              await query.execute();
              await cleanOrderColumns({ attribute, db, id, transaction: trx });
            } else {
              if (isAnyToOne(attribute)) {
                cleanRelationData.set = cleanRelationData.set?.slice(-1);
              }
              relIdsToaddOrMove = toIds(cleanRelationData.set);
              await deleteRelations({
                id,
                attribute,
                db,
                relIdsToDelete: "all",
                relIdsToNotDelete: relIdsToaddOrMove,
                transaction: trx
              });
              if (_.isEmpty(cleanRelationData.set)) {
                continue;
              }
              const insert = _.uniqBy("id", cleanRelationData.set).map((relToAdd) => ({
                [joinColumn.name]: id,
                [inverseJoinColumn.name]: relToAdd.id,
                ...joinTable.on || {},
                ...relToAdd.__pivot || {}
              }));
              if (hasOrderColumn(attribute)) {
                insert.forEach((row, idx) => {
                  row[orderColumnName] = idx + 1;
                });
              }
              if (hasInverseOrderColumn(attribute)) {
                const existingRels = await this.createQueryBuilder(joinTable.name).select(inverseJoinColumn.name).where({
                  [joinColumn.name]: id,
                  [inverseJoinColumn.name]: { $in: relIdsToaddOrMove }
                }).where(joinTable.on || {}).transacting(trx).execute();
                const inverseRelsIds = _.map(inverseJoinColumn.name, existingRels);
                const nonExistingRelsIds = _.difference(relIdsToaddOrMove, inverseRelsIds);
                const maxResults = await db.getConnection().select(inverseJoinColumn.name).max(inverseOrderColumnName, { as: "max" }).whereIn(inverseJoinColumn.name, nonExistingRelsIds).where(joinTable.on || {}).groupBy(inverseJoinColumn.name).from(joinTable.name).transacting(trx);
                const maxMap = maxResults.reduce(
                  (acc, res) => Object.assign(acc, { [res[inverseJoinColumn.name]]: res.max }),
                  {}
                );
                insert.forEach((row) => {
                  row[inverseOrderColumnName] = (maxMap[row[inverseJoinColumn.name]] || 0) + 1;
                });
              }
              const query = this.createQueryBuilder(joinTable.name).insert(insert).onConflict(joinTable.pivotColumns).transacting(trx);
              if (hasOrderColumn(attribute)) {
                query.merge([orderColumnName]);
              } else {
                query.ignore();
              }
              await query.execute();
            }
            if (isBidirectional(attribute) && isOneToAny(attribute)) {
              await deletePreviousOneToAnyRelations({
                id,
                attribute,
                relIdsToadd: relIdsToaddOrMove,
                db,
                transaction: trx
              });
            }
            if (isAnyToOne(attribute)) {
              await deletePreviousAnyToOneRelations({
                id,
                attribute,
                relIdToadd: relIdsToaddOrMove[0],
                db,
                transaction: trx
              });
            }
          }
        }
      }
    },
    /**
     * Delete relational associations of an existing entity
     * This removes associations but doesn't do cascade deletions for components for example. This will be handled on the entity service layer instead
     * NOTE: Most of the deletion should be handled by ON DELETE CASCADE for dialects that have FKs
     *
     * @param {EntityManager} em - entity manager instance
     * @param {Metadata} metadata - model metadta
     * @param {ID} id - entity ID
     */
    async deleteRelations(uid, id, options) {
      const { attributes } = db.metadata.get(uid);
      const { transaction: trx } = options ?? {};
      for (const attributeName of Object.keys(attributes)) {
        const attribute = attributes[attributeName];
        if (attribute.type !== "relation") {
          continue;
        }
        if (attribute.relation === "morphOne" || attribute.relation === "morphMany") {
          const { target, morphBy } = attribute;
          const targetAttribute = db.metadata.get(target).attributes[morphBy];
          if (targetAttribute.type === "relation" && targetAttribute.relation === "morphToOne") {
            const { idColumn, typeColumn } = targetAttribute.morphColumn;
            await this.createQueryBuilder(target).update({ [idColumn.name]: null, [typeColumn.name]: null }).where({ [idColumn.name]: id, [typeColumn.name]: uid }).transacting(trx).execute();
          } else if (targetAttribute.type === "relation" && targetAttribute.relation === "morphToMany") {
            const { joinTable } = targetAttribute;
            const { morphColumn } = joinTable;
            const { idColumn, typeColumn } = morphColumn;
            await this.createQueryBuilder(joinTable.name).delete().where({
              [idColumn.name]: id,
              [typeColumn.name]: uid,
              ...joinTable.on || {},
              field: attributeName
            }).transacting(trx).execute();
          }
          continue;
        }
        if (attribute.relation === "morphToOne")
          ;
        if (attribute.relation === "morphToMany") {
          const { joinTable } = attribute;
          const { joinColumn } = joinTable;
          await this.createQueryBuilder(joinTable.name).delete().where({
            [joinColumn.name]: id,
            ...joinTable.on || {}
          }).transacting(trx).execute();
          continue;
        }
        if (db.dialect.usesForeignKeys()) {
          return;
        }
        if ("joinColumn" in attribute && attribute.joinColumn && attribute.owner) {
          continue;
        }
        if ("joinColumn" in attribute && attribute.joinColumn && !attribute.owner) {
          const { target } = attribute;
          await this.createQueryBuilder(target).where({ [attribute.joinColumn.referencedColumn]: id }).update({ [attribute.joinColumn.referencedColumn]: null }).transacting(trx).execute();
        }
        if ("joinTable" in attribute && attribute.joinTable) {
          await deleteRelations({ id, attribute, db, relIdsToDelete: "all", transaction: trx });
        }
      }
    },
    // TODO: Clone polymorphic relations
    /**
     *
     * @param {string} uid - uid of the entity to clone
     * @param {number} targetId - id of the entity to clone into
     * @param {number} sourceId - id of the entity to clone from
     * @param {object} opt
     * @param {object} opt.cloneAttrs - key value pair of attributes to clone
     * @param {object} opt.transaction - transaction to use
     * @example cloneRelations('user', 3, 1, { cloneAttrs: ["comments"]})
     * @example cloneRelations('post', 5, 2, { cloneAttrs: ["comments", "likes"] })
     */
    async cloneRelations(uid, targetId, sourceId, data, options) {
      const { attributes } = db.metadata.get(uid);
      const { cloneAttrs = [], transaction } = options ?? {};
      if (!attributes) {
        return;
      }
      await utils.mapAsync(cloneAttrs, async (attrName) => {
        const attribute = attributes[attrName];
        if (attribute.type !== "relation") {
          throw new DatabaseError(
            `Attribute ${attrName} is not a relation attribute. Cloning relations is only supported for relation attributes.`
          );
        }
        if (isPolymorphic(attribute)) {
          return;
        }
        if ("joinColumn" in attribute) {
          return;
        }
        if (!attribute.joinTable) {
          return;
        }
        let omitIds = [];
        if (_.has(attrName, data)) {
          const cleanRelationData = toAssocs(data[attrName]);
          if (cleanRelationData.set) {
            return;
          }
          if (cleanRelationData.disconnect) {
            omitIds = toIds(cleanRelationData.disconnect);
          }
        }
        if (isOneToAny(attribute) && isBidirectional(attribute)) {
          await replaceRegularRelations({ targetId, sourceId, attribute, omitIds, transaction });
        } else {
          await cloneRegularRelations({ targetId, sourceId, attribute, transaction });
        }
      });
      await this.updateRelations(uid, targetId, data, { transaction });
    },
    // TODO: add lifecycle events
    async populate(uid, entity, populate) {
      const entry = await this.findOne(uid, {
        select: ["id"],
        where: { id: entity.id },
        populate
      });
      return { ...entity, ...entry };
    },
    // TODO: add lifecycle events
    async load(uid, entity, fields, populate) {
      const { attributes } = db.metadata.get(uid);
      const fieldsArr = _.castArray(fields);
      fieldsArr.forEach((field) => {
        const attribute = attributes[field];
        if (!attribute || attribute.type !== "relation") {
          throw new Error(`Invalid load. Expected ${field} to be a relational attribute`);
        }
      });
      const entry = await this.findOne(uid, {
        select: ["id"],
        where: { id: entity.id },
        populate: fieldsArr.reduce((acc, field) => {
          acc[field] = populate || true;
          return acc;
        }, {})
      });
      if (!entry) {
        return null;
      }
      if (Array.isArray(fields)) {
        return _.pick(fields, entry);
      }
      return entry[fields];
    },
    // cascading
    // aggregations
    // -> avg
    // -> min
    // -> max
    // -> grouping
    // formulas
    // custom queries
    // utilities
    // -> map result
    // -> map input
    // extra features
    // -> virtuals
    // -> private
    createQueryBuilder(uid) {
      return createQueryBuilder(uid, db);
    },
    getRepository(uid) {
      if (!repoMap[uid]) {
        repoMap[uid] = createRepository(uid, db);
      }
      return repoMap[uid];
    }
  };
};
const createStorage = (opts) => {
  const { db, tableName = "strapi_migrations" } = opts;
  const hasMigrationTable = () => db.getSchemaConnection().hasTable(tableName);
  const createMigrationTable = () => {
    return db.getSchemaConnection().createTable(tableName, (table) => {
      table.increments("id");
      table.string("name");
      table.datetime("time", { useTz: false });
    });
  };
  return {
    async logMigration({ name }) {
      await db.getConnection().insert({
        name,
        time: /* @__PURE__ */ new Date()
      }).into(tableName);
    },
    async unlogMigration({ name }) {
      await db.getConnection(tableName).del().where({ name });
    },
    async executed() {
      if (!await hasMigrationTable()) {
        await createMigrationTable();
        return [];
      }
      const logs = await db.getConnection(tableName).select().from(tableName).orderBy("time");
      return logs.map((log) => log.name);
    }
  };
};
const wrapTransaction = (db) => (fn) => () => {
  return db.connection.transaction((trx) => Promise.resolve(fn(trx)));
};
const migrationResolver = ({ name, path: path2, context }) => {
  const { db } = context;
  if (!path2) {
    throw new Error(`Migration ${name} has no path`);
  }
  if (path2.match(/\.sql$/)) {
    const sql = fse__default.default.readFileSync(path2, "utf8");
    return {
      name,
      up: wrapTransaction(db)((knex2) => knex2.raw(sql)),
      async down() {
        throw new Error("Down migration is not supported for sql files");
      }
    };
  }
  const migration = require(path2);
  return {
    name,
    up: wrapTransaction(db)(migration.up),
    down: wrapTransaction(db)(migration.down)
  };
};
const createUmzugProvider = (db) => {
  const migrationDir = path__default$1.default.join(strapi.dirs.app.root, "database/migrations");
  fse__default.default.ensureDirSync(migrationDir);
  return new umzug.Umzug({
    storage: createStorage({ db, tableName: "strapi_migrations" }),
    logger: console,
    context: { db },
    migrations: {
      glob: ["*.{js,sql}", { cwd: migrationDir }],
      resolve: migrationResolver
    }
  });
};
const createMigrationsProvider = (db) => {
  const migrations = createUmzugProvider(db);
  return {
    async shouldRun() {
      const pending = await migrations.pending();
      return pending.length > 0 && db.config?.settings?.runMigrations === true;
    },
    async up() {
      await migrations.up();
    },
    async down() {
      await migrations.down();
    }
  };
};
const modelsLifecyclesSubscriber = async (event) => {
  const { model } = event;
  if (model.lifecycles && event.action in model.lifecycles) {
    await model.lifecycles[event.action]?.(event);
  }
};
const timestampsLifecyclesSubscriber = {
  /**
   * Init createdAt & updatedAt before create
   */
  beforeCreate(event) {
    const { data } = event.params;
    const now = /* @__PURE__ */ new Date();
    ___default$1.default.defaults(data, { createdAt: now, updatedAt: now });
  },
  /**
   * Init createdAt & updatedAt before create
   * @param {Event} event
   */
  beforeCreateMany(event) {
    const { data } = event.params;
    const now = /* @__PURE__ */ new Date();
    if (___default$1.default.isArray(data)) {
      data.forEach((data2) => ___default$1.default.defaults(data2, { createdAt: now, updatedAt: now }));
    }
  },
  /**
   * Update updatedAt before update
   * @param {Event} event
   */
  beforeUpdate(event) {
    const { data } = event.params;
    const now = /* @__PURE__ */ new Date();
    ___default$1.default.assign(data, { updatedAt: now });
  },
  /**
   * Update updatedAt before update
   * @param {Event} event
   */
  beforeUpdateMany(event) {
    const { data } = event.params;
    const now = /* @__PURE__ */ new Date();
    if (___default$1.default.isArray(data)) {
      data.forEach((data2) => ___default$1.default.assign(data2, { updatedAt: now }));
    }
  }
};
const isValidSubscriber = (subscriber) => {
  return typeof subscriber === "function" || typeof subscriber === "object" && subscriber !== null;
};
const createLifecyclesProvider = (db) => {
  let subscribers = [
    timestampsLifecyclesSubscriber,
    modelsLifecyclesSubscriber
  ];
  return {
    subscribe(subscriber) {
      assert.strict(
        isValidSubscriber(subscriber),
        "Invalid subscriber. Expected function or object"
      );
      subscribers.push(subscriber);
      return () => subscribers.splice(subscribers.indexOf(subscriber), 1);
    },
    clear() {
      subscribers = [];
    },
    createEvent(action, uid, properties, state) {
      const model = db.metadata.get(uid);
      return {
        action,
        model,
        state,
        ...properties
      };
    },
    /**
     * @param {string} action
     * @param {string} uid
     * @param {{ params?: any, result?: any }} properties
     * @param {Map<any, any>} states
     */
    async run(action, uid, properties, states = /* @__PURE__ */ new Map()) {
      for (let i = 0; i < subscribers.length; i += 1) {
        const subscriber = subscribers[i];
        if (typeof subscriber === "function") {
          const state = states.get(subscriber) || {};
          const event = this.createEvent(action, uid, properties, state);
          await subscriber(event);
          if (event.state) {
            states.set(subscriber, event.state || state);
          }
          continue;
        }
        const hasAction = action in subscriber;
        const hasModel = !subscriber.models || subscriber.models.includes(uid);
        if (hasAction && hasModel) {
          const state = states.get(subscriber) || {};
          const event = this.createEvent(action, uid, properties, state);
          await subscriber[action]?.(event);
          if (event.state) {
            states.set(subscriber, event.state);
          }
        }
      }
      return states;
    }
  };
};
class LegacySqliteClient extends SqliteClient__default.default {
  _driver() {
    return require("sqlite3");
  }
}
const clientMap = {
  "better-sqlite3": "better-sqlite3",
  "@vscode/sqlite3": "sqlite",
  sqlite3: LegacySqliteClient
};
const trySqlitePackage = (packageName) => {
  try {
    require.resolve(packageName);
    return packageName;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "MODULE_NOT_FOUND") {
      return false;
    }
    throw error;
  }
};
const getSqlitePackageName = () => {
  if (typeof process.env.SQLITE_PKG !== "undefined") {
    return process.env.SQLITE_PKG;
  }
  const matchingPackage = trySqlitePackage("better-sqlite3") || trySqlitePackage("@vscode/sqlite3") || trySqlitePackage("sqlite3");
  if (!matchingPackage) {
    throw new Error("No sqlite package found");
  }
  return matchingPackage;
};
const createConnection = (config) => {
  const knexConfig = { ...config };
  if (knexConfig.client === "sqlite") {
    const sqlitePackageName = getSqlitePackageName();
    knexConfig.client = clientMap[sqlitePackageName];
  }
  return knex__default.default(knexConfig);
};
const transformAttribute = (attribute) => {
  switch (attribute.type) {
    case "media": {
      return {
        type: "relation",
        relation: attribute.multiple === true ? "morphMany" : "morphOne",
        target: "plugin::upload.file",
        morphBy: "related"
      };
    }
    default: {
      return attribute;
    }
  }
};
const transformContentTypes = (contentTypes) => {
  return contentTypes.map((contentType) => {
    const model = {
      ...contentType,
      // reuse new model def
      singularName: contentType.modelName,
      tableName: contentType.collectionName,
      attributes: {
        ...Object.keys(contentType.attributes || {}).reduce((attrs, attrName) => {
          return Object.assign(attrs, {
            [attrName]: transformAttribute(contentType.attributes[attrName])
          });
        }, {})
      }
    };
    return model;
  });
};
const getLinksWithoutMappedBy = (db) => {
  const relationsToUpdate = {};
  db.metadata.forEach((contentType) => {
    const attributes = contentType.attributes;
    Object.values(attributes).forEach((attribute) => {
      if (attribute.type !== "relation") {
        return;
      }
      if ("inversedBy" in attribute && attribute.inversedBy) {
        const invRelation = db.metadata.get(attribute.target).attributes[attribute.inversedBy];
        if ("inversedBy" in invRelation && invRelation.inversedBy) {
          relationsToUpdate[attribute.joinTable.name] = {
            relation: attribute,
            invRelation
          };
        }
      }
    });
  });
  return Object.values(relationsToUpdate);
};
const isLinkTableEmpty = async (db, linkTableName) => {
  const exists = await db.getSchemaConnection().hasTable(linkTableName);
  if (!exists)
    return true;
  const result = await db.getConnection().from(linkTableName).count("* as count");
  return Number(result[0].count) === 0;
};
const validateBidirectionalRelations = async (db) => {
  const invalidLinks = getLinksWithoutMappedBy(db);
  for (const { relation, invRelation } of invalidLinks) {
    const contentType = db.metadata.get(invRelation.target);
    const invContentType = db.metadata.get(relation.target);
    const joinTableName = getJoinTableName(contentType.tableName, invRelation.inversedBy);
    const inverseJoinTableName = getJoinTableName(invContentType.tableName, relation.inversedBy);
    const joinTableEmpty = await isLinkTableEmpty(db, joinTableName);
    const inverseJoinTableEmpty = await isLinkTableEmpty(db, inverseJoinTableName);
    if (joinTableEmpty) {
      process.emitWarning(
        `Error on attribute "${invRelation.inversedBy}" in model "${contentType.singularName}" (${contentType.uid}). Please modify your ${contentType.singularName} schema by renaming the key "inversedBy" to "mappedBy". Ex: { "inversedBy": "${relation.inversedBy}" } -> { "mappedBy": "${relation.inversedBy}" }`
      );
    } else if (inverseJoinTableEmpty) {
      process.emitWarning(
        `Error on attribute "${relation.inversedBy}" in model "${invContentType.singularName}" (${invContentType.uid}). Please modify your ${invContentType.singularName} schema by renaming the key "inversedBy" to "mappedBy". Ex: { "inversedBy": "${invRelation.inversedBy}" } -> { "mappedBy": "${invRelation.inversedBy}" }`
      );
    } else
      ;
  }
};
const validateRelations = async (db) => {
  await validateBidirectionalRelations(db);
};
async function validateDatabase(db) {
  await validateRelations(db);
}
class Database {
  connection;
  dialect;
  config;
  metadata;
  schema;
  migrations;
  lifecycles;
  entityManager;
  static transformContentTypes = transformContentTypes;
  static async init(config) {
    const db = new Database(config);
    await validateDatabase(db);
    return db;
  }
  constructor(config) {
    this.metadata = createMetadata(config.models);
    this.config = {
      ...config,
      settings: {
        forceMigration: true,
        runMigrations: true,
        ...config.settings ?? {}
      }
    };
    this.dialect = getDialect(this);
    this.dialect.configure();
    this.connection = createConnection(this.config.connection);
    this.dialect.initialize();
    this.schema = createSchemaProvider(this);
    this.migrations = createMigrationsProvider(this);
    this.lifecycles = createLifecyclesProvider(this);
    this.entityManager = createEntityManager(this);
  }
  query(uid) {
    if (!this.metadata.has(uid)) {
      throw new Error(`Model ${uid} not found`);
    }
    return this.entityManager.getRepository(uid);
  }
  inTransaction() {
    return !!transactionCtx.get();
  }
  async transaction(cb) {
    const notNestedTransaction = !transactionCtx.get();
    const trx = notNestedTransaction ? await this.connection.transaction() : transactionCtx.get();
    async function commit() {
      if (notNestedTransaction) {
        await transactionCtx.commit(trx);
      }
    }
    async function rollback() {
      if (notNestedTransaction) {
        await transactionCtx.rollback(trx);
      }
    }
    if (!cb) {
      return { commit, rollback, get: () => trx };
    }
    return transactionCtx.run(trx, async () => {
      try {
        const callbackParams = {
          trx,
          commit,
          rollback,
          onCommit: transactionCtx.onCommit,
          onRollback: transactionCtx.onRollback
        };
        const res = await cb(callbackParams);
        await commit();
        return res;
      } catch (error) {
        await rollback();
        throw error;
      }
    });
  }
  getSchemaName() {
    return this.connection.client.connectionSettings.schema;
  }
  getConnection(tableName) {
    const schema = this.getSchemaName();
    const connection = tableName ? this.connection(tableName) : this.connection;
    return schema ? connection.withSchema(schema) : connection;
  }
  getSchemaConnection(trx = this.connection) {
    const schema = this.getSchemaName();
    return schema ? trx.schema.withSchema(schema) : trx.schema;
  }
  queryBuilder(uid) {
    return this.entityManager.createQueryBuilder(uid);
  }
  async destroy() {
    await this.lifecycles.clear();
    await this.connection.destroy();
  }
}
exports.Database = Database;
exports.errors = index;
exports.isKnexQuery = isKnexQuery;
//# sourceMappingURL=index.js.map
