import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AllResults from '../components/AllResults';

const fetchResultsMock = vi.fn().mockResolvedValue({ total: 0, results: [] });

vi.mock('../api', () => ({
  fetchResults: (...args) => fetchResultsMock(...args),
}));

test('renders empty state and supports sort/order changes', async () => {
  render(<AllResults onBack={() => {}} />);

  // Shows header and table
  expect(await screen.findByText(/all results/i)).toBeInTheDocument();
  expect(await screen.findByText(/no results yet/i)).toBeInTheDocument();

  const sortSelect = screen.getByDisplayValue(/latest/i);
  const orderSelect = screen.getByDisplayValue(/desc/i);
  expect(sortSelect).toBeInTheDocument();
  expect(orderSelect).toBeInTheDocument();

  // Change sort and order, which should trigger reloads
  fireEvent.change(sortSelect, { target: { value: 'wpm' } });
  fireEvent.change(orderSelect, { target: { value: 'asc' } });

  // Allow effects to flush; assert additional calls occurred
  await waitFor(() => {
    expect(fetchResultsMock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
