import { render, screen, fireEvent } from '@testing-library/react';
import Leaderboard from '../components/Leaderboard';

vi.mock('../api', () => ({
  fetchLeaderboard: vi.fn().mockResolvedValue([
    { name: 'Alice', wpm: 80, accuracy: 98 },
    { name: 'Bob', wpm: 75, accuracy: 95 },
  ]),
}));

test('renders leaderboard rows and action buttons', async () => {
  const onViewAll = vi.fn();
  const onPlayAgain = vi.fn();

  render(<Leaderboard onViewAll={onViewAll} onPlayAgain={onPlayAgain} />);

  // Rows appear
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();

  // Buttons
  const viewBtn = screen.getByRole('button', { name: /view all results/i });
  const playBtn = screen.getByRole('button', { name: /play again/i });

  fireEvent.click(viewBtn);
  fireEvent.click(playBtn);

  expect(onViewAll).toHaveBeenCalledTimes(1);
  expect(onPlayAgain).toHaveBeenCalledTimes(1);
});

