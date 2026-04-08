# Implementation Plan: Dashboard Time Filter

## Overview

Implement a time filter component for the admin dashboard that allows filtering charts by week (7 days), month (30 days), or year (12 months). All four charts (Revenue, Order Status, Top Products, New Users) will update synchronously when the filter changes.

## Tasks

- [x] 1. Add time filter UI component to dashboard HTML
  - Add filter button group with three options: "Tuần (7 ngày)", "Tháng (30 ngày)", "Năm (12 tháng)"
  - Place filter component above the charts section in pages/admin/dashboard/index.html
  - Set "Tuần" as the default active button
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Add CSS styles for time filter component
  - Add .time-filter and .filter-btn styles to pages/admin/style.css
  - Implement hover and active states for filter buttons
  - Ensure responsive layout for mobile and desktop
  - _Requirements: 1.5, 8.3, 8.4_

- [x] 3. Implement date range calculation and data filtering utilities
  - [x] 3.1 Create getStartDate() function to calculate start date based on period
    - Support 'week' (7 days), 'month' (30 days), 'year' (365 days)
    - Return Date object with time set to 00:00:00
    - _Requirements: 6.1, 6.4_
  
  - [ ]* 3.2 Write unit tests for getStartDate()
    - Test all three time periods return correct dates
    - Test edge cases: month transitions, year transitions, leap years
    - _Requirements: 6.1, 6.5_
  
  - [x] 3.3 Create filterByDateRange() function to filter data by date range
    - Filter arrays based on createdAt timestamp
    - Handle missing or invalid createdAt gracefully
    - Return empty array for null/invalid input
    - _Requirements: 6.2, 6.3_
  
  - [ ]* 3.4 Write unit tests for filterByDateRange()
    - Test filtering with valid data
    - Test with empty arrays, missing createdAt, invalid dates
    - Test boundary conditions
    - _Requirements: 6.2, 6.3_

- [x] 4. Implement data aggregation helper functions
  - [x] 4.1 Create aggregateByDay() function for week/month views
    - Generate labels for each day in the period
    - Aggregate revenue data by day
    - Exclude cancelled orders from revenue calculations
    - Return { labels: string[], data: number[] }
    - _Requirements: 2.1, 2.2, 2.4_
  
  - [x] 4.2 Create aggregateByMonth() function for year view
    - Generate labels for 12 months
    - Aggregate revenue data by month
    - Exclude cancelled orders from revenue calculations
    - Return { labels: string[], data: number[] }
    - _Requirements: 2.3, 2.4_
  
  - [x] 4.3 Create aggregateUsersByDay() function for week/month views
    - Generate labels for each day in the period
    - Count new users by day
    - Return { labels: string[], data: number[] }
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [x] 4.4 Create aggregateUsersByMonth() function for year view
    - Generate labels for 12 months
    - Count new users by month
    - Return { labels: string[], data: number[] }
    - _Requirements: 5.3, 5.4_
  
  - [ ]* 4.5 Write unit tests for aggregation functions
    - Test aggregateByDay() with week and month periods
    - Test aggregateByMonth() with year period
    - Test with empty data (should return zeros)
    - Test cancelled order exclusion
    - _Requirements: 2.4, 5.4_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Refactor existing chart functions to use filtered data
  - [x] 6.1 Refactor updateRevenueChart() to accept time period
    - Use getStartDate() and filterByDateRange() to filter orders
    - Use aggregateByDay() for week/month, aggregateByMonth() for year
    - Destroy existing chart before recreating
    - Preserve existing chart styling and options
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 7.4, 7.5_
  
  - [x] 6.2 Refactor updateOrderStatusChart() to accept time period
    - Use getStartDate() and filterByDateRange() to filter orders
    - Count orders by status within the time period
    - Destroy existing chart before recreating
    - Preserve existing chart styling and options
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.4, 7.5_
  
  - [x] 6.3 Refactor updateTopProductsChart() to accept time period
    - Use getStartDate() and filterByDateRange() to filter orders
    - Count product quantities from filtered orders
    - Sort and get top 5 products
    - Destroy existing chart before recreating
    - Preserve existing chart styling and options
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.4, 7.5_
  
  - [x] 6.4 Refactor updateNewUsersChart() to accept time period
    - Use getStartDate() and filterByDateRange() to filter users
    - Use aggregateUsersByDay() for week/month, aggregateUsersByMonth() for year
    - Destroy existing chart before recreating
    - Preserve existing chart styling and options
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.4, 7.5_

- [x] 7. Implement time filter state management and event handling
  - [x] 7.1 Add currentTimePeriod global variable
    - Initialize to 'week' as default
    - _Requirements: 1.3_
  
  - [x] 7.2 Create initTimeFilter() function
    - Attach click event listeners to filter buttons
    - _Requirements: 1.4_
  
  - [x] 7.3 Create handleFilterChange() function
    - Get period from button data-period attribute
    - Update active button state
    - Call refreshAllCharts()
    - _Requirements: 1.5, 7.2_
  
  - [x] 7.4 Create refreshAllCharts() function
    - Call all four chart update functions synchronously
    - Pass currentTimePeriod to each function
    - _Requirements: 7.1, 7.3_

- [x] 8. Wire everything together and initialize
  - [x] 8.1 Update dashboard initialization code
    - Call initTimeFilter() after checkAdminAccess()
    - Update existing chart init calls to use refactored functions
    - Ensure charts initialize with 'week' period by default
    - _Requirements: 1.3, 7.1_
  
  - [ ]* 8.2 Write integration tests for full filter flow
    - Test clicking filter buttons updates all charts
    - Test chart data matches filtered data
    - Test UI state updates correctly
    - Test no console errors during filter changes
    - _Requirements: 7.1, 7.3, 8.2_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- All chart functions must destroy existing charts before recreating to prevent memory leaks
- Use Chart.js v4.4.0 API for chart operations
- Maintain existing chart colors and styling throughout refactoring
