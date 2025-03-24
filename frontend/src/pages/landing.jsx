import {Link} from "react-router-dom";
import {useEffect} from "react";

function Landing() {
    useEffect(() => {
        document
            .body
            .classList
            .add("overflow-hidden");
        return () => document
            .body
            .classList
            .remove("overflow-hidden");
    }, []);

    return (
        <div
            className="flex flex-col items-center justify-center h-screen px-6">
            <header className="text-center mb-12">
                <p className="fancy-font text-primary text-7xl">
                    Lesson Linker
                </p>
                <p className="text-lg text-secondary mt-3 max-w-lg mx-auto">
                    Linking learners and educators with seamless connectivity.
                </p>
            </header>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                    to="/login"
                    className="btn-primary-outlined px-8 py-3 text-lg font-medium rounded-md border">
                    Login
                </Link>

                <Link
                    to="/register"
                    className="btn-primary-outlined px-8 py-3 text-lg font-medium rounded-md border">
                    Register
                </Link>
            </div>

            <footer className="absolute text-secondary bottom-6 text-sm">
                &copy; {new Date().getFullYear()}
                Lesson Linker. All rights reserved.
            </footer>
        </div>
    );
}

export default Landing;
