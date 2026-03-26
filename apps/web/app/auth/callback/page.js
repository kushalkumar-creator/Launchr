'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function AuthCallback(){
    const router = useRouter()
    const searchParams = useSearchParams()
    useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
    localStorage.setItem('token', token)  
    router.push('/dashboard')
  }
}, [])
return (
  <div>Signing you in...</div>
)
}
