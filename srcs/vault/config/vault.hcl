# File storage backend
storage "file" {
  path = "/vault/data"
}

# Listener configuration
listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = true  # Disable TLS (only for local or non-sensitive setups)
}

# Enable Vault UI
ui = true

# API Address
api_addr = "http://127.0.0.1:8200"

# Default and maximum token and secret lease durations
# default_lease_ttl = "1h"
# max_lease_ttl     = "24h"
log_file = "/vault/logs/vault.log"  # Path to store the log file
log_level = "trace"             # Capture all log levels
