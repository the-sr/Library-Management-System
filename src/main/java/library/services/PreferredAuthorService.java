package library.services;

import library.dto.AuthorDto;

import java.util.List;

public interface PreferredAuthorService {
    String addPreferredAuthor(List<Long> authorIds);
    List<AuthorDto> getPreferredAuthors(long userId);
    String removePreferredAuthor(long authorId);
}
