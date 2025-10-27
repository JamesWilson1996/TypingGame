import { render, screen, fireEvent } from '@testing-library/react';
import TypingGame from '../components/TypingGame';

test('shows stats row and back button; back navigates', () => {
  const onBack = vi.fn();
  render(<TypingGame onFinish={() => {}} onBack={onBack} />);

  // Live stats labels present (not finished)
  expect(screen.getByText(/time:/i)).toBeInTheDocument();
  expect(screen.getByText(/accuracy:/i)).toBeInTheDocument();
  expect(screen.getByText(/wpm:/i)).toBeInTheDocument();

  // Back button
  const back = screen.getByRole('button', { name: /back to start/i });
  fireEvent.click(back);
  expect(onBack).toHaveBeenCalledTimes(1);
});

