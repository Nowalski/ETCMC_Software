document.addEventListener('DOMContentLoaded', function() {
    // Check if dark mode is enabled in local storage
    if (localStorage.getItem('darkMode') === 'enabled') {
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
    fetchBalanceAndEstimatedTime();
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
    fetch('/stop_node', { method: 'POST', credentials: 'same-origin' })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                if (response.status === 400 && data.message === 'Node is not running') {
                    // Show a friendly info alert instead of console.log
                    Swal.fire({
                        icon: 'info',
                        title: 'Node Not Running',
                        text: 'Node is not running, nothing to stop.',
                        background: backgroundColor,
                        customClass: {
                            content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                            title: getBackgroundColor() === '#333' ? 'red-title' : ''
                        }
                    });
                    // Return a rejected promise to skip further then() calls
                    return Promise.reject('Node not running');
                }
                throw new Error(data.message || 'Unknown error');
            });
        }
        return response.json();
    })
    .then(data => {
        let title, icon;
        if (data.message === 'Node stopped successfully') {
            title = 'Node Stopped Successfully';
            icon = 'success';
            document.getElementById("geth-output").value = "";
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
    })
    .catch(error => {
        // Only handle unexpected errors here
        if (error === 'Node not running') {
            // Already shown alert, so just return
            return;
        }
        console.error('Error stopping node:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error Stopping Node',
            text: error.message || 'An error occurred while stopping the node',
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
                // Replace the message text with HTML content
                Swal.fire({
                    icon: 'error',
                    title: 'Claim Failed',
                    html: `You have not staked the required amount. Claim denied. Please <a href="https://claimstake.etcmc.org/" target="_blank" style="color: #007bff;">click here</a> to stake.`,
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


const MAX_LINES = 1000;  // Maximum number of lines to keep in the textarea
const LINE_BREAK = "\n";

let pendingData = '';
let lastUpdate = Date.now();
const UPDATE_INTERVAL = 4000;  // Update interval in milliseconds

function fetchGethOutput() {
    fetch('/geth_output')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        pendingData += data;  // Collect all received data
    })
    .catch(error => {
        console.error('Error fetching Geth output:', error);
    })
    .finally(() => {
        // Schedule the next fetch
        setTimeout(fetchGethOutput, UPDATE_INTERVAL);
        
        // Update the output textarea if there's new data
        if (pendingData && Date.now() - lastUpdate >= UPDATE_INTERVAL) {
            handleGethOutput(pendingData);
            pendingData = '';  // Reset pending data after processing
            lastUpdate = Date.now();
        }
    });
}

function handleGethOutput(data) {
    const gethOutputTextarea = document.getElementById("geth-output");
    const isAtBottom = gethOutputTextarea.scrollTop + gethOutputTextarea.clientHeight >= gethOutputTextarea.scrollHeight;

    // Split the data into lines and process
    let lines = data.trim().split(LINE_BREAK);
    
    // If there are more lines than the maximum allowed, trim the oldest lines
    if (gethOutputTextarea.value.split(LINE_BREAK).length > MAX_LINES) {
        let currentLines = gethOutputTextarea.value.split(LINE_BREAK);
        currentLines = currentLines.slice(currentLines.length - MAX_LINES + lines.length);  // Keep the latest lines
        gethOutputTextarea.value = currentLines.join(LINE_BREAK);
    }
    
    // Append new data
    gethOutputTextarea.value += data;

    // Scroll to the bottom if previously at the bottom
    if (isAtBottom) {
        gethOutputTextarea.scrollTop = gethOutputTextarea.scrollHeight;
    }
}

// Start fetching Geth output when the page loads
window.onload = function() {
    fetchGethOutput();
};

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

document.addEventListener('DOMContentLoaded', () => {
    const nftSelect = document.getElementById('nft-id');
    const walletAddress = document.getElementById('wallet-address');
    const registerForm = document.getElementById('registration-form');
    const connectButton = document.getElementById('connect-button'); // Connect button inside modal
    const manualButton = document.getElementById('manual-button'); // Manual button
    const modal = document.getElementById('register-modal'); // The modal element
    let selectedNFTId = null;
    let connectedAddress = null;  // Track the connected wallet address

    // Function to connect to MetaMask
    async function connectMetaMask() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                connectedAddress = accounts[0];  // Store the connected address

                // Populate wallet address field
                if (walletAddress) {
                    walletAddress.value = connectedAddress; 
                } else {
                    console.error('Wallet address input element not found');
                }

                fetchNFTs(connectedAddress);  // Fetch NFTs after MetaMask connection
                connectButton.textContent = 'Disconnect MetaMask';  // Change button text to Disconnect
                Swal.fire({
                    icon: 'success',
                    title: 'MetaMask Connected',
                    text: `Connected wallet: ${connectedAddress}`,
                });
            } catch (error) {
                console.error('MetaMask connection error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Connection Error',
                    text: 'Please connect your MetaMask wallet.',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'MetaMask Not Installed',
                text: 'Please install MetaMask to proceed.',
            });
        }
    }

    // Handle the Connect/Disconnect button click
    connectButton.addEventListener('click', () => {
        if (connectedAddress) {
            disconnectMetaMask();  // If already connected, disconnect
        } else {
            connectMetaMask();  // If not connected, connect
        }
    });

    // Function to manually enter wallet address
    async function manualWalletInput() {
        const { value: wallet } = await Swal.fire({
            title: 'Enter Wallet Address',
            input: 'text',
            inputPlaceholder: 'Enter your wallet address',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Submit',
            inputValidator: (value) => {
                if (!Web3.utils.isAddress(value)) {
                    return 'Please enter a valid Ethereum address!';
                }
            }
        });

        if (wallet) {
            // Fill the wallet address field
            walletAddress.value = wallet;
            connectedAddress = wallet;  // Set the manual input as the connected address

            // Fetch NFTs after entering wallet address
            fetchNFTs(connectedAddress);
        }
    }

    // Function to disconnect MetaMask (reset state)
function disconnectMetaMask() {
    connectedAddress = null; // Clear the connected address
    walletAddress.value = ''; // Clear wallet address field
    nftSelect.innerHTML = '<option value="">Select an NFT</option>';  // Clear NFT options
    document.getElementById('nft-count-value').textContent = ''; // Clear the total NFT count
    document.getElementById('total-nft-container').style.display = 'none'; // Hide the total NFT count display
    connectButton.textContent = 'Connect MetaMask';  // Reset button text to "Connect"
    Swal.fire({
        icon: 'info',
        title: 'MetaMask Disconnected',
        text: 'You have disconnected your MetaMask wallet.',
    });
}


    // Handle the "Manual" button click
    manualButton.addEventListener('click', manualWalletInput); // Add event listener for manual input
    async function fetchNFTs(address) {
        try {
            let allNFTs = [];
            let nextPageParams = null;
            
            // Show the loading spinner
            document.getElementById('loading-spinner').style.display = 'inline-block';
            document.getElementById('total-nft-container').style.display = 'none';  // Hide total count text while loading
            
            // Initial API call
            do {
                let url = `https://etc.blockscout.com/api/v2/addresses/${address}/nft?type=ERC-721,ERC-1155`;
        
                // Add the next page parameters to the URL if available
                if (nextPageParams) {
                    url += `&token_contract_address_hash=${nextPageParams.token_contract_address_hash}&token_id=${nextPageParams.token_id}&token_type=${nextPageParams.token_type}`;
                }
        
                const response = await fetch(url);
                const data = await response.json();
        
                if (data.items && data.items.length > 0) {
                    allNFTs.push(...data.items); // Collect NFTs
                    console.log(`Fetched ${data.items.length} NFTs, Total so far: ${allNFTs.length}`);
                }
        
                // Check for next page parameters
                nextPageParams = data.next_page_params || null;
        
            } while (nextPageParams);  // Loop until no next page params are returned
        
            console.log(`Final NFT count: ${allNFTs.length}`);
            
            // Filter and populate the dropdown with the License NFTs
            const licenseNFTs = allNFTs.filter(nft => nft.metadata && nft.metadata.name && nft.metadata.name.includes('ETCMC-License-NFT'));
            populateNFTDropdown(licenseNFTs);
            
            // Hide the loading spinner and show the total count
            document.getElementById('loading-spinner').style.display = 'none';
            document.getElementById('total-nft-container').style.display = 'block';
            
        } catch (error) {
            console.error('Error fetching NFTs:', error);
            Swal.fire({
                icon: 'error',
                title: 'NFT Fetching Error',
                text: 'Error fetching NFTs. Please try again later.',
            });
        }
    }
    
function populateNFTDropdown(licenseNFTs) {
    console.log(`Populating dropdown with ${licenseNFTs.length} NFTs.`);
    const nftSelect = document.getElementById('nft-id');
    nftSelect.innerHTML = ''; // Clear previous options

    // Display total NFTs found
    document.getElementById('nft-count-value').textContent = licenseNFTs.length;

    if (licenseNFTs.length > 0) {
        licenseNFTs.forEach(nft => {
            const option = document.createElement('option');
            option.value = nft.id;
            option.textContent = `NFT ID: ${nft.id}`;
            nftSelect.appendChild(option);
        });
    } else {
        // Custom theming
        const background = getBackgroundColor();
        const customClass = {
            content: background === '#333' ? 'alert-text-white' : '',
            title: background === '#333' ? 'red-title' : ''
        };

        // SweetAlert: No NFTs
        Swal.fire({
            icon: 'warning',
            title: 'No License NFTs Found',
            html: 'You don\'t own any license NFTs at this address.<br><br>' +
                  '<a href="https://marketplace.etcmc.org" target="_blank" style="color: #3085d6; text-decoration: underline;">Click here to acquire one</a>',
            confirmButtonText: 'Got it',
            background: background,
            customClass: customClass
        });

        // Fallback option in dropdown
        const option = document.createElement('option');
        option.disabled = true;
        option.selected = true;
        option.textContent = 'No License NFTs available';
        nftSelect.appendChild(option);
    }
}

    

    // On form submission, collect data and process the registration
    registerForm.onsubmit = function(event) {
        event.preventDefault();

        // Get selected NFT ID and email
        selectedNFTId = nftSelect.value;
        const email = document.getElementById('email').value;

        if (!selectedNFTId) {
            Swal.fire({
                icon: 'warning',
                title: 'Selection Error',
                text: 'Please select an NFT ID.',
            });
            return;
        }

        // Send registration request with wallet address, NFT ID, and email
        const data = {
            wallet_address: walletAddress.value,
            nft_id: selectedNFTId,
            email: email,
        };

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Registration successful:', data);
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'You have successfully registered.',
            }).then(() => {
                modal.style.display = 'none';  // Close the modal after successful registration
            });
        })
        .catch(error => {
            console.error('Error during registration:', error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'Registration failed. Please try again.',
            });
        });
    };
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
                    html: `<p><strong>NFT-ID:</strong> ${data.username || 'N/A'}</p>
                           <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
                           <p><strong>Wallet Address:</strong> ${data.walletAddress || 'N/A'}</p>
                           <p><strong>Claimed Amount:</strong> ${data.claimedAmount || '0'} ETCPOW</p>
                           <p><strong>Software:</strong> ${data.softwareVersion || 'N/A'}</p>
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
                        - Run NodeBoost to Fix Peers<br>
                        - Delete ChainData<br>
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


function cycleTheme() {
    const body = document.body;
    const themes = ['white-mode', 'dark-mode', 'true-dark-mode'];
    let currentTheme = themes.find(t => body.classList.contains(t));

    // Get the index of the current theme and determine the next theme
    let currentIndex = themes.indexOf(currentTheme);
    let nextIndex = (currentIndex + 1) % themes.length;
    let nextTheme = themes[nextIndex];

    // Remove all theme classes and add the next theme class
    themes.forEach(t => body.classList.remove(t));
    body.classList.add(nextTheme);

    // Update localStorage with the new theme
    localStorage.setItem('theme', nextTheme);


}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'white-mode';
    document.body.classList.add(savedTheme);
});

// Add event listener to the theme button
document.getElementById('theme-toggle-btn').addEventListener('click', cycleTheme);


window.addEventListener("load", function() {
    const theme = localStorage.getItem('theme');
    if (theme) {
        document.body.classList.add(theme);
    }
});

document.getElementById("delete-chain-data-btn").addEventListener("click", function() {
    Swal.fire({
        title: 'Delete Chain Data',
        text: 'Are you sure you want to delete the chain data?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        background: getBackgroundColor(),
        customClass: {
            content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
            title: getBackgroundColor() === '#333' ? 'red-title' : '' 
        }
    }).then((result) => {
        if (result.isConfirmed) {
            deleteChainData();
        }
    });
});

function deleteChainData() {
    // First stop the node
    stopNode(getBackgroundColor());

    // Wait for a brief moment before proceeding with deleting chain data
    setTimeout(() => {
        fetch('/delete-chain-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to delete chain data');
            }
        })
        .then(data => {
            Swal.fire({
                title: 'Deleted!',
                text: 'Chain data has been deleted successfully.',
                icon: 'success',
                background: getBackgroundColor(),
                customClass: {
                    content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                    title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                },
                timer: 3000, // Adjust the time (in milliseconds) you want the alert to stay visible
                timerProgressBar: true, // Show progress bar
                onClose: () => {
                    // Optional callback function when the alert is closed automatically
                    // You can perform additional actions here if needed
                }
            });
            // Optionally update UI or perform any other action after deletion
        })
        .catch(error => {
            console.error('Error deleting chain data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to delete chain data.',
                icon: 'error',
                background: getBackgroundColor(),
                customClass: {
                    content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                    title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                }
            });
        });
    }, 1000); // Adjust delay time as needed
}

    // Function to fetch staking data and show results using SweetAlert
    async function fetchStakingData() {
        try {
            // Make an AJAX call to the '/check_staking' route
            const response = await fetch('/check_staking');
            
            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();

                // Check if staking data is available
                if (data.success) {
                    const stakingStatus = data.has_staked ? 'staked' : 'not staked';
                    const stakingMessage = data.has_staked 
                        ? 'You have successfully staked the required amount!' 
                        : 'You have not staked the required amount.';

                    // Show SweetAlert with success or error message
                    Swal.fire({
                        title: 'Staking Status',
                        text: stakingMessage,
                        icon: data.has_staked ? 'success' : 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                    // If no staking data, show error
                    Swal.fire({
                        title: 'Error',
                        text: data.message || 'There was an issue fetching your staking status.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                // Handle if the fetch failed
                Swal.fire({
                    title: 'Error',
                    text: 'Error Please try again later or Check Registration',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            // Handle any other errors
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'An unexpected error occurred. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    // Add event listener to the Check Staking button
    document.getElementById('check-staking-btn').addEventListener('click', fetchStakingData);

document.addEventListener('DOMContentLoaded', function() {
    // Load existing auto-claim setting
    fetch('/auto_claim_status')
        .then(response => response.json())
        .then(data => {
            console.log('Auto-claim status fetched:', data);
            const toggleButton = document.getElementById('autoClaimToggle');
            if (data.auto_claim === 'yes') {
                toggleButton.classList.add('active');
                toggleButton.textContent = 'On';
            } else {
                toggleButton.classList.remove('active');
                toggleButton.textContent = 'Off';
            }
        })
        .catch(error => {
            console.error('Error fetching auto-claim status:', error);
        });

    // Toggle button click handler
    document.getElementById('autoClaimToggle').addEventListener('click', function() {
        const isActive = this.classList.contains('active');
        const newStatus = isActive ? 'no' : 'yes';

        fetch('/set_auto_claim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ autoClaim: newStatus }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from setting auto-claim:', data);
            if (data.success) {
                this.classList.toggle('active');
                this.textContent = isActive ? 'Off' : 'On';
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    background: getBackgroundColor(),
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : ''
                    },
                    timer: 3000,
                    timerProgressBar: true
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to save auto-claim setting.',
                    icon: 'error',
                    background: getBackgroundColor(),
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : ''
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error saving auto-claim setting:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to save auto-claim setting.',
                icon: 'error',
                background: getBackgroundColor(),
                customClass: {
                    content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                    title: getBackgroundColor() === '#333' ? 'red-title' : ''
                }
            });
        });
    });
});

    document.getElementById('walletButton').addEventListener('click', async () => {
        const backgroundColor = getBackgroundColor();

        const { value: address, isDismissed } = await Swal.fire({
            title: 'Enter your wallet address',
            input: 'text',
            inputLabel: 'Wallet Address',
            inputPlaceholder: 'Enter your wallet address',
            inputAttributes: {
                autocapitalize: 'off'
            },
            confirmButtonText: 'Generate Link',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            background: backgroundColor,
            customClass: {
                container: 'swal-container',
                title: backgroundColor === '#333' ? 'swal-title-dark' : '',
                content: backgroundColor === '#333' ? 'swal-content-dark' : ''
            }
        });

        if (isDismissed) {
            return;
        }

        if (address) {
            const baseUrl = "https://etc.blockscout.com/token/0x30e97E33Ac936500Dd97c1AA0ae3Acaf8d9018Ff?tab=inventory&holder_address_hash=";
            const fullUrl = baseUrl + encodeURIComponent(address);
            
            window.open(fullUrl, '_blank');
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Wallet address is required!',
                icon: 'error',
                background: backgroundColor,
                customClass: {
                    container: 'swal-container',
                    title: backgroundColor === '#333' ? 'swal-title-dark' : '',
                    content: backgroundColor === '#333' ? 'swal-content-dark' : ''
                }
            });
        }
    });

    document.getElementById('open-register-modal').addEventListener('click', function() {
        fetchRegistrationStatus().then(data => {
            if (data.registered) {
                // Extract individual registration details
                const registrationDetails = data.registration_details;
                const email = registrationDetails.email || 'Not available';
                const nftId = registrationDetails.nft_id || 'Not available';
                const walletAddress = registrationDetails.wallet_address || 'Not available';
    
                // Show SweetAlert with formatted registration details
                Swal.fire({
                    icon: 'info',
                    title: 'Already Registered',
                    html: `
                        <strong>Email:</strong> ${email}<br>
                        <strong>NFT-ID:</strong> ${nftId}<br>
                        <strong>Wallet Address:</strong> ${walletAddress}
                    `,
                    background: getBackgroundColor(),
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                    }
                });
            } else {
                // Only show the register modal if not registered
                document.getElementById('register-modal').style.display = "block";
            }
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to check registration status',
                background: getBackgroundColor(),
                customClass: {
                    content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                    title: 'red-title'
                }
            });
        });
    });
    
    
    document.getElementById("font-size-increase-btn").addEventListener("click", function() {
        changeFontSize(1);
    });
    
    document.getElementById("font-size-decrease-btn").addEventListener("click", function() {
        changeFontSize(-1);
    });
    
    function changeFontSize(delta) {
        var textarea = document.getElementById("geth-output");
        var currentSize = parseInt(window.getComputedStyle(textarea, null).getPropertyValue('font-size'));
        var newSize = currentSize + delta;
        textarea.style.fontSize = newSize + "px";
        localStorage.setItem("fontSize", newSize);
    }
    
    window.addEventListener("load", function() {
        var fontSize = localStorage.getItem("fontSize");
        if (fontSize) {
            document.getElementById("geth-output").style.fontSize = fontSize + "px";
        }
    });
    
    
        document.addEventListener('DOMContentLoaded', function() {
            // Get the statistics button
            var viewStatisticsButton = document.getElementById('view-statistics-btn');
    
            // Add click event listener to open the statistics page in a new tab
            viewStatisticsButton.addEventListener('click', function() {
                window.open('/statistics?html=true', '_blank');
            });
        });
    
    
        function fetchRegistrationStatus() {
            return fetch('/register/check_status')
                .then(response => response.json())
                .then(data => {
                    const userNameElement = document.getElementById('user-name');
                    if (data.registration_details) {
                        console.log('Already registered:', data.registration_details);
                
                        // Extract the NFT-ID from the registration details directly
                        const nftId = data.registration_details.nft_id;
                        if (nftId) {
                            userNameElement.textContent = nftId;
                        } else {
                            userNameElement.textContent = 'Unknown';
                        }
                
                        return { registered: true, registration_details: data.registration_details };
                    } else {
                        console.log('Not registered yet');
                        userNameElement.textContent = 'Not Registered';
                        return { registered: false };
                    }
                })
                .catch(error => {
                    console.error('Error checking registration status:', error);
                    document.getElementById('user-name').textContent = 'Error';
                    return { registered: false, error: 'Unable to check registration status' };
                });
        }
        
        
    document.getElementById("check-port-btn").addEventListener("click", async function() {
        // Show a hint to the user before checking the port
        const shouldProceed = await Swal.fire({
            title: 'Hint',
            text: "Make sure Geth is running to check the port status. Otherwise, the check might fail.",
            icon: 'info',
            confirmButtonText: 'Proceed',
            showCancelButton: true,
            cancelButtonText: 'Cancel'
        });
    
        // If the user cancels the action, return early
        if (!shouldProceed.isConfirmed) {
            return;
        }
    
        try {
            // Fetch the port status from your Flask route
            const response = await fetch("/check-port");
            const data = await response.json();
    
            // Display the port status in a SweetAlert2 modal
            Swal.fire({
                title: 'Port Status',
                html: `
                    <p><strong>IP:</strong> ${data.ip}</p>
                    <p><strong>Port:</strong> ${data.port}</p>
                    <p><strong>Port Open:</strong> ${data.port_open ? 'Yes' : 'No'}</p>
                `,
                icon: 'info',
                confirmButtonText: 'Close'
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Unable to fetch port status. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Close'
            });
        }
    });
    
    
    document.getElementById('restartButton').addEventListener('click', function() {
        // Display a SweetAlert confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: 'Your computer will restart in 25 seconds.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, restart it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // If the user confirms, make the POST request to restart the machine
                fetch('/restart_machine_linux', {
                    method: 'POST',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message.includes('restart')) {
                        // Show a success message
                        Swal.fire('Success!', data.message, 'success');
                    } else {
                        // Show an error message
                        Swal.fire('Error!', data.message, 'error');
                    }
                })
                .catch(error => {
                    // Handle fetch errors
                    Swal.fire('Error!', 'There was an issue with the request.', 'error');
                });
            }
        });
    });

    
    document.addEventListener('DOMContentLoaded', function () {
        const autoStartToggle = document.getElementById('autoStartToggle');
        const autoStartStatus = document.getElementById('autostart-status');
    
        // Check if elements exist
        if (!autoStartToggle || !autoStartStatus) {
            console.error('Required DOM elements are missing');
            return;
        }
    
        // Fetch the current auto-start status
        fetch('/get_auto_start_status', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.auto_start_enabled) {
                    autoStartToggle.textContent = 'On';
                    autoStartToggle.style.backgroundColor = 'green';  // Green for enabled
                    autoStartStatus.textContent = 'On';  // Display "On" status
                } else {
                    autoStartToggle.textContent = 'Off';
                    autoStartToggle.style.backgroundColor = 'red';  // Red for disabled
                    autoStartStatus.textContent = 'Off';  // Display "Off" status
                }
            })
            .catch(error => {
                console.error('Error fetching auto-start status:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to fetch auto-start status.',
                    icon: 'error',
                    background: getBackgroundColor(),
                    customClass: {
                        content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                        title: getBackgroundColor() === '#333' ? 'red-title' : ''
                    }
                });
            });
    
        // Toggle button click event
        autoStartToggle.addEventListener('click', function () {
            fetch('/toggle_auto_start', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    const isEnabled = autoStartToggle.textContent === 'Off';
                    autoStartToggle.textContent = isEnabled ? 'On' : 'Off';
                    autoStartToggle.style.backgroundColor = isEnabled ? 'green' : 'red';  // Toggle color
                    autoStartStatus.textContent = isEnabled ? 'On' : 'Off';  // Update status
    
                    // Display SweetAlert2 notification
                    Swal.fire({
                        title: 'Success',
                        text: data.message,
                        icon: 'success',
                        background: getBackgroundColor(),
                        customClass: {
                            content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                            title: getBackgroundColor() === '#333' ? 'red-title' : ''
                        },
                        timer: 3000,
                        timerProgressBar: true
                    });
                })
                .catch(error => {
                    console.error('Error toggling auto-start setting:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to toggle auto-start setting.',
                        icon: 'error',
                        background: getBackgroundColor(),
                        customClass: {
                            content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                            title: getBackgroundColor() === '#333' ? 'red-title' : ''
                        }
                    });
                });
        });
    });
    
// Get the elements
const settingsBtn = document.querySelector('.open-settings-btn');
const settingsMenu = document.querySelector('.settings-menu');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.settings-menu-close');

// Toggle the settings menu and overlay when clicking the button
settingsBtn.addEventListener('click', function() {
    settingsMenu.classList.toggle('active');
    overlay.classList.toggle('active');
});

// Close the settings menu when clicking the close button
closeBtn.addEventListener('click', function() {
    settingsMenu.classList.remove('active');
    overlay.classList.remove('active');
});

// Close the settings menu when clicking the overlay
overlay.addEventListener('click', function() {
    settingsMenu.classList.remove('active');
    overlay.classList.remove('active');
});
    function validateInput(input) {
        // Remove any non-digit characters
        input.value = input.value.replace(/\D/g, '');
    }
    
    function validateForm() {
        const nftId = document.getElementById('username').value;
        const isNumber = /^\d+$/.test(nftId); // Regular expression to check if the input is a positive integer
    
        if (!isNumber) {
            alert('Please enter a valid numeric NFT-ID.');
            return false; // Prevent form submission
        }
    
        return true; // Allow form submission
    }
    
    
    setTimeout(function() {
                location.reload();
            }, 3600000);



            document.getElementById('start-tutorial-btn').addEventListener('click', () => {
                const highlightElement = (element) => {
                    element.classList.add('highlight');
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                };
            
                const removeHighlight = (element) => {
                    element.classList.remove('highlight');
                };
            
                // Step 1: Highlight the registration button
                const registerButton = document.getElementById('open-register-modal');
                highlightElement(registerButton);
                Swal.fire({
                    title: 'Step 1: Register Your Node',
                    text: 'Click the "Open Registration" button and fill in your NFT ID, email, and wallet address to register your node.',
                    icon: 'info',
                    confirmButtonText: 'Next',
                    customClass: {
                        popup: 'custom-swal-popup',
                    },
                    backdrop: false,
                }).then(() => {
                    // Remove highlight from registration button
                    removeHighlight(registerButton);
            
                    // Step 2: Highlight the settings button
                    const settingsButton = document.querySelector('.open-settings-btn');
                    highlightElement(settingsButton);
                    Swal.fire({
                        title: 'Step 2: Open Settings',
                        text: 'Click the gear icon to open the settings menu. Here, you can update the Geth port, change credentials, and enable automatic claim and auto-start.',
                        icon: 'info',
                        confirmButtonText: 'Next',
                        customClass: {
                            popup: 'custom-swal-popup',
                        },
                        backdrop: false,
                    }).then(() => {
                        // Remove highlight from settings button
                        removeHighlight(settingsButton);
            
                        // Step 3: Highlight the top-right information box
                        const infoBox = document.querySelector('.top-right'); // Select by class name
                        highlightElement(infoBox);
                        Swal.fire({
                            title: 'Step 3: Monitor Key Information',
                            text: 'The top-right section shows important details like ETCPOW Increment, Claim Target Balance, and Bonus. Keep an eye on it while using the application.',
                            icon: 'info',
                            confirmButtonText: 'Next',
                            customClass: {
                                popup: 'custom-swal-popup',
                            },
                            backdrop: false,
                        }).then(() => {
                            // Remove highlight from the info box
                            removeHighlight(infoBox);
            
                            // Step 4: Highlight the current balance display
                            const currentBalance = document.getElementById('current-balance'); // Select by ID
                            highlightElement(currentBalance);
                            Swal.fire({
                                title: 'Step 4: Your Current ETCPOW Balance',
                                text: 'This shows your current ETCPOW balance. It will automatically increase while your node is running.',
                                icon: 'info',
                                confirmButtonText: 'Finish',
                                customClass: {
                                    popup: 'custom-swal-popup',
                                },
                                backdrop: false,
                            }).then(() => {
                                // Remove highlight from the current balance display
                                removeHighlight(currentBalance);
                                // End of tutorial
                                Swal.fire({
                                    title: 'Tutorial Complete',
                                    text: 'You are now ready to use the Node Interface. If you need further help, check the discord or contact support.',
                                    icon: 'success',
                                    confirmButtonText: 'Close',
                                    customClass: {
                                        popup: 'custom-swal-popup',
                                    },
                                    backdrop: false,
                                });

                            });
                        });
                    });
                });
            });
            
            
    
            document.addEventListener('DOMContentLoaded', function() {
                fetch('/api/parameters')
                    .then(response => response.json())
                    .then(data => {
                        const etcpowIncrement = data.ETCPOW_INCREMENT;
            
                        // Display CLAIM_TARGET_BALANCE and ETCPOW_INCREMENT
                        document.getElementById('claim-target-balance').textContent = data.CLAIM_TARGET_BALANCE;
                        document.getElementById('etcpow-increment').textContent = etcpowIncrement;
            
                        // Display Bonus with hover tooltip and clickable link if Bonus is "No"
                        const bonusElement = document.getElementById('bonus');
                        if (data.Bonus === 'Yes') {
                            bonusElement.textContent = 'Yes';
                        } else {
                            bonusElement.innerHTML = `
                                <a href="https://pool.etcmc-monitor.org/" target="_blank" 
                                   style="text-decoration: none; color: inherit; position: relative;" 
                                   title="Maybe you want to join our pool?">
                                    No
                                </a>
                            `;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching parameters:', error);
                    });
            });
            
            
    
    
    fetchRegistrationStatus();
    
    setInterval(fetchRegistrationStatus, 5000);

    document.getElementById('delete-registration-btn').addEventListener('click', function() {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will delete your registration.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/register/delete', {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: data.message,
                            background: getBackgroundColor(),
                            customClass: {
                                content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                                title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message,
                            background: getBackgroundColor(),
                            customClass: {
                                content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                                title: getBackgroundColor() === '#333' ? 'red-title' : '' 
                            }
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error deleting registration',
                        background: getBackgroundColor(),
                        customClass: {
                            content: getBackgroundColor() === '#333' ? 'alert-text-white' : '',
                            title: 'red-title'
                        }
                    });
                });
            }
        });
    });
    
document.getElementById('api-section-btn').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent default behavior
    window.open('/api/routes', '_blank');  // Open in a new tab
});

    
    async function fetchEnode() {
        try {
            const response = await fetch('/get-enode');
            const data = await response.json();
            const enodeSpan = document.getElementById('enode-url');
    
            if (data.enode) {
                // Shorten the enode URL for nicer display
                const shortened = data.enode.length > 60
                    ? `${data.enode.slice(0, 30)}...${data.enode.slice(-25)}`
                    : data.enode;
    
                enodeSpan.textContent = shortened;
                enodeSpan.title = data.enode; // Full value on hover
            } else {
                enodeSpan.textContent = "Unavailable";
            }
        } catch (error) {
            console.error("Failed to fetch enode:", error);
            document.getElementById('enode-url').textContent = "Error loading";
        }
    }
    
    // Call on page load only once, ensuring it does not reload constantly
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fetchEnode); // Wait until the DOM is fully loaded
    } else {
        fetchEnode(); // If already loaded, call directly
    }
    
    function copyEnode() {
        const enodeUrl = document.getElementById("enode-url").textContent.trim();
        if (enodeUrl) {
            // Create a temporary input element to copy the text
            const tempInput = document.createElement("input");
            document.body.appendChild(tempInput);
            tempInput.value = enodeUrl;
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            
            // Optionally, display a success message (you could customize this)
            alert("Enode URL copied to clipboard!");
        }
    }
    
document.addEventListener('DOMContentLoaded', function () {
  const migrateButton = document.getElementById('migrate-registration-btn');

  // Check registration status
  fetch('/register/check_status', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.message === 'Node already registered' && migrateButton) {
        migrateButton.style.display = 'none';
      }
    });

  // Button logic
  if (migrateButton) {
    migrateButton.addEventListener('click', function () {
      const backgroundColor = getBackgroundColor();
      Swal.fire({
        title: "Migrate Registration",
        text: "Are you sure you want to migrate your registration?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, migrate it!",
        background: backgroundColor,
        customClass: {
          content: backgroundColor === '#333' ? 'alert-text-white' : '',
          title: backgroundColor === '#333' ? 'red-title' : ''
        }
      }).then((result) => {
        if (result.isConfirmed) {
          fetch('/register/migrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          })
          .then(response => response.json())
          .then(data => {
            Swal.fire({
              title: "Migration Complete",
              text: data.message || JSON.stringify(data),
              icon: "success",
              background: backgroundColor,
              customClass: {
                content: backgroundColor === '#333' ? 'alert-text-white' : '',
                title: backgroundColor === '#333' ? 'red-title' : ''
              }
            }).then(() => {
              if (data.success && migrateButton) {
                migrateButton.style.display = 'none';
              }
            });
          });
        }
      });
    });
  }
});

// Open and Close Modal
const bugModal = document.getElementById('bug-modal');
document.getElementById('open-bug-modal').onclick = () => bugModal.style.display = 'block';
document.getElementById('close-bug-modal').onclick = () => bugModal.style.display = 'none';
window.onclick = (event) => { if(event.target == bugModal) bugModal.style.display = 'none'; }

// Submit Bug via AJAX
document.getElementById('submitBug').onclick = async () => {
    const description = document.getElementById('bugDescription').value;
    const contact = document.getElementById('contactHandle').value;

    if(!description || !contact){
        Swal.fire('Error', 'Please fill in all fields', 'error');
        return;
    }

    // Auto-fill fields from your page
    const username = document.getElementById('user-name')?.innerText || 'N/A';
    const ip = 'Fetching IP...'; // optionally fetch from your backend
    const version = document.getElementById('version')?.innerText.replace('Version: ','') || 'N/A';
    const registration = 'Your registration info here'; // fetch via AJAX if needed

    try {
        const res = await fetch('/bug_report', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                description,
                contact,
                username,
                ip,
                version,
                registration
            })
        });
        const result = await res.json();
        if(result.success){
            Swal.fire('Success', 'Bug report submitted!', 'success');
            bugModal.style.display = 'none';
            document.getElementById('bugDescription').value = '';
            document.getElementById('contactHandle').value = '';
        } else {
            Swal.fire('Error', result.message || 'Failed to submit', 'error');
        }
    } catch(err){
        Swal.fire('Error', 'Server error', 'error');
        console.error(err);
    }
};




