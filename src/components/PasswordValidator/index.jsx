import React from 'react';
import './style.css';

const PasswordValidator = ({ password, show }) => {
    if (!show) return null;

    // Caracteres especiais aceitos pelo back-end (sem o #)
    // eslint-disable-next-line no-useless-escape
    const specialCharsRegex = /[!@$%^&*()_+\-=\[\]{}|;':"\\,.<>\/?]/;
    
    const validations = [
        {
            test: password.length >= 8,
            message: '8+ caracteres'
        },
        {
            test: /[A-Z]/.test(password),
            message: 'Maiúscula'
        },
        {
            test: /[a-z]/.test(password),
            message: 'Minúscula'
        },
        {
            test: /[0-9]/.test(password),
            message: 'Número'
        },
        {
            test: specialCharsRegex.test(password),
            message: 'Especial (!@$%...)'
        }
    ];

    const allValid = validations.every(v => v.test);

    return (
        <div className="password-validator">
            <p className="validator-title">Requisitos da senha:</p>
            <div className="validator-grid">
                {validations.map((validation, index) => (
                    <div 
                        key={index} 
                        className={`validator-item ${validation.test ? 'valid' : 'invalid'}`}
                    >
                        <span className="validator-icon">
                            {validation.test ? '✓' : '○'}
                        </span>
                        <span className="validator-text">{validation.message}</span>
                    </div>
                ))}
            </div>
            <div className="validator-note">
                <span className="note-label">Especiais aceitos:</span>
                <span className="note-chars">! @ $ % & * _ -</span>
            </div>
            {allValid && (
                <p className="validator-success">✓ Senha forte!</p>
            )}
        </div>
    );
};

export default PasswordValidator;
