import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { resolvePath } from "./util.js";

sqlite3.verbose();
const db = await open({
  filename: resolvePath("database.db"),
  driver: sqlite3.Database,
});

export default db;
