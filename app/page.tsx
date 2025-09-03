"use client";

import React from "react";

export default function HomePage() {
  return (
    <div className="bg-gray-900 text-white">
      <div className="hero-section min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <img
            src="/logo.png"
            alt="Take Profit Logo"
            className="mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-lg mb-8"
          />

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Welcome to the
            <br />
            <span className="text-blue-300">Leverage Course</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
            New course coming soon, for now you can view at all the VC vods
            where we got a rough idea on how to trade leverage.
          </p>

          <div className="mt-10">
            <a
              href="/course"
              className="start-button inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-200 ease-in-out hover:transform hover:-translate-y-0.5 hover:shadow-xl"
            >
              Start Watching
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          background-image: url("/background.png");
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .hero-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
}
