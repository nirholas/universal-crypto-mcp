"""
Unfollow CLI commands.
"""

from __future__ import annotations

import click
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn

from xeepy.cli.utils import (
    async_command,
    output_result,
    print_warning,
    print_success,
    print_info,
    confirm_action,
)

console = Console()


@click.group()
def unfollow():
    """
    Unfollow commands.
    
    Smart unfollow operations with safety features.
    
    ⚠️ EDUCATIONAL PURPOSES ONLY
    """
    pass


@unfollow.command()
@click.argument("username")
@click.option("--dry-run", is_flag=True, help="Preview without unfollowing")
@async_command
async def user(username: str, dry_run: bool):
    """
    Unfollow a specific user.
    
    Example:
        xeepy unfollow user inactive_user --dry-run
    """
    print_warning("This is a demo - no actual unfollowing is performed.")
    
    if dry_run:
        print_info(f"[DRY RUN] Would unfollow @{username}")
    else:
        print_success(f"Unfollowed @{username}")


@unfollow.command(name="non-followers")
@click.option("--max", "-m", "max_unfollows", default=100, help="Maximum users to unfollow")
@click.option("--whitelist", "-w", multiple=True, help="Users to keep (never unfollow)")
@click.option("--min-following-days", default=7, help="Minimum days you've been following")
@click.option("--export", "-e", help="Export list before unfollowing")
@click.option("--dry-run", is_flag=True, help="Preview without unfollowing")
@async_command
async def non_followers(
    max_unfollows: int,
    whitelist: tuple[str, ...],
    min_following_days: int,
    export: str | None,
    dry_run: bool,
):
    """
    Unfollow users who don't follow you back.
    
    Example:
        xeepy unfollow non-followers --max 50 --dry-run
    """
    print_warning("This is a demo - no actual unfollowing is performed.")
    
    console.print(f"\n[cyan]Max unfollows:[/cyan] {max_unfollows}")
    console.print(f"[cyan]Min following days:[/cyan] {min_following_days}")
    if whitelist:
        console.print(f"[cyan]Whitelisted:[/cyan] {', '.join(f'@{u}' for u in whitelist)}")
    
    # Demo non-followers
    demo_non_followers = [
        {
            "username": f"non_follower_{i}",
            "following_since_days": min_following_days + i,
            "followers_count": 100 * i,
        }
        for i in range(1, min(max_unfollows, 10) + 1)
    ]
    
    # Filter out whitelisted
    demo_non_followers = [
        u for u in demo_non_followers
        if u["username"] not in whitelist
    ]
    
    if export:
        output_result(demo_non_followers, "json", export)
    
    table = Table(title="Non-Followers Found")
    table.add_column("Username", style="cyan")
    table.add_column("Following Days", style="green")
    table.add_column("Their Followers", style="yellow")
    table.add_column("Action", style="red")
    
    for user in demo_non_followers[:10]:
        action = "[DRY RUN]" if dry_run else "Unfollowed"
        table.add_row(
            f"@{user['username']}",
            str(user["following_since_days"]),
            f"{user['followers_count']:,}",
            action,
        )
    
    console.print(table)
    
    total = len(demo_non_followers)
    print_success(f"{'Would unfollow' if dry_run else 'Unfollowed'} {total} non-followers")


@unfollow.command()
@click.option("--max", "-m", "max_unfollows", default=100, help="Maximum users to unfollow")
@click.option("--whitelist", "-w", multiple=True, help="Users to keep")
@click.option("--confirm", "require_confirm", is_flag=True, default=True, help="Require confirmation")
@click.option("--dry-run", is_flag=True, help="Preview without unfollowing")
@async_command
async def all(
    max_unfollows: int,
    whitelist: tuple[str, ...],
    require_confirm: bool,
    dry_run: bool,
):
    """
    Unfollow everyone (except whitelist).
    
    ⚠️ USE WITH CAUTION
    
    Example:
        xeepy unfollow all --whitelist important_user --dry-run
    """
    print_warning("This is a demo - no actual unfollowing is performed.")
    print_warning("⚠️ This will unfollow ALL users (except whitelist)!")
    
    if whitelist:
        console.print(f"\n[cyan]Whitelisted:[/cyan] {', '.join(f'@{u}' for u in whitelist)}")
    
    if require_confirm and not dry_run:
        if not confirm_action("Are you SURE you want to unfollow everyone?"):
            console.print("[yellow]Cancelled.[/yellow]")
            return
    
    demo_count = min(max_unfollows, 20)
    print_success(f"{'Would unfollow' if dry_run else 'Unfollowed'} {demo_count} users")


@unfollow.command()
@click.option("--inactive-days", default=90, help="Days of inactivity")
@click.option("--max", "-m", "max_unfollows", default=100, help="Maximum to unfollow")
@click.option("--dry-run", is_flag=True, help="Preview without unfollowing")
@async_command
async def inactive(
    inactive_days: int,
    max_unfollows: int,
    dry_run: bool,
):
    """
    Unfollow inactive accounts.
    
    Example:
        xeepy unfollow inactive --inactive-days 90 --max 50
    """
    print_warning("This is a demo - no actual unfollowing is performed.")
    
    console.print(f"\n[cyan]Inactive threshold:[/cyan] {inactive_days} days")
    
    # Demo inactive users
    demo_inactive = [
        {
            "username": f"inactive_user_{i}",
            "last_tweet_days": inactive_days + i * 10,
        }
        for i in range(1, min(max_unfollows, 5) + 1)
    ]
    
    table = Table(title="Inactive Users")
    table.add_column("Username", style="cyan")
    table.add_column("Days Since Last Tweet", style="yellow")
    
    for user in demo_inactive:
        table.add_row(f"@{user['username']}", str(user["last_tweet_days"]))
    
    console.print(table)
    print_success(f"{'Would unfollow' if dry_run else 'Unfollowed'} {len(demo_inactive)} inactive users")


@unfollow.command()
@click.option("--min-bot-score", default=0.7, help="Minimum bot probability (0-1)")
@click.option("--max", "-m", "max_unfollows", default=100, help="Maximum to unfollow")
@click.option("--dry-run", is_flag=True, help="Preview without unfollowing")
@async_command
async def bots(
    min_bot_score: float,
    max_unfollows: int,
    dry_run: bool,
):
    """
    Unfollow likely bot accounts.
    
    Example:
        xeepy unfollow bots --min-bot-score 0.8 --dry-run
    """
    print_warning("This is a demo - no actual unfollowing is performed.")
    
    console.print(f"\n[cyan]Bot score threshold:[/cyan] {min_bot_score}")
    
    demo_bots = [
        {
            "username": f"bot_account_{i}",
            "bot_score": min_bot_score + (0.3 - i * 0.05),
        }
        for i in range(1, min(max_unfollows, 5) + 1)
    ]
    
    table = Table(title="Likely Bots")
    table.add_column("Username", style="cyan")
    table.add_column("Bot Score", style="red")
    
    for user in demo_bots:
        table.add_row(f"@{user['username']}", f"{user['bot_score']:.1%}")
    
    console.print(table)
    print_success(f"{'Would unfollow' if dry_run else 'Unfollowed'} {len(demo_bots)} likely bots")


@unfollow.command()
@click.option("--followed-before", help="Unfollow users followed before this date (YYYY-MM-DD)")
@click.option("--followed-after", help="Unfollow users followed after this date (YYYY-MM-DD)")
@click.option("--min-followers", type=int, help="Minimum followers of the account")
@click.option("--max-followers", type=int, help="Maximum followers of the account")
@click.option("--max", "-m", "max_unfollows", default=100, help="Maximum to unfollow")
@click.option("--dry-run", is_flag=True, help="Preview without unfollowing")
@async_command
async def by_criteria(
    followed_before: str | None,
    followed_after: str | None,
    min_followers: int | None,
    max_followers: int | None,
    max_unfollows: int,
    dry_run: bool,
):
    """
    Unfollow users matching specific criteria.
    
    Example:
        xeepy unfollow by-criteria --max-followers 50 --dry-run
    """
    print_warning("This is a demo - no actual unfollowing is performed.")
    
    console.print("\n[bold cyan]Criteria:[/bold cyan]")
    if followed_before:
        console.print(f"  Followed before: {followed_before}")
    if followed_after:
        console.print(f"  Followed after: {followed_after}")
    if min_followers:
        console.print(f"  Min followers: {min_followers:,}")
    if max_followers:
        console.print(f"  Max followers: {max_followers:,}")
    
    demo_count = min(max_unfollows, 5)
    print_success(f"{'Would unfollow' if dry_run else 'Unfollowed'} {demo_count} matching users")
