import sqlite3
import os
import json
import hashlib
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

try:
    import psycopg2
    import psycopg2.extras
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "camino_vocacional.db")

SALT = "CaminoVocacional_2026_SaltSecure"

def hash_password(password: str) -> str:
    return hashlib.sha256(f"{SALT}_{password}".encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

# Excepción de integridad unificada
DBIntegrityError = (sqlite3.IntegrityError, psycopg2.IntegrityError) if PSYCOPG2_AVAILABLE else sqlite3.IntegrityError

class PostgresCursorWrapper:
    """Cursor que traduce ? a %s y provee lastrowid idéntico a SQLite"""
    def __init__(self, raw_cursor):
        self.raw_cursor = raw_cursor
        self.lastrowid = None

    def execute(self, query, params=None):
        clean_query = query.replace("?", "%s")
        # Si es un INSERT sin RETURNING y sin ON CONFLICT, agregar RETURNING id para capturar lastrowid
        is_insert = clean_query.strip().upper().startswith("INSERT INTO")
        if is_insert and "RETURNING" not in clean_query.upper() and "ON CONFLICT" not in clean_query.upper():
            clean_query += " RETURNING id"
            if params:
                self.raw_cursor.execute(clean_query, params)
            else:
                self.raw_cursor.execute(clean_query)
            try:
                res = self.raw_cursor.fetchone()
                if res:
                    self.lastrowid = res[0]
            except Exception:
                pass
        else:
            if params:
                self.raw_cursor.execute(clean_query, params)
            else:
                self.raw_cursor.execute(clean_query)
        return self

    def fetchone(self):
        return self.raw_cursor.fetchone()

    def fetchall(self):
        return self.raw_cursor.fetchall()

    def close(self):
        return self.raw_cursor.close()

    def __getattr__(self, name):
        return getattr(self.raw_cursor, name)

class PostgresConnectionWrapper:
    """Conexión que envuelve los cursores para comportamiento transparente"""
    def __init__(self, raw_conn):
        self.raw_conn = raw_conn

    def cursor(self):
        return PostgresCursorWrapper(self.raw_conn.cursor())

    def commit(self):
        return self.raw_conn.commit()

    def rollback(self):
        return self.raw_conn.rollback()

    def close(self):
        return self.raw_conn.close()

    def __getattr__(self, name):
        return getattr(self.raw_conn, name)

_schema_initialized = False

def ensure_schema(conn):
    global _schema_initialized
    if _schema_initialized:
        return
    try:
        cur = conn.cursor()
        try:
            cur.execute("ALTER TABLE usuarios ADD COLUMN telefono_apoderado TEXT")
            conn.commit()
        except Exception:
            pass
        _schema_initialized = True
    except Exception:
        pass

def get_db_connection():
    """Retorna conexión a Supabase (PostgreSQL) si DATABASE_URL existe, o SQLite como fallback"""
    conn = None
    if DATABASE_URL and PSYCOPG2_AVAILABLE and ("postgres://" in DATABASE_URL or "postgresql://" in DATABASE_URL):
        try:
            raw_conn = psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.DictCursor)
            conn = PostgresConnectionWrapper(raw_conn)
        except Exception as e:
            print("Aviso: no se pudo conectar a PostgreSQL/Supabase, usando SQLite fallback:", e)

    if conn is None:
        raw_sqlite = sqlite3.connect(DB_PATH)
        raw_sqlite.row_factory = sqlite3.Row
        conn = raw_sqlite

    ensure_schema(conn)
    return conn

def is_using_supabase():
    return bool(DATABASE_URL and PSYCOPG2_AVAILABLE and ("postgres://" in DATABASE_URL or "postgresql://" in DATABASE_URL))

