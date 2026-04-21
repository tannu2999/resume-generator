// Types for structured resume data

export interface PersonalInfo {
  name: string;
  place: string; // added new 
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string; // "Present" for current role
  location: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: {
    languages?: string[];
    frameworks?: string[];
    tools?: string[];
    other?: string[];
  };
  projects?: Project[];
  certifications?: string[];
}
