"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { editUserDetails } from "@/services/UserService";
import z from "zod";

type EditProfileData = {
  name: string;
  college: string;
  department: string;
  year: string;
  phone: string;
};

type EditProfileDialogProps = {
  initialData: EditProfileData;
};

const RegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .length(10, "Phone number must be 10 digits long")
    .regex(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
      "Invalid phone number",
    ),
  college: z.string().min(1, "College is required"),
  year: z.string().min(1, "Year of Study is required"),
  department: z.string().min(1, "Department is required"),
});

function EditProfileDialog({ initialData }: EditProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EditProfileData>(initialData);
  const [errors, setErrors] = useState<EditProfileData>({
    name: "",
    phone: "",
    college: "",
    department: "",
    year: "",
  });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const open = () => {
    setFormData(initialData);
    dialogRef.current?.showModal();
  };

  const close = () => {
    dialogRef.current?.close();
    setFormData(initialData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setErrors({
      name: "",
      phone: "",
      college: "",
      department: "",
      year: "",
    });
    const isValid = RegistrationSchema.safeParse(formData);
    if (!isValid.success) {
      isValid.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          setErrors((oldErrors) => ({
            ...oldErrors,
            [issue.path[0]]: issue.message,
          }));
        }
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await editUserDetails(formData);
      if (!response.ok) {
        toast.error("Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
        router.refresh();
        close();
      }
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fields: {
    id: keyof EditProfileData;
    label: string;
    type: string;
    placeholder: string;
  }[] = [
    { id: "name", label: "Name", type: "text", placeholder: "ENTER YOUR NAME" },
    {
      id: "college",
      label: "College",
      type: "text",
      placeholder: "ENTER COLLEGE NAME",
    },
    {
      id: "department",
      label: "Department",
      type: "text",
      placeholder: "ENTER DEPARTMENT",
    },
    {
      id: "year",
      label: "Graduation Year",
      type: "text",
      placeholder: "ENTER YEAR (e.g., 2025)",
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "ENTER PHONE NUMBER",
    },
  ];

  return (
    <>
      <button
        onClick={open}
        className="cursor-pointer border border-red-400 px-10 py-3 text-sm font-bold tracking-widest whitespace-nowrap uppercase transition-all hover:bg-red-400 hover:text-black"
      >
        Edit Profile
      </button>

      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 z-300 m-0 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 border border-white/20 bg-black p-0 backdrop:bg-black/80"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="flex flex-col gap-8 px-8 py-8">
          <span tabIndex={0} className="sr-only" />
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
              {fields.map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="mb-2 block font-mono text-xs tracking-widest text-white/50 uppercase"
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id]}
                    onChange={handleInputChange}
                    className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
                    placeholder={placeholder}
                  />
                  <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
                </div>
              ))}
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
                onClick={close}
                disabled={isLoading}
                className="flex-1 border border-white/30 px-6 py-3 text-sm font-bold tracking-wider text-white uppercase transition-all outline-none hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default EditProfileDialog;
