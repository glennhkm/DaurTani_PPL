"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth, User } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import API from "@/lib/utils/apiCreate";

export default function AuthCallback() {
  const router = useRouter();
  const { setAuth } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token") || "";

        if (!accessToken) {
          throw new Error("No access token found");
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }

        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          throw userError || new Error("User not found");
        }

        const user = userData.user;

        const authenticatedUser: User = {
          email: user.email || "",
          fullName: user.user_metadata?.full_name || "",
          phoneNumber: user.phone || "",
          ...user,
          accessToken,
          refreshToken,
        };

        const response = await API.post(
          "/auth/success-oauth",
          authenticatedUser
        );
        if (response.status === 200) {
          setAuth(accessToken, authenticatedUser);
          toast.success("Berhasil masuk");
          router.replace("/marketplace");
        } else {
          throw new Error("Gagal menyimpan user");
        }
      } catch (err: any) {
        console.error("OAuth Error:", err);
        toast.error("Gagal masuk");
        router.replace("/auth/login?error=oauth");
      }
    };

    if (typeof window !== "undefined") {
      handleAuth();
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand01 via-neutral01 to-neutral01">
      <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8">
        <svg
          className="animate-spin h-10 w-10 text-brand01 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Sedang masuk...
        </h2>
        <p className="text-gray-500 text-center">
          Mohon tunggu, Rute Anda sedang diarahkan.
        </p>
      </div>
    </div>
  );
}

// {
//   "id": "5830b8f4-edc6-45ef-81bb-5566782f2c5a",
//   "aud": "authenticated",
//   "role": "authenticated",
//   "email": "glenn.hkm@gmail.com",
//   "email_confirmed_at": "2025-05-29T19:05:54.459368Z",
//   "phone": "",
//   "confirmed_at": "2025-05-29T19:05:54.459368Z",
//   "last_sign_in_at": "2025-05-30T07:51:27.453557Z",
//   "app_metadata": {
//       "provider": "google",
//       "providers": [
//           "google"
//       ]
//   },
//   "user_metadata": {
//       "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocLVVFw1rezSrhgM7V-wbdFakVC26JLUXk_wvU5Pk4jVci9rjjcy=s96-c",
//       "email": "glenn.hkm@gmail.com",
//       "email_verified": true,
//       "full_name": "glenn hakim",
//       "iss": "https://accounts.google.com",
//       "name": "glenn hakim",
//       "phone_verified": false,
//       "picture": "https://lh3.googleusercontent.com/a/ACg8ocLVVFw1rezSrhgM7V-wbdFakVC26JLUXk_wvU5Pk4jVci9rjjcy=s96-c",
//       "provider_id": "107276672551173075211",
//       "sub": "107276672551173075211"
//   },
//   "identities": [
//       {
//           "identity_id": "de6ec694-c3fc-43df-8dda-5f733030415d",
//           "id": "107276672551173075211",
//           "user_id": "5830b8f4-edc6-45ef-81bb-5566782f2c5a",
//           "identity_data": {
//               "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocLVVFw1rezSrhgM7V-wbdFakVC26JLUXk_wvU5Pk4jVci9rjjcy=s96-c",
//               "email": "glenn.hkm@gmail.com",
//               "email_verified": true,
//               "full_name": "glenn hakim",
//               "iss": "https://accounts.google.com",
//               "name": "glenn hakim",
//               "phone_verified": false,
//               "picture": "https://lh3.googleusercontent.com/a/ACg8ocLVVFw1rezSrhgM7V-wbdFakVC26JLUXk_wvU5Pk4jVci9rjjcy=s96-c",
//               "provider_id": "107276672551173075211",
//               "sub": "107276672551173075211"
//           },
//           "provider": "google",
//           "last_sign_in_at": "2025-05-29T19:05:54.456044Z",
//           "created_at": "2025-05-29T19:05:54.456092Z",
//           "updated_at": "2025-05-30T07:51:27.451452Z",
//           "email": "glenn.hkm@gmail.com"
//       }
//   ],
//   "created_at": "2025-05-29T19:05:54.45151Z",
//   "updated_at": "2025-05-30T07:51:27.455279Z",
//   "is_anonymous": false
// }
