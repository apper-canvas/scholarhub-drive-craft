import React from "react";
import Badge from "@/components/atoms/Badge";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const AttendanceGrid = ({ attendanceData = [], selectedDate = new Date() }) => {
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start from Monday
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(startDate, i)); // Mon-Fri

  const getAttendanceForDate = (studentId, date) => {
    return attendanceData.find(record => 
      record.studentId === studentId && 
      isSameDay(new Date(record.date), date)
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      "Present": { variant: "present", text: "P" },
      "Absent": { variant: "absent", text: "A" },
      "Late": { variant: "late", text: "L" },
      "Excused": { variant: "excused", text: "E" }
    };
    
    const config = statusMap[status] || { variant: "default", text: "-" };
    return <Badge variant={config.variant} size="sm">{config.text}</Badge>;
  };

  // Mock students for display - in real app would come from props
  const mockStudents = [
    { Id: 1, firstName: "Emma", lastName: "Wilson" },
    { Id: 2, firstName: "Liam", lastName: "Johnson" },
    { Id: 3, firstName: "Olivia", lastName: "Brown" },
    { Id: 4, firstName: "Noah", lastName: "Davis" },
    { Id: 5, firstName: "Ava", lastName: "Miller" }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            {weekDays.map(date => (
              <th key={date.toISOString()} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>{format(date, "EEE")}</div>
                <div className="text-gray-400">{format(date, "MM/dd")}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockStudents.map(student => (
            <tr key={student.Id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                  </div>
                </div>
              </td>
              {weekDays.map(date => {
                const attendance = getAttendanceForDate(student.Id, date);
                const status = attendance?.status || (Math.random() > 0.8 ? "Absent" : "Present");
                
                return (
                  <td key={date.toISOString()} className="px-3 py-4 text-center">
                    {getStatusBadge(status)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceGrid;