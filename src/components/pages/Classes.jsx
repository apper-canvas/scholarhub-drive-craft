import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";

const Classes = () => {
  const { onMenuClick } = useOutletContext();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);

  useEffect(() => {
    loadClassesData();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchQuery]);

  const loadClassesData = async () => {
    try {
      setError("");
      setLoading(true);
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load classes data");
      toast.error("Failed to load classes data");
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    if (!searchQuery.trim()) {
      setFilteredClasses(classes);
      return;
    }
    
    const filtered = classes.filter(classItem =>
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.period.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  const getStudentCount = (classItem) => {
    return classItem.studentIds ? classItem.studentIds.length : 0;
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      "Mathematics": "Calculator",
      "English": "Book",
      "Science": "Microscope",
      "History": "Clock",
      "Arts": "Palette",
      "Language": "Globe",
      "Physical Education": "Activity"
    };
    return icons[subject] || "BookOpen";
  };

  const getSubjectColor = (subject) => {
    const colors = {
      "Mathematics": "from-blue-500 to-blue-600",
      "English": "from-green-500 to-green-600",
      "Science": "from-purple-500 to-purple-600",
      "History": "from-yellow-500 to-yellow-600",
      "Arts": "from-pink-500 to-pink-600",
      "Language": "from-indigo-500 to-indigo-600",
      "Physical Education": "from-red-500 to-red-600"
    };
    return colors[subject] || "from-gray-500 to-gray-600";
  };

  const handleAddClass = () => {
    toast.info("Add Class functionality would open a modal here");
  };

  const handleEditClass = (classItem) => {
    toast.info(`Edit ${classItem.name} functionality would open here`);
  };

  const handleDeleteClass = (classId) => {
    toast.info("Delete class functionality would work here");
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadClassesData} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Classes" 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleAddClass}
        addButtonText="Add Class"
        onMenuClick={onMenuClick}
      />
      
      <div className="px-6 py-8">
        {filteredClasses.length === 0 && !searchQuery ? (
          <Empty 
            title="No classes found"
            description="Start by creating your first class to organize your students"
            actionText="Add Class"
            onAction={handleAddClass}
            icon="School"
          />
        ) : filteredClasses.length === 0 && searchQuery ? (
          <Empty 
            title="No classes found"
            description={`No classes match "${searchQuery}". Try adjusting your search terms.`}
            actionText="Clear Search"
            onAction={() => setSearchQuery("")}
            icon="Search"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.map((classItem, index) => (
              <motion.div
                key={classItem.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="card p-6 cursor-pointer"
                onClick={() => toast.info(`Viewing ${classItem.name} details`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${getSubjectColor(classItem.subject)}`}>
                    <ApperIcon name={getSubjectIcon(classItem.subject)} className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClass(classItem);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClass(classItem.Id);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 font-display">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-gray-600">{classItem.subject}</p>
                  <p className="text-sm text-gray-500">{classItem.period}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Students</span>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Users" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {getStudentCount(classItem)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assignments</span>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="BookOpen" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {Math.floor(Math.random() * 10) + 5}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. Grade</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">A</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.floor(Math.random() * 15) + 85}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info(`View ${classItem.name} students`);
                      }}
                      className="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      View Students
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info(`Manage ${classItem.name} assignments`);
                      }}
                      className="text-sm text-secondary hover:text-secondary/80 font-medium"
                    >
                      Assignments
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;