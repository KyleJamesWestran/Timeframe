import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/Home';
import { Toaster } from 'react-hot-toast';
import TimetablePreview from './pages/TimetablePreview';

const mockData = {
  days: ["Sunday", "Tuesday", "Wednesday", "Friday", "Saturday"],
  periods_per_day: 5,
  teacher_timetables: {
    "Kyle Westran": {
      Sunday: [
        { period: 1, subject: "Maths", class: "Grade 9A" },
        { period: 3, subject: "Maths", class: "Grade 12A" },
        { period: 4, subject: "Maths", class: "Grade 10A" },
        { period: 5, subject: "Maths", class: "Grade 11A" }
      ],
      Tuesday: [
        { period: 1, subject: "Maths", class: "Grade 8A" },
        { period: 3, subject: "Maths", class: "Grade 11A" },
        { period: 4, subject: "Maths", class: "Grade 9A" },
        { period: 5, subject: "Maths", class: "Grade 12A" }
      ],
      Wednesday: [
        { period: 1, subject: "Maths", class: "Grade 10A" },
        { period: 2, subject: "Maths", class: "Grade 9A" },
        { period: 3, subject: "Maths", class: "Grade 8A" },
        { period: 5, subject: "Maths", class: "Grade 12A" }
      ],
      Friday: [
        { period: 1, subject: "Maths", class: "Grade 12A" },
        { period: 2, subject: "Maths", class: "Grade 10A" },
        { period: 3, subject: "Maths", class: "Grade 9A" },
        { period: 4, subject: "Maths", class: "Grade 11A" },
        { period: 5, subject: "Maths", class: "Grade 8A" }
      ],
      Saturday: [
        { period: 1, subject: "Maths", class: "Grade 8A" },
        { period: 2, subject: "Maths", class: "Grade 11A" },
        { period: 4, subject: "Maths", class: "Grade 12A" },
        { period: 5, subject: "Maths", class: "Grade 10A" }
      ]
    },
    "Tyler Westran": {
      Sunday: [
        { period: 1, subject: "Science", class: "Grade 11A" }
      ],
      Tuesday: [
        { period: 1, subject: "Science", class: "Grade 12A" },
        { period: 2, subject: "Science", class: "Grade 9A" },
        { period: 3, subject: "Science", class: "Grade 10A" }
      ],
      Wednesday: [
        { period: 1, subject: "Science", class: "Grade 12A" },
        { period: 2, subject: "Science", class: "Grade 10A" },
        { period: 5, subject: "Science", class: "Grade 11A" }
      ],
      Friday: [
        { period: 3, subject: "Science", class: "Grade 8A" },
        { period: 4, subject: "Science", class: "Grade 10A" },
        { period: 5, subject: "Science", class: "Grade 9A" }
      ],
      Saturday: [
        { period: 1, subject: "Science", class: "Grade 11A" },
        { period: 3, subject: "Science", class: "Grade 8A" },
        { period: 5, subject: "Science", class: "Grade 12A" }
      ]
    }
  },
  class_timetables: {
    "Grade 9A": {
      Sunday: [{ period: 1, subject: "Maths", teacher: "Kyle Westran" }],
      Tuesday: [
        { period: 4, subject: "Maths", teacher: "Kyle Westran" },
        { period: 2, subject: "Science", teacher: "Tyler Westran" }
      ],
      Wednesday: [{ period: 2, subject: "Maths", teacher: "Kyle Westran" }],
      Friday: [
        { period: 3, subject: "Maths", teacher: "Kyle Westran" },
        { period: 5, subject: "Science", teacher: "Tyler Westran" }
      ]
    },
    "Grade 12A": {
      Sunday: [{ period: 3, subject: "Maths", teacher: "Kyle Westran" }],
      Tuesday: [
        { period: 5, subject: "Maths", teacher: "Kyle Westran" },
        { period: 1, subject: "Science", teacher: "Tyler Westran" }
      ],
      Wednesday: [
        { period: 5, subject: "Maths", teacher: "Kyle Westran" },
        { period: 1, subject: "Science", teacher: "Tyler Westran" }
      ],
      Friday: [{ period: 1, subject: "Maths", teacher: "Kyle Westran" }],
      Saturday: [
        { period: 4, subject: "Maths", teacher: "Kyle Westran" },
        { period: 5, subject: "Science", teacher: "Tyler Westran" }
      ]
    },
    "Grade 10A": {
      Sunday: [{ period: 4, subject: "Maths", teacher: "Kyle Westran" }],
      Wednesday: [
        { period: 1, subject: "Maths", teacher: "Kyle Westran" },
        { period: 2, subject: "Science", teacher: "Tyler Westran" }
      ],
      Friday: [
        { period: 2, subject: "Maths", teacher: "Kyle Westran" },
        { period: 4, subject: "Science", teacher: "Tyler Westran" }
      ],
      Saturday: [{ period: 5, subject: "Maths", teacher: "Kyle Westran" }],
      Tuesday: [{ period: 3, subject: "Science", teacher: "Tyler Westran" }]
    },
    "Grade 11A": {
      Sunday: [
        { period: 5, subject: "Maths", teacher: "Kyle Westran" },
        { period: 1, subject: "Science", teacher: "Tyler Westran" }
      ],
      Tuesday: [{ period: 3, subject: "Maths", teacher: "Kyle Westran" }],
      Friday: [{ period: 4, subject: "Maths", teacher: "Kyle Westran" }],
      Saturday: [
        { period: 2, subject: "Maths", teacher: "Kyle Westran" },
        { period: 1, subject: "Science", teacher: "Tyler Westran" }
      ],
      Wednesday: [{ period: 5, subject: "Science", teacher: "Tyler Westran" }]
    },
    "Grade 8A": {
      Tuesday: [{ period: 1, subject: "Maths", teacher: "Kyle Westran" }],
      Wednesday: [{ period: 3, subject: "Maths", teacher: "Kyle Westran" }],
      Friday: [
        { period: 5, subject: "Maths", teacher: "Kyle Westran" },
        { period: 3, subject: "Science", teacher: "Tyler Westran" }
      ],
      Saturday: [
        { period: 1, subject: "Maths", teacher: "Kyle Westran" },
        { period: 3, subject: "Science", teacher: "Tyler Westran" }
      ]
    }
  }
};


function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/preview" element={<TimetablePreview data={mockData} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
