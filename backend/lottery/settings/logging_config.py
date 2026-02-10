"""Logging configuration for the Django project."""

import os
from pathlib import Path

_BASE_DIR = Path(__file__).resolve().parent.parent.parent
_on_render = os.environ.get('RENDER') or os.environ.get('RENDER_EXTERNAL_HOSTNAME')
_debug = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes')

# On Render/production, log to console only (platform captures stdout). Avoids
# PermissionError when the app user cannot write to /app/debug.log.
if _on_render or not _debug:
    _handlers = {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    }
    _root_handlers = ['console']
else:
    _handlers = {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': str(_BASE_DIR / 'debug.log'),
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    }
    _root_handlers = ['console', 'file']

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': _handlers,
    'root': {
        'handlers': _root_handlers,
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': _root_handlers,
            'level': 'INFO',
            'propagate': False,
        },
    },
}
