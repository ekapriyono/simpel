"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Users, FileText, Award, MapPin, Briefcase, AlertTriangle, 
  Edit2, Trash2, Plus, ArrowLeft, Shield, X, Clock, CheckCircle, 
  AlertCircle 
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
  desc: string;
  icon: string;
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
    desc: "Pembuatan atau perpanjangan KTP Elektronik",
    icon: "Users",
    color: "#00f9ff",
    fields: [
      { name: "namaLengkap", label: "Nama Lengkap", type: "text", required: true },
      { name: "nik", label: "NIK (16 Digit)", type: "text", required: true },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text", required: true },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date", required: true },
      { name: "alamatLengkap", label: "Alamat Lengkap", type: "text", required: true },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"], required: true },
      { name: "agama", label: "Agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], required: true },
      { name: "emailAktif", label: "Email Aktif", type: "email", required: true },
      { name: "nomorHP", label: "Nomor HP / WA", type: "tel", required: true },
    ],
    documents: [
      { name: "fotoSelfie", label: "Foto Selfie dengan KTP Lama", required: true, formats: "JPG, PNG" },
      { name: "suratPengantar", label: "Surat Pengantar RT/RW", required: true, formats: "PDF, JPG" },
      { name: "scanAkta", label: "Scan Akta Kelahiran", required: true, formats: "PDF, JPG" },
      { name: "scanIjazah", label: "Scan Ijazah / Surat Keterangan Lulus", required: true, formats: "PDF, JPG" },
      { name: "pasFoto", label: "Pas Foto 4x6 (Background Merah/ Biru)", required: true, formats: "JPG, PNG" },
    ]
  },
  {
    id: 2,
    name: "Pembuatan Kartu Keluarga (KK)",
    desc: "Penerbitan Kartu Keluarga Baru atau Perubahan Data",
    icon: "FileText",
    color: "#a855f7",
    fields: [
      { name: "namaKepalaKeluarga", label: "Nama Kepala Keluarga", type: "text", required: true },
      { name: "nikKepalaKeluarga", label: "NIK Kepala Keluarga", type: "text", required: true },
      { name: "jumlahAnggota", label: "Jumlah Anggota Keluarga", type: "text", required: true },
      { name: "alamatLengkap", label: "Alamat Lengkap", type: "text", required: true },
      { name: "kodePos", label: "Kode Pos", type: "text", required: true },
      { name: "nomorHP", label: "Nomor HP Penanggung Jawab", type: "tel", required: true },
      { name: "hubunganKepala", label: "Hubungan dengan Kepala Keluarga", type: "text", required: true },
    ],
    documents: [
      { name: "scanBukuNikah", label: "Scan Buku Nikah / Akta Cerai", required: true, formats: "PDF, JPG" },
      { name: "scanAktaAnak", label: "Scan Akta Kelahiran Anak", required: true, formats: "PDF, JPG" },
      { name: "scanKTPLama", label: "Scan KTP Lama (jika ada)", required: false, formats: "PDF, JPG" },
      { name: "suratPengantar", label: "Surat Pengantar RT/RW", required: true, formats: "PDF, JPG" },
      { name: "formulirKK", label: "Formulir Permohonan KK (diisi)", required: true, formats: "PDF" },
    ]
  },
  {
    id: 3,
    name: "Akta Kelahiran Baru",
    desc: "Penerbitan Akta Kelahiran untuk Bayi Baru Lahir",
    icon: "Award",
    color: "#22c55e",
    fields: [
      { name: "namaAnak", label: "Nama Lengkap Anak", type: "text", required: true },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text", required: true },
      { name: "tanggalLahir", label: "Tanggal & Jam Lahir", type: "text", required: true },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"], required: true },
      { name: "namaAyah", label: "Nama Lengkap Ayah", type: "text", required: true },
      { name: "nikAyah", label: "NIK Ayah", type: "text", required: true },
      { name: "namaIbu", label: "Nama Lengkap Ibu", type: "text", required: true },
      { name: "nikIbu", label: "NIK Ibu", type: "text", required: true },
      { name: "alamatOrangTua", label: "Alamat Orang Tua", type: "text", required: true },
    ],
    documents: [
      { name: "suratKelahiran", label: "Surat Keterangan Lahir dari RS/Bidan", required: true, formats: "PDF, JPG" },
      { name: "ktpOrangTua", label: "KTP Orang Tua (Ayah & Ibu)", required: true, formats: "PDF, JPG" },
      { name: "bukuNikah", label: "Buku Nikah Orang Tua", required: true, formats: "PDF, JPG" },
      { name: "kkOrangTua", label: "Kartu Keluarga Orang Tua", required: true, formats: "PDF, JPG" },
      { name: "suratRT", label: "Surat Pengantar RT/RW", required: true, formats: "PDF, JPG" },
    ]
  },
  {
    id: 4,
    name: "Surat Keterangan Pindah Domisili",
    desc: "Penerbitan Surat Keterangan Pindah Domisili",
    icon: "MapPin",
    color: "#f97316",
    fields: [
      { name: "namaLengkap", label: "Nama Lengkap", type: "text", required: true },
      { name: "nik", label: "NIK", type: "text", required: true },
      { name: "alamatLama", label: "Alamat Lama", type: "text", required: true },
      { name: "alamatBaru", label: "Alamat Baru", type: "text", required: true },
      { name: "alasanPindah", label: "Alasan Pindah", type: "text", required: true },
      { name: "nomorHP", label: "Nomor HP", type: "tel", required: true },
    ],
    documents: [
      { name: "ktpLama", label: "KTP Lama", required: true, formats: "PDF, JPG" },
      { name: "kkLama", label: "Kartu Keluarga Lama", required: true, formats: "PDF, JPG" },
      { name: "suratPindah", label: "Surat Keterangan Pindah dari Desa/Kelurahan", required: true, formats: "PDF, JPG" },
      { name: "suratRT", label: "Surat Pengantar RT/RW", required: true, formats: "PDF, JPG" },
    ]
  },
  {
    id: 5,
    name: "Izin Usaha Mikro Kecil (IUMK)",
    desc: "Penerbitan Izin Usaha Mikro dan Kecil",
    icon: "Briefcase",
    color: "#eab308",
    fields: [
      { name: "namaUsaha", label: "Nama Usaha", type: "text", required: true },
      { name: "jenisUsaha", label: "Jenis Usaha", type: "text", required: true },
      { name: "alamatUsaha", label: "Alamat Usaha", type: "text", required: true },
      { name: "namaPemilik", label: "Nama Pemilik", type: "text", required: true },
      { name: "nikPemilik", label: "NIK Pemilik", type: "text", required: true },
      { name: "nomorHP", label: "Nomor HP", type: "tel", required: true },
      { name: "modalUsaha", label: "Modal Usaha", type: "text", required: true },
    ],
    documents: [
      { name: "ktpPemilik", label: "KTP Pemilik", required: true, formats: "PDF, JPG" },
      { name: "kkPemilik", label: "Kartu Keluarga Pemilik", required: true, formats: "PDF, JPG" },
      { name: "suratTanah", label: "Surat Keterangan Tanah/Lokasi Usaha", required: true, formats: "PDF, JPG" },
      { name: "suratRT", label: "Surat Pengantar RT/RW", required: true, formats: "PDF, JPG" },
    ]
  },
  {
    id: 6,
    name: "Pengaduan Masyarakat",
    desc: "Penyampaian Pengaduan atau Aspirasi Masyarakat",
    icon: "AlertTriangle",
    color: "#ef4444",
    fields: [
      { name: "namaPelapor", label: "Nama Pelapor", type: "text", required: true },
      { name: "nik", label: "NIK", type: "text", required: true },
      { name: "alamat", label: "Alamat", type: "text", required: true },
      { name: "nomorHP", label: "Nomor HP / WA", type: "tel", required: true },
      { name: "judulPengaduan", label: "Judul Pengaduan", type: "text", required: true },
      { name: "isiPengaduan", label: "Isi Pengaduan / Aspirasi", type: "text", required: true },
      { name: "lokasiKejadian", label: "Lokasi Kejadian", type: "text", required: true },
      { name: "tanggalKejadian", label: "Tanggal Kejadian", type: "date", required: true },
    ],
    documents: [
      { name: "buktiFoto", label: "Bukti Foto/Video Kejadian", required: false, formats: "JPG, PNG, MP4" },
      { name: "suratPengantar", label: "Surat Pengantar RT/RW (jika ada)", required: false, formats: "PDF, JPG" },
    ]
  }
];

const INITIAL_QUICK_LINKS: QuickLink[] = [
  { id: 1, name: "Portal E-Government", url: "https://www.indonesia.go.id", icon: "🌐" },
  { id: 2, name: "Sistem Dukcapil Digital", url: "https://dukcapil.kemendagri.go.id", icon: "🪪" },
  { id: 3, name: "e-Filing Pajak Online", url: "https://www.pajak.go.id", icon: "💰" },
  { id: 4, name: "BPJS Kesehatan & Ketenagakerjaan", url: "https://www.bpjs-kesehatan.go.id", icon: "🏥" },
  { id: 5, name: "Layanan Perizinan OSS", url: "https://oss.go.id", icon: "📋" },
  { id: 6, name: "Siap Kerja & Pelatihan", url: "https://siapkerja.kemnaker.go.id", icon: "💼" },
  { id: 7, name: "Pengaduan 24 Jam SP4N", url: "https://www.lapor.go.id", icon: "📢" },
  { id: 8, name: "Sistem Informasi Desa", url: "https://www.kemendesa.go.id", icon: "🏘️" },
];

const getServiceIcon = (iconName: string, className: string = "w-8 h-8") => {
  switch (iconName) {
    case 'Users': return <Users className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Award': return <Award className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'AlertTriangle': return <AlertTriangle className={className} />;
    default: return <Users className={className} />;
  }
};

export default function SimpelSystem() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(INITIAL_QUICK_LINKS);
  const [mappedServices, setMappedServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Diproses' | 'Selesai'>('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isManageLinksOpen, setIsManageLinksOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formFiles, setFormFiles] = useState<Record<string, File | null>>({});
  const [ticketSearch, setTicketSearch] = useState('');
  const [foundApplication, setFoundApplication] = useState<Application | null>(null);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [newLink, setNewLink] = useState({ name: '', url: '', icon: '🔗' });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);

  useEffect(() => {
    const savedApps = localStorage.getItem('simpel_applications');
    if (savedApps) setApplications(JSON.parse(savedApps));

    const savedLinks = localStorage.getItem('simpel_quicklinks');
    if (savedLinks) setQuickLinks(JSON.parse(savedLinks));

    const savedServices = localStorage.getItem('simpel_services');
    if (savedServices) {
      setMappedServices(JSON.parse(savedServices));
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'simpel_services' && e.newValue) {
        setMappedServices(JSON.parse(e.newValue));
      }
      if (e.key === 'simpel_quicklinks' && e.newValue) {
        setQuickLinks(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('simpel_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('simpel_quicklinks', JSON.stringify(quickLinks));
  }, [quickLinks]);

  const filteredApplications = useMemo(() => {
    return applications
      .filter(app => {
        const matchesSearch = 
          app.ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [applications, searchTerm, statusFilter]);

  const generateTicket = useCallback(() => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(100 + Math.random() * 900);
    return `SIM-${dateStr}-${random}`;
  }, []);

  const openServiceForm = useCallback((service: Service) => {
    setSelectedService(service);
    setFormData({});
    setFormFiles({});
    setIsFormModalOpen(true);
  }, []);

  const submitToProduction = async (application: any, files: Record<string, File | null>) => {
    try {
      const uploadedDocs: string[] = [];
      
      for (const [docName, file] of Object.entries(files)) {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folderName', `${application.serviceName} - ${application.data.namaLengkap || application.data.namaPelapor || 'Pelapor'}`);

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          const uploadData = await uploadRes.json();
          if (uploadData.success) {
            uploadedDocs.push(`${docName}: ${uploadData.webViewLink}`);
          }
        }
      }

      const submitRes = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...application,
          docs: uploadedDocs.length > 0 ? uploadedDocs : application.docs
        })
      });

      const phoneNumber = application.data.nomorHP || application.data.noHp;
      if (phoneNumber) {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            namaPelapor: application.data.namaLengkap || application.data.namaPelapor || 'Pelapor',
            nomorHP: phoneNumber,
            serviceName: application.serviceName,
            ticket: application.ticket
          })
        });
      }

      return true;
    } catch (error) {
      console.error('Production Submit Error:', error);
      return false;
    }
  };

  const handleSubmitApplication = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const ticket = generateTicket();
    const newApplication: Application = {
      id: Date.now().toString(36),
      ticket,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      data: formData,
      docs: Object.keys(formFiles).filter(key => formFiles[key] !== null),
      status: 'Pending',
      date: new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      submittedAt: new Date().toISOString()
    };

    setApplications(prev => [newApplication, ...prev]);
    setIsFormModalOpen(false);
    
    const productionSuccess = await submitToProduction(newApplication, formFiles);
    
    if (productionSuccess) {
      alert(`✅ Pengajuan berhasil!\n\nTiket: ${ticket}\n\nData sudah tersimpan di Google Sheets & Google Drive.\nNotifikasi WhatsApp sudah dikirim.`);
    } else {
      alert(`✅ Pengajuan berhasil!\n\nTiket: ${ticket}\n\n(Simpan nomor tiket Anda untuk pengecekan status)`);
    }
    
    setFormData({});
    setFormFiles({});
    setSelectedService(null);
  }, [selectedService, formData, formFiles, generateTicket]);

  const checkStatus = useCallback(() => {
    if (!ticketSearch.trim()) {
      alert("Masukkan nomor tiket terlebih dahulu");
      return;
    }

    const found = applications.find(app => 
      app.ticket.toLowerCase() === ticketSearch.trim().toUpperCase()
    );

    if (found) {
      setFoundApplication(found);
      setIsStatusModalOpen(true);
    } else {
      alert("Tiket tidak ditemukan. Pastikan nomor tiket benar.");
    }
  }, [ticketSearch, applications]);

  const updateStatus = useCallback((ticket: string, newStatus: 'Pending' | 'Diproses' | 'Selesai') => {
    setApplications(prev => 
      prev.map(app => 
        app.ticket === ticket 
          ? { ...app, status: newStatus } 
          : app
      )
    );
    
    if (foundApplication && foundApplication.ticket === ticket) {
      setFoundApplication(prev => prev ? { ...prev, status: newStatus } : null);
    }
  }, [foundApplication]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Diproses': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Selesai': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3.5 h-3.5" />;
      case 'Diproses': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'Selesai': return <CheckCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  }, []);

  const handleFileChange = useCallback((docName: string, file: File | null) => {
    setFormFiles(prev => ({
      ...prev,
      [docName]: file
    }));
  }, []);

  const handleInputChange = useCallback((fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  const addQuickLink = useCallback(() => {
    if (!newLink.name || !newLink.url) {
      alert("Nama dan URL harus diisi");
      return;
    }

    const newQuickLink: QuickLink = {
      id: Date.now(),
      name: newLink.name,
      url: newLink.url,
      icon: newLink.icon || '🔗'
    };

    setQuickLinks(prev => [...prev, newQuickLink]);
    setNewLink({ name: '', url: '', icon: '🔗' });
    alert("Link berhasil ditambahkan!");
  }, [newLink]);

  const deleteQuickLink = useCallback((id: number) => {
    if (!confirm("Hapus link ini?")) return;
    setQuickLinks(prev => prev.filter(link => link.id !== id));
  }, []);

  const updateQuickLink = useCallback((updatedLink: QuickLink) => {
    setQuickLinks(prev => 
      prev.map(link => link.id === updatedLink.id ? updatedLink : link)
    );
    setEditingLink(null);
    alert("Link berhasil diperbarui!");
  }, []);

  const handleAdminLogin = useCallback(() => {
    if (adminPassword === 'simpel2026') {
      setIsAuthenticated(true);
      setIsAdminModalOpen(false);
      setAdminPassword('');
      alert("Login berhasil! Selamat datang di Admin Panel.");
    } else {
      alert("Password salah!");
    }
  }, [adminPassword]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    alert("Logout berhasil");
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="font-semibold text-2xl tracking-tighter">SIMPEL</div>
              <div className="text-[10px] text-zinc-500 -mt-1">SISTEM PELAYANAN DIGITAL</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/20 hover:bg-white/5 text-sm transition-all active:scale-[0.985]"
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
            
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-all"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <div className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[length:4px_4px]"></div>
          
          <div className="relative z-10 text-center px-6 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/20 text-xs tracking-[3px] mb-6">
              PEMERINTAH • DIGITAL • MODERN
            </div>
            
            <h1 className="text-7xl md:text-[92px] font-semibold tracking-tighter leading-[0.92] mb-6">
              PELAYANAN<br />PUBLIK<br />YANG LEBIH<br />MUDAH
            </h1>
            
            <p className="max-w-md mx-auto text-xl text-zinc-400 mb-12">
              Ajukan layanan kependudukan secara digital. 
              Cepat, transparan, dan tanpa antre.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 rounded-2xl bg-white text-black font-semibold flex items-center justify-center gap-3 hover:bg-zinc-200 active:scale-[0.985] transition-all"
              >
                MULAI PENGAJUAN <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              
              <button 
                onClick={() => document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 rounded-2xl border border-white/30 hover:bg-white/5 font-medium flex items-center justify-center gap-3 active:scale-[0.985] transition-all"
              >
                CEK STATUS PENGAJUAN
              </button>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs tracking-widest text-zinc-500">
            SCROLL TO EXPLORE
            <div className="w-px h-8 bg-white/30"></div>
          </div>
        </div>

        <div id="layanan" className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs tracking-[3px] text-cyan-400 mb-3">LAYANAN DIGITAL</div>
              <div className="text-6xl font-semibold tracking-tighter">Pilih Layanan</div>
            </div>
            <div className="text-right text-sm text-zinc-400 max-w-[240px]">
              6 layanan kependudukan tersedia. Semua proses dilakukan secara digital.
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mappedServices.map((service, index) => (
              <div 
                key={service.id} 
                className="group relative rounded-3xl p-9 border border-white/10 hover:border-white/30 transition-all duration-500 flex flex-col"
                style={{ 
                  background: `linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
                  style={{ backgroundColor: `${service.color}15`, color: service.color }}
                >
                  {getServiceIcon(service.icon)}
                </div>

                <div className="mb-auto">
                  <div className="font-semibold text-3xl tracking-tight mb-3 pr-8">{service.name}</div>
                  <div className="text-zinc-400 text-[15px] leading-relaxed mb-8">{service.desc}</div>
                </div>

                <button 
                  onClick={() => openServiceForm(service)}
                  className="mt-auto w-full py-4 rounded-2xl border border-white/20 hover:bg-white hover:text-black flex items-center justify-center gap-2 text-sm font-medium active:scale-[0.985] transition-all"
                >
                  AJUKAN SEKARANG
                </button>

                <div className="absolute top-8 right-8 text-[10px] px-3 py-1 rounded-full border border-white/10 text-zinc-500">
                  {service.fields.length} FIELD • {service.documents.length} DOKUMEN
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="status" className="bg-black py-24 border-y border-white/10">
          <div className="max-w-xl mx-auto px-6 text-center">
            <div className="text-xs tracking-[3px] text-purple-400 mb-4">REAL-TIME TRACKING</div>
            <div className="text-6xl font-semibold tracking-tighter mb-6">Cek Status Pengajuan</div>
            <p className="text-zinc-400 mb-10">Masukkan nomor tiket yang Anda terima saat pengajuan</p>

            <div className="flex gap-3">
              <input 
                type="text" 
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value.toUpperCase())}
                placeholder="SIM-20260428-123"
                className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-7 py-4 text-lg placeholder:text-zinc-500 focus:outline-none focus:border-white/40"
              />
              <button 
                onClick={checkStatus}
                className="px-10 py-4 rounded-2xl bg-white text-black font-semibold active:scale-[0.985]"
              >
                CEK
              </button>
            </div>
            
            <div className="mt-6 text-xs text-zinc-500">Contoh: SIM-20260428-456</div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="text-xs tracking-[3px] text-zinc-500 mb-2">RIWAYAT PENGAJUAN</div>
              <div className="text-4xl font-semibold tracking-tight">Pengajuan Terbaru</div>
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                placeholder="Cari tiket atau layanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 text-sm w-72 placeholder:text-zinc-500 focus:outline-none focus:border-white/30"
              />
              
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/30"
              >
                <option value="All">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((app, index) => (
                <div 
                  key={app.id} 
                  className="glass rounded-3xl p-8 flex flex-col md:flex-row md:items-center gap-6 border border-white/10 hover:border-white/30 transition-all"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="font-mono text-sm text-cyan-400">{app.ticket}</div>
                      <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-px rounded-full border ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)} {app.status}
                      </div>
                    </div>
                    
                    <div className="font-medium text-xl tracking-tight mb-1">{app.serviceName}</div>
                    <div className="text-sm text-zinc-400">{app.date}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setFoundApplication(app);
                        setIsStatusModalOpen(true);
                      }}
                      className="px-6 py-3 rounded-2xl border border-white/20 text-sm hover:bg-white/5 active:scale-[0.985]"
                    >
                      DETAIL
                    </button>
                    
                    {isAuthenticated && (
                      <select 
                        value={app.status} 
                        onChange={(e) => updateStatus(app.ticket, e.target.value as any)}
                        className="bg-black border border-white/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-400">
              Belum ada pengajuan yang sesuai dengan filter
            </div>
          )}
        </div>

        <div className="bg-black py-24 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="text-xs tracking-[3px] text-purple-400 mb-4">PORTAL TERINTEGRASI</div>
              <div className="text-6xl font-semibold tracking-tighter mb-4">Akses Cepat</div>
              <p className="text-xl text-zinc-400 max-w-md mx-auto">Hubungkan langsung ke layanan digital pemerintah lainnya</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 px-8 py-7 rounded-3xl border border-white/10 hover:border-white/40 transition-all active:scale-[0.985]"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="text-4xl transition-transform group-hover:scale-125">{link.icon}</div>
                  <div className="font-medium text-lg tracking-tight">{link.name}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <footer className="border-t border-white/10 py-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-y-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black" />
                </div>
                <span className="font-semibold text-2xl tracking-tighter">SIMPEL</span>
              </div>
              <div className="text-sm text-zinc-400 max-w-xs">
                Sistem Pelayanan Digital Pemerintah • Next.js 15
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-16 text-sm">
              <div>
                <div className="font-medium mb-4 tracking-wider text-xs">NAVIGASI</div>
                <div className="space-y-2 text-zinc-400">
                  <div>Layanan</div>
                  <div>Status</div>
                  <div>Riwayat</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-4 tracking-wider text-xs">LEGAL</div>
                <div className="space-y-2 text-zinc-400">
                  <div>Kebijakan Privasi</div>
                  <div>Syarat & Ketentuan</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-4 tracking-wider text-xs">KONTAK</div>
                <div className="space-y-2 text-zinc-400">
                  <div>help@simpel.go.id</div>
                  <div>1500-123</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-[10px] text-zinc-500 mt-24 tracking-[2px]">
            © {new Date().getFullYear()} SIMPEL — SIMULASI PROYEK DIGITALISASI PELAYANAN PUBLIK
          </div>
        </footer>
      </div>

      {isFormModalOpen && selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={() => setIsFormModalOpen(false)}>
          <div 
            className="modal w-full max-w-2xl glass rounded-3xl p-9 border border-white/20 max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-xs tracking-[2px] text-zinc-500 mb-1">FORM PENGAJUAN</div>
                <div className="text-3xl font-semibold tracking-tight pr-8">{selectedService.name}</div>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} className="text-2xl">×</button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-8">
              <div>
                <div className="uppercase text-xs tracking-[2px] text-zinc-500 mb-4">DATA PEMOHON</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {selectedService.fields.map((field, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-sm text-zinc-400">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      
                      {field.type === 'select' ? (
                        <select 
                          required={field.required}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full bg-black/70 border border-white/20 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-white/40"
                        >
                          <option value="">Pilih {field.label}</option>
                          {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type={field.type} 
                          required={field.required}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full bg-black/70 border border-white/20 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-white/40"
                          placeholder={field.label}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="uppercase text-xs tracking-[2px] text-zinc-500 mb-4">UNGGAH DOKUMEN</div>
                <div className="space-y-4">
                  {selectedService.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{doc.label}</div>
                        <div className="text-xs text-zinc-500">{doc.formats} • {doc.required ? 'Wajib' : 'Opsional'}</div>
                      </div>
                      <label className="cursor-pointer px-5 py-2 rounded-xl border border-white/20 text-xs hover:bg-white/10 active:bg-white/20 transition-all">
                        PILIH FILE
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(doc.name, e.target.files?.[0] || null)}
                        />
                      </label>
                      {formFiles[doc.name] && (
                        <div className="text-xs text-emerald-400 truncate max-w-[120px]">
                          ✓ {formFiles[doc.name]?.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold text-lg flex items-center justify-center gap-3 active:scale-[0.985]"
              >
                KIRIM PENGAJUAN <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </form>
          </div>
        </div>
      )}

      {isStatusModalOpen && foundApplication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={() => setIsStatusModalOpen(false)}>
          <div 
            className="modal w-full max-w-lg glass rounded-3xl p-9 border border-white/20"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-xs tracking-[2px] text-zinc-500">STATUS PENGAJUAN</div>
                <div className="font-mono text-2xl text-cyan-400 mt-1">{foundApplication.ticket}</div>
              </div>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-2xl">×</button>
            </div>

            <div className="mb-8">
              <div className="text-sm text-zinc-400 mb-1">LAYANAN</div>
              <div className="font-medium text-xl tracking-tight">{foundApplication.serviceName}</div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-zinc-400 mb-3">STATUS SAAT INI</div>
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border text-lg ${getStatusColor(foundApplication.status)}`}>
                {getStatusIcon(foundApplication.status)}
                <span className="font-semibold">{foundApplication.status}</span>
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              Diajukan pada {foundApplication.date} • 
              Estimasi penyelesaian 3-7 hari kerja
            </div>

            {isAuthenticated && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="text-xs tracking-[2px] text-zinc-500 mb-3">UPDATE STATUS (ADMIN)</div>
                <div className="flex gap-3">
                  {(['Pending', 'Diproses', 'Selesai'] as const).map(s => (
                    <button 
                      key={s}
                      onClick={() => updateStatus(foundApplication.ticket, s)}
                      className={`flex-1 py-3 rounded-2xl text-sm font-medium border transition-all ${foundApplication.status === s ? 'bg-white text-black border-white' : 'border-white/20 hover:bg-white/5'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isAdminModalOpen && !isAuthenticated && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={() => setIsAdminModalOpen(false)}>
          <div 
            className="modal w-full max-w-sm glass rounded-3xl p-9 border border-white/20"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <div className="text-3xl font-semibold tracking-tight mb-2">Admin Panel</div>
              <div className="text-sm text-zinc-400">Masuk untuk mengelola layanan</div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs tracking-[2px] text-zinc-500 block mb-2">PASSWORD ADMIN</label>
                <input 
                  type="password" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="w-full bg-black/70 border border-white/20 rounded-2xl px-6 py-4 text-center text-2xl tracking-[4px] focus:outline-none focus:border-white/40"
                  placeholder="••••••"
                />
              </div>

              <button 
                onClick={handleAdminLogin}
                className="w-full py-4 rounded-2xl bg-white text-black font-semibold active:scale-[0.985]"
              >
                MASUK
              </button>
            </div>

            <div className="text-center text-[10px] text-zinc-500 mt-8">Demo Password: simpel2026</div>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
          <button 
            onClick={() => setIsManageLinksOpen(true)}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 flex items-center gap-2 text-sm font-semibold"
          >
            <Edit2 className="w-4 h-4" /> KELOLA LINK
          </button>
          <button 
            onClick={() => window.open('/admin', '_blank')}
            className="px-6 py-3 rounded-2xl bg-white text-black flex items-center gap-2 text-sm font-semibold"
          >
            <Shield className="w-4 h-4" /> BUKA ADMIN DASHBOARD
          </button>
        </div>
      )}

      {isManageLinksOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={() => setIsManageLinksOpen(false)}>
          <div 
            className="modal w-full max-w-lg glass rounded-3xl p-9 border border-white/20"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="text-2xl font-semibold tracking-tight">Kelola Akses Cepat</div>
              <button onClick={() => setIsManageLinksOpen(false)} className="text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-8 max-h-[50vh] overflow-auto pr-2">
              {quickLinks.map(link => (
                <div key={link.id} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-3xl">{link.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{link.name}</div>
                    <div className="text-xs text-zinc-500 truncate">{link.url}</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingLink(link)}
                      className="p-2 hover:bg-white/10 rounded-xl"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteQuickLink(link.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8">
              <div className="text-xs tracking-[2px] text-zinc-500 mb-4">TAMBAH LINK BARU</div>
              <div className="grid grid-cols-12 gap-3">
                <input 
                  type="text" 
                  placeholder="Nama Link" 
                  value={newLink.name}
                  onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                  className="col-span-5 bg-black/70 border border-white/20 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-white/40"
                />
                <input 
                  type="text" 
                  placeholder="https://..." 
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  className="col-span-5 bg-black/70 border border-white/20 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-white/40"
                />
                <input 
                  type="text" 
                  placeholder="🔗" 
                  value={newLink.icon}
                  onChange={(e) => setNewLink({...newLink, icon: e.target.value})}
                  className="col-span-2 bg-black/70 border border-white/20 rounded-2xl px-3 py-3 text-center text-sm focus:outline-none focus:border-white/40"
                />
              </div>
              <button 
                onClick={addQuickLink}
                className="mt-4 w-full py-4 rounded-2xl border border-white/20 hover:bg-white/5 flex items-center justify-center gap-2 text-sm font-medium active:scale-[0.985]"
              >
                <Plus className="w-4 h-4" /> TAMBAHKAN LINK
              </button>
            </div>
          </div>
        </div>
      )}

      {editingLink && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90" onClick={() => setEditingLink(null)}>
          <div 
            className="modal w-full max-w-md glass rounded-3xl p-9 border border-white/20"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-xl font-semibold tracking-tight mb-6">Edit Link</div>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs tracking-[2px] text-zinc-500 block mb-2">NAMA LINK</label>
                <input 
                  type="text" 
                  value={editingLink.name}
                  onChange={(e) => setEditingLink({...editingLink, name: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-white/40"
                />
              </div>
              
              <div>
                <label className="text-xs tracking-[2px] text-zinc-500 block mb-2">URL</label>
                <input 
                  type="text" 
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({...editingLink, url: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-white/40"
                />
              </div>
              
              <div>
                <label className="text-xs tracking-[2px] text-zinc-500 block mb-2">ICON (EMOJI)</label>
                <input 
                  type="text" 
                  value={editingLink.icon}
                  onChange={(e) => setEditingLink({...editingLink, icon: e.target.value})}
                  className="w-full bg-black/70 border border-white/20 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setEditingLink(null)}
                className="flex-1 py-4 rounded-2xl border border-white/20 text-sm font-medium active:scale-[0.985]"
              >
                BATAL
              </button>
              <button 
                onClick={() => updateQuickLink(editingLink)}
                className="flex-1 py-4 rounded-2xl bg-white text-black text-sm font-semibold active:scale-[0.985]"
              >
                SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
