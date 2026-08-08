 export const calculateEndTime = (startTime, durationMinutes) => {
  const start = new Date(startTime);
  return new Date(start.getTime() + durationMinutes * 60000);
};

 export const isSlotAvailable = async (
  staffId,
  startTime,
  endTime,
  excludeBookingId = null
) => {
  const query = {
    staffId,
    status: { $in: ["payment_pending", "confirmed"] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const booking = await Booking.findOne(query);

  return !booking;
};

