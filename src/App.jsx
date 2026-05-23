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
import Products from '@/pages/Products'
import ProductDetail from '@/pages/ProductDetail'
import Chat from '@/pages/Chat'
import NotFound from '@/pages/NotFound'

import Login from '@/admin/Login'
import AdminLayout from '@/admin/AdminLayout'
import Dashboard from '@/admin/Dashboard'
import AiAdmin from '@/admin/AiAdmin'
import ProjectsAdmin from '@/admin/ProjectsAdmin'
import ServicesAdmin from '@/admin/ServicesAdmin'
import SkillsAdmin from '@/admin/SkillsAdmin'
import TestimonialsAdmin from '@/admin/TestimonialsAdmin'
import ProfileAdmin from '@/admin/ProfileAdmin'
import MessagesAdmin from '@/admin/MessagesAdmin'
import PinnedReposAdmin from '@/admin/PinnedReposAdmin'
import ProductsAdmin from '@/admin/ProductsAdmin'
import ChangePin from '@/admin/ChangePin'
import Analytics from '@/admin/Analytics'
import ProtectedRoute from '@/components/ProtectedRoute'
import AnalyticsTracker from '@/components/AnalyticsTracker'

export default function App() {
  return (
    <>
    <AnalyticsTracker />
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="process" element={<Process />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="chat" element={<Chat />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="repos" element={<PinnedReposAdmin />} />
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="security" element={<ChangePin />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai" element={<AiAdmin />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}
