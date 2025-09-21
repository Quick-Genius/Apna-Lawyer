# Gunicorn configuration for memory-optimized deployment
import os

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"
backlog = 2048

# Worker processes
workers = 1  # Single worker to minimize memory usage
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Memory management
max_requests = 1000  # Restart worker after 1000 requests to prevent memory leaks
max_requests_jitter = 50
preload_app = True  # Load app before forking workers

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "apna_lawyer"

# Memory optimization
def when_ready(server):
    server.log.info("Server is ready. Spawning workers")

def worker_int(worker):
    worker.log.info("worker received INT or QUIT signal")

def pre_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)
    # Force garbage collection after fork
    import gc
    gc.collect()