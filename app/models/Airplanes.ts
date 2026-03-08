import { Schema, model, models } from 'mongoose';

export type SeatGroupType = 'business' | 'economy_plus' | 'economy';
export interface AirplaneProps {
  _id?: Object;
  airplane_id: number;
  name: string;
  column_amount: number;

  seat_groups?: [
    {
      _id?: Object;
      row_start: string;
      row_end: string;
      name: SeatGroupType;
    },
  ];
}

const AirplanesSchema = new Schema<AirplaneProps>({
  airplane_id: { type: Number, required: true },
  name: { type: String, required: true },
  column_amount: { type: Number, required: true },

  seat_groups: [
    {
      row_start: { type: String, required: true },
      row_end: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
});

export const Airplanes =
  models.Airplanes || model('Airplanes', AirplanesSchema);
