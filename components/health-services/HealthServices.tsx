"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, Building2, Cross, ExternalLink, HeartPulse, LoaderCircle, LocateFixed, MapPin, Navigation, RefreshCw, Search, ShieldCheck, Stethoscope } from "lucide-react";
import type { HealthFacilityCategory, NearbyFacility, NearbyFacilitiesResponse } from "@/types/health-service";

const filters: Array<{ id: HealthFacilityCategory; label: string; icon: typeof Building2 }> = [
  { id: "all", label: "Semua", icon: Search },
  { id: "hospital", label: "Rumah Sakit", icon: Building2 },
  { id: "clinic", label: "Klinik", icon: Stethoscope },
  { id: "puskesmas", label: "Puskesmas", icon: Cross },
];
const labels: Record<NearbyFacility["category"], string> = { hospital: "Rumah Sakit", clinic: "Klinik", puskesmas: "Puskesmas" };

export default function HealthServices() {
  const [category, setCategory] = useState<HealthFacilityCategory>("all");
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [facilities, setFacilities] = useState<NearbyFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadFacilities = useCallback(async (coords: { latitude: number; longitude: number }, nextCategory: HealthFacilityCategory) => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ lat: String(coords.latitude), lng: String(coords.longitude), category: nextCategory });
      const response = await fetch(`/api/health-services/nearby?${params}`, { cache: "no-store" });
      const data = (await response.json()) as NearbyFacilitiesResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Gagal mengambil fasilitas kesehatan.");
      setFacilities(data.facilities ?? []); setMessage(data.message ?? "");
    } catch (err) {
      setFacilities([]); setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat layanan kesehatan.");
    } finally { setLoading(false); }
  }, []);

  const requestLocation = useCallback(() => {
    setError("");
    if (!("geolocation" in navigator)) { setError("Browser ini tidak mendukung akses lokasi."); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const next = { latitude: coords.latitude, longitude: coords.longitude };
      setPosition(next); setLocationLoading(false); await loadFacilities(next, category);
    }, (geoError) => {
      setLocationLoading(false);
      setError(geoError.code === geoError.PERMISSION_DENIED ? "Izin lokasi ditolak. Aktifkan izin lokasi untuk localhost lalu coba lagi." : "Lokasi belum dapat dibaca. Pastikan GPS/lokasi perangkat aktif.");
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 });
  }, [category, loadFacilities]);

  const changeCategory = async (next: HealthFacilityCategory) => { setCategory(next); if (position) await loadFacilities(position, next); };
  const nearest = useMemo(() => facilities.find((f) => f.distanceKm != null)?.distanceKm, [facilities]);
  const nearestLabel = nearest != null ? `${nearest.toFixed(nearest < 10 ? 1 : 0)} km` : "Maps";

  return <div className="health-services-page">
    <section className="health-hero">
      <div className="health-hero-copy">
        <span className="eyebrow"><MapPin size={14}/> UROVA Nearby Care</span>
        <h1>Temukan bantuan <span>di dekatmu.</span></h1>
        <p>UROVA menggunakan lokasi perangkat hanya untuk pencarian saat ini. Fasilitas dicari melalui Gemini yang di-grounding dengan data Google Maps.</p>
        <div className="health-hero-actions">
          <button className="primary-btn health-location-btn" onClick={requestLocation} disabled={locationLoading || loading}>{locationLoading ? <LoaderCircle className="spin" size={18}/> : <LocateFixed size={18}/>} {position ? "Perbarui lokasi" : "Gunakan lokasi saya"}</button>
          {position && <span className="health-location-ok"><ShieldCheck size={15}/> Lokasi berhasil dibaca</span>}
        </div>
      </div>
      <div className="health-map-visual" aria-hidden="true"><div className="map-grid"/><span className="map-road road-a"/><span className="map-road road-b"/><span className="map-road road-c"/><div className="map-user-pin"><Navigation size={20}/><span>Kamu</span></div><div className="map-facility-pin pin-one"><Building2 size={19}/></div><div className="map-facility-pin pin-two"><HeartPulse size={19}/></div><div className="map-facility-pin pin-three"><Cross size={19}/></div><div className="map-distance-card"><strong>{nearestLabel}</strong><span>fasilitas terdekat</span></div></div>
    </section>

    <section className="health-content-section">
      <div className="health-section-head"><div><span className="section-kicker">LAYANAN SEKITAR</span><h2>Cari fasilitas kesehatan</h2></div><div className="health-stats"><div><strong>{facilities.length}</strong><span>ditemukan</span></div><div><strong>{nearestLabel}</strong><span>terdekat</span></div></div></div>
      <div className="health-filter-row">{filters.map(({id,label,icon:Icon}) => <button key={id} className={category===id?"active":""} onClick={()=>changeCategory(id)} disabled={loading}><Icon size={15}/>{label}</button>)}{position && <button className="health-refresh" onClick={()=>loadFacilities(position,category)} disabled={loading}><RefreshCw className={loading?"spin":""} size={15}/>Muat ulang</button>}</div>
      {message && <div className="health-demo-notice"><MapPin size={18}/><div><strong translate="no">Google Maps</strong><p>{message}</p></div></div>}
      {error && <div className="health-error"><AlertTriangle size={18}/><span>{error}</span></div>}
      {!position && !error && <div className="health-empty-state"><div className="health-empty-icon"><LocateFixed size={30}/></div><h3>Lokasi belum diaktifkan</h3><p>Tekan “Gunakan lokasi saya” untuk mencari layanan kesehatan sekitar.</p><button onClick={requestLocation}><LocateFixed size={16}/>Aktifkan lokasi</button></div>}
      {position && loading && <div className="health-loading"><LoaderCircle className="spin" size={26}/><strong>Mencari layanan terdekat…</strong><span>Gemini sedang mencari fasilitas yang relevan dengan Grounding with Google Maps.</span></div>}
      {position && !loading && facilities.length===0 && !error && <div className="health-empty-state"><Search size={28}/><h3>Belum ada hasil pada filter ini</h3><p>Coba pilih “Semua” atau muat ulang pencarian.</p></div>}
      {!loading && facilities.length>0 && <div className="facility-grid">{facilities.map((facility,index)=><FacilityCard key={facility.id} facility={facility} rank={index+1}/>)}</div>}
    </section>

    <div className="health-osm-attribution">Hasil lokal didukung Gemini Grounding with <span translate="no">Google Maps</span>. Detail dapat berubah; verifikasi jam buka, alamat, dan layanan langsung di <span translate="no">Google Maps</span>.</div>
    <section className="health-safety-grid"><article className="health-safety-card emergency"><div className="health-safety-icon"><AlertTriangle size={23}/></div><div><span>DARURAT</span><h3>Gejala berat atau memburuk cepat?</h3><p>Nyeri hebat mendadak, pingsan, perdarahan berat, sulit bernapas, atau kondisi gawat lain perlu pertolongan langsung. Jangan menunggu hasil pencarian online.</p></div></article><article className="health-safety-card"><div className="health-safety-icon"><ShieldCheck size={23}/></div><div><span>PRIVASI</span><h3>Lokasi dipakai hanya untuk pencarian</h3><p>Koordinat dikirim ke endpoint UROVA untuk meminta hasil lokal. UROVA versi ini tidak membuat akun atau riwayat lokasi.</p></div></article></section>
  </div>;
}

function FacilityCard({ facility, rank }: { facility: NearbyFacility; rank: number }) {
  const searchQuery = encodeURIComponent(`${facility.name} ${facility.address}`);
  const mapsUrl = facility.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
  return <article className="facility-card">
    <div className="facility-card-top"><div className="facility-rank">{rank}</div><div className="facility-title"><span>{labels[facility.category]}</span><h3>{facility.name}</h3></div><strong className="facility-distance">{facility.distanceKm != null ? `${facility.distanceKm.toFixed(facility.distanceKm<10?1:0)} km` : "Maps"}</strong></div>
    <div className="facility-address"><MapPin size={15}/><p>{facility.address}</p></div>
    {facility.note && <div className="facility-meta"><span>{facility.note}</span></div>}
    <div className="facility-actions"><a className="facility-primary" href={mapsUrl} target="_blank" rel="noreferrer"><Navigation size={15}/>Buka Google Maps</a>{facility.website && <a href={facility.website} target="_blank" rel="noreferrer"><ExternalLink size={15}/>Website</a>}</div>
  </article>;
}
