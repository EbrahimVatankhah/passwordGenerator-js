  // --- State ---
        const config = {
            length: 16,
            upper: true,
            lower: true,
            number: true,
            symbol: true,
            ambiguous: false
        };

        const chars = {
            upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lower: "abcdefghijklmnopqrstuvwxyz",
            number: "0123456789",
            symbol: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
            ambiguous: "il1Lo0O"
        };

        // --- DOM Elements ---
        const els = {
            out: document.getElementById('passwordOutput'),
            lenRange: document.getElementById('lengthRange'),
            lenVal: document.getElementById('lengthVal'),
            refresh: document.getElementById('refreshBtn'),
            copy: document.getElementById('copyBtn'),
            toast: document.getElementById('toast'),
            strengthLabel: document.getElementById('strengthLabel'),
            strengthBars: document.querySelectorAll('.s-bar'),
            history: document.getElementById('historyList'),
            checks: {
                upper: document.getElementById('chkUpper'),
                lower: document.getElementById('chkLower'),
                number: document.getElementById('chkNumber'),
                symbol: document.getElementById('chkSymbol'),
                ambiguous: document.getElementById('chkAmbiguous'),
            }
        };

        let historyLog = [];

        // --- Functions ---

        function generate() {
            let charset = "";
            let password = "";
            
            // Build Charset
            if (els.checks.upper.checked) charset += chars.upper;
            if (els.checks.lower.checked) charset += chars.lower;
            if (els.checks.number.checked) charset += chars.number;
            if (els.checks.symbol.checked) charset += chars.symbol;

            // Handle Ambiguous
            if (els.checks.ambiguous.checked) {
                for (let char of chars.ambiguous) {
                    charset = charset.split(char).join('');
                }
            }

            // Fallback if empty
            if (!charset) {
                charset = chars.lower;
                els.checks.lower.checked = true;
            }

            // Generate
            const length = parseInt(els.lenRange.value);
            const cryptoObj = window.crypto || window.msCrypto; // Modern secure random
            
            if (cryptoObj) {
                const array = new Uint32Array(length);
                cryptoObj.getRandomValues(array);
                for (let i = 0; i < length; i++) {
                    password += charset[array[i] % charset.length];
                }
            } else {
                // Legacy fallback
                for (let i = 0; i < length; i++) {
                    password += charset.charAt(Math.floor(Math.random() * charset.length));
                }
            }

            // Render
            els.out.value = password;
            checkStrength(password);
            addToHistory(password);
            
            // Animate
            els.out.parentElement.classList.remove('animate-pop');
            void els.out.parentElement.offsetWidth; // trigger reflow
            els.out.parentElement.classList.add('animate-pop');
        }

        function checkStrength(pass) {
            let score = 0;
            if (pass.length > 8) score++;
            if (pass.length > 12) score++;
            if (/[A-Z]/.test(pass)) score++;
            if (/[0-9]/.test(pass)) score++;
            if (/[^A-Za-z0-9]/.test(pass)) score++;
            
            // Normalize score 0-4
            if (score > 4) score = 4;
            
            const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-emerald-400'];
            const labels = ['Weak', 'Fair', 'Good', 'Strong'];
            
            els.strengthLabel.innerText = labels[Math.max(0, score - 1)] || "Too Weak";
            els.strengthLabel.className = `text-xs font-bold uppercase tracking-wider ${score >= 4 ? 'text-emerald-400' : 'text-slate-500'}`;

            els.strengthBars.forEach((bar, idx) => {
                bar.className = `s-bar w-3 h-1 rounded-full transition-colors duration-300 ${idx < score ? colors[Math.max(0, score - 1)] : 'bg-slate-700'}`;
            });
        }

        function showToast() {
            els.toast.classList.remove('opacity-0', '-translate-y-12');
            setTimeout(() => {
                els.toast.classList.add('opacity-0', '-translate-y-12');
            }, 2000);
        }

        function copyPass() {
            navigator.clipboard.writeText(els.out.value).then(showToast);
        }

        function addToHistory(pass) {
            // Prevent duplicate of most recent
            if (historyLog.length > 0 && historyLog[0] === pass) return;
            
            historyLog.unshift(pass);
            if (historyLog.length > 3) historyLog.pop();
            renderHistory();
        }

        function renderHistory() {
            els.history.innerHTML = historyLog.map(pass => `
                <div class="flex justify-between items-center bg-slate-800/50 p-2 rounded border border-slate-700/50 group hover:border-slate-600 transition-colors">
                    <span class="font-mono text-xs text-slate-400 truncate max-w-[200px]">${pass}</span>
                    <button onclick="navigator.clipboard.writeText('${pass}').then(showToast)" class="text-slate-500 hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity" title="Copy">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 01-2-2V6a2 2 0 012-2h8"></path></svg>
                    </button>
                </div>
            `).join('');
        }

        function clearHistory() {
            historyLog = [];
            renderHistory();
        }

        function updateSlider(e) {
            const val = e.target.value;
            els.lenVal.innerText = val;
            const percentage = ((val - e.target.min) / (e.target.max - e.target.min)) * 100;
            e.target.style.background = `linear-gradient(to right, #6366f1 ${percentage}%, #334155 ${percentage}%)`;
            generate();
        }

        // --- Events ---
        els.lenRange.addEventListener('input', updateSlider);
        els.refresh.addEventListener('click', generate);
        els.copy.addEventListener('click', copyPass);
        
        // Add event listeners to all checkboxes
        Object.values(els.checks).forEach(chk => {
            chk.addEventListener('change', generate);
        });

        // Spacebar shortcut
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'BUTTON') {
                e.preventDefault(); // Prevent scrolling
                generate();
            }
        });

        // Init
        updateSlider({target: els.lenRange}); // Set initial slider background