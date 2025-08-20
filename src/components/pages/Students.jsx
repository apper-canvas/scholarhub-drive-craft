import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import PrintModal from "@/components/organisms/PrintModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const { onMenuClick } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery]);

  const loadStudents = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter(student =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.gradeLevel.toString().includes(searchQuery)
    );
    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setIsModalOpen(true);
  };

const handleViewStudent = (student) => {
    toast.info(`Viewing ${student.firstName} ${student.lastName}'s profile`);
  };

  const handlePrintReports = () => {
    setIsPrintModalOpen(true);
  };
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        setStudents(prev => prev.filter(s => s.Id !== studentId));
        toast.success("Student deleted successfully");
      } catch (err) {
        toast.error("Failed to delete student");
      }
    }
  };

  const handleSaveStudent = async (studentData) => {
    try {
      let savedStudent;
      if (modalMode === "create") {
        savedStudent = await studentService.create(studentData);
        setStudents(prev => [...prev, savedStudent]);
        toast.success("Student added successfully");
      } else {
        savedStudent = await studentService.update(selectedStudent.Id, studentData);
        setStudents(prev => prev.map(s => s.Id === savedStudent.Id ? savedStudent : s));
        toast.success("Student updated successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(modalMode === "create" ? "Failed to add student" : "Failed to update student");
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="min-h-screen bg-gray-50">
<Header 
        title="Students" 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleAddStudent}
        addButtonText="Add Student"
        onPrintClick={handlePrintReports}
        showPrintButton={true}
        onMenuClick={onMenuClick}
      />
      
      <div className="px-6 py-8">
        {filteredStudents.length === 0 && !searchQuery ? (
          <Empty 
            title="No students found"
            description="Start building your student roster by adding your first student"
            actionText="Add Student"
            onAction={handleAddStudent}
            icon="Users"
          />
        ) : filteredStudents.length === 0 && searchQuery ? (
          <Empty 
            title="No students found"
            description={`No students match "${searchQuery}". Try adjusting your search terms.`}
            actionText="Clear Search"
            onAction={() => setSearchQuery("")}
            icon="Search"
          />
        ) : (
          <StudentTable
            students={filteredStudents}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onView={handleViewStudent}
          />
        )}
      </div>

<StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
        mode={modalMode}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};

export default Students;