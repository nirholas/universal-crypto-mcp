# Contributing to Xeepy

Thank you for your interest in contributing to Xeepy! 🎉

This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct (to be added).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Python version, Xeepy version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Motivation** - why is this enhancement useful?
- **Possible implementation** - if you have ideas
- **Examples** - code examples showing the feature in use

### Pull Requests

1. **Fork** the repository
2. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** following our style guide
4. **Add tests** for your changes
5. **Run tests** to ensure everything works:
   ```bash
   pytest
   ```
6. **Run linters**:
   ```bash
   black xeepy/
   isort xeepy/
   ruff check xeepy/
   mypy xeepy/
   ```
7. **Commit your changes**:
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
8. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```
9. **Open a Pull Request**

## Development Setup

### Prerequisites

- Python 3.8 or higher
- pip
- git

### Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/xeepy.git
cd xeepy

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install in development mode
pip install -e '.[all,dev,test,docs]'

# Install pre-commit hooks
pre-commit install

# Create config file
cp xeepy.example.yml xeepy.yml
```

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=xeepy --cov-report=html

# Run specific test file
pytest tests/test_ai.py

# Run tests matching pattern
pytest -k "test_content_generation"
```

### Code Style

We use:
- **Black** for code formatting (line length: 100)
- **isort** for import sorting
- **Ruff** for linting
- **MyPy** for type checking

```bash
# Format code
black xeepy/
isort xeepy/

# Lint
ruff check xeepy/

# Type check
mypy xeepy/
```

### Documentation

- Add docstrings to all public functions/classes
- Use Google-style docstrings
- Update README.md if adding new features
- Add examples in the `examples/` directory

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: Add crypto sentiment analysis feature
fix: Handle rate limiting properly
docs: Update API documentation
test: Add tests for authentication
```

## Project Structure

```
xeepy/
├── __init__.py           # Package initialization
├── config.py             # Configuration management
├── cli/                  # CLI interface
│   ├── main.py          # Entry point
│   ├── utils.py         # Utilities
│   └── commands/        # Command modules
├── api/                  # REST API
│   ├── server.py        # FastAPI app
│   ├── models.py        # Data models
│   ├── auth.py          # Authentication
│   ├── middleware.py    # Middleware
│   └── routes/          # API routes
└── ai/                   # AI features
    ├── providers/       # AI providers
    └── features/        # AI features
```

## Adding New Features

### Adding a CLI Command

1. Create command file in `xeepy/cli/commands/`
2. Define command using Click decorators
3. Import and register in `main.py`
4. Add tests in `tests/test_cli.py`
5. Update README.md

### Adding an API Endpoint

1. Add route function to appropriate router in `xeepy/api/routes/`
2. Define request/response models in `models.py`
3. Add tests in `tests/test_api.py`
4. OpenAPI docs will auto-update

### Adding an AI Feature

1. Create feature class in `xeepy/ai/features/`
2. Inherit from base provider classes
3. Implement required methods
4. Add tests in `tests/test_ai.py`
5. Update documentation

## Testing Guidelines

- Write tests for all new features
- Maintain or improve code coverage
- Use fixtures for common test data
- Mock external API calls
- Test edge cases and error handling

## Documentation Guidelines

- Keep README.md up to date
- Add docstrings to all public APIs
- Include code examples
- Document configuration options
- Update changelog

## Release Process

(For maintainers)

1. Update version in `pyproject.toml` and `__init__.py`
2. Update `CHANGELOG.md`
3. Create release commit: `git commit -m "release: v0.2.0"`
4. Tag release: `git tag v0.2.0`
5. Push: `git push && git push --tags`
6. Build: `python -m build`
7. Publish: `twine upload dist/*`

## Questions?

Feel free to:
- Open an issue for discussion
- Join our Discord (link TBD)
- Email: support@xeepy.dev

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Xeepy! 🚀
