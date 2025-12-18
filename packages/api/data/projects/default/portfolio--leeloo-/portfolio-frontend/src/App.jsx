import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from '@components/Layout'
import Hero from '@pages/Hero'
import Projects from '@pages/Projects'
import Blog from '@pages/Blog'
import Contact from '@pages/Contact'
import LoadingSpinner from '@components/LoadingSpinner'
import './styles/App.css'

/**
 * Main App Component
 * Handles routing, layout structure, and page transitions
 * Implements lazy loading for performance optimization
 */

const NotFound = lazy(() => import('@pages/NotFound'))

export default function App() {
  const location = useLocation()

  return (
    <div className="app-container">
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes location={location} key={location.pathname}>
              <Route index element={<Hero />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </Layout>
    </div>
  )
}