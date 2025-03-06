package library.services.mappers;

import library.dto.ReviewDto;
import library.models.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper extends MapperInterface<Review, ReviewDto> {

    @Mapping(target = "user.profilePicture", ignore = true)
    Review dtoToEntity(ReviewDto reviewDto);

    @Mapping(target = "user.password",ignore = true)
    @Mapping(target = "user.profilePicture",ignore = true)
    @Mapping(target = "user.profilePicturePath", source = "user.profilePicture")
    ReviewDto entityToDto(Review review);

}
