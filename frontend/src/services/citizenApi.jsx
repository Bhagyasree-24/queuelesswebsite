const API_URL = import.meta.env.VITE_API_URL;

export async function getOffices() {
  const response = await fetch(`${API_URL}/offices`, {
    method: "GET",
    credentials: "include",
  });

  return response.json();
}

export async function getOfficeById(officeId) {
  const response = await fetch(`${API_URL}/offices/${officeId}`, {
    method: "GET",
    credentials: "include",
  });

  return response.json();
}

export async function getOfficeServices(officeId) {
  const response = await fetch(`${API_URL}/offices/${officeId}/services`, {
    method: "GET",
    credentials: "include",
  });

  return response.json();
}

export async function getQueueInfo(officeId, serviceId) {
  const response = await fetch(
    `${API_URL}/offices/${officeId}/services/${serviceId}/queue`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return response.json();
}

export async function createToken(officeId, serviceId) {
  const response = await fetch(`${API_URL}/tokens`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ officeId, serviceId }),
  });

  return response.json();
}

export async function getTokenDetails(tokenId) {
  const response = await fetch(`${API_URL}/tokens/${tokenId}`, {
    method: "GET",
    credentials: "include",
  });

  return response.json();
}

export async function cancelToken(tokenId) {
  const response = await fetch(`${API_URL}/tokens/${tokenId}/cancel`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

export async function getOfficePeakHours(officeId) {
  const response = await fetch(
    `${API_URL}/offices/${officeId}/analytics/peak-hours`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return response.json();
}

export async function getMyActiveToken() {
  const response = await fetch(`${API_URL}/tokens/my-active`, {
    method: "GET",
    credentials: "include",
  });

  return response.json();
}