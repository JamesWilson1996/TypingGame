import { render, screen, fireEvent } from '@testing-library/react';
import StartScreen from '../components/StartScreen';

test('renders Start and View Leaderboard buttons and handles clicks', () => {
  const onStart = vi.fn();
  const onViewLeaderboard = vi.fn();

  render(<StartScreen onStart={onStart} onViewLeaderboard={onViewLeaderboard} />);

  const startBtn = screen.getByRole('button', { name: /start game/i });
  const viewBtn = screen.getByRole('button', { name: /view leaderboard/i });

  expect(startBtn).toBeInTheDocument();
  expect(viewBtn).toBeInTheDocument();

  fireEvent.click(startBtn);
  fireEvent.click(viewBtn);

  expect(onStart).toHaveBeenCalledTimes(1);
  expect(onViewLeaderboard).toHaveBeenCalledTimes(1);
});

