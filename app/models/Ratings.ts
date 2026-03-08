import { Schema, model, models } from 'mongoose';

export interface RatingsProps {
  _id?: Object;
  user_id: number;
  rating_id: string;

  rating: {
    flight_id: string;
    stars: number;
  };
}

const RatingsSchema = new Schema<RatingsProps>({
  user_id: { type: Number, required: true },
  rating_id: { type: String, required: true },

  rating: {
    flight_id: { type: Number, required: true },
    stars: { type: String, required: true },
  },
});

export const Ratings = models.Ratings || model('Ratings', RatingsSchema);
