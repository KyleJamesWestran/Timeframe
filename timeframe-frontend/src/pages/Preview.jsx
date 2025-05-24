import React, {useState, useRef} from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import '../assets/components/css/Preview.css';
import {PDFDownloadLink} from '@react-pdf/renderer';
import TimetablePDF from './TimetablePDF'; // adjust the path if needed
import TimetablePreview from "./TimetablePreview";

const PreviewModal = ({isOpen, onClose, data}) => {
    if (!isOpen) 
        return null;
    
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-6">
            <div
                className="bg-white rounded-lg max-w-6xl w-full flex flex-col h-[95vh]"
                onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 h-16 flex items-center">
                    <h2 className="text-2xl font-bold text-black text-center w-full">Timetables</h2>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-4 overflow-y-auto flex-grow min-h-0">
                    <TimetablePreview data={data}/>
                </div>

                {/* Modal Footer */}
                <div
                    className="px-6 py-4 border-t border-gray-200 flex justify-center space-x-4 h-20">
                    <PDFDownloadLink
                        document={< TimetablePDF data = {
                        data
                    } />}
                        fileName="all-timetables.pdf">
                        {({loading}) => (
                            <button
                                className="px-6 py-2 !bg-rose-500 text-white rounded hover:!bg-rose-600 transition"
                                disabled={loading}>
                                {loading
                                    ? 'Preparing PDF...'
                                    : 'Download PDF of All'}
                            </button>
                        )}
                    </PDFDownloadLink>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 !bg-rose-500 text-white rounded hover:!bg-rose-600 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>

    );
};

export default PreviewModal;
