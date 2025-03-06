package library.services.mappers;

import library.dto.UserBookDto;
import library.models.UserBook;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserBookMapper extends MapperInterface<UserBook, UserBookDto> {

    @Mapping(target = "user.profilePicture", ignore = true)
    UserBook dtoToEntity(UserBookDto userBookDto);

    @Mapping(target = "user.password", ignore = true)
    @Mapping(target = "user.profilePicture",ignore = true)
    @Mapping(target = "user.profilePicturePath", source = "user.profilePicture")
    UserBookDto entityToDto(UserBook userBook);
}
