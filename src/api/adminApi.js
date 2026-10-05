import axiosInstance from "./axiosInstance";

/* =========================================================
   COMPANY APIs
   ========================================================= */

export async function getCompanies() {
  const response = await axiosInstance.get(
    "/api/admin/companies"
  );

  return response.data;
}


export async function getCompanyById(companyId) {
  const response = await axiosInstance.get(
    `/api/admin/companies/${companyId}`
  );

  return response.data;
}


export async function createCompany(companyData) {
  const payload = {
    companyName: companyData.companyName.trim(),
    website: companyData.website.trim(),
    location: companyData.location.trim(),
  };

  const response = await axiosInstance.post(
    "/api/admin/companies",
    payload
  );

  return response.data;
}


export async function updateCompany(
  companyId,
  companyData
) {
  const payload = {
    companyName: companyData.companyName.trim(),
    website: companyData.website.trim(),
    location: companyData.location.trim(),
  };

  const response = await axiosInstance.put(
    `/api/admin/companies/${companyId}`,
    payload
  );

  return response.data;
}


export async function deleteCompany(companyId) {
  await axiosInstance.delete(
    `/api/admin/companies/${companyId}`
  );
}


/* =========================================================
   PLACEMENT DRIVE APIs
   ========================================================= */

export async function getPlacementDrives() {
  const response = await axiosInstance.get(
    "/api/admin/drives"
  );

  return response.data;
}


export async function getPlacementDriveById(
  driveId
) {
  const response = await axiosInstance.get(
    `/api/admin/drives/${driveId}`
  );

  return response.data;
}


/* =========================================================
   CREATE PLACEMENT DRIVE
   ========================================================= */

export async function createPlacementDrive(
  driveData
) {
  const payload = {
    companyId: Number(driveData.companyId),

    jobTitle:
      driveData.jobTitle.trim(),

    description:
      driveData.description.trim(),

    minimumCgpa:
      driveData.minimumCgpa === ""
        ? null
        : Number(driveData.minimumCgpa),

    minimumTenthPercentage:
      driveData.minimumTenthPercentage === ""
        ? null
        : Number(driveData.minimumTenthPercentage),

    minimumTwelfthPercentage:
      driveData.minimumTwelfthPercentage === ""
        ? null
        : Number(driveData.minimumTwelfthPercentage),

    applicationDeadline:
      driveData.applicationDeadline,

    driveDate:
      driveData.driveDate === ""
        ? null
        : driveData.driveDate,
  };

  const response = await axiosInstance.post(
    "/api/admin/drives",
    payload
  );

  return response.data;
}


/* =========================================================
   UPDATE PLACEMENT DRIVE DETAILS
   ========================================================= */

export async function updatePlacementDrive(
  driveId,
  driveData
) {
  const payload = {
    companyId: Number(driveData.companyId),

    jobTitle:
      driveData.jobTitle.trim(),

    description:
      driveData.description.trim(),

    minimumCgpa:
      driveData.minimumCgpa === ""
        ? null
        : Number(driveData.minimumCgpa),

    minimumTenthPercentage:
      driveData.minimumTenthPercentage === ""
        ? null
        : Number(driveData.minimumTenthPercentage),

    minimumTwelfthPercentage:
      driveData.minimumTwelfthPercentage === ""
        ? null
        : Number(driveData.minimumTwelfthPercentage),

    applicationDeadline:
      driveData.applicationDeadline,

    driveDate:
      driveData.driveDate === ""
        ? null
        : driveData.driveDate,
  };

  const response = await axiosInstance.put(
    `/api/admin/drives/${driveId}`,
    payload
  );

  return response.data;
}


/* =========================================================
   UPDATE PLACEMENT DRIVE STATUS
   ========================================================= */

export async function updatePlacementDriveStatus(
  driveId,
  status
) {
  const response = await axiosInstance.patch(
    `/api/admin/drives/${driveId}/status`,
    {
      status: status,
    }
  );

  return response.data;
}


/* =========================================================
   DELETE PLACEMENT DRIVE
   ========================================================= */

export async function deletePlacementDrive(
  driveId
) {
  await axiosInstance.delete(
    `/api/admin/drives/${driveId}`
  );
}