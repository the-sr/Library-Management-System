import { Rating } from "@mui/material";

const RatingStars = ({ value = 0, onChange, readOnly = false, size = "medium" }) => {
  return (
    <Rating
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      size={size}
      precision={0.5}
    />
  );
};

export default RatingStars;
