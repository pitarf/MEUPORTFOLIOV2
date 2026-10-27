#!/usr/bin/env python3
import json
import os
import shutil
import subprocess
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse

PORT = 3035
SECRET_TOKEN = os.environ.get("VPS_MONITOR_TOKEN", "rp_vps_94a7e8f1b2c3d4e5f6a7b8c9d0e1f2a3")
ALLOWED_CONTAINERS = [
    "portfolio-db",
    "portfolio-api",
    "portfolio-auth",
    "vantage-app",
    "vorixa-app",
    "vorixa-postgres",
    "vorixa-minio",
    "cegid-license-app",
    "cegid-license-db",
    "test_postgres_db",
    "connecttv_frontend"
]

def format_uptime(seconds):
    days = int(seconds // 86400)
    hours = int((seconds % 86400) // 3600)
    minutes = int((seconds % 3600) // 60)
    parts = []
    if days > 0:
        parts.append(f"{days} dia{'s' if days > 1 else ''}")
    if hours > 0:
        parts.append(f"{hours}h")
    parts.append(f"{minutes}min")
    return " ".join(parts)

def get_system_metrics():
    # 1. Disco
    total, used, free = shutil.disk_usage('/')
    disk = {
        'total_bytes': total,
        'used_bytes': used,
        'free_bytes': free,
        'total_gb': round(total / (1024**3), 1),
        'used_gb': round(used / (1024**3), 1),
        'free_gb': round(free / (1024**3), 1),
        'percent': round((used / total) * 100, 1)
    }

    # 2. Memoria RAM
    meminfo = {}
    try:
        with open('/proc/meminfo') as f:
            for line in f:
                parts = line.split(':')
                if len(parts) == 2:
                    key = parts[0].strip()
                    val = parts[1].strip().split()[0]
                    meminfo[key] = int(val) * 1024
    except Exception:
        pass

    mem_total = meminfo.get('MemTotal', 1)
    mem_avail = meminfo.get('MemAvailable', 0)
    mem_used = mem_total - mem_avail
    ram = {
        'total_bytes': mem_total,
        'used_bytes': mem_used,
        'free_bytes': mem_avail,
        'total_gb': round(mem_total / (1024**3), 1),
        'used_gb': round(mem_used / (1024**3), 1),
        'free_gb': round(mem_avail / (1024**3), 1),
        'percent': round((mem_used / mem_total) * 100, 1)
    }

    # 3. CPU e Uptime
    uptime_sec = 0
    try:
        with open('/proc/uptime') as f:
            uptime_sec = float(f.readline().split()[0])
    except Exception:
        pass

    load1, load5, load15 = (0, 0, 0)
    try:
        load1, load5, load15 = os.getloadavg()
    except Exception:
        pass

    cpu_count = os.cpu_count() or 1
    cpu = {
        'load_1m': round(load1, 2),
        'load_5m': round(load5, 2),
        'load_15m': round(load15, 2),
        'cpu_count': cpu_count,
        'usage_percent': min(100, round((load1 / cpu_count) * 100, 1))
    }

    uptime = {
        'seconds': int(uptime_sec),
        'formatted': format_uptime(uptime_sec)
    }

    # 4. Containers Docker
    containers = []
    try:
        raw_ps = subprocess.check_output(
            ['docker', 'ps', '-a', '--format', '{{json .}}'],
            timeout=5
        ).decode('utf-8')
        for line in raw_ps.strip().split('\n'):
            if line.strip():
                try:
                    c = json.loads(line)
                    containers.append({
                        'id': c.get('ID', ''),
                        'name': c.get('Names', ''),
                        'image': c.get('Image', ''),
                        'status': c.get('Status', ''),
                        'state': c.get('State', ''),
                        'ports': c.get('Ports', ''),
                        'created': c.get('CreatedAt', '')
                    })
                except Exception:
                    pass
    except Exception as e:
        containers = []

    # 5. Docker Storage DF
    docker_df = {}
    try:
        raw_df = subprocess.check_output(
            ['docker', 'system', 'df', '--format', '{{json .}}'],
            timeout=5
        ).decode('utf-8')
        for line in raw_df.strip().split('\n'):
            if line.strip():
                try:
                    d = json.loads(line)
                    t_type = d.get('Type', '').lower()
                    docker_df[t_type] = {
                        'total': d.get('TotalCount', 0),
                        'active': d.get('ActiveCount', 0),
                        'size': d.get('Size', '0B'),
                        'reclaimable': d.get('Reclaimable', '0B')
                    }
                except Exception:
                    pass
    except Exception:
        pass

    return {
        'success': True,
        'host': 'Oracle Cloud ARM - 144.22.173.125',
        'timestamp': int(time.time()),
        'disk': disk,
        'ram': ram,
        'cpu': cpu,
        'uptime': uptime,
        'docker': {
            'containers': containers,
            'storage': docker_df
        }
    }

class RequestHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, x-vps-token, Authorization')

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def check_auth(self):
        # Permite ping de saúde público
        if self.path.endswith('/health') or self.path == '/health':
            return True
        token = self.headers.get('x-vps-token') or self.headers.get('Authorization', '').replace('Bearer ', '')
        return token == SECRET_TOKEN

    def respond_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        if path.endswith('/health') or path == '/health':
            return self.respond_json(200, {'status': 'healthy', 'service': 'vps-monitor-agent'})

        if not self.check_auth():
            return self.respond_json(401, {'error': 'Não autorizado. Forneça o token x-vps-token válido.'})

        if path in ['/status', '/api/vps/status', '/api/vps']:
            data = get_system_metrics()
            return self.respond_json(200, data)

        return self.respond_json(404, {'error': 'Rota não encontrada'})

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        if not self.check_auth():
            return self.respond_json(401, {'error': 'Não autorizado. Forneça o token x-vps-token válido.'})

        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            body = json.loads(body_bytes.decode('utf-8'))
        except Exception:
            body = {}

        if path.endswith('/actions/clean-docker-cache'):
            try:
                out = subprocess.check_output(
                    ['docker', 'builder', 'prune', '-a', '-f'],
                    stderr=subprocess.STDOUT,
                    timeout=90
                ).decode('utf-8')
                return self.respond_json(200, {
                    'success': True,
                    'message': 'Build cache do Docker limpo com sucesso!',
                    'output': out.strip()[-500:] if out else ''
                })
            except subprocess.CalledProcessError as e:
                return self.respond_json(500, {
                    'success': False,
                    'error': f'Falha ao limpar build cache: {e.output.decode("utf-8", errors="ignore")}'
                })
            except Exception as e:
                return self.respond_json(500, {'success': False, 'error': str(e)})

        if path.endswith('/actions/restart-container'):
            container_name = (body.get('containerName') or '').strip()
            if not container_name:
                return self.respond_json(400, {'success': False, 'error': 'Nome do container é obrigatório.'})

            if container_name not in ALLOWED_CONTAINERS:
                return self.respond_json(403, {
                    'success': False,
                    'error': f'Container {container_name} não está na lista de containers permitidos para reinicialização.'
                })

            try:
                subprocess.check_output(
                    ['docker', 'restart', container_name],
                    stderr=subprocess.STDOUT,
                    timeout=45
                )
                return self.respond_json(200, {
                    'success': True,
                    'message': f'Container {container_name} reiniciado com sucesso!'
                })
            except subprocess.CalledProcessError as e:
                return self.respond_json(500, {
                    'success': False,
                    'error': f'Falha ao reiniciar {container_name}: {e.output.decode("utf-8", errors="ignore")}'
                })
            except Exception as e:
                return self.respond_json(500, {'success': False, 'error': str(e)})

        return self.respond_json(404, {'error': 'Ação não encontrada'})

    def log_message(self, format, *args):
        # Suprime logs de acesso verbosos
        pass

def run():
    server_address = ('127.0.0.1', PORT)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f"VPS Monitor Agent ouvindo em 127.0.0.1:{PORT}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
