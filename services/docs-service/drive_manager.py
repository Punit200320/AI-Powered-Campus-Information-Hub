import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

CREDENTIALS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "config", "credentials.json")

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


if __name__ == "__main__":
    for cat in FOLDER_IDS:
        files = list_folder_documents(cat)
        print(f"[{cat}] -> {len(files)} files indexed.")

