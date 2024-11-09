import React from "react";
import classes from './InputField.module.css';

interface InputFieldProps {
    label: string;
    type: string;
    id: string;
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    type,
    id,
    name,
    value,
    onChange,
    error,
}) => {
    return (
        <div className={classes.container}>
            <label htmlFor={id} className={classes.label}>{label}:</label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={label}
                className={classes.input}
            />
            {error && <p className={classes.errorMsg}>{error}</p>}
        </div>
    );
};

export default InputField;