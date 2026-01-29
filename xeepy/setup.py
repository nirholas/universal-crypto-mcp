#!/usr/bin/env python3
"""
Quick setup script for Xeepy development environment.
"""

import subprocess
import sys
from pathlib import Path


def run_command(command: str, description: str):
    """Run a shell command."""
    print(f"\n{'='*60}")
    print(f"📦 {description}")
    print(f"{'='*60}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f"❌ Failed: {description}")
        sys.exit(1)
    print(f"✅ Success: {description}")


def main():
    """Run setup tasks."""
    print("""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 Xeepy Development Environment Setup                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    """)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    
    # Install package in development mode with all dependencies
    run_command(
        "pip install -e '.[all,dev,test,docs]'",
        "Installing Xeepy with all dependencies"
    )
    
    # Create example config
    example_config = Path("xeepy.example.yml")
    config = Path("xeepy.yml")
    if not config.exists() and example_config.exists():
        import shutil
        shutil.copy(example_config, config)
        print(f"✅ Created {config} from example")
    
    # Install pre-commit hooks
    try:
        run_command("pre-commit install", "Installing pre-commit hooks")
    except Exception:
        print("⚠️  Pre-commit hooks not installed (optional)")
    
    # Run tests
    print("\n" + "="*60)
    print("🧪 Running tests to verify installation")
    print("="*60)
    try:
        subprocess.run(["pytest", "--version"], check=True)
        subprocess.run(["pytest", "-v", "--tb=short"], check=False)
    except Exception:
        print("⚠️  Tests not run (pytest may not be installed)")
    
    # Success message
    print("""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ✅ Setup Complete!                                          ║
║                                                               ║
║   Quick Start:                                                ║
║   • xeepy --help              - CLI help                      ║
║   • xeepy-api                 - Start API server              ║
║   • xeepy scrape profile USER - Scrape a profile              ║
║   • python -m pytest          - Run tests                     ║
║                                                               ║
║   Documentation:                                              ║
║   • README.md                 - Getting started               ║
║   • xeepy.yml                 - Configuration                 ║
║   • http://localhost:8000/docs - API docs (when running)     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    """)


if __name__ == "__main__":
    main()
