import Booking from "../models/Booking.js";
import Staff from "../models/Staff.js";
import SalonService from "../models/SalonService.js";
import Salon from "../models/Salon.js";



/* --------------------------------- Helpers -------------------------------- */

const calculateEndTime = (startTime, durationMinutes) => {
  const start = new Date(startTime);
  return new Date(start.getTime() + durationMinutes * 60000);
};

const isSlotAvailable = async (
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


export const createBooking = async (req, res) => {
  try {
    const {
      salonId,
      staffId,
      salonServiceId,
      appointmentDate,
      startTime,
    } = req.body;

    if (
      !salonId ||
      !staffId ||
      !salonServiceId ||
      !appointmentDate ||
      !startTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
        const salon = await Salon.findById(salonId);

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found",
      });
    }


    // Check staff
    const staff = await Staff.findById(staffId);

    if (!staff || !staff.isActive) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    // Check service
    const service = await SalonService.findById(salonServiceId);

    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (staff.salonId.toString() !== salonId) {
      return res.status(400).json({
        success: false,
        message: "Staff does not belong to this salon",
      });
    }


 

    const providesService = staff.servicesProvided.some(
      (id) => id.toString() === salonServiceId
    );

    if (!providesService) {
      return res.status(400).json({
        success: false,
        message: "Selected staff doesn't provide this service",
      });
    }

    const start = new Date(startTime);
    const end = calculateEndTime(start, service.durationMinutes);

    const available = await isSlotAvailable(staffId, start, end);

    if (!available) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is already booked",
      });
    }


    const booking = await Booking.create({
      salonId,
      userId: req.user._id,
      staffId,
      salonServiceId,
      appointmentDate,
      startTime: start,
      endTime: end,
      status: "payment_pending",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ========================= GET MY BOOKINGS ========================= */

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate("salonId")
      .populate("staffId")
      .populate("salonServiceId")
      .sort({ appointmentDate: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ========================= GET BOOKING BY ID ========================= */

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("salonId")
      .populate("staffId")
      .populate("salonServiceId")
      .populate("userId", "-password");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // User can only access their own booking
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ========================= CANCEL BOOKING ========================= */

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only the booking owner can cancel
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking",
      });
    }

    if (
      booking.status === "completed" ||
      booking.status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}`,
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


    export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "payment_pending",
      "confirmed",
      "completed",
      "cancelled",
      "no_show",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ========================= GET ALL BOOKINGS ========================= */

export const getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "-password")
      .populate("staffId")
      .populate("salonId")
      .populate("salonServiceId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ========================= GET TODAY BOOKINGS ========================= */

export const getTodayBooking = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      appointmentDate: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    })
      .populate("userId", "-password")
      .populate("staffId")
      .populate("salonId")
      .populate("salonServiceId")
      .sort({ startTime: 1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkSlotAvailability = async (req, res) => {
  try {
    const { staffId, salonServiceId, startTime } = req.body;

    if (!staffId || !salonServiceId || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const service = await SalonService.findById(salonServiceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const start = new Date(startTime);
    const end = calculateEndTime(start, service.durationMinutes);

    const available = await isSlotAvailable(staffId, start, end);

    return res.status(200).json({
      success: true,
      available,
      startTime: start,
      endTime: end,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ========================= RESCHEDULE BOOKING ========================= */

export const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, startTime } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const service = await SalonService.findById(
      booking.salonServiceId
    );

    const newStart = new Date(startTime);
    const newEnd = calculateEndTime(
      newStart,
      service.durationMinutes
    );

    const available = await isSlotAvailable(
      booking.staffId,
      newStart,
      newEnd,
      booking._id
    );

    if (!available) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is already booked",
      });
    }

    booking.appointmentDate = appointmentDate;
    booking.startTime = newStart;
    booking.endTime = newEnd;
    booking.status = "payment_pending";

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking rescheduled successfully",
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ========================= DELETE BOOKING ========================= */

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await Booking.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};