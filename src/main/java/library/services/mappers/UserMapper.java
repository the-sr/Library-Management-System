package library.services.mappers;

import library.enums.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import library.dto.UserDto;
import library.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper extends MapperInterface<User, UserDto> {

    @Mapping(target = "password", qualifiedByName = "encodePassword")
    @Mapping(target = "role", qualifiedByName = "setRoles")
    @Mapping(target = "profilePicture", ignore = true)
    User dtoToEntity(UserDto userDto);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "confirmPassword", ignore = true)
    @Mapping(target = "profilePicture",ignore = true)
    @Mapping(target = "profilePicturePath", source = "profilePicture")
    UserDto entityToDto(User user);

    @Named("encodePassword")
    default String encodePassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }

    @Named("setRoles")
    default Role setRoles(Role role) {
       return (role!=null)? role: Role.MEMBER;
    }
}
