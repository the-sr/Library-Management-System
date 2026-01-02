package library.services;

import library.dto.AuthorDto;

import java.util.List;

public interface AuthorService {

    AuthorDto add(AuthorDto req);
    AuthorDto getById(Long id);
    List<AuthorDto> getByAuthorName(String authorName);
    List<AuthorDto> getAllAuthors();

}
