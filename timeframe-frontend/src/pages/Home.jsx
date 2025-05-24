import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import SupportSection from "./Help";
import FaqSection from "./FAQ";
import UploadSection from "./Upload.jsx";

const HomePage = () => {
    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL)
            .then(res => console.log('Backend wake-up ping sent.'))
            .catch(err => console.error('Error waking backend:', err));
    }, []);
    return (
        <div className="bg-white">
            <section className="h-screen flex px-10">
                {/* Left Side */}
                <div className="w-1/2 flex flex-col justify-center items-center text-center">
                    <div>
                        <p className="text-8xl font-bold text-rose-600 mb-2 fancy-font">Timeframe</p>
                        <h2 className="text-sm font-bold text-gray-800 main-font">By Kyle Westran</h2>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-1/2 flex flex-col justify-center items-center">
                    <div className="max-w-md">
                        <p className="text-md text-gray-700 p-8 main-font">
                            Are you tired of spending weeks creating timetables manually? Say goodbye to the
                            hassle.
                            <strong className="fancy-font mx-1">
                                Timeframe
                            </strong>
                            uses a high-performance algorithm designed for one thing...
                            <em className="filled-font mx-1">
                                speed
                            </em>. What used to take days or even a month can now be done in seconds. With
                            just a bit of input from you, we generate a fully optimized, clash-free
                            timetable fast, accurate, and effortless.
                            <span>
                                <a
                                    href="#upload"
                                    className="!text-rose-600 text-lg !font-black !underline main-font mx-1">GET STARTED</a>
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            <UploadSection/> {/* <SupportSection/> */}

            {/* <FaqSection/> */}
        </div>
    );
};

export default HomePage;
