# SPDX-License-Identifier: MIT
"""
Test CLI Commands
=================

Tests for command-line interface.
"""

import pytest
from click.testing import CliRunner


@pytest.fixture
def runner():
    """Create CLI runner."""
    return CliRunner()


class TestMainCLI:
    """Test main CLI commands."""
    
    def test_cli_help(self, runner):
        """Test CLI help command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['--help'])
        assert result.exit_code == 0
        assert 'Xeepy' in result.output
    
    def test_cli_version(self, runner):
        """Test version command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['version'])
        assert result.exit_code == 0
        assert '0.1.0' in result.output
    
    def test_cli_info(self, runner):
        """Test info command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['info'])
        assert result.exit_code == 0


class TestScrapeCLI:
    """Test scraping CLI commands."""
    
    def test_scrape_profile(self, runner):
        """Test profile scraping command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['scrape', 'profile', 'testuser'])
        assert result.exit_code == 0
    
    def test_scrape_profile_json(self, runner):
        """Test profile scraping with JSON output."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['scrape', 'profile', 'testuser', '--format', 'json'])
        assert result.exit_code == 0
    
    def test_scrape_followers(self, runner):
        """Test followers scraping command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['scrape', 'followers', 'testuser', '--limit', '10'])
        assert result.exit_code == 0
    
    def test_scrape_tweets(self, runner):
        """Test tweet scraping command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['scrape', 'tweets', '--keyword', 'test', '--limit', '5'])
        assert result.exit_code == 0


class TestFollowCLI:
    """Test follow/unfollow CLI commands."""
    
    def test_follow_user(self, runner):
        """Test follow user command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['follow', 'user', 'testuser'])
        assert result.exit_code == 0
    
    def test_follow_by_keyword(self, runner):
        """Test follow by keyword command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['follow', 'by-keyword', 'AI', '--limit', '5'])
        assert result.exit_code == 0
    
    def test_unfollow_user(self, runner):
        """Test unfollow user command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['unfollow', 'user', 'testuser'])
        assert result.exit_code == 0
    
    def test_unfollow_non_followers(self, runner):
        """Test unfollow non-followers command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['unfollow', 'non-followers'])
        assert result.exit_code == 0


class TestEngageCLI:
    """Test engagement CLI commands."""
    
    def test_like_tweet(self, runner):
        """Test like tweet command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['engage', 'like', '123456'])
        assert result.exit_code == 0
    
    def test_auto_like(self, runner):
        """Test auto-like command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['engage', 'auto-like', '--keyword', 'test', '--limit', '5'])
        assert result.exit_code == 0


class TestAICLI:
    """Test AI CLI commands."""
    
    @pytest.mark.skip(reason="Requires AI provider setup")
    def test_ai_generate(self, runner):
        """Test AI generation command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['ai', 'generate', '--prompt', 'test'])
        # May fail without API keys
        assert result.exit_code in [0, 1]


class TestAnalyticsCLI:
    """Test analytics CLI commands."""
    
    def test_analytics_dashboard(self, runner):
        """Test analytics dashboard command."""
        from xeepy.cli.main import cli
        
        result = runner.invoke(cli, ['analytics', 'dashboard'])
        assert result.exit_code == 0


# =============================================================================
# CLI Utility Tests
# =============================================================================

class TestCLIUtils:
    """Test CLI utility functions."""
    
    def test_load_config(self, temp_config_file):
        """Test config loading."""
        from xeepy.cli.utils import load_config
        
        config = load_config(str(temp_config_file))
        assert config is not None
        assert config["environment"] == "development"
    
    def test_output_result_json(self):
        """Test JSON output formatting."""
        from xeepy.cli.utils import output_result
        
        data = {"test": "value"}
        result = output_result(data, format="json")
        assert "test" in result
    
    def test_output_result_table(self):
        """Test table output formatting."""
        from xeepy.cli.utils import output_result
        
        data = [{"name": "test", "value": 123}]
        result = output_result(data, format="table")
        assert result is not None
