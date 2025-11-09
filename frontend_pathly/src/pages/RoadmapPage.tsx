import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, ChevronDown, ArrowRight, Download } from "lucide-react"
import backgroundImage from "../assets/background.png"

interface Resource {
  name?: string
  url?: string
}

interface Topic {
  SubNode: string
  Description: string
  Resources: (string | Resource)[]
}

interface MajorNode {
  MajorNode: string
  Topics: Topic[]
}

interface RoadmapData {
  skill: string
  roadmap: MajorNode[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

export default function RoadmapPage() {
  const { skillId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(location.state?.roadmapData || null)
  const [loading, setLoading] = useState(!roadmapData)
  const [error, setError] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set([0]))

  useEffect(() => {
    if (!roadmapData && skillId) {
      fetchRoadmap()
    }
  }, [skillId])

  const fetchRoadmap = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/skills/roadmap/${skillId}`)
      const data = await response.json()
      
      if (data.success) {
        setRoadmapData({ skill: data.skill, roadmap: data.roadmap })
      } else {
        setError("Failed to fetch roadmap")
      }
    } catch (err) {
      setError("Error fetching roadmap. Please try again.")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleNode = (index: number) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedNodes(newExpanded)
  }

  const renderResource = (resource: string | Resource, index: number) => {
    if (typeof resource === 'string') {
      // Check if it's a URL string
      if (resource.startsWith('http://') || resource.startsWith('https://')) {
        return (
          <a
            key={index}
            href={resource}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-200 hover:text-violet-300 text-sm font-light transition-colors duration-200 cursor-pointer block"
          >
            • {resource}
          </a>
        )
      }
      return (
        <span key={index} className="text-white/70 text-sm font-light block">
          • {resource}
        </span>
      )
    }
    return (
      <a
        key={index}
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-400 hover:text-purple-300 text-sm font-light transition-colors duration-200 cursor-pointer block"
      >
        • {resource.name || resource.url}
      </a>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="fixed inset-0 w-full h-full bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover'
          }}
        />
        <div className="fixed inset-0 bg-black/20" />
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-white text-2xl font-light">Loading roadmap...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="fixed inset-0 w-full h-full bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover'
          }}
        />
        <div className="fixed inset-0 bg-black/20" />
        <div className="relative flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="text-purple-100 text-2xl font-light">{error}</div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-normal text-sm border border-white/30 hover:bg-white/30 transition-all duration-200 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!roadmapData) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-y-auto custom-scrollbar">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          zIndex: -2
        }}
      />

      {/* Dark overlay */}
      {/* <div className="fixed inset-0 bg-black/10" style={{ zIndex: -1 }} /> */}
      
      <div className="relative min-h-screen p-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-20">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-light hover:bg-white/20 transition-all duration-200 border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            
            <button
              onClick={() => {
                const dataStr = JSON.stringify(roadmapData, null, 2)
                const dataBlob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = `${roadmapData.skill.replace(/\s+/g, '_')}_roadmap.json`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
              }}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-light hover:bg-white/20 transition-all duration-200 border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download as JSON
            </button>
          </div>
          
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-6 relative">
            <div className="absolute top-0 left-1 right-1 h-px bg-linear-to-r from-transparent via-white/20 to-transparent rounded-full" />
            <span className="text-white/90 text-md font-light relative z-10">✨ Your Learning Roadmap</span>
          </div>

          <h1 className="text-6xl md:text-7xl tracking-tight font-light text-white mb-4">
            <span className="font-medium italic instrument">{roadmapData.skill}</span>
          </h1>
        </div>

        {/* Roadmap Content */}
        <div className="max-w-6xl mx-auto pb-20">
          <div className="space-y-6">
            {roadmapData.roadmap.map((node, nodeIndex) => (
              <div
                key={nodeIndex}
                className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden transition-all duration-300"
              >
                {/* Major Node Header */}
                <button
                  onClick={() => toggleNode(nodeIndex)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-all duration-200 cursor-pointer mb-"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-white font-medium">
                      {nodeIndex + 1}
                    </div>
                    <h2 className="text-2xl font-medium text-white">{node.MajorNode}</h2>
                  </div>
                  <div className={`text-white transition-transform duration-300 ${expandedNodes.has(nodeIndex) ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>

                {/* Topics */}
                {expandedNodes.has(nodeIndex) && (
                  <div className="px-8 pb-8 space-y-6 mt-6">
                    {node.Topics.map((topic, topicIndex) => (
                      <div
                        key={topicIndex}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10"
                      >
                        {/* SubNode */}
                        <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
                          <ArrowRight className="w-5 h-5 text-purple-400" />
                          {topic.SubNode}
                        </h3>

                        {/* Description */}
                        <p className="text-white/70 text-base font-light mb-4 leading-relaxed">
                          {topic.Description}
                        </p>

                        {/* Resources */}
                        {topic.Resources && topic.Resources.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-white/80 mb-2">Resources:</h4>
                            <div className="flex flex-col gap-2 pl-2">
                              {topic.Resources.map((resource, resIndex) => renderResource(resource, resIndex))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

