import type { VercelRequest, VercelResponse } from '@vercel/node'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import { promisify } from 'util'

// Note: In production, you'll need to install these packages:
// npm install @vercel/node formidable pdf-parse mammoth

const readFile = promisify(fs.readFile)

interface ResumeSkills {
  hardSkills: string[]
  softSkills: string[]
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
  industryAlignment: string[]
  yearsOfExperience?: number
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers FIRST, before any other logic
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve([fields, files])
      })
    })

    const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume

    if (!resumeFile) {
      return res.status(400).json({ message: 'No resume file provided' })
    }

    // Read file content
    const fileBuffer = await readFile(resumeFile.filepath)
    const fileExtension = resumeFile.originalFilename?.split('.').pop()?.toLowerCase()

    // Extract text from resume
    let resumeText = ''

    if (fileExtension === 'pdf') {
      // For PDF parsing, you'll need pdf-parse
      // const pdfParse = require('pdf-parse')
      // const pdfData = await pdfParse(fileBuffer)
      // resumeText = pdfData.text
      
      // Placeholder for PDF parsing
      resumeText = 'Resume content extracted from PDF. [In production, use pdf-parse library]'
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      // For DOCX parsing, you'll need mammoth
      // const mammoth = require('mammoth')
      // const result = await mammoth.extractRawText({ buffer: fileBuffer })
      // resumeText = result.value
      
      // Placeholder for DOCX parsing
      resumeText = 'Resume content extracted from DOCX. [In production, use mammoth library]'
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Please upload PDF or DOCX.' })
    }

    // Clean and sanitize text
    resumeText = resumeText.replace(/\s+/g, ' ').trim()

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ message: 'Could not extract sufficient text from resume' })
    }

    // Call Cerebras LLM API to extract skills
    const cerebrasApiKey = process.env.CEREBRAS_API_KEY
    if (!cerebrasApiKey) {
      // Fallback: Use a simple keyword-based extraction
      return res.status(200).json({
        skills: extractSkillsFallback(resumeText),
      })
    }

    // Call Cerebras API
    const skills = await extractSkillsWithLLM(resumeText, cerebrasApiKey)

    return res.status(200).json({ skills })
  } catch (error: any) {
    console.error('Error analyzing resume:', error)
    return res.status(500).json({
      message: 'Failed to analyze resume',
      error: error.message,
    })
  }
}

async function extractSkillsWithLLM(
  resumeText: string,
  apiKey: string
): Promise<ResumeSkills> {
  const prompt = `Analyze the following resume and extract:
1. Hard skills (technical skills, tools, technologies)
2. Soft skills (communication, leadership, teamwork, etc.)
3. Experience level (entry, mid, senior, or executive)
4. Industry alignment (which industries this person's experience aligns with)
5. Years of experience (if determinable)

Resume text:
${resumeText.substring(0, 4000)} // Limit to avoid token limits

Return a JSON object with this structure:
{
  "hardSkills": ["skill1", "skill2", ...],
  "softSkills": ["skill1", "skill2", ...],
  "experienceLevel": "entry|mid|senior|executive",
  "industryAlignment": ["industry1", "industry2", ...],
  "yearsOfExperience": number (optional)
}`

  try {
    // Cerebras API call
    // Note: Adjust this based on Cerebras API documentation
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-2-70b', // Adjust based on available models
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume analyzer. Extract skills and experience information from resumes.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || '{}'

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback if JSON parsing fails
    return extractSkillsFallback(resumeText)
  } catch (error) {
    console.error('LLM extraction failed, using fallback:', error)
    return extractSkillsFallback(resumeText)
  }
}

function extractSkillsFallback(resumeText: string): ResumeSkills {
  // Simple keyword-based extraction as fallback
  const text = resumeText.toLowerCase()

  const commonHardSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css',
    'typescript', 'aws', 'docker', 'kubernetes', 'git', 'mongodb', 'postgresql',
    'linux', 'api', 'rest', 'graphql', 'machine learning', 'ai', 'data science',
  ]

  const commonSoftSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'creative', 'organized', 'detail-oriented', 'time management', 'collaboration',
  ]

  const hardSkills = commonHardSkills.filter((skill) => text.includes(skill))
  const softSkills = commonSoftSkills.filter((skill) => text.includes(skill))

  // Estimate experience level based on keywords
  let experienceLevel: 'entry' | 'mid' | 'senior' | 'executive' = 'entry'
  if (text.includes('senior') || text.includes('lead') || text.includes('principal')) {
    experienceLevel = 'senior'
  } else if (text.includes('manager') || text.includes('director') || text.includes('vp')) {
    experienceLevel = 'executive'
  } else if (text.includes('junior') || text.includes('intern')) {
    experienceLevel = 'entry'
  } else {
    experienceLevel = 'mid'
  }

  // Extract years of experience
  const yearsMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)/i)
  const yearsOfExperience = yearsMatch ? parseInt(yearsMatch[1]) : undefined

  return {
    hardSkills: hardSkills.slice(0, 15),
    softSkills: softSkills.slice(0, 10),
    experienceLevel,
    industryAlignment: [],
    yearsOfExperience,
  }
}

