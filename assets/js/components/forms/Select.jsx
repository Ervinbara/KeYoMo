import React from 'react';

const Select = (props) => {
    return (    
    <div className="form-group"><label htmlFor={props.name}>{props.label}</label>
        <select 
        onChange={props.onChange} name={props.name} id={props.name} 
        value={props.value} 
        className={"form-control" + (props.error && " is-invalid")}
        >
        {props.children}
        </select>
        <p className="invalid-feedback">{props.error}</p>
    </div>
     );
};
 
export default Select;