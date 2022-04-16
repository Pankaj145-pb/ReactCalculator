import { useReducer } from 'react';
import React from 'react'
import "./css/style.css"
import DigitButton from './DigitButton';
import OperationButton from './OperationButton'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  DELETE_DIGIT: 'delete-digit',
  CLEAR: 'clear',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate',
}

function reducer(state, {type, payload}) {
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentInput: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.currentInput === "0"){ 
        return state
      }
      if(payload.digit === "." && state.currentInput.includes(".")){
      return state
      }
      return {
        ...state,
        currentInput: `${state.currentInput || ""}${payload.digit}`
      } 

      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite){
          return{
            ...state,
            overwrite:false,
            currentInput: null
          }
        }
        if(state.currentInput === null) return state
        
        if(state.currentInput.length === 1) return{
          ...state,
          currentInput: null
        }

        return{
          ...state,
          currentInput: state.currentInput.slice(0, -1)
        }

      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentInput == null && state.previousInput == null )
        {
          return state;
        }

        if(state.previousInput == null)
        {
          return{
            ...state,
            operation: payload.operation,
            previousInput: state.currentInput,
            currentInput: null
          }
        }
        return{
          ...state,
          previousInput: evaluate(state),
          operation: payload.operation,
          currentInput: null
        }

        case ACTIONS.CLEAR:
        return {}

        case ACTIONS.EVALUATE:
        if(
        state.operation == null ||
        state.currentInput == null ||
        state.previousInput == null
        ) {
          return state
        }
        
        return {
          ...state,
          overwrite: true,
          previousInput: null,
          operation : null,
          currentInput: evaluate(state)
        }

  }
}
function evaluate({currentInput, previousInput, operation}) {
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation) {
    case "+":
      computation = prev + current;
      break
    case "-":
      computation = prev - current;
      break
    case "÷":
      computation = prev / current;
      break
    case "*":
      computation = prev * current;
      break
  }
  return computation.toString()

}

function formatInput(input) {
  if(input == null) return 
  const [integer, decimal] = input.split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
return `${INTEGER_FORMATTER.format(integer)}. ${decimal}`
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function App() {
  const [{currentInput, previousInput, operation}, dispatch] = useReducer(reducer, {});
  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-input'>{formatInput(previousInput)}{operation}</div>
        <div className='current-input'>{formatInput(currentInput)}</div>
      </div>
      <button className='span-two' onClick = {() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button className='span-one' onClick={() => dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation= "÷" dispatch = {dispatch} />
      <DigitButton digit= "1" dispatch = {dispatch} />
      <DigitButton digit= "2" dispatch = {dispatch} />
      <DigitButton digit= "3" dispatch = {dispatch} />
      <OperationButton operation= "*" dispatch = {dispatch} />
      <DigitButton digit= "4" dispatch = {dispatch} />
      <DigitButton digit= "5" dispatch = {dispatch} />
      <DigitButton digit= "6" dispatch = {dispatch} />
      <OperationButton operation= "+" dispatch = {dispatch} />
      <DigitButton digit= "7" dispatch = {dispatch} />
      <DigitButton digit= "8" dispatch = {dispatch} />
      <DigitButton digit= "9" dispatch = {dispatch} />
      <OperationButton operation= "-" dispatch = {dispatch} />
      <DigitButton digit= "." dispatch = {dispatch} />
      <DigitButton digit= "0" dispatch = {dispatch} />
      <button className='span-two'  onClick = {() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App