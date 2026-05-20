import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates')

# --- THE NATURAL LOGIC BRAIN ---
def detect_truth(statement):
    s = statement.lower().strip()
    if not s: return False

    negation_words = ["not", "isnt", "doesnt", "does not", "is not", "never", "false that"]
    is_negated = any(word in s for word in negation_words)

    ontology = {
        "february": {"true": ["28 days", "29 days", "second month"], "false": ["30 days", "31 days"]},
        "week": {"true": ["7 days", "seven days", "one monday"], "false": ["8 days", "two mondays", "2 mondays"]},
        "sun": {"true": ["star", "hot", "yellow"], "false": ["planet", "cold", "moon"]},
        "sky": {"true": ["blue", "atmosphere"], "false": ["green", "solid", "red"]},
        "green": {"true": ["plants", "leaves", "grass", "colour of plants"], "false": ["red", "shade of red", "blood"]},
        "2": {"true": ["even", "prime", "number"], "false": ["odd", "3", "three"]},
        "3": {"true": ["prime", "odd"], "false": ["even", "even number"]},
        "maroon": {"true": ["maroon", "dark"], "false": ["red", "primary red"]}
    }

    detected_base_truth = None
    for subject, properties in ontology.items():
        if subject in s:
            if any(prop in s for prop in properties["true"]):
                detected_base_truth = True
            elif any(prop in s for prop in properties["false"]):
                detected_base_truth = False
            break

    if detected_base_truth is None: detected_base_truth = False
    return not detected_base_truth if is_negated else detected_base_truth

# --- 1. MAIN HUBS ---
@app.route('/')
def index(): return render_template('index.html')

@app.route('/truth')
def truth(): return render_template('truth.html')

@app.route('/relations')
def relations(): return render_template('relations.html')

@app.route('/set-operations')
def set_operations(): return render_template('set_operations.html')

# --- 2. TRUTH TABLE LOGIC ---
def handle_gate(logic_type, template_name):
    if request.method == 'POST':
        data = request.json
        valA = detect_truth(data.get('stmtA', ''))
        valB = detect_truth(data.get('stmtB', ''))
        
        if logic_type == 'xor': result = (valA != valB)
        elif logic_type == 'implication': result = ((not valA) or valB)
        elif logic_type == 'biconditional': result = (valA == valB)
        elif logic_type == 'and': result = (valA and valB)
        elif logic_type == 'or': result = (valA or valB)
        return jsonify({'result': result})
    return render_template(template_name)

@app.route('/and-gate', methods=['GET', 'POST'])
def and_gate(): return handle_gate('and', 'and_gate.html')

@app.route('/or-gate', methods=['GET', 'POST'])
def or_gate(): return handle_gate('or', 'or_gate.html')

@app.route('/not-gate', methods=['GET', 'POST'])
def not_gate():
    if request.method == 'POST':
        data = request.json
        valA = detect_truth(data.get('stmtA', ''))
        return jsonify({'result': not valA})
    return render_template('not_gate.html')

# --- 3. UPDATED MISSING ROUTES (Syncing with your _gate.html files) ---

@app.route('/xor', methods=['GET', 'POST'])
@app.route('/xor-gate', methods=['GET', 'POST'])
def xor_gate(): 
    return handle_gate('xor', 'xor_gate.html')

@app.route('/implication', methods=['GET', 'POST'])
@app.route('/implication-gate', methods=['GET', 'POST'])
def implication_gate(): 
    return handle_gate('implication', 'implication_gate.html')

@app.route('/biconditional', methods=['GET', 'POST'])
@app.route('/biconditional-gate', methods=['GET', 'POST'])
def biconditional_gate(): 
    return handle_gate('biconditional', 'biconditional_gate.html')

# --- 4. SET OPERATIONS ROUTES ---
@app.route('/union')
def view_union(): return render_template('union.html')

@app.route('/intersection')
def view_intersection(): return render_template('intersection.html')

@app.route('/difference')
def view_difference(): return render_template('difference.html')

@app.route('/symmetric-difference')
def view_symmetric_difference(): return render_template('symmetric-difference.html')

@app.route('/complement')
def view_complement(): return render_template('complement.html')

# --- 5. RELATIONS DICTIONARY ROUTES ---
@app.route('/reflexive-relation')
def view_reflexive(): return render_template('reflexive.html')

@app.route('/irreflexive-relation')
def view_irreflexive(): return render_template('irreflexive.html')

@app.route('/symmetric-relation')
def view_symmetric_relation(): return render_template('symmetric.html')

@app.route('/antisymmetric-relation')
def view_antisymmetric_relation(): return render_template('antisymmetric.html')

@app.route('/asymmetric-relation')
def view_asymmetric_relation(): return render_template('asymmetric.html')

@app.route('/transitive-relation')
def view_transitive(): return render_template('transitive.html')

@app.route('/empty-relation')
def view_empty(): return render_template('empty.html')

@app.route('/universal-relation')
def view_universal(): return render_template('universal.html')

@app.route('/identity-relation')
def view_identity(): return render_template('identity.html')

@app.route('/inverse-relation')
def view_inverse(): return render_template('inverse.html')

@app.route('/equivalence')
def view_equivalence(): return render_template('equivalence.html')

@app.route('/partial-order')
@app.route('/partial_order')
def view_partial_order(): return render_template('partial_order.html')

# --- 6. SERVER START ---
if __name__ == '__main__':
    app.run(debug=True)