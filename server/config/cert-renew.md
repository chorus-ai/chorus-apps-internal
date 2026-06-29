# TLS Cert Renewal — Let's Encrypt via acme.sh (TLS-ALPN-01)

How we issue and renew the TLS cert for `mgh-chorus.eastus2.cloudapp.azure.com` without using port 80.

## Why this setup

- Azure NSG only allows port **443** inbound (port 80 is closed by policy).
- `cloudapp.azure.com` is Azure-owned DNS, so DNS-01 challenges aren't possible.
- Certbot's standalone plugin doesn't support TLS-ALPN-01.
- **acme.sh** does support TLS-ALPN-01 over port 443.

Certs are issued by **Let's Encrypt** and installed to the standard `/etc/letsencrypt/live/` paths that nginx already references.

## One-time setup (already done)

```bash
# Install acme.sh as root
sudo -i
curl https://get.acme.sh | sh -s email=delger42@gmail.com
```

Cert files installed to:
- `/etc/letsencrypt/live/mgh-chorus.eastus2.cloudapp.azure.com/fullchain.pem`
- `/etc/letsencrypt/live/mgh-chorus.eastus2.cloudapp.azure.com/privkey.pem`

Nginx config (`/etc/nginx/sites-enabled/chorus.conf`) already points at those paths — no changes needed on renewal.

## Renewal procedure

Run every ~60 days (Let's Encrypt certs last 90 days). Before starting, **coordinate with the NSG admin to temporarily allow inbound TCP 443 from `0.0.0.0/0`** — Let's Encrypt's validators need to reach the box.

```bash
sudo -i
systemctl stop nginx

/root/.acme.sh/acme.sh --issue \
  --alpn \
  -d mgh-chorus.eastus2.cloudapp.azure.com \
  --server letsencrypt \
  --force

/root/.acme.sh/acme.sh --install-cert \
  -d mgh-chorus.eastus2.cloudapp.azure.com \
  --key-file       /etc/letsencrypt/live/mgh-chorus.eastus2.cloudapp.azure.com/privkey.pem \
  --fullchain-file /etc/letsencrypt/live/mgh-chorus.eastus2.cloudapp.azure.com/fullchain.pem \
  --reloadcmd      "systemctl start nginx && systemctl reload nginx"
```

The `--install-cert` step's `--reloadcmd` starts nginx back up. Total downtime: ~15 seconds.

**Tell the admin they can re-lock the NSG back to the VPN-only allowlist.**

## Verify

```bash
# Cert nginx is serving
echo | openssl s_client -connect localhost:443 \
  -servername mgh-chorus.eastus2.cloudapp.azure.com 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -fingerprint

# Cert file on disk
openssl x509 -in /etc/letsencrypt/live/mgh-chorus.eastus2.cloudapp.azure.com/fullchain.pem \
  -noout -fingerprint
```

Fingerprints must match. Then hard-reload the browser (Cmd-Shift-R) and confirm the lock is green.

## Automation (optional)

acme.sh installs a daily cron that auto-renews when within ARI's suggested window. It will **fail silently** if 443 is locked down at that moment.

Two options:

**A. Manual (current):** disable the cron, set a calendar reminder for ~60 days, run the renewal procedure above.

```bash
/root/.acme.sh/acme.sh --uninstall-cronjob
```

**B. Fully automated:** grant the VM's managed identity `Network Contributor` on the NSG (one-time admin ask). Add pre/post hooks that open/close the NSG rule via Azure CLI:

```bash
# /root/.acme.sh/account.conf
PRE_HOOK="az login --identity && az network nsg rule create ... --source-address-prefixes '*'"
POST_HOOK="az network nsg rule delete ..."
```

Worth it if this VM lives long-term. Skip for short-lived envs.

## Troubleshooting

- **Timeout during connect** on validation → port 443 isn't reachable from the public internet. NSG still locked. Coordinate with admin.
- **`acme.sh: command not found` under sudo** → acme.sh refuses sudo. Use `sudo -i` to get a root shell first, then run as root.
- **`The domain seems to already have an ECC cert, let's use it.`** when issue failed → add `--force` to re-issue.
- **Browser still "Not Secure" after install** → check fingerprints match (above). If they do, it's browser cache. Try incognito; clear HSTS at `chrome://net-internals/#hsts`.
- **Nginx doesn't pick up new cert** → `nginx -t && systemctl reload nginx`. Verify with `nginx -T | grep ssl_certificate`.

## References

- acme.sh: https://github.com/acmesh-official/acme.sh
- TLS-ALPN-01 challenge: https://letsencrypt.org/docs/challenge-types/#tls-alpn-01
