
// Getting Data From API 
async function getPatientsData() {
    let username = 'coalition';
    let password = 'skills-test';
    let credentials = btoa(`${username}:${password}`);
    let response = await fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
        method: 'GET',
        headers: { 'Authorization': `Basic ${credentials}` }
    });

    if (response.ok) {
        let data = await response.json();
        showPatientsData(data);

        let ShowJessicaInfo = data[3];
        showJessicasInfo(ShowJessicaInfo);
    }
    else {
        alert('Something went wrong:');
    }
}

// All Patients List
function showPatientsData(data) {
    let patientsinfo = document.getElementById('patients-list');
    let innerHTML = '';
    data.forEach(item => {
        innerHTML += `
            <li>
                <img src="${item.profile_picture}" alt="${item.name}" />
                <div class="patients-info">
                    <p class="patients-name">${item.name}</p>
                    <span class="patients-age">${item.gender}, ${item.age}</span>
                </div>
            </li>
        `;
    });
    patientsinfo.innerHTML = innerHTML;
}

// Jessicas All Info
function showJessicasInfo(user) {
    if (user) {
        const userInfo = [
            { id: 'user-name', text: user.name },
            { id: 'user-gender', text: user.gender },
            { id: 'user-dob', text: user.date_of_birth },
            { id: 'user-number', text: user.phone_number },
            { id: 'user-emergency-number', text: user.emergency_contact },
            { id: 'user-insurance', text: user.insurance_type }
        ];
        userInfo.forEach(info => document.getElementById(info.id).textContent = info.text);

        // Jessicas Lab Results
        let userLabResult = document.getElementById('user-lab-result');
        let userInnerHTML = '';

        user.lab_results.forEach(result => {
            userInnerHTML += `
                <button>
                    <span>${result}</span>
                    <img src="images/icons/download.svg" alt="">
                </button>
            `;
        });
        userLabResult.innerHTML = userInnerHTML;
        
        // Jessicas Diagnostic Results
        let userDiagnostic = document.getElementById('userDiagnosticTest');
        let diagnotiscinnerHTML = '';
        user.diagnostic_list.forEach(result => {
            diagnotiscinnerHTML += `
        <tr>
            <td>${result.name}</td>
            <td>${result.description}</td>
            <td>${result.status}</td>
        </tr>
    `;
        });

        // Jessicas Chart
        userDiagnostic.innerHTML = diagnotiscinnerHTML;
        let chartLabels = [];
        let systolicValues = [];
        let diastolicValues = [];
        user.diagnosis_history.forEach(history => {
            let label = history.month + ', ' + history.year;
            chartLabels.push(label);
            systolicValues.push(history.blood_pressure.systolic.value);
            diastolicValues.push(history.blood_pressure.diastolic.value);
        });
        loadChart(chartLabels, systolicValues, diastolicValues);
    }
}
getPatientsData();

// Chart JS
function loadChart(labels = [], systolic = [], diastolic = []) {
    const ctx = document.getElementById('bloodPressure');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Systolic',
                data: systolic,
                borderWidth: 2,
                borderColor: "#E66FD2",
                lineTension: 0.4
            },
            {
                label: 'Diastolic',
                data: diastolic,
                borderWidth: 2,
                borderColor: "#8C6FE6",
                lineTension: 0.4
            }]
        },
        options: {
            bezierCurve: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
