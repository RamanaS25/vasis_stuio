export interface Group {
    id: number;           // int8
    name: string;         // text
    syllabus_grades: {
      grade: number;
    };
    course_id: number;    // int8
    start_date: string;   // timestamp (ISO string)
    end_date: string;     // timestamp (ISO string)
    status: boolean;      // bool
    weeks: number;        // numeric
    zoom_link: string;    // varchar
    student_sessions: StudentSession[];
  }
  export interface StudentSession {
    id: number;              // int8
    session_date: string;           // timestamp (ISO string)
    week_num: number;        // numeric
    recorded_class: string;  // varchar
  }
    