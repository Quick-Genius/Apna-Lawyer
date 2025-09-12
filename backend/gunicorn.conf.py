import multiprocessing

# Bind
bind = "0.0.0.0:10000"

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gthread'
threads = 4

# Timeout
timeout = 0

# Logging
accesslog = '/opt/render/project/src/logs/access.log'
errorlog = '/opt/render/project/src/logs/error.log'
loglevel = 'info'

# Misc
reload = False
capture_output = True
enable_stdio_inheritance = True