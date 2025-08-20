import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const classService = {
  async getAll() {
    await delay();
    return [...classes];
  },

  async getById(id) {
    await delay();
    const classItem = classes.find(c => c.Id === parseInt(id));
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  },

  async create(classData) {
    await delay();
    const newClass = {
      Id: Math.max(...classes.map(c => c.Id)) + 1,
      ...classData,
      studentIds: []
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, classData) {
    await delay();
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes[index] = { ...classes[index], ...classData };
    return { ...classes[index] };
  },

  async delete(id) {
    await delay();
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    const deletedClass = classes.splice(index, 1)[0];
    return { ...deletedClass };
  },

  async getBySubject(subject) {
    await delay();
    return classes
      .filter(c => c.subject.toLowerCase() === subject.toLowerCase())
      .map(c => ({ ...c }));
  }
};