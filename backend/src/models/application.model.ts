import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IApplication extends Document {
  company: string;
  role: string;
  jobDescription?: string;
  jdLink?: string;
  notes?: string;
  dateApplied: Date;
  status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
  salaryRange?: string;
  user: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
    },
    jdLink: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    dateApplied: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
      required: true,
    },
    salaryRange: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);
