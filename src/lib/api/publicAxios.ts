import axios from 'axios'

/**
 * Public API client for endpoints that must not require authentication.
 * (e.g. student attendance check pages)
 */
const publicAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default publicAxios
