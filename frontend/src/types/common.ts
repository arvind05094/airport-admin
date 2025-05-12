export type Status =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Fulfilled"
  | "Cancelled";

export interface Location {
  id: number;
  name: string;
}

export interface JobRole {
  id: number;
  name: string;
}

export interface ConstraintProfile {
  id: number;
  name: string;
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
  maxConsecutiveDays: number;
}
