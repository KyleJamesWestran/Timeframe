import React, { useEffect } from "react";
import SupportSection from "./Help";
import FaqSection from "./FAQ";
import UploadSection from "./Upload.jsx";

const HomePage = () => {
    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL)
            .then(() => console.log('Backend wake-up ping sent.'))
            .catch(err => console.error('Error waking backend:', err));
    }, []);

    return (
        <div className="bg-white">
            <section className="min-h-screen flex flex-col md:flex-row px-6 md:px-10">
                {/* Left Side */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center py-10">
                    <div>
                        <p className="text-6xl md:text-8xl font-bold text-rose-600 mb-2 fancy-font">Timeframe</p>
                        <h2 className="text-sm font-bold text-gray-800 main-font">By Kyle Westran</h2>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center py-10">
                    <div className="max-w-md px-4 md:px-0">
                        <p className="text-md text-gray-700 main-font mb-3">
                            Manually building school timetables is a complex, time-consuming task. Juggling room availability, teacher schedules, and course conflicts often takes days or even a month to finalize. <strong className="fancy-font me-1">Timeframe</strong> simplifies all of that.
                        </p>
                        <p className="text-md text-gray-700 main-font mb-3">
                            Powered by a high-performance algorithm built specifically for speed and precision,
                            <strong className="fancy-font mx-1">Timeframe</strong> can generate fully optimized, clash-free timetables in seconds—not weeks. 
                            </p>
                        <p className="text-md text-gray-700 main-font mb-3">
                            Just provide a few key details, and let our system do the heavy lifting. No more spreadsheet headaches. No more endless revisions. Just fast, accurate, effortless scheduling.
                        </p>
                        <p className="text-md text-gray-700 main-font mb-3">
                            <span>
                                <a
                                    href="#upload"
                                    className="!text-rose-600 text-lg !font-black !underline main-font me-1">
                                    GET STARTED
                                </a>
                            </span>
                            today and take back your time.
                        </p>
                    </div>
                </div>
            </section>

            <UploadSection />
            {/* <SupportSection /> */}
            {/* <FaqSection /> */}
        </div>
    );
};

export default HomePage;
