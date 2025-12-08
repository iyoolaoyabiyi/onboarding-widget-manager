interface TourStep {
  id: string;
  order: number;
  target_element: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TourConfig {
  id: string;
  steps: TourStep[];
  theme_color: string;
  name?: string;
  owner_id?: string;
  base_url?: string;
  created_at?: string;
}

const DEFAULT_TOUR_CONFIG: TourConfig = {
  id: 'tour_12345',
  name: 'New User Onboarding',
  theme_color: 'red',
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
      content: 'Link your docs or chat widget.',
      position: 'top',
    },
  ],
};

let currentTourConfig: TourConfig | null = null;
let currentStepIndex = 0;
let highlightedElement: HTMLElement | null = null;
let tooltipElement: HTMLDivElement | null = null;

const STYLE_ID = 'onboarding-tour-styles';

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .tour-highlighted-element {
      position: relative;
      z-index: 2147483646;
      box-shadow: 0 0 0 3px var(--tour-theme, ${DEFAULT_TOUR_CONFIG.theme_color}), 0 0 0 9999px rgba(0,0,0,0.45);
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
      justify-content: flex-end;
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
    }
    .onboarding-tour-actions .primary {
      border-color: transparent;
      background: ${DEFAULT_TOUR_CONFIG.theme_color};
      color: #fff;
    }
  `;

  document.head.appendChild(style);
}

function createTooltip(): HTMLDivElement {
  if (tooltipElement) return tooltipElement;

  tooltipElement = document.createElement('div');
  tooltipElement.className = 'onboarding-tour-tooltip';
  document.body.appendChild(tooltipElement);

  tooltipElement.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const action = target.getAttribute('data-action');
    if (action === 'next') {
      nextStep();
    } else if (action === 'back') {
      previousStep();
    }
  });

  return tooltipElement;
}

function getTourId(): string | null {
  const scriptTag = document.querySelector('script[src*="onboarding-tour"]');
  if (scriptTag) {
    return scriptTag.getAttribute('data-tour-id');
  }
  console.error("Onboarding script requires 'data-tour-id' attribute.");
  return null;
}

async function fetchTourConfig(tourId: string): Promise<TourConfig> {
  // Placeholder for real DB fetch. Using static JSON in /public for now.
  try {
    const response = await fetch('/mock-tour.json', { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Failed to fetch tour config (${response.status})`);
    }
    const data = (await response.json()) as TourConfig;
    if (data.id && data.id !== tourId) {
      console.warn(`Fetched tour id ${data.id} does not match requested ${tourId}`);
    }
    return data;
  } catch (error) {
    console.warn('Falling back to default tour config due to fetch error:', error);
    return DEFAULT_TOUR_CONFIG;
  }
}

function positionTooltip(target: HTMLElement, position: TourStep['position']): void {
  if (!tooltipElement) return;
  const rect = target.getBoundingClientRect();
  const padding = 10;
  let top = rect.top;
  let left = rect.left;

  switch (position) {
    case 'top':
      top = rect.top - tooltipElement.offsetHeight - padding;
      left = rect.left + rect.width / 2 - tooltipElement.offsetWidth / 2;
      break;
    case 'bottom':
      top = rect.bottom + padding;
      left = rect.left + rect.width / 2 - tooltipElement.offsetWidth / 2;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - tooltipElement.offsetHeight / 2;
      left = rect.left - tooltipElement.offsetWidth - padding;
      break;
    case 'right':
    default:
      top = rect.top + rect.height / 2 - tooltipElement.offsetHeight / 2;
      left = rect.right + padding;
      break;
  }

  tooltipElement.style.top = `${Math.max(16, top)}px`;
  tooltipElement.style.left = `${Math.max(16, left)}px`;
}

function renderStep(index: number): void {
  if (!currentTourConfig) return;
  const step = currentTourConfig.steps[index];
  if (!step) return;

  if (highlightedElement) {
    highlightedElement.classList.remove('tour-highlighted-element');
  }

  const targetElement = document.querySelector(step.target_element) as HTMLElement | null;
  if (!targetElement) {
    console.warn(`Step ${step.order}: could not find ${step.target_element}`);
    return;
  }

  highlightedElement = targetElement;
  document.documentElement.style.setProperty('--tour-theme', currentTourConfig.theme_color);
  targetElement.classList.add('tour-highlighted-element');
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const tooltip = createTooltip();
  tooltip.innerHTML = `
    <h3>${step.title}</h3>
    <p>${step.content}</p>
    <div class="onboarding-tour-actions">
      <button data-action="back">Back</button>
      <button class="primary" data-action="next">${index === currentTourConfig.steps.length - 1 ? 'Finish' : 'Next'}</button>
    </div>
  `;

  requestAnimationFrame(() => {
    tooltip.classList.add('visible');
    positionTooltip(targetElement, step.position);
  });

  console.log(`Rendering Step ${step.order}: Targeting ${step.target_element}`);
}

function nextStep(): void {
  if (!currentTourConfig) return;
  if (currentStepIndex < currentTourConfig.steps.length - 1) {
    currentStepIndex += 1;
    renderStep(currentStepIndex);
  } else {
    console.log('Tour finished!');
  }
}

function previousStep(): void {
  if (!currentTourConfig) return;
  if (currentStepIndex > 0) {
    currentStepIndex -= 1;
    renderStep(currentStepIndex);
  }
}

async function initializeTour(config?: TourConfig): Promise<void> {
  ensureStyles();
  createTooltip();

  const tourId = getTourId();
  const resolvedConfig = config || (tourId ? await fetchTourConfig(tourId) : DEFAULT_TOUR_CONFIG);

  if (tourId && resolvedConfig.id && tourId !== resolvedConfig.id) {
    console.warn(`Tour ID mismatch: data-tour-id=${tourId} vs config.id=${resolvedConfig.id}`);
  }

  currentTourConfig = resolvedConfig;
  currentStepIndex = 0;

  console.log(`Tour initialized with ID: ${tourId || resolvedConfig.id}. Starting setup...`);
  renderStep(currentStepIndex);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTour().catch((error) => {
    console.error('Failed to initialize tour', error);
  });
});

export {
  initializeTour,
  nextStep as next,
  previousStep as back,
};
