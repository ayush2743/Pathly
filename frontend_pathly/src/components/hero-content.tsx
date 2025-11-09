import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface Skill {
  _id: string
  question: string
  skill: string
  createdAt: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

export default function HeroContent() {
  const [topic, setTopic] = useState("")
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skills`)
      const data = await response.json()
      if (data.success) {
        setSkills(data.data)
      }
    } catch (error) {
      console.error("Error fetching skills:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMap = async () => {
    if (topic.trim() && !generating) {
      setGenerating(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/gemini/generate-map`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: topic }),
        })
        const data = await response.json()

        if (data.success) {
          // Navigate to roadmap page with the data
          navigate("/roadmap/new", {
            state: { roadmapData: { skill: data.skill, roadmap: data.roadmap } },
          })
        } else {
          alert(data.error || "Failed to generate roadmap")
        }
      } catch (error) {
        console.error("Error generating roadmap:", error)
        alert("Error generating roadmap. Please try again.")
      } finally {
        setGenerating(false)
      }
    }
  }

  const handleSkillClick = (skillId: string) => {
    // Navigate to roadmap page with skillId
    navigate(`/roadmap/${skillId}`)
  }

  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-xl">
      <div className="text-left">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-8 relative"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-linear-to-r from-transparent via-white/20 to-transparent rounded-full" />
          <span className="text-white/90 text-md font-light relative z-10">✨ AI-Powered Learning Roadmaps</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-7xl md:text-8xl md:leading-20 tracking-tight font-light text-white mb-8">
          <span className="font-medium italic instrument">Pathly, </span>
          {/* <br />
          <span className="font-light text-5xl tracking-tight text-white">Learning RoadMaps</span> */}
        </h1>

        {/* Description */}
        <p className="text-xl font-light text-white/70 mb-8 leading-relaxed">
        Empowering users to explore and understand complex subjects through structured and intuitive learning journeys.
        </p>

        {/* Input Box with Generate Button Inside */}
        <div className="mb-6 relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic you want to learn..."
            className="w-full pl-6 pr-48 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 text-lg font-light focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-200"
            style={{
              filter: "url(#glass-effect)",
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerateMap()}
          />
          <button 
            onClick={handleGenerateMap}
            disabled={generating || !topic.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-full bg-purple-600/20 backdrop-blur-sm text-white font-normal text-sm transition-all duration-200 hover:bg-purple-700/50 cursor-pointer border border-white/30  disabled:cursor-not-allowed"
          >
            {generating ? "Generating..." : "Generate Map"}
          </button>
        </div>

        {/* Existing Skills as Simple Buttons */}
        {!loading && skills.length > 0 && (
          <div className="mb-8">
            <p className="text-white/70 text-sm font-light mb-3">Or try existing roadmaps:</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill._id}
                  onClick={() => handleSkillClick(skill._id)}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-light relative transition-all duration-200 hover:bg-purple-600/10 hover:cursor-pointer hover:shadow-[0_0_4px_2px_rgba(255,255,255,0.25)] "
                  style={{
                    filter: "url(#glass-effect)",
                  }}
                >
                  {skill.skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Commented Buttons */}
        {/* <div className="flex items-center gap-4 flex-wrap">
          <button className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer">
            Pricing
          </button>
          <button className="px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer">
            Get Started
          </button>
        </div> */}
      </div>
    </main>
  )
}

