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
    User dtoToEntity(UserDto userDto);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "confirmPassword", ignore = true)
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
