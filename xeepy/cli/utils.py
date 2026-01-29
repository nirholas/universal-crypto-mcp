"""
CLI utility functions.
"""

from __future__ import annotations

import asyncio
import functools
import json
import sys
from pathlib import Path
from typing import Any, Callable, TypeVar

import yaml
from loguru import logger
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table

console = Console()

F = TypeVar("F", bound=Callable[..., Any])


def load_config(path: Path) -> dict[str, Any]:
    """
    Load configuration from YAML file.
    
    Args:
        path: Path to configuration file
        
    Returns:
        Configuration dictionary
    """
    try:
        with open(path) as f:
            return yaml.safe_load(f) or {}
    except Exception as e:
        logger.warning(f"Failed to load config from {path}: {e}")
        return {}


def save_config(config: dict[str, Any], path: Path) -> None:
    """
    Save configuration to YAML file.
    
    Args:
        config: Configuration dictionary
        path: Path to save to
    """
    with open(path, "w") as f:
        yaml.dump(config, f, default_flow_style=False)


def setup_logging(level: str = "INFO") -> None:
    """
    Setup loguru logging.
    
    Args:
        level: Log level
    """
    logger.remove()
    logger.add(
        sys.stderr,
        level=level,
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>",
    )


def get_provider(config: dict[str, Any]):
    """
    Get AI provider based on configuration.
    
    Args:
        config: Configuration dictionary
        
    Returns:
        AI provider instance
    """
    ai_config = config.get("ai", {})
    provider_name = ai_config.get("provider", "openai")
    
    if provider_name == "openai":
        from xeepy.ai.providers import OpenAIProvider
        return OpenAIProvider(
            api_key=ai_config.get("api_key"),
            model=ai_config.get("model", "gpt-4o-mini"),
        )
    elif provider_name == "anthropic":
        from xeepy.ai.providers import AnthropicProvider
        return AnthropicProvider(
            api_key=ai_config.get("api_key"),
        )
    elif provider_name == "ollama":
        from xeepy.ai.providers import OllamaProvider
        return OllamaProvider(
            base_url=ai_config.get("base_url"),
            model=ai_config.get("model", "llama3:8b"),
        )
    else:
        raise ValueError(f"Unknown provider: {provider_name}")


def async_command(f: F) -> F:
    """
    Decorator to make async functions work with click.
    
    Usage:
        @cli.command()
        @async_command
        async def my_command():
            await some_async_function()
    """
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))
    return wrapper  # type: ignore


def handle_errors(f: F) -> F:
    """
    Decorator to handle errors gracefully in CLI commands.
    """
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except KeyboardInterrupt:
            console.print("\n[yellow]Operation cancelled.[/yellow]")
            sys.exit(1)
        except Exception as e:
            console.print(f"\n[red]Error: {e}[/red]")
            logger.exception("Command failed")
            sys.exit(1)
    return wrapper  # type: ignore


def output_result(
    data: Any,
    format: str = "json",
    output_file: str | None = None,
) -> None:
    """
    Output result data in the specified format.
    
    Args:
        data: Data to output
        format: Output format (json, csv, table)
        output_file: Optional file to write to
    """
    if format == "json":
        output = json.dumps(data, indent=2, default=str)
    elif format == "csv":
        import csv
        import io
        
        if isinstance(data, list) and data:
            output_io = io.StringIO()
            if isinstance(data[0], dict):
                writer = csv.DictWriter(output_io, fieldnames=data[0].keys())
                writer.writeheader()
                writer.writerows(data)
            else:
                writer = csv.writer(output_io)
                writer.writerows(data)
            output = output_io.getvalue()
        else:
            output = str(data)
    elif format == "table":
        if isinstance(data, list) and data and isinstance(data[0], dict):
            table = Table()
            for key in data[0].keys():
                table.add_column(key)
            for row in data:
                table.add_row(*[str(v) for v in row.values()])
            console.print(table)
            return
        else:
            output = str(data)
    else:
        output = str(data)
    
    if output_file:
        Path(output_file).write_text(output)
        console.print(f"[green]✓ Saved to {output_file}[/green]")
    else:
        console.print(output)


def create_progress() -> Progress:
    """Create a progress bar for CLI operations."""
    return Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    )


def confirm_action(message: str, default: bool = False) -> bool:
    """
    Ask for user confirmation.
    
    Args:
        message: Confirmation message
        default: Default value if user just presses enter
        
    Returns:
        True if confirmed, False otherwise
    """
    suffix = " [Y/n]" if default else " [y/N]"
    response = console.input(f"[yellow]{message}{suffix}[/yellow] ").strip().lower()
    
    if not response:
        return default
    return response in ("y", "yes")


def print_warning(message: str) -> None:
    """Print a warning message."""
    console.print(f"[yellow]⚠️  {message}[/yellow]")


def print_error(message: str) -> None:
    """Print an error message."""
    console.print(f"[red]❌ {message}[/red]")


def print_success(message: str) -> None:
    """Print a success message."""
    console.print(f"[green]✓ {message}[/green]")


def print_info(message: str) -> None:
    """Print an info message."""
    console.print(f"[blue]ℹ {message}[/blue]")


def format_number(n: int) -> str:
    """Format a number with K/M suffixes."""
    if n >= 1_000_000:
        return f"{n/1_000_000:.1f}M"
    elif n >= 1_000:
        return f"{n/1_000:.1f}K"
    return str(n)


def truncate(text: str, max_length: int = 50) -> str:
    """Truncate text with ellipsis."""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."
