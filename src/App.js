import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Import your custom CSS file
import { marked } from "marked";
function App() {
  const placeHolder = "# Welcome to my React Markdown Previewer!\n\n## This is a sub-heading...\n\n### And here's some other cool stuff:\n\nHeres some code, `<div></div>`, between 2 backticks.\n\n```\n// this is multi-line code:\n\nfunction anotherExample(firstLine, lastLine) {\n  if (firstLine == '```' && lastLine == '```') {\n    return multiLineCode;\n  }\n}\n```\n\nYou can also make text **bold**... whoa!\nOr _italic_.\nOr... wait for it... **_both!_**\nAnd feel free to go crazy ~~crossing stuff out~~.\n\nThere's also [links](https://www.freecodecamp.org), and\n\n> Block Quotes!";

  const [input, setInputValue] = useState(placeHolder);
  const [preview, setPreview] = useState('');
  const inputRef = useRef(null); // Ref to access textarea DOM node
  const historyRef = useRef([]); // Ref to store input history
  const redoHistoryRef = useRef([]); // Ref to store redo history


  useEffect(() => {
    try {
      const convertedMarkdown = marked(input);
      setPreview(convertedMarkdown);
    } catch (error) {
      console.error('Error converting markdown:', error);
      setPreview('');
    }
  }, [input]);
 
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    // Push current input value to history
    historyRef.current.push(newValue.slice());
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handelEnter(event);
    }
    else if (event.ctrlKey && event.key === "z" && !event.shiftKey) {
      handelUndo(event);
    }
    else if (event.ctrlKey && event.shiftKey && event.key === "z") {
      handelRedo(event);
    }
  };
  const handelEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default behavior of Enter key
      const { selectionStart, selectionEnd } = event.target;
      const newValue =
        input.substring(0, selectionStart) +
        '\n' +
        input.substring(selectionEnd);
      const newCursorPosition = selectionStart + 1;
      setInputValue(newValue);
      setTimeout(() => {
        event.target.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  }
  const handelRedo = (event) => {
    if (event.shiftKey && event.ctrlKey && event.key === "z") {
      event.preventDefault();
      if (redoHistoryRef.current.length > 0) {
        const nextInput = redoHistoryRef.current.pop();
        historyRef.current.push(input);
        setInputValue(nextInput)
      }

    }
  }
  const handelUndo = (event) => {
    if ((event.ctrlKey && event.key === 'z')) {
      event.preventDefault(); // Prevent the default behavior of Ctrl + Z
      if (historyRef.current.length > 0) {
        const previousInput = historyRef.current.pop();
        redoHistoryRef.current.push(input)
        setInputValue(previousInput);
      }
    }
  };
  const redo = () => {
    if (redoHistoryRef.current.length > 0) {
      const nextInput = redoHistoryRef.current.pop();
      historyRef.current.push(input); 
      setInputValue(nextInput); 
    }
  };

  const undo = () => {
    if (historyRef.current.length > 0) {
      const previousInput = historyRef.current.pop();
      redoHistoryRef.current.push(input);
      setInputValue(previousInput); 
    }
  }
  const clear = () => {
    setInputValue('');
    setPreview('');
  };
 

  return (
    <div className='APP'>
      <nav className="navbar navbar-dark navbar-color fixed-top" style={{height:"60px"}}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1" style={{ float: "left" }}>
            <img src="/preview-high-resolution-logo-white-transparent.png" alt="Logo" width="50" height="47" class="d-inline-block align-text-top " style={{marginRight:"12px",marginBottom:"10px",marginTop:"-5px"}} />
            Markdown Previewer
          </span>
        </div>
      </nav>
      <div className="container-fluid" style={{ height: '100vh' }}>
        <nav class="navbar navbar-light bar fixed-top" style={{ top: '59px' }}>
          <form class="form-inline">
            <button className="btn btn-secondary btn-sm btn1" type="button" onClick={undo}>
              <i className="bi bi-arrow-counterclockwise"></i> Undo
            </button>
            <button className="btn btn-secondary btn-sm btn2" type="button" onClick={redo}><i class="bi bi-arrow-clockwise"></i> Redo</button>
            <button className="btn btn-secondary btn-sm btn3" type="button" onClick={clear}><i class="bi-trash3-fill"></i> Delete</button>
          </form>
        </nav>
        <div className="row no-gutters">
          <div className="col-md-6" style={{ height: '100%' }}>
            <div className='text' >
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                id='editor'
                className='form-control'
                style={{ marginTop: '101px'}}
                
              ></textarea>
            </div>
          </div>
          <div className="col-md-6" style={{ height: '100%' }}>
            <div id='preview' dangerouslySetInnerHTML={{ __html: preview }} style={{marginTop: '104px' }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
