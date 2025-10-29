import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import Header from './Header'

describe('Header', () => {
  it('renders brand and login link when no user', () => {
    render(<BrowserRouter><Header user={null} onLogout={() => {}} /></BrowserRouter>)
    expect(screen.getByText(/Vikas Education/)).toBeInTheDocument()
    expect(screen.getByText(/Login/)).toBeInTheDocument()
  })
})
