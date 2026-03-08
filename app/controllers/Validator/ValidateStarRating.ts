export default function ValidateStarRating(rating: number | any) {
  if (!rating || typeof rating !== 'number') return false;

  return rating > 0 && rating < 6;
}
