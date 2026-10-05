import axiosInstance from "./axiosInstance";

/**
 * Get placement drives available to students.
 *
 * Backend:
 * GET /api/student/drives
 */
export async function getStudentPlacementDrives() {
  const response = await axiosInstance.get(
    "/api/student/drives"
  );

  return response.data;
}