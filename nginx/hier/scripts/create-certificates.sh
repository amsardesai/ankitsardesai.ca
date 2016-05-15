
mkdir -p /tmp/

# Generate a random password
PASSWORD=$( cat /proc/sys/kernel/random/uuid )

# Generate a private key
openssl genrsa -des3 -passout pass:$PASSWORD \
  -out /tmp/ssl.key.protected 2048

# Generate a CSR
openssl req -new -passin pass:$PASSWORD -key /tmp/ssl.key.protected \
  -out /tmp/ssl.csr < /scripts/create-certificates.input

# Generate a passwordless key
openssl rsa -passin pass:$PASSWORD -in /tmp/ssl.key.protected \
  -out /etc/nginx/ssl.key

# Sign the certificate
openssl x509 -req -days 365 -in /tmp/ssl.csr -signkey /etc/nginx/ssl.key \
  -out /etc/nginx/ssl.crt

