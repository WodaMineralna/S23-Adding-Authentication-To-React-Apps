import { redirect } from "react-router-dom";

export default function getAuthToken() {
  const token = localStorage.getItem("token");
  return token;
}

export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    // or we can just throw an error
    return redirect("/auth");
  }
  
  return null
}
