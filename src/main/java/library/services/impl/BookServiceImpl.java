package library.services.impl;

import library.dto.AuthorDto;
import library.dto.BookDto;
import library.dto.GenreDto;
import library.dto.PageWiseResDto;
import library.exception.CustomException;
import library.models.Book;
import library.models.BookAuthor;
import library.models.BookGenre;
import library.repository.*;
import library.services.AuthorService;
import library.services.BookService;
import library.services.GenreService;
import library.services.mappers.AuthorMapper;
import library.services.mappers.BookMapper;
import library.services.mappers.GenreMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepo bookRepo;
    private final BookMapper bookMapper;
    private final AuthorService authorService;
    private final BookAuthorRepo bookAuthorRepo;
    private final GenreService genreService;
    private final BookGenreRepo bookGenreRepo;
    private final AuthorMapper authorMapper;
    private final GenreMapper genreMapper;
    private final PreferredGenreRepo preferredGenreRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final PreferredAuthorRepo preferredAuthorRepo;

    @Override
    public String add(BookDto req) {
        Book book = bookRepo.save(bookMapper.dtoToEntity(req));
        saveBookAuthor(book.getId(),req.getAuthors());
        saveBookGenre(book.getId(),req.getGenre());
        return "Book added successfully";
    }

    @Override
    public BookDto findById(Long id) {
        Book book = bookRepo.findById(id).orElseThrow(() -> new CustomException("Book not found", HttpStatus.NOT_FOUND));
        BookDto res = bookMapper.entityToDto(book);
        res.setAuthors(getAuthorDtoList(res));
        res.setGenre(getGenreDtoList(res));
        return res;
    }

    @Override
    public List<BookDto> findByTitle(String title) {
        List<Book> bookList = bookRepo.findByTitle(title);
        List<BookDto> res = new ArrayList<>();
        if (bookList != null && !bookList.isEmpty()) {
            bookList.parallelStream().forEach(book -> {
                BookDto bookDto = bookMapper.entityToDto(book);
                bookDto.setAuthors(getAuthorDtoList(bookDto));
                bookDto.setGenre(getGenreDtoList(bookDto));
                res.add(bookDto);
            });
        }
        return res;
    }

    @Override
    public Set<BookDto> findByAuthor(String authorName) {
        List<AuthorDto> authorDtoList = authorService.getByAuthorName(authorName);
        Set<BookDto> res = new HashSet<>();
        if (authorDtoList != null && !authorDtoList.isEmpty()) {
            authorDtoList.parallelStream().forEach(author -> {
                List<BookAuthor> bookAuthorList = bookAuthorRepo.findAllByAuthorId(author.getId());
                bookAuthorList.parallelStream().forEach(bookAuthor -> {
                    BookDto bookDto = bookMapper.entityToDto(bookAuthor.getBook());
                    bookDto.setAuthors(getAuthorDtoList(bookDto));
                    bookDto.setGenre(getGenreDtoList(bookDto));
                    res.add(bookDto);
                });
            });
        }
        return res;
    }

    @Override
    public Set<BookDto> findByGenre(String genreName) {
        List<GenreDto> genreDtoList = genreService.getByGenreName(genreName);
        Set<BookDto> res = new HashSet<>();
        if (genreDtoList != null && !genreDtoList.isEmpty()) {
            genreDtoList.parallelStream().forEach(genre -> {
                List<BookGenre> bookGenreList = bookGenreRepo.findAllByGenreId(genre.getId());
                bookGenreList.parallelStream().forEach(bookGenre -> {
                    BookDto bookDto = bookMapper.entityToDto(bookGenre.getBook());
                    bookDto.setGenre(getGenreDtoList(bookDto));
                    bookDto.setAuthors(getAuthorDtoList(bookDto));
                    res.add(bookDto);
                });
            });
        }
        return res;
    }

    @Override
    public List<BookDto> getAllBooks() {
        List<Book> bookList = bookRepo.findAll();
        List<BookDto> res = new ArrayList<>();
        if (!bookList.isEmpty()) {
            bookList.parallelStream().forEach(book -> {
                BookDto bookDto = bookMapper.entityToDto(book);
                bookDto.setAuthors(getAuthorDtoList(bookDto));
                bookDto.setGenre(getGenreDtoList(bookDto));
                res.add(bookDto);
            });
        }
        return res;
    }

    @Override
    public PageWiseResDto<BookDto> getAllBooks(Integer pageNumber, Integer pageSize, String sortBy, String sortDirection) {
        Sort sort;
        if (sortDirection.equalsIgnoreCase("desc"))
            sort = Sort.by(sortBy).descending();
        else sort = Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Book> books = bookRepo.findAll(pageable);
        List<BookDto> bookDtoList = new ArrayList<>();
        books.stream().forEach(book -> {
            BookDto bookDto = bookMapper.entityToDto(book);
            bookDto.setAuthors(getAuthorDtoList(bookDto));
            bookDto.setGenre(getGenreDtoList(bookDto));
            bookDtoList.add(bookDto);
        });
        return PageWiseResDto.<BookDto>builder()
                .res(bookDtoList)
                .totalPages(books.getTotalPages())
                .totalElements(books.getTotalElements())
                .currentPage(books.getNumber())
                .pageSize(books.getSize())
                .isLast(books.isLast())
                .build();
    }

    @Transactional
    @Override
    public String removeById(Long id) {
        bookAuthorRepo.deleteAllByBookId(id);
        bookGenreRepo.deleteAllByBookId(id);
        bookRepo.deleteById(id);
        return "Book deleted successfully";
    }

    @Override
    public String updateById(BookDto req) {
        Book book = bookRepo.findById(req.getId()).orElseThrow(() -> new CustomException("Book not found", HttpStatus.NOT_FOUND));
        book.setIsbn(req.getIsbn());
        book.setTitle(req.getTitle());
        book.setEdition(req.getEdition());
        book.setPublisher(req.getPublisher());
        book.setBookCount(req.getBookCount());
        return "Book updated successfully";
    }

    @Override
    public String addBookAuthor(Long bookId, List<AuthorDto> req) {
        if(!bookRepo.existsById(bookId))
            throw new CustomException("Book not found",HttpStatus.NOT_FOUND);
        saveBookAuthor(bookId,req);
        return "Author added to the book successfully";
    }

    @Transactional
    @Override
    public String removeBookAuthor(Long bookId, Long authorId) {
        if(!bookRepo.existsById(bookId))
            throw new CustomException("Book not found",HttpStatus.NOT_FOUND);
        bookAuthorRepo.deleteByBookIdAndAuthorId(bookId,authorId);
        return "Author removed from the book successfully";
    }

    @Override
    public String addBookGenre(Long bookId, List<GenreDto> req) {
        if(!bookRepo.existsById(bookId))
            throw new CustomException("Book not found",HttpStatus.NOT_FOUND);
        saveBookGenre(bookId,req);
        return "Genre added to the book successfully";
    }

    @Transactional
    @Override
    public String removeBookGenre(Long bookId, Long genreId) {
        if(!bookRepo.existsById(bookId))
            throw new CustomException("Book not found",HttpStatus.NOT_FOUND);
        bookGenreRepo.deleteByBookIdAndGenreId(bookId,genreId);
        return "Genre removed from the book successfully";
    }

    private void saveBookAuthor(Long bookId,List<AuthorDto> authorDtoList){
        if(authorDtoList!=null && !authorDtoList.isEmpty()){
            authorDtoList.parallelStream().forEach(author->{
                author=authorService.add(author);
                BookAuthor bookAuthor=BookAuthor.builder()
                        .bookId(bookId)
                        .authorId(author.getId())
                        .build();
                bookAuthorRepo.save(bookAuthor);
                Set<Long> userIds=preferredAuthorRepo.findAllUserIdsByAuthorId(author.getId());
                String notificationMessage="A new book of your preferred author \""+author.getFirstName()+" "+author.getLastName()+"\" is now available in the library";
                userIds.parallelStream().forEach(userId->{
                    messagingTemplate.convertAndSendToUser(userId.toString(),"/messages",notificationMessage);
                });
            });
        }
    }

    private void saveBookGenre(Long bookId, List<GenreDto> genreDtoList){
        if(genreDtoList!=null && !genreDtoList.isEmpty()){
            genreDtoList.parallelStream().forEach(genre->{
                genre=genreService.add(genre);
                BookGenre bookGenre=BookGenre.builder()
                        .bookId(bookId)
                        .genreId(genre.getId())
                        .build();
                bookGenreRepo.save(bookGenre);
                Set<Long> userIds=preferredGenreRepo.findAllUserIdsByGenreId(genre.getId());
                String notificationMessage="A new book of your preferred genre \""+genre.getName()+"\" is now available in the library";
                userIds.parallelStream().forEach(userId->{
                    messagingTemplate.convertAndSendToUser(userId.toString(),"/messages",notificationMessage);
                });
            });
        }
    }

    private List<AuthorDto> getAuthorDtoList(BookDto bookDto) {
        List<BookAuthor> bookAuthorList = bookAuthorRepo.findAllByBookId(bookDto.getId());
        List<AuthorDto> authorDtoList = new ArrayList<>();
        bookAuthorList.parallelStream().forEach(bookAuthor -> {
            authorDtoList.add(authorMapper.entityToDto(bookAuthor.getAuthor()));
        });
        return authorDtoList;
    }

    private List<GenreDto> getGenreDtoList(BookDto bookDto) {
        List<BookGenre> bookGenreList = bookGenreRepo.findAllByBookId(bookDto.getId());
        List<GenreDto> genreDtoList = new ArrayList<>();
        bookGenreList.parallelStream().forEach(bookGenre -> {
            genreDtoList.add(genreMapper.entityToDto(bookGenre.getGenre()));
        });
        return genreDtoList;
    }
}
