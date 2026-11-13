package com.campusai.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.AbstractInputStreamContent;
import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Uploads academic files to dedicated Google Drive folders using the service
 * account credentials (config/credentials.json). Any failure returns null and
 * is never fatal: the controller keeps the local copy and simply does not set
 * the Drive flag.
 */
@Service
public class GoogleDriveService {

    private final String configuredPath;
    private final Map<String, String> folderIds = new HashMap<>();

    public GoogleDriveService(@Value("${campus.drive.credentials:}") String configuredPath) {
        this.configuredPath = configuredPath == null ? "" : configuredPath;
        folderIds.put("PYQ", "1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x");
        folderIds.put("Notices", "1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q");
        folderIds.put("Notes", "17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw");
        folderIds.put("Brochures", "1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh");
    }

    /**
     * Upload raw bytes into the category folder. Returns the new Drive file id
     * or {@code null} when credentials are missing or any error occurs.
     */
    public String upload(String title, byte[] bytes, String mimeType, String folderKey) {
        try {
            InputStream creds = findCredentials();
            if (creds == null) {
                System.err.println("[Drive] credentials.json not found; skipping Drive upload");
                return null;
            }
            GoogleCredentials credentials = ServiceAccountCredentials.fromStream(creds)
                    .createScoped(Collections.singletonList(DriveScopes.DRIVE));
            Drive drive = new Drive.Builder(GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(), credentials)
                    .setApplicationName("campus-ai")
                    .build();

            String folderId = folderIds.getOrDefault(folderKey, folderIds.get("PYQ"));
            com.google.api.services.drive.model.File meta =
                    new com.google.api.services.drive.model.File()
                            .setName(safeTitle(title))
                            .setParents(Collections.singletonList(folderId));
            AbstractInputStreamContent content = new ByteArrayContent(mimeType, bytes);
            com.google.api.services.drive.model.File uploaded =
                    drive.files().create(meta, content)
                            .setFields("id,name,webViewLink,webContentLink")
                            .execute();
            return uploaded.getId();
        } catch (Exception e) {
            System.err.println("[Drive] per-file upload failed: " + e.getMessage());
            return null;
        }
    }

    private InputStream findCredentials() throws Exception {
        List<String> candidates = Arrays.asList(
                configuredPath,
                "config/credentials.json",
                "../../config/credentials.json",
                "../config/credentials.json",
                "C:/Users/DELL/Desktop/New_Project/config/credentials.json"
        );
        for (String c : candidates) {
            if (c == null || c.isEmpty()) {
                continue;
            }
            File f = new File(c);
            if (f.exists() && f.isFile()) {
                return new FileInputStream(f);
            }
        }
        return null;
    }

    private String safeTitle(String t) {
        if (t == null || t.isEmpty()) {
            return "document";
        }
        String s = t.replaceAll("[^a-zA-Z0-9._ -]", "_");
        return s.length() > 120 ? s.substring(0, 120) : s;
    }
}
