import React from 'react';
import {PDFViewer} from '@react-pdf/renderer';
import TimetablePDF from './TimetablePDF'; // Adjust path as needed

const TimetablePreview = ({data}) => {
    return (
        <div className="w-full h-full">
            <PDFViewer width="100%" height="100%">
                <TimetablePDF data={data}/>
            </PDFViewer>
        </div>
    );
};

export default TimetablePreview;