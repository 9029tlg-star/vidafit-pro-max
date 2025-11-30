'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateTDEE, getCaloricTarget, calculateMacros, type UserProfile } from '@/lib/calculations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Target, Flame, Utensils, Dumbbell, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      // Get profile data
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData as UserProfile)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Acesso negado</div>
  }

  const tdee = profile ? calculateTDEE(profile) : 0
  const target = profile ? getCaloricTarget(profile, tdee) : 0
  const macros = profile ? calculateMacros(profile.weight, target) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Olá! Vamos transformar seu corpo hoje?</h1>
          <p className="text-gray-600">Você está no caminho certo para seus objetivos!</p>
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calorias Hoje</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250</div>
              <p className="text-xs text-muted-foreground">de {Math.round(target)} kcal</p>
              <Progress value={1250 / target * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proteína</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85g</div>
              <p className="text-xs text-muted-foreground">de {macros?.protein}g</p>
              <Progress value={85 / (macros?.protein || 1) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Refeição</CardTitle>
              <Utensils className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Almoço</div>
              <p className="text-xs text-muted-foreground">12:00 - 500 kcal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treino Hoje</CardTitle>
              <Dumbbell className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Peito</div>
              <p className="text-xs text-muted-foreground">Status: Pronto</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="meals" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meals">Refeições</TabsTrigger>
            <TabsTrigger value="challenge">Desafio 30 Dias</TabsTrigger>
            <TabsTrigger value="gym">Gym</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plano Alimentar de Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Meal items would be mapped here */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Café da Manhã - 8:00</h3>
                      <p className="text-sm text-gray-600">Aveia com frutas - 350 kcal</p>
                    </div>
                    <Button variant="outline" size="sm">Concluído</Button>
                  </div>
                  {/* More meals... */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenge" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Desafio 30 Dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium ${
                        i < 5 ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">5 dias consecutivos</Badge>
                  <Badge variant="secondary">Próximo: Dia 6</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gym" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Body Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500">
                  Body map interativo será implementado aqui
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progresso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500">
                  Gráficos serão implementados aqui
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}