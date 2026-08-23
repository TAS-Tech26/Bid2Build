//api.ts


import axios from 'axios'


export const hubApi = axios.create({baseURL : process.env.HUB_SERVICE_URL || 'http://127.0.0.1:8000/api/'})

export const b2bApi = axios.create({baseURL : process.env.B2B_SERVICE_URL || 'http://127.0.0.1:8002/api/'})


b2bApi.interceptors.request.use((config) => {

        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token")

            if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        
        return Promise.reject(error)
    
    }
)

export default b2bApi