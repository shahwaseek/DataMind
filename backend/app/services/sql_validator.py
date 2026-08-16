import re
from typing import Tuple


class SQLValidationError(Exception):
    pass


FORBIDDEN_KEYWORDS = {
    "CREATE", "ALTER", "DROP", "TRUNCATE", "RENAME",
    "INSERT", "UPDATE", "DELETE", "MERGE", "UPSERT",
    "GRANT", "REVOKE",
    "INSTALL", "LOAD", "ATTACH", "DETACH", "PRAGMA", "COPY", "EXPORT",
    "SYSTEM", "EXEC", "EXECUTE", "PREPARE"
}

FORBIDDEN_FUNCTIONS = {
    "READ_CSV", "READ_CSV_AUTO", "READ_PARQUET", "READ_JSON", "READ_JSON_AUTO",
    "READ_NDJSON", "READ_TEXT", "READ_BLOB", "WRITE_CSV", "WRITE_PARQUET"
}


def validate_sql_safety(sql_query: str) -> Tuple[bool, str]:
    """
    Validates that a SQL query is strictly read-only and safe for execution.
    Returns (is_valid, reason_or_normalized_sql).
    """
    if not sql_query or not sql_query.strip():
        raise SQLValidationError("SQL query is empty")

    query = sql_query.strip()
    # Strip trailing semicolons
    query = re.sub(r';+\s*$', '', query)

    # Check for multiple statements separated by semicolon
    if ';' in query:
        raise SQLValidationError("Multiple SQL statements in a single query are strictly forbidden")

    normalized = query.upper()

    # Must start with SELECT or WITH
    if not (normalized.startswith("SELECT") or normalized.startswith("WITH")):
        raise SQLValidationError("Only read-only SELECT or WITH queries are permitted")

    # Check forbidden keywords
    tokens = set(re.findall(r'\b[A-Z_]+\b', normalized))
    
    found_forbidden_kw = tokens.intersection(FORBIDDEN_KEYWORDS)
    if found_forbidden_kw:
        raise SQLValidationError(f"Forbidden SQL keyword(s) detected: {', '.join(found_forbidden_kw)}")

    found_forbidden_fn = tokens.intersection(FORBIDDEN_FUNCTIONS)
    if found_forbidden_fn:
        raise SQLValidationError(f"Forbidden external function(s) detected: {', '.join(found_forbidden_fn)}")

    return True, query
