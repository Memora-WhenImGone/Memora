import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";

connectToDatabase();

export async function trackVaultActivity(uid) {
  if (!uid) return;



  try {
    await Vault.updateOne(
      { owner: uid },
      {
        $set: {
          lastActiveAt: new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Failed to update vault activity: ", error);
  }
}

