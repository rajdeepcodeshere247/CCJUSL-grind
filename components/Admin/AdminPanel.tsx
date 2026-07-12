"use client";

import React, { useState, useEffect } from "react";
import {
  getAllEvents,
  upsertLiveEvent,
  addEventUpdate,
  deleteEventUpdate,
  getEventRegistrations,
  deleteEvent,
} from "@/services/AdminEventsService";
import toast from "react-hot-toast";
import { Users, Edit, Trash2, Megaphone, ClipboardList, PlusCircle, Download, RefreshCw } from "lucide-react";

type EventType = {
  id: string;
  slug: string;
  name: string;
  minMembers: number;
  maxMembers: number;
  registrationsOpen: boolean;
  isLive: boolean;
  description: string | null;
  shortDescription: string | null;
  rules: string[];
  poster: string | null;
  prize: string | null;
  coordinators: string[];
  prelimsDate: string[];
  finalsDate: string | null;
  updates: string[];
  format: string | null;
  registrationCloseTime?: Date | string | null;
  registeredMessage?: string | null;
};

const formatDateTimeLocal = (dateInput: Date | string | null | undefined): string => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

interface RegistrationMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  college: string | null;
  department: string | null;
  year: string | null;
}

interface RegistrationPendingMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface RegistrationType {
  id: string;
  name: string;
  eventSlug: string;
  memberIds: string[];
  pendingMemberIds: string[];
  leader: string;
  joiningCode: string;
  members: RegistrationMember[];
  pendingMembers: RegistrationPendingMember[];
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"events" | "announcements" | "participants">("events");
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State for Event CRUD
  const [isEditing, setIsEditing] = useState(false);
  const [formSlug, setFormSlug] = useState("");
  const [formName, setFormName] = useState("");
  const [formMinMembers, setFormMinMembers] = useState(1);
  const [formMaxMembers, setFormMaxMembers] = useState(1);
  const [formRegistrationsOpen, setFormRegistrationsOpen] = useState(true);
  const [formIsLive, setFormIsLive] = useState(true);
  const [formShortDescription, setFormShortDescription] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRules, setFormRules] = useState("");
  const [formPoster, setFormPoster] = useState("");
  const [formPrize, setFormPrize] = useState("");
  const [formCoordinators, setFormCoordinators] = useState("");
  const [formPrelimsDate, setFormPrelimsDate] = useState("");
  const [formFinalsDate, setFormFinalsDate] = useState("");
  const [formFormat, setFormFormat] = useState("Onsite");
  const [formRegistrationCloseTime, setFormRegistrationCloseTime] = useState("");
  const [formRegisteredMessage, setFormRegisteredMessage] = useState("");

  // Announcements State
  const [announcementEventSlug, setAnnouncementEventSlug] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState("");

  // Participants State
  const [participantEventSlug, setParticipantEventSlug] = useState("");
  const [registrations, setRegistrations] = useState<RegistrationType[]>([]);
  const [regsLoading, setRegsLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await getAllEvents();
    if (res.ok && res.events) {
      setEvents(res.events as EventType[]);
      // Set defaults for selects
      if (res.events.length > 0) {
        if (!announcementEventSlug) setAnnouncementEventSlug(res.events[0].slug);
        if (!participantEventSlug) setParticipantEventSlug(res.events[0].slug);
      }
    } else {
      toast.error(res.message || "Failed to load events");
    }
    setLoading(false);
  };

  const handleEditClick = (event: EventType) => {
    setIsEditing(true);
    setFormSlug(event.slug);
    setFormName(event.name);
    setFormMinMembers(event.minMembers);
    setFormMaxMembers(event.maxMembers);
    setFormRegistrationsOpen(event.registrationsOpen);
    setFormIsLive(event.isLive);
    setFormShortDescription(event.shortDescription || "");
    setFormDescription(event.description || "");
    setFormRules(event.rules ? event.rules.join("\n") : "");
    setFormPoster(event.poster || "");
    setFormPrize(event.prize || "");
    setFormCoordinators(event.coordinators ? event.coordinators.join("\n") : "");
    setFormPrelimsDate(event.prelimsDate ? event.prelimsDate.join("\n") : "");
    setFormFinalsDate(event.finalsDate || "");
    setFormFormat(event.format || "Onsite");
    setFormRegistrationCloseTime(event.registrationCloseTime ? formatDateTimeLocal(event.registrationCloseTime) : "");
    setFormRegisteredMessage(event.registeredMessage || "");
  };

  const handleCreateNewClick = () => {
    setIsEditing(true);
    setFormSlug("");
    setFormName("");
    setFormMinMembers(1);
    setFormMaxMembers(1);
    setFormRegistrationsOpen(true);
    setFormIsLive(true);
    setFormShortDescription("");
    setFormDescription("");
    setFormRules("");
    setFormPoster("");
    setFormPrize("");
    setFormCoordinators("");
    setFormPrelimsDate("");
    setFormFinalsDate("");
    setFormFormat("Onsite");
    setFormRegistrationCloseTime("");
    setFormRegisteredMessage("");
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSlug.trim() || !formName.trim()) {
      toast.error("Slug and Name are required");
      return;
    }

    const parsedRules = formRules.split("\n").map(r => r.trim()).filter(Boolean);
    const parsedCoordinators = formCoordinators.split("\n").map(c => c.trim()).filter(Boolean);
    const parsedPrelims = formPrelimsDate.split("\n").map(d => d.trim()).filter(Boolean);

    const data = {
      slug: formSlug.trim(),
      name: formName.trim(),
      minMembers: Number(formMinMembers),
      maxMembers: Number(formMaxMembers),
      registrationsOpen: formRegistrationsOpen,
      isLive: formIsLive,
      description: formDescription.trim() || undefined,
      shortDescription: formShortDescription.trim() || undefined,
      rules: parsedRules,
      poster: formPoster.trim() || undefined,
      prize: formPrize.trim() || undefined,
      coordinators: parsedCoordinators,
      prelimsDate: parsedPrelims,
      finalsDate: formFinalsDate.trim() || undefined,
      format: formFormat,
      registrationCloseTime: formRegistrationCloseTime ? new Date(formRegistrationCloseTime) : null,
      registeredMessage: formRegisteredMessage.trim() || null,
    };

    const res = await upsertLiveEvent(data);
    if (res.ok) {
      toast.success(res.message);
      setIsEditing(false);
      fetchEvents();
    } else {
      toast.error(res.message || "Failed to save event");
    }
  };

  const handleDeleteEvent = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this event? This will remove all registrations associated with it.")) return;
    const res = await deleteEvent(slug);
    if (res.ok) {
      toast.success(res.message);
      fetchEvents();
    } else {
      toast.error(res.message || "Failed to delete event");
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementEventSlug) {
      toast.error("Please select an event");
      return;
    }
    if (!newAnnouncement.trim()) {
      toast.error("Announcement text cannot be empty");
      return;
    }

    const res = await addEventUpdate(announcementEventSlug, newAnnouncement.trim());
    if (res.ok) {
      toast.success(res.message);
      setNewAnnouncement("");
      fetchEvents();
    } else {
      toast.error(res.message || "Failed to add update");
    }
  };

  const handleDeleteAnnouncement = async (slug: string, index: number) => {
    if (!confirm("Delete this announcement?")) return;
    const res = await deleteEventUpdate(slug, index);
    if (res.ok) {
      toast.success(res.message);
      fetchEvents();
    } else {
      toast.error(res.message || "Failed to delete update");
    }
  };

  const loadRegistrations = async (slug: string) => {
    if (!slug) return;
    setRegsLoading(true);
    const res = await getEventRegistrations(slug);
    if (res.ok && res.teams) {
      setRegistrations(res.teams);
    } else {
      toast.error(res.message || "Failed to load registrations");
    }
    setRegsLoading(false);
  };

  useEffect(() => {
    if (activeTab === "participants" && participantEventSlug) {
      loadRegistrations(participantEventSlug);
    }
  }, [participantEventSlug, activeTab]);

  const handleExportCSV = async () => {
    if (!participantEventSlug) return;
    
    setRegsLoading(true);
    const res = await getEventRegistrations(participantEventSlug);
    let latestRegistrations = registrations;
    if (res.ok && res.teams) {
      latestRegistrations = res.teams;
      setRegistrations(res.teams);
    } else {
      toast.error(res.message || "Failed to load latest registrations");
    }
    setRegsLoading(false);

    if (latestRegistrations.length === 0) {
      toast.error("No registrations to export");
      return;
    }

    const headers = [
      "Team Name",
      "Joining Code",
      "Member Role",
      "Participant Name",
      "Email",
      "Phone",
      "College",
      "Department",
      "Year"
    ];

    const rows: string[][] = [];

    latestRegistrations.forEach(team => {
      // Add Leader
      const leaderUser = team.members.find((m: RegistrationMember) => m.id === team.leader);
      if (leaderUser) {
        rows.push([
          team.name,
          team.joiningCode,
          "Leader",
          leaderUser.name || "",
          leaderUser.email || "",
          leaderUser.phone || "",
          leaderUser.college || "",
          leaderUser.department || "",
          leaderUser.year || ""
        ]);
      }

      // Add other members
      team.members.forEach((m: RegistrationMember) => {
        if (m.id !== team.leader) {
          rows.push([
            team.name,
            team.joiningCode,
            "Member",
            m.name || "",
            m.email || "",
            m.phone || "",
            m.college || "",
            m.department || "",
            m.year || ""
          ]);
        }
      });
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registrations_${participantEventSlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedEventAnnouncements = events.find(e => e.slug === announcementEventSlug);

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12">
      {/* Header */}
      <div className="flex w-full items-center justify-center gap-4 pt-8 pb-4 font-mono text-xs tracking-widest text-white/40">
        <div className="h-px w-24 bg-white/20"></div>
        <span>ADMIN CONTROLS</span>
        <div className="h-px w-24 bg-white/20"></div>
      </div>

      <div className="max-w-6xl mx-auto mt-6">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase text-center sm:text-left mb-8">
          CodeClub <span className="text-red-400">Admin Panel</span>
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => { setActiveTab("events"); setIsEditing(false); }}
            className={`flex items-center gap-2 px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "events" ? "border-red-400 text-red-400" : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <ClipboardList size={16} /> Manage Events
          </button>
          <button
            onClick={() => { setActiveTab("announcements"); setIsEditing(false); }}
            className={`flex items-center gap-2 px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "announcements" ? "border-red-400 text-red-400" : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Megaphone size={16} /> Announcements
          </button>
          <button
            onClick={() => { setActiveTab("participants"); setIsEditing(false); }}
            className={`flex items-center gap-2 px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "participants" ? "border-red-400 text-red-400" : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Users size={16} /> Participants
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <span className="font-mono text-white/50 animate-pulse">LOADING DASHBOARD...</span>
          </div>
        )}

        {/* Tab 1: Manage Events */}
        {!loading && activeTab === "events" && (
          <div>
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold tracking-wider uppercase text-white/80">Hosted Events List</h3>
                  <button
                    onClick={handleCreateNewClick}
                    className="flex items-center gap-2 border border-red-400 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all bg-red-400 text-black hover:bg-black hover:text-white"
                  >
                    <PlusCircle size={16} /> Host Live Event
                  </button>
                </div>

                {events.length === 0 ? (
                  <p className="text-white/40 font-mono py-12 text-center border border-dashed border-white/10 rounded-lg">No dynamic events hosted yet. Click &quot;Host Live Event&quot; above to create one.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <div key={event.id} className="border border-white/10 p-6 flex flex-col justify-between hover:border-red-400/50 transition-colors bg-white/[0.01]">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xl font-bold text-white uppercase">{event.name}</h4>
                            <span className={`px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase ${event.isLive ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/40"}`}>
                              {event.isLive ? "Live" : "Inactive"}
                            </span>
                          </div>
                          <p className="font-mono text-xs text-white/40 mb-3">Slug: {event.slug}</p>
                          <p className="text-sm font-light text-white/70 line-clamp-3 mb-6">
                            {event.shortDescription || "No description set yet."}
                          </p>

                          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 font-mono text-[10px] text-white/60 mb-4">
                            <div>
                              <span className="block text-white/40">REGISTRATION:</span>
                              <span className={event.registrationsOpen ? "text-emerald-400" : "text-red-400"}>
                                {event.registrationsOpen ? "Open" : "Closed"}
                              </span>
                            </div>
                            <div>
                              <span className="block text-white/40">TEAM SIZE:</span>
                              <span>{event.minMembers} - {event.maxMembers}</span>
                            </div>
                            <div>
                              <span className="block text-white/40">PRIZE:</span>
                              <span className="truncate block">{event.prize || "None"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-2">
                          <button
                            onClick={() => handleEditClick(event)}
                            className="flex-1 flex items-center justify-center gap-1.5 border border-white/20 hover:border-white py-2 text-xs font-bold tracking-wider uppercase text-white/80 hover:text-white"
                          >
                            <Edit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.slug)}
                            className="flex items-center justify-center border border-red-500/30 hover:border-red-500 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-500 uppercase"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Event Create/Edit Form
              <div className="border border-white/10 p-8 bg-white/[0.01]">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold tracking-wider uppercase text-red-400">
                    {formSlug ? `Edit Event: ${formName}` : "Create New Event"}
                  </h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveEvent} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic details */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Event Slug *</label>
                      <input
                        type="text"
                        disabled={!!formSlug}
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="e.g. tensor-on-the-turfs"
                        className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400 disabled:opacity-50"
                      />
                      <p className="text-[10px] text-white/30 font-mono">Unique URL identifier. Cannot be edited once created.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Event Name *</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Tensor on the Turfs"
                        className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Min Team Members</label>
                      <input
                        type="number"
                        min={1}
                        value={formMinMembers}
                        onChange={(e) => setFormMinMembers(Number(e.target.value))}
                        className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Max Team Members</label>
                      <input
                        type="number"
                        min={1}
                        value={formMaxMembers}
                        onChange={(e) => setFormMaxMembers(Number(e.target.value))}
                        className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      />
                    </div>

                    {/* Toggle Settings */}
                    <div className="flex items-center gap-8 py-3 px-4 border border-white/5 bg-white/[0.02]">
                      <label className="flex items-center gap-3 cursor-pointer text-sm font-mono tracking-wide text-white/70">
                        <input
                          type="checkbox"
                          checked={formRegistrationsOpen}
                          onChange={(e) => setFormRegistrationsOpen(e.target.checked)}
                          className="h-4 w-4 accent-red-400 cursor-pointer"
                        />
                        Registrations Open
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer text-sm font-mono tracking-wide text-white/70">
                        <input
                          type="checkbox"
                          checked={formIsLive}
                          onChange={(e) => setFormIsLive(e.target.checked)}
                          className="h-4 w-4 accent-red-400 cursor-pointer"
                        />
                        Is Live Event
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Prize Pool Description</label>
                      <input
                        type="text"
                        value={formPrize}
                        onChange={(e) => setFormPrize(e.target.value)}
                        placeholder="e.g. Total Pool: 1000/-"
                        className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Poster Image filename *</label>
                      <input
                        type="text"
                        value={formPoster}
                        onChange={(e) => setFormPoster(e.target.value)}
                        placeholder="e.g. ../events/tensor-on-the-turfs-qr.webp"
                        className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      />
                      <p className="text-[10px] text-white/30 font-mono">Place posters in public/images/events/ and use path syntax: ../events/filename.webp</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Finals Date / Time info</label>
                      <input
                        type="text"
                        value={formFinalsDate}
                        onChange={(e) => setFormFinalsDate(e.target.value)}
                        placeholder="e.g. 15th July 2026 at 7:30 P.M."
                        className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Event Format</label>
                      <select
                        value={formFormat}
                        onChange={(e) => setFormFormat(e.target.value)}
                        className="w-full border border-white/20 bg-black px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      >
                        <option value="Onsite">Onsite</option>
                        <option value="Online">Online</option>
                        <option value="Online/Onsite">Online/Onsite</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Registration Close Time (Deadline)</label>
                      <input
                        type="datetime-local"
                        value={formRegistrationCloseTime}
                        onChange={(e) => setFormRegistrationCloseTime(e.target.value)}
                        className="w-full border border-white/20 bg-black px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      />
                      <p className="text-[10px] text-white/30 font-mono">Optional. Automatically closes registration when this time is reached.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Preliminaries Schedule Dates (one per line)</label>
                      <textarea
                        rows={3}
                        value={formPrelimsDate}
                        onChange={(e) => setFormPrelimsDate(e.target.value)}
                        placeholder="e.g. 13th July 2026 (Round 1)"
                        className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Coordinators (one per line)</label>
                      <textarea
                        rows={3}
                        value={formCoordinators}
                        onChange={(e) => setFormCoordinators(e.target.value)}
                        placeholder="e.g. Ankit Kundu [6295529281]"
                        className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Short Description (1-2 sentences)</label>
                    <textarea
                      rows={2}
                      value={formShortDescription}
                      onChange={(e) => setFormShortDescription(e.target.value)}
                      placeholder="A short tagline or overview shown on card grid list."
                      className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                    />
                  </div>

                  {/* Formatting Help Guide */}
                  <div className="col-span-2 border border-red-500/20 bg-red-500/[0.02] p-4 text-xs space-y-2 font-mono">
                    <p className="font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span>💡 Rich Formatting Guide</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/60">
                      <div>
                        <p><span className="text-white font-bold">**text**</span> &rarr; <strong className="font-bold text-white">bold</strong></p>
                        <p><span className="text-white font-bold">*text*</span> &rarr; <em className="italic text-white/95">italics</em></p>
                        <p><span className="text-white font-bold">__text__</span> &rarr; <span className="underline decoration-red-400">underline</span></p>
                      </div>
                      <div>
                        <p><span className="text-white font-bold">==text==</span> &rarr; <mark className="bg-red-400/20 text-red-300 font-semibold px-1 rounded border border-red-500/20">highlight</mark></p>
                        <p><span className="text-white font-bold">Double Enter</span> &rarr; New Paragraph</p>
                        <p><span className="text-white font-bold">Single Enter</span> &rarr; Line Break</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Event Description / About Paragraphs (separated by newlines)</label>
                    <textarea
                      rows={5}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Detailed content paragraphs about what this event is."
                      className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Rules & Guidelines (one per line)</label>
                    <textarea
                      rows={4}
                      value={formRules}
                      onChange={(e) => setFormRules(e.target.value)}
                      placeholder="e.g. Respect other contestants. All decisions are final."
                      className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Registered Candidates Message & Links (only visible on registration panel)</label>
                    <textarea
                      rows={4}
                      value={formRegisteredMessage}
                      onChange={(e) => setFormRegisteredMessage(e.target.value)}
                      placeholder="e.g. HackerEarth Contest Link: https://hackerearth.com/tensor-on-the-turfs-prelims"
                      className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                    />
                    <p className="text-[10px] text-white/30 font-mono">Only shown to registered candidates on their registration panel. URLs will automatically become clickable links.</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex gap-4">
                    <button
                      type="submit"
                      className="border border-red-400 bg-red-400 text-black px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all hover:bg-black hover:text-white"
                    >
                      {formSlug ? "Update Event" : "Create Event"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="border border-white/30 px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Announcements */}
        {!loading && activeTab === "announcements" && (
          <div className="space-y-8 border border-white/10 p-8 bg-white/[0.01]">
            <h3 className="text-xl font-bold tracking-wider uppercase text-white/80 mb-4">Post Updates / Announcements</h3>

            <div className="space-y-4 max-w-xl">
              <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Select Target Event</label>
              <select
                value={announcementEventSlug}
                onChange={(e) => setAnnouncementEventSlug(e.target.value)}
                className="w-full border border-white/20 bg-black px-4 py-3 text-white transition-colors outline-none focus:border-red-400"
              >
                <option value="">-- Choose Event --</option>
                {events.map((e) => (
                  <option key={e.id} value={e.slug}>{e.name}</option>
                ))}
              </select>
            </div>

            {announcementEventSlug && (
              <form onSubmit={handleAddAnnouncement} className="space-y-4 max-w-xl pt-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">New Announcement Text</label>
                  <textarea
                    rows={3}
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    placeholder="e.g. Round 1 starts at 7:30 P.M. sharp tonight. Details sent via mail."
                    className="w-full border border-white/20 bg-transparent px-4 py-3 font-light text-white transition-colors outline-none focus:border-red-400"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 border border-red-400 px-6 py-3 text-sm font-bold tracking-widest uppercase transition-all bg-red-400 text-black hover:bg-black hover:text-white"
                >
                  <Megaphone size={14} /> Publish Announcement
                </button>
              </form>
            )}

            {/* List of current announcements */}
            {selectedEventAnnouncements && (
              <div className="pt-8 border-t border-white/10">
                <h4 className="font-mono text-sm tracking-widest text-white/60 mb-4 uppercase">
                  Current Announcements ({selectedEventAnnouncements.updates?.length || 0})
                </h4>

                {(!selectedEventAnnouncements.updates || selectedEventAnnouncements.updates.length === 0) ? (
                  <p className="text-white/40 text-sm font-light">No updates published for this event yet.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedEventAnnouncements.updates.map((update, idx) => (
                      <div key={idx} className="flex justify-between items-start border border-white/10 p-4 bg-black/50">
                        <p className="text-sm font-light text-white/80 leading-relaxed pr-6">{update}</p>
                        <button
                          onClick={() => handleDeleteAnnouncement(selectedEventAnnouncements.slug, idx)}
                          className="text-red-400 hover:text-red-500 p-1 font-mono text-[10px] uppercase border border-red-500/20 hover:border-red-500 tracking-wider"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: View Registrations */}
        {!loading && activeTab === "participants" && (
          <div className="space-y-8 border border-white/10 p-8 bg-white/[0.01]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2 w-full max-w-xl">
                <label className="block text-xs font-mono tracking-wider text-white/50 uppercase">Select Target Event</label>
                <select
                  value={participantEventSlug}
                  onChange={(e) => setParticipantEventSlug(e.target.value)}
                  className="w-full border border-white/20 bg-black px-4 py-3 text-white transition-colors outline-none focus:border-red-400"
                >
                  <option value="">-- Choose Event --</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.slug}>{e.name}</option>
                  ))}
                </select>
              </div>

              {participantEventSlug && (
                <div className="flex gap-3 self-end sm:self-center">
                  <button
                    onClick={() => loadRegistrations(participantEventSlug)}
                    disabled={regsLoading}
                    className="flex items-center gap-2 border border-white/20 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-all bg-transparent text-white hover:bg-white hover:text-black disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={regsLoading ? "animate-spin" : ""} /> Refresh
                  </button>
                  {registrations.length > 0 && (
                    <button
                      onClick={handleExportCSV}
                      disabled={regsLoading}
                      className="flex items-center gap-2 border border-emerald-500 px-6 py-3 text-sm font-bold tracking-widest uppercase transition-all bg-emerald-500 text-black hover:bg-black hover:text-white disabled:opacity-50"
                    >
                      <Download size={14} /> Export to CSV
                    </button>
                  )}
                </div>
              )}
            </div>

            {participantEventSlug && (
              <div className="pt-4">
                {regsLoading ? (
                  <p className="font-mono text-xs text-white/40 animate-pulse">FETCHING PARTICIPANT LIST...</p>
                ) : (
                  <>
                    <h4 className="font-mono text-sm tracking-widest text-white/60 mb-6 uppercase">
                      Registered Teams ({registrations.length})
                    </h4>

                    {registrations.length === 0 ? (
                      <p className="text-white/40 text-sm font-light py-8 border border-dashed border-white/10 text-center">No participants registered for this event yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {registrations.map((team) => {
                          const leader = team.members.find((m: RegistrationMember) => m.id === team.leader);
                          return (
                            <div key={team.id} className="border border-white/10 p-6 bg-black/40">
                              <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4">
                                <div>
                                  <h5 className="text-lg font-bold text-white uppercase">{team.name}</h5>
                                  <p className="font-mono text-[10px] text-white/40">Joining Code: {team.joiningCode}</p>
                                </div>
                                <span className="font-mono text-xs text-red-400 bg-red-400/10 px-2.5 py-1">
                                  {team.members.length} Member(s)
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                {/* Leader */}
                                <div className="border border-white/5 p-4 bg-white/[0.01]">
                                  <p className="font-mono text-[10px] text-red-400 mb-2 uppercase tracking-widest">Team Leader</p>
                                  {leader ? (
                                    <div className="space-y-1">
                                      <p className="font-bold text-white">{leader.name}</p>
                                      <p className="text-xs text-white/60">{leader.email}</p>
                                      <p className="text-xs text-white/60 font-mono">Ph: {leader.phone || "N/A"}</p>
                                      <p className="text-[11px] text-white/40 pt-1 leading-tight">
                                        {leader.college} - {leader.department} ({leader.year} Year)
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-white/40">Leader details unavailable</p>
                                  )}
                                </div>

                                {/* Other Members */}
                                <div className="border border-white/5 p-4 bg-white/[0.01]">
                                  <p className="font-mono text-[10px] text-white/40 mb-2 uppercase tracking-widest">Other Members</p>
                                  {team.members.filter((m: RegistrationMember) => m.id !== team.leader).length === 0 ? (
                                    <p className="text-xs text-white/40 font-light italic">No other members in this team.</p>
                                  ) : (
                                    <div className="space-y-3">
                                      {team.members
                                        .filter((m: RegistrationMember) => m.id !== team.leader)
                                        .map((member: RegistrationMember) => (
                                          <div key={member.id} className="border-t border-white/5 pt-2 first:border-0 first:pt-0">
                                            <p className="font-bold text-white text-xs">{member.name}</p>
                                            <p className="text-[11px] text-white/50">{member.email}</p>
                                            <p className="text-[11px] text-white/50 font-mono">Ph: {member.phone || "N/A"}</p>
                                            <p className="text-[10px] text-white/40">
                                              {member.college} - {member.department}
                                            </p>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
