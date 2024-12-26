/** @format */

import { getCabin, getBookedDatesByCabinId } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
  const { cabinID } = params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinID),
      getBookedDatesByCabinId(cabinID),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "Cabin not found" });
  }
}
