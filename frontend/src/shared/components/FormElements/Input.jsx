import React ,{useReducer, useEffect }from "react";
import { validate } from "../../utils/validators";
import "./Input.css";
const inputReducer = (state,action) =>{
    switch(action.type){
        case 'CHANGE':
            return {
                ...state,
                value:action.val,
                isValid: validate(action.val,action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched:true
            }
        default:
            return state;
    }
}
const Input = props =>{
    const [inputState,dispatch]=useReducer(inputReducer,
        {value:props.value||'',
        isValid:props.valid||false,
        isTouched:false});

    const ChangeHandler = event =>{
        dispatch({type:'CHANGE',val:event.target.value,validators:props.validators});

};
const {id,onInput}=props;
const {value,isValid}=inputState;

useEffect(()=>{
    props.onInput(id,value,isValid)

},[id,value,isValid,onInput]);


const touchHandler= () =>{
    dispatch({
        type:'TOUCH'
    })
}
const element=props.element ==='input' ? 
<input id={props.id} placeholder={props.placeholder} rows={props.rows||3} onChange={ChangeHandler} value={inputState.value}
onBlur={touchHandler} /> 
:<textarea id={props.id} placeholder={props.placeholder} onChange={ChangeHandler} value={inputState.value} onBlur={touchHandler}/>



    return (    
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && `form-control--invalid`}`}>
        <label htmlFor={props.id}>{props.label}</label>
    {element}
    {!inputState.isValid && inputState.isTouched &&<p>{props.errorText}</p >}
    </div>
    );


}
export default Input;