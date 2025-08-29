import Link from "next/link";
import React from "react";

function Contact() {
  return (
    <div className="font-jetbrains-mono absolute flex h-screen w-full flex-col items-center bg-black p-12 pb-0">
      <h1 className="text-8xl font-bold uppercase">Contact Us</h1>
      <div className="grid w-full place-items-center sm:grid-cols-2">
        <iframe
          style={{
            borderRadius: "4px",
            marginBlock: "4rem",
            justifySelf: "center",
          }}
          width="70%"
          height="400"
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Jadavpur%20University,%20Salt%20Lake%20Campus+(CodeClub%20JUSL)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        ></iframe>
        <div className="flex w-1/2 flex-col gap-y-12">
          <div className="flex flex-col gap-y-1">
            <h3 className="font-semibold uppercase text-xl text-gray-400">Address</h3>
            <p className="font-medium">Plot No.8, B-73-80, Salt Lake Bypass, LB Block, Sector 3, Bidhannagar, Kolkata, West Bengal 700106</p>
          </div>
          <div className="flex flex-col gap-y-1">
            <h3 className="font-semibold uppercase text-xl text-gray-400">Email</h3>
            <Link href={"mailto:codeclubjusl@gmail.com"} className="font-medium">codeclubjusl@gmail.com</Link>
          </div>
          <div className="flex flex-col gap-y-2">
            <h3 className="font-semibold uppercase text-xl text-gray-400">Socials</h3>
            <div className="flex justify-between font-medium uppercase">
              <Link href={""}>Instagram</Link>
              <Link href={""}>Linkedin</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="grid h-full w-full grid-cols-2 place-items-center border-t border-t-gray-300/50 pt-4">
        <h1 className="text-8xl font-semibold">CodeClub JUSL</h1>
        <nav className="flex flex-col gap-y-3 text-center text-xl font-medium tracking-wide uppercase">
          <Link href={"/"}>Home</Link>
          <Link href={"/#about"}>About</Link>
          <Link href={"/events"}>Events</Link>
        </nav>
      </footer>
        <p className="border-t border-t-gray-300/50 text-center w-full py-3 uppercase text-sm">&copy; 2025 - CodeClub JUSL. All rights reserved.</p>
    </div>
  );
}

export default Contact;
