"use server";
import clientPromise from "@/lib/mongo";


export async function ClaimEmail(email: string, phone: string, name: string, country: string, isFirst: boolean, isSecond: boolean, isThird: boolean, isOthers: boolean, isOthersText: string): Promise<{ success: boolean; message: string }> {
  try {

    const client = await clientPromise;
    const db = client.db("VISAWISE");
    const collection = db.collection("CONTACTS");

    // const existing = await collection.findOne({ email });

    // if (existing) {
    //   return { success: false, message: "Email already claimed" };
    // }

    await collection.insertOne({
      email,
      phone,
      name,
      country,
      isFirst,
      isSecond,
      isThird,
      isOthers,
      isOthersText,
      claimedAt: new Date(),
      from: "homepage",
    });

    return { success: true, message: "Our team will get back to you shortly." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred" };
  }
}

export async function SubscribeNewsletter(email: string, name: string): Promise<{ success: boolean; message: string }> {
  try {

    const client = await clientPromise;
    const db = client.db("VISAWISE");
    const collection = db.collection("SUBSCRIBERS");

    const isEmailExist = await collection.findOne({ email })
    if (isEmailExist) {
      return { success: false, message: "Already subscribed!" };
    }
    await collection.insertOne({
      email,
      name,
      subscribedAt: new Date(),
      from: "homepage"
    });

    return { success: true, message: "Our team will get back to you shortly." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred" };
  }
}