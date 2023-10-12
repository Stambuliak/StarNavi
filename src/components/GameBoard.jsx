/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import "./GameBoard.scss"
import cn from "classnames";

export const GameBoard = () => {
  const [selectedOption, setSelectedOption] = useState(2);
  const [modes, setModes] = useState([]);
  const [squares, setSquares] = useState([]);
  const [selectedCube, setSelectedCube] = useState([]);
  const [squareList, setSquareList] = useState([]);
  const [optionChosen, setOptionChosen] = useState(false);
  const [isSizeChosen, setIsSizeChosen] = useState(true);

  useEffect(() => {
    fetchData();
    document.documentElement.style.setProperty('--selectedOption', selectedOption);
    generateSquares(selectedOption)
  }, []);

  const handleClear = () => {
    if (selectedCube.length > 0) {
      return true
    } else {
      return false
    }
  }

  const fetchData = () => {
    fetch('https://60816d9073292b0017cdd833.mockapi.io/modes')
      .then((response) => response.json())
      .then((data) => {
        setModes(data);
      })
      .catch((error) => console.error('Error fetching data: ', error));
  };

  const currentPosition = (currentColumn, currentIndex) => {
    let row = Math.ceil(currentIndex / currentColumn)
    let column;

    if ((currentIndex % currentColumn) === 0) {
      column = currentColumn;
    } else {
      column = currentIndex % currentColumn;
    }

    return {row, column}
  }

  const handleAddSquare = (element) => {
    if(squareList.includes(element + 1)) {
      setSquareList((prev) => prev.filter((item) => item !== element + 1))
    } else {
      setSquareList(prev => [...prev, element + 1])
    }
  }

  const handleSelectChange = (event) => {
    const selectedOption = parseInt(event.target.value, 10);
    setOptionChosen(true)
    setIsSizeChosen(false)


    setSelectedOption(selectedOption);
  };

  const start = () => {
    document.documentElement.style.setProperty('--selectedOption', selectedOption);
    generateSquares(selectedOption);
    setOptionChosen(false)
    clear()
  }

  const generateSquares = (selectedOption) => {
    const squares = Array.from({ length: selectedOption * selectedOption }, (_, index) => index);
    setSquares(squares);

    return squares;
  };

  const setSelectedItem = (element) => {
    if (selectedCube.includes(element + 1)) {
      setSelectedCube((prev) => prev.filter((item) => item !== element + 1));
    } else {
      setSelectedCube((prev) => [...prev, element + 1]);
    }
  };

  const clear = () => {
    setSquareList([])
    setOptionChosen(false)
    setSelectedCube([])
  }


  return (
    <div className='page'>
      <div className='page-container'>
        <div className='field-wrapper'>
          <div>
            <select onChange={handleSelectChange} className='select'>
              <option value="0" disabled selected>Select an option</option>
              {modes.map((mode) => (
                <option 
                  key={mode.id} 
                  value={mode.field}
                >
                  {mode.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button 
              onClick={() => {
                start();
                setIsSizeChosen(true);
              }}
              className='start'
              disabled = {!optionChosen}
            >
              Start
            </button>
            <button 
              onClick={clear} 
              className='start clear'
              disabled = {!handleClear()}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="square-grid">
          {squares.map((index) => (
            <div
            >
              <button
               key={index} 
                onClick={() => {
                setSelectedItem(index);
                handleAddSquare(index);
              }}
              disabled = {!isSizeChosen}
              className={cn('square mas', {
                'activeSquare' : selectedCube.includes(index + 1),
              })}>

              </button>
            </div>
          ))}
        </div>
      </div>
      <div className='list-wrapper'>
        <h2 className='title'>Hover Squares</h2>
        <div className='list'>
            {squareList.map((element) => {
              const {row, column} = currentPosition(selectedOption, element);
              return (
                <div className='list-element'>
                <p className='element-title' key={element}>
                  {`row ${row} col ${column}`}
                </p>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  );
};
