// Cálculos nutricionais e calóricos

export interface UserProfile {
  gender: 'male' | 'female'
  age: number
  weight: number // kg
  height: number // cm
  goal: 'lose_weight' | 'gain_weight' | 'maintain'
  profession: string
  workHours: number
  trainingSchedule: string
}

// Mifflin-St Jeor formula for BMR
export function calculateBMR(profile: UserProfile): number {
  const { gender, age, weight, height } = profile

  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

// Activity multiplier based on lifestyle
export function getActivityMultiplier(profile: UserProfile): number {
  const { profession, workHours, trainingSchedule } = profile

  // Simple logic - can be improved with MET values
  let baseMultiplier = 1.2 // sedentary

  // Adjust based on work hours (assuming desk job vs active)
  if (workHours > 8) baseMultiplier = 1.375 // lightly active
  if (workHours > 10) baseMultiplier = 1.55 // moderately active

  // Adjust based on training
  if (trainingSchedule && trainingSchedule.length > 0) {
    const trainingDays = (trainingSchedule.match(/,/g) || []).length + 1
    if (trainingDays >= 3) baseMultiplier += 0.2
    if (trainingDays >= 5) baseMultiplier += 0.3
  }

  return Math.min(baseMultiplier, 1.9) // cap at very active
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile)
  const activityMultiplier = getActivityMultiplier(profile)
  return bmr * activityMultiplier
}

export function getCaloricTarget(profile: UserProfile, tdee: number): number {
  const { goal } = profile

  switch (goal) {
    case 'lose_weight':
      return tdee - 500 // 0.5kg/week deficit
    case 'gain_weight':
      return tdee + 300 // slow gain
    case 'maintain':
    default:
      return tdee
  }
}

// Macro distribution (Protein: 1.6-2.2g/kg, Carbs: 40-60%, Fat: 20-35%)
export function calculateMacros(weight: number, caloricTarget: number) {
  const protein = weight * 2.0 // 2g/kg
  const proteinCalories = protein * 4

  const fat = weight * 1.0 // 1g/kg minimum
  const fatCalories = fat * 9

  const remainingCalories = caloricTarget - proteinCalories - fatCalories
  const carbs = remainingCalories / 4

  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    calories: caloricTarget
  }
}