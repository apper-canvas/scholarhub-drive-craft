import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { format, addDays, subDays, startOfWeek } from "date-fns";
import Header from "@/components/organisms/Header";
import AttendanceGrid from "@/components/molecules/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { attendanceService } from "@/services/api/attendanceService";
import { studentService } from "@/services/api/studentService";

const Attendance = () => {
  const { onMenuClick } = useOutletContext();
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      setError("");
      setLoading(true);
      const [attendanceData, studentsData] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll()
      ]);
      
      setAttendance(attendanceData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = () => {
    toast.info("Mark attendance functionality would open a modal here");
  };

  const handlePreviousWeek = () => {
    setSelectedDate(prev => subDays(prev, 7));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addDays(prev, 7));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const getWeekRange = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = addDays(start, 4); // Friday
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  const getTodayAttendanceStats = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayAttendance = attendance.filter(record => 
      format(new Date(record.date), "yyyy-MM-dd") === today
    );
    
    const present = todayAttendance.filter(r => r.status === "Present").length;
    const absent = todayAttendance.filter(r => r.status === "Absent").length;
    const late = todayAttendance.filter(r => r.status === "Late").length;
    const excused = todayAttendance.filter(r => r.status === "Excused").length;
    
    return { present, absent, late, excused, total: todayAttendance.length };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAttendanceData} />;

  const stats = getTodayAttendanceStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Attendance" 
        showSearch={false}
        onAddClick={handleMarkAttendance}
        addButtonText="Mark Attendance"
        onMenuClick={onMenuClick}
      />
      
      <div className="px-6 py-8">
        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <div className="text-sm text-gray-600">Present</div>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <div className="text-sm text-gray-600">Absent</div>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
              <div className="text-sm text-gray-600">Late</div>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
              <div className="text-sm text-gray-600">Excused</div>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 font-display">
                Weekly Attendance
              </h2>
              <span className="text-gray-600">{getWeekRange()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousWeek}
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextWeek}
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Attendance Grid */}
        <div className="bg-white rounded-lg shadow">
          <AttendanceGrid 
            attendanceData={attendance}
            selectedDate={selectedDate}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">P - Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">A - Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">L - Late</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">E - Excused</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;