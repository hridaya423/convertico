/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import dynamic from 'next/dynamic'

const FileConverter = dynamic(() => import('../components/FileConverter'), {
  ssr: false
})
const UnitConverter = dynamic(() => import('../components/UnitConverter'), {
  ssr: false
})

export default function Home() {
  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Conversion Toolbox
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Seamlessly convert units and transform files with our intuitive, user-friendly tools.
          </p>
          <div className="flex space-x-4">
            <div className="w-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></div>
            <div>
              <h2 className="text-2xl font-bold text-blue-900">Powerful Conversions</h2>
              <p className="text-gray-600">
                From liquid volumes to temperatures, from PDF to DOCX, we&apos;ve got you covered.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid gap-8">
          <UnitConverter />
          <FileConverter />
        </div>
      </div>
    </div>
    
  )
}
