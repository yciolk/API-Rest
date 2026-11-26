// fetch 1 recette

fetch('https://dummyjson.com/recipes/3')
.then(res => res.json())
.then(console.log);

// fetch les 5 meilleures recettes

fetch('https://dummyjson.com/recipes?sortBy=rating&order=desc&limit=5')
.then(res => res.json())
.then(console.log);

// ajouter une recette

fetch('https://dummyjson.com/recipes/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Cream puff'
  })
})
.then(res => res.json())
.then(console.log);

// supprimer une recette

fetch('https://dummyjson.com/recipes/search?q=Cream_puff', {
  method: 'DELETE'
})
.then(res => res.json())
.then(console.log);

// modifier le nom, les ingredients et la difficulte d'une recette 

fetch('https://dummyjson.com/recipes/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: ''
  })
})
.then(res => res.json())
.then(console.log);