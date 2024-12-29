/** @format */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";

import { signIn, signOut, auth } from "./auth";
import { getBookings } from "./data-service";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  const regex = /^[a-zA-Z0-9]{6,12}$/;
  if (!regex.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updatedData = { nationality, countryFlag, nationalID };
  console.log(updatedData);

  // Supabse: Update --> updateGuest(id, updatedFields)
  const { data, error } = await supabase
    .from("guests")
    .update(updatedData)
    .eq("id", session.user.guestID);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingID) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestID);
  const guestBookingIDs = guestBookings.map((booking) => booking.id);

  if (!guestBookingIDs.includes(bookingID))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingID);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("account/reservations");
}

export async function updateReservation(formData) {
  const bookingID = Number(formData.get("bookingID"));

  // 1. authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2. Authorization
  const guestBookings = await getBookings(session.user.guestID);
  const guestBookingIDs = guestBookings.map((booking) => booking.id);

  if (!guestBookingIDs.includes(bookingID))
    throw new Error("You are not allowed to update this booking");

  // 3. Building Update data
  const updatedData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4. Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", bookingID)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }

  // 5. Revalidation
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingID}`);

  // 6. Redirecting
  redirect("/account/reservations");
}
