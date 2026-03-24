#!/usr/bin/env python3

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REV_CHUNK_SIZE = 64

TOKEN_PATTERNS = {
    "AWS access key": r"AKIA[0-9A-Z]{16}",
    "Google API key": r"AIza[0-9A-Za-z_-]{35}",
    "GitHub token": r"(gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{20,255})",
    "OpenAI key": r"sk-(live|test|proj)-[A-Za-z0-9_-]{16,}",
    "Slack token": r"xox[baprs]-[A-Za-z0-9-]{10,}",
    "Private key block": r"-----BEGIN (RSA|DSA|EC|OPENSSH|PGP|PRIVATE) KEY-----",
}

SENSITIVE_KEYS = {
    "ANTHROPIC_API_KEY",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "DATABASE_URL",
    "DISCORD_TOKEN",
    "GEMINI_API_KEY",
    "GITHUB_TOKEN",
    "GOOGLE_API_KEY",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "JWT_ACCESS_SECRET",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NPM_TOKEN",
    "OPENAI_API_KEY",
    "SLACK_BOT_TOKEN",
    "STRIPE_SECRET_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_URL",
    "VERCEL_TOKEN",
}

GENERIC_SENSITIVE_KEY = re.compile(
    r"(?i)^[A-Za-z0-9_.-]*(secret|token|api[_-]?key|password|dsn|database_url)[A-Za-z0-9_.-]*$"
)
ASSIGNMENT_LINE = re.compile(r"^\s*([A-Za-z0-9_.-]+)\s*[:=]\s*(.+?)\s*$")
TYPE_LIKE_VALUE = re.compile(r"^[A-Za-z_][A-Za-z0-9_<>{}\[\]| ]*;?$")
PLACEHOLDER_VALUE = re.compile(
    r"(?ix)^("
    r"\$\{[^}]+\}"
    r"|<[^>]+>"
    r"|replace-me"
    r"|change-this[0-9A-Za-z._-]*"
    r"|your-[0-9A-Za-z._-]+"
    r"|test[-_:/A-Za-z0-9.!]*"
    r"|dummy[-_:/A-Za-z0-9.!]*"
    r"|example[-_:/A-Za-z0-9.!]*"
    r"|postgres://\.\.\."
    r"|https?://localhost(?::\d+)?(?:/.*)?"
    r"|/editor"
    r"|facadely"
    r"|false"
    r"|true"
    r"|Lax"
    r"|Password123!"
    r"|eyJ\.\.\."
    r"|x{4,}(?:\s+\(for [^)]+\))?"
    r")$"
)
IGNORED_PREFIXES = (
    ".git/",
    ".next/",
    "node_modules/",
    "coverage/",
    "dist/",
    "backend/.gradle/",
    "backend/build/",
)


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=ROOT, check=check, text=True, capture_output=True)


def tracked_files() -> list[Path]:
    result = run(["git", "ls-files", "-z"])
    return [ROOT / part for part in result.stdout.split("\0") if part]


def git_revisions() -> list[str]:
    result = run(["git", "rev-list", "--all"])
    return [line for line in result.stdout.splitlines() if line]


def is_binary(data: bytes) -> bool:
    return b"\0" in data


def normalize_value(value: str) -> str:
    return value.strip().rstrip(",;").strip("'\"")


def is_placeholder(value: str) -> bool:
    normalized = normalize_value(value)
    if not normalized:
        return True
    if "xxxxx" in normalized.lower():
        return True
    if PLACEHOLDER_VALUE.match(normalized):
        return True
    if normalized.startswith("${") and normalized.endswith("}"):
        return True
    if normalized.endswith("..."):
        return True
    return False


def should_check_key(key: str) -> bool:
    if key in SENSITIVE_KEYS:
        return True
    if key != key.upper() and key != key.lower():
        return False
    return bool(GENERIC_SENSITIVE_KEY.match(key))


def looks_like_literal_value(value: str) -> bool:
    normalized = normalize_value(value)
    if not normalized:
        return False
    if TYPE_LIKE_VALUE.match(normalized):
        return False
    if value.lstrip().startswith(("'", '"', "`")):
        return True
    if normalized.startswith(("http://", "https://", "postgres://")):
        return True
    if len(normalized) >= 12 and re.search(r"[@/:=._-]", normalized):
        return True
    return bool(re.fullmatch(r"[A-Za-z0-9+/=_-]{16,}", normalized))


def add_finding(findings: list[tuple[str, str]], location: str, detail: str) -> None:
    entry = (location, detail)
    if entry not in findings:
        findings.append(entry)


def scan_worktree() -> list[tuple[str, str]]:
    findings: list[tuple[str, str]] = []
    for path in tracked_files():
        rel = path.relative_to(ROOT).as_posix()
        if rel.startswith(IGNORED_PREFIXES):
            continue
        try:
            data = path.read_bytes()
        except OSError:
            continue
        if is_binary(data):
            continue
        text = data.decode("utf-8", errors="replace")
        for line_no, line in enumerate(text.splitlines(), start=1):
            for label, pattern in TOKEN_PATTERNS.items():
                if re.search(pattern, line):
                    add_finding(findings, f"{rel}:{line_no}", label)
            match = ASSIGNMENT_LINE.match(line)
            if not match:
                continue
            key, value = match.groups()
            if should_check_key(key) and looks_like_literal_value(value) and not is_placeholder(value):
                add_finding(findings, f"{rel}:{line_no}", f"suspicious assignment for {key}")
    return findings


def scan_history() -> list[tuple[str, str]]:
    findings: list[tuple[str, str]] = []
    revisions = git_revisions()
    if not revisions:
        return findings

    for label, pattern in TOKEN_PATTERNS.items():
        for start in range(0, len(revisions), REV_CHUNK_SIZE):
            chunk = revisions[start : start + REV_CHUNK_SIZE]
            result = run(["git", "grep", "-nI", "-E", pattern, *chunk, "--"], check=False)
            for line in result.stdout.splitlines():
                location = line.rsplit(":", 1)[0]
                add_finding(findings, location, label)

    assignment_pattern = r"^\s*[A-Za-z0-9_.-]+\s*[:=]\s*.+$"
    for start in range(0, len(revisions), REV_CHUNK_SIZE):
        chunk = revisions[start : start + REV_CHUNK_SIZE]
        result = run(["git", "grep", "-nI", "-E", assignment_pattern, *chunk, "--"], check=False)
        for line in result.stdout.splitlines():
            parts = line.split(":", 3)
            if len(parts) != 4:
                continue
            rev, path, line_no, content = parts
            match = ASSIGNMENT_LINE.match(content)
            if not match:
                continue
            key, value = match.groups()
            if should_check_key(key) and looks_like_literal_value(value) and not is_placeholder(value):
                add_finding(findings, f"{rev}:{path}:{line_no}", f"suspicious assignment for {key}")
    return findings


def print_section(title: str, findings: list[tuple[str, str]]) -> None:
    print(title)
    if not findings:
        print("  clean")
        return
    for location, detail in findings:
        print(f"  {location} -> {detail}")


def main() -> int:
    worktree_findings = scan_worktree()
    history_findings = scan_history()

    print_section("Working tree scan", worktree_findings)
    print_section("Git history scan", history_findings)

    if worktree_findings or history_findings:
        return 1

    print("Secret scan passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
