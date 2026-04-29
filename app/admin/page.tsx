"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Award, MapPin, Briefcase, AlertTriangle, 
  Edit2, Trash2, Plus, Save, ArrowLeft, Shield, X, ExternalLink 
} from 'lucide-react';

interface ServiceField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select';
  options?: string[];
  required?: boolean;
}

interface ServiceDocument {
  name: string;
  label: string;
  required?: boolean;
  formats?: string;
}

interface Service {
  id: number;
  name: string;
  icon: string;
  desc: string;
  color: string;
  fields: ServiceField[];
  documents: ServiceDocument[];
}

interface Application {
  id: string;
  ticket: string;
  serviceId: number;
  serviceName: string;
  data: Record<string, string>;
  docs: string[];
  status: 'Pending' | 'Diproses' | 'Selesai';
  date: string;
  submittedAt: string;
}

interface QuickLink {
  id: number;
  name: string;
  url: string;
  icon: string;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    name: "Permohonan KTP Elektronik",
    icon: "Users",
    desc: "Pembuatan atau perpanjangan KTP Elektronik",
    color: "#00f9ff",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text", required: true },
      { name: "nik", label: "NIK (16 Digit)", type: "text", required: true },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text", required: true },
      { name: "tglLahir", label: "Tanggal Lahir", type: "date", required: true },
      { name: "alamat", label: "Alamat Lengkap", type: "text", required: true },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"], required: true },
      { name: "agama", label: "Agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], required: true },
      { name: "email", label: "Email Aktif", type: "email", required: true },
      { name: "noHp", label: "Nomor HP / WA", type: "tel", required: true },
    ],
    documents: [
      { name: "fotoSelfie", label: "Foto Selfie dengan KTP Lama", required: true, formats: "JPG, PNG" },
      { name: "suratRt", label: "Surat Pengantar RT/RW", required: true, formats: "PDF, JPG" },
      { name: "aktaLahir", label: "Scan Akta Kelahiran", required: true, formats: "PDF, JPG" },
      { name: "ijazah", label: "Scan Ijazah / Surat Keterangan Lulus", required: true, formats: "PDF, JPG" },
      { name: "pasFoto", label: "Pas Foto 4x6 (Background Merah/ Biru)", required: true, formats: "JPG" },
    ]
  },
  {
    id: 2,
    name: "Pembuatan Kartu Keluarga (KK)",
    icon: "FileText",
    desc: "Penerbitan Kartu Keluarga Baru atau Perubahan Data",
    color: "#c084fc",
    fields: [
      { name: "namaKepala", label: "Nama Kepala Keluarga", type: "text", required: true },
      { name: "nikKepala", label: "NIK Kepala Keluarga", type: "text", required: true },
      { name: "jumlahAnggota", label: "Jumlah Anggota Keluarga", type: "text", required: true },
      { name: "alamat", label: "Alamat Lengkap", type: "text", required: true },
      { name: "kodePos", label: "Kode Pos", type: "text", required: true },
      { name: "noHp", label: "Nomor HP Penanggung Jawab", type: "tel", required: true },
      { name: "hubungan", label: "Hubungan dengan Kepala Keluarga", type: "select", options: ["Kepala Keluarga", "Istri/Suami", "Anak", "Lainnya"], required: true },
    ],
    documents: [
      { name: "suratNikah", label: "Scan Buku Nikah / Akta Cerai", required: true, formats: "PDF, JPG" },
      { name: "aktaAnak", label: "Scan Akta Kelahiran Anak", required: true, formats: "PDF, JPG" },
      { name: "ktpLama", label: "Scan KTP Lama (jika ada)", required: false, formats: "PDF, JPG" },
      { name: "suratRt", label: "Surat Pengantar RT/RW", required: true, formats: "PDF, JPG" },
      { name: "formulir", label: "Formulir Permohonan KK (diisi)", required: true, formats: "PDF" },
    ]
  },
  {
    id: 3,
    name: "Akta Kelahiran Baru",
    icon: "Award",
    desc: "Penerbitan Akta Kelahiran untuk Bayi Baru Lahir",
    color: "#4ade80",
    fields: [
      { name: "namaAnak", label: "Nama Lengkap Anak", type: "text", required: true },
      { name: "tglLahir", label: "Tanggal Lahir", type: "date", required: true },
      { name: "tempatLahir", label: "Tempat Lahir (RS/Klinik)", type: "text", required: true },
      { name: "namaAyah", label: "Nama Ayah", type: "text", required: true },
      { name: "nikAyah", label: "NIK Ayah", type: "text", required: true },
      { name: "namaIbu", label: "Nama Ibu", type: "text", required: true },
      { name: "nikIbu", label: "NIK Ibu", type: "text", required: true },
      { name: "alamat", label: "Alamat Orang Tua", type: "text", required: true },
    ],
    documents: [
      { name: "suratLahir", label: "Surat Keterangan Lahir dari RS/Bidan", required: true, formats: "PDF, JPG" },
      { name: "ktpAyah", label: "Scan KTP Ayah", required: true, formats: "PDF, JPG" },
      { name: "ktpIbu", label: "Scan KTP Ibu", required: true, formats: "PDF, JPG" },
      { name: "bukuNikah", label: "Scan Buku Nikah Orang Tua", required: true, formats: "PDF, JPG" },
      { name: "suratRt", label: "Surat Pengantar RT/RW", required: true, formats: "PDF, JPG" },
    ]
  },
  {
    id: 4,
    name: "Surat Keterangan Pindah Domisili",
    icon: "MapPin",
    desc: "Pengurusan Surat Pindah Antar Kabupaten/Kota",
    color: "#fb923c",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text", required: true },
      { name: "nik", label: "NIK", type: "text", required: true },
      { name: "alamatAsal", label: "Alamat Asal", type: "text", required: true },
      { name: "alamatTujuan", label: "Alamat Tujuan", type: "text", required: true },
      { name: "alasanPindah", label: "Alasan Pindah", type: "select", options: ["Pekerjaan", "Pendidikan", "Keluarga", "Lainnya"], required: true },
      { name: "noHp", label: "Nomor HP", type: "tel", required: true },
    ],
    documents: [
      { name: "ktp", label: "Scan KTP", required: true, formats: "PDF, JPG" },
      { name: "kk", label: "Scan Kartu Keluarga", required: true, formats: "PDF, JPG" },
      { name: "suratRtAsal", label: "Surat Keterangan Pindah dari RT Asal", required: true, formats: "PDF, JPG" },
      { name: "suratRtTujuan", label: "Surat Keterangan dari RT Tujuan", required: false, formats: "PDF, JPG" },
      { name: "suratKerja", label: "Surat Keterangan Kerja / Sekolah (jika ada)", required: false, formats: "PDF, JPG" },
    ]
  },
  {
    id: 5,
    name: "Izin Usaha Mikro Kecil (IUMK)",
    icon: "Briefcase",
    desc: "Penerbitan Izin Usaha untuk UMKM",
    color: "#e879f9",
    fields: [
      { name: "namaUsaha", label: "Nama Usaha", type: "text", required: true },
      { name: "namaPemilik", label: "Nama Pemilik", type: "text", required: true },
      { name: "nik", label: "NIK Pemilik", type: "text", required: true },
      { name: "alamatUsaha", label: "Alamat Usaha", type: "text", required: true },
      { name: "jenisUsaha", label: "Jenis Usaha", type: "select", options: ["Kuliner", "Fashion", "Jasa", "Pertanian", "Teknologi", "Lainnya"], required: true },
      { name: "modal", label: "Modal Usaha (Rp)", type: "text", required: true },
      { name: "noHp", label: "Nomor HP/WhatsApp", type: "tel", required: true },
      { name: "email", label: "Email Usaha", type: "email", required: false },
    ],
    documents: [
      { name: "ktp", label: "Scan KTP Pemilik", required: true, formats: "PDF, JPG" },
      { name: "kk", label: "Scan KK Pemilik", required: true, formats: "PDF, JPG" },
      { name: "suratRt", label: "Surat Keterangan Usaha dari RT/RW", required: true, formats: "PDF, JPG" },
      { name: "fotoUsaha", label: "Foto Lokasi Usaha (minimal 3)", required: true, formats: "JPG, PNG" },
      { name: "npwp", label: "NPWP (jika sudah ada)", required: false, formats: "PDF" },
    ]
  },
  {
    id: 6,
    name: "Pengaduan Layanan Publik",
    icon: "AlertTriangle",
    desc: "Sampaikan Keluhan atau Aspirasi Anda",
    color: "#f87171",
    fields: [
      { name: "nama", label: "Nama Lengkap (Opsional)", type: "text", required: false },
      { name: "noHp", label: "Nomor HP / WA", type: "tel", required: true },
      { name: "email", label: "Email", type: "email", required: false },
      { name: "kategori", label: "Kategori Pengaduan", type: "select", options: ["Pelayanan KTP/KK", "Akta Kelahiran", "Perizinan", "Infrastruktur", "Kesehatan", "Pendidikan", "Lainnya"], required: true },
      { name: "judul", label: "Judul Pengaduan", type: "text", required: true },
      { name: "deskripsi", label: "Deskripsi Lengkap Pengaduan", type: "text", required: true },
    ],
    documents: [
      { name: "bukti1", label: "Foto/Video Bukti 1", required: true, formats: "JPG, PNG, MP4" },
      { name: "bukti2", label: "Foto/Video Bukti 2", required: false, formats: "JPG, PNG, MP4" },
      { name: "suratDukungan", label: "Surat Dukungan Warga (jika ada)", required: false, formats: "PDF" },
      { name: "ktp", label: "Scan KTP Pelapor (jika ingin identitas terverifikasi)", required: false, formats: "PDF, JPG" },
      { name: "lainnya", label: "Dokumen Pendukung Lainnya", required: false, formats: "PDF, JPG" },
    ]
  }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'quicklinks' | 'submissions'>('services');
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([
    { id: 1, name: "Portal E-Government", url: "https://www.indonesia.go.id", icon: "🌐" },
    { id: 2, name: "Sistem Dukcapil Digital", url: "https://dukcapil.kemendagri.go.id", icon: "🪪" },
    { id: 3, name: "e-Filing Pajak Online", url: "https://www.pajak.go.id", icon: "💰" },
    { id: 4, name: "BPJS Kesehatan & Ketenagakerjaan", url: "https://www.bpjs-kesehatan.go.id", icon: "🏥" },
    { id: 5, name: "Layanan Perizinan OSS", url: "https://oss.go.id", icon: "📋" },
    { id: 6, name: "Siap Kerja & Pelatihan", url: "https://siapkerja.kemnaker.go.id", icon: "💼" },
    { id: 7, name: "Pengaduan 24 Jam SP4N", url: "https://www.lapor.go.id", icon: "📢" },
    { id: 8, name: "Sistem Informasi Desa", url: "https://www.kemendesa.go.id", icon: "🏘️" },
  ]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingField, setEditingField] = useState<{ serviceId: number; fieldIndex: number } | null>(null);
  const [editingDoc, setEditingDoc] = useState<{ serviceId: number; docIndex: number } | null>(null);
  const [newField, setNewField] = useState<ServiceField>({ name: '', label: '', type: 'text', required: true });
  const [newDoc, setNewDoc] = useState<ServiceDocument>({ name: '', label: '', required: true, formats: 'PDF, JPG' });
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [newLink, setNewLink] = useState({ name: '', url: '', icon: '🔗' });
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: '', desc: '', color: '#00f9ff' });

  useEffect(() => {
    const savedApps = localStorage.getItem('simpel_applications');
    if (savedApps) setApplications(JSON.parse(savedApps));

    const savedServices = localStorage.getItem('simpel_services');
    if (savedServices) setServices(JSON.parse(savedServices));

    const savedLinks = localStorage.getItem('simpel_quicklinks');
    if (savedLinks) setQuickLinks(JSON.parse(savedLinks));
  }, []);

  useEffect(() => {
    localStorage.setItem('simpel_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('simpel_quicklinks', JSON.stringify(quickLinks));
  }, [quickLinks]);

  const handleLogin = () => {
    if (password === 'simpel2026') {
      setIsAuthenticated(true);
    } else {
      alert('Password salah!');
    }
  };

  const updateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    setEditingService(null);
  };

  const addField = (serviceId: number) => {
    if (!newField.name || !newField.label) {
      alert('Nama dan Label field wajib diisi!');
      return;
    }
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return { ...s, fields: [...s.fields, { ...newField }] };
      }
      return s;
    }));
    setNewField({ name: '', label: '', type: 'text', required: true });
  };

  const removeField = (serviceId: number, fieldIndex: number) => {
    if (!confirm('Hapus field ini?')) return;
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return { ...s, fields: s.fields.filter((_, i) => i !== fieldIndex) };
      }
      return s;
    }));
  };

  const addDocument = (serviceId: number) => {
    if (!newDoc.name || !newDoc.label) {
      alert('Nama dan Label dokumen wajib diisi!');
      return;
    }
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return { ...s, documents: [...s.documents, { ...newDoc }] };
      }
      return s;
    }));
    setNewDoc({ name: '', label: '', required: true, formats: 'PDF, JPG' });
  };

  const removeDocument = (serviceId: number, docIndex: number) => {
    if (!confirm('Hapus dokumen ini?')) return;
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return { ...s, documents: s.documents.filter((_, i) => i !== docIndex) };
      }
      return s;
    }));
  };

  const addService = () => {
    if (!newService.name || !newService.desc) {
      alert('Nama dan Deskripsi wajib diisi!');
      return;
    }
    const newId = Math.max(0, ...services.map(s => s.id)) + 1;
    const service: Service = {
      id: newId,
      name: newService.name,
      icon: "Users",
      desc: newService.desc,
      color: newService.color,
      fields: [],
      documents: []
    };
    setServices(prev => [...prev, service]);
    setNewService({ name: '', desc: '', color: '#00f9ff' });
    setShowAddService(false);
  };

  const deleteService = (id: number) => {
    if (!confirm('Hapus layanan ini?')) return;
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateQuickLink = (link: QuickLink) => {
    setQuickLinks(prev => prev.map(l => l.id === link.id ? link : l));
    setEditingLink(null);
  };

  const addQuickLink = () => {
    if (!newLink.name || !newLink.url) {
      alert('Nama dan URL wajib diisi!');
      return;
    }
    const newId = Math.max(0, ...quickLinks.map(l => l.id)) + 1;
    setQuickLinks(prev => [...prev, { id: newId, ...newLink }]);
    setNewLink({ name: '', url: '', icon: '🔗' });
  };

  const deleteQuickLink = (id: number) => {
    if (!confirm('Hapus tombol ini?')) return;
    setQuickLinks(prev => prev.filter(l => l.id !== id));
  };

  const updateApplicationStatus = (id: string, newStatus: 'Pending' | 'Diproses' | 'Selesai') => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="glass rounded-3xl p-12 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-zinc-400 mt-2">Masukkan password untuk masuk</p>
          </div>

          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password Admin"
            className="w-full bg-black border border-white/20 rounded-2xl px-6 py-4 text-center font-mono tracking-[3px] focus:border-purple-400 outline-none mb-4"
          />
          
          <button 
            onClick={handleLogin}
            className="w-full py-4 rounded-2xl bg-white text-black font-semibold tracking-wider hover:bg-zinc-200 transition-all"
          >
            MASUK KE DASHBOARD
          </button>
          
          <div className="text-center text-[10px] text-zinc-500 mt-6">Password: simpel2026</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-sm hover:text-cyan-400">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Website
            </button>
            <div className="h-6 w-px bg-white/20 mx-4" />
            <div>
              <div className="font-semibold text-2xl">Admin Dashboard</div>
              <div className="text-xs text-zinc-400">Sistem Pelayanan Digital SIMPEL</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-emerald-400">● Online</div>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/5">Logout</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex border-b border-white/10">
          {[
            { key: 'services', label: 'Kelola Layanan', icon: Users },
            { key: 'quicklinks', label: 'Akses Cepat', icon: ExternalLink },
            { key: 'submissions', label: 'Data Pengajuan', icon: FileText }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-8 py-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${activeTab === tab.key ? 'border-cyan-400 text-white' : 'border-transparent text-zinc-400'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-4xl font-bold tracking-tight">Kelola Layanan</div>
                <div className="text-zinc-400">Edit semua field, dokumen, dan pengaturan layanan</div>
              </div>
              <button 
                onClick={() => setShowAddService(true)}
                className="px-6 py-3 rounded-2xl bg-white text-black font-semibold flex items-center gap-2 hover:bg-zinc-200"
              >
                <Plus className="w-4 h-4" /> Tambah Layanan
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div key={index} className="glass rounded-3xl p-8 border border-white/10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${service.color}20`, color: service.color }}
                      >
                        {service.icon === "Users" && <Users className="w-8 h-8" />}
                        {service.icon === "FileText" && <FileText className="w-8 h-8" />}
                        {service.icon === "Award" && <Award className="w-8 h-8" />}
                        {service.icon === "MapPin" && <MapPin className="w-8 h-8" />}
                        {service.icon === "Briefcase" && <Briefcase className="w-8 h-8" />}
                        {service.icon === "AlertTriangle" && <AlertTriangle className="w-8 h-8" />}
                      </div>
                      <div>
                        <div className="font-semibold text-2xl">{service.name}</div>
                        <div className="text-sm text-zinc-400 mt-1">{service.desc}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingService(service)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-2 text-sm"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => deleteService(service.id)}
                        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs uppercase tracking-widest text-zinc-500">FIELD FORM ({service.fields.length})</div>
                      <button 
                        onClick={() => setEditingField({ serviceId: service.id, fieldIndex: -1 })}
                        className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Field
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.fields.map((f, i) => (
                        <div key={i} className="bg-white/5 px-3 py-1 rounded-full text-xs flex items-center gap-2 group">
                          {f.label}
                          <button onClick={() => removeField(service.id, i)} className="opacity-0 group-hover:opacity-100 text-red-400">×</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs uppercase tracking-widest text-zinc-500">DOKUMEN ({service.documents.length})</div>
                      <button 
                        onClick={() => setEditingDoc({ serviceId: service.id, docIndex: -1 })}
                        className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Dokumen
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.documents.map((d, i) => (
                        <div key={i} className="bg-white/5 px-3 py-1 rounded-full text-xs flex items-center gap-2 group">
                          {d.label}
                          <button onClick={() => removeDocument(service.id, i)} className="opacity-0 group-hover:opacity-100 text-red-400">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUICK LINKS TAB */}
        {activeTab === 'quicklinks' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-4xl font-bold tracking-tight">Kelola Akses Cepat</div>
                <div className="text-zinc-400">Tambah, edit, atau hapus tombol portal</div>
              </div>
            </div>

            <div className="glass rounded-3xl p-8 border border-white/10">
              <div className="text-sm uppercase tracking-widest text-purple-400 mb-4">TAMBAH TOMBOL BARU</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input 
                  type="text" 
                  placeholder="Nama Tombol" 
                  value={newLink.name}
                  onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                  className="bg-black/70 border border-white/20 rounded-xl px-5 py-3 text-sm"
                />
                <input 
                  type="text" 
                  placeholder="Emoji" 
                  value={newLink.icon}
                  onChange={(e) => setNewLink({...newLink, icon: e.target.value})}
                  className="bg-black/70 border border-white/20 rounded-xl px-5 py-3 text-sm text-center"
                />
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={newLink.url}
                    onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                    className="flex-1 bg-black/70 border border-white/20 rounded-xl px-5 py-3 text-sm"
                  />
                  <button 
                    onClick={addQuickLink}
                    className="px-6 py-3 rounded-xl bg-white text-black font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm uppercase tracking-widest text-zinc-500 mb-4">DAFTAR TOMBOL AKTIF ({quickLinks.length})</div>
              
              <div className="space-y-3">
                {quickLinks.map(link => (
                  <div key={link.id} className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors rounded-2xl px-6 py-5 group">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{link.icon}</div>
                      <div>
                        <div className="font-medium text-lg">{link.name}</div>
                        <div className="text-xs text-zinc-500 font-mono">{link.url}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingLink(link)}
                        className="p-3 hover:bg-white/10 rounded-xl"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteQuickLink(link.id)}
                        className="p-3 hover:bg-red-500/20 text-red-400 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBMISSIONS TAB */}
        {activeTab === 'submissions' && (
          <div>
            <div className="text-4xl font-bold tracking-tight mb-8">Data Pengajuan</div>
            
            <div className="glass rounded-3xl overflow-hidden border border-white/10">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-medium text-zinc-400">Tiket</th>
                    <th className="px-8 py-5 text-left text-sm font-medium text-zinc-400">Layanan</th>
                    <th className="px-8 py-5 text-left text-sm font-medium text-zinc-400">Pemohon</th>
                    <th className="px-8 py-5 text-left text-sm font-medium text-zinc-400">Tanggal</th>
                    <th className="px-8 py-5 text-left text-sm font-medium text-zinc-400">Status</th>
                    <th className="px-8 py-5 text-left text-sm font-medium text-zinc-400">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center text-zinc-400">Belum ada pengajuan</td>
                    </tr>
                  ) : (
                    applications.map((app, index) => (
                      <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-8 py-5 font-mono text-sm text-cyan-400">{app.ticket}</td>
                        <td className="px-8 py-5">{app.serviceName}</td>
                        <td className="px-8 py-5">{app.data.nama || app.data.namaKepala || '-'}</td>
                        <td className="px-8 py-5 text-sm text-zinc-400">{app.date}</td>
                        <td className="px-8 py-5">
                          <select 
                            value={app.status} 
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                            className="bg-black border border-white/20 rounded-full px-4 py-1 text-xs outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Selesai">Selesai</option>
                          </select>
                        </td>
                        <td className="px-8 py-5">
                          <button className="text-xs px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/5">Detail</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* EDIT SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4">
          <div className="glass rounded-3xl p-9 w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="text-3xl font-semibold tracking-tight">Edit Layanan</div>
              <button onClick={() => setEditingService(null)} className="text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nama Layanan</label>
                <input 
                  type="text" 
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Deskripsi</label>
                <textarea 
                  value={editingService.desc}
                  onChange={(e) => setEditingService({...editingService, desc: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3 h-24"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Warna Card (Hex)</label>
                <input 
                  type="text" 
                  value={editingService.color}
                  onChange={(e) => setEditingService({...editingService, color: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                />
              </div>

              <button 
                onClick={() => updateService(editingService)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {showAddService && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4">
          <div className="glass rounded-3xl p-9 w-full max-w-lg border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div className="text-3xl font-semibold tracking-tight">Tambah Layanan Baru</div>
              <button onClick={() => setShowAddService(false)} className="text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nama Layanan</label>
                <input 
                  type="text" 
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                  placeholder="Contoh: Layanan Baru"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Deskripsi</label>
                <textarea 
                  value={newService.desc}
                  onChange={(e) => setNewService({...newService, desc: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3 h-24"
                  placeholder="Deskripsi singkat layanan..."
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Warna Card (Hex)</label>
                <input 
                  type="text" 
                  value={newService.color}
                  onChange={(e) => setNewService({...newService, color: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                  placeholder="#00f9ff"
                />
              </div>

              <button 
                onClick={addService}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> TAMBAH LAYANAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIELD EDITOR MODAL */}
      {editingField && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4">
          <div className="glass rounded-3xl p-9 w-full max-w-lg border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div className="text-3xl font-semibold tracking-tight">Tambah Field Baru</div>
              <button onClick={() => setEditingField(null)} className="text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nama Field (untuk data)</label>
                <input 
                  type="text" 
                  value={newField.name}
                  onChange={(e) => setNewField({...newField, name: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                  placeholder="contoh: namaLengkap"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Label (yang ditampilkan)</label>
                <input 
                  type="text" 
                  value={newField.label}
                  onChange={(e) => setNewField({...newField, label: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                  placeholder="Nama Lengkap"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Tipe Input</label>
                  <select 
                    value={newField.type}
                    onChange={(e) => setNewField({...newField, type: e.target.value as any})}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Telepon</option>
                    <option value="date">Tanggal</option>
                    <option value="select">Select (Pilihan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Wajib Diisi?</label>
                  <select 
                    value={newField.required ? 'true' : 'false'}
                    onChange={(e) => setNewField({...newField, required: e.target.value === 'true'})}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                  >
                    <option value="true">Ya, Wajib</option>
                    <option value="false">Tidak, Opsional</option>
                  </select>
                </div>
              </div>

              {newField.type === 'select' && (
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Opsi Pilihan (pisahkan dengan koma)</label>
                  <input 
                    type="text" 
                    value={newField.options?.join(', ') || ''}
                    onChange={(e) => setNewField({...newField, options: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                    placeholder="Laki-laki, Perempuan"
                  />
                </div>
              )}

              <button 
                onClick={() => {
                  if (editingField) {
                    addField(editingField.serviceId);
                    setEditingField(null);
                  }
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> TAMBAHKAN FIELD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT EDITOR MODAL */}
      {editingDoc && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4">
          <div className="glass rounded-3xl p-9 w-full max-w-lg border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div className="text-3xl font-semibold tracking-tight">Tambah Dokumen Baru</div>
              <button onClick={() => setEditingDoc(null)} className="text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nama Dokumen (untuk data)</label>
                <input 
                  type="text" 
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                  placeholder="contoh: fotoSelfie"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Label (yang ditampilkan)</label>
                <input 
                  type="text" 
                  value={newDoc.label}
                  onChange={(e) => setNewDoc({...newDoc, label: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                  placeholder="Foto Selfie dengan KTP Lama"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Wajib Diisi?</label>
                  <select 
                    value={newDoc.required ? 'true' : 'false'}
                    onChange={(e) => setNewDoc({...newDoc, required: e.target.value === 'true'})}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                  >
                    <option value="true">Ya, Wajib</option>
                    <option value="false">Tidak, Opsional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Format File</label>
                  <input 
                    type="text" 
                    value={newDoc.formats || ''}
                    onChange={(e) => setNewDoc({...newDoc, formats: e.target.value})}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-5 py-3"
                    placeholder="PDF, JPG, PNG"
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  if (editingDoc) {
                    addDocument(editingDoc.serviceId);
                    setEditingDoc(null);
                  }
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> TAMBAHKAN DOKUMEN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
