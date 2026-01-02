package library.services.mappers;

import library.dto.UserBookDto;
import library.models.UserBook;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserBookMapper extends MapperInterface<UserBook, UserBookDto> {

    UserBook dtoToEntity(UserBookDto userBookDto);

    @Mapping(target = "user.password", ignore = true)
    @Mapping(target = "user.address",ignore = true)
    UserBookDto entityToDto(UserBook userBook);
}
