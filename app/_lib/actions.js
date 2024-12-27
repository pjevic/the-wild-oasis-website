/** @format */

"use server";

import { revalidatePath } from "next/cache";

import { signIn, signOut, auth } from "./auth";
import { supabase } from "./supabase";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  console.log(session);

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
