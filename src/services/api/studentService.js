import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const studentService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_level_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "class_ids_c" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        email: student.email_c || '',
        gradeLevel: student.grade_level_c || 0,
        enrollmentDate: student.enrollment_date_c || new Date().toISOString(),
        status: student.status_c || 'Active',
        classIds: student.class_ids_c ? student.class_ids_c.split(',') : []
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_level_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "class_ids_c" } }
        ]
      };

      const response = await apperClient.getRecordById("student_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Student not found");
      }

      const student = response.data;
      return {
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        email: student.email_c || '',
        gradeLevel: student.grade_level_c || 0,
        enrollmentDate: student.enrollment_date_c || new Date().toISOString(),
        status: student.status_c || 'Active',
        classIds: student.class_ids_c ? student.class_ids_c.split(',') : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Student not found");
    }
  },

  async create(studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          email_c: studentData.email,
          grade_level_c: parseInt(studentData.gradeLevel),
          enrollment_date_c: studentData.enrollmentDate || new Date().toISOString(),
          status_c: studentData.status || 'Active',
          class_ids_c: studentData.classIds ? studentData.classIds.join(',') : ''
        }]
      };

      const response = await apperClient.createRecord("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create student");
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create students ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const student = successfulRecords[0].data;
          return {
            Id: student.Id,
            firstName: student.first_name_c || '',
            lastName: student.last_name_c || '',
            email: student.email_c || '',
            gradeLevel: student.grade_level_c || 0,
            enrollmentDate: student.enrollment_date_c || new Date().toISOString(),
            status: student.status_c || 'Active',
            classIds: student.class_ids_c ? student.class_ids_c.split(',') : []
          };
        }
      }
      
      throw new Error("Failed to create student");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          email_c: studentData.email,
          grade_level_c: parseInt(studentData.gradeLevel),
          status_c: studentData.status,
          class_ids_c: studentData.classIds ? studentData.classIds.join(',') : ''
        }]
      };

      const response = await apperClient.updateRecord("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update student");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update students ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const student = successfulUpdates[0].data;
          return {
            Id: student.Id,
            firstName: student.first_name_c || '',
            lastName: student.last_name_c || '',
            email: student.email_c || '',
            gradeLevel: student.grade_level_c || 0,
            enrollmentDate: student.enrollment_date_c || new Date().toISOString(),
            status: student.status_c || 'Active',
            classIds: student.class_ids_c ? student.class_ids_c.split(',') : []
          };
        }
      }
      
      throw new Error("Failed to update student");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete students ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  },

  async search(query) {
    try {
      const students = await this.getAll();
      const searchTerm = query.toLowerCase();
      return students.filter(student => 
        student.firstName.toLowerCase().includes(searchTerm) ||
        student.lastName.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error("Error searching students:", error);
      return [];
    }
  },

  async getByGradeLevel(gradeLevel) {
    try {
      const students = await this.getAll();
      return students.filter(s => s.gradeLevel === parseInt(gradeLevel));
    } catch (error) {
      console.error("Error getting students by grade level:", error);
      return [];
    }
}
};