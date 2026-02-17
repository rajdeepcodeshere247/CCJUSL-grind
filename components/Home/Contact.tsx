import Link from "next/link";
import React from "react";

function Contact() {
  return (
    <div id="contact" className="absolute flex w-full flex-col items-center bg-black p-12 pb-0">
      <h1 className="text-6xl lg:text-8xl font-bold uppercase text-center">Contact Us</h1>
      <div className="grid w-full place-items-center sm:grid-cols-2 gap-x-8">
        <iframe
          style={{
            borderRadius: "4px",
            marginBlock: "2rem",
            justifySelf: "center",
          }}
          height="400"
          className="w-full lg:w-[70%]"
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Jadavpur%20University,%20Salt%20Lake%20Campus+(CodeClub%20JUSL)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        ></iframe>

        <div className="flex w-full lg:w-1/2 flex-col gap-y-4 lg:gap-y-12 mb-4">
          <div className="flex flex-col gap-y-1">
            <h3 className="font-semibold uppercase text-xl text-red-400">Address</h3>
            <p className="font-medium">Plot No.8, B-73-80, Salt Lake Bypass, LB Block, Sector 3, Bidhannagar, Kolkata, West Bengal 700106</p>
          </div>
          <div className="flex flex-col gap-y-1">
            <h3 className="font-semibold uppercase text-xl text-red-400">Email</h3>
            <Link href={"mailto:codeclubjusl@gmail.com"} className="font-medium">codeclubjusl@gmail.com</Link>
          </div>
          <div className="flex flex-col gap-y-2">
            <h3 className="font-semibold uppercase text-xl text-red-400">Socials</h3>
            <div className="flex justify-between font-medium uppercase">
              <Link href={"https://www.linkedin.com/company/codeclub-jusl/"} target="_blank">Linkedin</Link>
              <Link href={"https://youtube.com/@codeclubjusl"} target="_blank">Youtube</Link>
              <Link href={"https://www.instagram.com/jusl_codeclub"} target="_blank">Instagram</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="grid h-full w-full lg:grid-cols-2 place-items-center border-t border-t-gray-300/50 py-8">
        <h1 className="text-3xl lg:text-6xl 2xl:text-8xl font-semibold text-center">CodeClub JUSL</h1>
        <nav className="flex flex-col gap-y-1 lg:gap-y-3 text-center text-lg lg:text-xl 2xl:font-medium tracking-wide uppercase pt-3">
          <Link href={"/"}>Home</Link>
          <Link href={"/#events"}>Events</Link>
        </nav>
      </footer>
        <p className="border-t border-t-gray-300/50 text-center w-full py-3 uppercase text-xs">&copy; 2025 - CodeClub JUSL. All rights reserved.</p>
    </div>
  );
}

export default Contact;
