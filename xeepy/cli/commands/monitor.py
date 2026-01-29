"""
Monitoring CLI commands.
"""

from __future__ import annotations

import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn

from xeepy.cli.utils import (
    async_command,
    output_result,
    print_warning,
    print_success,
    print_info,
    format_number,
)

console = Console()


@click.group()
def monitor():
    """
    Monitoring commands.
    
    Track unfollowers, monitor accounts, analyze growth.
    
    ⚠️ EDUCATIONAL PURPOSES ONLY
    """
    pass


@monitor.command()
@click.option("--notify", is_flag=True, help="Send notifications")
@click.option("--output", "-o", help="Output file for results")
@click.option("--format", "-f", "fmt", default="table", type=click.Choice(["json", "csv", "table"]))
@async_command
async def unfollowers(notify: bool, output: str | None, fmt: str):
    """
    Detect who unfollowed you.
    
    Example:
        xeepy monitor unfollowers --notify
    """
    print_warning("This is a demo - no actual monitoring is performed.")
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task("Checking for unfollowers...", total=None)
        
        import asyncio
        await asyncio.sleep(1)
    
    # Demo data
    demo_unfollowers = [
        {"username": "former_follower_1", "unfollowed_at": "2024-01-15", "was_following_days": 30},
        {"username": "former_follower_2", "unfollowed_at": "2024-01-14", "was_following_days": 60},
        {"username": "former_follower_3", "unfollowed_at": "2024-01-13", "was_following_days": 15},
    ]
    
    if fmt == "table":
        table = Table(title="Recent Unfollowers")
        table.add_column("Username", style="cyan")
        table.add_column("Unfollowed", style="red")
        table.add_column("Was Following", style="yellow")
        
        for user in demo_unfollowers:
            table.add_row(
                f"@{user['username']}",
                user["unfollowed_at"],
                f"{user['was_following_days']} days",
            )
        
        console.print(table)
    else:
        output_result(demo_unfollowers, fmt, output)
    
    if notify:
        print_info("Notification would be sent (demo)")
    
    print_success(f"Found {len(demo_unfollowers)} recent unfollowers")


@monitor.command()
@click.option("--notify", is_flag=True, help="Send notifications for new followers")
@click.option("--since", help="Check followers since date (YYYY-MM-DD)")
@async_command
async def new_followers(notify: bool, since: str | None):
    """
    Monitor for new followers.
    
    Example:
        xeepy monitor new-followers --notify
    """
    print_warning("This is a demo - no actual monitoring is performed.")
    
    demo_new = [
        {"username": "new_follower_1", "followed_at": "2024-01-16", "followers_count": 500},
        {"username": "new_follower_2", "followed_at": "2024-01-16", "followers_count": 1200},
    ]
    
    table = Table(title="New Followers")
    table.add_column("Username", style="cyan")
    table.add_column("Followed", style="green")
    table.add_column("Their Followers", style="yellow")
    
    for user in demo_new:
        table.add_row(
            f"@{user['username']}",
            user["followed_at"],
            format_number(user["followers_count"]),
        )
    
    console.print(table)
    
    if notify:
        print_info("Notification would be sent (demo)")
    
    print_success(f"Found {len(demo_new)} new followers")


@monitor.command()
@click.argument("username")
@click.option("--watch", is_flag=True, help="Continuous monitoring")
@click.option("--interval", default=60, help="Check interval in minutes")
@click.option("--notify", is_flag=True, help="Send notifications")
@async_command
async def account(username: str, watch: bool, interval: int, notify: bool):
    """
    Monitor any account for changes.
    
    Example:
        xeepy monitor account competitor_account --watch --interval 30
    """
    print_warning("This is a demo - no actual monitoring is performed.")
    
    console.print(f"\n[cyan]Monitoring:[/cyan] @{username}")
    if watch:
        console.print(f"[cyan]Interval:[/cyan] {interval} minutes")
    
    # Demo current stats
    demo_stats = {
        "username": username,
        "followers": 125000,
        "following": 500,
        "tweets": 5432,
        "last_tweet": "2 hours ago",
    }
    
    panel = Panel(
        f"""[bold]@{demo_stats['username']}[/bold]

Followers: [green]{format_number(demo_stats['followers'])}[/green]
Following: [blue]{format_number(demo_stats['following'])}[/blue]
Tweets: [yellow]{format_number(demo_stats['tweets'])}[/yellow]
Last Tweet: {demo_stats['last_tweet']}""",
        title="Account Stats",
    )
    
    console.print(panel)
    
    if watch:
        print_info(f"Would monitor @{username} every {interval} minutes (demo)")


@monitor.command()
@click.argument("keywords", nargs=-1, required=True)
@click.option("--notify", is_flag=True, help="Send notifications")
@click.option("--min-engagement", default=10, help="Minimum engagement to alert")
@async_command
async def keywords(keywords: tuple[str, ...], notify: bool, min_engagement: int):
    """
    Monitor for tweets matching keywords.
    
    Example:
        xeepy monitor keywords "your brand" "your product" --notify
    """
    print_warning("This is a demo - no actual monitoring is performed.")
    
    console.print(f"\n[cyan]Keywords:[/cyan] {', '.join(keywords)}")
    console.print(f"[cyan]Min engagement:[/cyan] {min_engagement}")
    
    demo_matches = [
        {"author": "user_1", "text": f"Just discovered {keywords[0]}!", "likes": 50},
        {"author": "user_2", "text": f"Anyone using {keywords[0]}?", "likes": 25},
    ]
    
    table = Table(title="Matching Tweets")
    table.add_column("Author", style="cyan")
    table.add_column("Tweet", style="white")
    table.add_column("Likes", style="green")
    
    for tweet in demo_matches:
        table.add_row(
            f"@{tweet['author']}",
            tweet["text"][:40] + "...",
            str(tweet["likes"]),
        )
    
    console.print(table)
    
    if notify:
        print_info("Notification would be sent (demo)")


@monitor.command()
@click.option("--days", default=30, help="Number of days to analyze")
@click.option("--output", "-o", help="Output file")
@async_command
async def growth(days: int, output: str | None):
    """
    Analyze account growth over time.
    
    Example:
        xeepy monitor growth --days 30
    """
    print_warning("This is a demo - no actual analysis is performed.")
    
    console.print(f"\n[cyan]Analyzing last {days} days...[/cyan]\n")
    
    demo_growth = {
        "period_days": days,
        "followers_start": 10000,
        "followers_end": 10500,
        "followers_gained": 600,
        "followers_lost": 100,
        "net_growth": 500,
        "growth_rate": 5.0,
        "avg_daily_growth": 16.7,
        "best_day": {"date": "2024-01-10", "gained": 50},
        "worst_day": {"date": "2024-01-05", "lost": 20},
    }
    
    panel = Panel(
        f"""[bold]Growth Analysis ({days} days)[/bold]

Starting Followers: [blue]{format_number(demo_growth['followers_start'])}[/blue]
Current Followers: [green]{format_number(demo_growth['followers_end'])}[/green]

Gained: [green]+{demo_growth['followers_gained']}[/green]
Lost: [red]-{demo_growth['followers_lost']}[/red]
Net Growth: [bold green]+{demo_growth['net_growth']}[/bold green]

Growth Rate: [cyan]{demo_growth['growth_rate']}%[/cyan]
Daily Average: [cyan]+{demo_growth['avg_daily_growth']:.1f}[/cyan]

Best Day: {demo_growth['best_day']['date']} ([green]+{demo_growth['best_day']['gained']}[/green])
Worst Day: {demo_growth['worst_day']['date']} ([red]-{demo_growth['worst_day']['lost']}[/red])""",
        title="📈 Growth Report",
    )
    
    console.print(panel)
    
    if output:
        output_result(demo_growth, "json", output)


@monitor.command()
@click.option("--days", default=7, help="Number of days to analyze")
@async_command
async def engagement(days: int):
    """
    Analyze engagement metrics.
    
    Example:
        xeepy monitor engagement --days 7
    """
    print_warning("This is a demo - no actual analysis is performed.")
    
    demo_engagement = {
        "period_days": days,
        "total_tweets": 25,
        "total_likes": 1500,
        "total_retweets": 200,
        "total_replies": 100,
        "avg_likes": 60,
        "avg_retweets": 8,
        "avg_replies": 4,
        "engagement_rate": 3.5,
        "best_tweet": {
            "text": "My best performing tweet...",
            "likes": 250,
            "retweets": 50,
        },
    }
    
    panel = Panel(
        f"""[bold]Engagement Analysis ({days} days)[/bold]

Total Tweets: [cyan]{demo_engagement['total_tweets']}[/cyan]

Total Engagement:
  ❤️  Likes: [red]{format_number(demo_engagement['total_likes'])}[/red]
  🔄 Retweets: [green]{format_number(demo_engagement['total_retweets'])}[/green]
  💬 Replies: [blue]{format_number(demo_engagement['total_replies'])}[/blue]

Averages per Tweet:
  Likes: {demo_engagement['avg_likes']}
  Retweets: {demo_engagement['avg_retweets']}
  Replies: {demo_engagement['avg_replies']}

Engagement Rate: [bold cyan]{demo_engagement['engagement_rate']}%[/bold cyan]

Best Performing Tweet:
  "{demo_engagement['best_tweet']['text'][:50]}..."
  ❤️ {demo_engagement['best_tweet']['likes']} | 🔄 {demo_engagement['best_tweet']['retweets']}""",
        title="📊 Engagement Report",
    )
    
    console.print(panel)


@monitor.command()
@click.argument("username")
@click.option("--days", default=30, help="Days to analyze")
@async_command
async def competitor(username: str, days: int):
    """
    Analyze a competitor account.
    
    Example:
        xeepy monitor competitor rival_account --days 30
    """
    print_warning("This is a demo - no actual analysis is performed.")
    
    demo_analysis = {
        "username": username,
        "followers": 50000,
        "growth_rate": 8.5,
        "engagement_rate": 4.2,
        "posts_per_day": 3.5,
        "top_topics": ["tech", "startups", "AI"],
        "peak_hours": ["9am", "12pm", "6pm"],
        "content_mix": {
            "original": 60,
            "retweets": 25,
            "replies": 15,
        },
    }
    
    panel = Panel(
        f"""[bold]Competitor Analysis: @{username}[/bold]

Followers: [cyan]{format_number(demo_analysis['followers'])}[/cyan]
Growth Rate: [green]+{demo_analysis['growth_rate']}%[/green]
Engagement Rate: [yellow]{demo_analysis['engagement_rate']}%[/yellow]
Posts/Day: {demo_analysis['posts_per_day']}

Top Topics: {', '.join(demo_analysis['top_topics'])}
Peak Hours: {', '.join(demo_analysis['peak_hours'])}

Content Mix:
  Original: {demo_analysis['content_mix']['original']}%
  Retweets: {demo_analysis['content_mix']['retweets']}%
  Replies: {demo_analysis['content_mix']['replies']}%""",
        title="🔍 Competitor Analysis",
    )
    
    console.print(panel)
