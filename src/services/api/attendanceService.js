import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const attendanceService = {
  async getAll() {
    await delay();
    return [...attendance];
  },

  async getById(id) {
    await delay();
    const record = attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByStudentId(studentId) {
    await delay();
    return attendance
      .filter(a => a.studentId === studentId.toString())
      .map(a => ({ ...a }));
  },

  async getByDate(date) {
    await delay();
    const targetDate = new Date(date).toISOString().split("T")[0];
    return attendance
      .filter(a => new Date(a.date).toISOString().split("T")[0] === targetDate)
      .map(a => ({ ...a }));
  },

  async create(attendanceData) {
    await delay();
    const newRecord = {
      Id: Math.max(...attendance.map(a => a.Id)) + 1,
      ...attendanceData
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay();
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance[index] = { ...attendance[index], ...attendanceData };
    return { ...attendance[index] };
  },

  async delete(id) {
    await delay();
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    const deletedRecord = attendance.splice(index, 1)[0];
    return { ...deletedRecord };
  },

  async markAttendance(studentId, date, status, notes = "") {
    await delay();
    const existingRecord = attendance.find(a => 
      a.studentId === studentId.toString() && 
      new Date(a.date).toISOString().split("T")[0] === new Date(date).toISOString().split("T")[0]
    );

    if (existingRecord) {
      return await this.update(existingRecord.Id, { status, notes });
    } else {
      return await this.create({
        studentId: studentId.toString(),
        date: new Date(date).toISOString(),
        status,
        notes
      });
    }
  }
};