package library.services.impl;

import library.config.security.AuthenticationFacade;
import library.dto.AuthorDto;
import library.models.PreferredAuthor;
import library.repository.AuthorRepo;
import library.repository.PreferredAuthorRepo;
import library.services.PreferredAuthorService;
import library.services.mappers.AuthorMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PreferredAuthorServiceImpl implements PreferredAuthorService {

    private final PreferredAuthorRepo preferredAuthorRepo;
    private final AuthenticationFacade facade;
    private final AuthorMapper authorMapper;
    private final AuthorRepo authorRepo;

    @Override
    public String addPreferredAuthor(List<Long> authorIds) {
        long userId=facade.getAuthentication().getUserId();
        if(authorIds!=null && !authorIds.isEmpty()){
            authorIds.parallelStream().forEach(id -> {
                if(authorRepo.findById(id).isPresent() && preferredAuthorRepo.findByUserIdAndAuthorId(userId,id).isEmpty()) {
                    PreferredAuthor preferredAuthor = PreferredAuthor.builder()
                            .userId(userId)
                            .authorId(id)
                            .build();
                    preferredAuthorRepo.save(preferredAuthor);
                }
            });
            return "Author has been successfully added as your preferred author";
        }else return "Please select at least one author";
    }

    @Override
    public List<AuthorDto> getPreferredAuthors(long userId) {
        List<PreferredAuthor> preferredAuthorList = preferredAuthorRepo.findAllByUserId(userId);
        List<AuthorDto> res = new ArrayList<>();
        if (preferredAuthorList != null && !preferredAuthorList.isEmpty())
            preferredAuthorList.parallelStream().forEach(preferredAuthor -> res.add(authorMapper.entityToDto(preferredAuthor.getAuthor())));
        return res;
    }

    @Transactional
    @Override
    public String removePreferredAuthor(long authorId) {
        preferredAuthorRepo.deleteByUserIdAndAuthorId(facade.getAuthentication().getUserId(), authorId);
        return "Author has been successfully removed from your preferred author";
    }

}

