import { toast } from 'react-toastify';

export const attendanceService = {
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "student_id_c" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(record => ({
        Id: record.Id,
        date: record.date_c || new Date().toISOString(),
        status: record.status_c || 'Present',
        notes: record.notes_c || '',
        studentId: record.student_id_c?.Id?.toString() || record.student_id_c?.toString() || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "student_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById("attendance_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Attendance record not found");
      }

      const record = response.data;
      return {
        Id: record.Id,
        date: record.date_c || new Date().toISOString(),
        status: record.status_c || 'Present',
        notes: record.notes_c || '',
        studentId: record.student_id_c?.Id?.toString() || record.student_id_c?.toString() || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Attendance record not found");
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "student_id_c" } }
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

      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(record => ({
        Id: record.Id,
        date: record.date_c || new Date().toISOString(),
        status: record.status_c || 'Present',
        notes: record.notes_c || '',
        studentId: record.student_id_c?.Id?.toString() || record.student_id_c?.toString() || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getByDate(date) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const targetDate = new Date(date).toISOString().split("T")[0];

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "student_id_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [targetDate]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(record => ({
        Id: record.Id,
        date: record.date_c || new Date().toISOString(),
        status: record.status_c || 'Present',
        notes: record.notes_c || '',
        studentId: record.student_id_c?.Id?.toString() || record.student_id_c?.toString() || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(attendanceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Attendance for Student ${attendanceData.studentId}`,
          date_c: new Date(attendanceData.date).toISOString().split("T")[0],
          status_c: attendanceData.status || 'Present',
          notes_c: attendanceData.notes || '',
          student_id_c: parseInt(attendanceData.studentId)
        }]
      };

      const response = await apperClient.createRecord("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create attendance record");
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            date: record.date_c || new Date().toISOString(),
            status: record.status_c || 'Present',
            notes: record.notes_c || '',
            studentId: record.student_id_c?.Id?.toString() || record.student_id_c?.toString() || ''
          };
        }
      }
      
      throw new Error("Failed to create attendance record");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          status_c: attendanceData.status,
          notes_c: attendanceData.notes || ''
        }]
      };

      const response = await apperClient.updateRecord("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update attendance record");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update attendance ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const record = successfulUpdates[0].data;
          return {
            Id: record.Id,
            date: record.date_c || new Date().toISOString(),
            status: record.status_c || 'Present',
            notes: record.notes_c || '',
            studentId: record.student_id_c?.Id?.toString() || record.student_id_c?.toString() || ''
          };
        }
      }
      
      throw new Error("Failed to update attendance record");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete attendance ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  },

  async markAttendance(studentId, date, status, notes = "") {
    try {
      const existingRecords = await this.getByDate(date);
      const existingRecord = existingRecords.find(a => 
        a.studentId === studentId.toString()
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
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  }
};