import React, { useState } from 'react';
import './DistanceForm.css';

const TRANSPORT_OPTIONS = [
    'car',
    'bike',
    'bus',
    'airplane',
    'helicopter',
    'walk',
];

const DistanceForm = () => {
    const [distance, setDistance] = useState('');
    const [transportType, setTransportType] = useState('car');
    const [trees, setTrees] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const km = parseInt(distance, 10);
        if (Number.isNaN(km) || km < 0) {
            alert('Por favor insira um número inteiro válido (KM).');
            return;
        }
        // cálculo simples de emissões (g CO2 por passageiro-km, estimativas genéricas)
        const EMISSION_FACTORS = {
            car: 192,
            bike: 0,
            bus: 105,
            airplane: 255,
            helicopter: 500,
            walk: 0,
        };

        const factor = EMISSION_FACTORS[transportType] ?? 0;
        const grams = km * factor;
        const kg = grams / 1000;

        // cálculo de tempo de compensação por árvores (anos, meses, dias)
        const treesCount = parseInt(trees, 10);
        const ABSORPTION_PER_TREE_KG_PER_YEAR = 21.77; // média em kg CO2 por árvore/ano
        let compensation = null;
        if (!Number.isNaN(treesCount) && treesCount > 0) {
            const totalAbsorptionPerYear = treesCount * ABSORPTION_PER_TREE_KG_PER_YEAR;
            const yearsEquivalent = kg / totalAbsorptionPerYear; // anos (decimal)
            const totalDays = yearsEquivalent * 365;

            const yearsFloor = Math.floor(totalDays / 365);
            const remainingAfterYears = totalDays - yearsFloor * 365;
            const months = Math.floor(remainingAfterYears / 30);
            const days = Math.round(remainingAfterYears - months * 30);

            compensation = { years: yearsEquivalent, yearsFloor, months, days, totalDays, treesCount };
        }

        setResult({ km, transportType, grams, kg, trees: trees || 0, compensation });
    };

    return (
        <form className="distance-form" onSubmit={handleSubmit}>
            <div className="field">
                <label className="label" htmlFor="distance">Distância (KM)</label>
                <input
                    className="input"
                    type="number"
                    id="distance"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    required
                />
            </div>

            <div className="field">
                <label className="label" htmlFor="transport">Tipo de transporte</label>
                <select
                    className="select"
                    id="transport"
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                >
                    {TRANSPORT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div className="field">
                <label className="label" htmlFor="trees">Quantidade de árvores</label>
                <input
                    className="input"
                    type="number"
                    id="trees"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={trees}
                    onChange={(e) => setTrees(e.target.value)}
                    placeholder="Ex: 10"
                />
            </div>

            <button className="submit-btn" type="submit">Calcular</button>

            {result && (
                <div className="result" aria-live="polite">
                    <div className="result-header">
                        <span className="emoji">{getEmoji(result.transportType, result.kg)}</span>
                        <strong className="result-value">{result.kg.toFixed(2)} kg CO₂</strong>
                        <span className="result-sub"> em {result.km} km ({capitalize(result.transportType)})</span>
                    </div>

                    <div className="emission-bar" title={`${Math.round(result.grams)} g CO2`}>
                        <div
                            className={`emission-fill ${emissionClass(result.kg)}`}
                            style={{ width: `${Math.min(result.kg * 4, 100)}%` }}
                        />
                    </div>
                    {result.compensation ? (
                        <div className="comp-time">
                            {result.compensation.totalDays < 1 ? (
                                <strong>Compensado quase instantaneamente! ✨</strong>
                            ) : (
                                <>
                                    Compensação estimada em <strong>
                                        {result.compensation.yearsFloor > 0 && `${result.compensation.yearsFloor} ano${result.compensation.yearsFloor > 1 ? 's' : ''} `}
                                        {result.compensation.months > 0 && `${result.compensation.months} mes${result.compensation.months > 1 ? 'es' : ''} `}
                                        {result.compensation.days > 0 && `${result.compensation.days} dia${result.compensation.days > 1 ? 's' : ''}`}
                                    </strong>
                                </>
                            )}
                            <small>Com {result.compensation.treesCount} árvore(s) absorvendo ~21.77 kg CO₂/ano cada</small>
                        </div>
                    ) : (
                        <div className="comp-time">
                            <small>Insira a quantidade de árvores para estimar o tempo de compensação</small>
                        </div>
                    )}
                </div>
            )}
        </form>
    );
};

export default DistanceForm;

function emissionClass(kg) {
    if (kg <= 0.5) return 'low';
    if (kg <= 5) return 'medium';
    return 'high';
}

function getEmoji(transport, kg) {
    if (transport === 'bike' || transport === 'walk') return '🚶‍♂️';
    if (transport === 'bus') return '🚌';
    if (transport === 'car') return kg > 5 ? '🚗💨' : '🚗';
    if (transport === 'airplane') return '✈️';
    if (transport === 'helicopter') return '🚁';
    return '🔍';
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}