import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, X, Loader2, Save, User } from "lucide-react";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("profile/");

        setFormData(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user info");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfileAgain();
  };

  const fetchProfileAgain = async () => {
    try {
      const res = await api.get("profile/");
      setFormData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await api.patch("profile/", formData);

      setFormData(res.data.data);

      toast.success(res.data.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      const errorData = error?.response?.data;

      let errorMessage =
        errorData?.message || "Profile update failed.";

      if (errorData?.errors) {
        const firstField = Object.keys(errorData.errors)[0];

        if (firstField) {
          errorMessage = errorData.errors[firstField][0];
        }
      }

      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Getting user info...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F9FAFB]">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                <User className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Profile
                </h2>
                <p className="text-sm text-slate-500">
                  Manage your account information
                </p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-5 px-6 py-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing || updating}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing || updating}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updating}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default Profile;