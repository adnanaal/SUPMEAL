package supmeal_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import supmeal_backend.dto.ExportData;
import supmeal_backend.service.ExportService;
import supmeal_backend.service.ImportService;

import java.io.IOException;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExportController {

    private final ExportService exportService;
    private final ImportService importService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<byte[]> exportUserData(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        try {
            ExportData exportData = exportService.exportUserData(userId);
            String jsonData = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(exportData);
            
            String filename = "supmeal-export-" + userId + "-" + exportData.getExportedAt() + ".json";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_JSON)
                    .contentLength(jsonData.getBytes().length)
                    .body(jsonData.getBytes());
                    
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/import")
    public ResponseEntity<String> importUserData(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            
            String jsonData = new String(file.getBytes());
            importService.importUserData(userId, jsonData);
            
            return ResponseEntity.ok("Data imported successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to import data: " + e.getMessage());
        }
    }
}
