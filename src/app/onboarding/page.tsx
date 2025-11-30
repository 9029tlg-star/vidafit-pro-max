'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const onboardingSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  gender: z.enum(['male', 'female'], { required_error: 'Selecione o sexo' }),
  age: z.number().min(18).max(100),
  weight: z.number().min(30).max(300),
  height: z.number().min(120).max(250),
  goal: z.enum(['lose_weight', 'gain_weight', 'maintain'], { required_error: 'Selecione o objetivo' }),
  profession: z.string().min(1, 'Profissão é obrigatória'),
  workHours: z.number().min(0).max(24),
  trainingSchedule: z.string().min(1, 'Horário de treino é obrigatório'),
  favoriteFoods: z.array(z.string()).min(1).max(7, 'Máximo 7 alimentos'),
  mealsPerDay: z.number().min(1).max(4, 'Máximo 4 refeições no plano Free'),
})

type OnboardingForm = z.infer<typeof onboardingSchema>

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      favoriteFoods: [],
      mealsPerDay: 4,
    },
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const onSubmit = async (data: OnboardingForm) => {
    setIsLoading(true)
    try {
      // Registrar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) throw authError

      // Salvar dados do perfil no banco
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          ...data,
        })

      if (profileError) throw profileError

      toast.success('Conta criada com sucesso! Verifique seu email.')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">Criar Conta</h1>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 text-center mt-2">Passo {step} de {totalSteps}</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="seu@email.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register('password')}
                  placeholder="Mínimo 6 caracteres"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="gender">Sexo</Label>
                <Select onValueChange={(value) => form.setValue('gender', value as 'male' | 'female')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-600">{form.formState.errors.gender.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  {...form.register('age', { valueAsNumber: true })}
                  placeholder="25"
                />
                {form.formState.errors.age && (
                  <p className="text-sm text-red-600">{form.formState.errors.age.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  {...form.register('weight', { valueAsNumber: true })}
                  placeholder="70"
                />
                {form.formState.errors.weight && (
                  <p className="text-sm text-red-600">{form.formState.errors.weight.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  {...form.register('height', { valueAsNumber: true })}
                  placeholder="175"
                />
                {form.formState.errors.height && (
                  <p className="text-sm text-red-600">{form.formState.errors.height.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal">Objetivo</Label>
                <Select onValueChange={(value) => form.setValue('goal', value as 'lose_weight' | 'gain_weight' | 'maintain')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Perder peso</SelectItem>
                    <SelectItem value="gain_weight">Ganhar peso</SelectItem>
                    <SelectItem value="maintain">Manter peso</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.goal && (
                  <p className="text-sm text-red-600">{form.formState.errors.goal.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="profession">Profissão</Label>
                <Input
                  id="profession"
                  {...form.register('profession')}
                  placeholder="Ex: Programador"
                />
                {form.formState.errors.profession && (
                  <p className="text-sm text-red-600">{form.formState.errors.profession.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="workHours">Horas de trabalho por dia</Label>
                <Input
                  id="workHours"
                  type="number"
                  {...form.register('workHours', { valueAsNumber: true })}
                  placeholder="8"
                />
                {form.formState.errors.workHours && (
                  <p className="text-sm text-red-600">{form.formState.errors.workHours.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="trainingSchedule">Horários de treino</Label>
                <Input
                  id="trainingSchedule"
                  {...form.register('trainingSchedule')}
                  placeholder="Ex: Manhã 6h-7h, Noite 18h-19h"
                />
                {form.formState.errors.trainingSchedule && (
                  <p className="text-sm text-red-600">{form.formState.errors.trainingSchedule.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="mealsPerDay">Refeições por dia (Free: até 4)</Label>
                <Input
                  id="mealsPerDay"
                  type="number"
                  {...form.register('mealsPerDay', { valueAsNumber: true })}
                  placeholder="4"
                  max="4"
                />
                {form.formState.errors.mealsPerDay && (
                  <p className="text-sm text-red-600">{form.formState.errors.mealsPerDay.message}</p>
                )}
              </div>
              <div>
                <Label>Alimentos favoritos (até 7)</Label>
                <div className="space-y-2">
                  {Array.from({ length: 7 }, (_, i) => (
                    <Input
                      key={i}
                      placeholder={`Alimento ${i + 1}`}
                      onChange={(e) => {
                        const foods = form.getValues('favoriteFoods')
                        foods[i] = e.target.value
                        form.setValue('favoriteFoods', foods.filter(f => f))
                      }}
                    />
                  ))}
                </div>
                {form.formState.errors.favoriteFoods && (
                  <p className="text-sm text-red-600">{form.formState.errors.favoriteFoods.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Anterior
              </Button>
            )}
            {step < totalSteps ? (
              <Button type="button" onClick={nextStep} className="ml-auto">
                Próximo
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="ml-auto">
                {isLoading ? 'Criando...' : 'Gerar Minha Dieta'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}