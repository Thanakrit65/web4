"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";
import NextLogo from '../../../public/CovidLogo.png'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const [date, setDate] = useState("");
  const [fips, setFips] = useState("");
  const [case_, setCase] = useState("");
  const [death, setDeath] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const [success, setSuccess] = useState("");

  if (!session) redirect("/login");
  console.log(session.user.email)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = session.user.email;
      console.log("up")
      const res = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, fips, case_, death, email})
    });
    
    if (res.ok) {
        setError("");
        setSuccess("Update data successfully!");
        e.target.reset(); // Clears the form
    } else {
        setError("Update data failed.");
    }
    } catch (error) {
      console.error("Error during updating: ", error);
      setError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <main>
      <Container>
        <Navbar session={session} />
        <div className="flex-grow text-center p-10">
          <h3 className="text-5xl">Welcome, {session?.user?.name}</h3>
          <p className="text-2xl mt-3">Your email address: {session?.user?.email}</p>
        </div>
  
        <hr className="my-3" />
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col items-center"> {/* Center the form items */}
          <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min="2020-01-01" max="2024-12-31"
              className="narrow-input my-2"
          />
          <input
            type="text"
            onChange={(e) => setFips(e.target.value)}
            className="narrow-input bg-gray-200 border py-2 px-3 rounded text-lg my-2"
            placeholder="Fips Code"
          />
          <input
            type="number"
            onChange={(e) => setCase(e.target.value)}
            className="narrow-input bg-gray-200 border py-2 px-3 rounded text-lg my-2"
            placeholder="Enter number of cases"
          />
          <input
            type="number"
            onChange={(e) => setDeath(e.target.value)}
            className="narrow-input bg-gray-200 border py-2 px-3 rounded text-lg my-2"
            placeholder="Enter number of deaths"
          />
          <button
            type="submit"
            className="bg-[#73C088] text-white py-2 px-4 rounded-md hover:bg-[#459866] transition-colors duration-300"
          >
            Submit
          </button>
        </form>
        <hr className="my-3" />
        <Footer />
      </Container>
    </main>
  );
  
}