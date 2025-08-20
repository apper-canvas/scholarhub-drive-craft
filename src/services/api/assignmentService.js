import { toast } from 'react-toastify';

export const assignmentService = {
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
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "class_id_c" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        category: assignment.category_c || '',
        dueDate: assignment.due_date_c || new Date().toISOString(),
        totalPoints: assignment.total_points_c || 100,
        classId: assignment.class_id_c?.Id?.toString() || assignment.class_id_c?.toString() || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "class_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById("assignment_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Assignment not found");
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        category: assignment.category_c || '',
        dueDate: assignment.due_date_c || new Date().toISOString(),
        totalPoints: assignment.total_points_c || 100,
        classId: assignment.class_id_c?.Id?.toString() || assignment.class_id_c?.toString() || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Assignment not found");
    }
  },

  async getByClassId(classId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "class_id_c" } }
        ],
        where: [
          {
            FieldName: "class_id_c",
            Operator: "EqualTo",
            Values: [parseInt(classId)]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        category: assignment.category_c || '',
        dueDate: assignment.due_date_c || new Date().toISOString(),
        totalPoints: assignment.total_points_c || 100,
        classId: assignment.class_id_c?.Id?.toString() || assignment.class_id_c?.toString() || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments by class:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: assignmentData.title,
          title_c: assignmentData.title,
          category_c: assignmentData.category,
          due_date_c: new Date(assignmentData.dueDate).toISOString().split("T")[0],
          total_points_c: parseInt(assignmentData.totalPoints),
          class_id_c: parseInt(assignmentData.classId)
        }]
      };

      const response = await apperClient.createRecord("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create assignment");
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const assignment = successfulRecords[0].data;
          return {
            Id: assignment.Id,
            title: assignment.title_c || assignment.Name || '',
            category: assignment.category_c || '',
            dueDate: assignment.due_date_c || new Date().toISOString(),
            totalPoints: assignment.total_points_c || 100,
            classId: assignment.class_id_c?.Id?.toString() || assignment.class_id_c?.toString() || ''
          };
        }
      }
      
      throw new Error("Failed to create assignment");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.title,
          title_c: assignmentData.title,
          category_c: assignmentData.category,
          due_date_c: new Date(assignmentData.dueDate).toISOString().split("T")[0],
          total_points_c: parseInt(assignmentData.totalPoints)
        }]
      };

      const response = await apperClient.updateRecord("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update assignment");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update assignments ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const assignment = successfulUpdates[0].data;
          return {
            Id: assignment.Id,
            title: assignment.title_c || assignment.Name || '',
            category: assignment.category_c || '',
            dueDate: assignment.due_date_c || new Date().toISOString(),
            totalPoints: assignment.total_points_c || 100,
            classId: assignment.class_id_c?.Id?.toString() || assignment.class_id_c?.toString() || ''
          };
        }
      }
      
      throw new Error("Failed to update assignment");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete assignments ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};