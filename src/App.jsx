import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Services from '@/pages/Services'
import Projects from '@/pages/Projects'
import ProjectDetail from '@/pages/ProjectDetail'
import Contact from '@/pages/Contact'
import Process from '@/pages/Process'
import FAQ from '@/pages/FAQ'
import NotFound from '@/pages/NotFound'

import Login from '@/admin/Login'
import AdminLayout from '@/admin/AdminLayout'
import Dashboard from '@/admin/Dashboard'
import ProjectsAdmin from '@/admin/ProjectsAdmin'
import ServicesAdmin from '@/admin/ServicesAdmin'
import SkillsAdmin from '@/admin/SkillsAdmin'
import TestimonialsAdmin from '@/admin/TestimonialsAdmin'
import ProfileAdmin from '@/admin/ProfileAdmin'
import MessagesAdmin from '@/admin/MessagesAdmin'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="process" element={<Process />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
