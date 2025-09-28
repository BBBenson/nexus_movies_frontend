import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/common/Header"
import { Film, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
            <Film className="h-12 w-12 text-accent" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Movie Not Found</h2>
            <p className="text-muted-foreground max-w-md">
              The movie you're looking for doesn't exist or has been removed from our database.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search">Search Movies</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
