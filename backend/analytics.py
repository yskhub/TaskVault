import asyncio
import json
import os
from typing import Any, Dict, Optional
from urllib import error as urlerror, request as urlrequest


def _get_supabase_rest_base() -> Optional[tuple[str, str]]:
    """Return (url, service_role_key) if Supabase is configured, else None."""

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return None
    return url.rstrip("/"), key


def _post_usage_event(payload: Dict[str, Any]) -> None:
    base = _get_supabase_rest_base()
    if base is None:
        return

    base_url, key = base
    url = f"{base_url}/rest/v1/usage_events"

    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

    data = json.dumps(payload).encode("utf-8")
    req = urlrequest.Request(url, headers=headers, method="POST", data=data)

    try:
        with urlrequest.urlopen(req, timeout=5):
            # We intentionally ignore the body; this is fire-and-forget.
            return
    except (urlerror.HTTPError, urlerror.URLError, Exception):  # pragma: no cover - best effort
        # Never raise from analytics; logging is non-critical.
        return


async def log_usage_event(
    *,
    user_id: Optional[str],
    event: str,
    metadata: Optional[Dict[str, Any]] = None,
) -> None:
    """Best-effort usage logging to a Supabase `usage_events` table.

    This helper is intentionally soft-fail and runs the network call in a
    background thread so it doesn't block the main event loop.
    """

    # Environment toggle so this can be disabled entirely if desired.
    if os.getenv("USAGE_ANALYTICS_ENABLED", "true").lower() not in {"1", "true", "yes"}:
        return

    payload: Dict[str, Any] = {"event_type": event}
    if user_id is not None:
        payload["user_id"] = user_id
    if metadata is not None:
        payload["metadata"] = metadata

    # Offload the HTTP call to a worker thread so this await is cheap.
    await asyncio.to_thread(_post_usage_event, payload)
