"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, Loader2 } from "lucide-react";
import { dmSerifDisplay } from "@/components/fonts/dmSerifDisplay";
import Image from "next/image";
import API from "@/lib/utils/apiCreate";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Anda harus login terlebih dahulu.");
        router.push("/auth/login");
        return;
      } 
      try {
        const response = await API.get(`/users`, {
          headers: {
            Authorization: `Bearer ${data.session?.access_token}`,
          },
        });
        if (response.status === 200) {
          setProfile(response.data.user);
          setFormData({
            fullName: response.data.user.fullName || "",
            phoneNumber: response.data.user.phoneNumber || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Anda harus login terlebih dahulu.");
        router.push("/auth/login");
        return;
      }
      const response = await API.put(`/users`, formData, {
        headers: {
          Authorization: `Bearer ${data.session?.access_token}`,
        },
      });
      if (response.status === 200) {
        setProfile(response.data.user);
        supabase.auth.updateUser({
          data: {
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
          }, 
        });
        toast.success("Profil berhasil diubah.");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand01" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative px-4 lg:pt-24 flex flex-col gap-6 items-center justify-center h-[40vh]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/bgHero.webp"
            alt="Background pertanian"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand03/40 to-brand03/80 backdrop-blur-sm" />
        </div>
        <h2 className={`text-4xl md:text-5xl text-neutral01 ${dmSerifDisplay.className}`}>
          Profil Anda
        </h2>
        <p className="text-neutral01/80 text-center max-w-xl">
          Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 -mt-12">
        <div className="bg-neutral01 rounded-xl shadow-lg p-6 md:p-8">
          <div className="space-y-6">
            {/* Email Field - Read Only */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-brand01/5 rounded-lg">
              <div className="flex items-center gap-3 min-w-[200px]">
                <Mail className="w-5 h-5 text-brand01" />
                <span className="text-brand03/80 font-medium">Email</span>
              </div>
              <p className="text-brand03">{profile?.email}</p>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Field - Editable */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-brand01/5 rounded-lg">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <User className="w-5 h-5 text-brand01" />
                    <span className="text-brand03/80 font-medium">Nama Lengkap</span>
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-brand01/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand01/30"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* Phone Number Field - Editable */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-brand01/5 rounded-lg">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <Phone className="w-5 h-5 text-brand01" />
                    <span className="text-brand03/80 font-medium">Nomor Telepon</span>
                  </div>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-brand01/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand01/30"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-brand03 hover:text-brand01 transition-colors"
                    disabled={isSaving}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand01 text-neutral01 rounded-lg hover:opacity-80 transition-colors flex items-center gap-2"
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Full Name Field - Display */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-brand01/5 rounded-lg">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <User className="w-5 h-5 text-brand01" />
                    <span className="text-brand03/80 font-medium">Nama Lengkap</span>
                  </div>
                  <p className="text-brand03">{profile?.fullName || "-"}</p>
                </div>

                {/* Phone Number Field - Display */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-brand01/5 rounded-lg">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <Phone className="w-5 h-5 text-brand01" />
                    <span className="text-brand03/80 font-medium">Nomor Telepon</span>
                  </div>
                  <p className="text-brand03">{profile?.phoneNumber || "-"}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-brand01 text-neutral01 rounded-lg hover:opacity-80 transition-colors"
                  >
                    Edit Profil
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 