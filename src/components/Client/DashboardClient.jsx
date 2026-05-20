import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientInspections } from '../../services/inspectionService'
import { logoutUser, getCurrentUser } from '../../services/authService'

const STATUS_COLORS = {
  excellent: 'bg-green-100 text-green-800 border-green-300',
  bon: 'bg-blue-100 text-blue-800 border-blue-300',
  acceptable: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  mauvais: 'bg-red-100 text-red-800 border-red-300',
}

export default function DashboardClient() {
  const [inspections, setInspections] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = getCurrentUser()

  useEffect(() => {
    loadInspections()
  }, [])

  const loadInspections = async () => {
    // Pour la démo, on utilise l'email de l'utilisateur comme ID client
    // En production, ce serait un système d'association client/inspecteur
    const clientId = user?.email || 'client@obm.com'
    
    // Récupérer toutes les inspections (à adapter selon votre logique métier)
    const result = await getClientInspections(clientId)
    if (result.success) {
      setInspections(result.data)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-obm-light">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-obm-primary">OBM+</h1>
            <p className="text-gray-600">Portail client - Mes rapports</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-obm-dark mb-8">📋 Mes inspections</h2>

        {/* Inspections List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-obm-primary mx-auto"></div>
          </div>
        ) : inspections.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">Aucun rapport d'inspection disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspections.map((inspection) => (
              <div key={inspection.id} className="card hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-obm-dark">Rapport d'inspection</h3>
                    <p className="text-sm text-gray-600">
                      {inspection.clientInfo?.address || 'Adresse'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm border ${STATUS_COLORS[inspection.evaluation?.global] || 'bg-gray-100'}`}>
                    {inspection.evaluation?.global || 'N/A'}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <p><strong>Type:</strong> {inspection.roofDetails?.type || 'N/A'}</p>
                  <p><strong>Surface:</strong> {inspection.roofDetails?.surface || 'N/A'} pi²</p>
                  <p><strong>Date:</strong> {inspection.createdAt ? new Date(inspection.createdAt.toDate()).toLocaleDateString('fr-CA') : 'N/A'}</p>
                </div>

                <button
                  onClick={() => navigate(`/report/${inspection.id}`)}
                  className="btn btn-secondary w-full"
                >
                  📖 Consulter le rapport
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
