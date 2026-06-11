import { Link } from "react-router-dom"
import "./dashboard.css"

export default function Dashboard() {

  return (
    <div className="dashboard">

      <h1>Sistem Presensi Sekolah</h1>

      <p>
        Presensi QR Code + GPS
      </p>

      <div className="menu-grid">

        <Link to="/siswa" className="menu-card">
          <h2>Data Siswa</h2>
          <p>Kelola siswa dan QR Code</p>
        </Link>

        <Link to="/scan" className="menu-card">
          <h2>Scan Presensi</h2>
          <p>Scan QR siswa</p>
        </Link>

        <Link to="/presensi" className="menu-card">
          <h2>Rekap Presensi</h2>
          <p>Riwayat kehadiran siswa</p>
        </Link>

      </div>

    </div>
  )
}