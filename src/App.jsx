import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/dashboard"
import DataSiswa from "./pages/datasiswa"
import RekapPresensi from "./pages/rekappresensi"
import ScanQR from "./pages/scanqr"
import Absen from "./pages/absen"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/siswa" element={<DataSiswa />} />
        <Route path="/presensi" element={<RekapPresensi />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/absen" element={<Absen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App