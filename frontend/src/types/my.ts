export interface MyLeave {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface MyShiftCover {
  id: number;
  shiftDate: string;
  shiftStartTime: string;
  shiftEndTime: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface MyStaffingRequest {
  id: number;
  locationId: number;
  locationName: string;
  jobRoleId: number;
  jobRoleName: string;
  date: string;
  startTime: string;
  endTime: string;
  requiredCount: number;
  status: string;
  createdAt: string;
}

export interface MyRosterAssignment {
  id: number;
  userId: number;
  staffingRequestId: number;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  jobRoleName: string;
}

export interface MyAvailability {
  id: number;
  userId: number;
  date: string;
  isAvailable: boolean;
}
