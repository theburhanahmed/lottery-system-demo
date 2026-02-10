#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

# Load .env in dev (prod uses platform env/secrets: Render, etc.)
def _load_dotenv():
    try:
        from dotenv import load_dotenv
        env_path = Path(__file__).resolve().parent / '.env'
        if env_path.exists():
            load_dotenv(env_path)
    except ImportError:
        pass

_load_dotenv()


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lottery.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
