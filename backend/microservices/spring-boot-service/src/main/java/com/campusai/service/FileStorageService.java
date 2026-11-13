package com.campusai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Stores raw uploaded academic files on disk (under storage/documents).
 * All paths are forced to stay inside the storage root: filenames are built
 * from a sanitized id + a sanitized extension, and reads are validated with a
 * containment check, so database-held paths can never escape the root.
 */
@Service
public class FileStorageService {

    private final Path root;

    public FileStorageService(@Value("${campus.storage.dir:storage/documents}") String dir) {
        this.root = Paths.get(dir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.root);
        } catch (IOException e) {
            throw new RuntimeException("Cannot create storage directory: " + root, e);
        }
    }

    /**
     * Persist raw bytes under the storage root. The filename is built from a
     * sanitized id and a sanitized extension ([a-zA-Z0-9.]), so the resolved
     * path is guaranteed to remain inside {@code root}. Returns the path
     * relative to the storage root (safe to store in the database).
     */
    public String save(String id, byte[] bytes, String ext) throws IOException {
        String safeId = sanitizeSegment(id);
        String safeExt = sanitizeExtension(ext);
        Path target = root.resolve(safeId + safeExt).normalize();
        if (!target.startsWith(root)) {
            throw new IOException("Illegal storage path");
        }
        Files.write(target, bytes);
        return root.relativize(target).toString();
    }

    /**
     * Read bytes for a stored file. Only paths that resolve to a location
     * inside the storage root are accepted; anything else returns null.
     */
    public byte[] load(String relPath) throws IOException {
        if (relPath == null || relPath.trim().isEmpty()) {
            return null;
        }
        Path resolved = root.resolve(relPath).normalize();
        if (!resolved.startsWith(root)) {
            return null;
        }
        if (!Files.exists(resolved) || !Files.isRegularFile(resolved)) {
            return null;
        }
        return Files.readAllBytes(resolved);
    }

    /** Heuristic PDF page count (fallback when AI service is offline). */
    public int countPagesFallback(byte[] pdf) {
        if (pdf == null) {
            return 1;
        }
        try {
            String s = new String(pdf, java.nio.charset.StandardCharsets.ISO_8859_1);
            Pattern p = Pattern.compile("/Type\s*/Page[^s]");
            Matcher m = p.matcher(s);
            int count = 0;
            while (m.find()) {
                count++;
            }
            return Math.max(count, 1);
        } catch (Exception e) {
            return 1;
        }
    }

    private String sanitizeSegment(String s) {
        if (s == null) {
            return "file";
        }
        String clean = s.replaceAll("[^a-zA-Z0-9_-]", "_");
        return clean.isEmpty() ? "file" : clean;
    }

    private String sanitizeExtension(String ext) {
        if (ext == null || ext.isEmpty()) {
            return "";
        }
        String clean = ext.replaceAll("[^a-zA-Z0-9.]", "");
        if (clean.length() > 12) {
            clean = clean.substring(0, 12);
        }
        return clean;
    }
}
