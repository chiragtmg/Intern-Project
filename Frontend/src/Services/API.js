import axios from "axios";

// frontend and backend connection with axios
export const apiRequest = axios.create({
	baseURL: "http://localhost:4000/api",
	withCredentials: true,
});
