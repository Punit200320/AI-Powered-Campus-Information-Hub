# -*- coding: utf-8 -*-
"""
Real MMVY PDF scraper.
Downloads official MMVY documents from www.medhavikalyan.mp.gov.in
into storage/documents so the backend AI summarizer can index them.

Security notes:
- TLS certificate verification is ENABLED (default trusted CAs).
  No CERT_NONE / check_hostname=False anywhere.
- The server uses a legacy TLS renegotiation mode, so we additionally set
  ssl.OP_LEGACY_SERVER_CONNECT (a safe compatibility flag that does NOT
  disable certificate verification). Fallback / diagnostic info is printed.
"""
import ssl, socket, re, os, sys, io
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

HOST = 'www.medhavikalyan.mp.gov.in'
# Known stable IP for the portal, used only if DNS resolution fails.
KNOWN_FALLBACK_IP = '103.94.204.136'


def resolve_host():
    """Return (ip, source). Never raises; falls back to known IP."""
    try:
        ip = socket.gethostbyname(HOST)
        return ip, 'dns'
    except Exception as e:
        print(f"[WARN] DNS resolution failed for {HOST} ({e}); using fallback IP {KNOWN_FALLBACK_IP}")
        return KNOWN_FALLBACK_IP, 'fallback'


IP, IP_SRC = resolve_host()
print(f"[INFO] Resolving {HOST} -> {IP} ({IP_SRC})")


def make_ctx():
    """Verified TLS context (default CA trust), plus legacy-renegotiation compat."""
    ctx = ssl.create_default_context()   # certificate verification ENABLED
    # The MP server negotiates TLS 1.2 with legacy renegotiation.
    try:
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
    except Exception:
        pass
    # Safe compatibility flag: allows legacy renegotiation WITHOUT disabling
    # certificate verification. Available on OpenSSL 3.x / Python 3.12+.
    if hasattr(ssl, 'OP_LEGACY_SERVER_CONNECT'):
        ctx.options |= ssl.OP_LEGACY_SERVER_CONNECT
    return ctx


CTX = make_ctx()


def raw_get(path):
    req = (f'GET {path} HTTP/1.1\r\nHost: {HOST}\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36\r\nAccept: */*\r\nConnection: close\r\n\r\n').encode()
    with socket.create_connection((IP, 443), timeout=25) as s:
        with CTX.wrap_socket(s, server_hostname=HOST) as ss:
            ss.sendall(req)
            buf = b''
            while True:
                chunk = ss.recv(131072)
                if not chunk:
                    break
                buf += chunk
    return buf


PDF_PATHS = [
    '/MedhaviChhatra/Resources/Files/Government_Order_Corrigendum7_14062025.pdf',
    '/MedhaviChhatra/Resources/Files/SOPV1.3.pdf',
    '/MedhaviChhatra/Resources/Files/FAQMMVY(1).pdf',
    '/MedhaviChhatra/Resources/Files/Consolidated_Order_Latest_2026.pdf',
    '/MedhaviChhatra/Resources/Files/IIT___NIT.pdf',
    '/MedhaviChhatra/Resources/Files/scan0001(1).pdf',
    '/MedhaviChhatra/Resources/Files/Order_28.5.2019.pdf',
    '/MedhaviChhatra/Resources/Files/New_Order_for_BDS.pdf',
    '/MedhaviChhatra/Resources/Files/Government_Order_Corrigendum4.pdf',
    '/MedhaviChhatra/Resources/Files/Government_Order_Corrigendum5.pdf',
    '/MedhaviChhatra/Resources/Files/Government_Order_Corrigendum6.pdf',
    '/MedhaviChhatra/Resources/Files/Government_Order_Corrigendum7.pdf',
    '/MedhaviChhatra/Resources/Files/procedure_process_mmvy.pdf',
    '/MedhaviChhatra/Resources/Files/MMVY_order.pdf',
    '/MedhaviChhatra/Resources/Files/Detail_Procedure_Letter-3.PDF',
    '/MedhaviChhatra/Resources/Files/Letter_to_all_institution_of_MMVY_form_submission0000001.pdf',
    '/MedhaviChhatra/Resources/Files/Process_Chart.pdf',
    '/MedhaviChhatra/Resources/Files/MMVYGuidelinesforOutsideStateIntitutions.pdf',
]

DEST_DIR = r'C:\Users\DELL\Desktop\New_Project\storage\documents'
os.makedirs(DEST_DIR, exist_ok=True)


def safe(name):
    name = os.path.basename(name).replace(' ', '_').replace('(', '').replace(')', '')
    return name


results = []
for p in PDF_PATHS:
    try:
        resp = raw_get(p)
        head, _, body = resp.partition(b'\r\n\r\n')
        status_line = head.split(b'\r\n')[0].decode(errors='replace')
        if '200' not in status_line:
            results.append(('SKIP', p, status_line))
            continue
        if not body[:5].startswith(b'%PDF'):
            results.append(('NOT_PDF', p, status_line + ' first20=' + repr(body[:20])))
            continue
        fname = 'mmvy_' + safe(p)
        full = os.path.join(DEST_DIR, fname)
        with open(full, 'wb') as fh:
            fh.write(body)
        results.append(('OK', p, f'{len(body)} bytes -> {fname}'))
    except Exception as e:
        results.append(('ERR', p, str(e)[:80]))

print('=== MMVY PDF download results ===')
for kind, p, msg in results:
    print(f'  [{kind}] {p}\n          {msg}')
ok = sum(1 for k, _, _ in results if k == 'OK')
print(f'\nDownloaded: {ok}/{len(PDF_PATHS)}')
