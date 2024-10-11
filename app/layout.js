"use client"
import localFont from "next/font/local";
import "./globals.css";
import { useState } from "react";
import ProjectsContext from "@/contexts/project/projectsContext";
import "bootstrap/dist/css/bootstrap.min.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({ children }) {

  const [projects, setProjects] = useState({});

  const updateProjects = async (newProjects) => {
    setProjects(newProjects);
    // let res = await fetch("api/getData", {method: "GET"});
  }


  return (
    <html lang="en">
      <ProjectsContext.Provider value={{projects, updateProjects}}>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </ProjectsContext.Provider>
    </html>
  );
}
