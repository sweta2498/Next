const url = "http://192.168.29.118:5500/api"
import axios from "axios"

const new_instance = axios.create({
    baseURL: 'http://192.168.29.118:5500/api',
    timeout: 1000,
    headers: {
        'Accept': 'application/json',

    }
})

export { new_instance, url }
