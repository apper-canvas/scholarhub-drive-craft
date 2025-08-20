import { toast } from 'react-toastify';

export const gradeService = {
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
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submittedDate: grade.submitted_date_c || new Date().toISOString(),
        studentId: grade.student_id_c?.Id?.toString() || grade.student_id_c?.toString() || '',
        assignmentId: grade.assignment_id_c?.Id?.toString() || grade.assignment_id_c?.toString() || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
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
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById("grade_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Grade not found");
      }

      const grade = response.data;
      return {
        Id: grade.Id,
        score: grade.score_c || 0,
        submittedDate: grade.submitted_date_c || new Date().toISOString(),
        studentId: grade.student_id_c?.Id?.toString() || grade.student_id_c?.toString() || '',
        assignmentId: grade.assignment_id_c?.Id?.toString() || grade.assignment_id_c?.toString() || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Grade not found");
    }
  },

  async getByStudentId(studentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } }
        ],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submittedDate: grade.submitted_date_c || new Date().toISOString(),
        studentId: grade.student_id_c?.Id?.toString() || grade.student_id_c?.toString() || '',
        assignmentId: grade.assignment_id_c?.Id?.toString() || grade.assignment_id_c?.toString() || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getByAssignmentId(assignmentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } }
        ],
        where: [
          {
            FieldName: "assignment_id_c",
            Operator: "EqualTo",
            Values: [parseInt(assignmentId)]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submittedDate: grade.submitted_date_c || new Date().toISOString(),
        studentId: grade.student_id_c?.Id?.toString() || grade.student_id_c?.toString() || '',
        assignmentId: grade.assignment_id_c?.Id?.toString() || grade.assignment_id_c?.toString() || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Grade for Student ${gradeData.studentId}`,
          score_c: parseInt(gradeData.score),
          submitted_date_c: gradeData.submittedDate || new Date().toISOString(),
          student_id_c: parseInt(gradeData.studentId),
          assignment_id_c: parseInt(gradeData.assignmentId)
        }]
      };

      const response = await apperClient.createRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create grade");
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create grades ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const grade = successfulRecords[0].data;
          return {
            Id: grade.Id,
            score: grade.score_c || 0,
            submittedDate: grade.submitted_date_c || new Date().toISOString(),
            studentId: grade.student_id_c?.Id?.toString() || grade.student_id_c?.toString() || '',
            assignmentId: grade.assignment_id_c?.Id?.toString() || grade.assignment_id_c?.toString() || ''
          };
        }
      }
      
      throw new Error("Failed to create grade");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          score_c: parseInt(gradeData.score),
          submitted_date_c: gradeData.submittedDate || new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update grade");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update grades ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const grade = successfulUpdates[0].data;
          return {
            Id: grade.Id,
            score: grade.score_c || 0,
            submittedDate: grade.submitted_date_c || new Date().toISOString(),
            studentId: grade.student_id_c?.Id?.toString() || grade.student_id_c?.toString() || '',
            assignmentId: grade.assignment_id_c?.Id?.toString() || grade.assignment_id_c?.toString() || ''
          };
        }
      }
      
      throw new Error("Failed to update grade");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete grades ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};