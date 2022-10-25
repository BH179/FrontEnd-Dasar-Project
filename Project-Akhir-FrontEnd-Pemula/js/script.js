const books = [],
RENDER_EVENT = 'render-books',
SAVED_EVENT = 'saved-books',
STORAGE_KEY = 'Dicoding-Bookshelf-BryanHugo';


document.addEventListener('DOMContentLoaded',function(){

  const Submission = document.getElementById("inputBook");
  const searchSubmit = document.getElementById("searchBook");

  Submission.addEventListener('submit', function(event){
    event.preventDefault();
    addBooks();
  });
  
  searchSubmit.addEventListener('submit',function(event){
    event.preventDefault();
    searchEngine();
  });

  if (checkStorage()) {
    loadDataFromStorage();
  };
});



document.addEventListener(RENDER_EVENT,function(){
  const unreadedBook = document.getElementById('UnReadbooks');
  const readedBook = document.getElementById('completed-books');

  unreadedBook.innerHTML = '';
  readedBook.innerHTML = '';


  for(const myBook of books){
    const readMyBook = readBooks(myBook);
    if(!myBook.isCompleted){
      unreadedBook.append(readMyBook);
   }else{
      readedBook.append(readMyBook);
  }
  }
})

document.addEventListener('change',function(){
  const textbox = document.getElementById("bookSubmit");
  if (checkboxer()){
    textbox.innerHTML = "<strong>Buku Sudah dibaca!</strong> Masukkan ke Rak Buku Selesai";
   
  }else {  
    textbox.innerHTML = "Masukkan Buku ke rak <strong>Belum selesai dibaca<strong>"; 
  }
})



document.addEventListener(SAVED_EVENT, function () {
  var pesan=localStorage.getItem(STORAGE_KEY);
  console.log(localStorage.getItem(STORAGE_KEY));
});

function getBooks(id, title, author, year, isCompleted){
   return{
    id,
    title,
    author,
    year,
    isCompleted
   }
}

function generateID(){  
    return +new Date();
  }


function addBooks(){
    const bookstitle = document.getElementById('inputBookTitle'), 
    writer = document.getElementById('inputBookAuthor'), 
    timeByYear = document.getElementById('inputBookYear'), 
    generatedID = generateID();

    const readingBooks = getBooks(generatedID, bookstitle.value, writer.value, timeByYear.value, checkboxer());
    
    books.unshift(readingBooks);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}



function readBooks(readingBooks){
  const booksName = document.createElement('h3');
  const booksAuthor = document.createElement('p');
  const booksReleased = document.createElement('p');

  booksName.innerText = readingBooks.title;
  booksAuthor.innerText = readingBooks.author;
  booksReleased.innerText = readingBooks.year;

  const textInputBooks = document.createElement('div');
  textInputBooks.classList.add('text');
  textInputBooks.append(booksName, booksAuthor, booksReleased);

  const containerBook = document.createElement('div');
  containerBook.classList.add('item');
  containerBook.append(textInputBooks);
  containerBook.setAttribute('id', `read-${readingBooks.id}`);

  const doneBook = document.createElement('button');
  const undoBook = document.createElement('button');
  const removeBook = document.createElement('button');
  
  undoBook.classList.add('click-button', 'redo-button');
  removeBook.classList.add('click-button', 'remove-button');
  doneBook.classList.add('click-button', 'done-button');
 
  if(!readingBooks.isCompleted){

    doneBook.addEventListener('click',function(){
      finishedBooks(readingBooks.id);
      
    });

    removeBook.addEventListener('click',function(){
      removeBooks(readingBooks.id);
    });

    containerBook.append(doneBook, removeBook);

  }else{
    
    removeBook.addEventListener('click',function(){
      removeBooks(readingBooks.id);
    });
    undoBook.addEventListener('click',function(){
      undoReadedBook(readingBooks.id);
    });

    containerBook.append(undoBook, removeBook);
  }
  
  return containerBook;

}

//function 

function checkboxer(){
  const done = document.getElementById('inputBookIsComplete');
  
  if( done.checked ){
    return true;
  }else {
    return false;  
  };
}




function finishedBooks(booksId){
  const booksToRead = findBook(booksId);

  if(booksToRead == null) return;

  booksToRead.isCompleted = true;
  alert("Yeay, selesai membaca buku!!");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  return booksToRead.isCompleted;
}

function undoReadedBook(booksId){
  const booksToRead = findBook(booksId);

  if(booksToRead == null) return;

  booksToRead.isCompleted = false;
  alert("Ayo, semangat lagi bacanya!");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  return booksToRead.isCompleted;
  
}

function removeBooks(booksId) {
  const booksToRead = findBookIndex(booksId);
 
  if (booksToRead === -1) return;
 
  books.splice(booksToRead, 1);
  alert("Terima kasih sudah membaca aku!");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(booksId){
  for (const myBook of books) {
    if (myBook.id === booksId) {
      return myBook;
    }
  };
  return null;
}

function findBookIndex(booksId) {
  for (const index in books) {
    if (books[index].id === booksId) {
      return index;
    }
  }
  return -1;
}

function searchEngine(){
  const inputSearchBook = document.getElementById('searchBookTitle').value.toUpperCase(),
  displaySearch = document.querySelectorAll('section.book_shelf > .book_list > .book_item > .item');

  for(var word = 0; word<displaySearch.length;word++){
    var textValue = displaySearch[word].textContent || displaySearch[word].innerText;

    if(textValue.toUpperCase().indexOf(inputSearchBook) > -1){
      displaySearch[word].style.display ="";
    } else{
      displaySearch[word].style.display ="none";
    }
  }
}



function checkStorage(){
  if (typeof (Storage) === undefined){
    alert("Mohon maaf browser kamu tidak ada local storage, silahkan ganti browser!");
    return false;
  }
  return true;
}

function saveData(){
  if(checkStorage()){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  
  document.dispatchEvent(new Event(RENDER_EVENT));
  
}