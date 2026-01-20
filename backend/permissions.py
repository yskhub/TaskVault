from fastapi import HTTPException, status


def enforce_team_limit(plan: str, count: int) -> None:

    limits = {"free": 5, "pro": 10}
    limit = limits.get(plan, 5)
    if count >= limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"{plan.capitalize()} plan is limited to {limit} team members.",
        )
