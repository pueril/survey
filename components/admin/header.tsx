'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut, BarChart3, Users, Settings, Download } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const handleExport = async () => {
    try {
      toast.loading('Generando archivo Excel...', { id: 'export' });
      
      const response = await fetch('/api/export');
      
      if (!response.ok) {
        throw new Error('Error al exportar datos');
      }

      // Obtener el blob del archivo
      const blob = await response.blob();
      
      // Crear URL temporal para descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Encuestas_Easton_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Excel exportado correctamente', { id: 'export' });
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar datos', { id: 'export' });
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img 
              src="/Ed_Isotipo_rojo.png" 
              alt="Easton Design" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-800">Easton Design</h1>
              <p className="text-xs text-slate-500">Panel Administrativo</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
            </Link>
            <Link
              href="/estadisticas"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Estadísticas</span>
            </Link>
            <Link
              href="/preguntas"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Preguntas</span>
            </Link>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
