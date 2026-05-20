const express = require('express');
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// --- THE NATURAL LOGIC BRAIN ---
function detectTruth(statement) {
    if (!statement) return false;
    const s = statement.toLowerCase().trim();

    const negationWords = ["not", "isnt", "doesnt", "does not", "is not", "never", "false that"];
    const isNegated = negationWords.some(word => s.includes(word));

    const ontology = {
        "february": { trueList: ["28 days", "29 days", "second month"], falseList: ["30 days", "31 days"] },
        "week": { trueList: ["7 days", "seven days", "one monday"], falseList: ["8 days", "two mondays", "2 mondays"] },
        "sun": { trueList: ["star", "hot", "yellow"], falseList: ["planet", "cold", "moon"] },
        "sky": { trueList: ["blue", "atmosphere"], falseList: ["green", "solid", "red"] },
        "green": { trueList: ["plants", "leaves", "grass", "colour of plants"], falseList: ["red", "shade of red", "blood"] },
        "2": { trueList: ["even", "prime", "number"], falseList: ["odd", "3", "three"] },
        "3": { trueList: ["prime", "odd"], falseList: ["even", "even number"] },
        "maroon": { trueList: ["maroon", "dark"], falseList: ["red", "primary red"] }
    };

    let detectedBaseTruth = null;

    for (const [subject, properties] of Object.entries(ontology)) {
        if (s.includes(subject)) {
            if (properties.trueList.some(prop => s.includes(prop))) {
                detectedBaseTruth = true;
            } else if (properties.falseList.some(prop => s.includes(prop))) {
                detectedBaseTruth = false;
            }
            break;
        }
    }

    if (detectedBaseTruth === null) detectedBaseTruth = false;
    return isNegated ? !detectedBaseTruth : detectedBaseTruth;
}

// --- GATE EXECUTION MANAGER ---
function processGateLogic(req, res, logicType) {
    const valA = detectTruth(req.body.stmtA || '');
    const valB = detectTruth(req.body.stmtB || '');
    let result = false;

    if (logicType === 'and') result = (valA && valB);
    else if (logicType === 'implication') result = (!valA || valB);
    else if (logicType === 'biconditional') result = (valA === valB);
    else if (logicType === 'xor') result = (valA !== valB);
    else if (logicType === 'or') result = (valA || valB);

    return res.json({ result: result });
}

// --- SINGLE CONSOLIDATED WEB PAGE INTERFACE ---
const HTML_INTERFACE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discrete Math Toolkit | Comprehensive Suite</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0b1329;
            --sidebar-bg: #1c2541;
            --accent-blue: #38bdf8;
            --accent-green: #10b981;
            --accent-amber: #f59e0b;
            --accent-purple: #a855f7;
            --accent-rose: #fb7185;
            --accent-orange: #f97316;
            --accent-slate: #94a3b8;
            --accent-teal: #2dd4bf;
            --accent-silver: #cbd5e1;
            --bg-color: #050a18;
            --card-bg: rgba(30, 41, 59, 0.6);
            --text-glow: 0 0 15px rgba(255, 255, 255, 0.7), 0 0 30px #38bdf8;
        }

        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; margin: 0; padding: 0; }

        body {
            background: linear-gradient(-45deg, #020617, #075985, #0891b2, #1e40af);
            background-size: 400% 400%;
            animation: liquidGradient 10s ease infinite;
            color: #ffffff;
            display: flex;
            min-height: 100vh;
            overflow-x: hidden;
        }

        @keyframes liquidGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        #sidebar {
            background-color: var(--sidebar-bg);
            width: 320px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            border-right: 2px solid rgba(255, 255, 255, 0.05);
            padding: 25px 15px;
            box-shadow: 5px 0 25px rgba(0,0,0,0.5);
            z-index: 10;
        }

        .sidebar-title { font-size: 1.4rem; font-weight: 900; text-align: center; margin-bottom: 5px; letter-spacing: 1px; text-transform: uppercase; }
        .sidebar-subtitle { font-size: 0.8rem; text-align: center; color: var(--accent-blue); margin-bottom: 30px; font-weight: 600; }
        .nav-section { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: rgba(255, 255, 255, 0.4); margin: 15px 0 5px 10px; font-weight: 600; }

        .nav-btn {
            background: transparent; border: none; color: #cbd5e1; padding: 12px 15px; text-align: left;
            font-size: 0.95rem; font-weight: 600; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
            display: flex; align-items: center; gap: 12px; margin-bottom: 4px; width: 100%;
        }

        .nav-btn:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
        .nav-btn.active { background: var(--accent-blue); color: #0b1329; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3); }

        #workspace { flex-grow: 1; padding: 40px; overflow-y: auto; height: 100vh; }
        .tab-content { display: none; width: 100%; max-width: 1200px; margin: 0 auto; }
        .tab-content.active { display: block; animation: fadeIn 0.4s ease-in-out forwards; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .main-header { font-size: 3.5rem; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; text-align: center; margin: 0; }
        .symbol-box { font-size: 4rem; text-align: center; margin-top: 5px; }
        
        .content-box { width: 100%; background: rgba(255, 255, 255, 0.03); border-radius: 30px; padding: 40px; margin-top: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); backdrop-filter: blur(15px); }
        .box-title { font-size: 2.2rem; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; text-align: center; }
        .para { font-size: 1.1rem; line-height: 1.8; color: #e2e8f0; text-align: justify; margin-bottom: 20px; }

        .true-text { color: #4ade80; text-shadow: 0 0 10px #4ade80; font-weight: bold; }
        .false-text { color: #f87171; text-shadow: 0 0 10px #f87171; font-weight: bold; }
        .sim-input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white; margin-top: 10px; font-size: 1rem; }
        
        table { width: 100%; border-collapse: collapse; background: rgba(30, 41, 59, 0.4); border-radius: 12px; overflow: hidden; margin-top: 20px; }
        th, td { padding: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: center; }
        th { background: rgba(255,255,255,0.05); }

        .columns-wrapper { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 40px; }
        .column-box { background: rgba(255, 255, 255, 0.02); border-radius: 20px; padding: 30px; border: 1px solid rgba(255,255,255,0.1); }
        .column-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 15px; text-transform: uppercase; }

        .calc-btn { display: block; width: 100%; padding: 15px; background: transparent; font-weight: bold; font-size: 1.1rem; cursor: pointer; border-radius: 10px; transition: 0.2s; margin-top: 20px; text-transform: uppercase;}
        .resultBox { display: none; margin-top: 30px; padding: 25px; background: rgba(0,0,0,0.4); border-radius: 15px; text-align: center; }
    </style>
</head>
<body>

    <div id="sidebar">
        <h1 class="sidebar-title">Discrete Math</h1>
        <div class="sidebar-subtitle">Consolidated Toolkit</div>

        <div class="nav-section">Logic Gates</div>
        <button class="nav-btn active" onclick="switchTab('and-gate')" id="btn-and-gate">⚡ AND Gate</button>
        <button class="nav-btn" onclick="switchTab('implication-gate')" id="btn-implication-gate">➔ Implication</button>
        <button class="nav-btn" onclick="switchTab('biconditional-gate')" id="btn-biconditional-gate">↔ Biconditional</button>
    </div>

    <div id="workspace">
        <div id="and-gate" class="tab-content active">
            <div style="text-align: center;">
                <h1 class="main-header" style="color: var(--accent-blue);">AND Gate</h1>
                <div class="symbol-box">∧</div>
            </div>
            <div class="content-box" style="border: 3px solid var(--accent-blue);">
                <h2 class="box-title" style="color: var(--accent-blue);">The Logical Conjunction</h2>
                <p class="para">The AND operation evaluates to true if and only if all parameters are explicitly true.</p>
                <table>
                    <thead><tr><th>Statement P</th><th>Statement Q</th><th>Conjunction (P ∧ Q)</th></tr></thead>
                    <tbody>
                        <tr><td>True</td><td>True</td><td class="true-text">True</td></tr>
                        <tr><td>True</td><td>False</td><td class="false-text">False</td></tr>
                        <tr><td>False</td><td>True</td><td class="false-text">False</td></tr>
                        <tr><td>False</td><td>False</td><td class="false-text">False</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="columns-wrapper">
                <div class="column-box" style="border-color: var(--accent-blue);">
                    <h3 class="column-title" style="color: var(--accent-blue);">Gate Simulator</h3>
                    <label>Statement P Context:</label>
                    <input type="text" id="and-stmtA" class="sim-input" placeholder="e.g., sun is yellow">
                    <label style="margin-top: 15px; display:block;">Statement Q Context:</label>
                    <input type="text" id="and-stmtB" class="sim-input" placeholder="e.g., sky is blue">
                    <button onclick="runSimulator('and')" class="calc-btn" style="color: var(--accent-blue); border: 2px solid var(--accent-blue);">Check Conjunction ⚡</button>
                    <div id="and-resultBox" class="resultBox" style="border: 1px solid var(--accent-blue);">
                        <h4 style="color: var(--accent-blue);">Result:</h4>
                        <p id="and-resStatement" style="font-size: 1.2rem; margin-top: 10px;"></p>
                    </div>
                </div>
            </div>
        </div>

        <div id="implication-gate" class="tab-content">
            <div style="text-align: center;">
                <h1 class="main-header" style="color: var(--accent-teal);">Implication Gate</h1>
                <div class="symbol-box">➔</div>
            </div>
            <div class="content-box" style="border: 3px solid var(--accent-teal);">
                <h2 class="box-title" style="color: var(--accent-teal);">Conditional Operator</h2>
                <p class="para">The Implication operator produces a false value only when a true premise yields a false realization.</p>
                <table>
                    <thead><tr><th>Premise P</th><th>Conclusion Q</th><th>Implication (P → Q)</th></tr></thead>
                    <tbody>
                        <tr><td>True</td><td>True</td><td class="true-text">True</td></tr>
                        <tr><td>True</td><td>False</td><td class="false-text">False</td></tr>
                        <tr><td>False</td><td>True</td><td class="true-text">True (Vacuous)</td></tr>
                        <tr><td>False</td><td>False</td><td class="true-text">True (Vacuous)</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="columns-wrapper">
                <div class="column-box" style="border-color: var(--accent-teal);">
                    <h3 class="column-title" style="color: var(--accent-teal);">Gate Simulator</h3>
                    <label>Premise P Context:</label>
                    <input type="text" id="implication-stmtA" class="sim-input" placeholder="e.g., sun is planet">
                    <label style="margin-top: 15px; display:block;">Conclusion Q Context:</label>
                    <input type="text" id="implication-stmtB" class="sim-input" placeholder="e.g., sky is blue">
                    <button onclick="runSimulator('implication')" class="calc-btn" style="color: var(--accent-teal); border: 2px solid var(--accent-teal);">Check Implication ⚡</button>
                    <div id="implication-resultBox" class="resultBox" style="border: 1px solid var(--accent-teal);">
                        <h4 style="color: var(--accent-teal);">Resolution:</h4>
                        <p id="implication-resStatement" style="font-size: 1.2rem; margin-top: 10px;"></p>
                    </div>
                </div>
            </div>
        </div>

        <div id="biconditional-gate" class="tab-content">
            <div style="text-align: center;">
                <h1 class="main-header" style="color: #818cf8;">Biconditional</h1>
                <div class="symbol-box">↔</div>
            </div>
            <div class="content-box" style="border: 3px solid #818cf8;">
                <h2 class="box-title" style="color: #818cf8;">Equivalence Logics</h2>
                <p class="para">The Biconditional statement produces a true result when both arguments map cleanly to identical values.</p>
                <table>
                    <thead><tr><th>Statement P</th><th>Statement Q</th><th>Biconditional (P ↔ Q)</th></tr></thead>
                    <tbody>
                        <tr><td>True</td><td>True</td><td class="true-text">True</td></tr>
                        <tr><td>True</td><td>False</td><td class="false-text">False</td></tr>
                        <tr><td>False</td><td>True</td><td class="false-text">False</td></tr>
                        <tr><td>False</td><td>False</td><td class="true-text">True</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="columns-wrapper">
                <div class="column-box" style="border-color: #818cf8;">
                    <h3 class="column-title" style="color: #818cf8;">Gate Simulator</h3>
                    <label>Statement P Context:</label>
                    <input type="text" id="biconditional-stmtA" class="sim-input" placeholder="e.g., maroon is dark">
                    <label style="margin-top: 15px; display:block;">Statement Q Context:</label>
                    <input type="text" id="biconditional-stmtB" class="sim-input" placeholder="e.g., green is red">
                    <button onclick="runSimulator('biconditional')" class="calc-btn" style="color: #818cf8; border: 2px solid #818cf8;">Check Equivalency ⚡</button>
                    <div id="biconditional-resultBox" class="resultBox" style="border: 1px solid #818cf8;">
                        <h4 style="color: #818cf8;">Resolution:</h4>
                        <p id="biconditional-resStatement" style="font-size: 1.2rem; margin-top: 10px;"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            
            document.getElementById(tabId).classList.add('active');
            document.getElementById('btn-' + tabId).classList.add('active');
        }

        async function runSimulator(gateType) {
            const stmtA = document.getElementById(gateType + '-stmtA').value;
            const stmtB = document.getElementById(gateType + '-stmtB').value;
            
            const response = await fetch('/api/gate/' + gateType, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stmtA: stmtA, stmtB: stmtB })
            });
            
            const data = await response.json();
            const resBox = document.getElementById(gateType + '-resultBox');
            const resText = document.getElementById(gateType + '-resStatement');
            
            resBox.style.display = "block";
            if(data.result) {
                resText.innerHTML = '<span class="true-text">TRUE</span>';
            } else {
                resText.innerHTML = '<span class="false-text">FALSE</span>';
            }
        }
    </script>
</body>
</html>
`;

// --- ROUTE ROUTING DEFENSES ---
app.all('/', (req, res) => {
    res.send(HTML_INTERFACE);
});

app.post('/api/gate/:gateType', (req, res) => {
    processGateLogic(req, res, req.params.gateType);
});

// Structural fallback shielding
app.all('*', (req, res) => {
    res.redirect('/');
});

// --- SERVER INITIALIZATION ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Application online and responding securely on port ${PORT}`);
});
