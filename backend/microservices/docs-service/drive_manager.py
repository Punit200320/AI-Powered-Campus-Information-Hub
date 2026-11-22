import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CREDENTIALS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "config", "credentials.json")

FOLDER_IDS = {
    "PYQ": "1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x",
    "Notices": "1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q",
    "Notes": "17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw",
    "Brochures": "1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh",
}


def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        CREDENTIALS_PATH,
        scopes=["https://www.googleapis.com/auth/drive"],
    )
    return build("drive", "v3", credentials=creds)


def list_folder_documents(category: str):
    folder_id = FOLDER_IDS.get(category)
    if not folder_id:
        return []

    drive = get_drive_service()
    query = f"'{folder_id}' in parents and trashed = false"
    res = drive.files().list(
        q=query,
        fields="files(id, name, webViewLink, webContentLink, createdTime)",
    ).execute()
    return res.get("files", [])


def upload_file_to_folder(local_path: str, category: str, mime_type: str = "application/pdf", overwrite: bool = True):
    """Upload a local file into the given Drive folder.

    Requires the target folder to live inside a Shared Drive (or OAuth delegation),
    because service accounts cannot write to personal "My Drive" folders.
    Returns the drive file metadata (id, webViewLink)."""
    folder_id = FOLDER_IDS.get(category)
    if not folder_id:
        raise ValueError(f"Unknown category: {category}")
    if not os.path.exists(local_path):
        raise FileNotFoundError(local_path)

    drive = get_drive_service()
    name = os.path.basename(local_path)

    if overwrite:
        safe = name.replace(chr(39), "")
        query = f"'{folder_id}' in parents and name = '{safe}' and trashed = false"
        kwargs = dict(q=query, fields="files(id, name)", pageSize=5)
        if os.environ.get("SHARED_DRIVE_ID"):
            kwargs["supportsAllDrives"] = True
            kwargs["includeItemsFromAllDrives"] = True
        existing = drive.files().list(**kwargs).execute().get("files", [])
        if existing:
            drive.files().delete(fileId=existing[0]["id"], supportsAllDrives=bool(os.environ.get("SHARED_DRIVE_ID"))).execute()

    metadata = {"name": name, "parents": [folder_id]}
    media = MediaFileUpload(local_path, mimetype=mime_type, resumable=False)
    create_kwargs = dict(body=metadata, media_body=media, fields="id, name, size, webViewLink")
    if os.environ.get("SHARED_DRIVE_ID"):
        create_kwargs["supportsAllDrives"] = True
    res = drive.files().create(**create_kwargs).execute()
    return res


def sync_local_pdfs_to_drive(pdf_dir: str, category: str = "Brochures"):
    """Upload all PDFs in pdf_dir to the given category folder. Returns (uploaded, skipped, failed)."""
    if not os.path.isdir(pdf_dir):
        raise NotADirectoryError(pdf_dir)
    uploaded = failed = skipped = 0
    for fn in sorted(os.listdir(pdf_dir)):
        if not fn.lower().endswith(".pdf"):
            continue
        fp = os.path.join(pdf_dir, fn)
        try:
            upload_file_to_folder(fp, category)
            uploaded += 1
        except Exception as e:
            failed += 1
            print(f"  [FAIL] {fn}: {e}")
    return uploaded, skipped, failed

if __name__ == "__main__":
    for cat in FOLDER_IDS:
        files = list_folder_documents(cat)
        print(f"[{cat}] -> {len(files)} files indexed.")

