export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">🖼️ Image Processing API</h1>
        <p className="text-gray-600 mb-8">Credit-based image processing with x402 payments</p>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">💳 Credit Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg">Small</h3>
              <p className="text-3xl font-bold text-blue-600">$10</p>
              <p className="text-gray-600">100 credits</p>
              <p className="text-sm text-gray-500">$0.10 per credit</p>
            </div>
            <div className="border-2 border-blue-500 rounded-lg p-4">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">20% OFF</span>
              <h3 className="font-bold text-lg mt-2">Medium</h3>
              <p className="text-3xl font-bold text-blue-600">$80</p>
              <p className="text-gray-600">1,000 credits</p>
              <p className="text-sm text-gray-500">$0.08 per credit</p>
            </div>
            <div className="border-2 border-purple-500 rounded-lg p-4">
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">50% OFF</span>
              <h3 className="font-bold text-lg mt-2">Large</h3>
              <p className="text-3xl font-bold text-purple-600">$500</p>
              <p className="text-gray-600">10,000 credits</p>
              <p className="text-sm text-gray-500">$0.05 per credit</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔧 Operations</h2>
          <p className="text-gray-600 mb-4">Each operation costs 1 credit</p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-32 font-medium">Resize</span>
              <span className="text-gray-600">Custom dimensions</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">Thumbnail</span>
              <span className="text-gray-600">150x150 preview</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">Watermark</span>
              <span className="text-gray-600">Add text overlay</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">Blur</span>
              <span className="text-gray-600">Gaussian blur</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">Grayscale</span>
              <span className="text-gray-600">Remove colors</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">Rotate</span>
              <span className="text-gray-600">Any angle</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">📖 API Documentation</h2>
          <p className="text-gray-700 mb-4">
            See <a href="/api/process" className="text-blue-600 underline">/api/process</a> for API details
          </p>
          <code className="block bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto">
            curl -X POST http://localhost:3000/api/process \<br/>
            &nbsp;&nbsp;-H "X-User-Id: user_xxx" \<br/>
            &nbsp;&nbsp;-H "X-Operation: resize" \<br/>
            &nbsp;&nbsp;-F "image=@photo.jpg" \<br/>
            &nbsp;&nbsp;-F "width=800" \<br/>
            &nbsp;&nbsp;-F "height=600"
          </code>
        </div>
      </div>
    </main>
  );
}
