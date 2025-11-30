import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            VidaFit Pro Max
          </h1>
          <p className="text-lg text-gray-600">
            Dieta personalizada com os alimentos que você já consome — resultados reais em 30 dias!
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-green-700 mb-2">Free Inicial</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Até 4 refeições por dia</li>
              <li>• 7 alimentos favoritos</li>
              <li>• Desafio 30 dias com check diário</li>
              <li>• Sem cartão de crédito</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-2">Premium Avançado</h3>
            <ul className="text-sm space-y-1">
              <li>• Refeições ilimitadas</li>
              <li>• Alimentos favoritos ilimitados</li>
              <li>• Upload ilimitado de fotos</li>
              <li>• Ajustes automáticos</li>
              <li>• Body-map Gym inteligente</li>
            </ul>
          </div>
        </div>

        <Link href="/onboarding">
          <Button size="lg" className="w-full">
            Começar Minha Transformação
          </Button>
        </Link>

        <p className="text-xs text-gray-500">
          Resultados reais com IA avançada e gamificação motivadora
        </p>
      </div>
    </div>
  )
}