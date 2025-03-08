package library.services.impl;

import library.exception.CustomException;
import library.models.Author;
import library.repository.AuthorRepo;
import library.services.mappers.AuthorMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import library.dto.AuthorDto;
import library.services.AuthorService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepo authorRepo;
    private final AuthorMapper authorMapper;

    @Override
    public AuthorDto add(AuthorDto req) {
        String name=req.getFirstName()+" "+req.getLastName();
        return authorRepo.findByName(name)
                .map(authorMapper::entityToDto)
                .orElse(authorMapper.entityToDto(authorRepo.save(authorMapper.dtoToEntity(req))));
    }

    @Override
    public AuthorDto getById(Long id) {
        Author author=authorRepo.findById(id).orElseThrow(()->new CustomException("Author not found", HttpStatus.NOT_FOUND));
        return authorMapper.entityToDto(author);
    }

    @Override
    public List<AuthorDto> getByAuthorName(String authorName) {
        List<Author> authorList=authorRepo.findByAuthorName(authorName);
        return authorList.parallelStream().map(authorMapper::entityToDto).collect(Collectors.toList());
    }

    @Override
    public List<AuthorDto> getAllAuthors() {
        List<Author> authorList=authorRepo.findAll();
        return authorList.parallelStream().map(authorMapper::entityToDto).collect(Collectors.toList());
    }


}
