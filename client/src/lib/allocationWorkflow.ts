import type { AllocationStatus } from "../types/allocation.types";

export interface WorkflowAction {
  label: string;
  status: AllocationStatus;
}

export function getWorkflowActions(
  currentStatus: AllocationStatus
): WorkflowAction[] {
  switch (currentStatus) {
    case "PENDING":
      return [
        {
          label: "Move to Under Review",
          status: "UNDER_REVIEW",
        },
        {
          label: "Cancel Allocation",
          status: "CANCELLED",
        },
      ];

    case "UNDER_REVIEW":
      return [
        {
          label: "Approve Allocation",
          status: "APPROVED",
        },
        {
          label: "Reject Allocation",
          status: "REJECTED",
        },
      ];

    case "APPROVED":
      return [
        {
          label: "Start Processing",
          status: "IN_PROGRESS",
        },
      ];

    case "IN_PROGRESS":
      return [
        {
          label: "Mark Completed",
          status: "COMPLETED",
        },
      ];

    case "REJECTED":
      return [
        {
          label: "Move to Under Review",
          status: "UNDER_REVIEW",
        },
      ];

    case "CANCELLED":
      return [
        {
          label: "Restore to Pending",
          status: "PENDING",
        },
      ];

    case "COMPLETED":
      return [];

    default:
      return [];
  }
}