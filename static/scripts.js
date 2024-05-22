document.addEventListener('DOMContentLoaded', function() {
    // Check if dark mode is enabled in local storage
    if (localStorage.getItem('darkMode') === 'enabled') {
        toggleDarkMode(); // Apply dark mode if enabled
    }

    // Restore system usage section visibility state from local storage
    const systemUsageSection = document.querySelector('.system-usage');
    const systemUsageVisible = localStorage.getItem('systemUsageVisible');
    if (systemUsageVisible === 'true') {
        systemUsageSection.classList.remove('hidden');
    } else {
        systemUsageSection.classList.add('hidden');
    }
    
    document.getElementById('start-node-btn').addEventListener('click', function() {
        startNode(getBackgroundColor());
    });
    document.getElementById('stop-node-btn').addEventListener('click', function() {
        stopNode(getBackgroundColor());
    });
    document.getElementById('claim-balance-btn').addEventListener('click', function() {
        claimBalance(getBackgroundColor());
    });
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('dark-mode').addEventListener('click', toggleDarkMode);
    getCurrentBalance();
    fetchGethOutput();
});
document.addEventListener('DOMContentLoaded', function() {
    fetch('/get_port')
        .then(response => response.json())
        .then(data => {
            document.getElementById('port').value = data.port;
        })
        .catch(error => console.error('Error fetching port:', error));
});

function startNode(backgroundColor) {
    var port = document.getElementById("port").value || "30303";

    fetch('/start_node', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ port: port })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message.includes('initiated successfully')) {
            Swal.fire({
                icon: 'success',
                title: 'Node Start Process Initiated',
                text: 'The process to start the node has been initiated successfully. Please wait for the node to start.',
                background: backgroundColor,
                customClass: {
                    content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                    title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                }
            });
            fetch('/save_port', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ port: port })
            }).catch(error => console.error('Error saving port:', error));
        } else {
            Swal.fire({
                icon: data.success ? 'success' : 'error',
                title: data.success ? 'Node Started Successfully' : 'Error Starting Node',
                text: data.message,
                background: backgroundColor,
                customClass: {
                    content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                    title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                }
            });
        }
    })
    .catch(error => {
        console.error('Error starting node:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error Starting Node',
            text: 'An error occurred while starting the node',
            background: backgroundColor,
            customClass: {
                content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                title: getBackgroundColor() === '#333' ? 'red-title' : '' 
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("global-btn").addEventListener("click", function () {
        Swal.fire({
            titleText: 'Announcement',
            html: '<iframe src="https://etcmc.org/updatetext" style="width: 100%; height: 13vh; border: none; transform: scale(1); transform-origin: 0 0;"></iframe>', // Adjust width and height here
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                popup: 'custom-swal-popup',
                title: 'red-title'
            }
        });
    });
});

setInterval(fetchBalanceAndEstimatedTime, 5000);

function fetchBalanceAndEstimatedTime() {
    fetch('/balance')
        .then(response => response.json())
        .then(data => {
            document.getElementById('current-balance').textContent = `Current ETCPOW: ${data.balance}`;
            fetchEstimatedTime();
        })
        .catch(error => console.error('Error fetching balance:', error));
}

function fetchEstimatedTime() {
    fetch('/get_claim_estimated_time')
        .then(response => response.json())
        .then(data => {
            const estimatedTime = parseEstimatedTime(data.estimated_time);
            document.getElementById('claim-estimated-time').textContent = `Estimated Time to Claim: ${estimatedTime}`;
        })
        .catch(error => console.error('Error fetching estimated time:', error));
}

function parseEstimatedTime(estimatedTime) {
    const days = Math.floor(estimatedTime / 24);
    const hours = Math.floor(estimatedTime % 24);
    const minutes = Math.round((estimatedTime % 1) * 60);
    return `${days} Days ${hours} Hours ${minutes} Minutes`;
}

function stopNode(backgroundColor) {
    fetch('/stop_node', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        let title, icon;
        if (data.message === 'Node stopped successfully') {
            title = 'Node Stopped Successfully';
            icon = 'success';
        } else {
            title = 'Error Stopping Node';
            icon = 'error';
        }
        Swal.fire({
            icon: icon,
            title: title,
            text: data.message,
            background: backgroundColor,
            customClass: {
                content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                title: getBackgroundColor() === '#333' ? 'red-title' : '' 
            }
        });
        if (data.message === 'Node stopped successfully') {
            document.getElementById("geth-output").value = ""; 
        }
    })
    .catch(error => {
        console.error('Error stopping node:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error Stopping Node',
            text: 'An error occurred while stopping the node',
            background: backgroundColor,
            customClass: {
                content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                title: getBackgroundColor() === '#333' ? 'red-title' : '' 
            }
        });
    });
}

function claimBalance(backgroundColor) {
    fetch('/claim', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Claim Successful!',
                text: `ETCPOW claimed successfully! Claimed amount: ${data.claimedAmount} ETCPOW`,
                showConfirmButton: false,
                timer: 5000,
                background: backgroundColor,
                customClass: {
                    content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                    title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                }
            });
        } else {
            if (data.message.includes('Balance is less than claim target balance')) {
                const targetBalanceMatch = data.message.match(/(\d+(?:\.\d+)?)\sETCPOW/);
                const targetBalance = targetBalanceMatch ? targetBalanceMatch[1] : 'unknown';
                
                Swal.fire({
                    icon: 'error',
                    title: 'Claim Failed',
                    text: `Your balance is less than the claim target (${targetBalance} ETCPOW).`,
                    background: backgroundColor,
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Claim Failed',
                    text: data.message,
                    background: backgroundColor,
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                    }
                });
            }
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error claiming balance',
            background: backgroundColor,
            customClass: {
                content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                title: getBackgroundColor() === '#333' ? 'red-title' : '' 
            }
        });
    });
}

function getCurrentBalance() {
    fetch('/balance')
    .then(response => response.json())
    .then(data => {
        document.getElementById("current-balance").innerText = data.balance + " ETCPOW";
    })
    .catch(error => {
        console.error('Error fetching balance:', error);
    });
}

function fetchGethOutput() {
    fetch('/geth_output')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        appendGethOutput(data);
    })
    .catch(error => {
        console.error('Error fetching Geth output:', error);
    })
    .finally(() => {
        setTimeout(fetchGethOutput, 1000);
    });
}

function appendGethOutput(data) {
    var gethOutputTextarea = document.getElementById("geth-output");
    const prevScrollTop = gethOutputTextarea.scrollTop;
    const prevScrollHeight = gethOutputTextarea.scrollHeight;
    const isAtBottom = prevScrollTop + gethOutputTextarea.clientHeight >= prevScrollHeight;
    const trimmedData = data.trim();

    if (trimmedData !== '') {
        gethOutputTextarea.value += trimmedData + "\n";
    }

    if (isAtBottom) {
        gethOutputTextarea.scrollTop = gethOutputTextarea.scrollHeight;
    } else {
        setTimeout(() => {
            gethOutputTextarea.scrollTop = gethOutputTextarea.scrollHeight;
        }, 100);
    }
}


function handleLogout() {
    const backgroundColor = getBackgroundColor();

    Swal.fire({
        title: "Logging Out",
        text: "Are you sure you want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!",
        background: backgroundColor,
        customClass: {
            content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
            title: getBackgroundColor() === '#333' ? 'red-title' : '' 
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/logout";
        }
    });
}

document.getElementById('open-register-modal').addEventListener('click', function() {
    document.getElementById('register-modal').style.display = "block";
});

document.getElementById('toggle-system-usage-btn').addEventListener('click', function() {
    var systemUsageSection = document.querySelector('.system-usage');
    systemUsageSection.classList.toggle('hidden');

    const systemUsageVisible = !systemUsageSection.classList.contains('hidden');
    localStorage.setItem('systemUsageVisible', systemUsageVisible.toString());
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('register-modal').style.display = "none";
});

document.getElementById('change-credentials-btn').addEventListener('click', function() {
    window.location.href = "/change_credentials";
});

document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var formData = new FormData(this);
    
    const backgroundColor = getBackgroundColor();

    fetch('/register', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Welcome, ' + formData.get('username') + '!',
                showConfirmButton: false,
                timer: 5000,
                background: backgroundColor,
                customClass: {
                    content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                    title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                }
            });
        } else {
            if (data.registration_details) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message + '\n' + data.registration_details,
                    background: backgroundColor,
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message,
                    background: backgroundColor,
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                    }
                });
            }
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error registering node',
            background: backgroundColor,
            customClass: {
                content: backgroundColor === '#333' ? 'alert-text-white' : '',
                title: 'red-title'
            }
        });
    });

    document.getElementById('register-modal').style.display = "none";
});

document.getElementById('last-claim-btn').addEventListener('click', function () {
    const backgroundColor = getBackgroundColor();

    fetch('/last_claim')
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                Swal.fire({
                    icon: 'info',
                    title: 'Last Claim Details',
                    html: `<p>${data.message}</p>`,
                    confirmButtonText: 'Close',
                    background: backgroundColor,
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                    }
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Last Claim Details',
                    html: `<p><strong>Username:</strong> ${data.username || 'N/A'}</p>
                           <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
                           <p><strong>Wallet Address:</strong> ${data.walletAddress || 'N/A'}</p>
                           <p><strong>Claimed Amount:</strong> ${data.claimedAmount || '0'} ETCPOW</p>
                           <p><strong>Claimed Time:</strong> ${data.claimedTime || 'N/A'}</p>`,
                    confirmButtonText: 'Close',
                    background: backgroundColor,
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching claim data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch claim details.',
                confirmButtonText: 'Close',
                background: backgroundColor,
                customClass: {
                    content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                    title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                }
            });
        });
});

function updateSystemUsage() {
    fetch('/system_usage')
        .then(response => response.json())
        .then(data => {
            document.getElementById('cpu-usage').textContent = 'CPU Usage: ' + data.cpu_percent.toFixed(1) + '%';
            document.getElementById('ram-usage').textContent = 'RAM Usage: ' + data.ram_percent.toFixed(1) + '%';
            document.getElementById('disk-usage').textContent = 'Disk Usage: ' + data.disk_percent.toFixed(1) + '%';
            
            const uptimeParts = data.uptime.split(', ');
            const uptimeString = uptimeParts.filter(part => !part.includes('seconds')).join(', ');

            document.getElementById('uptime').textContent = 'Uptime: ' + uptimeString;
            
            if (data.pending_reboot === undefined) {
                document.getElementById('pending-reboot').textContent = 'Pending Reboot: Windows';
            } else {
                document.getElementById('pending-reboot').textContent = 'Pending Reboot: ' + data.pending_reboot;
            }
        })
        .catch(error => {
            console.error('Error fetching system usage data:', error);
        });
}


updateSystemUsage();

setInterval(updateSystemUsage, 10000);

const helpBtn = document.getElementById("help-btn");

helpBtn.addEventListener("click", () => {
    Swal.fire({
        title: "Help Section",
        html: `
            <div class="help-modal">
                <div class="section">
                    <h3>Features</h3>
                    <p>
                        - Start and stop the Geth node<br>
                        - Register your node<br>
                        - Check your current ETCPOW balance<br>
                        - Claim your ETCPOW balance<br>
                        - View the Geth console output
                    </p>
                </div>
                <div class="section">
                    <h3>Settings</h3>
                    <p>
                        - Change the Geth port<br>
                        - Toggle system usage information<br>
                        - Change your credentials
                    </p>
                </div>
        `,
        confirmButtonText: "Got it!",
        confirmButtonColor: "#007bff",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        stopKeydownPropagation: false,
        background: getBackgroundColor(),
        customClass: {
            content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
            title: getBackgroundColor() === '#333' ? 'red-title' : '' 
        },
        footer: `
            <div class="footer-links">
                <a href="mailto:support@etcmc.org"><i class="fas fa-envelope"></i> Email</a> 
                <a href="https://discord.gg/etcmc" target="_blank"><i class="fab fa-discord"></i> Discord</a> 
                <a href="https://support.etcmc-monitor.org/" target="_blank"><i class="fas fa-life-ring"></i> Support</a>
            </div>
        `
    });
});


fetch('/get_version')
.then(response => response.json())
.then(data => {
    const versionSpan = document.getElementById('version');
    if (data.version) {
        versionSpan.textContent = `Version: ${data.version}`;
    } else {
        versionSpan.textContent = 'Version: N/A';
    }
})
.catch(error => console.error('Error fetching version:', error));

function getBackgroundColor() {
    return document.body.classList.contains('dark-mode') ? '#333' : '#fff';
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const darkModeIcon = document.getElementById('dark-mode-icon');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.removeItem('darkMode');
        darkModeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}



