import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import GradeBadge from "./GradeBadge";
import Badge from "@/components/atoms/Badge";

const StudentCard = ({ student, onClick, className = "" }) => {
  const getAttendanceRate = () => {
    // Mock calculation - would come from actual attendance data
    return Math.floor(Math.random() * 20) + 80; // 80-100%
  };

  const getAverageGrade = () => {
    // Mock calculation - would come from actual grade data
    return Math.floor(Math.random() * 30) + 70; // 70-100%
  };

  const attendanceRate = getAttendanceRate();
  const averageGrade = getAverageGrade();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(student)}
      className={`card p-6 cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{student.firstName} {student.lastName}</h3>
            <p className="text-sm text-gray-600">Grade {student.gradeLevel}</p>
          </div>
        </div>
        <GradeBadge grade={averageGrade} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Attendance</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" 
                style={{ width: `${attendanceRate}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{attendanceRate}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <Badge variant={student.status === "Active" ? "success" : "default"}>
            {student.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Classes</span>
          <span className="text-sm font-medium text-gray-700">{student.classIds?.length || 0}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
          Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard;