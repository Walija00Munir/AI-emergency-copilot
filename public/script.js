document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const problemInput = document.getElementById('problemInput');
    const resultContainer = document.getElementById('resultContainer');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const resetBtn = document.getElementById('resetBtn');

    // Result elements
    const resType = document.getElementById('resType');
    const resSeverity = document.getElementById('resSeverity');
    const resSummary = document.getElementById('resSummary');
    const resStepsList = document.getElementById('resStepsList');

    // Handle Ctrl + Enter to submit
    problemInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            submitBtn.click();
        }
    });

    // Handle Reset Button
    resetBtn.addEventListener('click', () => {
        problemInput.value = '';
        resultContainer.classList.add('hidden');
        problemInput.focus();
    });

    submitBtn.addEventListener('click', async () => {
        const problem = problemInput.value.trim();
        
        if (!problem) {
            alert('Please describe the emergency first.');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        resultContainer.classList.add('hidden');

        try {
            // Note: When deployed to Vercel, it calls the same domain's /fix endpoint
            const response = await fetch('/fix', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ problem: problem })
            });

            if (!response.ok) {
                throw new Error('Server returned an error.');
            }

            const data = await response.json();
            displayResult(data);

        } catch (error) {
            console.error('Error fetching advice:', error);
            displayResult({
                type: "Connection Error",
                severity: 5,
                summary: "Failed to connect to the Emergency AI Co-Pilot.",
                steps: ["Check your internet connection.", "Ensure the server is running if using local development.", "If this is a real emergency, call 911 immediately."]
            });
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });

    function displayResult(data) {
        resType.textContent = data.type || 'Unknown';
        
        const severity = data.severity || 5;
        resSeverity.textContent = `Severity: ${severity}`;
        
        // Remove old severity classes
        resSeverity.className = 'severity-badge';
        resSeverity.classList.add(`severity-${severity}`);

        resSummary.textContent = data.summary || 'No summary provided.';
        
        // Clear old steps
        resStepsList.innerHTML = '';
        
        const steps = data.steps || [];
        if (steps.length === 0) {
            resStepsList.innerHTML = '<li>No specific steps provided. Stay safe.</li>';
        } else {
            steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                resStepsList.appendChild(li);
            });
        }

        // Show result container
        resultContainer.classList.remove('hidden');
        
        // Scroll to results
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
