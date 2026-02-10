"""
WSGI config for lottery project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
from pathlib import Path

# Load .env in dev (prod uses platform env: Render, etc.)
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
except ImportError:
    pass

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lottery.settings')

application = get_wsgi_application()