import os
import json
from urllib import request, error


def check_supabase_connection() -> tuple[bool, str]:
	"""Ping Supabase Auth health endpoint to verify connectivity and credentials."""
	url = os.getenv("SUPABASE_URL")
	key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
	if not url or not key:
		return False, "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set"

	health_url = f"{url.rstrip('/')}/auth/v1/health"
	headers = {
		"apikey": key,
		"Authorization": f"Bearer {key}",
	}

	req = request.Request(health_url, headers=headers, method="GET")
	try:
		with request.urlopen(req, timeout=5) as resp:
			status = resp.getcode()
			body = resp.read().decode("utf-8") or "{}"
			try:
				data = json.loads(body)
			except json.JSONDecodeError:
				data = {"raw": body}

			if 200 <= status < 300:
				return True, json.dumps({"status": status, "data": data})
			return False, json.dumps({"status": status, "data": data})
	except error.HTTPError as e:
		return False, f"HTTPError: {e.code} {e.reason}"
	except error.URLError as e:
		return False, f"URLError: {e.reason}"
	except Exception as e:
		return False, f"Exception: {e}"
