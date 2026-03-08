import { Schema, model, models } from 'mongoose';

export interface FlightProps {
  _id?: Object;
  airplane_id: number;
  flight_id: string;
  staff_id: number;

  flight_info: {
    arrival_location: string;
    departure_location: string;
    departure_date: Date;
    base_price: number;
    sells_food?: boolean;
  };
}

const FlightsSchema = new Schema<FlightProps>({
  airplane_id: { type: Number, required: true },
  flight_id: { type: String, required: true },
  staff_id: { type: Number, required: true },
  flight_info: {
    arrival_location: { type: String, required: true },
    departure_location: { type: String, required: true },
    departure_date: { type: Date, required: true },
    base_price: { type: Number, required: true },
    sells_food: { type: Boolean, required: false },
  },
});

export const Flights = models.Flights || model('Flights', FlightsSchema);
