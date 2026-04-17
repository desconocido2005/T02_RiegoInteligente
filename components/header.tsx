export function Header() {
  return (
    <header className="bg-primary text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Riego Inteligente</h1>
            <p className="text-green-100 mt-1">Panel de Control</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-100">Estado: En línea</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Sistema activo</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
