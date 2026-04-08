# Implementation Plan: Hệ Thống Đánh Giá Sản Phẩm

## Overview

Implement a product review system that allows verified purchasers to submit reviews with star ratings, text comments, and images. The system will be built using Vanilla JavaScript with LocalStorage for data persistence, integrating with the existing authentication and order management systems.

## Tasks

- [-] 1. Create core review management module
  - [x] 1.1 Implement Review Manager module (shared/js/reviews.js)
    - Create functions: createReview, updateReview, deleteReview, getReviewsByProduct, getReviewByUserAndProduct, calculateAverageRating, canUserReview
    - Implement data validation for review objects (rating 1-5, comment 10-1000 chars, max 3 images)
    - Add Vietnamese function aliases (taoDanhGia, capNhatDanhGia, etc.)
    - Implement XSS sanitization for text input
    - Generate unique review IDs using timestamp and random string
    - Store reviews in LocalStorage with key "reviews"
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 7.2, 8.1, 8.2, 8.3, 8.4_

  - [ ]* 1.2 Write property test for Review Manager
    - **Property 3: Review Storage Round-Trip**
    - **Property 5: Average Rating Calculation**
    - **Property 7: Update Preserves Identity**
    - **Property 8: Deletion Removes Only Target**
    - **Property 9: Duplicate Detection**
    - **Property 10: Unique ID Generation**
    - **Property 11: Validation Rejects Invalid Data**
    - **Validates: Requirements 2.2, 3.3, 3.4, 6.3, 6.5, 7.2, 7.3, 8.2, 8.3, 8.4**

- [x] 2. Implement purchase verification logic
  - [x] 2.1 Create Purchase Verifier functions in reviews.js
    - Implement verifyPurchase(userId, productId) function
    - Check orders in LocalStorage for userId with status "Đã giao" or "Hoàn thành"
    - Verify productId exists in order items
    - Add Vietnamese aliases (xacMinhMuaHang, layDonHangHoanThanh)
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 2.2 Write property test for Purchase Verifier
    - **Property 1: Purchase Verification Correctness**
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 3. Create image upload and processing module
  - [x] 3.1 Implement Image Service module (shared/js/image-service.js)
    - Create validateImageFile(file) - check format (JPEG, PNG, GIF) and size (<2MB)
    - Create convertImageToBase64(file) - convert image to base64 string
    - Create compressImage(base64String, maxSizeKB) - compress if needed
    - Add Vietnamese aliases (kiemTraFileAnh, chuyenAnhSangBase64, nenAnh)
    - Handle errors with user-friendly Vietnamese messages
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 3.2 Write unit tests for Image Service
    - Test file validation (valid/invalid formats, size limits)
    - Test base64 conversion
    - Test image count limit (max 3)
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [ ] 4. Checkpoint - Ensure core modules work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create product detail page structure
  - [x] 5.1 Create product detail page (pages/product-detail/index.html)
    - Create new directory pages/product-detail/
    - Build HTML structure with product info section and review section placeholder
    - Include navigation header and footer placeholders
    - Link to shared CSS and JS files
    - Add script tags for review modules
    - _Requirements: 5.1, 5.2_

  - [x] 5.2 Create product detail page script (pages/product-detail/script.js)
    - Load product data from URL parameter (productId)
    - Display product information (name, price, image, description)
    - Initialize review display and form components
    - Handle "Add to Cart" functionality
    - _Requirements: 5.1_

  - [x] 5.3 Create product detail page styles (pages/product-detail/style.css)
    - Style product information section
    - Create responsive layout for product and reviews
    - _Requirements: 5.1_

  - [x] 5.4 Update product cards to link to detail pages
    - Modify pages/home/script.js to make product cards clickable
    - Add navigation to product detail page with productId parameter
    - _Requirements: 5.1_

- [x] 6. Implement review form component
  - [x] 6.1 Create Review Form rendering function
    - Implement renderReviewForm(productId, existingReview) in product-detail/script.js
    - Build HTML structure with star rating input, comment textarea, and image upload
    - Show form only for verified purchasers
    - Display appropriate messages for non-logged-in users and non-purchasers
    - Pre-populate form when editing existing review
    - Add character counter for comment (0/1000)
    - _Requirements: 1.1, 1.4, 2.1, 3.1, 4.1, 7.1_

  - [x] 6.2 Implement star rating interaction
    - Add click handlers for star selection (1-5 stars)
    - Highlight selected stars with visual feedback
    - Store selected rating value
    - _Requirements: 3.1, 3.2_

  - [x] 6.3 Implement image upload functionality
    - Add file input change handler
    - Validate image files using Image Service
    - Convert images to base64 and store
    - Display image previews with remove buttons
    - Enforce 3-image limit
    - Show error messages for invalid files
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 6.4 Implement form submission handler
    - Validate all required fields (rating, comment length)
    - Call createReview or updateReview from Review Manager
    - Display success/error messages
    - Refresh review display after successful submission
    - Clear form after submission
    - _Requirements: 2.1, 2.2, 2.4, 3.2, 6.3_

  - [ ]* 6.5 Write unit tests for review form
    - Test form rendering for different user states
    - Test star rating selection
    - Test comment validation (length boundaries)
    - Test image upload and preview
    - Test form submission flow
    - _Requirements: 1.1, 2.1, 3.1, 3.2, 4.1_

- [x] 7. Implement review display component
  - [x] 7.1 Create Review Display rendering function
    - Implement renderReviewDisplay(productId) in product-detail/script.js
    - Fetch reviews using getReviewsByProduct
    - Calculate and display average rating and total count
    - Render rating distribution chart
    - Sort reviews by newest first
    - _Requirements: 3.4, 5.1, 5.2, 5.5_

  - [x] 7.2 Implement individual review item rendering
    - Create renderReviewItem(review, currentUserId) function
    - Display username, verified purchaser badge, star rating, comment, images, and date
    - Show edit/delete buttons only for review owner
    - Format timestamps in Vietnamese locale
    - Handle empty review list with "Chưa có đánh giá nào" message
    - _Requirements: 5.2, 5.3, 5.4, 6.1_

  - [x] 7.3 Implement review summary section
    - Display average rating with stars
    - Show total review count
    - Create rating distribution bars (5★ to 1★)
    - _Requirements: 3.4, 5.5_

  - [ ]* 7.4 Write unit tests for review display
    - Test review list rendering
    - Test empty state display
    - Test average rating calculation display
    - Test verified purchaser badge display
    - Test edit/delete button visibility
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Checkpoint - Ensure UI components render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement edit and delete functionality
  - [x] 9.1 Implement edit review handler
    - Add click handler for edit button
    - Populate review form with existing review data
    - Change submit button text to "Cập nhật đánh giá"
    - Call updateReview on form submission
    - Update timestamp on successful edit
    - _Requirements: 6.2, 6.3_

  - [x] 9.2 Implement delete review handler
    - Add click handler for delete button
    - Show confirmation dialog before deletion
    - Call deleteReview from Review Manager
    - Refresh review display after deletion
    - Show success message
    - _Requirements: 6.4, 6.5_

  - [ ]* 9.3 Write integration tests for edit/delete
    - Test complete edit flow
    - Test delete with confirmation
    - Test permission checks (only owner can edit/delete)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 10. Add CSS styling for review components
  - [x] 10.1 Add review styles to shared/css/components.css
    - Style review form container, star rating input, comment textarea, image upload
    - Style review display section, summary, rating distribution bars
    - Style individual review items with user info, badges, actions
    - Add responsive styles for mobile devices
    - Style success/error messages
    - Add animations for star hover and selection
    - _Requirements: All UI-related requirements_

  - [x] 10.2 Add review-specific styles to product-detail/style.css
    - Style product detail page layout
    - Position review section below product info
    - Ensure proper spacing and alignment
    - _Requirements: 5.1_

- [x] 11. Implement error handling and user feedback
  - [x] 11.1 Add error handling for all review operations
    - Implement handleReviewError(error, context) function
    - Display user-friendly Vietnamese error messages
    - Handle validation errors, storage errors, permission errors
    - Log errors for debugging
    - _Requirements: All requirements (error handling)_

  - [x] 11.2 Add success/info notifications
    - Show success message after review submission
    - Show info message for non-purchasers
    - Show login prompt for non-logged-in users
    - Display "already reviewed" message with edit option
    - _Requirements: 1.4, 2.4, 7.1_

- [x] 12. Integration and final testing
  - [x] 12.1 Wire all components together
    - Ensure review form and display work together
    - Verify purchase verification integrates correctly
    - Test image upload end-to-end
    - Verify LocalStorage operations
    - Test edit/delete flows
    - _Requirements: All requirements_

  - [x] 12.2 Test with existing system data
    - Test with existing users from auth system
    - Test with existing products from products module
    - Test with existing orders to verify purchase verification
    - Ensure no conflicts with existing LocalStorage data
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 12.3 Write end-to-end integration tests
    - Test complete user journey: view product → verify purchase → submit review → view review
    - Test edit existing review flow
    - Test delete review flow
    - Test multiple users reviewing same product
    - Test edge cases (no reviews, max images, long comments)
    - _Requirements: All requirements_

- [ ] 13. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Create admin review management page
  - [~] 14.1 Create admin reviews page structure (pages/admin/reviews/index.html)
    - Create new directory pages/admin/reviews/
    - Build HTML with sidebar navigation and main content area
    - Add statistics summary cards (total reviews, average rating, negative reviews)
    - Add filter buttons for rating (All, 5★, 4★, 3★, 2★, 1★)
    - Create reviews table with columns: Product, User, Rating, Comment, Date, Actions
    - Link to shared CSS and admin styles
    - _Requirements: 9.1, 9.2, 9.3, 13.1_

  - [~] 14.2 Create admin reviews page script (pages/admin/reviews/script.js)
    - Implement loadAllReviews() to fetch and display all reviews
    - Implement filterReviewsByRating(rating) for filter buttons
    - Implement calculateReviewStatistics() for summary cards
    - Highlight negative reviews (rating ≤ 2) with warning color
    - Add click handlers for view and delete buttons
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 13.1, 13.2, 13.3, 13.4, 13.5_

  - [~] 14.3 Implement review detail modal
    - Create modal HTML structure for viewing full review details
    - Display product name, user info (name, email), rating, full comment, all images
    - Show user's order history for context
    - Add "Liên hệ khách hàng" button for negative reviews (rating ≤ 2)
    - Add delete button in modal
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [~] 14.4 Implement contact customer functionality
    - Create contact modal with customer email and pre-filled template
    - Generate email template with: subject, customer name, product name, rating, comment
    - Add "Copy email" button to copy customer's email address
    - Log contact attempt with timestamp and admin username in review object
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [~] 14.5 Implement admin delete review functionality
    - Add delete confirmation dialog with review details
    - Call deleteReview from Review Manager
    - Log deletion action with admin username and timestamp
    - Refresh review list after deletion
    - Show success message
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [~] 14.6 Add admin review management functions to reviews.js
    - Implement getAllReviewsWithDetails() - join reviews with product and user data
    - Implement getNegativeReviews() - filter reviews with rating ≤ 2
    - Implement getUserOrderHistory(userId) - get user's completed orders
    - Implement logContactAttempt(reviewId) - log admin contact attempts
    - Add Vietnamese aliases for admin functions
    - _Requirements: 9.1, 9.2, 10.2, 10.3, 11.5_

  - [~] 14.7 Update admin sidebar navigation
    - Add "Đánh Giá" menu item to pages/admin/index.html sidebar
    - Link to pages/admin/reviews/index.html
    - Add emoji icon 💬 or ⭐ for reviews menu
    - _Requirements: 9.1_

- [ ] 15. Add CSS styling for admin review management
  - [~] 15.1 Add admin review styles to pages/admin/style.css
    - Style statistics summary cards with warning color for negative reviews
    - Style filter buttons with active state
    - Style reviews table with negative review highlighting (red/orange background)
    - Style review detail modal with proper spacing
    - Style contact modal with email template display
    - Add responsive styles for mobile devices
    - _Requirements: 9.4, 10.1, 11.1_

- [ ] 16. Final integration and testing for admin features
  - [~] 16.1 Test admin review management flow
    - Test viewing all reviews and filtering by rating
    - Test viewing review details with user info
    - Test contact customer functionality for negative reviews
    - Test admin delete review with confirmation
    - Verify statistics update correctly after filtering/deletion
    - _Requirements: All admin requirements (9-13)_

  - [~] 16.2 Test admin access control
    - Verify only admin users can access review management page
    - Test redirect for non-admin users
    - _Requirements: 9.1_

- [ ] 17. Final checkpoint - Complete admin system verification
  - Ensure all admin features work correctly, ask the user if questions arise.

- [ ] 18. Create contact management page
  - [~] 18.1 Create admin contacts page structure (pages/admin/contacts/index.html)
    - Create new directory pages/admin/contacts/
    - Build HTML with sidebar navigation and main content area
    - Add statistics summary cards (total contacts, pending, resolved)
    - Add filter buttons for status (All, Chờ xử lý, Đã liên hệ, Đã giải quyết)
    - Add "Xuất Excel" button in page header
    - Create contacts table with columns: Date, Customer, Product, Rating, Reason, Status, Notes, Actions
    - Link to shared CSS, admin styles, and SheetJS library
    - _Requirements: 14.1, 14.4, 14.5, 17.1, 17.2_

  - [~] 18.2 Create admin contacts page script (pages/admin/contacts/script.js)
    - Implement loadAllContacts() to fetch and display all contacts
    - Implement filterContactsByStatus(status) for filter buttons
    - Implement calculateContactStatistics() for summary cards
    - Highlight pending contacts with warning color
    - Add click handlers for view, add note, and status change
    - _Requirements: 14.1, 14.4, 14.5, 16.5_

  - [~] 18.3 Implement contact creation when admin contacts customer
    - Modify contactCustomer() in reviews page to create Contact record
    - Capture review details, customer info, and contact reason
    - Store contact in LocalStorage with initial status "Chờ xử lý"
    - Show success message after contact creation
    - _Requirements: 14.2, 14.3, 18.3_

  - [~] 18.4 Implement add note functionality
    - Create add note modal HTML structure
    - Add click handler for "Ghi chú" button
    - Implement addContactNote() to append notes with timestamp
    - Display all notes in contact detail view
    - Show latest note preview in contacts table
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [~] 18.5 Implement status update functionality
    - Add status dropdown in contacts table
    - Implement updateContactStatus() to change status
    - Log status changes with timestamp and admin username
    - Update UI immediately after status change
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [~] 18.6 Implement Excel export functionality
    - Add SheetJS library CDN link to contacts page
    - Implement exportContactsToExcel() function
    - Map contact data to Excel columns (Date, Customer, Email, Product, Rating, Reason, Status, Notes, Admin)
    - Generate filename with current date: lien-he-khach-hang-[date].xlsx
    - Trigger file download when "Xuất Excel" button clicked
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [~] 18.7 Add contact management functions to reviews.js
    - Implement createContact(contactData)
    - Implement updateContactStatus(contactId, newStatus)
    - Implement addContactNote(contactId, noteText)
    - Implement getContactsByStatus(status)
    - Implement getAllContacts()
    - Add Vietnamese aliases for contact functions
    - _Requirements: 14.2, 14.3, 15.2, 15.3, 16.2, 16.3, 18.2, 18.3, 18.4_

  - [~] 18.8 Update admin sidebar navigation
    - Add "Liên Hệ" menu item to pages/admin/index.html sidebar
    - Link to pages/admin/contacts/index.html
    - Add emoji icon 📞 for contacts menu
    - _Requirements: 14.1_

- [ ] 19. Add CSS styling for contact management
  - [~] 19.1 Add contact management styles to pages/admin/style.css
    - Style statistics summary cards
    - Style filter buttons with active state
    - Style contacts table with pending contact highlighting
    - Style status dropdown with color coding
    - Style add note modal
    - Style export button
    - Add responsive styles for mobile devices
    - _Requirements: 14.1, 15.1, 16.1, 16.5, 17.1_

- [ ] 20. Final integration and testing for contact management
  - [~] 20.1 Test contact management flow
    - Test creating contact from review page
    - Test viewing all contacts and filtering by status
    - Test adding notes to contacts
    - Test updating contact status
    - Test Excel export with various data
    - Verify statistics update correctly
    - _Requirements: All contact requirements (14-18)_

  - [~] 20.2 Test admin access control for contacts page
    - Verify only admin users can access contacts page
    - Test redirect for non-admin users
    - _Requirements: 14.1_

- [ ] 21. Final checkpoint - Complete contact management verification
  - Ensure all contact management features work correctly, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from design document
- Unit tests validate specific examples and edge cases
- The system integrates with existing auth, products, and orders modules
- All user-facing text is in Vietnamese
- LocalStorage is used for all data persistence
