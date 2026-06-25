// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import App from './App';

// Mock IntersectionObserver for Framer Motion support in jsdom
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

afterEach(() => {
  cleanup();
});

// Mock the 3D scene because WebGL is not supported in jsdom
vi.mock('./components/ParkingScene3D', () => {
  return {
    default: () => <div data-testid="mock-parking-scene">Mock 3D Parking Scene</div>
  };
});

describe('App Component', () => {
  it('should render the hero header and title', () => {
    render(<App />);
    
    // Check if the title text is in the document
    const titleElements = screen.getAllByText(/Parcare securizată în Centru/i);
    expect(titleElements.length).toBeGreaterThan(0);
    
    // Check if the logo title is rendered
    expect(screen.getAllByText('park-auto').length).toBeGreaterThan(0);
  });

  it('should render the mocked 3D parking scene', () => {
    render(<App />);
    expect(screen.getByTestId('mock-parking-scene')).toBeDefined();
  });

  it('should render correct navigation links', () => {
    render(<App />);
    const wazeLink = screen.getByRole('link', { name: /Navigare Waze/i });
    expect(wazeLink.getAttribute('href')).toContain('waze.com');
  });
});
