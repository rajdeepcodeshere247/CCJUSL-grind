"use client";

import { signOut } from "next-auth/react";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { Event } from "@/types/events";
import { SERVER_URL } from "@/utils/constants";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { editUserDetails } from "@/services/UserService";

type DashboardTeam = {
  id: string;
  name: string;
  eventSlug: string;
  event: Event;
};

type DashboardUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  college: string | null;
  department: string | null;
  year: string | null;
  phone: string | null;
  teams: DashboardTeam[];
  pendingTeams: DashboardTeam[];
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mt-12 mb-8 flex w-full items-center gap-4">
    <h2 className="text-2xl font-bold tracking-tight whitespace-nowrap text-white uppercase">
      {title}
    </h2>
    <div className="h-px flex-1 bg-white/20"></div>
  </div>
);

const EmptyState = ({ text }: { text: string }) => (
  <p className="text-sm font-light text-white/50">{text}</p>
);

function Dashboard({ user }: { user: DashboardUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const handleLogout = () => {
    signOut({
      redirectTo: `${SERVER_URL}/signin`,
    });
  };

  // Form state
  const [formData, setFormData] = useState({
    name: user.name || "",
    college: user.college || "",
    department: user.department || "",
    year: user.year || "",
    phone: user.phone || "",
  });

  const openEditModal = () => {
    dialogRef.current?.showModal();
  };

  const closeEditModal = () => {
    dialogRef.current?.close();
    setFormData({
      name: user.name || "",
      college: user.college || "",
      department: user.department || "",
      year: user.year || "",
      phone: user.phone || "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await editUserDetails(formData);

      if (!response.ok) {
        toast.error("Failed to update profile");
      }else{
        toast.success("Profile updated successfully!");
        router.refresh();
      }

      closeEditModal();
    } catch{
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-16 p-6 text-white md:p-12">
      {/* Timeline Decoration */}
      <div className="flex w-full items-center justify-center gap-4 pt-8 font-mono text-xs tracking-widest text-white/40">
        <div className="h-px w-24 bg-white/20"></div>
        <span>DASHBOARD</span>
        <div className="h-px w-24 bg-white/20"></div>
      </div>

      {/* Profile Header */}
      <div className="flex w-full flex-col items-center gap-8 border-b border-white/10 pb-12 md:flex-row md:items-start">
        <div className="relative">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden border border-white/20 bg-black">
            {user.image ? (
              <Image
                src={user.image}
                alt="Profile"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                width={100}
                height={100}
              />
            ) : (
              <span className="text-6xl font-light text-white/60">
                {user.name ? user.name[0].toUpperCase() : "?"}
              </span>
            )}
          </div>
          <div className="absolute -right-3 -bottom-3 bg-red-400 px-3 py-1.5 text-xs font-bold tracking-wider text-black uppercase">
            {user.role || "Guest"}
          </div>
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            {user.name || "Anonymous User"}
          </h1>
          <p className="font-mono text-base tracking-wide text-white/60">
            {user.email || "No email linked"}
          </p>
          <div className="pt-2">
            <p className="mb-1 font-mono text-xs tracking-widest text-white/40 uppercase">
              Member Since
            </p>
            <p className="font-light text-white/80">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Date Unknown"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-y-8 justify-between h-full">
          <button
            onClick={handleLogout}
            className="cursor-pointer border border-red-400 px-10 py-3 text-sm font-bold tracking-widest uppercase transition-all hover:bg-red-400 hover:text-black"
          >
            Logout
          </button>
          <button
            onClick={openEditModal}
            className="cursor-pointer border border-red-400 px-10 py-3 text-sm font-bold tracking-widest whitespace-nowrap uppercase transition-all hover:bg-red-400 hover:text-black"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Academic Information */}
      <div className="w-full">
        <SectionHeader title="Academic Information" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-white/20 p-6">
            <p className="mb-3 font-mono text-xs tracking-widest text-white/50 uppercase">
              College
            </p>
            <p className="text-lg font-light text-white">
              {user.college || <EmptyState text="Not specified" />}
            </p>
          </div>
          <div className="border border-white/20 p-6">
            <p className="mb-3 font-mono text-xs tracking-widest text-white/50 uppercase">
              Department
            </p>
            <p className="text-lg font-light text-white">
              {user.department || <EmptyState text="Not listed" />}
            </p>
          </div>
          <div className="border border-white/20 p-6">
            <p className="mb-3 font-mono text-xs tracking-widest text-white/50 uppercase">
              Graduation Year
            </p>
            <p className="text-lg font-light text-white">
              {user.year || <EmptyState text="N/A" />}
            </p>
          </div>
          <div className="border border-white/20 p-6">
            <p className="mb-3 font-mono text-xs tracking-widest text-white/50 uppercase">
              Phone
            </p>
            <p className="text-lg font-light text-white">
              {user.phone || <EmptyState text="Not added" />}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="w-full">
        <SectionHeader title="Activity Overview" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              id: 1,
              label: "My Teams",
              data: user.teams,
              empty: "Not part of any teams yet",
            },
            {
              id: 2,
              label: "Pending Requests",
              data: user.pendingTeams,
              empty: "No pending invitations",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="border border-white/20 p-6 transition-colors hover:border-red-400/50"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-base font-bold tracking-wider text-white uppercase">
                    {item.label}
                  </h3>
                  {(!item.data || item.data.length === 0) && (
                    <EmptyState text={item.empty} />
                  )}
                </div>
                <span className="ml-4 text-4xl font-light text-red-400">
                  {item.data?.length || 0}
                </span>
              </div>
              {item.data && item.data.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {item.data.map((team: DashboardTeam, idx: number) => (
                    <Link
                      href={`/eventRegistration/${team.eventSlug}`}
                      key={`${team.id}-${idx}`}
                      className="border border-white/30 px-3 py-1.5 font-mono text-xs text-white/70 transition-colors hover:border-red-400 hover:text-white"
                    >
                      {team.name} ({team.event?.name ?? team.eventSlug})
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    
      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 z-300 m-0 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 border border-white/20 bg-black p-0 backdrop:bg-black/80"
        onClick={(e) => {
          // Close modal when clicking on backdrop
          if (e.target === dialogRef.current) {
            closeEditModal();
          }
        }}
      >
        <div className="flex flex-col gap-8 px-8 py-8">
          {/* Header */}
          <div className="flex w-full items-center justify-center gap-4 font-mono text-xs tracking-widest text-white/40">
            <div className="h-px w-12 bg-white/20"></div>
            <span>EDIT PROFILE</span>
            <div className="h-px w-12 bg-white/20"></div>
          </div>

          <h3 className="text-center text-2xl font-bold tracking-tight text-white uppercase">
            Update Information
          </h3>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block font-mono text-xs tracking-widest text-white/50 uppercase"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
                  placeholder="ENTER YOUR NAME"
                />
              </div>
              {/* College */}
              <div>
                <label
                  htmlFor="college"
                  className="mb-2 block font-mono text-xs tracking-widest text-white/50 uppercase"
                >
                  College
                </label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
                  placeholder="ENTER COLLEGE NAME"
                />
              </div>

              {/* Department */}
              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block font-mono text-xs tracking-widest text-white/50 uppercase"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
                  placeholder="ENTER DEPARTMENT"
                />
              </div>

              {/* Year */}
              <div>
                <label
                  htmlFor="year"
                  className="mb-2 block font-mono text-xs tracking-widest text-white/50 uppercase"
                >
                  Graduation Year
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
                  placeholder="ENTER YEAR (e.g., 2025)"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block font-mono text-xs tracking-widest text-white/50 uppercase"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
                  placeholder="ENTER PHONE NUMBER"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 border-t border-white/10 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 border border-red-400 px-6 py-3 text-sm font-bold tracking-wider text-white uppercase transition-all outline-none hover:bg-red-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={isLoading}
                className="flex-1 border border-white/30 px-6 py-3 text-sm font-bold tracking-wider text-white uppercase transition-all outline-none hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Dashboard;
