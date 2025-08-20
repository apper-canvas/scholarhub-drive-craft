import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import PrintModal from "@/components/organisms/PrintModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import GradeBadge from "@/components/molecules/GradeBadge";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { gradeService } from "@/services/api/gradeService";
import { assignmentService } from "@/services/api/assignmentService";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";

const Grades = () => {
  const { onMenuClick } = useOutletContext();
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
const [selectedAssignment, setSelectedAssignment] = useState("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setError("");
      setLoading(true);
      const [gradesData, assignmentsData, studentsData, classesData] = await Promise.all([
        gradeService.getAll(),
        assignmentService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ]);
      
      setGrades(gradesData);
      setAssignments(assignmentsData);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      setError(err.message || "Failed to load grades data");
      toast.error("Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId));
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find(a => a.Id === parseInt(assignmentId));
    return assignment ? assignment.title : "Unknown Assignment";
  };

  const getClassName = (classId) => {
    const classItem = classes.find(c => c.Id === parseInt(classId));
    return classItem ? classItem.name : "Unknown Class";
  };

  const filteredAssignments = selectedClass 
    ? assignments.filter(a => a.classId === selectedClass)
    : assignments;

  const filteredGrades = grades.filter(grade => {
    if (selectedAssignment && grade.assignmentId !== selectedAssignment) return false;
    if (selectedClass) {
      const assignment = assignments.find(a => a.Id === parseInt(grade.assignmentId));
      if (!assignment || assignment.classId !== selectedClass) return false;
    }
    return true;
  });

  const calculateClassAverage = () => {
    if (filteredGrades.length === 0) return 0;
    const total = filteredGrades.reduce((sum, grade) => sum + grade.score, 0);
    return Math.round(total / filteredGrades.length);
  };

const handleAddGrade = () => {
    toast.info("Add Grade functionality would open a modal here");
  };

  const handlePrintReports = () => {
    setIsPrintModalOpen(true);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadInitialData} />;

  return (
    <div className="min-h-screen bg-gray-50">
<Header 
        title="Grades" 
        showSearch={false}
        onAddClick={handleAddGrade}
        addButtonText="Add Grade"
        onPrintClick={handlePrintReports}
        showPrintButton={true}
        onMenuClick={onMenuClick}
      />
      
      <div className="px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select
              label="Filter by Class"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedAssignment(""); // Reset assignment filter
              }}
            >
              <option value="">All Classes</option>
              {classes.map(classItem => (
                <option key={classItem.Id} value={classItem.Id.toString()}>
                  {classItem.name}
                </option>
              ))}
            </Select>

            <Select
              label="Filter by Assignment"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
            >
              <option value="">All Assignments</option>
              {filteredAssignments.map(assignment => (
                <option key={assignment.Id} value={assignment.Id.toString()}>
                  {assignment.title}
                </option>
              ))}
            </Select>

            <div className="flex items-end">
              <div className="card p-4 w-full">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {calculateClassAverage()}%
                  </div>
                  <div className="text-sm text-gray-600">Class Average</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        {filteredGrades.length === 0 ? (
          <Empty 
            title="No grades found"
            description="Start by adding grades for assignments or adjust your filters"
            actionText="Add Grade"
            onAction={handleAddGrade}
            icon="BookOpen"
          />
        ) : (
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGrades.map((grade, index) => {
                    const assignment = assignments.find(a => a.Id === parseInt(grade.assignmentId));
                    const percentage = assignment ? Math.round((grade.score / assignment.totalPoints) * 100) : grade.score;
                    
                    return (
                      <tr key={grade.Id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                              {getStudentName(grade.studentId).charAt(0)}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {getStudentName(grade.studentId)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getAssignmentTitle(grade.assignmentId)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {assignment ? getClassName(assignment.classId) : "Unknown Class"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {grade.score}{assignment ? `/${assignment.totalPoints}` : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <GradeBadge grade={percentage} />
                            <span className="text-sm text-gray-900">{percentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(grade.submittedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info("Edit grade functionality would open here")}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <ApperIcon name="Edit2" className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info("Delete grade functionality would work here")}
                              className="text-red-600 hover:text-red-800"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
</div>

      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};

export default Grades;