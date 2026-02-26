// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AppSettingsProvider } from './contexts/AppSettingsContext.tsx'

// 1. IMPORT AuthProvider yang sudah kita buat
import { AuthProvider } from '@/hooks/useAuth';

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 
      2. TAMBAHKAN AuthProvider DI SINI
      Letakkan di luar AppSettingsProvider agar bisa diakses oleh semua komponen.
    */}
    <AuthProvider>
      <AppSettingsProvider>
        <App />
      </AppSettingsProvider>
    </AuthProvider>
  </React.StrictMode>,
)