import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { assignmentService } from "@/services/api/assignmentService";
import { classService } from "@/services/api/classService";
import { format } from "date-fns";

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const printService = {
  async generateReportCard(studentId) {
    await delay();
    
    try {
      const student = await studentService.getById(studentId);
      const grades = await gradeService.getByStudentId(studentId);
      const attendance = await attendanceService.getByStudentId(studentId);
      const assignments = await assignmentService.getAll();
      
      // Calculate statistics
      const totalGrades = grades.length;
      const averageGrade = totalGrades > 0 ? 
        Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / totalGrades) : 0;
      
      const totalAttendance = attendance.length;
      const presentCount = attendance.filter(a => a.status === "Present").length;
      const attendanceRate = totalAttendance > 0 ? 
        Math.round((presentCount / totalAttendance) * 100) : 0;
      
      // Group grades by assignment
      const gradesByAssignment = grades.map(grade => {
        const assignment = assignments.find(a => a.Id.toString() === grade.assignmentId);
        return {
          ...grade,
          assignmentTitle: assignment?.title || "Unknown Assignment",
          totalPoints: assignment?.totalPoints || 100,
          category: assignment?.category || "Assignment"
        };
      });
      
      return {
        student,
        grades: gradesByAssignment,
        attendance,
        statistics: {
          totalGrades,
          averageGrade,
          attendanceRate,
          presentCount,
          totalAttendance
        }
      };
    } catch (error) {
      throw new Error(`Failed to generate report card: ${error.message}`);
    }
  },

  async generateAttendanceSheet(studentId, startDate = null, endDate = null) {
    await delay();
    
    try {
      const student = await studentService.getById(studentId);
      let attendance = await attendanceService.getByStudentId(studentId);
      
      // Filter by date range if provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        attendance = attendance.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= start && recordDate <= end;
        });
      }
      
      // Sort by date
      attendance.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Calculate statistics
      const totalDays = attendance.length;
      const presentCount = attendance.filter(a => a.status === "Present").length;
      const absentCount = attendance.filter(a => a.status === "Absent").length;
      const lateCount = attendance.filter(a => a.status === "Late").length;
      const excusedCount = attendance.filter(a => a.status === "Excused").length;
      const attendanceRate = totalDays > 0 ? 
        Math.round((presentCount / totalDays) * 100) : 0;
      
      return {
        student,
        attendance,
        statistics: {
          totalDays,
          presentCount,
          absentCount,
          lateCount,
          excusedCount,
          attendanceRate
        },
        dateRange: {
          startDate,
          endDate
        }
      };
    } catch (error) {
      throw new Error(`Failed to generate attendance sheet: ${error.message}`);
    }
  },

  async generateClassReportCards(classId) {
    await delay();
    
    try {
      const classData = await classService.getById(classId);
      const students = await studentService.getAll();
      const classStudents = students.filter(student => 
        student.classIds && student.classIds.includes(classId.toString())
      );
      
      const reportCards = await Promise.all(
        classStudents.map(student => this.generateReportCard(student.Id))
      );
      
      return {
        class: classData,
        reportCards
      };
    } catch (error) {
      throw new Error(`Failed to generate class report cards: ${error.message}`);
    }
  },

  async generateClassAttendanceSheets(classId, startDate = null, endDate = null) {
    await delay();
    
    try {
      const classData = await classService.getById(classId);
      const students = await studentService.getAll();
      const classStudents = students.filter(student => 
        student.classIds && student.classIds.includes(classId.toString())
      );
      
      const attendanceSheets = await Promise.all(
        classStudents.map(student => 
          this.generateAttendanceSheet(student.Id, startDate, endDate)
        )
      );
      
      return {
        class: classData,
        attendanceSheets
      };
    } catch (error) {
      throw new Error(`Failed to generate class attendance sheets: ${error.message}`);
    }
  }
};