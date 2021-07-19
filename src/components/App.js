import React, { useEffect, useState } from "react";

function App() {
  const [dogs, setDogs] = useState([])
  const [activeDog, setActiveDog] = useState({})
  const [goodDogFilter, setGoodDogFilter] = useState(false)
  const dogsURL = "http://localhost:3001/pups"

  useEffect(() => {
    fetch(dogsURL)
      .then(resp => resp.json())
      .then(data => setDogs(data))
  }, [])

  const handleDogClick = (id) => {
    setActiveDog(dogs.find(dog => id === dog.id))
  }

  const handleUpdateIsGood = () => {
    const configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        ...activeDog,
        isGoodDog: !activeDog.isGoodDog
      })
    }

    fetch(`${dogsURL}/${activeDog.id}`, configObj)
      .then(resp => resp.json())
      .then(data => {
        const updatedDogs = dogs.map(dog => {
          if (dog.id === activeDog.id) {return data}
          else {return dog}
        })

        setDogs(updatedDogs)
        setActiveDog(data)
      })
  }

  const handleUpdateGoodDogFilter = () => {
    setGoodDogFilter((goodDogFilter) => !goodDogFilter)
  }

  const dogBarItems = dogs.map(dog => {
    if (goodDogFilter === false || dog.isGoodDog === true) {
      return <span key={dog.id} onClick={() => handleDogClick(dog.id)}>{dog.name}</span>
    }
    return null
  })

  return (
    <div className="App">
      <div id="filter-div">
        <button id="good-dog-filter" onClick={handleUpdateGoodDogFilter}>Filter good dogs: {goodDogFilter ? "ON" : "OFF"}</button>
      </div>
      <div id="dog-bar">
        {dogBarItems}
      </div>
      <div id="dog-summary-container">
        <h1>DOGGO:</h1>
        <img src={activeDog.image} alt={activeDog.name} height="400px"/>
        <h2>{activeDog.name}</h2>
        <button onClick={handleUpdateIsGood}>{activeDog.isGoodDog ? "Bad Dog!" : "Good Dog!"}</button>
        <div id="dog-info"></div>
      </div>
    </div>
  );
}

export default App;
