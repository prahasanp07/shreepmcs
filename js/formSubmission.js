// Form Submission Handler - Sends data to Google Apps Script
// Replace YOUR_DEPLOYMENT_URL_HERE with your actual Google Apps Script deployment URL

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtoznMSGbmN3UcE4a1EolMuRtPsRGawNiAyEYq2SQJwSbc4kb0Iv01-UqNdMC2pYgRrQ/exec";

// Enable smooth scrolling for anchor links
document.documentElement.style.scrollBehavior = 'smooth';

document.addEventListener('DOMContentLoaded', function() {
  // Find the form in the quote/contact section - using more specific selector
  const form = document.querySelector('.bg-primary form');
  const submitButton = form ? form.querySelector('.btn-dark') : null;
  
  if (form && submitButton) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form field elements
      const nameInput = form.querySelector('input[aria-label="Your Name"]');
      const organizationInput = form.querySelector('input[aria-label="Your Organization"]');
      const programSelect = form.querySelector('select[aria-label="Select A Program"]');
      const emailInput = form.querySelector('input[aria-label="Your Email ID"]');
      const phoneInput = form.querySelector('input[aria-label="Your Phone Number"]');
      
      // Validate required fields
      if (!nameInput.value.trim()) {
        alert('Please enter your name.');
        nameInput.focus();
        return;
      }
      
      if (!emailInput.value.trim()) {
        alert('Please enter your email address.');
        emailInput.focus();
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
      }
      
      // Prepare form data
      const formData = {
        name: nameInput.value.trim(),
        organization: organizationInput.value.trim(),
        program: programSelect.value,
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim()
      };
      
      // Disable submit button and show loading state
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
      
      try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        // With no-cors mode, we can't read the response, so show success anyway
        // The data is still sent to Google Sheets
        submitButton.textContent = '✓ Submitted Successfully!';
        submitButton.classList.add('btn-success');
        submitButton.classList.remove('btn-dark');
        
        // Reset form fields
        form.reset();
        
        // Show success message
        alert('Thank you for your inquiry!\n\nWe have received your details and will contact you shortly.');
        
        // Restore button after 3 seconds
        setTimeout(function() {
          submitButton.textContent = originalButtonText;
          submitButton.classList.remove('btn-success');
          submitButton.classList.add('btn-dark');
          submitButton.disabled = false;
        }, 3000);
      } catch (error) {
        // Network or fetch error
        console.error('Form submission error:', error);
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        if (error.message === 'Failed to fetch') {
          alert('Error: Could not reach the submission server.\n\nPlease verify:\n1. The Google Apps Script URL is correct\n2. The web app is deployed and publicly accessible\n\nCheck browser console for details.');
        } else {
          alert('Error submitting form. Please try again.\n\nError: ' + error.message);
        }
      }
    });
  } else {
    console.warn('Form elements not found. Please check the form structure.');
  }
});
