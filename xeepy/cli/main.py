"""
Main CLI entry point for Xeepy.
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path
from typing import Any

import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from xeepy.cli.utils import (
    load_config,
    setup_logging,
    get_provider,
    async_command,
    handle_errors,
    output_result,
)

console = Console()

# ASCII art banner
BANNER = """
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██╗  ██╗███████╗███████╗██████╗ ██╗   ██╗                  ║
║   ╚██╗██╔╝██╔════╝██╔════╝██╔══██╗╚██╗ ██╔╝                  ║
║    ╚███╔╝ █████╗  █████╗  ██████╔╝ ╚████╔╝                   ║
║    ██╔██╗ ██╔══╝  ██╔══╝  ██╔═══╝   ╚██╔╝                    ║
║   ██╔╝ ██╗███████╗███████╗██║        ██║                     ║
║   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝        ╚═╝                     ║
║                                                               ║
║   X/Twitter Automation Toolkit                                ║
║   ⚠️  Educational Purposes Only                               ║
╚═══════════════════════════════════════════════════════════════╝
"""


class XeepyContext:
    """Context object for CLI commands."""
    
    def __init__(self):
        self.config: dict[str, Any] = {}
        self.verbose: bool = False
        self.config_path: Path | None = None
        self.provider = None


pass_context = click.make_pass_decorator(XeepyContext, ensure=True)


@click.group(invoke_without_command=True)
@click.option(
    "--config", "-c",
    type=click.Path(exists=False),
    default="xeepy.yaml",
    help="Configuration file path",
)
@click.option(
    "--verbose", "-v",
    is_flag=True,
    help="Enable verbose output",
)
@click.option(
    "--quiet", "-q",
    is_flag=True,
    help="Suppress all output except errors",
)
@click.version_option(version="0.1.0", prog_name="xeepy")
@click.pass_context
def cli(ctx: click.Context, config: str, verbose: bool, quiet: bool):
    """
    Xeepy - X/Twitter Automation Toolkit
    
    ⚠️  EDUCATIONAL PURPOSES ONLY - Do not run against X/Twitter.
    
    This toolkit demonstrates automation techniques for research and learning.
    """
    ctx.ensure_object(XeepyContext)
    xctx: XeepyContext = ctx.obj
    
    # Setup logging
    log_level = "DEBUG" if verbose else ("ERROR" if quiet else "INFO")
    setup_logging(log_level)
    
    # Load configuration
    config_path = Path(config)
    if config_path.exists():
        xctx.config = load_config(config_path)
        xctx.config_path = config_path
    else:
        xctx.config = {}
    
    xctx.verbose = verbose
    
    # Show banner if no command provided
    if ctx.invoked_subcommand is None:
        console.print(BANNER, style="cyan")
        console.print("\nRun [bold]xeepy --help[/bold] for usage information.\n")


# Import and register command groups
from xeepy.cli.commands.scrape import scrape
from xeepy.cli.commands.follow import follow
from xeepy.cli.commands.unfollow import unfollow
from xeepy.cli.commands.engage import engage
from xeepy.cli.commands.monitor import monitor
from xeepy.cli.commands.ai import ai

cli.add_command(scrape)
cli.add_command(follow)
cli.add_command(unfollow)
cli.add_command(engage)
cli.add_command(monitor)
cli.add_command(ai)


@cli.command()
@pass_context
def info(ctx: XeepyContext):
    """Show configuration and system info."""
    table = Table(title="Xeepy Configuration")
    
    table.add_column("Setting", style="cyan")
    table.add_column("Value", style="green")
    
    table.add_row("Config File", str(ctx.config_path or "Not found"))
    table.add_row("Verbose Mode", str(ctx.verbose))
    table.add_row("AI Provider", ctx.config.get("ai", {}).get("provider", "Not configured"))
    
    console.print(table)


@cli.command()
@click.option("--force", "-f", is_flag=True, help="Overwrite existing config")
@pass_context
def init(ctx: XeepyContext, force: bool):
    """Initialize a new configuration file."""
    config_path = Path("xeepy.yaml")
    
    if config_path.exists() and not force:
        console.print("[red]Configuration file already exists. Use --force to overwrite.[/red]")
        return
    
    default_config = """# Xeepy Configuration
# ⚠️ EDUCATIONAL PURPOSES ONLY

# AI Provider settings
ai:
  provider: openai  # openai, anthropic, ollama
  model: gpt-4o-mini
  # api_key: your-key-here  # Or use environment variable

# Rate limiting
rate_limit:
  requests_per_minute: 30
  requests_per_hour: 500

# Default settings
defaults:
  output_format: json
  max_results: 100

# Logging
logging:
  level: INFO
  file: xeepy.log
"""
    
    config_path.write_text(default_config)
    console.print(f"[green]✓ Created configuration file: {config_path}[/green]")


@cli.command()
@pass_context
def version(ctx: XeepyContext):
    """Show version information."""
    from xeepy import __version__
    
    console.print(Panel(
        f"[bold cyan]Xeepy[/bold cyan] version [bold green]{__version__}[/bold green]\n\n"
        "X/Twitter Automation Toolkit\n"
        "⚠️ Educational Purposes Only",
        title="Version Info",
    ))


# Alternative entry point using Typer-like approach
def app():
    """Alternative entry point."""
    cli()


def main():
    """Main entry point for the CLI."""
    try:
        cli()
    except KeyboardInterrupt:
        console.print("\n[yellow]Operation cancelled by user.[/yellow]")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n[red]Error: {e}[/red]")
        sys.exit(1)


if __name__ == "__main__":
    main()
