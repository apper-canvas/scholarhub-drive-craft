import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const gradeService = {
  async getAll() {
    await delay();
    return [...grades];
  },

  async getById(id) {
    await delay();
    const grade = grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async getByStudentId(studentId) {
    await delay();
    return grades
      .filter(g => g.studentId === studentId.toString())
      .map(g => ({ ...g }));
  },

  async getByAssignmentId(assignmentId) {
    await delay();
    return grades
      .filter(g => g.assignmentId === assignmentId.toString())
      .map(g => ({ ...g }));
  },

  async create(gradeData) {
    await delay();
    const newGrade = {
      Id: Math.max(...grades.map(g => g.Id)) + 1,
      ...gradeData,
      submittedDate: new Date().toISOString()
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay();
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { ...grades[index], ...gradeData };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay();
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    const deletedGrade = grades.splice(index, 1)[0];
    return { ...deletedGrade };
  }
};