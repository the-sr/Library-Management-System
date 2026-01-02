package library.services;

import library.dto.AuthorDto;
import library.dto.BookDto;
import library.dto.GenreDto;
import library.dto.PageWiseResDto;

import java.util.List;
import java.util.Set;

public interface BookService {

    String add(BookDto req);

    BookDto findById(Long id);

    List<BookDto> findByTitle(String title);

    Set<BookDto> findByAuthor(String author);

    Set<BookDto> findByGenre(String genre);

    List<BookDto> getAllBooks();

    PageWiseResDto<BookDto> getAllBooks(Integer pageNumber, Integer pageSize, String sortBy, String sortDirection);

    String removeById(Long id);

    String updateById(BookDto req);

    String addBookAuthor(Long bookId, List<AuthorDto> req);

    String removeBookAuthor(Long bookId, Long authorId);

    String addBookGenre(Long bookId, List<GenreDto> req);

    String removeBookGenre(Long bookId, Long genreId);
}
