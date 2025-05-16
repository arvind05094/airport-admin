export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  jobRoleId: number | null;
  jobRoleName: string | null;
  constraintProfileId: number | null;
  constraintProfileName: string | null;
  createdAt: string;
}

export interface AdminLeave {
  id: number;
  userId: number;
  userFullName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface AdminShiftCover {
  id: number;
  requesterId: number;
  requesterFullName: string;
  coveredById: number | null;
  coveredByFullName: string | null;
  shiftDate: string;
  shiftStartTime: string;
  shiftEndTime: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface AdminStaffingRequest {
  id: number;
  createdById: number;
  createdByFullName: string;
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

export interface RosterAssignment {
  id: number;
  userId: number;
  userFullName: string;
  staffingRequestId: number;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  jobRoleName: string;
}

export interface GenerateResult {
  totalAssignments: number;
  unfilledRequests: number;
  assignments: RosterAssignment[];
}

export interface AdminAvailability {
  id: number;
  userId: number;
  userFullName: string;
  date: string;
  isAvailable: boolean;
}
