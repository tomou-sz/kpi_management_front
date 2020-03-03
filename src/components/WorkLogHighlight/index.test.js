import React from 'react';
import WorkLogHighlight from './index';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('WorklogHighlight did renders', () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  const defaultProps = {
    logtime: {
      total_time_spent: 0,
      date: today
    }
  };

  test('Log time is below 0 hours', () => {
    const total_time_spent = -1;
    const { queryByText } = render(
      <WorkLogHighlight logtime={{ total_time_spent: total_time_spent }}  />
    )
    expect(parseInt(queryByText(total_time_spent.toString()).textContent)).toBe(total_time_spent);
  });

  test('Component did renders with default logtime', () => {
    const { queryByText } = render(
      <WorkLogHighlight {...defaultProps}  />
    )
    expect(parseInt(queryByText(defaultProps.logtime.total_time_spent.toString()).textContent)).toBe(defaultProps.logtime.total_time_spent);
  });

  test('Log time is >=0 and <= 8', () => {
    const total_time_spent = 0;
    const { queryByText } = render(
      <WorkLogHighlight logtime={{ total_time_spent: total_time_spent }} />
    )
    expect(parseInt(queryByText(total_time_spent.toString()).textContent)).toBeGreaterThanOrEqual(total_time_spent);
    expect(parseInt(queryByText(total_time_spent.toString()).textContent)).toBeLessThanOrEqual(8);
  });

  test('Log time is >=0 and > 8', () => {
    const total_time_spent = 9;
    const { queryByText } = render(
      <WorkLogHighlight logtime={{ total_time_spent: total_time_spent }} />
    )
    expect(parseInt(queryByText(total_time_spent.toString()).textContent)).toBeGreaterThan(8);
  });
})
