const API_BASE_URL = 'https://api-app-staging.wobot.ai/app/v1';
const TOKEN = process.env.NEXT_PUBLIC_Token;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`,
};

// Fetch list of cameras
export async function fetchCameras() {
  try {
    const response = await fetch(`${API_BASE_URL}/fetch/cameras`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error('Failed to fetch cameras');
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return [];
  }
}

// Update camera status
export async function updateCameraStatus(cameraId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/update/camera/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        id: cameraId,
        status,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update camera status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating camera status:', error);
    throw error;
  }
}

// Deelete camera status
export async function deleteCity(cityId) {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/city/${cityId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete city');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting city:', error);
    throw error;
  }
}