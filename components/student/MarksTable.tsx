import { useEffect, useState } from "react";
import axios from "axios";

interface Mark {
  _id: string;
  paperId: string;
  marks: number;
}

export default function MarksTable({ studentId }: { studentId: string }) {
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    const fetchMarks = async () => {
      const res = await axios.get(`/api/student/marks?studentId=${studentId}`);
      setMarks(res.data);
    };
    fetchMarks();
  }, [studentId]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Marks</h3>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Subject</th>
            <th className="text-left">Marks</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark) => (
            <tr key={mark._id} className="border-b">
              <td className="p-2">{mark.paperId}</td>
              <td className="p-2">{mark.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
