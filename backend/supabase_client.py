import os
import json
import time
from urllib import request, error


def check_supabase_connection() -> tuple[bool, dict]:
	"""Ping Supabase Auth health endpoint to verify connectivity and credentials.

	Returns a tuple of (ok, detail) where detail is a dict including status,
	parsed response data, and measured latency in milliseconds. This uses
	only Supabase's free Auth health endpoint and does not require any paid
	features.
	"""
	url = os.getenv("SUPABASE_URL")
	key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
	if not url or not key:
		return False, {"error": "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set", "latency_ms": None}

	health_url = f"{url.rstrip('/')}/auth/v1/health"
	headers = {
		"apikey": key,
		"Authorization": f"Bearer {key}",
	}

	req = request.Request(health_url, headers=headers, method="GET")
	start = time.perf_counter()
	try:
		with request.urlopen(req, timeout=5) as resp:
			status = resp.getcode()
			body = resp.read().decode("utf-8") or "{}"
			elapsed_ms = round((time.perf_counter() - start) * 1000, 1)
			try:
				data = json.loads(body)
			except json.JSONDecodeError:
				data = {"raw": body}

			detail = {"status": status, "data": data, "latency_ms": elapsed_ms}
			if 200 <= status < 300:
				return True, detail
			return False, detail
	except error.HTTPError as e:
		elapsed_ms = round((time.perf_counter() - start) * 1000, 1)
		return False, {"error": f"HTTPError: {e.code} {e.reason}", "latency_ms": elapsed_ms}
	except error.URLError as e:
		elapsed_ms = round((time.perf_counter() - start) * 1000, 1)
		return False, {"error": f"URLError: {e.reason}", "latency_ms": elapsed_ms}
	except Exception as e:
		elapsed_ms = round((time.perf_counter() - start) * 1000, 1)
		return False, {"error": f"Exception: {e}", "latency_ms": elapsed_ms}
