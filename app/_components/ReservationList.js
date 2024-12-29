/** @format */

"use client";

import { useOptimistic } from "react";

import ReservationCard from "./ReservationCard";
import { deleteReservation } from "../_lib/actions";

function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingID) => {
      return curBookings.filter((booking) => booking.id !== bookingID);
    }
  );

  async function handleDelete(bookingID) {
    optimisticDelete(bookingID);
    await deleteReservation(bookingID);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;