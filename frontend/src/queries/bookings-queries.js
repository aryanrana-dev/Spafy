import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosClient";
import { useAuthStore } from "../stores/auth-store";

/**
 * Format raw backend booking into the presentation model for UI
 */
export function formatBookingForUI(raw, index = 0) {
  if (!raw) return null;

  // Safe Date parsing
  const aptDate = raw.appointmentDate ? new Date(raw.appointmentDate) : new Date();
  const startTime = raw.startTime ? new Date(raw.startTime) : aptDate;
  const endTime = raw.endTime
    ? new Date(raw.endTime)
    : new Date(startTime.getTime() + 60 * 60 * 1000);

  const isValidApt = !isNaN(aptDate.getTime());
  const isValidStart = !isNaN(startTime.getTime());

  const safeAptDate = isValidApt ? aptDate : new Date();
  const safeStartTime = isValidStart ? startTime : safeAptDate;

  // Relative Date Formatting
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(
    safeAptDate.getFullYear(),
    safeAptDate.getMonth(),
    safeAptDate.getDate()
  );
  const diffDays = Math.round((targetDay - today) / (1000 * 60 * 60 * 24));

  const timeStr = safeStartTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  let dateDisplay = "";
  if (diffDays === 0) {
    dateDisplay = `Today, ${timeStr}`;
  } else if (diffDays === 1) {
    dateDisplay = `Tomorrow, ${timeStr}`;
  } else if (diffDays === -1) {
    dateDisplay = `Yesterday, ${timeStr}`;
  } else {
    const formattedDate = safeAptDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    dateDisplay = `${formattedDate} • ${timeStr}`;
  }

  const monthName = safeAptDate.toLocaleDateString("en-US", { month: "long" }).toUpperCase();

  // Status classification
  const rawStatus = String(raw.status || "confirmed").toLowerCase();
  const isCancelled = rawStatus === "cancelled";
  const isCompletedStatus = rawStatus === "completed" || rawStatus === "no_show";

  // Check if scheduled time has passed
  const compareTime = !isNaN(endTime.getTime()) ? endTime : safeStartTime;
  const isPastTime = compareTime < now;

  // A booking is upcoming if active and not marked cancelled/completed
  const isUpcoming = !isCancelled && !isCompletedStatus && (!isPastTime || diffDays >= 0);

  // Service details
  const service = raw.salonServiceId || {};
  const serviceName = service.name || raw.serviceName || "Sanctuary Wellness Ritual";
  const duration = service.durationMinutes ? `${service.durationMinutes} min` : "60 min";

  // Price formatting
  let price = "₹190";
  if (service.price != null) {
    price = `₹${Number(service.price).toFixed(0)}`;
  } else if (raw.price != null) {
    price = `₹${Number(raw.price).toFixed(0)}`;
  }

  const salonName = raw.salonId?.name || "Spafy Sanctuary";

  // Safe Address Formatting (Handles String, Object with street/city/pincode, or fallback)
  let addressText = `Suite 04 • ${salonName}`;
  if (typeof raw.salonId?.address === "string" && raw.salonId.address.trim()) {
    addressText = raw.salonId.address.trim();
  } else if (raw.salonId?.address && typeof raw.salonId.address === "object") {
    const addr = raw.salonId.address;
    const parts = [addr.street, addr.city, addr.pincode].filter(Boolean);
    if (parts.length > 0) {
      addressText = parts.join(", ");
    }
  }

  // Stock Photos fallback
  const stockPhotos = [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
  ];
  const photo = raw.image || service.image || stockPhotos[index % stockPhotos.length];

  // Practitioner
  const practitioner = raw.staffId?.name
    ? `Therapist: ${raw.staffId.name}`
    : index % 2 === 0
    ? "Therapist: Elena Rostov"
    : "Specialist: Marcus Chen";

  const bookingId = String(raw._id || raw.id || `booking-${index}`);

  if (isUpcoming) {
    return {
      id: bookingId,
      raw,
      status: "upcoming",
      statusLabel: rawStatus === "payment_pending" ? "PAYMENT PENDING" : "UPCOMING",
      statusSubtext: rawStatus === "payment_pending" ? "PENDING" : "CONFIRMED",
      statusIcon: "schedule",
      title: serviceName,
      displayTitle: serviceName.length > 25 ? `${serviceName.slice(0, 23)}...` : serviceName,
      date: dateDisplay,
      duration,
      practitionerRole: "Therapist",
      practitionerName: practitioner.replace(/^.*:\s*/, ""),
      displayPractitioner: practitioner,
      image: photo,
      meta: {
        type: "location",
        icon: "meeting_room",
        text: addressText,
      },
      price,
      primaryAction: {
        label: "RESCHEDULE",
        icon: "calendar_month",
        actionType: "reschedule",
      },
      secondaryAction: {
        type: "qr",
        icon: "qr_code_2",
        actionType: "qr",
        ariaLabel: "View Pass QR Code",
      },
    };
  }

  // Completed or Cancelled
  return {
    id: bookingId,
    raw,
    status: isCancelled ? "cancelled" : "completed",
    statusLabel: isCancelled ? "CANCELLED" : "COMPLETED",
    statusSubtext: monthName,
    statusIcon: isCancelled ? "close" : "check",
    title: serviceName,
    displayTitle: serviceName.length > 25 ? `${serviceName.slice(0, 23)}...` : serviceName,
    date: dateDisplay,
    duration,
    practitionerRole: "Specialist",
    practitionerName: practitioner.replace(/^.*:\s*/, ""),
    displayPractitioner: practitioner,
    image: photo,
    meta: {
      type: "location",
      icon: "meeting_room",
      text: addressText,
    },
    price,
    primaryAction: {
      label: "REBOOK RITUAL",
      icon: "sync",
      actionType: "rebook",
    },
    secondaryAction: {
      type: "receipt",
      icon: "receipt_long",
      actionType: "receipt",
      ariaLabel: "View Receipt",
    },
  };
}

/**
 * Fetch authenticated user's bookings from backend
 */
const fetchUserBookings = async () => {
  const { data } = await api.get("/user/booking/my-bookings");
  return data?.bookings || [];
};

/**
 * Hook to retrieve logged-in user bookings
 */
export function useUserBookings() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storedToken = localStorage.getItem("token");

  const isAuthed = Boolean(isAuthenticated || (user && storedToken));
  const userId = user?._id || user?.id || "me";

  return useQuery({
    queryKey: ["user-bookings", userId],
    queryFn: fetchUserBookings,
    enabled: isAuthed,
    staleTime: 1000 * 30, // 30 seconds freshness
    refetchOnWindowFocus: true,
  });
}

/**
 * Mutation to cancel an appointment
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?._id || user?.id || "me";

  return useMutation({
    mutationFn: async (bookingId) => {
      const { data } = await api.patch(`/user/booking/cancel/${bookingId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings", userId] });
    },
  });
}

/**
 * Mutation to reschedule an appointment
 */
export function useRescheduleBooking() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?._id || user?.id || "me";

  return useMutation({
    mutationFn: async ({ bookingId, newStartTime }) => {
      const { data } = await api.patch(`/user/booking/reschedule/${bookingId}`, {
        newStartTime,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings", userId] });
    },
  });
}
