import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
})

api.interceptors.response.use(
    response => response.data,
    error => {
        const message = error.response?.data?.message || "Something went wrong";
        throw new Error(message);
    }
);

export default api as unknown as {
    get: <T = any>(url: string) => Promise<T>;
    post: <T = any>(url: string, data?: any) => Promise<T>;
    put: <T = any>(url: string, data?: any) => Promise<T>;
    patch: <T = any>(url: string, data?: any) => Promise<T>;
    delete: <T = any>(url: string) => Promise<T>;
};
