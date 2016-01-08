
mkdir -p /tmp

# Generate a random password
PASSWORD=$(uuid)

# Generate a private key
openssl genrsa -des3 -passout pass:$PASSWORD -out /tmp/server.key.protected 2048

# Generate a CSR
openssl req -new -passin pass:$PASSWORD -key /tmp/server.key.protected -out /tmp/server.csr \
  < ./create-certificates.input

# Generate a passwordless key
openssl rsa -passin pass:$PASSWORD -in /tmp/server.key.protected -out /etc/nginx/ssl.key

# Sign the certificate
openssl x509 -req -days 365 -in /tmp/server.csr -signkey /etc/nginx/ssl.key -out /etc/nginx/ssl.crt

