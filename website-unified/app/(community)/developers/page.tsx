import { Resources } from './components/resources'
import { Showcase } from './components/showcase'
import { Contributors } from './components/contributors'
import { Ecosystem } from './components/ecosystem'
import { Community } from './components/community'

export default function DevelopersPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-display-md font-bold mb-6">
            Built by developers,<br />for developers
          </h1>
          <p className="text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Join thousands of developers building the future of AI-powered blockchain applications
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-5xl font-bold">2.5k+</div>
              <div className="text-gray-600">GitHub Stars</div>
            </div>
            <div>
              <div className="text-5xl font-bold">500+</div>
              <div className="text-gray-600">Contributors</div>
            </div>
            <div>
              <div className="text-5xl font-bold">10k+</div>
              <div className="text-gray-600">Deployments</div>
            </div>
            <div>
              <div className="text-5xl font-bold">$2M+</div>
              <div className="text-gray-600">Revenue Generated</div>
            </div>
          </div>
        </div>
      </section>
      
      <Resources />
      <Showcase />
      <Contributors />
      <Ecosystem />
      <Community />
    </main>
  )
}
