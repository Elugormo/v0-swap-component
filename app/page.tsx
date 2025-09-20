import { SwapInterface } from "@/components/swap-interface"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <SwapInterface />
      </div>
    </main>
  )
}
