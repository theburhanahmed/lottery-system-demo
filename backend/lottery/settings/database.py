"""
Database configuration. Supports DATABASE_URL (Render, Railway, Heroku) or
individual DB_* env vars. IPv4 resolution for remote DBs (e.g. Render).
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent


def _parse_db_url(url):
    """Parse postgresql:// URL into Django DATABASES config (stdlib only)."""
    from urllib.parse import urlparse, unquote
    parsed = urlparse(url)
    netloc = parsed.netloc
    if '@' in netloc:
        auth, host_port = netloc.rsplit('@', 1)
        parts = auth.split(':', 1)
        user = unquote(parts[0])
        password = unquote(parts[1]) if len(parts) > 1 else ''
    else:
        user, password = '', ''
        host_port = netloc
    if ':' in host_port:
        host, port = host_port.rsplit(':', 1)
    else:
        host, port = host_port, '5432'
    name = unquote((parsed.path or '/').lstrip('/'))
    return {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': name,
        'USER': user,
        'PASSWORD': password,
        'HOST': host,
        'PORT': port,
    }


def _resolve_host_to_ipv4(host, port=5432):
    """Resolve hostname to IPv4 for environments (e.g. Render) where IPv6 is unreachable."""
    if not host or host in ('localhost', '127.0.0.1'):
        return host
    if host.replace('.', '').isdigit():
        return host
    import socket
    try:
        ip = socket.gethostbyname(host)
        if ip:
            return ip
    except (socket.gaierror, OSError):
        pass
    try:
        infos = socket.getaddrinfo(host, port, socket.AF_INET, socket.SOCK_STREAM)
        if infos:
            return infos[0][4][0]
        infos = socket.getaddrinfo(host, port, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for info in infos:
            if info[0] == socket.AF_INET:
                return info[4][0]
    except (socket.gaierror, OSError):
        pass
    return host


def get_databases():
    """Build DATABASES dict from env (DATABASE_URL or DB_*). Render provides DATABASE_URL from render.yaml."""
    database_url = os.environ.get('DATABASE_URL') or os.environ.get('POSTGRES_PRIVATE_URL')
    if database_url:
        if database_url.startswith('postgres://'):
            database_url = 'postgresql://' + database_url[9:]
        db = _parse_db_url(database_url)
        host = db.get('HOST', '')
        if host:
            forced_ip = os.environ.get('DATABASE_HOST_IPV4', '').strip()
            if forced_ip:
                db['HOST'] = forced_ip
            else:
                resolved = _resolve_host_to_ipv4(host, int(db.get('PORT') or 5432))
                if resolved != host:
                    db['HOST'] = resolved
        return {'default': db}
    engine = os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3')
    name = os.environ.get('DB_NAME', str(BASE_DIR / 'db.sqlite3'))
    if engine == 'django.db.backends.postgresql':
        return {
            'default': {
                'ENGINE': engine,
                'NAME': name,
                'USER': os.environ.get('DB_USER', ''),
                'PASSWORD': os.environ.get('DB_PASSWORD', ''),
                'HOST': os.environ.get('DB_HOST', ''),
                'PORT': os.environ.get('DB_PORT', ''),
            }
        }
    return {
        'default': {
            'ENGINE': engine,
            'NAME': name,
        }
    }


DATABASES = get_databases()
