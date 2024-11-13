// Get all checkboxes and the progress bar element
const checkboxes = document.querySelectorAll('.mission-checkbox');
const progressBar = document.getElementById('progress-bar');
const resetButton = document.getElementById('reset-btn');

// Function to reset tasks and progress bar
function resetTasks() {
  checkboxes.forEach(checkbox => checkbox.checked = false);
  updateProgress();
  // Save the reset state to localStorage
  localStorage.setItem('missionsState', JSON.stringify(Array(checkboxes.length).fill(false)));
}

// Function to update progress bar
function updateProgress() {
  const totalMissions = checkboxes.length;
  const completedMissions = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
  const progress = (completedMissions / totalMissions) * 100;
  progressBar.style.width = `${progress}%`;
}

// Function to check the time and reset if needed
function checkAndResetTime() {
  const now = new Date();
  const currentTimeUTC = now.getTime() + now.getTimezoneOffset() * 60000; // UTC time
  const currentTimeEST = new Date(currentTimeUTC + (5 * 60 * 60000)); // Convert UTC to EST (5 hours behind)

  // Check if it's past 5 AM EST
  const hourEST = currentTimeEST.getHours();
  if (hourEST >= 5) {
    // Reset the tasks if it’s past 5 AM
    resetTasks();
  } else {
    // Load saved state from localStorage (if it exists)
    const savedState = JSON.parse(localStorage.getItem('missionsState'));
    if (savedState) {
      savedState.forEach((state, index) => {
        checkboxes[index].checked = state;
      });
    }
    updateProgress();
  }
}

// Add event listener to each checkbox to update progress bar when clicked
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const state = Array.from(checkboxes).map(checkbox => checkbox.checked);
    localStorage.setItem('missionsState', JSON.stringify(state));
    updateProgress();
  });
});

// Reset button functionality
resetButton.addEventListener('click', () => {
  resetTasks();
});

// Check and reset time when the page loads
checkAndResetTime();

// Optional: Automatically reset every 24 hours (refresh page on the next day)
setInterval(checkAndResetTime, 24 * 60 * 60 * 1000); // Check daily
