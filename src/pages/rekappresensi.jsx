import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { Link } from "react-router-dom"

import "./rekappresensi.css"

export default function RekapPresensi() {

  const [presensi, setPresensi] = useState([])

  async function getPresensi() {

    const { data } = await supabase
      .from("presensi")
      .select(`
        *,
        siswa (
          nama,
          kelas
        )
      `)
      .order("waktu", { ascending:false })

    setPresensi(data || [])
  }

  useEffect(() => {
    getPresensi()
  }, [])

  return (
    <div className="page">

      <Link to="/" className="back-btn">
        ⬅ Dashboard
      </Link>

      <h1>Rekap Presensi</h1>

      {presensi.map((item) => (

        <div
          key={item.id}
          className="presensi-card"
        >

          <h3>{item.siswa?.nama}</h3>

          <p>{item.siswa?.kelas}</p>

          <p>Status : {item.status}</p>

          <p>
            {new Date(item.waktu).toLocaleString()}
          </p>

        </div>

      ))}

    </div>
  )
}