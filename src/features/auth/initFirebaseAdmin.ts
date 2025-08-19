import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getCredential() {
  const clientEmail = process.env.FB_CLIENT_EMAIL;
  const pk = process.env.FB_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (clientEmail && pk) {
    return cert({
      projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
      clientEmail,
      privateKey: pk,
    });
  }
  return applicationDefault();
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: getCredential(),
      projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    });

export const adminDb = getFirestore(app);
