import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Footer from './layout/Footer';

function App() {
    const [apiResults, setApiResults] = useState([]);
    const [myMusic, setMyMusic] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMusic, setNewMusic] = useState({ title: '', artist: '', songUrl: '', imageUrl: '' });
    const audioRef = useRef(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const allMusic = [...apiResults, ...myMusic];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allMusic.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allMusic.length / itemsPerPage);

    // 1. Поиск в iTunes
    const handleSearch = async (e) => {
        e.preventDefault();
        setCurrentPage(1);
        const encoded = encodeURIComponent(searchTerm);
        const res = await axios.get(`https://itunes.apple.com/search?term=${encoded}&entity=song&limit=10`);
        setApiResults(res.data.results.map(item => ({
            id: item.trackId,
            title: item.trackName,
            artist: item.artistName,
            songUrl: item.previewUrl,
            imageUrl: item.artworkUrl100 // Получаем ссылку на картинку из API
        })));
    };

    // 2. Добавление своей музыки
    const handleAddManual = (e) => {
        e.preventDefault();
        setMyMusic([...myMusic, { ...newMusic, id: Date.now() }]);
        setNewMusic({ title: '', artist: '', songUrl: '', imageUrl: '' });
    };

    const playSong = (url) => {
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play();
        }
    };

    return (
        <div className="App">
            <main>
              <h1>Music discovery world</h1>
              {/* Блок поиска */}
              <form onSubmit={handleSearch}>
                  <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search iTunes..." />
                  <button type="submit" style={{backgroundColor:'#B0C4DE', borderRadius: "7px"}}>Search</button>
              </form>
              {/* Блок ручного добавления */}
              <form onSubmit={handleAddManual}>
                  <input placeholder="Title" value={newMusic.title} onChange={e => setNewMusic({...newMusic, title: e.target.value})} />
                  <input placeholder="Artist" value={newMusic.artist} onChange={e => setNewMusic({...newMusic, artist: e.target.value})} />
                  <input placeholder="Song URL" value={newMusic.songUrl} onChange={e => setNewMusic({...newMusic, songUrl: e.target.value})} />
                  <input placeholder="Image URL" value={newMusic.imageUrl} onChange={e => setNewMusic({...newMusic, imageUrl: e.target.value})} />
                  <button type="submit" style={{backgroundColor:'#B0C4DE', borderRadius: "7px"}}>Add to my library</button>
              </form>
              <audio ref={audioRef} controls style={{marginTop: '20px', width: '100%'}} />
              
              {/* Блок пагинации */}
              {allMusic.length > itemsPerPage && (
                  <div className="pagination" style={{ margin: '20px 0' }}>
                      <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              style={{width: '100px' , backgroundColor: '#D8BFD8', borderRadius:'7px'}}
                      >
              Назад
                      </button>
                      
                      <span style={{ margin: '0 15px' }}>
              Страница <b>{currentPage}</b> из <b>{totalPages}</b>
                      </span>
                      
                      <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              style={{width: '100px' , backgroundColor: '#D8BFD8', borderRadius:'7px'}}
                      >
              Вперед
                      </button>
                  </div>
              )}
              <div className="music-list">
                    {currentItems.map((music, index) => (
                      <div className="music-item" key={music.id || index} style={{ flexBasis: '300px',
                              margin: '20px',
                              boxShadow: '1px 1px 4px 2px #8FBC8F',
                              padding: '10px 20px',
                              backgroundColor: '#F0F8FF',
                              borderRadius: '10px'}}>
                  {music.imageUrl && (
                  <img src={music.imageUrl} alt={music.title} style={{ width: '80px', height: '80px' }} />
              )}
              <h3>{music.title}</h3>
              <p>{music.artist}</p>
              <button onClick={() => playSong(music.songUrl)} style={{width: '100px' , backgroundColor: '#66CDAA', borderRadius:'7px'}}>Слушать</button>
                              </div>
                      ))}
                        </div>
            </main>
            <Footer />
            </div>
    );
}

export default App;