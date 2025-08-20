import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import GradeBadge from "@/components/molecules/GradeBadge";
import { printService } from "@/services/api/printService";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { cn } from "@/utils/cn";

const PrintModal = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState("reportCard");
  const [targetType, setTargetType] = useState("student");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      const [studentsData, classesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll()
      ]);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const handleGeneratePreview = async () => {
    if (!selectedStudent && !selectedClass) {
      toast.error("Please select a student or class");
      return;
    }

    setLoading(true);
    try {
      let data;
      
      if (targetType === "student") {
        if (reportType === "reportCard") {
          data = await printService.generateReportCard(parseInt(selectedStudent));
        } else {
          data = await printService.generateAttendanceSheet(
            parseInt(selectedStudent), 
            startDate || null, 
            endDate || null
          );
        }
      } else {
        if (reportType === "reportCard") {
          data = await printService.generateClassReportCards(parseInt(selectedClass));
        } else {
          data = await printService.generateClassAttendanceSheets(
            parseInt(selectedClass),
            startDate || null, 
            endDate || null
          );
        }
      }
      
      setReportData(data);
      setPreviewMode(true);
      toast.success("Report generated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '', 'height=600,width=800');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Report</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; }
              .print-container { max-width: 800px; margin: 0 auto; padding: 20px; }
              .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .print-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .print-subtitle { font-size: 16px; color: #666; }
              .student-info { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
              .student-name { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
              .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .grades-table, .attendance-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .grades-table th, .grades-table td, .attendance-table th, .attendance-table td { 
                border: 1px solid #ddd; padding: 12px; text-align: left; 
              }
              .grades-table th, .attendance-table th { 
                background-color: #f5f5f5; font-weight: bold; 
              }
              .statistics { margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
              .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
              .stat-item { text-align: center; }
              .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
              .stat-label { font-size: 14px; color: #666; }
              .page-break { page-break-before: always; }
              .grade-badge { display: inline-block; padding: 4px 8px; border-radius: 50%; color: white; font-weight: bold; text-align: center; }
              .grade-excellent { background-color: #10b981; }
              .grade-good { background-color: #f59e0b; }
              .grade-poor { background-color: #ef4444; }
              .status-present { color: #10b981; font-weight: bold; }
              .status-absent { color: #ef4444; font-weight: bold; }
              .status-late { color: #f59e0b; font-weight: bold; }
              .status-excused { color: #3b82f6; font-weight: bold; }
              @media print {
                body { font-size: 12px; }
                .print-container { margin: 0; padding: 10px; }
                .page-break { page-break-before: always; }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      
      toast.success("Print dialog opened");
    }
  };

  const renderReportCard = (data) => {
    if (data.reportCards) {
      // Class report cards
      return (
        <div ref={printRef}>
          <div className="print-header">
            <h1 className="print-title">Class Report Cards</h1>
            <p className="print-subtitle">{data.class.name} - {format(new Date(), 'MMMM dd, yyyy')}</p>
          </div>
          
          {data.reportCards.map((report, index) => (
            <div key={report.student.Id} className={index > 0 ? "page-break" : ""}>
              <div className="student-info">
                <div className="student-name">{report.student.firstName} {report.student.lastName}</div>
                <div className="info-row">
                  <span>Grade Level: {report.student.gradeLevel}</span>
                  <span>Student ID: {report.student.Id}</span>
                </div>
                <div className="info-row">
                  <span>Email: {report.student.email}</span>
                  <span>Status: {report.student.status}</span>
                </div>
              </div>

              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Total Points</th>
                    <th>Percentage</th>
                    <th>Date Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {report.grades.map(grade => (
                    <tr key={grade.Id}>
                      <td>{grade.assignmentTitle}</td>
                      <td>{grade.category}</td>
                      <td>{grade.score}</td>
                      <td>{grade.totalPoints}</td>
                      <td>
                        <span className={cn(
                          "grade-badge",
                          grade.score >= 90 ? "grade-excellent" :
                          grade.score >= 70 ? "grade-good" : "grade-poor"
                        )}>
                          {Math.round((grade.score / grade.totalPoints) * 100)}%
                        </span>
                      </td>
                      <td>{format(new Date(grade.submittedDate), 'MMM dd, yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="statistics">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">{report.statistics.averageGrade}%</div>
                    <div className="stat-label">Average Grade</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{report.statistics.totalGrades}</div>
                    <div className="stat-label">Total Assignments</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{report.statistics.attendanceRate}%</div>
                    <div className="stat-label">Attendance Rate</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Single student report card
      return (
        <div ref={printRef}>
          <div className="print-header">
            <h1 className="print-title">Student Report Card</h1>
            <p className="print-subtitle">{format(new Date(), 'MMMM dd, yyyy')}</p>
          </div>

          <div className="student-info">
            <div className="student-name">{data.student.firstName} {data.student.lastName}</div>
            <div className="info-row">
              <span>Grade Level: {data.student.gradeLevel}</span>
              <span>Student ID: {data.student.Id}</span>
            </div>
            <div className="info-row">
              <span>Email: {data.student.email}</span>
              <span>Status: {data.student.status}</span>
            </div>
          </div>

          <table className="grades-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Category</th>
                <th>Score</th>
                <th>Total Points</th>
                <th>Percentage</th>
                <th>Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {data.grades.map(grade => (
                <tr key={grade.Id}>
                  <td>{grade.assignmentTitle}</td>
                  <td>{grade.category}</td>
                  <td>{grade.score}</td>
                  <td>{grade.totalPoints}</td>
                  <td>
                    <span className={cn(
                      "grade-badge",
                      grade.score >= 90 ? "grade-excellent" :
                      grade.score >= 70 ? "grade-good" : "grade-poor"
                    )}>
                      {Math.round((grade.score / grade.totalPoints) * 100)}%
                    </span>
                  </td>
                  <td>{format(new Date(grade.submittedDate), 'MMM dd, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="statistics">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{data.statistics.averageGrade}%</div>
                <div className="stat-label">Average Grade</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.statistics.totalGrades}</div>
                <div className="stat-label">Total Assignments</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.statistics.attendanceRate}%</div>
                <div className="stat-label">Attendance Rate</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderAttendanceSheet = (data) => {
    if (data.attendanceSheets) {
      // Class attendance sheets
      return (
        <div ref={printRef}>
          <div className="print-header">
            <h1 className="print-title">Class Attendance Sheets</h1>
            <p className="print-subtitle">
              {data.class.name} - {format(new Date(), 'MMMM dd, yyyy')}
              {data.attendanceSheets[0]?.dateRange?.startDate && (
                <span> | {format(new Date(data.attendanceSheets[0].dateRange.startDate), 'MMM dd')} - {format(new Date(data.attendanceSheets[0].dateRange.endDate), 'MMM dd, yyyy')}</span>
              )}
            </p>
          </div>

          {data.attendanceSheets.map((sheet, index) => (
            <div key={sheet.student.Id} className={index > 0 ? "page-break" : ""}>
              <div className="student-info">
                <div className="student-name">{sheet.student.firstName} {sheet.student.lastName}</div>
                <div className="info-row">
                  <span>Grade Level: {sheet.student.gradeLevel}</span>
                  <span>Student ID: {sheet.student.Id}</span>
                </div>
              </div>

              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.attendance.map(record => (
                    <tr key={record.Id}>
                      <td>{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                      <td>
                        <span className={cn(
                          record.status === "Present" ? "status-present" :
                          record.status === "Absent" ? "status-absent" :
                          record.status === "Late" ? "status-late" : "status-excused"
                        )}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="statistics">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">{sheet.statistics.attendanceRate}%</div>
                    <div className="stat-label">Attendance Rate</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{sheet.statistics.presentCount}</div>
                    <div className="stat-label">Present Days</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{sheet.statistics.absentCount}</div>
                    <div className="stat-label">Absent Days</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{sheet.statistics.totalDays}</div>
                    <div className="stat-label">Total Days</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Single student attendance sheet
      return (
        <div ref={printRef}>
          <div className="print-header">
            <h1 className="print-title">Student Attendance Sheet</h1>
            <p className="print-subtitle">
              {format(new Date(), 'MMMM dd, yyyy')}
              {data.dateRange?.startDate && (
                <span> | {format(new Date(data.dateRange.startDate), 'MMM dd')} - {format(new Date(data.dateRange.endDate), 'MMM dd, yyyy')}</span>
              )}
            </p>
          </div>

          <div className="student-info">
            <div className="student-name">{data.student.firstName} {data.student.lastName}</div>
            <div className="info-row">
              <span>Grade Level: {data.student.gradeLevel}</span>
              <span>Student ID: {data.student.Id}</span>
            </div>
            <div className="info-row">
              <span>Email: {data.student.email}</span>
              <span>Status: {data.student.status}</span>
            </div>
          </div>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.attendance.map(record => (
                <tr key={record.Id}>
                  <td>{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                  <td>
                    <span className={cn(
                      record.status === "Present" ? "status-present" :
                      record.status === "Absent" ? "status-absent" :
                      record.status === "Late" ? "status-late" : "status-excused"
                    )}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="statistics">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{data.statistics.attendanceRate}%</div>
                <div className="stat-label">Attendance Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.statistics.presentCount}</div>
                <div className="stat-label">Present Days</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.statistics.absentCount}</div>
                <div className="stat-label">Absent Days</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.statistics.totalDays}</div>
                <div className="stat-label">Total Days</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const handleClose = () => {
    setPreviewMode(false);
    setReportData(null);
    setSelectedStudent("");
    setSelectedClass("");
    setStartDate("");
    setEndDate("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden",
              previewMode ? "max-w-6xl" : "max-w-2xl"
            )}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {previewMode ? "Print Preview" : "Print Reports"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {!previewMode ? (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Report Type"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="reportCard">Report Card</option>
                      <option value="attendance">Attendance Sheet</option>
                    </Select>

                    <Select
                      label="Target"
                      value={targetType}
                      onChange={(e) => setTargetType(e.target.value)}
                    >
                      <option value="student">Individual Student</option>
                      <option value="class">Entire Class</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {targetType === "student" ? (
                      <Select
                        label="Select Student"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                      >
                        <option value="">Choose a student...</option>
                        {students.map(student => (
                          <option key={student.Id} value={student.Id}>
                            {student.firstName} {student.lastName} (Grade {student.gradeLevel})
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Select
                        label="Select Class"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="">Choose a class...</option>
                        {classes.map(cls => (
                          <option key={cls.Id} value={cls.Id}>
                            {cls.name} ({cls.period})
                          </option>
                        ))}
                      </Select>
                    )}
                  </div>

                  {reportType === "attendance" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Start Date (Optional)"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Input
                        label="End Date (Optional)"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleGeneratePreview}
                      disabled={loading || (!selectedStudent && !selectedClass)}
                    >
                      {loading ? (
                        <>
                          <Loading className="w-4 h-4 mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                          Preview Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setPreviewMode(false)}
                      >
                        <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                        Back to Settings
                      </Button>
                      <Button onClick={handlePrint}>
                        <ApperIcon name="Printer" className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {reportData && (
                      reportType === "reportCard" 
                        ? renderReportCard(reportData)
                        : renderAttendanceSheet(reportData)
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrintModal;