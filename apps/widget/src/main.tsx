// SHARED INTERFACES (We must adhere to this)
interface TourStep {
  id: string;
  order: number;
  target_element: string; // CSS Selector (e.g., '#signup-btn')
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface TourConfig {
  id: string;
  steps: TourStep[];
  theme_color: string;
  name?: string;
  owner_id?: string;
  base_url?: string;
  created_at?: string;
}

// DEFAULT CONFIGURATION
const DEFAULT_TOUR_CONFIG: TourConfig = {
  id: 'tour_12345',
  name: 'New User Onboarding',
  theme_color: '#3498db', // Changed theme color for better contrast
  steps: [
    {
      id: 'step_01',
      order: 1,
      target_element: '#signup-btn',
      title: 'Start here',
      content: 'Click to create your first tour.',
      position: 'bottom',
    },
    {
      id: 'step_02',
      order: 2,
      target_element: '#dashboard-header',
      title: 'Dashboard overview',
      content: 'We anchor to headers as well.',
      position: 'right',
    },
    {
      id: 'step_03',
      order: 3,
      target_element: '#stat-activation',
      title: 'Metrics',
      content: 'Explain why each card matters.',
      position: 'top',
    },
    {
      id: 'step_04',
      order: 4,
      target_element: '#analytics-card',
      title: 'Analytics block',
      content: 'Shows events we will later collect.',
      position: 'left',
    },
    {
      id: 'step_05',
      order: 5,
      target_element: '#support-card',
      title: 'Help entry',
      content: 'Link your docs or chat widget. This is the last step!',
      position: 'top',
    },
  ],
};

// GLOBAL STATE
let currentTourConfig: TourConfig | null = null;
let currentStepIndex: number = 0;
let highlightedElement: HTMLElement | null = null;
let tooltipElement: HTMLDivElement | null = null;

const STYLE_ID = 'onboarding-tour-styles';

// STYLE MANAGEMENT
function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const themeColor = (currentTourConfig?.theme_color || DEFAULT_TOUR_CONFIG.theme_color);

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .tour-highlighted-element {
      position: relative;
      z-index: 2147483646; /* High z-index to overlay host site elements */
      /* Use box-shadow to create the backdrop effect */
      box-shadow: 0 0 0 3px var(--tour-theme, ${themeColor}), 0 0 0 9999px rgba(0,0,0,0.45);
      border-radius: 12px;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }
    .onboarding-tour-tooltip {
      position: fixed;
      z-index: 2147483647;
      min-width: 240px;
      max-width: 320px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.14);
      background: #0e162d;
      color: #e7ecff;
      box-shadow: 0 18px 40px rgba(0,0,0,0.45);
      font-family: system-ui, -apple-system, sans-serif;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.16s ease, transform 0.16s ease;
    }
    .onboarding-tour-tooltip.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .onboarding-tour-tooltip h3 {
      margin: 0 0 6px;
      font-size: 15px;
    }
    .onboarding-tour-tooltip p {
      margin: 0 0 10px;
      color: #9fb3ff;
      line-height: 1.5;
      font-size: 13px;
    }
    .onboarding-tour-actions {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    .onboarding-tour-actions .nav-buttons {
      display: flex;
      gap: 8px;
    }
    .onboarding-tour-actions button {
      padding: 7px 11px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.06);
      color: #e7ecff;
      font-weight: 600;
      cursor: pointer;
      font-size: 12px;
    }
    .onboarding-tour-actions .primary {
      border-color: transparent;
      background: var(--tour-theme, ${themeColor});
      color: #fff;
    }
  `;

  document.head.appendChild(style);
}

// TOOLTIP CREATION & EVENT WIRING 
function createTooltip(): HTMLDivElement {
  if (tooltipElement) return tooltipElement;

  tooltipElement = document.createElement('div');
  tooltipElement.className = 'onboarding-tour-tooltip';
  document.body.appendChild(tooltipElement);

  // Use event delegation for button actions
  tooltipElement.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const action = target.getAttribute('data-action');
    if (action === 'next') {
      nextStep();
    } else if (action === 'back') {
      previousStep();
    } else if (action === 'skip') {
      skipTour();
    }
  });

  return tooltipElement;
}

// UTILITIES
function getTourId(): string | null {
  const scriptTag = document.querySelector('script[src*="onboarding-tour"]');
  if (scriptTag) {
    return scriptTag.getAttribute('data-tour-id');
  }
  return null;
}

// DATABASE & ANALYTICS PLACEHOLDERS 
async function fetchTourConfig(tourId: string): Promise<TourConfig> {
  // TODO: REPLACE THIS WITH REAL DB FETCH
  // Example: Use Firebase client to fetch tour data by ID
  try {
    // const response = await firebase.firestore().collection('tours').doc(tourId).get();
    // return response.data() as TourConfig;
    
    // Using static JSON fetch as a stepping stone
    const response = await fetch('/mock-tour.json', { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Failed to fetch tour config (${response.status})`);
    }
    console.log(tourId);
    
    return (await response.json()) as TourConfig;
  } catch (error) {
    console.warn('Falling back to default tour config due to fetch error:', error);
    return DEFAULT_TOUR_CONFIG;
  }
}

type AnalyticsAction = 'started' | 'completed' | 'skipped' | 'tour_finished';

function sendAnalyticsEvent(action: AnalyticsAction, stepId?: string): void {
  if (!currentTourConfig) return;

  const eventPayload = {
    tour_id: currentTourConfig.id,
    step_id: stepId,
    action: action,
    timestamp: new Date().toISOString(),
    // TODO: Include user session/ID if available
  };

  console.log('Analytics Event Fired:', eventPayload);
  
  // TODO: Squad C - REPLACE console.log with an actual POST/database write request
  // Example: await supabase.from('analytics').insert([eventPayload]);
}

// CLEANUP AND RESET
function cleanupTour(): void {
  if (highlightedElement) {
    highlightedElement.classList.remove('tour-highlighted-element');
    highlightedElement = null;
  }
  if (tooltipElement) {
    tooltipElement.classList.remove('visible');
    tooltipElement.remove();
    tooltipElement = null;
  }
  window.removeEventListener('resize', handleReposition);
  window.removeEventListener('scroll', handleReposition);
  document.documentElement.style.removeProperty('--tour-theme');
  currentTourConfig = null;
  console.log('Tour dismissed and cleaned up.');
}

function skipTour(): void {
  if (!currentTourConfig) return;
  sendAnalyticsEvent('skipped'); // Log the skip action
  cleanupTour();
}

// RESPONSIVENESS
function handleReposition(): void {
  if (highlightedElement && tooltipElement && currentTourConfig) {
    const step = currentTourConfig.steps[currentStepIndex];
    positionTooltip(highlightedElement, step.position);
  }
}

function setupEventListeners(): void {
  window.addEventListener('resize', handleReposition);
  window.addEventListener('scroll', handleReposition);
}

// POSITIONING AND RENDERING
function positionTooltip(target: HTMLElement, position: TourStep['position']): void {
  if (!tooltipElement) return;

  // Ensure visibility before getting dimensions for accurate positioning
  tooltipElement.classList.add('visible'); 
  
  const rect = target.getBoundingClientRect();
  const padding = 10;
  let top = 0;
  let left = 0;
  const tooltipWidth = tooltipElement.offsetWidth;
  const tooltipHeight = tooltipElement.offsetHeight;

  switch (position) {
    case 'top':
      top = rect.top - tooltipHeight - padding;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      break;
    case 'bottom':
      top = rect.bottom + padding;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.left - tooltipWidth - padding;
      break;
    case 'right':
    default:
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + padding;
      break;
  }

  // Bounding box correction to prevent overflow off-screen
  top = Math.max(10, Math.min(top, window.innerHeight - tooltipHeight - 10));
  left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));

  tooltipElement.style.top = `${top}px`;
  tooltipElement.style.left = `${left}px`;
}

function renderStep(index: number): void {
  if (!currentTourConfig) return;
  const step = currentTourConfig.steps[index];
  if (!step) return;
  
  // 1. Remove highlight from previous element
  if (highlightedElement) {
    highlightedElement.classList.remove('tour-highlighted-element');
  }

  // 2. Find and highlight the new target
  const targetElement = document.querySelector(step.target_element) as HTMLElement | null;
  if (!targetElement) {
    console.warn(`Step ${step.order}: could not find target element ${step.target_element}. Skipping step.`);
    // Auto-advance if element is missing to avoid blocking the tour
    return nextStep(); 
  }

  highlightedElement = targetElement;
  document.documentElement.style.setProperty('--tour-theme', currentTourConfig.theme_color);
  targetElement.classList.add('tour-highlighted-element');
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // 3. Update Tooltip Content
  const isLastStep = index === currentTourConfig.steps.length - 1;
  const tooltip = createTooltip();
  tooltip.innerHTML = `
    <h3>${step.title} (${index + 1}/${currentTourConfig.steps.length})</h3>
    <p>${step.content}</p>
    <div class="onboarding-tour-actions">
      <button data-action="skip">Skip Tour</button>
      <div class="nav-buttons">
        <button data-action="back" ${index === 0 ? 'disabled' : ''}>Back</button>
        <button class="primary" data-action="next">${isLastStep ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  `;
  
  // 4. Position Tooltip
  requestAnimationFrame(() => {
    positionTooltip(targetElement, step.position);
  });
  
  // 5. Analytics
  sendAnalyticsEvent('started', step.id);
}

// NAVIGATION
function nextStep(): void {
  if (!currentTourConfig) return;
  
  // Log step completion for the step we are leaving
  sendAnalyticsEvent('completed', currentTourConfig.steps[currentStepIndex]?.id); 

  if (currentStepIndex < currentTourConfig.steps.length - 1) {
    currentStepIndex += 1;
    renderStep(currentStepIndex);
  } else {
    console.log('Tour finished!');
    sendAnalyticsEvent('tour_finished'); 
    cleanupTour();
  }
}

function previousStep(): void {
  if (!currentTourConfig) return;
  if (currentStepIndex > 0) {
    currentStepIndex -= 1;
    renderStep(currentStepIndex);
  }
}

// INITIALIZATION
async function initializeTour(config?: TourConfig): Promise<void> {
  ensureStyles();
  createTooltip(); // Ensure the element exists

  const tourId = getTourId();
  const resolvedConfig = config || (tourId ? await fetchTourConfig(tourId) : DEFAULT_TOUR_CONFIG);

  if (!resolvedConfig.steps || resolvedConfig.steps.length === 0) {
    console.error('Tour configuration is missing steps.');
    return;
  }
  
  if (resolvedConfig.steps.length < 5) {
     console.warn(`Tour only has ${resolvedConfig.steps.length} steps. Must have a minimum of 5.`);
  }

  currentTourConfig = resolvedConfig;
  currentStepIndex = 0;

  console.log(`Tour loaded: ${currentTourConfig.name || currentTourConfig.id}. Starting tour.`);
  
  setupEventListeners();
  renderStep(currentStepIndex);
}

// AUTO-LOAD (DOM ready)
document.addEventListener('DOMContentLoaded', () => {
  // Only auto-initialize if the script has a data-tour-id attribute
  if (getTourId()) {
    initializeTour().catch((error) => {
      console.error('Failed to initialize tour', error);
      cleanupTour();
    });
  } else {
    console.warn("Onboarding script loaded without 'data-tour-id'. Waiting for manual initialization.");
  }
});

// PUBLIC API EXPORTS (for UMD build) 
export {
  initializeTour,
  nextStep as next,
  previousStep as back,
  skipTour as skip,
  cleanupTour,
};