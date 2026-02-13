"use client";

import { signOut } from 'next-auth/react';
import React from 'react';
import { User } from '@/types/user';

function Dashboard({ user }: { user: User }) {
  const handleLogout = () => {
    signOut({
      redirectTo: "/login",
    });
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="w-full flex items-center gap-4 my-4">
      <h2 className="text-xl text-yellow whitespace-nowrap">{title}</h2>
      <div className="h-px w-full bg-yellow/20"></div>
    </div>
  );

  const EmptyState = ({ text }: { text: string }) => (
    <p className="text-white/30 italic text-sm">{text}</p>
  );

  return (
    <div className="relative isolate flex flex-col items-center justify-center gap-10 p-6 md:p-12 min-h-[80vh] h-fit text-white">

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full max-w-5xl">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-2 border-yellow overflow-hidden bg-white/10 flex items-center justify-center">
            {user.image ? (
              <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-yellow">
                {user.name ? user.name[0] : "?"}
              </span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-red text-xs px-2 py-1 rounded-full text-white border border-black uppercase">
            {user.role || "Guest"}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-semibold text-yellow mb-2 uppercase tracking-tighter">
            {user.name || "Anonymous User"}
          </h1>
          <p className="text-white/60 font-mono tracking-widest">
            {user.email || "No email linked"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red hover:bg-red/70 px-8 py-2 text-sm relative z-20 cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="md:col-span-2 space-y-8">
          <section>
            <SectionHeader title="Academic Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-xs text-white/40 uppercase mb-1">College</p>
                <p className="text-lg">{user.college || <EmptyState text="No college specified" />}</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-xs text-white/40 uppercase mb-1">Department</p>
                <p className="text-lg">{user.department || <EmptyState text="No department listed" />}</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-xs text-white/40 uppercase mb-1">Graduation Year</p>
                <p className="text-lg">{user.year || <EmptyState text="N/A" />}</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-xs text-white/40 uppercase mb-1">Phone</p>
                <p className="text-lg">{user.phone || <EmptyState text="No contact added" />}</p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader title="Activity" />
            <div className="space-y-4">
              {[
                { label: "My Teams", data: user.teamIds, color: "from-blue-500", empty: "Not part of any teams yet" },
                { label: "Pending Requests", data: user.pendingTeamIds, color: "from-orange", empty: "No pending invitations" },
                { label: "Workshops", data: user.workshopIds, color: "from-green-500", empty: "No workshops registered" },
                { label: "Wishlist", data: user.wishlistedEventIds, color: "from-red", empty: "Your wishlist is empty" }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white/5 border-l-4 border-l-yellow rounded-r-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold uppercase tracking-wider">{item.label}</span>
                    <span className="text-2xl text-yellow">{item.data?.length || 0}</span>
                  </div>
                  {(!item.data || item.data.length === 0) && (
                    <div className="mt-2 text-xs">
                      <EmptyState text={item.empty} />
                    </div>
                  )}
                  {item.data && item.data.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.data.map((id: string | number) => (
                        <span key={id} className="text-[10px] bg-white/10 px-2 py-1 rounded border border-white/5 font-mono">
                          {id}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="p-6 bg-white/5 border border-yellow/20 rounded-2xl">
            <h3 className="text-yellow mb-4 uppercase tracking-widest">Security</h3>
            <button className="w-full py-2 border border-yellow/50 text-yellow text-xs uppercase hover:bg-yellow hover:text-black transition-all cursor-pointer">
              Edit Profile
            </button>
          </div>

          <div className="p-6 bg-linear-to-br from-red/20 to-orange/20 border border-red/30 rounded-2xl text-center">
            <p className="text-xs uppercase text-white/60 mb-2">Member Since</p>
            <p className="text-sm">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : "Date Unknown"}
            </p>
          </div>
        </aside>
      </div>

      <div className="relative z-10 flex w-full max-w-5xl items-center justify-between gap-6 opacity-30 mt-auto">
        <div className="h-px w-full bg-linear-to-r from-red to-orange"></div>
        <p className="text-xs">END</p>
        <div className="h-px w-full bg-linear-to-l from-red to-orange"></div>
      </div>
    </div>
  );
}

export default Dashboard;