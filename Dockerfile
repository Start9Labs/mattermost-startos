ARG IMAGE
FROM ubuntu:24.04 AS ca
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr /etc/ssl/certs/ca-certificates.crt

FROM ${IMAGE}
# Distroless, so no package manager: its CA bundle is only as current as its last release.
COPY --from=ca --chown=2000:2000 /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
