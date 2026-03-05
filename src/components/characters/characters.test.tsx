/**
 * Character component render tests — Story 2.2
 *
 * Verifies that each character renders without error under the MouseProvider
 * and that the SVG structure (eye whites + motion circles) is present.
 *
 * Note: Framer Motion's spring animation runs asynchronously; we test the
 * structural presence of elements, not final animated cx/cy values.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MouseProvider } from '@/context/MouseContext';
import OrangeBlob from './OrangeBlob';
import PurpleRect from './PurpleRect';
import BlackBar from './BlackBar';
import YellowCylinder from './YellowCylinder';

const withMouse = (ui: React.ReactElement) =>
  render(<MouseProvider>{ui}</MouseProvider>);

describe('OrangeBlob', () => {
  it('renders without crashing inside MouseProvider', () => {
    const { container } = withMouse(<OrangeBlob />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders white eye circles', () => {
    const { container } = withMouse(<OrangeBlob />);
    const whiteFills = Array.from(container.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('fill') === 'white',
    );
    expect(whiteFills).toHaveLength(2);
  });

  it('renders two animated pupil circles', () => {
    const { container } = withMouse(<OrangeBlob />);
    const darkFills = Array.from(container.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('fill') === '#1a1a1a',
    );
    // 2 pupils
    expect(darkFills).toHaveLength(2);
    // Each has r=7
    darkFills.forEach((c) => expect(c.getAttribute('r')).toBe('7'));
  });
});

describe('PurpleRect', () => {
  it('renders without crashing inside MouseProvider', () => {
    const { container } = withMouse(<PurpleRect />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders white eye circles', () => {
    const { container } = withMouse(<PurpleRect />);
    const whiteFills = Array.from(container.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('fill') === 'white',
    );
    expect(whiteFills).toHaveLength(2);
  });

  it('renders two animated pupil circles with r=9', () => {
    const { container } = withMouse(<PurpleRect />);
    const darkFills = Array.from(container.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('fill') === '#1a1a1a',
    );
    expect(darkFills).toHaveLength(2);
    darkFills.forEach((c) => expect(c.getAttribute('r')).toBe('9'));
  });
});

describe('BlackBar', () => {
  it('renders without crashing inside MouseProvider', () => {
    const { container } = withMouse(<BlackBar />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders white eye circles', () => {
    const { container } = withMouse(<BlackBar />);
    const whiteFills = Array.from(container.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('fill') === 'white',
    );
    expect(whiteFills).toHaveLength(2);
  });

  it('renders two animated pupil circles with r=6', () => {
    const { container } = withMouse(<BlackBar />);
    const darkFills = Array.from(container.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('fill') === '#1a1a1a',
    );
    expect(darkFills).toHaveLength(2);
    darkFills.forEach((c) => expect(c.getAttribute('r')).toBe('6'));
  });
});

describe('YellowCylinder', () => {
  it('renders without crashing inside MouseProvider', () => {
    const { container } = withMouse(<YellowCylinder />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders white eye circles', () => {
    const { container } = withMouse(<YellowCylinder />);
    const whiteFills = Array.from(container.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('fill') === 'white',
    );
    expect(whiteFills).toHaveLength(2);
  });

  it('renders nose dot and two animated pupil circles with r=9', () => {
    const { container } = withMouse(<YellowCylinder />);
    const darkFills = Array.from(container.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('fill') === '#1a1a1a',
    );
    // 2 pupils (r=9) + 1 nose (r=5) = 3 dark circles
    expect(darkFills).toHaveLength(3);
    const pupils = darkFills.filter((c) => c.getAttribute('r') === '9');
    expect(pupils).toHaveLength(2);
  });
});
