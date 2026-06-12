import { useState, useEffect } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { supabase } from "../supabaseClient"
import { Link } from "react-router-dom"

import "./datasiswa.css"

export default function DataSiswa() {

  const [nama, setNama] = useState("")
  const [tingkat, setTingkat] = useState("VII")
  const [absen, setAbsen] = useState("")
  const [filterKelas, setFilterKelas] = useState("SEMUA")
  const [data, setData] = useState([])

  async function getData() {
    const { data } = await supabase
      .from("siswa")
      .select()

    setData(data || [])
  }

  async function tambahSiswa() {

    if (!nama.trim() || !absen.trim()) return

    const kelas = `${tingkat}-${absen}`
    const qr_token = crypto.randomUUID()

    const { error } = await supabase
      .from("siswa")
      .insert([
        {
          nama,
          kelas,
          qr_token
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    setNama("")
    setAbsen("")
    getData()
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="page">

      <Link to="/" className="back-btn">
        ⬅ Dashboard
      </Link>

      <h1>Data Siswa</h1>

      <div className="card">

        <input
          placeholder="Nama Siswa"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        {/* PILIH KELAS SAAT INPUT */}
        <select
          value={tingkat}
          onChange={(e) => setTingkat(e.target.value)}
        >
          <option value="VII">Kelas VII</option>
          <option value="VIII">Kelas VIII</option>
          <option value="IX">Kelas IX</option>
          <option value="X">Kelas X</option>
          <option value="XI">Kelas XI</option>
          <option value="XII">Kelas XII</option>
        </select>

        <input
          type="number"
          placeholder="Nomor Absen"
          value={absen}
          onChange={(e) => setAbsen(e.target.value)}
        />

        <button
          onClick={tambahSiswa}
          disabled={!nama.trim() || !absen.trim()}
        >
          Tambah Siswa
        </button>

      </div>

      {/* FILTER DATA SISWA */}
      <div className="card">

        <h3>Filter Kelas</h3>

        <select
          value={filterKelas}
          onChange={(e) => setFilterKelas(e.target.value)}
        >
          <option value="SEMUA">Semua Kelas</option>
          <option value="VII">Kelas VII</option>
          <option value="VIII">Kelas VIII</option>
          <option value="IX">Kelas IX</option>
          <option value="X">Kelas X</option>
          <option value="XI">Kelas XI</option>
          <option value="XII">Kelas XII</option>
        </select>

      </div>

      <div className="grid">

        {data
          .filter((item) => {
            if (filterKelas === "SEMUA") return true
            return item.kelas.startsWith(filterKelas)
          })
          .map((item) => (
            <div className="siswa-card" key={item.id}>

              <h3>{item.nama}</h3>

              <span className="badge">
                {item.kelas}
              </span>

              <QRCodeCanvas
              value={`https://trialpresensiid.vercel.app/absen?token=${item.qr_token}`}
              />

            </div>
          ))}

      </div>

    </div>
  )
}
