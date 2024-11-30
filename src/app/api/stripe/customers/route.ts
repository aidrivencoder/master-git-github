import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16'
})

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email,
      metadata: {
        source: 'master-git-github'
      }
    })

    return NextResponse.json({ customerId: customer.id })
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe customer' },
      { status: 500 }
    )
  }
}
