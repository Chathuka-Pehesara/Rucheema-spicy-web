import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';
import './GuidedTour.css';

const TOUR_STEPS = [
  {
    target: '.hero',
    title: 'Welcome to Richeema',
    content: 'Let us take you on a quick journey to discover our premium, luxury spice collections.',
  },
  {
    target: '.brand-trust',
    title: 'Uncompromised Quality',
    content: 'We ensure 100% authenticity, premium grade spices, and global shipping to your doorstep.',
  },
  {
    target: '.categories',
    title: 'Signature Collections',
    content: 'Explore hand-selected varieties curated exclusively for the discerning palate.',
  },
  {
    target: '.spice-finder',
    title: 'Find Your Flavor',
    content: 'Use our interactive Spice Finder to discover the perfect spice based on your unique flavor profile.',
  },
  {
    target: '.subscription',
    title: 'The Spice Subscription',
    content: 'Choose a plan that fits your culinary lifestyle and get premium spices delivered regularly.',
  }
];

const GuidedTour = ({ isActive, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
      scrollToStep(0);
    } else {
      removeHighlight();
    }
    
    // Cleanup on unmount
    return () => removeHighlight();
  }, [isActive]);

  const removeHighlight = () => {
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
  };

  const scrollToStep = (stepIndex) => {
    removeHighlight();
    const step = TOUR_STEPS[stepIndex];
    if (step) {
      const element = document.querySelector(step.target);
      if (element) {
        element.classList.add('tour-highlight');
        // Calculate offset to ensure it's not hidden behind sticky headers
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      scrollToStep(next);
    } else {
      onClose();
    }
  };

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="guided-tour-popup">
      <button className="tour-close-btn" onClick={onClose}><X size={20} /></button>
      <div className="tour-header">
        <div className="tour-step-badge">Step {currentStep + 1} of {TOUR_STEPS.length}</div>
        <h3>{step.title}</h3>
      </div>
      <p className="tour-content">{step.content}</p>
      <div className="tour-footer">
        <button className="tour-skip-btn" onClick={onClose}>Skip Tour</button>
        <button className="tour-next-btn" onClick={nextStep} autoFocus>
          {currentStep === TOUR_STEPS.length - 1 ? (
            <><Check size={18} /> Got it!</>
          ) : (
            <>Okay, Next <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default GuidedTour;
