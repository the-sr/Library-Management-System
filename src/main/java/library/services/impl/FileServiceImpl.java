package library.services.impl;

import library.exception.CustomException;
import library.services.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

@Service
@Slf4j
public class FileServiceImpl implements FileService {

    @Value("${multipart-location}")
    private String multipartLocation;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg","jpeg","png");

    @Override
    public String saveFile(MultipartFile file) {

        File dir = new File(multipartLocation);
        if(!dir.exists()){
            try{
                dir.mkdirs();
            }catch (Exception e){
                log.error("Error creating files directory: {}",e.getMessage());
            }
        }
        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.lastIndexOf(".")+1);
        if(!ALLOWED_EXTENSIONS.contains(ext))
            throw new CustomException("Invalid file type. Allowed extension are "+ ALLOWED_EXTENSIONS, HttpStatus.BAD_REQUEST);
        String newFileName=System.currentTimeMillis()+"."+ext;
        Path path= Paths.get(multipartLocation,newFileName);
        try {
            Files.copy(file.getInputStream(),path);
            return newFileName;
        }catch (Exception e){
            log.error("Error saving file in directory: {}",e.getMessage());
            throw new CustomException("Error saving file in directory: "+e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Resource getFile(String fileName) {
        Path path = Paths.get(multipartLocation,fileName);
        Resource resource=new FileSystemResource(path);
        if(!resource.exists()){
            throw new CustomException("File not found", HttpStatus.NOT_FOUND);
        }
        return resource;
    }
}
