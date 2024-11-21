export enum ProductRequestStatus {
  AwaitingDonor = "Waiting to be claimed by a donor",
  AwaitingDonorPayment = "Awaiting payment from donor",
  AwaitingPickup = "Waiting to be picked up by beneficiary",
  Claimed = "Beneficiary has claimed this package.",
}

export enum NotificationAction {
  View = "View Request",
  Approve = "Approve Request",
}
